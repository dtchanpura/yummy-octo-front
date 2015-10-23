(function () {
    'use strict';

    angular
        .module('app')
        .factory('RemoteService', RemoteService);

    RemoteService.$inject = ['$http'];
    function RemoteService($http) {
        var service = {};

        service.UpdateStatus = UpdateStatus;

        return service;

        function UpdateStatus(base_url){
          return ConnectionService.Connect(base_url).then(function(response){
            return response.return.status;
          });
        }

}}
)();
