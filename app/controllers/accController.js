var config = require('../config'),
    db = require('../services/database'),
    Account = require('../models/account');
var User = require('../models/user');
var sequelize = require('sequelize');
var bodyParser = require('body-parser');
var multer = require("multer");
var Nexmo = require('nexmo');
var upload = multer();
var nexmo = new Nexmo({
    apiKey: '8426eb19',
    apiSecret: '5b62058634d075d1'
})


var AccController = {};

AccController.create = function (req, res) {
    var postData = req.body;
    var newAcc = Account.build({
        Card_Number: Number(postData.cardnum),
        First_Name: postData.firstName,
        Last_Name: postData.lastName,
        Date_of_Birth: postData.dob,
        Address: postData.address,
        Mobile: Number(postData.phone),
        I_D: postData.idnumber,
        Copy_of_ID: postData.idpicture,
        Proof_of_Residence: postData.proofpicture,
        Head_Image: postData.headpicture,
        Signature: postData.signature,
        Agent_Registered: postData.agentName,
    });
    newAcc.save().then(function () {
        var words = "Account " + postData.cardnum + " creation successful"
        nexmo.message.sendSms("Stewie", parseInt(postData.phone), words, function (error, response) {
            if (error) throw error;
            else if (response.messages[0].status != '0') throw console.error(response);
            else console.log(response);
        })
        res.json({
            message: "Account successfully Created. Please wait for confirmation SMS",
        })
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: error
        })
    })
}

AccController.retrive = function (req, res) {
    if (req.params.accNumber) {
        Account.findOne({
            where: {
                Card_Number: req.params.accNumber
            }
        }).then(function (account) {
            res.json({
                data: account
            })
        }).catch(function (error) {
            res.status(404).json({
                message: "Not found"
            })
        })
    } else {
        Account.findAll({
            attributes: ['Card_Number', 'First_Name', 'Last_Name', 'I_D', 'Mobile', 'createdAt', 'Agent_Registered']
        }).then(function (result) {
            res.json({
                result
            })
        }).catch(function (error) {
            res.status(500).json({
                message: "Internal error occured"
            })
        })
    }

}

AccController.agents = function (req, res) {
    console.log(req.query.list)
    if (String(req.query.list) == "true") {
        User.findAll({
            attributes: ['username']
        }).then(function(response){
            res.json(response)
        }, function(error){
            console.error(error);
            res.json({
                message: "error"
            })
        })
    } else if (req.params.agentName && String(req.query.summary) == "true") {
        console.log(req.params.agentName)
        User.findOne({
            where: {
                username: req.params.agentName
            }
        }).then(function (response) {
            Account.findAll({
                attributes: {
                    include: [
                        [sequelize.fn('COUNT', sequelize.col('Agent_Registered')), 'account']
                    ]
                }, 
                where: {
                    Agent_Registered: response.username
                }
            }).then(function (result) {
                resp = result[0].get({
                    plain: true
                })
                res.json({
                    agentName: req.params.agentName,
                    accountCount: resp.account,
                    allAccounts: resp,
                })
            }).catch(function (error) {
                console.log('foudk line 121')
                res.status(404).json({
                   
                    message: "Not found",
                })
            })
        })
    } else if (req.params.agentName) {
        console.log("Other path")
        User.findOne({
            where: {
                username: req.params.agentName
            }
        }).then(function (response) {
            Account.findAll({
                where: {
                    Agent_Registered: response.username
                }
            }).then(function (result) {
                res.json(result)


            }).catch(function (error) {
                console.log('foudk line 143')
                res.status(404).json({
                    message: "Not found",
                })
            })
        })
    } else {
        res.json({
            message: "Nun bra"
        })
    }
}


module.exports = AccController;