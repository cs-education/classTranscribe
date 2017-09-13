/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');

var signupMustache = fs.readFileSync(mustachePath + 'signup.mustache').toString();
router.get('/signup', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(signupMustache, request, response);
});

module.exports = router;