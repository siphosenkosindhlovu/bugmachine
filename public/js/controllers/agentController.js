(function(){
'use strict';
angular.module('bugmachine')
    .controller('AgentController', ['$scope', '$http', '$stateParams','localHelper','submitinator', agentiser])
    function agentiser($scope, $http, $stateParams, localHelper, submitinator){
        var vm = this;
        vm.error = null;
        vm.accdata = {}
        vm.accdata.pendingAcc = localHelper.retriveFromStorage();
            console.log(vm.accdata.pendingAcc)
        vm.close = function(){
            $("#warningModal").modal("hide");
            $state.go(
                'index'
            )
        };
        vm.local = localHelper.checkStorage;
        vm.retry = function(){
            $http.get('api/profile').then(function(response){
                vm.message = response.data.message;
                response.data
            }, function(error){
                vm.error = error;
                $("#warningModal").modal("show")
            })
        }
        vm.submiterror = false;
        vm.submit = function(){
            var max = vm.accdata.pendingAcc.length
            for(var i = 0; i < max; i++){
                console.log(vm.accdata.pendingAcc[i])
                submitinator.submit(vm.accdata.pendingAcc[i]).then(function(response){
                    localHelper.deleteFromStorage(vm.accdata.pendingAcc[i].cardnum)
                },function(error){
                    vm.submiterror = true
                    $("#warningModal").modal("show")
                })
            }
        }
        vm.cancel = function(){
            $('#uploaderror').modal('hide')
        }
        vm.load = function(){
            $http.get('api/profile').then(function(response){
                vm.message = response.data.message;
                vm.accdata.summary = response.data.response[0].account;
                console.log(response.data.response)
            }, function(error){
                vm.error = error;
                $("#warningModal").modal("show")
            })
        }
        vm.load()
    }
})()