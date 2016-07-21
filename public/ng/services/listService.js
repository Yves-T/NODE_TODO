(function () {
    'use strict';

    angular
        .module('todoApp')
        .factory('ListService', [
            '$http',
            function ($http) {

                var listService = {};

                listService.getLists = function (success, error) {
                    $http.get('/list').success(success).error(error);
                };

                listService.addList = function (list, success, error) {
                    $http.post('/list', list).success(success).error(error);
                };

                listService.updateList = function (list, success, error) {
                    $http.put('/list/' + list.id, list).success(success).error(error);
                };

                listService.removeList = function (list, success, error) {
                    $http.delete('/list/' + list.id, list).success(success).error(error);
                };

                return listService;

            }
        ]);

})();
