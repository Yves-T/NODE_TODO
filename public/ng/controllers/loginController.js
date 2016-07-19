(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('LoginController', [
            '$auth',
            '$state',
            '$rootScope',
            'UserService',
            function ($auth, $state, $rootScope, UserService) {
                console.log('inside login');
                var vm = this;
                vm.login = function () {

                    var credentials = {
                        email: vm.email,
                        password: vm.password
                    };

                    // Use Satellizer's $auth service to login
                    $auth.login(credentials).then(function () {
                        return UserService.getAuthenticatedUser();
                    }, function (error) {
                        console.error(error);
                        vm.loginError = true;
                        if (error.status == 401) {
                            vm.loginErrorText = "Username or password is invalid.";
                        }

                    }).then(function (response) {
                        if (response) {
                            var user = JSON.stringify(response.data);
                            localStorage.setItem('user', user);
                            $rootScope.authenticated = true;
                            $rootScope.currentUser = response.data;
                            $state.go('todos', {});
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }

            }]);
})();