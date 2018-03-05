// Current database structure example
//  ========== Class section ==========
//                                |--ClassTranscribe::Course::Classid_1
//                                |--ClassTranscribe::Course::C2
//  |--ClassTranscribe::CourseList|--ClassTranscribe::Course::C3
//  |
//  |--ClassTranscribe::Terms::XX|--ClassTranscribe::Course::Classid_1
//  |                            |--ClassTranscribe::Course::C2
//  |
//  |--ClassTranscribe::Terms::YY|--ClassTranscribe::Course::C3
// -|
//  |--ClassTranscribe::SubjectList--|--ClassTranscribe::Subject::XX --ClassTranscribe::Course::Classid_1
//  |                                |--ClassTranscribe::Subject::YY::|--ClassTranscribe::Course::C2
//  |                                                                 |--ClassTranscribe::Course::C3
//  |--ClassTranscribe::Course::C1--"ClassNumber","SectionNumber","ClassName","ClassDesc","University","Instructor","Term"|||(End of current attributes)|||students, instructors<== planned/WIP attributes
//  |--ClassTranscribe::Course::...::Students
//  |                                |--Instructors
//  |
//  ========== User section ==========
//  |
//  |--ClassTranscribe::Users::userid_1--'first_name', 'last_name', 'password',|||(End of current attributes)|||, classes with instructor access, classes with student access
//                             userid_1::Courses_as_Instructor
//                             userid_1::Courses_as_TA
//                             userid_1::Courses_as_Student//  |--ClassTranscribe::Users::...
//  |--ClassTranscribe::Users::...
//  |
//  |
//  ========== Misc section ==========
//  |
//  |

// TODO: create class consistency, create class permission, uid changes, more permission check, empty fields check for create class
// note: for classid see getClassUid(...)
//       for userid it's just email at the moment


// Potential problem with ajax spam
// Also currently no instructor verification

async = require('async');
var router = express.Router();
// Search helper
var srchHelper = require("../../utility_scripts/searchContent.js");
// Saving current content before applying filters
var currentcontent = []

acl = require('acl');


//=======================Sample data for testing=====================================
// create Uid for the class
function getClassUid(university, term, number, section) {
    if(!university|| !term|| !number|| !section){
        console.log("potential problem in uid, empty/null value detected");
        if (!term) term = 'All';
    }
    return university+"-"+term+"-"+number+"-"+section;
}
var courseList = {
    "Spring 2016":[
        ["Chemistry", "Chem 233", "AL2", "Elementary Organic Chem Lab I", "Basic laboratory techniques in organic" +
        " chemistry are presented with emphasis on the separation, isolation, and purification of organic compounds." +
        " For students in agricultural science, dairy technology, food technology, nutrition, dietetics, premedical," +
        " predental, and preveterinary programs.", "UIUC", "Miller, S"],
        ["Computer Science", "CS 225", "AL1", "Data Structures", "Data abstractions: elementary data structures (lists, " +
        "stacks, queues, and trees) and their implementation using an object-oriented programming language. Solutions " +
        "to a variety of computational problems such as search on graphs and trees. Elementary analysis of " +
        "algorithms.", "UIUC", "Heeren, C\n Yershova, G"]
    ],
    "Fall 2016":[
        ["Computer Science", "CS 446", "D3", "Machine Learning", "Theory and basic techniques in machine learning. Major" +
        " theoretical paradigms and key concepts developed in machine learning in the context of applications such as natural" +
        " language and text processing, computer vision, data mining, adaptive computer systems and others. Review of several" +
        " supervised and unsupervised learning approaches: methods for learning linear representations; on-line learning," +
        " Bayesian methods; decision-trees; features and kernels; clustering and dimensionality reduction.", "UIUC", "Roth, D"],

        ["Advertising", "ADV 582", "D", "Qualitative Research in Advert", "Treatment of basic research concepts and procedures in " +
        "the social sciences with emphasis on advertising.", "UIUC", "Nelson, M"],

        ["Computer Science", "CS 241", "AL1", "System Programming", "Basics of system programming, including POSIX processes," +
        " process control, inter-process communication, synchronization, signals, simple memory management, file I/O and directories," +
        " shell programming, socket network programming, RPC programming in distributed systems, basic security mechanisms, and" +
        " standard tools for systems programming such as debugging tools.", "UIUC", "Angrave, L"]
    ],
    "Fall 2015":[
        ["Electrical and Computer Engineering", "ECE 210", "AL1", "Analog Signal Processing", "Analog signal processing, with an emphasis on underlying" +
        " concepts from circuit and system analysis: linear systems; review of elementary circuit analysis; differential equation " +
        "models of linear circuits and systems; Laplace transform; convolution; stability; phasors; frequency response; Fourier " +
        "series; Fourier transform; active filters; AM radio.", "UIUC", "Hasegawa-Johnson, M"],
    ],
    "All":[]
};


var passwordHash = require('password-hash');
// test user profile
client.hmset("ClassTranscribe::Users::" + 'testing@testdomabbccc.edu', [
    'first_name', 'First',
    'last_name', 'Sur',
    'password', passwordHash.generate("passtest"),
    'change_password_id', '',
    'university', "test uni",
    'verified', true,
    'verify_id', '',
    'courses_as_instructor','',
    'courses_as_TA','',
    'courses_as_student',''
]);

// Just a wrapper
function print(msg){
    console.log(msg)
}

// Loading sample data into database
Object.keys(courseList).forEach( function (t) {
    client.sadd("ClassTranscribe::Terms", "ClassTranscribe::Terms::"+t);
    print(t)
    courseList[t].forEach(function (course) {
        // Add course
        var classid=getClassUid(university=course[5], term=t, number=course[1], section=course[2]);

        // General information update
        client.sadd("ClassTranscribe::CourseList", "ClassTranscribe::Course::"+classid); // add class to class list
        client.sadd("ClassTranscribe::Terms::"+t, "ClassTranscribe::Course::"+classid); // add class to term list
        client.sadd("ClassTranscribe::SubjectList", "ClassTranscribe::Subject::"+course[0]); // add class subject to subject list
        client.sadd("ClassTranscribe::Subject::"+course[0], "ClassTranscribe::Course::"+classid); // add class to the subject

        // Add course info
        client.hset("ClassTranscribe::Course::"+classid, "Subject", course[0]);
        client.hset("ClassTranscribe::Course::"+classid, "ClassNumber", course[1]);
        client.hset("ClassTranscribe::Course::"+classid, "SectionNumber", course[2]);
        client.hset("ClassTranscribe::Course::"+classid, "ClassName", course[3]);
        client.hset("ClassTranscribe::Course::"+classid, "ClassDesc", course[4]);
        client.hset("ClassTranscribe::Course::"+classid, "University", course[5]);
        client.hset("ClassTranscribe::Course::"+classid, "Instructor", course[6]);
        client.hset("ClassTranscribe::Course::"+classid, "Term", t);
    });
});

// Using the same Redis
sacl = new acl(new acl.redisBackend(client,"ClassTranscribe::acl::"));
// Example usage (default)
//acl.allow('UserRole', 'ResourceName', 'Action');
//acl.addUserRoles('UserName', 'UserRole');
// Example (per user)
sacl.addUserRoles('testing@testdomabbccc.edu', 'testing@testdomabbccc.edu');
sacl.allow('testing@testdomabbccc.edu', 'ClassTranscribe::Course::UIUC-Fall 2016-CS 446-D3', 'Modify');
sacl.allow('testing@testdomabbccc.edu', "ClassTranscribe::Course::UIUC-Spring 2016-Chem 233-AL2", 'Drop');
sacl.allow('testing@testdomabbccc.edu', "ClassTranscribe::Course::UIUC-Spring 2016-CS 225-AL1", 'Remove');

console.log("Sample data for class listings loaded...");
//======================End of sample data==========================================================


var allterms = [];
var managementMustache = fs.readFileSync(mustachePath + 'management.mustache').toString();
// Main page
router.get('/manage-classes/', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    var pa = passport.authenticate('local');
    var userid = getUserId(request);

    // get all terms data from the database
    client.smembers("ClassTranscribe::Terms", function(err, reply) {
        // reply is null if the key is missing
        allterms=[];
        reply.forEach(function (e) {
            allterms.push(e.split("::")[2]);
        });

        // add create-a-class section if user is authenticated
        // TODO: use a more appropriate authentication method
        var form = '';
        var createClassBtn = '';
        client.hgetall("ClassTranscribe::Users::"+getUserId(request), function (err, usrinfo) {
            if (request.isAuthenticated()) {
                form = getCreateClassForm(usrinfo);
                createClassBtn =
                    '<button class="btn" data-toggle="modal" data-target="#createPanel">' +
                    '          Create a New Class</button>';
            }
            // table header
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
            client.smembers("ClassTranscribe::CourseList", function (err, reply) {
                var commands = [];
                reply.forEach(function (c) {
                    // query every class to get info for display
                    commands.push(["hgetall", c]);
                });
                client.multi(commands).exec(function (err, replies) {
                    currentcontent = replies;
                    generateListings(replies, userid, function (res) {
                        thtml += res;
                        filterdata = generateFilters(replies);
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
                });
            });
        });
    });
});

// TODO: Security check, and university info should come from session not submitted, conflict check
// Create new class
router.post('/manage-classes/newclass', function (request, response) {
    //console.log("new class to be added, start processing...");
    var classid = getClassUid(university=request.body["University"], term=request.body["Term"], number=request.body["ClassNumber"], section=request.body["SectionNumber"]);
    var term = "ClassTranscribe::Terms::"+request.body.Term;
    var course = request.body;
    var userid = getUserId(request);
    if (userid==''){
        print("invalid userid");
        response.end();
        return;
    }
    // TODO: Perhaps a permission check
    // add class
    client.sadd("ClassTranscribe::CourseList", "ClassTranscribe::Course::"+classid); // add class to class list
    client.sadd(term, "ClassTranscribe::Course::"+classid); // add class to term list
    client.sadd("ClassTranscribe::SubjectList", "ClassTranscribe::Subject::"+course["Subject"]); // add class subject to subject list
    client.sadd("ClassTranscribe::Subject::"+course["Subject"], "ClassTranscribe::Course::"+classid); // add class to the subject

    // Add Course Info
    client.hset("ClassTranscribe::Course::"+classid, "Subject", course["Subject"]);
    client.hset("ClassTranscribe::Course::"+classid, "ClassNumber", course["ClassNumber"]);
    client.hset("ClassTranscribe::Course::"+classid, "SectionNumber", course["SectionNumber"]);
    client.hset("ClassTranscribe::Course::"+classid, "ClassName", course["ClassName"]);
    client.hset("ClassTranscribe::Course::"+classid, "ClassDesc", course["ClassDescription"]);
    client.hset("ClassTranscribe::Course::"+classid, "University", course["University"]);
    client.hset("ClassTranscribe::Course::"+classid, "Instructor", course["Instructor"]);
    client.hset("ClassTranscribe::Course::"+classid, "Term", course["Term"]);

    // add permissions
    sacl.allow(getUserId(request), "ClassTranscribe::Course::"+classid, "Modify");
    sacl.allow(getUserId(request), "ClassTranscribe::Course::"+classid, "Remove");
    sacl.allow(getUserId(request), "ClassTranscribe::Course::"+classid, "Drop");
    client.sadd("ClassTranscribe::Course::"+classid+"::Instructors", "ClassTranscribe::Users::"+getUserId(request));
    client.sadd("ClassTranscribe::Users::"+getUserId(request)+"::Courses_as_Instructor", "ClassTranscribe::Course::"+classid);

    // For enroll maybe
    // client.hset("ClassTranscribe::Course::"+getUserId(request), "courses_as_student", course["Term"]);

    response.end();
});


// Handles search and renders the whole page
router.get('/manage-classes/search', function (request, response) {
    //console.log("start processing search...");
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    // same as the main page
    client.smembers("ClassTranscribe::Terms", function(err, reply) {
        allterms=[];
        reply.forEach(function (e) {
            allterms.push(e.split("::")[2]);
        });
        client.hgetall("ClassTranscribe::Users::"+getUserId(request), function (err, usrinfo) {
            var form = '';
            if (request.isAuthenticated()) {
                form = getCreateClassForm(usrinfo);
            }
            //========================starting search==========================================
            var searchterm = request.query.q;
            console.log("Searching: "+searchterm);
            var search = new srchHelper.SearchHelper(searchterm);
            search.search(function (line) {
                var hhtml= "<tr id=\"#header\">\n" +
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
                commands.forEach(function (c,i,arr) {
                    arr[i]=['hgetall',"ClassTranscribe::Course::"+c.slice(0, -3)];
                });
                client.multi(commands).exec(function (err, replies) {
                    if (err) throw(err)
                    var olen =replies.length;
                    replies = replies.filter(function(n){ return n != undefined });
                    if(replies.length!=olen){console.log("nil in search replies detected")}
                    currentcontent = replies;
                    generateListings(replies,getUserId(request),function (lres) {
                        if (replies.length==0){
                            hhtml = 'No result found for "'+searchterm+'"';
                        }
                        else{
                            hhtml+=lres;
                        }
                        filterdata = generateFilters(replies);
                        var view = {
                            termlist: allterms,
                            createform:form,
                            tabledata:hhtml,
                            termfilterdata:filterdata[0],
                            subjectfilterdata:filterdata[1]
                        };
                        var html = Mustache.render(managementMustache, view);
                        response.end(html);
                    });
                });
            });
        });
    });
});



// handles class deletion,
// TODO: Trashbin feature, also need to decide what to do with the transcription file
router.delete('/manage-classes/deleteclass/', function (request, response) {
    var params = request.body.classinfo;
    params = params.split(',,');
    var delclass = getClassUid(params[1],  params[0], params[3], params[4])
    var usrid = getUserId(request);
    sacl.isAllowed("ClassTranscribe::Users::"+usrid, "ClassTranscribe::Course::"+delclass, "Delete", function (err, res) {
        // Remove any reference to the class
        var commands = [
            ['del', 'ClassTranscribe::Course::' + delclass],
            ['srem', 'ClassTranscribe::Terms::' + request.body.term, 'ClassTranscribe::Course::' + delclass],
            ['srem', 'ClassTranscribe::Subject::' + params[1], 'ClassTranscribe::Course::' + delclass],
            ['srem', 'ClassTranscribe::CourseList', 'ClassTranscribe::Course::' + delclass]
        ];
        client.multi(commands).exec(function (err, replies) {
            if (err) {
                console.log("error in deleting class" + delclass);
            }
            else {
                console.log(delclass + " deleted");
                currentcontent.splice(currentcontent.indexOf(delclass), 1)
            }

            sacl.removeAllow(getUserId(request), 'ClassTranscribe::Course::' + delclass, "Drop");
            sacl.removeAllow(getUserId(request), 'ClassTranscribe::Course::' + delclass, "Remove");
            sacl.removeAllow(getUserId(request), 'ClassTranscribe::Course::' + delclass, "Modify");
            // TODO: remove other all relavant info in the database
            client.smembers("ClassTranscribe::Course::" + delclass + "::Students", function (err, rep) {
                rep.forEach(function (c) {
                    client.srem(c + "::Courses_as_Student", "ClassTranscribe::Course::" + delclass)
                });
                client.del("ClassTranscribe::Course::" + delclass + "::Students");
                client.smembers("ClassTranscribe::Course::" + delclass + "::Instructors", function (err, rep) {
                    rep.forEach(function (c) {
                        client.srem(c + "::Courses_as_Instructor", "ClassTranscribe::Course::" + delclass)
                    });
                    client.del("ClassTranscribe::Course::" + delclass + "::Instructors");
                    client.smembers("ClassTranscribe::Course::" + delclass + "::TAs", function (err, rep) {
                        rep.forEach(function (c) {
                            client.srem(c + "::Courses_as_TA", "ClassTranscribe::Course::" + delclass)
                        });
                        client.del("ClassTranscribe::Course::" + delclass + "::TAs");
                        response.end();
                    });
                });
            });
        });
    });
});


// return courses and their information offered in a term
router.get('/manage-classes/getterminfo', function (request, response) {
    if(request.query["term"]=="All")
        var term = "ClassTranscribe::CourseList";
    else
        var term = "ClassTranscribe::Terms::" + request.query["term"];
    client.smembers(term, function (err, reply) {
        var commands = [];
        reply.forEach(function (c){
            // query every class to get info for display
            commands.push(["hgetall", c]);
        });
        client.multi(commands).exec(function (err, replies) {
            response.send(replies);
        });
    });
});


// modify class
router.post('/manage-classes/modifyclass',function (request, response) {
    var usrid = getUserId(request);
    var params = request.body;
    var mclass = getClassUid(params['uni'],  params['term'], params['Course Number'], params['Section Number']);
    sacl.isAllowed(usrid, "ClassTranscribe::Course::"+mclass, "Modify", function (err, res) {
        if(err) {print(err)}
        if (res){
            var commands=[
                ['hset','ClassTranscribe::Course::'+mclass, 'ClassName', params['Class Name']],
                ['hset','ClassTranscribe::Course::'+mclass, 'ClassDesc', params['Course Description']],
                //['hset','ClassTranscribe::Course::'+mclass, 'ClassNumber', params['Course Number']],
                //['hset','ClassTranscribe::Course::'+mclass, 'SectionNumber', params['Section Number']],
                //['hset','ClassTranscribe::Course::'+mclass, 'Subject', params['Subject']]
            ];
            client.multi(commands).exec(function (err, replies) {
                if(err){console.log("error in modifying class" + mclass);}
                else{console.log(mclass+" modified");}
                response.end();
            });
        }
        else{
            response.end();
        }
    });
});

// modify the view table based on the filter
router.post('/manage-classes/applyfilter', function (request, response) {
    var termf = request.body.termfilter.split(';;');
    var subjectf = request.body.subjectfilter.split(';;');

    rethtml="<tr id=\"#header\">\n" +
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
    var result = []
    currentcontent.forEach(function(e){
        if( subjectf.indexOf(e['Subject'])>=0 && termf.indexOf(e['Term'])>=0) {
            result.push(e)
        }
    });
    generateListings(result,getUserId(request), function (res) {
        rethtml+=res;
        response.send(rethtml);
    });
});

// generate filters from a list of classes, currently only for terms and subjects
// returns html sections
function generateFilters(data){
    var termlist = [];
    var subjectlist = [];
    var termhtml = '';
    var subjecthtml = '';
    data.forEach(function(e){
        if  (subjectlist.indexOf(e['Subject'])<0){
            subjectlist.push(e['Subject']);
            subjecthtml  += '<div class="form-check">'+
                '    <label class="form-check-label checkboxlabel">'+
                '    <input class="form-check-input" type="checkbox" value="'+e['Subject']+'" checked>'+
                e['Subject']+
                '</label>'+
                '</div>'
        }
        if  (termlist.indexOf(e['Term'])<0){
            termlist.push(e['Term']);
            termhtml  += '<div class="form-check">'+
                '    <label class="form-check-label checkboxlabel">'+
                '    <input class="form-check-input" type="checkbox" value="'+e['Term']+'" checked>'+
                e['Term']+
                '</label>'+
                '</div>'
        }
    });
    return [termhtml,subjecthtml];
}

// generate coourse listing data
// data - input course info
// user - user id
// cb   - callback function
function  generateListings(data, user, cb) {
    var html = '';
    async.eachSeries(data, function (c, fcb) {
            html += '<tr>';
            html += '<td hidden="yes">' + c["Term"] + '</td>';
            html += '<td>' + c["University"] + '</td>';
            html += '<td>' + c["Subject"] + '</td>';
            html += '<td>' + c["ClassNumber"] + '</td>';
            html += '<td>' + c["SectionNumber"] + '</td>';
            html += '<td>' + c["ClassName"] + '</td>';
            html += '<td>' + c["Instructor"] + '</td>';
            html += '<td class="tddesc">' + c["ClassDesc"] + '</td>';
            html += '<td class="col-md-2">';
            var debug = false;
            if (debug || (user != '' && user != undefined)) {
                var classid = "ClassTranscribe::Course::" + getClassUid(c["University"], c["Term"], c['ClassNumber'], c['SectionNumber']);
                sacl.isAllowed(user, classid, 'Drop', function (err, res) {
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
                    sacl.isAllowed(user, classid, 'Modify', function (err, res) {
                        if (res) {
                            html +=
                                '<a class="actionbtn modbtn" data-toggle="modal" data-target="#modpanel">' +
                                '          <span class="glyphicon glyphicon-pencil"></span> Modify\n' +
                                '        </a>';
                        }
                        sacl.isAllowed(user, classid, 'Remove', function (err, res) {
                            if (res) {
                                html +=
                                    '<a class="actionbtn rmbtn">' +
                                    '          <span class="glyphicon glyphicon-remove"></span> Remove\n' +
                                    '        </a>' +
                                    '</td>';
                            }
                            html += '</tr>';
                            fcb(null);
                        });
                    });
                });
            }
            else{fcb(null)}
        },
        function (err, res) {
            cb(html);
        });
}
// get user id from email
// return -  currently just returns the email (i.e. abc@def.edu) or '' in case of error
function getUserId(req) {
    var id = "";
    try{
        id = req.session.passport.user;
    }
    catch(e) {
        id="";
        print("invalid user id detected")
    }
    return id;
}

//
router.post('/manage-classes/enroll/', function (request, response) {
    var params = request.body.classinfo;
    params = params.split(',,');
    var userid = getUserId(request);
    var classid = getClassUid(params[1],  params[0], params[3], params[4]);

    client.sadd("ClassTranscribe::Users::"+userid+"::Courses_as_Student", "ClassTranscribe::Course::"+classid);
    client.sadd("ClassTranscribe::Course::"+classid+"::Students", "ClassTranscribe::Users::"+userid);
    sacl.allow(userid, "ClassTranscribe::Course::"+classid, 'Drop');

    response.end();
});


//
router.post('/manage-classes/drop/', function (request, response) {
    var params = request.body.classinfo;
    params = params.split(',,');
    var userid = getUserId(request);
    var classid = getClassUid(params[1],  params[0], params[3], params[4]);

    client.srem("ClassTranscribe::Users::"+userid+"::Courses_as_Student", "ClassTranscribe::Course::"+classid);
    sacl.removeAllow(userid, "ClassTranscribe::Course::"+classid, 'Drop');

    response.end()
});



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
                        "<div class=\"row\"> " +
                            "<div class=\"col-md-4\"> " +
                                "<label>Subject</label> <input type=\"text\" class=\"form-control\" id=\"fminput1\" placeholder=\"\" name=\"Subject\"> " +
                                "<label>Course Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput2\" placeholder=\"\" name=\"ClassNumber\"> </div> " +
                            "<div class=\"col-md-4\"> " +
                                "<label>Class Name</label> <input type=\"text\" class=\"form-control\" id=\"fminput3\" placeholder=\"\" name=\"ClassName\"> " +
                                "<label>Instructor</label> <input type=\"text\" class=\"form-control\" id=\"fminput4\" value=\""+rep.first_name+' '+rep.last_name+"\" name=\"Instructor\" readonly> </div> " +
                            "<div class=\"col-md-4\"> " +
                                "<label>Section Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput5\" placeholder=\"\" name=\"SectionNumber\"> " +
                                "<label>University</label> <input type=\"text\" class=\"form-control\" id=\"fminput6\" value=\""+rep.university+"\" name=\"University\" readonly> </div> </div> " +
                        "<div class=\"row\"> <div class=\"col-md-12\"> " +
                            "<label>Course Description</label> <input type=\"text\" class=\"form-control\" id=\"fminput7\" placeholder=\"\" name=\"ClassDescription\"> </div> </div> " +
                    '<div class="modal-footer">'+
                        '<input id="cfmCreate" type="submit" class="btn btn-default" value="Create"></input>'+
                        '<button id="cfmCancel" type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                    '</form>'+
                '</div>'+
            '</div>'+
        '</div>';
}

module.exports = router;