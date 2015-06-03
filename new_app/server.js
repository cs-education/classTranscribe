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
var React = require('react');
var reactViews = require('express-react-views');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var dbConfig = require('./dbConfig');
//var routes = require('./js/routes');

var devMode = true;


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
app.set('views', __dirname + '/js/views');
app.set('view engine', 'js');
app.engine('js', reactViews.createEngine());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

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

    newStudent.save(function(err, result) {
        if (err) {
            console.error(err);
        } else {
            res.writeHead(204);
            res.end();
        }
    });
});

app.get('/api/:className/getStudents', function(req, res) {
   Student.find({className: req.params.className}, function(err, students) {
       if (err) {
           res.writeHead(500);
           res.end(err);
       } else {
           res.writeHead(200, {
               'Content-Type': 'application/json'
           });
           res.end(JSON.stringify(students));
       }
   })
});

app.get('*', function (req, res) {
    res.render('index');
});

var server = app.listen(8000);