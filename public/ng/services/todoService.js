(function () {
    'use strict';

    angular
        .module('todoApp')
        .factory('TodoService', [
            '$http',
            function ($http) {

                var todoService = {};

                todoService.getTodos = function (success, error) {
                    $http.get('/todos').success(success).error(error);
                };

                todoService.addTodo = function (todo, success, error) {
                    $http.post('/todos', todo).success(success).error(error);
                };

                todoService.updateTodo = function (todo, success, error) {
                    $http.put('/todos/' + todo.id, todo).success(success).error(error);
                };

                todoService.removeTodo = function (todo, success, error) {
                    $http.delete('/todos/' + todo.id, todo).success(success).error(error);
                };

                return todoService;

            }
        ]);

})();
