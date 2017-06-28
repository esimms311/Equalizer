angular.module('equalizer', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider){

$urlRouterProvider.otherwise('/')

$stateProvider
.state('home', {
  url:'/',
  templateUrl: './templates/home.html',
  controller: 'homeCtrl'
})

$stateProvider
.state('nextweek', {
  url: '/nextweek',
  templateUrl: './templates/nextweek.html',
  controller: 'nextweekCtrl'
})

$stateProvider
.state('previousres', {
  url: '/previous-results',
  templateUrl: './templates/previousres.html',
  controller: 'previousres'
})

})
