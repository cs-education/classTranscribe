/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var client = require('./../../modules/redis');
var passwordHash = require('password-hash');
var nodemailer = require('nodemailer');

var signupMustache = fs.readFileSync(mustachePath + 'signup.mustache').toString();

router.get('/signup', function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(signupMustache, request, response);
});

router.post('/signup/submit', function(request, response) {
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;
    var email = request.body.email;
    var password = request.body.password;
    var re_password = request.body.re_password;

    // Check that the two passwords are the same
    if (password != re_password) {
        var error = "Passwords are not the same";
        console.log(error);
        response.end();
    } else {
        // Check if email is already in the database
        client.hgetall("ClassTranscribe::Users::" + email, function(err, obj) {
            if (obj) {
                var error = "Account already exists";
                console.log(error);
                response.end();
            } else {
                // Salt and hash password before putting into redis database
                var hashedPassword = passwordHash.generate(password);
                // console.log(hashedPassword);

                // Add new user to database
                client.hmset("ClassTranscribe::Users::" + email, [
                    'first_name', first_name,
                    'last_name', last_name,
                    'password', hashedPassword, 
                    'verified', false
                ], function(err, results) {
                    if (err) console.log(err)
                    console.log(results);
                    // TODO: send email to verify .edu account
                    response.redirect('../login');
                });
            }
        });
    }
});

module.exports = router;