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
var saml = require('passport-saml');
var passwordHash = require('./node_modules/password-hash/lib/password-hash');
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

// RedisStore = require('connect-redis')(session)
// app.use(session({
//  store: new RedisStore(client)
// }));


passport.use(new LocalStrategy(
    function(username, password, done) {
		client.hgetall("ClassTranscribe::Users::" + username, function(err, obj) {
			if (!obj) {
				var error = "Account does not exist";
				console.log(error);
				// response.send(error);
				// response.end();
				return done(null, false, { message: 'Incorrect username.' })
			} else {
				// Check if the user is verified their email address
				client.hget("ClassTranscribe::Users::" + username, "verified", function(err, obj) {
					console.log("Is the email verified? " + obj);
					if (obj == "false") {
						var error = "Email not verified";
						console.log(error);
						// response.send(error);
						return done(null, false, { message: 'Email not verified.' })
					} else {
						// Verify the inputted password is equivalent to the hashed password stored in the database
						client.hget("ClassTranscribe::Users::" + username, "password", function(err, obj) {
							var isCorrectPassword = passwordHash.verify(password, obj)
							console.log("Do the passwords match? " + isCorrectPassword);
							if (!isCorrectPassword) {
								var error = "Invalid password";
								console.log(error);
								// response.send(error);
								return done(null, false, { message: 'Incorrect password.' })
							} else {
								// response.redirect('../dashboard');
								var user = { username: username, email: username, password: password };
								return done(null, user);
							}
						});
					}
				});
			}
		});
    }
));

passport.serializeUser(function(user, done) {
  	done(null, user.email);
});

passport.deserializeUser(function(id, done) {
	// TODO: something something, I believe this actually doesn't work
	User.findById(id, function(err, user) {
		done(err, user);
	});
});
