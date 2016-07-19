(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('TodoController', [
            '$auth',
            '$state',
            'UserService',
            function ($auth, $state, UserService) {

                var vm = this;

                UserService.getAuthenticatedUser().then(function (result) {
                    console.log(result);
                });
            }]);

})();
