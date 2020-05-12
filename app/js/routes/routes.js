angular.module('movieApp.routes', [
    'ui.router',
])

.config(function($stateProvider, $urlRouterProvider, $sceProvider, $locationProvider) {
    $sceProvider.enabled(false);
    $urlRouterProvider.otherwise('/');
    
    $stateProvider    
        .state('base', {
            url: '/',
            templateUrl: '/views/home.html',
            controller: 'HomeController',
        })

        .state('moviepage', {
            url: '/movie/:id',
            templateUrl: '/views/movie_page.html',
            controller: 'MoviePageController',
        })

        .state('admin', {
            url: '/admin',
            templateUrl: '/views/admin.html',
            controller: 'adminController',
        });

        $locationProvider.html5Mode(true);
})