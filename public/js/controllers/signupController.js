(function() {
    'use strict';

    angular
        .module('bugmachine')
        .controller('SignupController', [
            '$scope',
            'authenticator', 
            signupController
        ]);

    function signupController($scope, authenticator) {
        var vm = this;

        vm.signupSuccess = false;
        vm.signupError = false
        vm.signupErrorMessage = null;

        vm.signup = signup;

        function signup() {
            vm.signupSuccess = false;
            vm.signupError = false
            vm.signupErrorMessage = null;

            if(!vm.username || !vm.password) {
                vm.signupError = true;
                vm.signupErrorMessage = 'Username and password required!';
                return;
            }

            authenticator.signup(vm.username, vm.password)
                .then(handleSuccessfulSignup)
                .catch(handleFailedSignup);
        }

        function handleSuccessfulSignup(response) {
            vm.signupSuccess = true;
        }

        function handleFailedSignup(response) {
            vm.signupSuccess = false;

            if(response && response.data) {
                vm.signupErrorMessage = response.data.message;
                vm.signupError = true;
            }
        }
    }

})();