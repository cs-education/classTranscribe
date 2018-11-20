/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 // Serves the main Class Transcribe website on CT_PORT

 /* global variables */

express = require('express');
Mustache = require('mustache');
fs = require('fs');
path = require('path');
mime = require('mime');
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
router = express.Router();
multer = require('multer');

// client = require('./modules/redis');
client = require('./db/db');
mailer = require('./modules/mailer');
/* moved into permission.js */
// macl = require('acl');
// acl = new macl(new macl.redisBackend(client,"ClassTranscribe::acl::"));
uuidv4 = require('uuid/v4');
/* end global variables */

const debug = require('debug');
const favicon = require('serve-favicon');
const logger = require('morgan');
const db = require('./db/db');


const webvtt = require('./modules/webvtt');
const validator = require('./modules/validator');
const http = require('http');
const zlib = require('zlib');
const spawn = require('child_process').spawn;
const mkdirp = require('mkdirp');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const saml = require('passport-saml');
const flash = require('connect-flash');
const passwordHash = require('./node_modules/password-hash/lib/password-hash');
const dotenv = require('dotenv');
const https = require('https');

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
	saveUninitialized: true,
		cookie: { maxAge: 43200000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use('/node_modules', express.static(path.join(__dirname,'/node_modules')));
app.use('/vtt', express.static(path.join(__dirname,'/vtt')));

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

// setInterval(clearInactiveTranscriptions, thirtyMinsInMilliSecs);

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
