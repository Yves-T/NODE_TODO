(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('ResetController', [
            'UserService',
            'ParameterService',
            function (UserService, ParameterService) {
                var vm = this;
                vm.showForm = false;
                var token = ParameterService.getParameterByName('token');

                if (!token) {
                    vm.resetError = true;
                    vm.resetErrorText = "This link is not valid."
                } else {
                    UserService.checkResetToken(token, function (response) {
                        vm.showForm = true;
                    }, function (error) {
                        console.error(error);
                        vm.resetError = true;
                        vm.resetErrorText = error.error;
                    });
                }

                vm.updatePassword = function () {
                    UserService.updatePassword(token, vm.formData.password, function (response) {
                        vm.restOK = true;
                        vm.resetError = false;
                        vm.showForm = false;
                    }, function (error) {
                        vm.restOK = false;
                        vm.resetError = true;
                        vm.resetErrorText = error.error;
                        vm.showForm = false;
                        console.log(error);
                    });
                };


            }]);
})();
