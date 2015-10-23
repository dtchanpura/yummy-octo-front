(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController)

    MainController.$inject = ['$location', '$cookies', 'FlashService', 'ConnectionService']
  function MainController($location, $cookies, FlashService, ConnectionService) {
    var vm = this;
    vm.title = "Hello!";
    vm.validate_connection = validate_connection;

    function validate_connection(){
      vm.dataLoading = true;
      ConnectionService.Connect(vm.ip_address, vm.port).then(function(response) {
        if (response.ok) {
          // console.log('True that');
          $cookies.put('base_url', 'http://'+vm.ip_address+':'+vm.port+'/');
          // $cookies.put('ip_address', vm.ip_address);
          // $cookies.put('port', vm.port);
          vm.dataLoading = false;
          $location.path('/login');
        } else {
          // console.log('False that');
          FlashService.Error(response.message);
          vm.dataLoading = false;
        }
      })
    }

}}
)
();
