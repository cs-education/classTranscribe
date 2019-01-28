/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const router = express.Router();
const fs = require('fs');
const passwordHash = require('password-hash');
const passwordValidator = require('password-validator');
const db = require('../../db/db');
const utils = require('../../utils/logging');
const perror = utils.perror;
const info = utils.info;
const log = utils.log;

// Get the mustache page that will be rendered for the changePassword route
//var changePasswordMustache = fs.readFileSync(mustachePath + 'changePassword.mustache').toString();

// Render the changePassword mustache page; if account is authenticated just password in settings page
router.get('/changePassword', function (request, response) {
  if (request.isAuthenticated()) {
    response.writeHead(200, {
      'Content-Type': 'text.html'
    });
    renderWithPartial(Mustache.getMustacheTemplate('changePassword.mustache'), request, response);
  } else {
    var email = request.query.email;

    // Check if email is already in the database
    db.getUserByEmail(email).then(result => {
      // Display error if the account does not exist
      if (!result) {
        //TODO: ADD 404 PAGE
        var error = 'Account does not exist';
        perror(error);
        response.status(404).send({message : error});
      } else {
        var userInfo = result;
        if (!userInfo.verified) {
          var error = 'Account is not verified';
          perror(error);
          response.send({message : error});
          /* passwordToken does not match */
        } else if ((request.query.id != '') && (userInfo.passwordToken != request.query.id)) {
          var error = "Incorrect reset password link.";
          perror(error);
          response.send({message : error});
        } else {
          response.writeHead(200, {
            'Content-Type': 'text.html'
          });

          /* login first for user who forgot password */
          if (request.query.id) {
            request.logIn(userInfo, function(err) {
            perror(err);
            });
          }

          renderWithPartial(Mustache.getMustacheTemplate('changePassword.mustache'), request, response);
        }
      }
    }).catch(err => perror(err)); /* db.getUserByEmail() */
  }
});

// Change user information in database after the form is submitted
router.post('/changePassword/submit', function (request, response) {

  if (request.isAuthenticated()) {
    var password = request.body.password;
    var re_password = request.body.re_password;
    var userInfo = request.user;
    // Pattern schema for valid password
    var schema = new passwordValidator();
    schema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces()                           // Should not have spaces

    // Check that the two passwords are the same
    if (password != re_password) {
        var error = "Passwords are not the same";
        perror(error);
        response.send({ message: error, html: '' });
    } else {
      // Check if password follows pattern schema
      var valid_pattern = schema.validate(password)
      if (valid_pattern != true) {
        var error = "Password must have at least 8 character, an uppercase letter, a lowercase leter, a digit, and no spaces.";
        perror(error);
        response.send({ message: error, html: '' });
      } else {
        // Salt and hash password before putting into redis database
        var hashedPassword = passwordHash.generate(password);

        db.setUserPassword(hashedPassword, userInfo.mailId).then(() => {
          response.send({ message: 'success', html: '../dashboard' })
        }).catch(err => perror(err)); /* db.setUserPassword() */
      }
    }
  } else {
    response.send({ message: 'Not Authenticated', html: '../login' })
  }
});

module.exports = router;
