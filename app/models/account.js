var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');

var accountDefinition = {
    Card_Number: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    First_Name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Last_Name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Date_of_Birth: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Mobile: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    I_D: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Copy_of_ID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Proof_of_Residence: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Head_Image: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Signature: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Agent_Registered: {
        type: Sequelize.STRING,
        allowNull: false,
    }
};


db.authenticate().then(function(){
    console.log("Auth")
})
var AccountModel = db.define('accounts', accountDefinition, {})

module.exports = AccountModel;