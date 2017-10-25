/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var client = require('./../../modules/redis');

var loginMustache = fs.readFileSync(mustachePath + 'login.mustache').toString();

router.get('/login', function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(loginMustache, request, response);
});

router.post('/login', function(request, response) {
    var email = request.body.email;
    var password = request.body.password;

    // Check if email is already in the database
    client.hgetall(email, function(err, obj) {
        if (!obj) {
            console.log('Account does not exist');
            response.redirect('/login');
        } else {
            // Verify the inputted password is same equal to the password stored in the database
            client.hget(email, "password", function(err, obj) {
                if (obj != password) {
                    console.log('Invalid password');
                    response.redirect('/login');
                } else {
                    response.redirect('./dashboard');
                }
            });
        }   
    });
});

module.exports = router;