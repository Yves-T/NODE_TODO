(function () {
    'use strict';

    angular
        .module('todoApp')
        .factory('TodoService', [
            '$http',
            function ($http) {

                var todoService = {};

                todoService.getTodos = function (listId, success, error) {
                    $http.get('/list/' + listId + '/todos').success(success).error(error);
                };

                todoService.addTodo = function (todo, listId, success, error) {
                    $http.post('/list/' + listId + '/todos', todo).success(success).error(error);
                };

                todoService.updateTodo = function (todo, listId, success, error) {
                    $http.put('/list/' + listId + '/todos/' + todo.id, todo).success(success).error(error);
                };

                todoService.removeTodo = function (todo, listId, success, error) {
                    $http.delete('/list/' + listId + '/todos/' + todo.id, todo).success(success).error(error);
                };

                return todoService;

            }
        ]);

})();
