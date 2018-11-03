/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const router = express.Router();
const fs = require('fs');
const verifier = require('email-verify');
const passwordHash = require('password-hash');
const passwordValidator = require('password-validator');
const crypto = require('crypto');

// Variables that will be passed into the command line when running containers
const nodemailer = require('nodemailer');
const mailID = process.env.EMAIL_ID;
const mailPass = process.env.EMAIL_PASS;

if (!mailID) throw "Need a gmail address in environmental variables!";
if (!mailPass) throw "Need a password in environmental variables!";

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: mailID,
        pass: mailPass
    }
});

const client_api = require('../../db/db');
const permission = require('./permission');

// Get the mustache page that will be rendered for the signup route
const signupMustache = fs.readFileSync(mustachePath + 'signup.mustache').toString();

// Render the signup mustache page; if account is authenticated, just bring user to dashboard
router.get('/signup', function (request, response) {
    if (request.isAuthenticated()) {
        response.redirect('../dashboard');
    } else {
        response.writeHead(200, {
            'Content-Type': 'text.html'
        });
        renderWithPartial(signupMustache, request, response);
    }
});

// Add new user information to database after the form is submitted
router.post('/signup/submit', function (request, response) {
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;
    var email = request.body.email;
    var password = request.body.password;
    var re_password = request.body.re_password;

    // Pattern schema for valid password
    var schema = new passwordValidator();
    schema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces()                           // Should not have spaces

    // Check if email address exists
    verifier.verify(email, function(err, info) {
      if ( err ) console.log(err);
      else {
        var isInvalid = info.info.includes("invalid");
        if (isInvalid == true) {
          var error = "Email does not exist";
          console.log(error);
          response.send({ message: error, html: '' });
        } else {
          // Check that the two passwords are the same
          if (password != re_password) {
            var error = "Passwords are not the same";
            console.log(error);
            response.send({ message: error, html: '' });
          } else {
            // Check if email is already in the database
            client_api.getUserByEmail(email).then(result => {
              if (!result) {
                console.log('email not found in db');
                var valid_pattern = schema.validate(password);
                if (valid_pattern != true) {
                  var error = "Password must have at least 8 character, an uppercase letter, a lowercase leter, a digit, and no spaces.";
                  console.log(error);
                  response.send({message: err, html: ''});
                }

                // Generate a unique link specific to the user
                crypto.randomBytes(48, function (err, buffer) {
                  var token = buffer.toString('hex');
                  var host = request.get('host');
                  var link = 'https://' + host + '/verify?email=' + email + '&id=' + token;

                  // Salt and hash password before putting into redis database
                  var hashedPassword = passwordHash.generate(password);

                  // Send email to verify .edu account
                  var mailOptions = {
                    from: 'ClassTranscribe Team <' + mailID + '>', // ClassTranscribe no-reply email
                    to: email, // receiver who signed up for ClassTranscribe
                    subject: 'Welcome to ClassTranscribe', // subject line of the email
                    html: 'Hi ' + first_name + ' ' + last_name + ', <br><br> Thanks for registering at ClassTranscribe. Please verify your email by clicking this <a href=' + link + '>link</a>. <br><br> Thanks! <br> ClassTranscribe Team',
                  };

                  var userInfo = {
                    mailId : email,
                    firstName : first_name,
                    lastName : last_name,
                    password : hashedPassword,
                    university : getUniversity(email),
                    verifiedId : token,
                  };

                  client_api.createUser(userInfo).then(result => {
                    permission.addUser(result[0].dataValues.id);

                    transporter.sendMail(mailOptions, (err, response) => {
                      if (err) console.log(err);
                      console.log('response:', response);
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    response.send({message: err, html: ''});
                  }); /* end of catch for createUser() */
                }) /* end of encryption */
              } else {
                var err = 'Account already exists';
                console.log(err);
                response.send({message: err, html: ''});
              }
            })
            .catch(err => { console.log(err) }); /* end of getUserByEmail() */
            response.send({ message: 'success', html: '../login' });
          }
        }
      }/* end of else statement of verify */
    })/* end of verifier */
  });/* end of request */

// Get the mustache page that will be rendered for the verify route
var verifyMustache = fs.readFileSync(mustachePath + 'verify.mustache').toString();

router.get('/verify', function (request, response) {
    // Get the current user's data to access information in database
    var email = request.query.email;

    client_api.getUserByEmail(email).then(result => {

      // User is not found in db
      if (!result) {
        //TODO: ADD 404 PAGE
        var error = 'Account does not exist';
        console.log(error);
        response.status(404).send({message : error});
      }

      var userInfo = result.dataValues;
      // User has been verified already
      if (userInfo.verified) {
        var error = 'Email is already verified';
        console.log(error);
        response.send({message : error, html: '/login'});
      }

      // Display error if the generated unique link does not match the user
      if (userInfo.verifiedId !== request.query.id) {
        var error = 'verifyId is not matched';
        console.log(error);
        response.sned({message : error, html: '/login'});
      }

      // Verify user
      client_api.verifyUser(userInfo.verifiedId, email).then(result => {
        // Render the verify mustache page
        response.writeHead(200, {
            'Content-Type': 'text.html'
        });
        renderWithPartial(verifyMustache, request, response);
      })
      .catch(err => {
        console.log(err);
        response.send({message : err, html: ''});
      })/* catch verifyUser() error */

    })
    .catch(err=> {
      console.log(err);
      response.send({message :err, html : ''});
    })/* catch getUserByEmail() error */
});

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

module.exports = router;
