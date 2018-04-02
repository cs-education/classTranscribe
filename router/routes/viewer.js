/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var viewerMustache = fs.readFileSync(mustachePath + 'viewer.mustache').toString();
router.get('/viewer/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();
    client.smembers("ClassTranscribe::CourseList", function(err, results) {
      if (!isClassNameValid(className) || err) {
        console.log("not valid course: ", className);
        response.end(invalidClassHTML);
        return;
      }
    });

    response.writeHead(200, {
      'Content-Type': 'text/html',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
    });

    var view = {
        className: className
    };
    renderWithPartial(viewerMustache, request, response, view);
  });

  module.exports = router;
