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
      courseNumber : '230',
      courseName : 'DATA foo',
      courseDescription : 'foo foo blah blah',
      dept : 'Computer Science',
      term : 'Fa18',
      section : 'AL',
      university : 'UIUC',
    };

    var dept = {
      deptName : 'Computer Science',
      acronym : 'CS',
    }

    var id = {};

    var role_result = db.getRoleId('Instructor');
    var term_result = db.getTermId(course.term);
    var dept_result = db.getDeptId(dept);
    var university_result = db.getUniversityId(course.university);
    var course_result = db.getCourseId(course);

    db
    .createUser(user)
    .then(result => {
    Promise.all([role_result, term_result, dept_result, university_result, course_result]).then((values) => {
      id.roleId = values[0][0].dataValues.id;
      id.termId = values[1][0].dataValues.id;
      id.deptId = values[2][0].dataValues.id;
      id.universityId = values[3][0].dataValues.id;
      id.courseId = values[4][0].dataValues.id;
      console.log(id);
      return db.getOfferingId(id).then(result => {
        id.offeringId = result[0].dataValues.id;
          return db.addCourse(id).then(result => {
            return db.getCoursesByTerms(['Fa18']).then(result => {
              console.log('_________________________________');
              for(let i =0; i < result.length; i++) {
                console.log(result[i].dataValues.id);
              }
              console.log('_________________________________');
            })
          })
        })
      }).catch(err=>console.log(err))
    })

    // db
    // .createUser(user)
    // .then(result => {
    //
    //   id.userId = result[0].dataValues.id;
    //   return db.getRoleId('Instructor').then(result => {
    //     id.roleId = result[0].dataValues.id;
    //
    //     return db.getTermId(course.term).then(result => {
    //       id.termId = result[0].dataValues.id;
    //
    //       return db.getDeptId(dept).then(result => {
    //         id.deptId = result[0].dataValues.id;
    //
    //         return db.getUniversityId(course.university).then(result => {
    //           id.universityId = result[0].dataValues.id;
    //
    //           return db.getCourseId(course).then(result => {
    //             id.courseId = result[0].dataValues.id;
    //
    //             return db.getOfferingId(id).then(result => {
    //               id.offeringId = result[0].dataValues.id;
    //
    //               return db.addCourse(id).then(result => {
    //
    //                 return db.getCoursesByTerms(['Fa18']).then(result => {
    //                   console.log('_________________________________');
    //                   for(let i =0; i < result.length; i++) {
    //                     console.log(result[i].dataValues.id);
    //                   }
    //                   console.log('_________________________________');
    //
    //                 })
    //               })
    //             })
    //           })
    //           })
    //         })
    //       })
    //     })
    //   })

    /*
    var termValue = await getTermId(course.term);
    var deptValue = await getDeptId(course.dept);
    var universityValue = await getUniversityId(course.university);
    var roleValue = await getRoleId('Instructor');
    */
    renderWithPartial(adminMustache, request, response);
});

module.exports = router;
