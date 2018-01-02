//Application configuration

var config = module.exports;

config.db = {
    user: 'root',
    password: '',
    name: 'banked',
};

config.db.details = {
    host: 'localhost',
    port: 8888,
    dialect: 'mysql'
};

config.keys = {
    secret: 'yomama5ucka555'
};

var userRoles = config.userRoles = {
    guest: 1,
    user: 2,
    admin: 4
};

config.accessLevels = {
    guest: userRoles.guest | userRoles.user | userRoles.admin, //111
    user: userRoles.user | userRoles.admin, // 110
    admin: userRoles.admin //100
}