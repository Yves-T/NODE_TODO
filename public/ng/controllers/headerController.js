(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('HeaderController', [
            '$auth',
            '$state',
            '$rootScope',
            '$uibModal',
            function ($auth, $state, $rootScope, $uibModal) {

                var vm = this;

                vm.logout = function () {

                    $auth.logout().then(function () {

                        // Remove the authenticated user from local storage
                        localStorage.removeItem('user');

                        // Flip authenticated to false so that we no longer
                        // show UI elements dependant on the user being logged in
                        $rootScope.authenticated = false;

                        // Remove the current user info from rootscope
                        $rootScope.currentUser = null;

                        $state.go('home', {});
                    });
                };

                vm.showHelp = function () {
                    $uibModal.open({
                        animation: true,
                        templateUrl: '/ng/views/modal.html',
                        controller: 'HelpController as modal',
                        size: 'lg',
                        resolve: {
                            items: function () {

                            }
                        }
                    });
                };

            }]);

})();