/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var client = require('./../../modules/redis');

var dashboardMustache = fs.readFileSync(mustachePath + 'dashboard.mustache').toString();

router.get('/dashboard', function (request, response) {
    if (request.isAuthenticated()) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        // var name = '';
        // client.hget("ClassTranscribe::Users::" + request.user.username, "first_name", function(err, obj) {
        //     if (obj) {
        //         console.log(obj)
        //         name += obj
        //     }
        // });
        // client.hget("ClassTranscribe::Users::" + request.user.username, "last_name", function(err, obj) {
        //     if (obj) {
        //         console.log(obj)
        //         name += obj
        //     }
        // });
        // console.log(name)

        var email = request.user.email
        var user = email.substr(0, email.indexOf('@'))
        var html = Mustache.render(dashboardMustache, { user: user });
        
        response.end(html);
    } else {
        response.redirect('../');
    }
});

module.exports = router;