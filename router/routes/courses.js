// TODO: create class consistency, create class permission, uid changes, more permission check, delete confirmation/adjustment, uuid, trash bin, public/private course displat
// note: for classid see genNewClassUid() function

// Potential problem with ajax spam
// Also currently no instructor verification

const async = require('async');
const router = express.Router();
// Search helper
const srchHelper = require("../../utility_scripts/searchContent.js");

const client_api = require('../../db/db');
const permission = require('./permission');

//=======================Sample data for testing=====================================
// create Uid for the class
function genNewClassUid(){
    return uuidv4();
}

var courseList = [
  {
    courseName : "Elementary Organic Chem Lab I",
    courseNumber : "233",
    courseDescription : "Basic laboratory techniques in organic chemistry "+
    "are presented with emphasis on the separation, isolation, and purification" +
    "of organic compounds. For students in agricultural science, dairy technology,"+
    "food technology, nutrition, dietetics, premedical, predental, and"+
    "preveterinary programs.",
    section : "AL2",
    term : "Spring 2016",
    dept : {
      name : "Chemistry",
      acronym : "Chem",
    }
  } ,
  {
    courseName : "Data Structures",
    courseNumber : "225",
    courseDescription : "Data abstractions: elementary data structures (lists, " +
    "stacks, queues, and trees) and their implementation using an object-oriented programming language. Solutions " +
    "to a variety of computational problems such as search on graphs and trees. Elementary analysis of " +
    "algorithms",
    section : "AL1",
    term : "Spring 2016",
    dept : {
      name : "Computer Science",
      acronym : "CS",
    }
  },
  {
    courseName : "Machine Learning",
    courseNumber : "446",
    courseDescription : "Theory and basic techniques in machine learning. Major" +
    " theoretical paradigms and key concepts developed in machine learning in the context of applications such as natural" +
    " language and text processing, computer vision, data mining, adaptive computer systems and others. Review of several" +
    " supervised and unsupervised learning approaches: methods for learning linear representations; on-line learning," +
    " Bayesian methods; decision-trees; features and kernels; clustering and dimensionality reduction.",
    section : "D3",
    term : "Fall 2016",
    dept : {
      name : "Computer Science",
      acronym : "CS",
    }
  }]

var passwordHash = require('password-hash');
// test user profile
var testInfo = {
  mailId : 'testing@testdomabbccc.edu',
  firstName : 'First',
  lastName :'Sur',
  password: passwordHash.generate("passtest"),
  university : 'test uni',
  verifiedId : 'sample-verification-buffer',
};

client_api.createUser(testInfo).then(
  result => {
    var userInfo = result[0].dataValues;
    permission.addUser(userInfo.mailId);
    client_api.verifyUser('sample-verification-buffer', 'testing@testdomabbccc.edu').then(() => {
      // var promises = [];
      // for (let i = 0; i < courseList.length; i++) {
      //   promises.push(client_api.addCourse(userInfo, courseList[i]));
      // }
      /* there should be a better way than doing multiple callbacks */
      // client_api.addCourseMultiple(userInfo, courseList).then(values => {
      //   console.log(values);
      //   console.log('----------------------------------------');
      // }).catch(err => console.log(err));
      client_api.addCourse(userInfo, courseList[0]).then(result => {
        permission.addCoursePermission(userInfo.mailId, result[0].dataValues.offeringId, 'Modify');
      })
      // .then(()=>
        // client_api.addCourse(userInfo, courseList[1]).then(()=>
          // client_api.addCourse(userInfo, courseList[2])
        // )

      // Promise.all(promises).then(values=>{
      //   console.log(values)
      //   console.log('-------------------------------------------------')
      // });
    });
  }).catch(err => { console.log(err);})

/*
* course = {
*   courseName, courseNumber, courseDescription,
*   term, section, *dept*
*  }
*
* dept = {
* deptName, acronym
* }
*/

// Loading sample data into database
// Object.keys(courseList).forEach( function (t) {
  // client_api.addCourses(courseList[t]);
    // client.sadd("ClassTranscribe::Terms", "ClassTranscribe::Terms::"+t);
    // courseList[t].forEach(function (course) {
    //     // Add course
    //     var classid=course[7];
    //
    //     // General information update
    //     client.sadd("ClassTranscribe::CourseList", "ClassTranscribe::Course::"+classid); // add class to class list
    //     client.sadd("ClassTranscribe::Terms::"+t, "ClassTranscribe::Course::"+classid); // add class to term list
    //     client.sadd("ClassTranscribe::SubjectList", "ClassTranscribe::Subject::"+course[0]); // add class subject to subject list
    //     client.sadd("ClassTranscribe::Subject::"+course[0], "ClassTranscribe::Course::"+classid); // add class to the subject
    //
    //     // Add course info
    //     client.hset("ClassTranscribe::Course::"+classid, "Subject", course[0]);
    //     client.hset("ClassTranscribe::Course::"+classid, "ClassNumber", course[1]);
    //     client.hset("ClassTranscribe::Course::"+classid, "SectionNumber", course[2]);
    //     client.hset("ClassTranscribe::Course::"+classid, "ClassName", course[3]);
    //     client.hset("ClassTranscribe::Course::"+classid, "ClassDesc", course[4]);
    //     client.hset("ClassTranscribe::Course::"+classid, "University", course[5]);
    //     client.hset("ClassTranscribe::Course::"+classid, "Instructor", course[6]);
    //     client.hset("ClassTranscribe::Course::"+classid, "Term", t);
    // });
// });
// let testcourse = courseList["Spring 2016"][0];
// let testclassid='bb4e5382-42ed-40e7-ad8d-0086838f3e0c';
// /* couse = [subject, classNumber, sectionNumber, className, classDesc, university, instructor, classID] */
// let dummyData = ["Computer Science", "CS 123", "BL2", "Data Structure", "No description", "N/A", "N/A", testclassid];



//
// client.hmset("ClassTranscribe::Users::" + 'testing@testdomabbccc.edu', [
//     'first_name', 'First',
//     'last_name', 'Sur',
//     'password', passwordHash.generate("passtest"),
//     'change_password_id', '',
//     'university', "test uni",
//     'verified', true,
//     'verify_id', '',
//     'courses_as_instructor','',
//     'courses_as_TA','',
//     'courses_as_student',''
// ]);
// client.set("ClassTranscribe::UserLookupTable::testing@testdomabbccc.edu","testing@testdomabbccc.edu");
// ACL example usage (default)
//acl.allow('UserRole', 'ResourceName', 'Action');
//acl.addUserRoles('UserName', 'UserRole');
// Example (per user)
// acl.addUserRoles('testing@testdomabbccc.edu', 'testing@testdomabbccc.edu');
// acl.allow('testing@testdomabbccc.edu', 'ClassTranscribe::Course::UIUC-Fall 2016-CS 446-D3', 'Modify');
// acl.allow('testing@testdomabbccc.edu', "ClassTranscribe::Course::UIUC-Spring 2016-Chem 233-AL2", 'Drop');
// acl.allow('testing@testdomabbccc.edu', "ClassTranscribe::Course::UIUC-Spring 2016-CS 225-AL1", 'Remove');

// console.log("Sample data for class listings loaded...");
//======================End of sample data==========================================================


var allterms = [];
var managementMustache = fs.readFileSync(mustachePath + 'courses.mustache').toString();
// Main page
router.get('/courses/', function (request, response) {
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
          userInfo.university = result.dataValues.universityName;
          // Add create-a-class section if user is authenticated
          if (request.isAuthenticated()) {
            form = getCreateClassForm(userInfo);
            createClassBtn =
            '<button class="btn" data-toggle="modal" data-target="#createPanel">' +
            '          Create a New Class</button>';
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
          "                    <th>Course Descruption</th>\n" +
          "                    <th>Action</th>\n" +
          "                </tr>";
          client_api.getCoursesByUniversityId( userInfo.universityId ).then( values => {
            var termIds = [];
            var deptIds = [];
            var courses = [];
            var offeringIds = [];
            var courseOfferingIds = [];

            for (let i = 0; i < values.length; i ++) {
              termIds.push(values[i].termId);
              deptIds.push(values[i].deptId);
              offeringIds.push(values[i].offeringId);
              courseOfferingIds.push(values[i].courseOfferingId);
              courses.push(values[i]);
              values[i].university = userInfo.university;
            }

            var termFetches = client_api.getTermsById(termIds);
            var deptFetches = client_api.getDeptsById(deptIds);
            var sectionFetches = client_api.getSectionsById(offeringIds);
            var instructorFetches = client_api.getInstructorsByCourseOfferingId(courseOfferingIds);

            Promise.all([termFetches, deptFetches, sectionFetches, instructorFetches]).then(values => {
              var filters = [];
              var terms = {};
              var depts = {};
              var acronyms = {};
              var sections = {};
              var instructors = {};

              values[0].map(value => {
                terms[value.id] = value.termName;
              });

              values[1].map(value => {
                depts[value.id] = value.deptName;
                acronyms[value.id] = value.acronym;
              });

              values[2].map(value => {
                sections[value.id] = value.section;
              })

              values[3].map(value => {
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
                courses[i].section = sections[currentCourse.offeringId];
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
            }).catch(err => console.log(err)); /* Promise.all() */
          }).catch(err => console.log(err)); /* getUniversityName() */
    });
  });
});

// Create new class
router.post('/courses/newclass', function (request, response) {

    var dept = request.body.dept;
    var userInfo = request.session.passport.user;
    var course = request.body;

    if (!userInfo) {
      console.log('Invalid userInfo');
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
      console.log('added: ' + result[0].dataValues);
    })
    .catch(err => {
      // Add permissions
      // permission.addCoursePermission(userid, classid, 'Modify');
      // permission.addCoursePermission(userid, classid, 'Remove');
      // client_api.enrollInstuctor(classid, userid);
      console.log(err);
    })
    response.end();
});

/* TODO: THERE SHOULD BE A BETTER WAY OF DOING SO */
// Handles search and renders the whole page
router.get('/courses/search', function (request, response) {
    //console.log("start processing search...");
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    // Same as the main page
    client_api.getTerms().then(values => {//function(err, reply) {
    // client.smembers("ClassTranscribe::Terms", function(err, reply) {
        allterms = values.map( value => value.termName );

        var userInfo = request.session.passport.user;

        if (!userInfo) {
          console.log('Invalid userInfo');
          response.end();
          return;
        }

        var form = '';
        if(request.isAuthenticated()) {
          form = getCreateClassForm(userInfo);
        }

        // client_api.getUserByID(getUserId(request), function(err, userinfo) {
        // client.hgetall("ClassTranscribe::Users::"+getUserId(request), function (err, usrinfo) {
            // var form = '';
            // if (request.isAuthenticated()) {
            //     form = getCreateClassForm(usrinfo);
            // }
            //========================starting search==========================================
            var searchterm = request.query.q;

            // console.log("Searching: "+searchterm);
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
                    "                    <th>Course Descruption</th>\n" +
                    "                    <th>Action</th>\n" +
                    "                </tr>";
                var commands=line.trim().split(/\r\n|\n/);
                var res = commands.map( re=> {
                    return re.slice(0, -3);
                });
                commands = res.map( e=> {
                    // return ['hgetall', "ClassTranscribe::Course::" + e];
                    return e.id;
                });

                client_api.getCoursesByIds(commands).then(values => {
                    var origlen =values.length;
                    values = values.filter(value => value != undefined);
                    if(values.length!=origlen) { console.log("nil in search replies detected"); }

                    request.session['currentContent'] = values;

                    var listingData = values;
                    generateListings(listingData,getUserId(request),function (listRes) {
                        if (values.length==0){
                            rethtml = 'No result found for "'+searchterm+'"';
                        }
                        else{
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
                }).catch(err => console.log(err));
            // });
        });
    });
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
        "                    <th>Course Descruption</th>\n" +
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
      instructors.map(instructor => {
        instructorName = instructorName + ', ' + instructor.firstName + ' ' + instructor.lastName;
      })

      /* remove first comma */
      instructorName = instructorName.substring(1);

        html += '<tr id="'+ e.id +'">';
        html += '<td hidden="yes">' + e.termName + '</td>';
        html += '<td hidden="yes">' + e.offeringId + '</td>';
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
            var classid = e.offeringId;
            permission.checkCoursePermission(user, classid, 'Modify', function(error, result) {
            // acl.isAllowed(user, classid, 'Modify', function (err, res) {
                if (result) {
                    // Modify and remove functionalityies will be moved from this page
                    // html +=
                    //     '<a class="actionbtn modbtn" data-toggle="modal" data-target="#modpanel">' +
                    //     '          <span class="glyphicon glyphicon-pencil"></span> Modify\n' +
                    //     '        </a>';
                    // permission.checkCoursePermission(user, classid, 'Remove', function (err, res) {
                    // acl.isAllowed(user, classid, 'Remove', function (err, res) {
                        // if (res) {
                        //     html +=
                        //         '<a class="actionbtn rmbtn">' +
                        //         '          <span class="glyphicon glyphicon-remove"></span> Remove\n' +
                        //         '        </a>' +
                        //         '</td>';
                        // }
                        // html += '</tr>';
                        html +=
                            '<a class="actionbtn mnbtn">' +
                            '          <span class="glyphicon glyphicon-plus"></span> Manage\n' +
                            '        </a>';
                        fcb(null,html);
                    // });
                }
                else{
                  permission.checkCoursePermission(user, classid, 'Drop', function (err, res) {
                    // acl.isAllowed(user, classid, 'Drop', function (err, res) {
                        if (!res) {
                            html +=
                                '<a class="actionbtn erbtn">' +
                                '          <span class="glyphicon glyphicon-plus"></span> Enroll\n' +
                                '        </a>';
                        }
                        else {
                            html +=
                                '<a class="actionbtn dpbtn">' +
                                '          <span class="glyphicon glyphicon-minus"></span> Drop\n' +
                                '        </a>';
                        }
                        html += '</br>';
                        fcb(null, html);
                    });
                }

            });
        }
        else{fcb(null,html)}
    },function (err, res) {cb(res);});
}


// Get user id from email
// return -  currently just returns the email (i.e. abc@def.edu) or '' in case of error
function getUserId(req) {
    var id = '';
    try {
      id = req.session.passport.user.mailId;
    } catch(e) {
      console.log("Invalid user id detected");
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
    // acl.allow(userid, "ClassTranscribe::Course::"+classid, 'Drop');

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
                            "<label>Course Description</label> <input type=\"text\" class=\"form-control\" id=\"fminput7\" placeholder=\"\" name=\"courseDescription\"> </div> </div> " +
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
