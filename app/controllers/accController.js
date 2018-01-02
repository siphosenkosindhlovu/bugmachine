var config = require('../config'),
    db = require('../services/database'),
    Account = require('../models/account');

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
    
    function testReqPres() {
        /*for (var key in postData) {
            if (!postData[key]) {
                return false;
            }
        }*/
        return false
    }
    if (!testReqPres()) {
        console.log(postData);
        var newAcc = Account.build({
            Card_Number: postData.cardnum,
            First_Name: postData.firstName,
            Last_Name: postData.lastName,
            Date_of_Birth: postData.dob,
            Address: postData.address,
            Mobile: postData.phone,
            I_D: postData.idnumber,
            Copy_of_ID: postData.idpicture,
            Proof_of_Residence: postData.proofpicture,
            Head_Image: postData.headpicture,
            Signature: postData.signature,
            Agent_Registered: postData.agent,
        });
        newAcc.save().then(function () {
            var words = "Account " + postData.cardnum + " creation successful"
            nexmo.message.sendSms("Stewie", parseInt(postData.phone), words, function (error, response) {
                if (error) throw err;
                else if (response.messages[0].status != '0') throw console.error(response);
                else console.log(response);
            })
            res.json({
                message: "Account successfully Created. Please wait for confirmation SMS",
            }).catch(function (error) {
                res.status(500).json({
                    message: "Internal error occured"
                })
            })
        })
    } else {
        res.json({
            message: "There was an error validating your data. Please check if it is correct."
        })
    }

}

module.exports = AccController;