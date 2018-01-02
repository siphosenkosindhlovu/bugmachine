(function(){


app.factory('authenticator', ['$http', '$cookies', '$state', authenticator]);

function authenticator($http, $cookies, $state){
    var authenticator = {
        login: login,
        logut: logout,
        signup: signup,
        getUserData: getUserData,
        isAuthenticated: isAuthenticated
    }

    function login(username, password){
        var reqObj = {
            method: 'POST',
            url: 'api/authenticate',
            data: {
                username: username,
                password: password
            }
        };

        return $http(reqObj).then(function(response){
            if(response && response.data){
                response = response.data; 

                var expires = new Date(),
                    user = {};

                user.username = response.username;
                user.role = response.role;
                user.token = response.token;

                expires.setTime(expires.getTime() + (1440 * 60 * 1000));

                $cookies.put(
                    'user',
                    JSON.stringify(user),
                    { expires: expires }
                );
            }
        });
    };

    function logout(){
        $cookies.remove('user');
        $state.go('index');
    }

    function isAuthenticated() {
        var user = $cookies.get('user');
        return user && user !== 'undefined';
    }

    function getUserData() {
        if(isAuthenticated()) {
            return JSON.parse($cookies.get('user'));
        }

        return false;
    }

    function signup(username, password) {
        var reqObj = {
            method: 'POST',
            url: '/api/signup',
            data: {
                username: username,
                password: password
            }
        };

        return $http(reqObj);
    }
}

})