/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var client = require('./../../modules/redis');
var crypto = require('crypto');

// Variables that will be passed into the command line when running containers
var nodemailer = require('nodemailer');
var mailID = process.env.EMAIL_ID;
var mailPass = process.env.EMAIL_PASS;

if (!mailID) throw "Need a gmail address in environmental variables!";
if (!mailPass) throw "Need a password in environmental variables!";

// Create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: mailID,
      pass: mailPass
    }
});

// Get the mustache page that will be rendered for the resetPassword route
var resetPasswordMustache = fs.readFileSync(mustachePath + 'resetPassword.mustache').toString();

// Render the resetPassword mustache page
router.get('/resetPassword', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(resetPasswordMustache, request, response);
});

// Reset password and change in database after form is submitted
router.post('/resetPassword/submit', function(request, response) {
    // Get the current user's data to access information in database
    var email = request.body.email;

    // Check if email is already in the database
    client.hgetall("ClassTranscribe::Users::" + email, function(err, obj) {
        // Display error when account does not exist in the database
        if (!obj) {
            var error = "Account does not exist";
            console.log(error);
            response.send({ message: error, html: '' });
        } else {
            // Redirect user to new mustache web with a note to check their email
            response.send({ message: 'success', html: '../accountRecovery' })

            // Generate a unique link specific to the user
            crypto.randomBytes(48, function(err, buffer) {
                var token = buffer.toString('hex');
                var host = request.get('host');
                var link = "https://" + host + "/changePassword?email=" + email + "&id=" + token;

                // Send email to reset password
                var mailOptions = {
                    from: 'ClassTranscribe Team <' + mailID + '>', // ClassTranscribe no-reply email
                    to: email, // receiver who signed up for ClassTranscribe
                    subject: 'ClassTranscribe Password Reset', // subject line of the email
                    html: 'Hi, <br><br> We have just received a password reset request for ' + email + '. Please click this <a href=' + link + '>link</a> to reset your password. <br><br> Thanks! <br> ClassTranscribe Team'
                };

                // Add the token ID to database to check it is linked with the user
                client.hmset("ClassTranscribe::Users::" + email, [
                    'change_password_id', token
                ], function(err, results) {
                    if (err) console.log(err)
                    console.log(results);
                });

                // Send the custom email to the user
                transporter.sendMail(mailOptions, (error, response) => {
                    if (err) console.log(err)
                    console.log("Send mail status: " + response);
                });
            });

            response.end();
        }
    });
});

module.exports = router;