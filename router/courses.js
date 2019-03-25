// Potential problem with ajax spam
// Also currently no instructor verification

const async = require('async');
const router = express.Router();

const client_api = require('../db/db');
const utils = require('../utils/logging');
const perror = utils.perror;
const info = utils.info;
const log = utils.log;

const permission = require('../modules/permission');

var password = require('password-hash').generate("Test123!");
var mailId = 'testuser@illinois.edu';
// test user profile
var testInfo = {
    mailId: mailId,
    firstName: 'John',
    lastName: 'Wick',
    password: password,
    university: 'University of Illinois at Urbana-Champaign',
    verifiedId: 'sample-verification-buffer',
};


client_api.createUser(testInfo).then(
    result => {
        var userInfo = result;
        client_api.verifyUser('sample-verification-buffer', mailId).then(() => {
        });
    }).catch(err => { perror(err); })

/************************* End Of Dummy Data **********************************/


var allterms = [];

// courses page, display all relative courses
router.get('/courses/', function (request, response) {   
    if (!request.isAuthenticated()) {
        response.redirect('/login?redirectPath=' + encodeURIComponent(request.originalUrl));
    }
    else {        
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        var userid = getUserId(request);
        // Get all terms data from the database
        client_api.getTerms().then(reply => {
            if (reply) {
                // reply is null if the key is missing
                allterms = reply.map(term => term.termName);
           }

            var form = '';
            var createClassBtn = '';
            var userInfo = request.session.passport.user;
            // Super user hack
            if (userInfo.mailId === 'mahipal2@illinois.edu' || userInfo.mailId === 'testuser@illinois.edu') {
                form = getCreateClassForm(userInfo);
                createClassBtn =
                    '<button class="btn" data-toggle="modal" data-target="#createPanel">' +
                    '          Create a New Class</button>';
            }            
            client_api.getUniversityName(userInfo.universityId).then(result => {

                userInfo.university = result.universityName;
                // Add create-a-class section if user is authenticated
                // Table header
                var thtml = "<tr id=\"#header\">\n" +
                    '<th >Term</th>' +
                    '<th hidden="yes">Id</th>' +
                    "                    <th hidden='yes'>University</th>\n" +
                    "                    <th>Subject</th>\n" +
                    "                    <th>Course Number</th>\n" +
                    "                    <th>Section Number</th>\n" +
                    "                    <th>Course Name</th>\n" +
                    "                    <th>Course Instructor</th>\n" +
                    "                    <th>Course Description</th>\n" +
                    "                    <th>Action</th>\n" +
                    "                </tr>";

                client_api.getCoursesByUniversityId(userInfo.universityId).then(values => {

                    var termIds = [];
                    var deptIds = [];
                    var courses = [];
                    var offeringIds = [];
                    var courseOfferingIds = [];

                    for (let i = 0; i < values.length; i++) {
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

                        values[0].map(value => { terms[value.id] = value.termName; });

                        values[1].map(value => {
                            depts[value.id] = value.deptName;
                            acronyms[value.id] = value.acronym;
                        });

                        values[2].map(value => {
                            if (!instructors[value.courseOfferingId]) {
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
                            var html = Mustache.render(Mustache.getMustacheTemplate('courses.mustache'), view);
                            response.end(html);
                        });
                    }).catch(err => perror(err)); /* Promise.all() */
                }).catch(err => perror(err)); /* getUniversityName() */
            });
        });
    }
});

// Create new class
router.post('/courses/newclass', function (request, response) {

    var dept = request.body.dept;
    var userInfo = request.session.passport.user;
    var course = request.body;

    if (!userInfo) {
      perror('Invalid userInfo');
      response.end();
      return;
    }

    course.dept = {
      name: dept,
      acronym: dept
    }

    console.log(userInfo);

    /* course creator should be enrolled as Administrator, any other people will be enrolled as Instructor */
    client_api.addCourse(userInfo, course)
    .then(result => {
      permission.addCoursePermission(userInfo.id, result.courseOfferingId, 'Delete');
      response.end();
    })
    .catch(err => perror(err)) /* addCourse() */
    
    
});

// modify the view table based on the filter
router.post('/courses/applyfilter', function (request, response) {
    var termf = request.body.termfilter.split(';;');
    var subjectf = request.body.subjectfilter.split(';;');
    var rethtml="<tr id=\"#header\">\n" +
        '<th >Term</th>'+
        '<th hidden="yes">Id</th>' +
        "                    <th hidden='yes'>University</th>\n" +
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
        
        html += '<tr id="'+ e.id +'" >';
        html += '<td>' + e.termName + '</td>';
        html += '<td hidden="yes">' + e.courseOfferingId + '</td>';
        html += '<td hidden="yes">' + e.university + '</td>';
        html += '<td>' + e.acronym + '</td>';
        html += '<td>' + e.courseNumber + '</td>';
        html += '<td>' + e.section + '</td>';
        html += '<td>' + e.courseName + '</td>';
        html += '<td>' + instructorName + '</td>';
        html += '<td>' + e.courseDescription + '</td>';
        html += '<td class="col-md-2">';
        var debug = false;
        if (debug || (user != '' && user != undefined)) {
            var classid = e.courseOfferingId;
            permission.isManagingAllowed(user, classid).then( result => {
                if (result) {
                    html +=
                            '<a class="actionbtn mnbtn" href="#">' +
                            '          <span class="glyphicon glyphicon-plus"></span> Manage\n' +
                            '        </a>' + '</td> <td>'+
                            '<a class="actionbtn viewbtn" href="#">' +
                            '          <span class="glyphicon glyphicon-plus"></span> Watch\n' +
                            '        </a> </td>';
                        fcb(null,html);
                } else {
                    permission.isWatchingAllowed(user, classid).then(result => {
                        if (result) {
                          html +=
                          '<a class="actionbtn viewbtn" href="#">' +
                          '          <span class="glyphicon glyphicon-plus"></span> Watch\n' +
                          '        </a>';
                        }
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
      id = req.session.passport.user.id;
    } catch(e) {
      perror("Invalid user id detected");
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
    permission.addCoursePermission(userid, classid, 'View');

    response.end();
});


//
router.post('/courses/drop/', function (request, response) {
    var params = request.body.classinfo;
    params = params.split(',,');
    var userid = getUserId(request);
    var classid = request.body.cid;

    client_api.removeStudent(userid, classid);
    permission.removeCoursePermission(userid, classid, 'View');

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
