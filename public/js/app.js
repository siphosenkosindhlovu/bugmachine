(function () {



    var bugmachine = angular.module('bugmachine', [
        'ui.router',
        'ngCookies',
        'ngAnimate',
        'naif.base64'
    ]);

    bugmachine.factory('requestInterceptor', [
        '$cookies',
        function ($cookies) {
            return {
                request: function (config) {
                    var user = $cookies.get('user'),
                        token = null;

                    if (user) {
                        user = JSON.parse(user);
                        token = user.token ? user.token : null;
                    }

                    if (token) {
                        config.headers = config.headers || {};
                        config.headers.Authorization = token;
                    }

                    return config;
                }
            };
        }
    ])

    // Static data constant.
    var staticData = {};

    var userRoles = staticData.userRoles = {
        guest: 1,
        user: 2,
        admin: 4
    };

    staticData.accessLevels = {
        guest: userRoles.guest | userRoles.user | userRoles.admin,
        user: userRoles.user | userRoles.admin,
        admin: userRoles.admin
    };

    bugmachine.constant('staticData', staticData);

    // Config block.
    bugmachine.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        '$locationProvider',
        'staticData',
        authConfig
    ]);

    function authConfig(
        $stateProvider,
        $urlRouterProvider,
        $httpProvider,
        $locationProvider,
        staticData) {

        // Index route.
        $stateProvider.state('index', {
            url: '/',
            templateUrl: 'templates/home-landing.html',
            controller: 'HomeController as hc'
        });

        // Login route.
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'templates/login-template.html',
            controller: 'LoginController as lc'
        });

        // User area route.
        $stateProvider.state('profile', {
            url: '/profile',
            templateUrl: 'templates/agent.overview.html',
            controller: 'AgentController as ag',
            data: {
                accessLevel: staticData.accessLevels.user
            }
        });

        // Admin area route.
        $stateProvider.state('admin', {
            url: '/admin',
            templateUrl: 'templates/admin.html',
            controller: 'AdminController as ac',
            data: {
                accessLevel: staticData.accessLevels.admin
            }
        });
        $stateProvider.state('allAccounts', {
            url: '/accounts',
            templateUrl: 'templates/accounts-preview.html',
            controller: 'AdminController as ac',
            data: {
                accessLevel: staticData.accessLevels.admin
            }
        })

        // Register account route.
        $stateProvider.state('register', {
            abstract: true,
            url: '/register',
            templateUrl: 'templates/form-multi/form-skele.html',
            controller: 'RegisterController as rc',
        });

        $stateProvider.state('register.intro', {
            url: '',
            templateUrl: 'templates/form-multi/form-intro.html',
        })

        $stateProvider.state('register.step1', {
            url: '/step1',
            templateUrl: 'templates/form-multi/form-step1.html',
        })

        $stateProvider.state('register.step2', {
            url: '/step2',
            templateUrl: 'templates/form-multi/form-step2.html',
        })

        $stateProvider.state('register.step3', {
            url: '/step3',
            templateUrl: 'templates/form-multi/form-step3.html',
        })

        $stateProvider.state('register.final', {
            url: '/final',
            templateUrl: 'templates/form-multi/form-final.html',
        })
        
        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('requestInterceptor');
    }

    // Run block.
    bugmachine.run([
        '$rootScope',
        '$state',
        'authenticator',
        authRun
    ]);

    function authRun($rootScope, $state, authenticator) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            console.log(toState);
            if (toState.data && toState.data.accessLevel) {
                var user = authenticator.getUserData();
                console.log(toState);
                if (!(toState.data.accessLevel & user.role)) {
                    event.preventDefault();
                    $state.go('index');
                    return;
                }
            }
        });
    }

})();