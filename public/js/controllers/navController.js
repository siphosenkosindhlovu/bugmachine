(function(){
    angular
        .module('bugmachine')
        .controller('NavController', [
            'authenticator',
            navController
        ]);

    function navController(authenticator){
        var vm = this;
        vm.getUserData = authenticator.getUserData;
        vm.isAuthenticated = authenticator.isAuthenticated;
        vm.logout = authenticator.logout;
        vm.back = function(){
            window.history.back()
        }


        console.log(vm.getUserData().username);
    }
})()