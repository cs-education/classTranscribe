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
const info = utils.info;
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
      }); /* client.getUserByEmail() */
    }
));

const permission = require('./modules/permission');

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
            client.getUserByGoogleId(profile.id).then(result => {

                // Display error if the account does not exist
                if (!result) {
                    // if the user isnt in our database, create a new user
                    // set all of the relevant information
                    var googleInfo = {
                        googleId: profile.id,
                        verifiedId: token,
                        mailId: profile.emails[0].value, // pull the first email
                        firstName: profile.name.givenName,
                        lastName : profile.name.familyName,
                        university : getUniversity(profile.emails[0].value)
                    };

                    /* restrict illinois user only */
                    if (googleInfo.mailId.replace(/.*@/, '') != 'illinois.edu') {
                      return done(null, false, {message: 'Please Login via Your Illinois Account'});
                    }

                    client.createUser( googleInfo ).then(
                        result => {
                            var userInfo = result;
                            permission.addUser(userInfo.mailId);
                            client.verifyUser(userInfo.verifiedId, userInfo.mailId).then(
                              result => {

                                return done(null, userInfo);
                              })
                              .catch(err => {
                                perror(err);
                                /* error occur */
                                return done(null,false, {message: 'Something went wrong, please try again'});
                              });
                        })
                        .catch(err => {
                          perror(err);
                          return done(null,false, {message: 'Something went wrong, please try again'});
                      });
                } else {
                    var userInfo = result;
                    // Return the user if the login value matches the database
                    return done(null, userInfo, {message: 'User is found'});
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
          return done(null,false,{message: 'no user found'})
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

// same function in router/signup.js
// Look up and return the university name from the email domain name
// Data file comes from https://github.com/Hipo/university-domains-list
function getUniversity(email) {
    var domain = email.split('@')[1];
    var data = JSON.parse(fs.readFileSync('./utils/world_universities_and_domains.json'));
    for (var i = 0; i < data.length; i++) {
        if (data[i].domains[0] == domain) {
            return data[i].name;
        }
    }
    return "Unknown University";
}
