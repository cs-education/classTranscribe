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

// Create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "classtranscribenoreply@gmail.com",
        pass: "classtranscribe12345"
    }
});

var signupMustache = fs.readFileSync(mustachePath + 'signup.mustache').toString();

router.get('/signup', function(request, response) {
    if (request.isAuthenticated()) {
        response.redirect('../dashboard');
    } else {
        response.writeHead(200, {
            'Content-Type': 'text.html'
        });
        renderWithPartial(signupMustache, request, response);
    }
});

router.post('/signup/submit', function(request, response) {
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;
    var email = request.body.email;
    var password = request.body.password;
    var re_password = request.body.re_password;

    // console.log(password)
    // console.log(re_password)

    // Check that the two passwords are the same
    if (password != re_password) {
        var error = "Passwords are not the same";
        console.log(error);
        response.send({ message: error, html: '' });
    } else {
        // Check if email is already in the database
        client.hgetall("ClassTranscribe::Users::" + email, function(err, obj) {
            if (obj) {
                var error = "Account already exists";
                console.log(error);
                response.send({message: error, html: ''});
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
                ], function (err, results) {
                    if (err) console.log(err)
                    console.log(results);

                    // Send email to verify .edu account
                    var mailOptions = {
                        from: "ClassTranscribe <classtranscribenoreply@gmail.com>", // ClassTranscribe no-reply email
                        to: email, // receiver who signed up for ClassTranscribe
                        subject: 'Welcome to ClassTranscribe', // subject line of the email
                        text: 'Please verify your email by clicking this link.', // TODO: will include verification link
                    };

                    transporter.sendMail(mailOptions,(error, response)=> {
                        if (err) console.log(err)
                        console.log("Send mail status: " + response);
                    });
                });
            }
        })
    }
    // Check if email is already in the database
    client.hgetall("ClassTranscribe::Users::" + email, function(err, obj) {
        if (obj) {
            var error = "Account already exists";
            console.log(error);
            // response.send(error);
            response.end();
        } else {
            // TODO: authenticate password before putting into redis database

            // Add new user to database
            client.hmset("ClassTranscribe::Users::" + email, [
                'first_name', first_name,
                'last_name', last_name,
                'password', password,
                'university', getUniversity(email),
                'verified', false,
                'Courses as Instructor','',
                'Courses as TA','',
                'Courses as Student',''
            ], function(err, results) {
                if (err) console.log(err)
                console.log(results);
                // TODO: send email to verify .edu account
                response.redirect('../login');
            });
        }
    });
});

function getUniversity(email){
    var domain = email.split('@')[1]
    var data = JSON.parse(fs.readFileSync('./utils/world_universities_and_domains.json'))
    for (var i = 0; i < data.length; i++){
        if (data[i].domains[0] == domain){
            return data[i].name
        }
    }
}


module.exports = router;