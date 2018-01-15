(function(){
    'use strict';
    angular.module('bugmachine')
        .controller('AdminController', ['$scope', '$http', '$state', agentiser])
    
        function agentiser($scope, $http, $state){
            var vm = this;
            vm.message = null;
            vm.summary = {};
            vm.summary.agentCount = 0;
            vm.summary.accdata = null;
            vm.agents = [];
            vm.accounts = []
            $http.get('api/admin').then(function(response){
                vm.message = response.data.message;
                vm.summary.accdata = response.data.data[0].account;
            })
            //$http.get('api/')
            $http.get('api/agents/retrive?list=true').then(function(response){
                var resObj = response.data
                for(var i = 0; i < resObj.length; i++){
                    var agentName = resObj[i].username;
                    var url = 'api/agents/retrive/' + agentName + '?summary=true';
                    $http.get(url).then(function(result){
                        vm.agents.push(result.data);
                        vm.summary.agentCount++
                    })
                }
            })
                $http.get('api/accounts/retrive/').then(function(response){
                    vm.accounts = response.data.result;
                    ;
                    console.log(vm.accounts)
                })
        }
    })()