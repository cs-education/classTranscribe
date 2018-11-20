/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var saml = require('passport-saml');
var passwordHash = require('./node_modules/password-hash/lib/password-hash');

var CALLBACK_URL = "https://192.17.96.13:" + (process.env.CT_PORT || 7443) + "/login/callback"
var ENTRY_POINT = "https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO";
var ISSUER = 'ClassTranscribe4927/';

// Currently, I don't think this logout url is being used.
// var LOGOUT_URL = "https://www.testshib.org/.sso/Logout";

var KEY = fs.readFileSync('./cert/cert/key.pem');
var CERT = fs.readFileSync('./cert/cert/cert.pem');

const client = require('./db/db');
const utils = require('./utils/logging');
const log = utils.log;
const perror = utils.perror;

samlStrategy = new saml.Strategy({
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: CALLBACK_URL,
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: ENTRY_POINT,
    // Usually specified as `/` from site root
    issuer: ISSUER,
    // logoutUrl: LOGOUT_URL,
    identifierFormat: null,
    decryptionPvk: KEY,   // SP private key
    privateCert: KEY, //SP certiticate
    cert: fs.readFileSync('./cert/cert/idp_cert.pem', 'utf8'),    //IdP public key
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
    forceAuthn: true,
    isPassive: false,
    additionalParams: {}
}, function (profile, done) {
    // These need to be saved for the logout function to work.
    usersaml = {};
    usersaml.nameID = profile["issuer"]["_"];
    usersaml.nameIDFormat = profile["issuer"]["$"];
    return done(null, profile);
});

ensureAuthenticated = function(req, res, next) {
  if (process.env.DEV == "DEV") {
    log("DEV mode: skipping login");
    return next();
  }
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    samlStrategy['Redirect'] = req['_parsedOriginalUrl']['path'];
    return res.redirect('/login');
  }
}

passport.use(samlStrategy);



// ========== current local strategy ==========
passport.use(new LocalStrategy(
    function(username, password, done) {
        // Find the user information in the database with the logged in values
        client.getUserByEmail(username).then(result=> {
          // Display error if the account does not exist
          if(!result) {
            var error = 'Account does not exist';
            perror(error);
            return done(null, false, {message : error});
          } else {
            var userInfo = result;
            // Check if the user has verified their email address
            if (!userInfo.verified) {
              var error = 'Email not verified';
              perror(error);
              return done(null, false, {message : error});
            }
            // Verify the inputted password is equivalent to the hashed password stored in the database
            var isCorrectPassword = passwordHash.verify(password, userInfo.password);
            if (!isCorrectPassword) {
              var error = "Invalid password";
              perror(error);
              return done(null, false, { message: error });
          }
          // Return the user if the login value matches the database
          return done(null, userInfo);
        }
        });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  findUser(id,function (err,res) {
      if(err){
          return done(err)
      }
      if(res){
          return done(null,res)
      }
      else{
          return done(null,false,'no user found')
      }
  })
});

function findUser(id,cb){
  client.getUserByEmail(id.mailId).then( result => {
    if(!result) {
      return cb(false,null);
    }
    return cb(false, result);
  }).catch(err => cb(err, null));
}
