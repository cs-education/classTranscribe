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

var settingsMustache = fs.readFileSync(mustachePath + 'settings.mustache').toString();

router.get('/settings', function(request, response) {
    if (request.isAuthenticated()) {
        response.writeHead(200, {
            'Content-Type': 'text.html'
        });
        renderWithPartial(settingsMustache, request, response);
    } else {
        response.redirect('../');
    }
});

router.post('/settings/submit', function(request, response) {
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;
    var email = request.user.email
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
        console.log(hashedPassword);

        // Edit user information in database
        client.hmset("ClassTranscribe::Users::" + email, [
            'first_name', first_name,
            'last_name', last_name,
            'password', hashedPassword,
        ], function (err, results) {
            if (err) console.log(err)
            console.log(results);
            response.send({ message: 'success', html: '../dashboard' })
        });
    }
});

module.exports = router;