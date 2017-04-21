/*
 * Serves the main Class Transcribe website on CT_PORT
 */

/* global variables */

express = require('express');
Mustache = require('mustache');
fs = require('fs');
path = require('path');
mime = require('mime');
passport = require('passport');
router = express.Router();

client = require('./modules/redis');
mailer = require('./modules/mailer');

/* end global variables */


var webvtt = require('./modules/webvtt');
var validator = require('./modules/validator');

var http = require('http');
var zlib = require('zlib');
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var https = require('https');

dotenv.load();
piwik_port = process.env.PIWIK_PORT;

if (process.env.DEV == "DEV") {
    console.log("~~~~~~~~~~~");
    console.log("~DEVELOPER~");
    console.log("~~~~~~~~~~~");
}

require("./authentication");
require("./public/functions");

var app = express();

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

/* I wasn't sure where to put these variables (that are used in various files */
mustachePath = 'templates/';

exampleTerms = {
  "cs241": "printf",
  "cs225": "pointer",
  "cs225-sp16": "pointer",
  "chem233-sp16": 'spectroscopy',
  "adv582": "focus group",
  "ece210": "Energy Signals",
  "cs446-fa16": "Decision Trees"
}

captionsMapping = {
  "cs241": require('./public/javascripts/data/captions/cs241.js'),
  "cs225": require('./public/javascripts/data/captions/cs225.js'),
  "cs225-sp16": require('./public/javascripts/data/captions/cs225-sp16.js'),
  "chem233-sp16": require('./public/javascripts/data/captions/chem233-sp16.js'),
  "adv582": require('./public/javascripts/data/captions/adv582.js'),
  "ece210": require('./public/javascripts/data/captions/ece210.js'),
  "cs446-fa16": require('./public/javascripts/data/captions/cs446-fa16.js'),
}

/*
    Uncomment this and visit this route to create and show the Metadata
    needed for registering with a Shibboleth Identity Provider

app.get('/Metadata',
  function (req, res) {
    res.type('application/xml');
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(fs.readFileSync("./cert/cert/cert.pem", "utf8")));
  }
);
*/

var thirtyMinsInMilliSecs = 30 * 60 * 1000;
setInterval(clearInactiveTranscriptions, thirtyMinsInMilliSecs);

require('./router')(app);

var port = process.env.CT_PORT || 8000;

var options = {
  key: fs.readFileSync("./cert/cert/key.pem"),
  cert: fs.readFileSync("./cert/cert/cert.pem")
};


var httpsServer = https.createServer(options, app);
httpsServer.listen(port, function() {
	console.log("Class Transcribe on: " + port);
});


