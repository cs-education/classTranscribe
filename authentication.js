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
    console.log("Skipping login");
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
            console.log(error);
            return done(null, false, {message : error});
          } else {
            var userInfo = result.dataValues;
            // Check if the user has verified their email address
            if (!userInfo.verified) {
              var error = 'Email not verified';
              console.log(error);
              return done(null, false, {message : error});
            }
            // Verify the inputted password is equivalent to the hashed password stored in the database
            var isCorrectPassword = passwordHash.verify(password, userInfo.password);
            if (!isCorrectPassword) {
              var error = "Invalid password";
                              console.log(error);
              return done(null, false, { message: error });
          }
          // Return the user if the login value matches the database
          return done(null, userInfo);
        }

        // client.get("ClassTranscribe::UserLookupTable::" + username, function(err, usr) {
        //     // Display error if the account does not exist
        //     if (!usr) {
        //         var error = "Account does not exist";
        //         console.log(error);
        //         return done(null, false, { message: error });
        //     } else {
        //         var username = usr;
        //         // Check if the user is verified their email address
				// client.hget("ClassTranscribe::Users::" + username, "verified", function(err, obj) {
        //             console.log("Is the email verified? " + obj);
        //             // Display error if email has not been verified
				// 	if (obj != "true") {
				// 		var error = "Email not verified";
        //                 console.log(error);
				// 		return done(null, false, { message: error });
				// 	} else {
						// Verify the inputted password is equivalent to the hashed password stored in the database
						// client.hget("ClassTranscribe::Users::" + username, "password", function(err, obj) {
						// 	var isCorrectPassword = passwordHash.verify(password, obj)
            //                 console.log("Do the passwords match? " + isCorrectPassword);
            //                 // Display error if password does not match the one stored in the database
						// 	if (!isCorrectPassword) {
						// 		var error = "Invalid password";
            //                     console.log(error);
						// 		return done(null, false, { message: error });
						// 	} else {
            //     // Return the user if the login value matches the database
						// 		var suser = { firstname: usr['first_name'], lastname: usr['last_name'], email: username, verified: usr['verified'], university: usr['university'] };
						// 		return done(null, suser);
						// 	}
						// });
				// 	}
				// });
        //     }
        });
    }
));

passport.serializeUser(function(user, done) {
  console.log(user)
  console.log('++++++++++++++++++++++++++++++++')
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  console.log(id)
  console.log('_____________________________________________--')
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
    return cb(false, result.dataValues);
  }).catch(err => cb(err, null));
    // client.hgetall("ClassTranscribe::Users::" + id, function(err, usr) {
    //     if(err){
    //         return cb(err,null)
    //     }
    //     if (!usr) {
    //         cb(false,null)
    //     }
    //     else {
    //         var user = { firstname: usr['first_name'], lastname: usr['last_name'], email: id, verified:usr['verified'], university:usr['university'] };
    //         cb(false,user)
    //     }
    // });
}
