'use strict';
var config = require('../config'),
    db = require('../services/database'),
    Account = require('../models/account');
var sequelize = require('sequelize');
// The user controller.
var UserController = {
    index: function (req, res) {
        console.log(req.user.username)
        Account.findAll({
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('Agent_Registered')), 'account']
                ]
            },
            where:{
                Agent_Registered: req.user.username
            } 
        }).then(function(response){

            res.status(200).json({
                message: 'Welcome to the users area ' + req.user.username + '!',
                response
            });
        })
    }
};

module.exports = UserController;