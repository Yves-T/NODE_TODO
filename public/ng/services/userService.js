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

                userService.resetPassword = function (email, success, error) {
                    return $http.post('/users/forgot', {email: email}).success(success).error(error);
                };

                userService.checkResetToken = function (token, success, error) {
                    return $http.get('/users/reset/' + token).success(success).error(error);
                };

                userService.updatePassword = function (token, newPassword, success, error) {
                    return $http.post('/users/reset/' + token, {newPassword: newPassword}).success(success).error(error);
                };

                return userService;

            }
        ]);


})();