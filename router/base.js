/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const router = express.Router();
const fs = require('fs');
const client_api = require('../db/db');

//const homeMustache = fs.readFileSync(mustachePath + 'home.mustache').toString();
router.get('/', async function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  // UNUSED - 

  let courseGrid = "<ul class=\"grid\"> \n";
  let courses = await client_api.getAllCourses().then(async function(values){

    for (let i = 0; i < values.length; i++){
      let course = values[i].dataValues;
      let courseNumber = course.courseNumber
      let depId = course.deptId
      let depName = await client_api.getDept(depId).then(result => {
        return result.acronym;
      })
      courseGrid += "<li> \n" +
                    "  <a href=\"/login\"> \n" +
                    "     <div class=\"text\"> \n" +
                    "        <p>" + depName + " " + courseNumber + "</p> \n" +
                    "        <p class=\"description\">Fall 2018</p> \n" +
                    "     </div> \n" +
                    "  </a> \n" +
                    "</li> \n";
    }

  });
  courseGrid += "</ul>"
  
  await renderWithPartial(Mustache.getMustacheTemplate('home.mustache'), request, response, {courseGrid: courseGrid});
});

module.exports = router;
