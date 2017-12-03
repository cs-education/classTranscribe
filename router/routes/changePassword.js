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

var changePasswordMustache = fs.readFileSync(mustachePath + 'changePassword.mustache').toString();

router.get('/changePassword', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(changePasswordMustache, request, response);
});

router.post('/changePassword/submit', function (request, response) {
    var email = request.body.email;
    var password = request.body.password;
    var re_password = request.body.re_password;

    // Check that the two passwords are the same
    if (password != re_password) {
        var error = "Passwords are not the same";
        console.log(error);
        response.send({ message: error, html: '' });
    } else {
        // Salt and hash password before putting into redis database
        var hashedPassword = passwordHash.generate(password);
        // console.log(hashedPassword);

        // Change user password in database
        client.hmset("ClassTranscribe::Users::" + email, [
            'password', hashedPassword
        ], function(err, results) {
            if (err) console.log(err)
            console.log(results);
            response.send({ message: 'success', html: '../login' })
        });
    }
});

module.exports = router;