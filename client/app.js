var app = angular.module('sencymail', ['ui.router']);
app.run(function ($rootScope, $location, $state) {
    console.log('running ng-app');
    $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams, error) {
            console.log('stateChangeError');
                return $state.go("home");
        });
});

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider) {
        console.log("route providr")

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: "/view/home",
                controller: 'homeController'
            })
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: "/view/login",
                controller: 'loginController'
            })
        $urlRouterProvider.otherwise('/home');
    }]);