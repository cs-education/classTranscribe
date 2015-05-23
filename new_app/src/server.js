/**
 * Created by omelvin on 5/21/15.
 */

var fs = require('fs');
var util = require('util');
var http = require('http');
var path = require('path');
var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var devMode = true;

var dbConfig = require('./dbConfig');
var mongoConnection = mongoose.createConnection(dbConfig.mongoURI, dbConfig.mongoConfig);
if(devMode) {
    mongoose.set('debug, true');
}
// Logging connection:
mongoConnection.on('error', console.error.bind(console, 'DB connection error.')).once('open', console.log.bind(console, 'DB Connection established.'));

var studentSchema = new mongoose.Schema({
    firstName : String,
    lastName  : String,
    email     : String,
    studentID : String,
    className : String
});

var Student = mongoConnection.model('Student', studentSchema);

var app = express();
console.log(__dirname)
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

var registerHTML = fs.readFileSync('register.html').toString();
app.get('/:className/register/:studentID', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(registerHTML);
});

//TODO: add privilege verification
var instructorDashboardHTML = fs.readFileSync('instructorDashboard.html').toString();
app.get('/instructorDashboard/:className', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(instructorDashboardHTML);
});

//TODO: add passport for proper password encryption and session handling
app.put('/api/registerStudent', function(req, res) {
    var newStudent = new Student({
        firstName   : req.body.firstName,
        lastName    : req.body.lastName,
        email       : req.body.email,
        password    : req.body.password,
        studentID   : req.body.studentID,
        className   : req.body.className
    });
    console.log(newStudent.studentID);
    newStudent.save(function(err, result) {
        if (err) {
            console.error(err);
        }
        testSave(newStudent.studentID);
        res.writeHead(204);
        res.end();
    });
});

function testSave(studentID) {
    Student.find({studentID: studentID}, function(err, retrievedStudent) {
        if(err) { console.log(err )};
        console.log(retrievedStudent);
    })
};

app.get('/api/:className/getStudents', function(req, res) {
   Student.find({className: req.params.className}, function(err, students) {
       if(err) {
           res.writeHead(500);
           res.end(err);
       }
       res.writeHead(200, {
           'Content-Type': 'application/json'
       });
       res.end(JSON.stringify(students));
   })
});

var server = app.listen(8000);