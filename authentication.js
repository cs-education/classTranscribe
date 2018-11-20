/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var passwordHash = require('./node_modules/password-hash/lib/password-hash');

// Currently, I don't think this logout url is being used.
// var LOGOUT_URL = "https://www.testshib.org/.sso/Logout";

const client = require('./db/db');
const utils = require('./utils/logging');
const log = utils.log;
const perror = utils.perror;

ensureAuthenticated = function(req, res, next) {
  if (process.env.DEV == "DEV") {
    log("DEV mode: skipping login");
    return next();
  }
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    return res.redirect('/login');
  }
}



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


var testInfo = {
    university: 'test uni',
    verifiedId: 'sample-verification-buffer',
};
const permission = require('./router/routes/permission');

var configAuth = require('./config/auth');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: configAuth.googleAuth.callbackURL,

},
    function (token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function () {
            console.log(profile);
            client.getUserByGoogleId(profile.id).then(result => {
                // Display error if the account does not exist
                if (!result) {

                    // if the user isnt in our database, create a new user
                    // set all of the relevant information
                    testInfo.google = {
                        id: profile.id,
                        token: token,
                        name: profile.displayName,
                        email: profile.emails[0].value // pull the first email
                    };
                    testInfo.mailId = profile.emails[0].value;
                    testInfo.firstName = profile.name.givenName;
                    testInfo.lastName = profile.name.familyName;


                    client.createUser(testInfo).then(
                        result => {
                            var userInfo = result;
                            permission.addUser(userInfo.mailId);
                            return client.verifyUser('sample-verification-buffer', 'testing@testdomabbccc.edu');
                        })
                        .catch(err => { perror(err); });
                    return done(null, testInfo);
                } else {
                    var userInfo = result;
                    // Return the user if the login value matches the database
                    return done(null, userInfo);
                }
            });
        });

    }));


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
