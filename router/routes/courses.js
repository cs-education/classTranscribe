// Potential problem with ajax spam
// Also currently no instructor verification

const async = require('async');
const router = express.Router();
// Search helper
const srchHelper = require("../../utility_scripts/searchContent.js");

const client_api = require('../../db/db');
const utils = require('../../utils/logging');
const perror = utils.perror;
const info = utils.info;
const log = utils.log;

const permission = require('./permission');
// /*************************** Create Dummy Data ********************************/
//
// var courseList = [
//   {
//     courseName : "Elementary Organic Chem Lab I",
//     courseNumber : "233",
//     courseDescription : "Basic laboratory techniques in organic chemistry "+
//     "are presented with emphasis on the separation, isolation, and purification" +
//     "of organic compounds. For students in agricultural science, dairy technology,"+
//     "food technology, nutrition, dietetics, premedical, predental, and"+
//     "preveterinary programs.",
//     section : "AL2",
//     term : "Spring 2016",
//     dept : {
//       name : "Chemistry",
//       acronym : "Chem",
//     }
//   } ,
//   {
//     courseName : "Data Structures",
//     courseNumber : "225",
//     courseDescription : "Data abstractions: elementary data structures (lists, " +
//     "stacks, queues, and trees) and their implementation using an object-oriented programming language. Solutions " +
//     "to a variety of computational problems such as search on graphs and trees. Elementary analysis of " +
//     "algorithms",
//     section : "AL1",
//     term : "Spring 2016",
//     dept : {
//       name : "Computer Science",
//       acronym : "CS",
//     }
//   },
//   {
//     courseName : "Machine Learning",
//     courseNumber : "446",
//     courseDescription : "Theory and basic techniques in machine learning. Major" +
//     " theoretical paradigms and key concepts developed in machine learning in the context of applications such as natural" +
//     " language and text processing, computer vision, data mining, adaptive computer systems and others. Review of several" +
//     " supervised and unsupervised learning approaches: methods for learning linear representations; on-line learning," +
//     " Bayesian methods; decision-trees; features and kernels; clustering and dimensionality reduction.",
//     section : "D3",
//     term : "Fall 2016",
//     dept : {
//       name : "Computer Science",
//       acronym : "CS",
//     }
//   }]
//
// var passwordHash = require('password-hash');
// // test user profile
// var testInfo = {
//   mailId : 'testing@testdomabbccc.edu',
//   firstName : 'First',
//   lastName :'Sur',
//   password: passwordHash.generate("passtest"),
//   university : 'test uni',
//   verifiedId : 'sample-verification-buffer',
// };
//
//
// client_api.createUser(testInfo).then(
//   result => {
//     var userInfo = result;
//     permission.addRole(userInfo.mailId, 'Admin');
//     client_api.verifyUser('sample-verification-buffer', 'testing@testdomabbccc.edu').then(() => {
//       client_api.addCourse(userInfo, courseList[0]).then(result => {
//         info(userInfo);
//         permission.addCoursePermission(userInfo.mailId, result.courseOfferingId, 'Modify');
//       })
//     });
//   }).catch(err => { perror(err);})
//
// /************************* End Of Dummy Data **********************************/


var allterms = [];
var managementMustache = fs.readFileSync(mustachePath + 'courses.mustache').toString();

// courses page, display all relative courses
router.get('/courses/', function (request, response) {
  if(request.isAuthenticated()) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    var userid = getUserId(request);
    // Get all terms data from the database
    client_api.getTerms().then(reply => {
      if(reply) {
        // reply is null if the key is missing
        allterms= reply.map( term => term.termName );
      }

        var form = '';
        var createClassBtn = '';
        var userInfo = request.session.passport.user;

        client_api.getUniversityName(userInfo.universityId).then(result => {

          userInfo.university = result.universityName;
          // Add create-a-class section if user is authenticated
          if (request.isAuthenticated()) {
            permission.getRoles(userid, function(err, roles) {
              if (roles.indexOf('Admin') > -1) {
                form = getCreateClassForm(userInfo);
                createClassBtn =
                '<button class="btn" data-toggle="modal" data-target="#createPanel">' +
                '          Create a New Class</button>';
              }
            })
          }

          // Table header
          var thtml = "<tr id=\"#header\">\n" +
          '<th hidden="yes">Term</th>' +
          "                    <th>University</th>\n" +
          "                    <th>Subject</th>\n" +
          "                    <th>Course Number</th>\n" +
          "                    <th>Section Number</th>\n" +
          "                    <th>Course Name</th>\n" +
          "                    <th>Course Instructor</th>\n" +
          "                    <th>Course Description</th>\n" +
          "                    <th>Action</th>\n" +
          "                </tr>";

          client_api.getCoursesByUniversityId(userInfo.universityId).then(values=> {

            var termIds = [];
            var deptIds = [];
            var courses = [];
            var offeringIds = [];
            var courseOfferingIds = [];

            for (let i = 0; i < values.length; i ++) {
              termIds.push(values[i].termId);
              deptIds.push(values[i].deptId);
              courseOfferingIds.push(values[i].courseOfferingId);
              values[i].university = userInfo.university;
              courses.push(values[i]);
            }

            var termFetches = client_api.getTermsById(termIds);
            var deptFetches = client_api.getDeptsById(deptIds);
            var instructorFetches = client_api.getInstructorsByCourseOfferingId(courseOfferingIds);

            Promise.all([termFetches, deptFetches, instructorFetches]).then(values => {
              var filters = [];
              var terms = {};
              var depts = {};
              var acronyms = {};
              var instructors = {};



              values[0].map(value => {
                terms[value.id] = value.termName;
              });

              values[1].map(value => {
                depts[value.id] = value.deptName;
                acronyms[value.id] = value.acronym;
              });

              values[2].map(value => {
                if ( !instructors[value.courseOfferingId] ) {
                  instructors[value.courseOfferingId] = [];
                }
                instructors[value.courseOfferingId].push(value);
              })

              for (let i = 0; i < courses.length; i++) {
                let currentCourse = courses[i];
                courses[i].termName = terms[currentCourse.termId];
                courses[i].deptName = depts[currentCourse.deptId];
                courses[i].acronym = acronyms[currentCourse.deptId];
                courses[i].instructor = instructors[currentCourse.courseOfferingId];
              }

              // Saving current content(courseId, termId) before applying filters
              request.session['currentContent'] = courses;


              generateListings(courses, userid, function (res) {
                thtml += res;
                filterdata = generateFilters(terms, depts);
                var view = {
                  termlist: allterms,
                  createform: form,
                  tabledata: thtml,
                  termfilterdata: filterdata[0],
                  subjectfilterdata: filterdata[1],
                  createClassButton: createClassBtn
                };
                var html = Mustache.render(managementMustache, view);
                response.end(html);
              });
            }).catch(err => perror(userInfo, err)); /* Promise.all() */
          }).catch(err => perror(userInfo, err)); /* getUniversityName() */
    });
  });
} else {
  response.redirect('/');
}
});

// Create new class
router.post('/courses/newclass', function (request, response) {

    var dept = request.body.dept;
    var userInfo = request.session.passport.user;
    var course = request.body;

    if (!userInfo) {
      perror({user : undefined}, 'Invalid userInfo');
      response.end();
      return;
    }

    course.dept = {
      name: dept,
      acronym: dept
    }

    /* course creator should be enrolled as instructor */
    client_api.addCourse(userInfo, course)
    .then(result => {
      permission.addCoursePermission(userInfo.mailId, result.courseOfferingId, 'Modify');
      response.end();
    })
    .catch(err => {
      perror(userInfo, err);
      response.end();
    }); /* addCourse() */

});

/* TODO: THERE SHOULD BE A BETTER WAY OF DOING SO */
// Handles search and renders the whole page
router.get('/courses/search', function (request, response) {

  if(request.isAuthenticated()) {
    //console.log("start processing search...");
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    // Same as the main page
    client_api.getTerms().then(values => {

        allterms = values.map( value => value.termName );

        var userInfo = request.session.passport.user;

        if (!userInfo) {
          perror({user : undefined}, 'Invalid userInfo');
          response.end();
          return;
        }

        var form = '';
        if(request.isAuthenticated()) {
          form = getCreateClassForm(userInfo);
        }

        /******************* Start Searching *******************/
        var searchterm = request.query.q;

        var search = new srchHelper.SearchHelper(searchterm);

        search.search(function (line) {
          var rethtml= "<tr id=\"#header\">\n" +
                       '<th hidden="yes">Term</th>'+
                       "                    <th>University</th>\n" +
                       "                    <th>Subject</th>\n" +
                       "                    <th>Course Number</th>\n" +
                       "                    <th>Section Number</th>\n" +
                       "                    <th>Course Name</th>\n" +
                       "                    <th>Course Instructor</th>\n" +
                       "                    <th>Course Description</th>\n" +
                       "                    <th>Action</th>\n" +
                       "                </tr>";
          var commands=line.trim().split(/\r\n|\n/);
          var res = commands.map( re=> {
            return re.slice(0, -3);
          });

          commands = res.map( e=> {
            return e.id;
          });

          client_api.getCoursesByIds(commands).then(values => {
            var origlen =values.length;
            values = values.filter(value => value != undefined);

            if(values.length!=origlen) { perror(userInfo, "nil in search replies detected"); }

            request.session['currentContent'] = values;

            var listingData = values;

            generateListings(listingData,getUserId(request),function (listRes) {
              if (values.length==0){
                rethtml = 'No result found for "'+searchterm+'"';
              } else {
                rethtml+=listRes;
              }

              filterdata = generateFilters(values);

              var view = {
                termlist: allterms,
                createform:form,
                tabledata:rethtml,
                termfilterdata:filterdata[0],
                subjectfilterdata:filterdata[1]
              };

              var html = Mustache.render(managementMustache, view);

              response.end(html);
            });
          }).catch(err => perror(userInfo, err)); /* getCoursesByIds() */
        });
    }).catch(err => perror(userInfo, err)); /* getTerms() */
  } else {
    response.redirect('/');
  }
});


// Handles class deletion,
// NOT updated, class modifications should be moved to their own pages
// TODO: Trash bin feature, also need to decide what to do with the transcription file
router.delete('/courses/deleteclass/', function (request, response) {
    // var params = request.body.classinfo;
    // params = params.split(',,');
    // var delclass = getClassUid(params[1],  params[0], params[3], params[4])
    // var usrid = getUserId(request);
    // acl.isAllowed("ClassTranscribe::Users::"+usrid, "ClassTranscribe::Course::"+delclass, "Delete", function (err, res) {
    //     // Remove any reference to the class
    //     var commands = [
    //         ['del', 'ClassTranscribe::Course::' + delclass],
    //         ['srem', 'ClassTranscribe::Terms::' + request.body.term, 'ClassTranscribe::Course::' + delclass],
    //         ['srem', 'ClassTranscribe::Subject::' + params[1], 'ClassTranscribe::Course::' + delclass],
    //         ['srem', 'ClassTranscribe::CourseList', 'ClassTranscribe::Course::' + delclass]
    //     ];
    //     client.multi(commands).exec(function (err, replies) {
    //         if (err) {
    //             console.log("error in deleting class" + delclass);
    //         }
    //         else {
    //             console.log(delclass + " deleted");
    //
    //
    //             request.session['currentContent'].splice(request.session['currentContent'].indexOf(delclass), 1)
    //         }
    //
    //         acl.removeAllow(getUserId(request), 'ClassTranscribe::Course::' + delclass, "Drop");
    //         acl.removeAllow(getUserId(request), 'ClassTranscribe::Course::' + delclass, "Remove");
    //         acl.removeAllow(getUserId(request), 'ClassTranscribe::Course::' + delclass, "Modify");
    //         // TODO: remove other all relavant info in the database
    //         client.smembers("ClassTranscribe::Course::" + delclass + "::Students", function (err, rep) {
    //             rep.forEach(function (c) {
    //                 client.srem(c + "::Courses_as_Student", "ClassTranscribe::Course::" + delclass)
    //             });
    //             client.del("ClassTranscribe::Course::" + delclass + "::Students");
    //             client.smembers("ClassTranscribe::Course::" + delclass + "::Instructors", function (err, rep) {
    //                 rep.forEach(function (c) {
    //                     client.srem(c + "::Courses_as_Instructor", "ClassTranscribe::Course::" + delclass)
    //                 });
    //                 client.del("ClassTranscribe::Course::" + delclass + "::Instructors");
    //                 client.smembers("ClassTranscribe::Course::" + delclass + "::TAs", function (err, rep) {
    //                     rep.forEach(function (c) {
    //                         client.srem(c + "::Courses_as_TA", "ClassTranscribe::Course::" + delclass)
    //                     });
    //                     client.del("ClassTranscribe::Course::" + delclass + "::TAs");
    //                     response.end();
    //                 });
    //             });
    //         });
    //     });
    // });
    response.send();
});

// Same with delete, to be removed from this page
// Modifies class
router.post('/courses/modifyclass',function (request, response) {
    // var usrid = getUserId(request);
    // var params = request.body;
    // var mclass = getClassUid(params['uni'],  params['term'], params['Course Number'], params['Section Number']);
    // acl.isAllowed(usrid, "ClassTranscribe::Course::"+mclass, "Modify", function (err, res) {
    //     if(err) {print(err)}
    //     if (res){
    //         var commands=[
    //             ['hset','ClassTranscribe::Course::'+mclass, 'ClassName', params['Class Name']],
    //             ['hset','ClassTranscribe::Course::'+mclass, 'ClassDesc', params['Course Description']],
    //             //['hset','ClassTranscribe::Course::'+mclass, 'ClassNumber', params['Course Number']],
    //             //['hset','ClassTranscribe::Course::'+mclass, 'SectionNumber', params['Section Number']],
    //             //['hset','ClassTranscribe::Course::'+mclass, 'Subject', params['Subject']]
    //         ];
    //         client.multi(commands).exec(function (err, replies) {
    //             if(err){console.log("error in modifying class" + mclass);}
    //             else{console.log(mclass+" modified");}
    //             response.end();
    //         });
    //     }
    //     else{
    //         response.end();
    //     }
    // });
    response.end()
});

// modify the view table based on the filter
router.post('/courses/applyfilter', function (request, response) {
    var termf = request.body.termfilter.split(';;');
    var subjectf = request.body.subjectfilter.split(';;');
    var rethtml="<tr id=\"#header\">\n" +
        '<th hidden="yes">Term</th>'+
        "                    <th>University</th>\n" +
        "                    <th>Subject</th>\n" +
        "                    <th>Course Number</th>\n" +
        "                    <th>Section Number</th>\n" +
        "                    <th>Course Name</th>\n" +
        "                    <th>Course Instructor</th>\n" +
        "                    <th>Course Description</th>\n" +
        "                    <th>Action</th>\n" +
        "                </tr>";
    var result = [];
    request.session['currentContent'].forEach(function(e){
        if( subjectf.indexOf(e.deptName)>=0 && termf.indexOf(e.termName)>=0) {
            result.push(e)
        }
    });
    generateListings(result, getUserId(request), function (res) {
        rethtml+=res;
        response.send(rethtml);
    });
});

// Generate filters from a list of classes, currently only for terms and subjects
// returns html sections
function generateFilters(terms, depts){
    var termlist = [];
    var subjectlist = [];
    var termhtml = '';
    var subjecthtml = '';

    for (var dept in depts) {
      let deptName = depts[dept];
      if(subjectlist.indexOf(deptName) < 0) {
        subjectlist.push(deptName);
        subjecthtml  += '<div class="form-check">'+
        '    <label class="form-check-label checkboxlabel">'+
        '    <input class="form-check-input" type="checkbox" value="'+ deptName + '" checked>'+
        deptName +
        '</label>'+
        '</div>'
      }
    }

    for (var term in terms) {
      let termName = terms[term];
      if(termlist.indexOf(termName) < 0) {
        termlist.push(termName);
        termhtml  += '<div class="form-check">'+
        '    <label class="form-check-label checkboxlabel">'+
        '    <input class="form-check-input" type="checkbox" value="'+ termName + '" checked>'+
        termName +
        '</label>'+
        '</div>'
      }
    }

    return [termhtml,subjecthtml];
}

// generate course listing data
// data - input course info
// user - user id
// cb   - callback function
function  generateListings(data, user, cb) {

  /* async.reduce(array, startValue, reducer) */
    async.reduce(data, '', function (html, e, fcb) {
      let instructors = e.instructor;
      let instructorName = '';

      /* concatenate each instructor's name */
        try {
            instructors.map(instructor => {
                instructorName = instructorName + ', ' + instructor.firstName + ' ' + instructor.lastName;
            });
            /* remove first comma */
            instructorName = instructorName.substring(1);
        } catch (err) {
            instructorName = "";
        }

        html += '<tr id="'+ e.id +'">';
        html += '<td hidden="yes">' + e.termName + '</td>';
        html += '<td hidden="yes">' + e.courseOfferingId + '</td>';
        html += '<td>' + e.university + '</td>';
        html += '<td>' + e.acronym + '</td>';
        html += '<td>' + e.courseNumber + '</td>';
        html += '<td>' + e.section + '</td>';
        html += '<td>' + e.courseName + '</td>';
        html += '<td>' + instructorName + '</td>';
        html += '<td class="tddesc">' + e.courseDescription + '</td>';
        html += '<td class="col-md-2">';
        var debug = false;
        if (debug || (user != '' && user != undefined)) {
            var classid = e.courseOfferingId;
            permission.checkCoursePermission(user, classid, 'Modify', function(error, result) {

                if (result) {
                        html +=
                            '<a class="actionbtn mnbtn">' +
                            '          <span class="glyphicon glyphicon-plus"></span> Manage\n' +
                            '        </a>' + '</td> <td>'+
                            '<a class="actionbtn viewbtn">' +
                            '          <span class="glyphicon glyphicon-plus"></span> Watch\n' +
                            '        </a> </td>';
                        fcb(null,html);
                    // });
                } else {
                  permission.checkCoursePermission(user, classid, 'Drop', function (err, res) {
                    if (!res) {
                      html +=
                      '<a class="actionbtn viewbtn">' +
                      '          <span class="glyphicon glyphicon-plus"></span> Watch\n' +
                      '        </a>';
                    }
                    // } else {
                    //   html +=
                    //   '<a class="actionbtn dpbtn">' +
                    //   '          <span class="glyphicon glyphicon-minus"></span> Drop\n' +
                    //   '        </a>';
                    // }
                    html += '</br>';
                    fcb(null, html);
                  }); /* permission.checkCoursePermission() [drop] */
                }
            }); /* permission.checkCoursePermission() [modify] */
        } else {
          fcb(null,html);
        }
    },function (err, res) {cb(res);});
}


// Get user id from email
// return -  currently just returns the email (i.e. abc@def.edu) or '' in case of error
function getUserId(req) {
    var id = '';
    try {
      id = req.session.passport.user.mailId;
    } catch(e) {
      perror({user : undefined}, "Invalid user id detected");
    }
    return id;
}

//
router.post('/courses/enroll/', function (request, response) {
    var params = request.body.classinfo;
    params = params.split(',,');
    var userid = getUserId(request);
    var classid = request.body.cid;

    client_api.addStudent(userid, classid);
    permission.addCoursePermission(userid, classid, 'Drop');

    response.end();
});


//
router.post('/courses/drop/', function (request, response) {
    var params = request.body.classinfo;
    params = params.split(',,');
    var userid = getUserId(request);
    var classid = request.body.cid;

    client_api.removeStudent(userid, classid);
    permission.removeCoursePermission(userid, classid, 'Drop');
    // acl.removeAllow(userid, "ClassTranscribe::Course::"+classid, 'Drop');

    response.end()
});


/* TODO: Should modify, change term, dept to select */
function getCreateClassForm(rep){
    return '<div id="createPanel" class="modal fade" role="dialog"> ' +
        '<div class="modal-dialog"> ' +
            '<div class="modal-content"> ' +
                '<div class="modal-header">' +
                    " <div class=\"row\"> " +
                        "<h3>Create a new course</h3> </div> " +
                    '</div>'+
                '<div class="modal-body">'+
                    "<form id=\"creation-form\" method=\"POST\"> " +
                        '<div class="row">'+
                            "<div class=\"col-md-4\">" +
                            "<label>Term</label> <input type=\"text\" class=\"form-control\" id=\"fminput0\" placeholder=\"\" name=\"term\"> " +
                            '</div>'+
                        '</div>'+
                        "<div class=\"row\"> " +
                            "<div class=\"col-md-4\"> " +
                                "<label>Subject</label> <input type=\"text\" class=\"form-control\" id=\"fminput1\" placeholder=\"\" name=\"dept\"> " +
                                "<label>Course Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput2\" placeholder=\"\" name=\"courseNumber\"> </div> " +
                            "<div class=\"col-md-4\"> " +
                                "<label>Class Name</label> <input type=\"text\" class=\"form-control\" id=\"fminput3\" placeholder=\"\" name=\"courseName\"> " +
                                "<label>Instructor</label> <input type=\"text\" class=\"form-control\" id=\"fminput4\" value=\""+rep.firstName+' '+rep.lastName+"\" name=\"instructor\" readonly> </div> " +
                            "<div class=\"col-md-4\"> " +
                                "<label>Section Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput5\" placeholder=\"\" name=\"section\"> " +
                                "<label>University</label> <input type=\"text\" class=\"form-control\" id=\"fminput6\" value=\""+rep.university+"\" name=\"university\" readonly> </div> </div> " +
                        "<div class=\"row\"> <div class=\"col-md-12\"> " +
                            "<label>Course Description</label> <input type=\"text\" class=\"form-control\" id=\"fminput7\" placeholder=\"\" name=\"courseDescription\"> </div>" +
                             "<div class=\"col-md-12\"> " +
                                "<label>Viewer Identity</label>" +
                                "<select class=\"form-control\" id=\"fminput8\" placeholder=\"\" name=\"viewer\"> " +
                                "<option value=0> Public </option>" +
                                "<option value=1> Instructor Allowed </option>" +
                                "<option value=2> User Allowed </option>" +
                                "<option value=3> University Allowed </option>" +
                                "</select> </div>" +
                             "</div> " +
                    '<div class="modal-footer">'+
                        '<input id="cfmCreate" type="submit" class="btn btn-default" value="Create"></input>'+
                        '<button id="cfmCancel" type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                    '</form>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<script>// create new course\n' +
        '    $(document).on(\'submit\', \'#creation-form\', (function(e) {\n' +
        '        e.preventDefault();\n' +
        '        var term = document.getElementById("school-term");\n' +
        '        var newCourse = [];' +
        '        var emptyfields = false;' +
        '        $(\'#creation-form\').serializeArray().forEach(function (elem) {\n' +
        '            if(elem["value"].trim()==""){emptyfields = true; return false;}' +
        '            newCourse.push(elem["value"].trim());\n' +
        '        });' +
        '        if(emptyfields) {alert("all fields must be non-empty");}\n' +
        '        else if($("#school-term").val()!=\'\') {\n' +
        '            $.ajax({\n' +
        '                url : "/courses/newclass/",\n' +
        '                type: "POST",\n' +
        '                data: $("#creation-form").serialize(),\n' +
        '                success: function (msg) {\n' +
        '                    if(msg.length>0){alert(msg);}'+
        '                    else{$(\'#createPanel\').modal(\'hide\');;\n' +
        '                    location.reload();}\n' +
        '                },\n' +
        '                error: function (jXHR, textStatus, errorThrown) {\n' +
        '                    alert(errorThrown);\n' +
        '                }\n' +
        '            });\n' +
        '        }else{}\n' +
        '    }));</script>';
}

module.exports = router;
