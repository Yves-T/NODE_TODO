(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('TodoController', [
            '$auth',
            '$state',
            'TodoService',
            'ListService',
            function ($auth, $state, TodoService, ListService) {

                var vm = this;

                vm.ESCAPE_KEY = 27;

                vm.editedTodo = null;
                vm.originalTodo = null;
                vm.filterOption = 'all';

                vm.editedListItem = null;
                vm.originalListItem = null;
                vm.activeListItem = null;

                ListService.getLists(function (lists) {
                    lists.map(function (item) {
                        shortenListItem(item);
                        return item;
                    });
                    vm.lists = lists;
                    if (lists.length > 0) {
                        vm.showItemsForList(lists[0]);
                    }
                }, function (error) {
                    console.error(error);
                });

                vm.editList = function (list) {
                    vm.originalListItem = _.extend({}, list);
                    vm.editedListItem = list;
                };

                vm.revertListEdits = function (index) {
                    vm.editedListItem = null;
                    vm.lists[index] = vm.originalListItem;
                    vm.originalListItem = null;
                    vm.listReverted = true;
                };

                vm.saveListEdits = function (listItem, event) {
                    if (vm.listReverted) {
                        vm.listReverted = null;
                        return;
                    }

                    ListService.updateList(listItem, function (success) {
                        vm.editedListItem = null;
                        shortenListItem(listItem);
                    }, function (error) {
                        vm.editedListItem = null;
                    });
                };

                vm.removeListItem = function (listItem) {
                    ListService.removeList(listItem, function (success) {
                        vm.lists.splice(vm.lists.indexOf(listItem), 1);
                    }, function (error) {
                        console.error(error);
                    });
                };

                vm.addListItem = function () {
                    var listItem = {
                        title: vm.newListItem,
                    };

                    ListService.addList(listItem, function (listItem) {
                        shortenListItem(listItem);
                        vm.lists.push(listItem);
                        listItem.todoCount = 0;
                        vm.newListItem = '';
                    }, function (error) {
                        console.error(error);
                    });
                };

                vm.showItemsForList = function (listItem) {
                    vm.activeListItem = listItem;
                    TodoService.getTodos(listItem.id, function (todos) {
                        vm.todos = todos;
                        updateTodosLeftCounter();
                    }, function (error) {
                        console.error(error);
                    });
                };

                function updateTodosLeftCounter() {
                    var completedTodos = vm.todos.filter(function (todo) {
                        return !todo.completed;
                    });
                    vm.todosLeft = completedTodos.length;
                }

                vm.addTodo = function () {
                    if (!vm.newTodo) {
                        return;
                    }

                    var todo = {
                        description: vm.newTodo
                    };

                    TodoService.addTodo(todo, vm.activeListItem.id, function (success) {
                        vm.todos.unshift(success);
                        vm.newTodo = '';
                        vm.activeListItem.todoCount++;
                    }, function (error) {
                        console.error(error);
                    });
                };

                vm.saveEdits = function (todo, event) {
                    if (todo.description.length == 0) {
                        vm.revertEdits(vm.todos.indexOf(todo));
                        vm.reverted = null;
                        return;
                    }

                    if (vm.reverted) {
                        vm.reverted = null;
                        return;
                    }

                    TodoService.updateTodo(todo, vm.activeListItem.id, function (success) {
                        vm.editedTodo = null;
                    }, function (error) {
                        vm.editedTodo = null;
                    });
                };

                vm.editTodo = function (todo) {
                    vm.originalTodo = _.extend({}, todo);
                    vm.editedTodo = todo;
                };

                vm.revertEdits = function (index) {
                    vm.editedTodo = null;
                    // duplicate original, otherwise firefox won't update description
                    vm.todos[index] =
                        _.pick(vm.originalTodo, 'description', 'completed', 'id', 'createdAt', 'updatedAt', 'listId');
                    vm.originalTodo = null;
                    vm.reverted = true;
                };

                vm.toggleCompleted = function (todo) {
                    TodoService.updateTodo(todo, vm.activeListItem.id, function (success) {
                        updateTodosLeftCounter();
                    }, function (error) {
                        console.error(error);
                    });
                };

                vm.removeTodo = function (todo) {
                    TodoService.removeTodo(todo, vm.activeListItem.id, function (success) {
                        vm.todos.splice(vm.todos.indexOf(todo), 1);
                        vm.activeListItem.todoCount--;
                    }, function (error) {
                        console.error(error);
                    });
                };

                vm.setFilter = function (filterOption) {
                    vm.filterOption = filterOption;
                };

                function shortenListItem(listItem) {
                    if (listItem.title.length > 15) {
                        listItem.shortDescription = listItem.title.substr(0, 10) + '...';
                    } else {
                        listItem.shortDescription = listItem.title;
                    }

                    return listItem
                }

            }]);

})();
