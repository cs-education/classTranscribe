/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');

var homeMustache = fs.readFileSync(mustachePath + 'home.mustache').toString();
router.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(homeMustache, request, response);
});


var loginHomePage = fs.readFileSync(mustachePath + 'dashboard.mustache').toString();
router.get('/dashboard', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(loginHomePage, request, response);
});

module.exports = router;
