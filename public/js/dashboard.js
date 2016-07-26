var socket = io();

var app = angular.module('dashboardApp', []);

app.controller('dashboardController', ['$scope', function ($scope) {
    var vm = this;
    vm.activeUsers = 0;

    socket.on('updated-stats', function (data) {
        $scope.$apply(function () {
            vm.pages = data.pages;
            vm.referrers = data.referrers;
            vm.activeUsers = data.activeUsers;
        });

    });

}]);
