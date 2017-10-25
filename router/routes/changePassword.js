/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var client = require('./../../modules/redis');

var changePasswordMustache = fs.readFileSync(mustachePath + 'changePassword.mustache').toString();

router.get('/changePassword', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(changePasswordMustache, request, response);
});

router.post('/changePassword', function (request, response) {
    var email = request.body.email;
    var password = request.body.password;
    var re_password = request.body.re_password;

    // Check that the two passwords are the same
    if (password != re_password) {
        console.log('Passwords are not the same');
        response.redirect('/changePassword');
    } else {
        // TODO: authenticate password before putting into redis database

        // Change user password in database
        client.hmset(email, [
            'password', password
        ], function(err, results) {
            if (err) console.log(err)
            console.log(results);
            response.redirect('./login');
        });
    }
});

module.exports = router;