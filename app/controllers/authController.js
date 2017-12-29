'use strict';

var jwt = require('jsonwebtoken');

var config = require('../config'),
  db = require('../services/database'),
  User = require('../models/user');

// The authentication controller.
var AuthController = {};
console.log("Fuook line 11")
// Register a user.
AuthController.signUp = function (req, res) {
  if (!req.body.username || !req.body.password) {
    console.log("Fuook line 15")
    res.json({
      message: 'Please provide a username and a password.'
    });
  } else {
    db.sync().then(function () {
      console.log("Fuook line 19")
      var newUser = {
        username: req.body.username,
        password: req.body.password
      };
      console.log("Fuook line 24")
      return User.create(newUser).then(function () {
        res.status(201).json({
          message: 'Account created!'
        });
      });
    }).catch(function (error) {
      console.log(error);
      console.log("Fuook line 30")
      res.status(403).json({
        message: 'Username already exists!'
      });
    });
  }
}

// Authenticate a user.
AuthController.authenticateUser = function (req, res) {
  console.log("Fuook line 38")
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    console.log("Fuook line 40")
    res.status(404).json({
      message: 'Username and password are needed!'
    });
  } else {
    console.log("Fuook line 43")
    var username = req.body.username,
      password = req.body.password,
      potentialUser = {
        where: {
          username: username
        }
      };

    User.findOne(potentialUser).then(function (user) {
      console.log("Fuook line 49")
      if (!user) {
        console.log("Fuook line 51")
        res.status(404).json({
          message: 'Authentication failed!'
        });
      } else {
        user.comparePasswords(password, function (error, isMatch) {
          if (isMatch && !error) {
            console.log("Fuook line 56")
            var token = jwt.sign({
                username: user.username
              },
              config.keys.secret, {
                expiresIn: '1440m'
              }
            );

            res.json({
              success: true,
              token: 'JWT ' + token,
              role: user.role
            });
          } else {
            console.log("Fuook line 69")
            res.status(404).json({
              message: 'Login failed!'
            });
          }
        });
      }
    }).catch(function (error) {
      res.status(500).json({
        message: 'There was an error!'
      });
    });
  }
}

module.exports = AuthController;