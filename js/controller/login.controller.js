(function(){
  'use strict';
  angular
    .module('app')
    .controller('LoginController', LoginController)

    LoginController.$inject = ['$location', '$cookies', 'FlashService', 'ConnectionService'];
    function LoginController($location, $cookies, FlashService, ConnectionService){
      var vm = this;
      vm.title = "Login";
      vm.base_url = $cookies.get('base_url');
      vm.login = login;


      function login(){
        vm.dataLoading = true;
        ConnectionService.GetToken($cookies.get('base_url'), vm.username, vm.password).then(function(response){
          if(response.ok){
            $cookies.put('token', response.token);
            $location.path('/remote');
          } else {
            FlashService.Error(response.message);
            vm.dataLoading = false;
          }
        });
      }
    }
})();
