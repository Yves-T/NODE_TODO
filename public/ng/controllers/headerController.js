(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('HeaderController', [
            '$auth',
            '$state',
            '$rootScope',
            function ($auth, $state, $rootScope) {

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
                }

            }]);

})();