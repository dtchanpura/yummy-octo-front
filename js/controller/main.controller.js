(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

  MainController.$inject = ['$location', '$cookies', 'FlashService', 'ConnectionService'];
  function MainController($location, $cookies, FlashService, ConnectionService) {
    var vm = this;
    vm.title = "Hello!";
    vm.display_status = "none";
    vm.validate_connection = validate_connection;

    function validate_connection(){
      vm.dataLoading = true;
      var CorsFlag = true;
      ConnectionService.Connect(vm.ip_address, vm.port).then(function(response) {
        if (response !== undefined && response.ok) {
          // console.log('True that');
          $cookies.put('base_url', 'http://'+vm.ip_address+':'+vm.port+'/');
          // $cookies.put('ip_address', vm.ip_address);
          // $cookies.put('port', vm.port);
          CorsFlag = false;
          $location.path('/login');
        } else {
          vm.dataLoading = false;
            FlashService.Error('Connection to the Server failed.');
        }
      });
    }

}}
)
();
