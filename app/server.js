var http = require('http');
var express = require('express');
var app = express();
var mysql = require('mysql');
var morgan = require('morgan');
var sequelize = require('sequelize');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var multer = require("multer");
var Nexmo = require('nexmo');
var upload = multer();
var path = require('path');
var hookJWTStrategy = require('./services/passportStrategy')
var app = express();

var nexmo = new Nexmo({
    apiKey: '8426eb19',
    apiSecret: '5b62058634d075d1'
})
/*
var from = "Sipho";
var to = 263778359605;
var text = "Test message";

nexmo.message.sendSms(from,to,text,function(error,response){
    if(error) throw err;
    else if(response.messages[0].status != '0') throw console.error(response);
    else console.log(response);
})*/
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(passport.initialize());
hookJWTStrategy(passport);
app.use(morgan('dev'));
/*var con = mysql.createConnection({
    host: 'localhost',
    port: '8888',
    user: 'root',
    password: '',
    database: 'banked',
});

con.connect(function (err) {
    if (err) throw err
    console.log("You are now connected with mysql database");
})
*/


var server = app.listen('3000', process.env.HOST , function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

});
var api = require('./routes/api');



app.use(express.static(__dirname + '/../public'));



app.use('/api', api(passport));

app.get('/*', function (req, res) {
    //res.sendFile(__dirname + "/" + "login.html");
    res.sendFile(path.join(__dirname + '/../public/index.html'));

});
/*app.post('/upload', upload.fields([]), function (req, res) {
    console.log("posted");
    var postData = req.body;
    console.log(postData.cardnum);
    var sql = "INSERT INTO accounts (Card_Number,First_Name,Last_Name,Date_of_Birth,Address,Mobile,I_D,Copy_of_ID,Proof_of_Residence,Head_Image,Signature,Agent_Registered) VALUES ('" + postData.cardnum + "','" + postData.firstName + "','" + postData.lastName + "','" + postData.dob + "','" + postData.address + "','" + postData.phone + "','" + postData.idnumber + "','" + postData.idpicture + "','" + postData.proofpicture + "','" + postData.headpicture + "','" + postData.signature + "','" + "Sipho" + "')";
    con.query(sql, function (error, results) {
        if (error) throw error;
        var fone = parseInt(postData.phone);
        var words = "Dear" + postData.firstName + " " + postData.lastName + "account number" + postData.cardnum +". Your account has successfully been created." 
        nexmo.message.sendSms("Stewie", fone, words, function (error, response) {
            if (error) throw err;
            else if (response.messages[0].status != '0') throw console.error(response);
            else console.log(response);
        })
        res.send(results);
    });
});*/