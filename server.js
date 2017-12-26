var http = require('http');
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var multer = require("multer");
var Nexmo = require('nexmo');
var upload = multer();

var nexmo = new Nexmo({
    apiKey: '8426eb19',
    apiSecret: '5b62058634d075d1'
})

var from = "Sipho";
var to = 263778359605;
var text = "Test message";

/*nexmo.message.sendSms(from,to,text,function(error,response){
    if(error) throw err;
    else if(response.messages[0].status != '0') throw console.error(response);
    else console.log(response);
})*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var con = mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: '',
    database: 'banked',
});

con.connect(function (err) {
    if (err) throw err
    console.log("You are now connected with mysql database");
})



var server = app.listen(3000, "127.0.0.1", function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

});
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");

});
app.get('/signup', function (req, res) {
    res.sendFile(__dirname + "/" + "form.html");

});
app.post('/login', function (req, res) {

})
app.get('/accounts', function (req, res) {
    con.query('select * from accounts', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
app.post('/upload', upload.fields([]), function (req, res) {
    console.log("posted");
    var postData = req.body;
    var sql = "INSERT INTO accounts (Card_Number,First_Name,Last_Name,Date_of_Birth,Address,Mobile,I_D,Proof_of_Residence,Head_Image,Signature,Agent_Registered) VALUES ('" + postData.cardnum + "','" + postData.firstName + "','" + postData.lastName + "','" + postData.dob + "','" + postData.address + "','" + postData.phone + "','" + postData.idpicture + "','" + postData.proofpicture + "','" + postData.headpicture + "','" + postData.signature + "','" + "Sipho" + "')";
    con.query(sql, function (error, results) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
    res.end("Sipho");
});