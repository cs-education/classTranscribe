express = require('express');
Mustache = require('mustache');
fs = require('fs');
path = require('path');
mime = require('mime');
client = require('./modules/redis');
passport = require('passport');
mailer = require('./modules/mailer');

var http = require('http');
var zlib = require('zlib');
var webvtt = require('./modules/webvtt');
var validator = require('./modules/validator');
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var saml = require('passport-saml');
var dotenv = require('dotenv');

dotenv.load();

var https = require('https');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var CALLBACK_URL = "https://192.17.96.13:7443/login/callback"
var ENTRY_POINT = "https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO";
var ISSUER = 'ClassTranscribe4927/Shibboleth';
var LOGOUT_URL = "https://www.testshib.org/Shibboleth.sso/Logout";
var KEY = fs.readFileSync(__dirname + '/cert/cert/key.pem');
var CERT = fs.readFileSync(__dirname + '/cert/cert/cert.pem');

samlStrategy = new saml.Strategy({
  // URL that goes from the Identity Provider -> Service Provider
  callbackUrl: CALLBACK_URL,
  // URL that goes from the Service Provider -> Identity Provider
  entryPoint: ENTRY_POINT,
  // Usually specified as `/shibboleth` from site root
  issuer: ISSUER,
  logoutUrl: LOGOUT_URL,
  identifierFormat: null,
  // Service Provider private key
  decryptionPvk: KEY,
  // Service Provider Certificate
  privateCert: KEY,
  // Identity Provider's public key
  cert: fs.readFileSync(__dirname + '/cert/cert/idp_cert.pem', 'utf8'),
  validateInResponseTo: false,
  disableRequestedAuthnContext: true,
  forceAuthn: true,
  isPassive: false,
  additionalParams: {}
}, function (profile, done) {
  usersaml = {};
  usersaml.nameID = profile["issuer"]["_"];
  usersaml.nameIDFormat = profile["issuer"]["$"];
  return done(null, profile);
});

passport.use(samlStrategy);

var app = express();

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: "secret" }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    samlStrategy['Redirect'] = req['_parsedOriginalUrl']['path'];
    //console.log(req['_parsedOriginalUrl']['path']);
    return res.redirect('/login');
  }
}

client.on("monitor", function (time, args, raw_reply) {
  console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
});

mustachePath = 'templates/';

var exampleTerms = {
  "cs241": "printf",
  "cs225": "pointer",
  "cs225-sp16": "pointer",
  "chem233-sp16": 'spectroscopy',
  "adv582": "focus group",
  "ece210": "Energy Signals",
  "cs446-fa16": "Decision Trees"
}


var authenticatedPartial = fs.readFileSync(mustachePath + 'authenticated.mustache').toString();
var notAuthenticatedPartial = fs.readFileSync(mustachePath + 'notAuthenticated.html').toString();

function renderWithPartial(mustacheFile, request, response) {
  var html;
  if (request.isAuthenticated()) {
    html = Mustache.render(mustacheFile, {
      list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
    }, {
        partial: authenticatedPartial
      })
  }
  else {
    html = Mustache.render(mustacheFile,
      {
        list: [{ user: null }]
      }, {
        partial: notAuthenticatedPartial
      })
  }
  response.end(html);
}



var homeMustache = fs.readFileSync(mustachePath + 'home.mustache').toString();
app.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(homeMustache, request, response);
  /*
    var header = getHeader(req);
  
  
    var html = Mustache.render(homeMustache, {
      list: header['list']
    }, {
        partial: header['partial']
      });
    response.end(html);
  */
});

app.get('/profile', function (request, response) {

});
/*
var piwik = require("piwik").setup("https://classtranscribe.herokuapp.com", "abc");
piwik.track({idsite: 1, url: "https://classtranscribe.herokuapp.com"}, console.log);
*/

app.get('/logout', function (req, res) {
  if (usersaml != null) {
    //Here add the nameID and nameIDFormat to the user if you stored it someplace.
    req.user = {};
    req.user.nameID = usersaml.nameID;
    req.user.nameIDFormat = usersaml.nameIDFormat;
    samlStrategy.logout(req, function (err, request) {
      if (!err) {
        //redirect to the IdP Logout URL
        req.session.destroy(function (err) {
          req.logout();
          res.clearCookie('connect.sid');
          res.redirect(request);
        });
      }
    });
  }
});

app.get('/Metadata',
  function (req, res) {
    res.type('application/xml');
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(fs.readFileSync(__dirname + "/cert/cert/cert.pem", "utf8")));
  }
);

var viewerMustache = fs.readFileSync(mustachePath + 'viewer.mustache').toString();
app.get('/viewer/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();

    response.writeHead(200, {
      'Content-Type': 'text/html',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
    });

    var view = {
      className: className,
      // ***
      list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
    };
    var html = Mustache.render(viewerMustache, view, {
      partial: authenticatedPartial
    });
    response.end(html);
  });

var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
app.get('search/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    /*        html = Mustache.render(mustacheFile, {
          list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
        }, {
            partial: authenticatedPartial
          })
    */
    var view = {
      className: className,
      exampleTerm: exampleTerms[className],
      // ***
      list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
    };
    var html = Mustache.render(searchMustache, view, {
      partial: authenticatedPartial
    });
    response.end(html);
  });

app.get('/Video/:fileName', function (request, response) {
  var file = path.resolve(__dirname + "/Video/", request.params.fileName + ".mp4");
  var range = request.headers.range;
  var positions = range.replace(/bytes=/, "").split("-");
  var start = parseInt(positions[0], 10);

  fs.stat(file, function (err, stats) {
    var total = stats.size;
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    var chunksize = (end - start) + 1;

    response.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    });

    var stream = fs.createReadStream(file, { start: start, end: end })
      .on("open", function () {
        stream.pipe(response);
      }).on("error", function (err) {
        response.end(err);
      });
  });
});

var captionsMapping = {
  "cs241": require('./public/javascripts/data/captions/cs241.js'),
  "cs225": require('./public/javascripts/data/captions/cs225.js'),
  "cs225-sp16": require('./public/javascripts/data/captions/cs225-sp16.js'),
  "chem233-sp16": require('./public/javascripts/data/captions/chem233-sp16.js'),
  "adv582": require('./public/javascripts/data/captions/adv582.js'),
  "ece210": require('./public/javascripts/data/captions/ece210.js'),
  "cs446-fa16": require('./public/javascripts/data/captions/cs446-fa16.js'),
}

app.get('/captions/:className/:index', function (request, response) {
  var className = request.params.className.toLowerCase();
  var captions = captionsMapping[className];

  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  var index = parseInt(request.params.index);
  response.end(JSON.stringify({ captions: captions[index] }));
});

var thirtyMinsInMilliSecs = 30 * 60 * 1000;
//setInterval(clearInactiveTranscriptions, thirtyMinsInMilliSecs);

client.on("monitor", function (time, args, raw_reply) {
  console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
});

client.on('error', function (error) {
  console.log('redis error');
});

require('./router')(app);

var httpsPort = 7443;
var httpPort = 7080;

var options = {
  key: fs.readFileSync("./cert/cert/key.pem"),
  cert: fs.readFileSync("./cert/cert/cert.pem")
};

app.listen(httpsPort, function() {
console.log("Listening on " + httpsPort);
});

/*
var httpsServer = https.createServer(options, app);

httpsServer.listen(httpsPort, function () {
  console.log("Listening on 192.17.96.13:" + httpsPort);
});*/
