(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('ForgotController', [
            'UserService',
            function (UserService) {
                var vm = this;
                vm.showForm = true;

                vm.resetPassword = function () {
                    UserService.resetPassword(vm.email, function (response) {
                        vm.forgotError = false;
                        vm.showForm = false;
                        vm.restOK = true;
                        vm.forgotSuccessText = "An email has been sent to " + vm.email + " with further instructions."
                    }, function (error) {
                        console.error(error);
                        vm.forgotError = true;
                        vm.forgotErrorText = vm.email + " was not found.";
                        vm.restOK = false;
                    });

                }
            }]);
})();
