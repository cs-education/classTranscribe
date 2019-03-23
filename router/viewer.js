/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const db = require('../db/db');
const utils = require('../utils/logging');
const perror = utils.perror;

//const viewerMustache = fs.readFileSync(mustachePath + 'viewer.mustache').toString();


router.get('/viewer/:offeringId', ensureAuthenticated, function (request, response) {
    var className = request.params.className.toLowerCase();
    var userInfo = request.user || {user : undefined};
    /* TODO: don't think this is the correct function */
    db.getCourseId(function(err, results) {
    // client.smembers("ClassTranscribe::CourseList", function(err, results) {
      if (!isClassNameValid(className) || err) {
        perror(userInfo, "not valid course: " + className);
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
    renderWithPartial(Mustache.getMustacheTemplate('viewer.mustache'), request, response, view);
  });

  module.exports = router;
