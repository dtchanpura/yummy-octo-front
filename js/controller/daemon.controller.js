(function(){
  'use strict';
  angular.module('app')
  .controller('DaemonController', DaemonController);

  DaemonController.$inject = ['$location', '$cookies', 'FlashService', 'ConnectionService'];

  function DaemonController($location, $cookies, FlashService, ConnectionService){
    var vm = this;
    vm.title = "Daemon Status";
    vm.status = {};
    // vm.queue_f = queue_f;
    vm.remote = remote;
    (function initController(){
      updateStatus();
    })();

    function updateStatus(){
      vm.dataLoading = true;
        ConnectionService.Status($cookies.get('base_url')).then(function(response){
          if(response !== undefined && response.ok){
            vm.dataLoading = false;
            vm.status = response.return.status;
            if(vm.status.session !== undefined){
                $location.path('/remote');
            } else {
              vm.music = 'btn-danger';
            }
          } else {
            FlashService.Error('Error has Occured while connecting to host. Try again or change the host by going back.')
          }
        });
    }

    function goBack(){
      $location.path('/');
      $cookies.remove('base_url');
      $cookies.remove('token');
    }
  }
})();
