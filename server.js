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

mailer = require('./modules/mailer');
/* moved into permission.js */
// macl = require('acl');
// acl = new macl(new macl.redisBackend(client,"ClassTranscribe::acl::"));
uuidv4 = require('uuid/v4');
/* end global variables */
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const saml = require('passport-saml');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const https = require('https');
const prerun = require('./modules/prerun');


(async () => {
    await prerun.runMigrations();
})();

dotenv.load();
piwik_port = process.env.PIWIK_PORT;
const mode = process.env.MODE;
console.log("~~~~~~~~~~~");
switch (mode) {
    case "DEV": console.log("~DEVELOPER~"); break;
    case "PRODUCTION": console.log("~PRODUCTION~"); break;
}
console.log("~~~~~~~~~~~");


require("./modules/authentication");

var app = express();

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  	extended: true
}));
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
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use('/browserify', express.static(path.join(__dirname, '/browserify')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/stylesheets', express.static(path.join(__dirname, '/public/stylesheets')));
app.use('/javascripts', express.static(path.join(__dirname, '/public/javascripts')));
app.use('/vtt', express.static(path.join(__dirname,'/vtt')));
app.use('/data', express.static(path.join(__dirname,'/../data')))

/* I wasn't sure where to put these variables (that are used in various files */
mustachePath = 'templates/';

require('./router')(app);

var port = process.env.CT_PORT || 8000;
var argv = require('minimist')(process.argv.slice(2));
var env = argv["e"] || 'production';

const DEVELOPER_MODE = env == 'dev'

// Allow Mustache to load (and cache in production) the templates from disk
Mustache.mustacheFileTemplateCache = {};

var readMustacheTemplateCached = function(filename) {
  result = Mustache.mustacheFileTemplateCache[filename];
  if(result) {
    return result;
  }
  result = fs.readFileSync(mustachePath + filename).toString()
  Mustache.mustacheFileTemplateCache[filename]  = result;
  return result;
}

if(DEVELOPER_MODE) {
  Mustache.getMustacheTemplate = function(filename) {
    Mustache.clearCache(); // clear internal cache, toforce reparsing
    Mustache.mustacheFileTemplateCache = {}
    return readMustacheTemplateCached(filename);
  }
} else {
  Mustache.getMustacheTemplate = readMustacheTemplateCached;
}



// Certificate

var privateKey = fs.readFileSync('./cert/privkey.pem', 'utf8');
var certificate = fs.readFileSync('./cert/cert.pem', 'utf8');
var ca = "";

if (env !== "dev") {
    ca = fs.readFileSync('./cert/chain.pem', 'utf8');
}

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, function() {
	console.log("Class Transcribe on: " + port);
});
