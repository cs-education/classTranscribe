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

var resetPasswordMustache = fs.readFileSync(mustachePath + 'resetPassword.mustache').toString();

router.get('/resetPassword', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(resetPasswordMustache, request, response);
});

router.post('/resetPassword/submit', function(request, response) {
    var email = request.body.email;

    // Check if email is already in the database
    client.hgetall("ClassTranscribe::Users::" + email, function(err, obj) {
        if (!obj) {
            var error = "Account does not exist";
            console.log(error);
            response.send({ message: error, html: '' });
        } else {
            response.send({ message: 'success', html: '../accountRecovery' })

            crypto.randomBytes(48, function(err, buffer) {
                var token = buffer.toString('hex');
                // console.log(token);

                var host = request.get('host');
                var link = "https://" + host + "/changePassword?email=" + email + "&id=" + token;

                // Send email to reset password
                var mailOptions = {
                    from: 'ClassTranscribe Team <' + mailID + '>', // ClassTranscribe no-reply email
                    to: email, // receiver who signed up for ClassTranscribe
                    subject: 'ClassTranscribe Password Reset', // subject line of the email
                    html: 'Hi, <br><br> We have just received a password reset request for ' + email + '. Please click this <a href=' + link + '>link</a> to reset your password. <br><br> Thanks! <br> ClassTranscribe Team'
                };

                client.hmset("ClassTranscribe::Users::" + email, [
                    'change_password_id', token
                ], function(err, results) {
                    if (err) console.log(err)
                    console.log(results);
                });

                transporter.sendMail(mailOptions, (error, response) => {
                    if (err) console.log(err)
                    // console.log("Send mail status: " + response);
                });
            });

            response.end();
        }
    });
});

module.exports = router;