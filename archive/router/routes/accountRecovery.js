/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const router = express.Router();
const fs = require('fs');

// Get the mustache page that will be rendered for the accountRecovery route
const accountRecoveryMustache = fs.readFileSync(mustachePath + 'accountRecovery.mustache').toString();

// Render the accountRecovery mustache page
router.get('/accountRecovery', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(accountRecoveryMustache, request, response);
});

module.exports = router;
