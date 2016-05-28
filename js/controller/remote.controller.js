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
      vm.album_art = "https://raw.githubusercontent.com/dtchanpura/yummy-octo-musique/master/flaskapp/static/images/no_album_art.png";
      vm.next = next;
      vm.pause = pause;
      vm.queue_f = queue_f;
      vm.previous = previous;
      vm.volume_up = volume_up;
      vm.volume_down = volume_down;
      vm.volume_mute = volume_mute;
      vm.play_pause = 'pause';
      vm.nav_content = "glyphicon glyphicon-refresh";
      vm.queue_length = "0";
      vm.check_queue = "remove-circle";
      vm.check_session = "flash";
      vm.startDaemon = startDaemon;
      vm.quitSession = quitSession;
      (function initController() {
        // reset login status
          updateStatus();
      })();

      function updateStatus(){
        FlashService.ClearFlashMessage();
        ConnectionService.Status($cookies.get('base_url')).then(function(response){
          updateUI(response)
        });
      }
      function updateUI(response) {
                  if (response.ok && response.return.status !== undefined){
            vm.status = response.return.status;
            vm.daemon = response.daemon;

            if(vm.status.session === undefined || vm.daemon === false){
              FlashService.Error('Seems like daemon session is down. Click on session to start it up.')
              vm.session_down = 'disabled';
              vm.session_up = '';
              //$location.path('/daemon');
            } else {
              vm.download_path = $cookies.get('base_url')+'download_song?'+Math.random();
              vm.session_down = '';
              vm.session_up = 'disabled';
              vm.queue_length = vm.status.session.playlist_length;
              // For Music and Eject
              if(vm.status.session === undefined){
                vm.check_session = "flash";
              } else {
                vm.check_session = "ok-circle";
              }

              if (vm.queue_length !== "0"){
                vm.check_queue = "ok-circle";
              } else {
                vm.check_queue = "remove-sign";
              }
              checkVolumeStatus();
              if (vm.status.session.speed === '0.0%'){
                vm.play_pause = 'play';
              } else {11
                vm.play_pause = 'pause';
              }
            }
          } else {
            vm.dataLoading = false;
              $cookies.remove('base_url');
              $cookies.remove('token');
              $location.path('/');
              FlashService.Error('Connection to the Server failed.');
          }
      }
      function checkVolumeStatus(){
        vm.album_art = $cookies.get('base_url')+'album_art?'+Math.random();
        vm.volume_level = parseFloat(vm.status.session.volume) * 100;
        if(vm.volume_level === 0){
          vm.mute = 'btn-danger';
          vm.vol_down = 'disabled';
        } else {
          vm.vol_down = '';
          vm.mute = '';
        }
        if(vm.volume_level === 100) {
          vm.vol_up = 'disabled';
        } else {
          vm.vol_up = '';
        }

      }
      function action(act, vol_param) {
        ConnectionService.Action($cookies.get('base_url'), {token: $cookies.get('token'), action: act, volume: vol_param})
          .then(function(response){
            if(response !== undefined && response.ok){
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
      function queue_f(){
        if(vm.queue_length === "0" || vm.queue_length === 0){
          vm.queue_path_btn = 'disabled';
          var pth;
          if(vm.queue_path === undefined){
            pth = '~/Music';
          } else {
            pth = vm.queue_path;
          }
          ConnectionService.Queue($cookies.get('base_url'), {token: $cookies.get('token'), path: pth}).then(function(response){
            if(response !== undefined && response.ok){
              updateStatus();
            }
          });
        }
      }
      function startDaemon(){
        ConnectionService.StartDaemon($cookies.get('base_url'), {token: $cookies.get('token')}).then(function(response){
          if(response !== undefined && response.ok){
            updateStatus();
          }
        });
      }
      function quitSession(){
        ConnectionService.QuitSession($cookies.get('base_url'), {token: $cookies.get('token')}).then(function(response){
          if(response !== undefined && response.ok){
            vm.check_queue = "remove-circle";
            vm.check_session = 'flash';
            updateStatus();
          } else {
            FlashService.Error('Error occured while quiting the session');
          }
        });
      }
    }
})();
