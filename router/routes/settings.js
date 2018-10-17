/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
// var client = require('./../../modules/redis');

var client_api = require('./db');
// var api = require('./api');
// var client_api = new api();

var settingsMustache = fs.readFileSync(mustachePath + 'settings.mustache').toString();

router.get('/settings', function(request, response) {
    if (request.isAuthenticated()) {
        response.writeHead(200, {
            'Content-Type': 'text.html'
        });

        client_api.getFirstName(request.user.email, function(err, obj) {
        // client.hget("ClassTranscribe::Users::" + request.user.email, "first_name", function(err, obj) {
            if (obj) {
                var first_name = obj;
                client_api.getLastName(request.user.email, function(err, obj) {
                // client.hget("ClassTranscribe::Users::" + request.user.email, "last_name", function(err, obj) {
                    if (obj) {
                        var last_name = obj;
                        // console.log(first_name + ' ' + last_name)

                        var html = Mustache.render(settingsMustache, { first_name: first_name, last_name: last_name });
                        response.end(html);
                    }
                });
            }
        });
    } else {
        response.redirect('../');
    }
});

router.post('/settings/submit', function(request, response) {
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;
    var email = request.user.email;

    // Edit user information in database
    client_api.setName(email, [first_name, last_name], function(err, results) {
    // client.hmset("ClassTranscribe::Users::" + email, [
    //     'first_name', first_name,
    //     'last_name', last_name,
    // ], function (err, results) {
        if (err) console.log(err)
        console.log(results);
        response.send({ message: 'success', html: '../dashboard' })
    });
});

module.exports = router;
