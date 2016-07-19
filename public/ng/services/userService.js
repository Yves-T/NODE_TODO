(function () {
    'use strict';

    angular
        .module('todoApp')
        .factory('UserService', [
            '$http',
            function ($http) {

                var userService = {};

                userService.getAuthenticatedUser = function () {
                    return $http.get('/users/authenticate');
                };

                return userService;

            }
        ]);


})();