
(function(){
'use strict';
angular.module('bugmachine')
    .controller('AgentController', ['$scope', '$http','$state', '$stateParams','localHelper','submitinator', agentiser])
    function agentiser($scope, $http, $state,$stateParams, localHelper, submitinator){
        var vm = this;
        vm.error = null;
        vm.accdata = {}
        vm.accdata.pendingAcc = localHelper.retriveFromStorage();
            console.log(vm.accdata.pendingAcc)
        vm.close = function(){
            $("#warningModal").modal("hide");
            setTimeout(function(){

                $state.go(
                    'index'
                )
            }, 1000)
        };
        vm.local = localHelper.checkStorage;
        vm.retry = function(){
            $http.get('api/profile').then(function(response){
                vm.message = response.data.message;
                response.data
            }, function(error){
                vm.error = "An error occured";
                $("#warningModal").modal("show")
            })
        }
        vm.submiterror = false;
        vm.submit = function(){
            var max = vm.accdata.pendingAcc.length
            for(var i = 0; i < max; i++){
                console.log(vm.accdata.pendingAcc[i])
                var form = vm.accdata.pendingAcc[i]
                submitinator.submit(form).then(function(response){
                    console.log(form)
                    localHelper.deleteFromStorage(form.cardnum)
                    vm.accdata.pendingAcc = localHelper.retriveFromStorage();
                },function(error){
                    vm.submiterror = true
                    vm.error = "An error occured"
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