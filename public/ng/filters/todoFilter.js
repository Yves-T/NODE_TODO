(function () {
    'use strict';

    angular
        .module('todoApp')
        .filter('todoFilter', function () {

                return function (input, option) {
                    var out = [];
                    if (!option || option == 'all') {
                        return input;
                    }

                    var direction = option == "completed";

                    angular.forEach(input, function (todo) {
                        if (todo.completed == direction) {
                            out.push(todo);
                        }
                    });

                    return out;
                };

            }
        );

})();
