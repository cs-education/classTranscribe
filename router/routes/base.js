/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const router = express.Router();
const fs = require('fs');
const db = require('../../db/db');

const utils = require('../../utils/logging');
const perror = utils.perror;

const homeMustache = fs.readFileSync(mustachePath + 'home.mustache').toString();

router.get('/', async function (request, response) {

  /* populate courses section in home page only if user is logged in */
  if(request.isAuthenticated()) {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    let courseGrid = "<h1>COURSES</h1> <ul class=\"grid\"> \n";
    let courses = await db.getAllCourses().then(
      async function(values) {

        for (let i = 0; i < values.length; i++) {
          let course = values[i].dataValues;
          let courseNumber = course.courseNumber
          let depId = course.deptId
          let depName = await db.getDept(depId).then(result => {
            return result.acronym;
          }).catch(err => { perror(err); }); /* db.getDept() */

          /* TODO: for now, redirect user to /courses */
          courseGrid += "<li> \n" +
          /*"  <a href=\"/class/" + depName.toLowerCase() + course.courseNumber + "-fa18\"> \n" +*/
                        "<a href=\"/courses\" > \n" +
                        "     <div class=\"text\"> \n" +
                        "        <p>" + depName + " " + course.courseNumber + "</p> \n" +
                        "        <p class=\"description\">Fall 2018</p> \n" +
                        "     </div> \n" +
                        "  </a> \n" +
                        "</li> \n";
        }
      }).catch(err => { perror(err); }) /* db.getAllCourses() */
      courseGrid += "</ul>"
      renderWithPartial(homeMustache, request, response, {courseGrid: courseGrid});
    } else {
      renderWithPartial(homeMustache, request, response);
    }
});

module.exports = router;
