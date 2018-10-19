/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var db = require('../../db/db');
var adminMustache = fs.readFileSync(mustachePath + 'admin.mustache').toString();

router.get('/admin', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(adminMustache, request, response);
});

router.get('/admin/test', function (request, response) {
  var user = {
    firstName : "blah",
    lastName : "foo",
    mailId : "asd"
  };
  db.createUser(user).then(result => {
    console.log(result);
  });
    renderWithPartial(adminMustache, request, response);
});

module.exports = router;
