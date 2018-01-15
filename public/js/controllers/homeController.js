(function () {
    'use strict';

    angular
        .module('bugmachine')
        .controller('HomeController', [
            '$state',
            'authenticator',
            homeController
        ]);

    function homeController($state, authenticator){
        var vm = this;
        vm.isAuthenticated = authenticator.isAuthenticated;
        console.log(vm.isAuthenticated());
    }
})()