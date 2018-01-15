(function () {
    'use strict';

    angular.module("bugmachine")
        .factory('submitinator', ['$http', '$state', 'authenticator', submitinator]);

    function submitinator($http, $state, authenticator) {
        var submitinator = {
            submit: submit,
        }
        function submit(formObj) {
            var form = formObj;
            form.agentName = authenticator.getUserData().username;
            var reqObj = {
                method: 'POST',
                url: 'api/accounts/create',
                data: form,
            }
            return $http(reqObj)
        }

        return submitinator;
    }
})()