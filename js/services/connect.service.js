(function () {
    'use strict';

    angular
        .module('app')
        .factory('ConnectionService', ConnectionService);

    ConnectionService.$inject = ['$http'];
    function ConnectionService($http) {
        var service = {};

        service.Connect = Connect;
        service.GetToken = GetToken;
        service.Status = Status;
        service.Action = Action;
        service.Register = Register;
        service.Queue = Queue;
        service.StartDaemon = StartDaemon;
        
        return service;

        function Connect(ip_address, port) {
            return $http.get('http://'+ip_address+':'+port+'/status').then(handleSuccess, handleError('Connection Error'));
        }
        function Status(base_url) {
          return $http.get(base_url+'status').then(handleSuccess, handleError('Connection Error'));
        }
        function GetToken(base_url, username, password) {
          return $http.post(base_url+'get_token', {username: username, password: password}).then(handleSuccess, handleError('Invalid Username/Password'));
        }
        function Register(base_url, username, password){
          return $http.post(base_url+'register', {username: username, password: password}).then(handleSuccess, handleError('Username already exists'));
        }
        function Action(base_url, params){
          return $http.post(base_url+'action', params).then(handleSuccess, handleError('Unknown Error Occured.'));
        }
        function Queue(base_url, params){
          return $http.post(base_url+'queue', params).then(handleSuccess, handleError('Unable to queue tracks.'));
        }
        function StartDaemon(base_url, params){
          return $http.post(base_url+'start_daemon', params).then(handleSuccess, handleError('Unable to start daemon.'));
        }
        function handleSuccess(res) {
          return res.data;
        }

        function handleError(error) {
          return function(){
            return {ok: false, message: error };
          };
        }
    }

})();
