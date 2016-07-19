(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('SignUpController', [
            '$auth',
            function ($auth) {
                var vm = this;
                vm.showForm = true;
                vm.signUp = function () {

                    var credentials = {
                        email: vm.email,
                        password: vm.password
                    };


                    $auth.signup(credentials).then(function () {
                        vm.loginError = false;
                        vm.showSuccess = true;
                        vm.showForm = false;
                    }, function (error) {
                        console.error(error);
                        vm.showSuccess = false;
                        var errors = error.data.errors;
                        vm.errorMessages = errors.map(function (errorItem) {
                            if (errorItem.path == 'email' && errorItem.type == 'unique violation') {
                                return 'Email already in use!';
                            }
                        });
                        vm.loginError = true;
                        if (error.status == 401) {
                            vm.loginErrorText = "Username or password is invalid.";
                        }

                    });
                }

            }]);
})();
