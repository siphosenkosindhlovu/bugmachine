(function(){
    'use strict';
    angular.module('bugmachine')
        .controller('AdminController', ['$scope', '$http', '$state', agentiser])
    
        function agentiser($scope, $http, $state){
            var vm = this;
            vm.message = null;
            vm.summary = {};
            vm.loading = true;
            vm.summary.agentCount = 0;
            vm.summary.accdata = null;
            vm.agents = [];
            vm.accounts = []
            if(!vm.message){
                $http.get('api/admin').then(function(response){
                    vm.message = response.data.message;
                    vm.summary.accdata = response.data.data[0].account;
                }).catch(function(error){
                    if(error.status == 403){
                        $state.go(
                            'forbidden'
                        )
                    }
                })
            }else{
                alert("alt")
            }
            
            //$http.get('api/')
            if(vm.agents.length == 0){
                $http.get('api/agents/retrive?list=true').then(function(response){
                    var resObj = response.data
                    for(var i = 0; i < resObj.length; i++){
    
                        if(i === resObj.length - 1){
                            vm.loading = false;
                        }
                        var agentName = resObj[i].username;
                        var url = 'api/agents/retrive/' + agentName + '?summary=true';
                        $http.get(url).then(function(result){
                            vm.agents.push(result.data);
                            vm.summary.agentCount++
                        })
                    };
                }).catch(function(error){
                    if(error.status == 403){
                        $state.go(
                            'forbidden'
                        )
                    }
                })
            }else{

                alert("alt")
            }
            if(vm.accounts.length == 0){
                $http.get('api/accounts/retrive/').then(function(response){
                vm.accounts = response.data.result;
                console.log(vm.accounts);
            }).catch(function(error){
                if(error.status == 403){
                    $state.go(
                        'forbidden'
                    )
                }
            })
            }else{
                alert("alt")
            }
            
        }
    })()