/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var client = require('./../../modules/redis');

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
            // TODO: send email with unique link to reset password
            // html template, changePassword.mustache
        }
    });
});

module.exports = router;