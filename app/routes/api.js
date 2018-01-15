'use strict';

var router = require('express').Router();

var config = require('../config'),
    allowOnly = require('../services/routesHelper').allowOnly,
    AuthController = require('../controllers/authController'),
    UserController = require('../controllers/userController'),
    AdminController = require('../controllers/adminController'),
    AccController = require('../controllers/accController');
var multer = require("multer");
var upload = multer({
    dest: '../tmp/'
});
var APIRoutes = function (passport) {
    // POST Routes.
    router.post('/signup', AuthController.signUp);
    router.post('/authenticate', AuthController.authenticateUser);
    router.post('/accounts/create', passport.authenticate('jwt', {
        session: false
    }), allowOnly(config.accessLevels.user, AccController.create));

    // GET Routes.
    router.get('/profile', passport.authenticate('jwt', {
        session: false
    }), allowOnly(config.accessLevels.user, UserController.index));
    router.get('/admin', passport.authenticate('jwt', {
        session: false
    }), allowOnly(config.accessLevels.admin, AdminController.index));
    router.get('/accounts/retrive/:accNumber?', passport.authenticate('jwt', {
        session: false
    }), allowOnly(config.accessLevels.admin, AccController.retrive));
    router.get('/agents/retrive/:agentName?', passport.authenticate('jwt', {
        session: false
    }), allowOnly(config.accessLevels.admin, AccController.agents));
    return router;
};

module.exports = APIRoutes;