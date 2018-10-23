/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var adminMustache = fs.readFileSync(mustachePath + 'admin.mustache').toString();
var db = require('../../db/db');

router.get('/admin', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(adminMustache, request, response);
});


router.get('/admin/test', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    var user = {
      firstName : "123",
      lastName : "321",
      university : "UIUC",
      mailId : 'uiuc@ute',
    };

    var course = {
      courseNumber : '123',
      courseName : 'DATA ST',
      courseDescription : 'blah blah blah',
      dept : 'Computer Science',
      term : 'Fa18',
      section : 'AL',
      university : 'UIUC',
    };

    var dept = {
      deptName : 'Computer Science',
      acronym : 'CS',
    }

    var user_result;
    var term_result;
    var university_result;
    var dept_result;
    var role_result;
    var course_result;
    var id = {};

    db
    .createUser(user)
    .then(result => {
      user_result = result[0].dataValues;
      console.log(user_result);
      id.userId = user_result.id;
      return db.getRoleId('Instructor').then(result => {
        role_result = result[0].dataValues;
        console.log(role_result);
        id.roleId = role_result.id;
        return db.getTermId(course.term).then(result => {
          id.termId = result[0].dataValues.id;
          return db.getDeptId(dept).then(result => {
            dept_result = result[0].dataValues;
            console.log(dept_result);
            id.deptId = dept_result.id;
            return db.getUniversityId(course.university).then(result => {
              university_result = result[0].dataValues;
              console.log(university_result)
              id.universityId = university_result.id;
              return db.getCourseId(course).then(result => {
                id.courseId = result[0].dataValues.id;
                return db.getOfferingId(id).then(result => {
                  id.offeringId = result[0].dataValues.id;
                  return db.addCourse(id).then(result => {
                    console.log('_________________________________');
                    console.log(result);
                    console.log('_________________________________');
                    return db.getCoursesByTerms(['Fa18']).then(result => {
                      console.log(result);
                    })
                  })
                })
              })
              })
            })
          })
        })
      })

    /*
    var termValue = await getTermId(course.term);
    var deptValue = await getDeptId(course.dept);
    var universityValue = await getUniversityId(course.university);
    var roleValue = await getRoleId('Instructor');
    */
    renderWithPartial(adminMustache, request, response);
});

module.exports = router;
