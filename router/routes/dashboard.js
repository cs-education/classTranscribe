/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');

// Get the mustache page that will be rendered for the dashboard route
var dashboardMustache = fs.readFileSync(mustachePath + 'dashboard.mustache').toString();

// Render the dashboard mustache page; if account is not authenticated, redirect to homepage
router.get('/dashboard', function (request, response) {
    if (request.isAuthenticated()) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        // Obtain user information to display user data
        var email = request.user.email;
        var user = email.substr(0, email.indexOf('@'));
        var html = Mustache.render(dashboardMustache, { user: user });

        response.end(html);
    } else {
        response.redirect('../');
    }
});

module.exports = router;
