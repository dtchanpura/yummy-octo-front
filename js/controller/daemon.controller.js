(function(){
  'use strict';
  angular.module('app')
  .controller('DaemonController', DaemonController);
  
  DaemonController.$inject = ['$location', '$cookies', 'FlashService', 'ConnectionService'];
  
  function DaemonController($location, $cookies, FlashService, ConnectionService){
    var vm = this;
    vm.title = "Daemon Status";
    vm.status = {};
    vm.music = 'btn-danger';
    vm.queue = 'btn-danger';
    vm.queue_f = queue_f;
    vm.remote = remote;
    (function initController(){
      updateStatus();
    })();

    function updateStatus(){
        ConnectionService.Status($cookies.get('base_url')).then(function(response){
          if(response.ok){
            vm.status = response.return.status;
            if(typeof vm.status.session !== 'undefined' && vm.status.session.playlist_length !== "0"){
              $location.path('/remote');
            } else if(typeof vm.status.session !== 'undefined' && vm.status.session.playlist_length === "0") {
              vm.queue = 'btn-danger';
              vm.music = 'btn-success';
            } else if(typeof vm.status.session === 'undefined' && vm.status.session.playlist_length !== "0"){
              vm.music = 'btn-danger';
              vm.queue = 'btn-success';
            } else {
              vm.queue = 'btn-danger';
              vm.music = 'btn-danger';
            }
          }
        });
    }
    function queue_f(){
      ConnectionService.Queue($cookies.get('base_url'), {token: $cookies.get('token'), path: '~/Music'}).then(function(response){
        if(response.ok){
          updateStatus();
        }
      });
    }
    function remote(){
      ConnectionService.StartDaemon($cookies.get('base_url'), {token: $cookies.get('token')}).then(function(response){
        if(response.ok){
          updateStatus();
        }
      });
    }
  }
})();
