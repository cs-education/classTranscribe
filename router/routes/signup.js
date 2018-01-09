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

var signupMustache = fs.readFileSync(mustachePath + 'signup.mustache').toString();

router.get('/signup', function(request, response) {
    if (request.isAuthenticated()) {
        response.redirect('../dashboard');
    } else {
        response.writeHead(200, {
            'Content-Type': 'text.html'
        });
        renderWithPartial(signupMustache, request, response);
        // console.log(mailID);
        // console.log(mailPass);
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
                response.send({ message: error, html: '' });
            } else {
                // Salt and hash password before putting into redis database
                var hashedPassword = passwordHash.generate(password);
                // console.log(hashedPassword);

                // Add new user to database
                client.hmset("ClassTranscribe::Users::" + email, [
                    'first_name', first_name,
                    'last_name', last_name,
                    'password', hashedPassword,
                    'change_password_id', '',
                    'university', getUniversity(email),
                    'verified', false,
                    'verify_id', '',
                    'courses_as_instructor','',
                    'courses_as_TA','',
                    'courses_as_student',''
                ], function (err, results) {
                    if (err) console.log(err)
                    console.log(results);

                    crypto.randomBytes(48, function(err, buffer) {
                        var token = buffer.toString('hex');
                        // console.log(token);

                        var host = request.get('host');
                        var link = "https://" + host + "/verify?email=" + email + "&id=" + token;

                        // Send email to verify .edu account
                        var mailOptions = {
                            from: 'ClassTranscribe Team <' + mailID + '>', // ClassTranscribe no-reply email
                            to: email, // receiver who signed up for ClassTranscribe
                            subject: 'Welcome to ClassTranscribe', // subject line of the email
                            html: 'Hi ' + first_name + ' ' + last_name + ', <br><br> Thanks for registering at ClassTranscribe. Please verify your email by clicking this <a href=' + link + '>link</a>. <br><br> Thanks! <br> ClassTranscribe Team',
                        };

                        // console.log(mailOptions);

                        client.hmset("ClassTranscribe::Users::" + email, [
                            'verify_id', token
                        ], function(err, results) {
                            if (err) console.log(err)
                            console.log(results);
                        });

                        transporter.sendMail(mailOptions,(error, response)=> {
                            if (err) console.log(err)
                            console.log("Send mail status: " + response);
                        });
                    });

                    response.send({ message: 'success', html: '../login' })
                });
            }
        })
    }
});

var verifyMustache = fs.readFileSync(mustachePath + 'verify.mustache').toString();

router.get('/verify', function (request, response) {
    email = request.query.email

    client.hgetall("ClassTranscribe::Users::" + email, function(err, usr) {
        if (!usr) {
            var error = "Account does not exist.";
            console.log(error);
            response.end();
            // TODO: ADD 404 PAGE
        } else {
            // Check if the user verify link id matches the email
            client.hget("ClassTranscribe::Users::" + email, "verify_id", function(err, obj) {
                if (obj != request.query.id) {
                    var error = "Email is not verified.";
                    console.log(error);
                    response.end();
                    // TODO: ADD 404 PAGE
                } else {
                    // Change email as verified
                    client.hmset("ClassTranscribe::Users::" + email, [
                        'verified', true,
                        'verify_id', ''
                    ], function(err, results) {
                        if (err) console.log(err)
                        console.log(results);
                    });
                    console.log("Email is verified.")

                    response.writeHead(200, {
                        'Content-Type': 'text.html'
                    });
                
                    renderWithPartial(verifyMustache, request, response);
                }   
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