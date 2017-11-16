/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var client = require('./../../modules/redis');

var nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "classtranscribenoreply@gmail.com",
        pass: "classtranscribe12345"
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
            response.end();
        } else {
            response.redirect('../accountRecovery');
            
            // Send email to reset password
            var mailOptions = {
                from: "ClassTranscribe <classtranscribenoreply@gmail.com>", // ClassTranscribe no-reply email
                to: email, // receiver who signed up for ClassTranscribe
                subject: 'ClassTranscribe Password Reset', // subject line of the email
                text: 'Please click here to reset your password.', // TODO: will include changePassword link
            };

            transporter.sendMail(mailOptions, (error, response) => {
                if (err) console.log(err)
                console.log("Send mail status: " + response);
            });

            response.end();
        }
    });
});

module.exports = router;