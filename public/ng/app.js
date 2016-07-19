(function () {

    'use strict';

    angular
        .module('todoApp', ['ui.router', 'satellizer'])
        .config(function ($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide) {

            function redirectWhenLoggedOut($q, $injector) {

                return {

                    responseError: function (rejection) {

                        // Need to use $injector.get to bring in $state or else we get
                        // a circular dependency error
                        var $state = $injector.get('$state');

                        // check for the specific rejection
                        // reasons to tell us if we need to redirect to the login state
                        var rejectionReasons = ['Unauthorized'];

                        // Loop through each rejection reason and redirect to the login
                        // state if one is encountered
                        angular.forEach(rejectionReasons, function (value, key) {
                            console.log(rejection.data);
                            if (rejection.data === value) {

                                // If we get a rejection corresponding to one of the reasons
                                // in our array, we know we need to authenticate the user so
                                // we can remove the current user from local storage
                                localStorage.removeItem('user');

                                // Send the user to the auth state so they can login
                                $state.go('login');
                            }
                        });

                        return $q.reject(rejection);
                    }
                }
            }

            // Setup for the $httpInterceptor
            $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

            // Push the new factory onto the $http interceptor array
            $httpProvider.interceptors.push('redirectWhenLoggedOut');

            // Satellizer configuration that specifies which API
            // route the JWT should be retrieved from
            $authProvider.loginUrl = '/users/login';

            $authProvider.authHeader = 'authorization';

            $authProvider.authToken = 'JWT';

            // Redirect to the auth state if any other states
            // are requested other than users
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: '/ng/views/homeView.html',
                    controller: 'HomeController as home'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: '/ng/views/loginView.html',
                    controller: 'LoginController as login'
                })
                .state('todos', {
                    url: '/todos',
                    templateUrl: '/ng/views/todoView.html',
                    controller: 'TodoController as todo'
                });
        });
})();