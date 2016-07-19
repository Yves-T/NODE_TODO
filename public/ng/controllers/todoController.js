(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('TodoController', [
            '$auth',
            '$state',
            'TodoService',
            function ($auth, $state, TodoService) {

                var vm = this;

                vm.editedTodo = null;
                vm.originalTodo = null;
                vm.filterOption = 'all';

                getTodos();

                function getTodos() {
                    TodoService.getTodos(function (todos) {
                        vm.todos = todos;
                        updateTodosLeftCounter();
                    }, function (error) {
                        console.error(error);
                    });
                }

                function updateTodosLeftCounter() {
                    var completedTodos = vm.todos.filter(function (todo) {
                        return !todo.completed;
                    });
                    vm.todosLeft = completedTodos.length;
                }

                vm.addTodo = function () {
                    var todo = {
                        description: vm.newTodo
                    };

                    TodoService.addTodo(todo, function (success) {
                        console.log(success);
                        vm.todos.unshift(success);
                    }, function (error) {
                        console.error(error);
                    });
                };

                vm.saveEdits = function (todo, event) {
                    if (vm.reverted) {
                        vm.reverted = null;
                        return;
                    }

                    TodoService.updateTodo(todo, function (success) {
                        vm.editedTodo = null;
                    }, function (error) {
                        vm.editedTodo = null;
                    });
                };

                vm.editTodo = function (todo) {
                    vm.originalTodo = _.extend(vm.originalTodo, todo);
                    vm.editedTodo = todo;
                };

                vm.revertEdits = function (todo) {
                    vm.editedTodo = null;
                    vm.todos[vm.todos.indexOf[todo]] = vm.originalTodo;
                    vm.originalTodo = null;
                    vm.reverted = true;
                };

                vm.toggleCompleted = function (todo) {
                    TodoService.updateTodo(todo, function (success) {
                        updateTodosLeftCounter();
                    }, function (error) {
                        console.error(error);
                    });
                };

                vm.removeTodo = function (todo) {
                    TodoService.removeTodo(todo, function (success) {
                        vm.todos.splice(vm.todos.indexOf(todo));
                    }, function (error) {
                        console.error(error);
                    });
                };

                vm.setFilter = function (filterOption) {
                    vm.filterOption = filterOption;
                };

            }]);

})();
