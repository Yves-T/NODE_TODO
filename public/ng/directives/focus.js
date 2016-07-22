(function () {
    'use strict';

    angular
        .module('todoApp')
        .directive('todoFocus', ['$timeout', function ($timeout) {
            'use strict';

            return function (scope, elem, attrs) {

                function setCaretAtEnd(elem) {
                    var elementLength = elem.value.length;
                    // For IE Only
                    if (document.selection) {
                        // Set focus
                        elem.focus();
                        // Use IE Ranges
                        var objectSelection = document.selection.createRange();
                        // Reset position to 0 & then set at end
                        objectSelection.moveStart('character', -elementLength);
                        objectSelection.moveStart('character', elementLength);
                        objectSelection.moveEnd('character', 0);
                        objectSelection.select();
                    }
                    else if (elem.selectionStart || elem.selectionStart == '0') {
                        // Firefox/Chrome
                        elem.selectionStart = elementLength;
                        elem.selectionEnd = elementLength;
                        elem.focus();
                    }
                }

                scope.$watch(attrs.todoFocus, function (newVal) {

                    if (newVal) {
                        $timeout(function () {
                            setCaretAtEnd(elem[0]);
                        }, 50, false);
                    }
                });
            };
        }]);
})();
