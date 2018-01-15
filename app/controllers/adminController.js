'use strict';
// The admin controller
var config = require('../config'),
    db = require('../services/database'),
    Account = require('../models/account');
var User = require('../models/user');
var sequelize = require('sequelize');
var bodyParser = require('body-parser');

var AdminController = {
    index: function (req, res) {
        Account.findAll({
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('Agent_Registered')), 'account']
                ]
            },
        }).then(function(response){
            User.findAll({
                attributes:{
                    include:[
                        [sequelize.fn('COUNT', sequelize.col('username')), 'userlist']
                    ]
                }
            })
            res.status(200).json({
                data: response,
                message: 'Welcome to the admin area ' + req.user.username + '!'
            })
        })
    }
};

module.exports = AdminController;