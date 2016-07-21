(function () {

    'use strict';

    angular
        .module('todoApp')
        .controller('HelpController', [
            '$uibModalInstance',
            function ($uibModalInstance) {

                var vm = this;

                vm.ok = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]);

})();
