(function () {
    'use strict';

    angular.module('app', ['ngRoute','ngCookies','ui.bootstrap'])
  .config(config);
  //.run(run);

config.$inject = ['$routeProvider', '$locationProvider'];
function config($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'templates/connection.html',
    controller: 'MainController',
    controllerAs: 'vm'
  })

  .when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  .when('/daemon', {
    templateUrl: 'templates/daemon.html',
    controller: 'DaemonController',
    controllerAs: 'vm'
  })
  .when('/remote', {
    templateUrl: 'templates/remote.html',
    controller: 'RemoteController',
    controllerAs: 'vm'
  })
  .otherwise({ redirectTo: '/'});
}
/*
function run(){
  if($cookies.get('token') != undefined && $cookies.get){
    $location.path('/remote')
  }
  if($cookies.get(''))
}


*/

})();
