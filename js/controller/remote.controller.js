(function(){
  'use strict';
  angular
    .module('app')
    .controller('RemoteController', RemoteController);

    RemoteController.$inject = ['$location', '$cookies', 'FlashService', 'ConnectionService'];
    function RemoteController($location, $cookies, FlashService, ConnectionService){
      var vm = this;
      vm.title = "P!";
      // vm.action = action;
      vm.status = {};
      vm.album_art = $cookies.get('base_url')+'album_art';
      vm.next = next;
      vm.pause = pause;
      vm.previous = previous;
      vm.volume_up = volume_up;
      vm.volume_down = volume_down;
      vm.volume_mute = volume_mute;
      vm.play_pause = 'pause';
      vm.nav_content = "glyphicon glyphicon-refresh";
      vm.queue_length = "0";
      vm.check_queue = "ok-sign";
      vm.check_session = "ok-sign";
      (function initController() {
        // reset login status
          updateStatus();
      })();

      function updateStatus(){
        ConnectionService.Status($cookies.get('base_url')).then(function(response){
          vm.status = response.return.status;
          
          if(vm.status.session === undefined || vm.status.session.playlist_length === "0" ){
            $location.path('/daemon');
          }
          vm.queue_length = vm.status.session.playlist_length;
          // For Music and Eject
          if(vm.status.session === undefined){
            vm.check_session = "remove-sign";
          } else {
            vm.check_session = "ok-sign";
          }
          
          if (vm.queue_length !== "0"){
            vm.check_queue = "ok-sign";
          } else {
            vm.check_queue = "remove-sign";
          }
          
          
          // else if(vm.status.session !== undefined && vm.status.session.playlist_length === "0") {
          //   vm.check_queue = 'remove-sign';
          //   vm.check_session = 'ok-sign';
          // } else if(vm.status.session === undefined && vm.status.session.playlist_length !== "0"){
          //   vm.check_session = 'remove-sign';
          //   vm.check_queue = 'ok-sign';
          // } else {
          //   vm.check_queue ='remove-sign';
          //   vm.check_session = 'remove-sign';
          // }
          vm.album_art = $cookies.get('base_url')+'album_art?'+Math.random();
          vm.volume_level = parseFloat(vm.status.session.volume) * 100;
          if(vm.volume_level === 0){
            vm.mute = 'btn-danger';
          } else {
            vm.mute = '';
          }
          if (vm.status.session.speed == '0%'){
            vm.play_pause = 'play';
          } else {
            vm.play_pause = 'pause';
          }
          
        });
      }
      function action(act, vol_param) {
        ConnectionService.Action($cookies.get('base_url'), {token: $cookies.get('token'), action: act, volume: vol_param})
          .then(function(response){
            if(response.ok){
              updateStatus();
            }
          });
      }

      function next(){
        action('next','');
      }
      function pause(){
        action('pause', '');
      }
      function previous(){
        action('previous', '');
      }
      function volume_up(){
        vm.past_volume_level = vm.volume_level;
        action('volume',(vm.volume_level + 10)/100);
      }
      function volume_down(){
        vm.past_volume_level = vm.volume_level;
        if (vm.volume_level >=10){
          action('volume', (vm.volume_level -10)/100);
        }
      }
      function volume_mute(){
        if (vm.mute != 'btn-danger'){
          vm.past_volume_level = vm.volume_level;
          vm.mute = 'btn-danger';
          action('volume', 0);
        } else {
          vm.volume_level = vm.past_volume_level;
          vm.mute = '';
          action('volume', (vm.volume_level)/100);
        }
      }
    }
})();
