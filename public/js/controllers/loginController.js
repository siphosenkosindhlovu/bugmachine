(function() {
    'use strict';

    angular
        .module('bugmachine')
        .controller('LoginController', [
            '$state',
            'authenticator',
            loginController
        ]);

    function loginController($state, authenticator) {
        var vm = this;

        vm.loginError = false
        vm.loginErrorMessage = null;

        vm.login = login;

        function login() {
            vm.loginError = false
            vm.loginErrorMessage = null;
            console.log("click");
            if(!vm.username || !vm.password) {
                vm.loginError = true;
                vm.loginErrorMessage = 'Username and password required!';
                return;
            }

            authenticator.login(vm.username, vm.password)
                .then(handleSuccessfulLogin)
                .catch(handleFailedLogin);
        }   

        function handleSuccessfulLogin() {
            $state.go('index');
        }

        function handleFailedLogin(response) {
            if(response && response.data) {
                vm.loginErrorMessage = response.data.message;
                vm.loginError = true;
            }
        }

    }
})();