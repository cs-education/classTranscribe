/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var passwordHash = require('password-hash');
var passwordValidator = require('password-validator');

// Get the mustache page that will be rendered for the changePassword route
var changePasswordMustache = fs.readFileSync(mustachePath + 'changePassword.mustache').toString();
var email;

var client_api = require('./db');
// var api = require('./api');
// var client_api = new api();

// Render the changePassword mustache page; if account is authenticated just password in settings page
router.get('/changePassword', function (request, response) {
    if (request.isAuthenticated()) {
        email = request.user.email;

        response.writeHead(200, {
            'Content-Type': 'text.html'
        });
        renderWithPartial(changePasswordMustache, request, response);
    } else {
        email = request.query.email;

        // Check if email is already in the database
        client_api.getUserByEmail(email, function(err, usr) {
        // client.hgetall("ClassTranscribe::Users::" + email, function (err, usr) {
            // Display error if the account does not exist
            if (!usr) {
                var error = "Account does not exist.";
                console.log(error);
                response.end();
                // TODO: ADD 404 PAGE
            } else {
                // Check if the user reset password link ID matches the email
                client_api.validUserID(email, function(err, obj) {
                // client.hget("ClassTranscribe::Users::" + email, "change_password_id", function (err, obj) {
                    // Display error if the generated unique link does not match the user
                    // Change the info in the database if the unique link matches
                    if (obj != request.query.id) {
                        var error = "Incorrect reset password link.";
                        console.log(error);
                        response.end();
                        // TODO: ADD 404 PAGE
                    } else {
                      client_api.setPasswordID(email, "", function(err, results) {
                        // client.hmset("ClassTranscribe::Users::" + email, [
                        //     'change_password_id', ''
                        // ], function (err, results) {
                            if (err) console.log(err)
                            console.log(results);
                        });

                        // Render the changePassword mustache page
                        response.writeHead(200, {
                            'Content-Type': 'text.html'
                        });
                        renderWithPartial(changePasswordMustache, request, response);
                    }
                });
            }
        });
    }
});

// Change user information in database after the form is submitted
router.post('/changePassword/submit', function (request, response) {
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

    console.log(email)

    // Check that the two passwords are the same
    if (password != re_password) {
        var error = "Passwords are not the same";
        console.log(error);
        response.send({ message: error, html: '' });
    } else {
        // Check if password follows pattern schema
        var valid_pattern = schema.validate(password)
        if (valid_pattern != true) {
            var error = "Password must have at least 8 character, an uppercase letter, a lowercase leter, a digit, and no spaces.";
            console.log(error);
            response.send({ message: error, html: '' });
        } else {
            // Salt and hash password before putting into redis database
            var hashedPassword = passwordHash.generate(password);

            // Change user password in database
            client_api.setPassword(email, hashedPassword, function(err,result) {
            // client.hmset("ClassTranscribe::Users::" + email, [
            //     'password', hashedPassword
            // ], function (err, results) {
                if (err) console.log(err)
                console.log(result);
                if (request.isAuthenticated()) {
                    response.send({ message: 'success', html: '../settings' })
                } else {
                    response.send({ message: 'success', html: '../login' })
                }
            });
        }
    }
});

module.exports = router;
