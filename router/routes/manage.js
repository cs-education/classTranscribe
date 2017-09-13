/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fs = require('fs');

var manageCoursePage = fs.readFileSync(mustachePath + 'manageCourse.mustache').toString();
router.get('/manageCourse', function (request, response) {
console.log("Got ROUTE", manageCoursePage)
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(manageCoursePage, request, response);
});

module.exports = router;