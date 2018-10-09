/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
// var client = require('./../../modules/redis');

var activatedMustache = fs.readFileSync(mustachePath + 'activated.mustache').toString();

router.get('/activated', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(activatedMustache, request, response);
});

module.exports = router;
