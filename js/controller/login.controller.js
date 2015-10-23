(function(){
  'use strict';
  angular
    .module('app')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$cookies', 'FlashService', 'ConnectionService'];
    function LoginController($location, $cookies, FlashService, ConnectionService){
      var vm = this;
      vm.title = "Login";
      // vm.base_url = $cookies.get('base_url');
      vm.login = login;
      vm.display_status = "none";
      
      (function initController() {
        // reset login status
          if($cookies.get('base_url') === undefined){
            $location.path('/');
          }
          if($cookies.get('token') !== undefined){
            $location.path('/daemon');
          }
      })();


      function login(){
        vm.dataLoading = true;
        ConnectionService.GetToken($cookies.get('base_url'), vm.username, vm.password).then(function(response){
          if(response.ok){
            $cookies.put('token', response.token);
            $location.path('/daemon');
          } else {
            FlashService.Error(response.message);
            vm.dataLoading = false;
          }
        });
      }
    }
})();
