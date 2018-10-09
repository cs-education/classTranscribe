/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
// var client = require('./../../modules/redis');

// Get the mustache page that will be rendered for the accountRecovery route
var accountRecoveryMustache = fs.readFileSync(mustachePath + 'accountRecovery.mustache').toString();

// Render the accountRecovery mustache page
router.get('/accountRecovery', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(accountRecoveryMustache, request, response);
});

module.exports = router;
