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
//  |                                |--ClassTranscribe::Subject::YY|--ClassTranscribe::Course::C2
//  |                                                               |--ClassTranscribe::Course::C3
//  |--ClassTranscribe::Course::C1--"ClassNumber","SectionNumber","ClassName","ClassDesc","University","Instructor","Term"|||(End of current attributes)|||students, instructors<== planned/WIP attributes
//  |--ClassTranscribe::Course::...
//  |
//  ========== User section ==========
//  |
//  |--ClassTranscribe::Users::userid_1--'first_name', 'last_name', 'password',|||(End of current attributes)|||, classes with instructor access, classes with student access
//  |--ClassTranscribe::Users::...     --...
//  |
//  |
//  ========== Misc section ==========
//  |
//  |


// note: for classid see getClassUid(...)
//       for userid it's just email at the moment



var router = express.Router();
// Search helper
var shelper = require("../../utility_scripts/searchContent.js");
// Saving current content before applying filters
var currentcontent = []


//=======================Sample data for testing=====================================
// create Uid for the class
function getClassUid(university, term, number, section) {
    if(!university|| !term|| !number|| !section){
        console.log("potential problem in uid, empty/null value detected");
        if (!term) term = 'All';
    }
    return university+"-"+term+"-"+number+"-"+section;
}
// Old data, ignore this
//var schoolTermsList = ["Spring 2016", "Fall 2016","Spring 2017", "Fall 2017", "Spring 2018", "All"];
//var schoolTermsList = ["Spring 2016", "Fall 2016", "Fall 2015","All"];
// 0-subject, 1-class number, 2-Section-number, 3-class name, 4-class description, 5-University, 6-instructor name
// var courseList = {"Spring 2016":[["Computer Science", "CS123","AGX","Intro to CS", "no desc yet", "UIUC","Instructor A. P."],
//     ["Computer Science", "CS223","GAX","More intro to CS", "desc", "UIUC","Instructor B. P."],
//     ["History", "HIST123","AGX","Intro to Ancient Civ", "desc", "UIUC","Instructor H. P."]],
//     "Fall 2016":[["Mathematics", "MATH343","XGX","Linear Algebra", "desc", "UIUC","Instructor B. E."],
//         ["Computer Science", "CS423","GHX","Even More intro to CS", "desc", "UIUC","Instructor W. J."],
//         ["Sociology", "SOCI323","AGX","Society and XXX", "desc", "UIUC","Instructor Q"]],
//     "Spring 2017":[], "Fall 2017":[], "Spring 2018":[],"All":[]};
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



// just a wrapper
function print(msg){
    console.log(msg)
}

// Loading sample data into database
Object.keys(courseList).forEach( function ( t) {
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


console.log("Sample Data Loaded");
//var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
//======================End of sample data==========================================================


var allterms = [];
var managementMustache = fs.readFileSync(mustachePath + 'management.mustache').toString();
// Rendering ain page
router.get('/manage-classes/', function (request, response) {
    if (!request.isAuthenticated()) {
        response.redirect('../');
    }
    
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    var pa = passport.authenticate('local')
    print(pa)

    // get all terms data from the database
    client.smembers("ClassTranscribe::Terms", function(err, reply) {
        // reply is null when the key is missing
        allterms=[];
        reply.forEach(function (e) {
            allterms.push(e.split("::")[2]);
        })
        console.log("terms initted");
        console.log(allterms);

        // add create-a-class section if user is authenticated
        // TODO: use a more appropriate authentication method
        var form = '';
        if (request.isAuthenticated()) {
            form = "<section> <div class=\"row\"> " +
                "<h3>Create a new course</h3> </div> " +
                "<form id=\"creation-form\" method=\"POST\"> " +
                "<div class=\"row\"> " +
                "<div class=\"col-md-3\"> " +
                "<label>Subject</label> <input type=\"text\" class=\"form-control\" id=\"fminput1\" placeholder=\"Example input\" value=\"CS\" name=\"Subject\"> " +
                "<label>Course Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput2\" placeholder=\"Another input\" name=\"ClassNumber\"> </div> " +
                "<div class=\"col-md-3\"> " +
                "<label>Class Name</label> <input type=\"text\" class=\"form-control\" id=\"fminput3\" placeholder=\"Example input\" name=\"ClassName\"> " +
                "<label>Instructor</label> <input type=\"text\" class=\"form-control\" id=\"fminput4\" placeholder=\"Example input\" name=\"Instructor\"> </div> " +
                "<div class=\"col-md-2\"> " +
                "<label>Section Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput5\" placeholder=\"Example input\" name=\"SectionNumber\"> " +
                "<label>University</label> <input type=\"text\" class=\"form-control\" id=\"fminput6\" placeholder=\"Example input\" name=\"University\"> </div> </div> " +

                "<div class=\"row\"> <div class=\"col-md-8\"> " +
                "<label>Course Description</label> <input type=\"text\" class=\"form-control\" id=\"fminput7\" placeholder=\"Example input\" name=\"ClassDescription\"> </div> </div> " +
                "<div class=\"row\"> <div class=\"col-md-3\"> <button type=\"submit\" class=\"btn btn-primary\" id=\"subbtn\">Create Class</button> </div> </div> </form> </section>";
        }
        var thtml= "<tr id=\"#header\">\n" +
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
        client.smembers("ClassTranscribe::CourseList", function (err, reply) {
            var commands = [];
            reply.forEach(function (c){
                // query every class to get info for display
                commands.push(["hgetall", c]);
            });
            client.multi(commands).exec(function (err, replies) {
                currentcontent=replies;
                replies.forEach(function(c){
                    thtml += '<tr>';
                    thtml += '<td hidden="yes">' + c["Term"] + '</td>';
                    thtml += '<td>' + c["University"] + '</td>';
                    thtml += '<td>' + c["Subject"] + '</td>';
                    thtml += '<td>' + c["ClassNumber"] + '</td>';;
                    thtml += '<td>' + c["SectionNumber"] + '</td>';
                    thtml += '<td>' + c["ClassName"] + '</td>';
                    thtml += '<td>' + c["Instructor"] + '</td>';
                    thtml += '<td class="tddesc">' + c["ClassDesc"] + '</td>';
                    thtml += '<td class="col-md-2">' + '<a class="actionbtn">' +
                        '          <span class="glyphicon glyphicon-plus"></span> Enroll\n' +
                        '        </a>' +
                        '<a class="actionbtn">' +
                        '          <span class="glyphicon glyphicon-minus"></span> Drop\n' +
                        '        </a>' +
                        '<br>'+
                        '<a class="actionbtn modbtn" data-toggle="modal" data-target="#modpanel">' +
                        '          <span class="glyphicon glyphicon-pencil"></span> Modify\n' +
                        '        </a>' +
                        '<a class="actionbtn rmbtn">' +
                        '          <span class="glyphicon glyphicon-remove"></span> Remove\n' +
                        '        </a>' +
                        '</td>';

                    thtml += '</tr>';
                });
                filterdata = generateFilters(replies);

                var view = {
                    termlist: allterms,
                    //className: "cs225-sp16",
                    //exampleTerm: exampleTerms["cs225-sp16"],
                    createform:form,
                    tabledata:thtml,
                    termfilterdata:filterdata[0],
                    subjectfilterdata:filterdata[1]
                };
                var html = Mustache.render(managementMustache, view);
                response.end(html);
            });
        });
    });
});

// TODO: Security check, and university info should come from session not submitted
// Create new class
router.post('/manage-classes/newclass', function (request, response) {
    console.log("new class to be added, start processing...");
    var classid = getClassUid(university=request.body["University"], term=request.body["Term"], number=request.body["ClassNumber"], section=request.body["SectionNumber"]);
    var term = "ClassTranscribe::Terms::"+request.body.Term;
    var course = request.body;
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
    response.end();
});


// Handles search and renders the whole page
router.get('/manage-classes/search', function (request, response) {
    console.log("start processing search...");
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    // get all terms data from the database
    client.smembers("ClassTranscribe::Terms", function(err, reply) {
        // reply is null when the key is missing
        allterms=[];
        reply.forEach(function (e) {
            allterms.push(e.split("::")[2]);
        })
        var form = '';
        if (request.isAuthenticated()) {
            form = "<section> <div class=\"row\"> " +
                "<h3>Create a new course</h3> </div> " +
                "<form id=\"creation-form\" method=\"POST\"> " +
                "<div class=\"row\"> " +
                "<div class=\"col-md-3\"> " +
                "<label>Subject</label> <input type=\"text\" class=\"form-control\" id=\"fminput1\" placeholder=\"Example input\" value=\"CS\" name=\"Subject\"> " +
                "<label>Course Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput2\" placeholder=\"Another input\" name=\"ClassNumber\"> </div> " +
                "<div class=\"col-md-3\"> " +
                "<label>Class Name</label> <input type=\"text\" class=\"form-control\" id=\"fminput3\" placeholder=\"Example input\" name=\"ClassName\"> " +
                "<label>Instructor</label> <input type=\"text\" class=\"form-control\" id=\"fminput4\" placeholder=\"Example input\" name=\"Instructor\"> </div> " +
                "<div class=\"col-md-2\"> " +
                "<label>Section Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput5\" placeholder=\"Example input\" name=\"SectionNumber\"> " +
                "<label>University</label> <input type=\"text\" class=\"form-control\" id=\"fminput6\" placeholder=\"Example input\" name=\"University\"> </div> </div> " +

                "<div class=\"row\"> <div class=\"col-md-8\"> " +
                "<label>Course Description</label> <input type=\"text\" class=\"form-control\" id=\"fminput7\" placeholder=\"Example input\" name=\"ClassDescription\"> </div> </div> " +
                "<div class=\"row\"> <div class=\"col-md-3\"> <button type=\"submit\" class=\"btn btn-primary\" id=\"subbtn\">Create Class</button> </div> </div> </form> </section>";
        }
        //========================starting search==========================================
        var searchterm = request.query.q;
        console.log("Searching: "+searchterm);

        var search = new shelper.SearchHelper(searchterm);
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
                replies.forEach(function(e){
                   hhtml+='<tr>\n' +
                       '<td hidden="yes">' + e["Term"] + '</td>'+
                       '<td>' + e["University"] + '</td>'+
                       '<td>' + e["Subject"] + '</td>'+
                       '<td>' + e["ClassNumber"] + '</td>'+
                       '<td>' + e["SectionNumber"] + '</td>'+
                       '<td>' + e["ClassName"] + '</td>' +
                       '<td>' + e["Instructor"] + '</td>'+
                       '<td>' + e["ClassDesc"] + '</td>'+
                       '<td class="col-md-2">' + '<a class="actionbtn">' +
                       '          <span class="glyphicon glyphicon-plus"></span> Enroll\n' +
                       '        </a>' +
                       '<a class="actionbtn">' +
                       '          <span class="glyphicon glyphicon-minus"></span> Drop\n' +
                       '        </a>' +
                       '<br>'+
                       '<a class="actionbtn">' +
                       '          <span class="glyphicon glyphicon-pencil"></span> Modify\n' +
                       '        </a>' +
                       '<a class="actionbtn rmbtn">' +
                       '          <span class="glyphicon glyphicon-remove"></span> Remove\n' +
                       '        </a>' +
                       '</td>' +
                       '</tr>'
                });

                if (replies.length==0){
                    hhtml = 'No result found for "'+searchterm+'"';
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



// handles class deletion, TODO: Trashbin feature, also need to decide what to do with the transcription file
router.post('/manage-classes/deleteclass/', function (request, response) {
    console.log("start processing deletion...");
    var params = request.body.classinfo;
    params = params.split(',,');
    var delclass = getClassUid(params[1],  params[0], params[3], params[4])
    // Remove any reference to the class
    var commands=[
        ['del','ClassTranscribe::Course::'+delclass],
        ['srem','ClassTranscribe::Terms::'+request.body.term,'ClassTranscribe::Course::'+delclass],
        ['srem','ClassTranscribe::Subject::'+params[1],'ClassTranscribe::Course::'+delclass],
        ['srem','ClassTranscribe::CourseList','ClassTranscribe::Course::'+delclass]
    ];
    client.multi(commands).exec(function (err, replies) {
        if(err){console.log("error in deleting class" + delclass);}
        else{console.log(delclass+" deleted");}
        response.end();
    });
});


// return courses and their information offered in a term
router.get('/manage-classes/getterminfo', function (request, response) {
    console.log("term change noted");
    console.log(request.query["term"]);
    if(request.query["term"]=="All"){
        var term = "ClassTranscribe::CourseList";
    }
    else {
        var term = "ClassTranscribe::Terms::" + request.query["term"];
    }
    client.smembers(term, function (err, reply) {
        var commands = [];
        reply.forEach(function (c){
            // query every class to get info for display
            commands.push(["hgetall", c]);
        });
        console.log("getterminfo command:"+commands);
        client.multi(commands).exec(function (err, replies) {
            console.log("getterminfo final replies:"+replies);
            response.send(replies);
        });
    });
});


// modify class
router.post('/manage-classes/modifyclass',function (request, response) {
    // TODO priviledge checkvar params = request.body.classinfo;
    // TODO class number and maybe others shouldn't be modifiable since they are part of the index/uid
    var params = request.body;
    var mclass = getClassUid(params['uni'],  params['term'], params['Course Number'], params['Section Number'])
    var commands=[
        ['hset','ClassTranscribe::Course::'+mclass, 'ClassName', params['Class Name']],
        ['hset','ClassTranscribe::Course::'+mclass, 'ClassDesc', params['Course Description']],
        ['hset','ClassTranscribe::Course::'+mclass, 'ClassNumber', params['Course Number']],
        ['hset','ClassTranscribe::Course::'+mclass, 'SectionNumber', params['Section Number']],
        ['hset','ClassTranscribe::Course::'+mclass, 'Subject', params['Subject']]
    ];
    client.multi(commands).exec(function (err, replies) {
        if(err){console.log("error in modifying class" + mclass);}
        else{console.log(mclass+" modified");}
        response.end();
    });
});

// modify the view table based on the filter
router.post('/manage-classes/applyfilter', function (request, response) {
    console.log("start filtering process...");
    var termf = request.body.termfilter.split(';;');
    var subjectf = request.body.subjectfilter.split(';;');

    print(subjectf)
    print(termf)

    rethtml= ''
    rethtml+="<tr id=\"#header\">\n" +
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
    currentcontent.forEach(function(e){
        if( subjectf.indexOf(e['Subject'])>=0 && termf.indexOf(e['Term'])>=0) {
            rethtml += '<tr>\n' +
                '<td hidden="yes">' + e["Term"] + '</td>' +
                '<td>' + e["University"] + '</td>' +
                '<td>' + e["Subject"] + '</td>' +
                '<td>' + e["ClassNumber"] + '</td>' +
                '<td>' + e["SectionNumber"] + '</td>' +
                '<td>' + e["ClassName"] + '</td>' +
                '<td>' + e["Instructor"] + '</td>' +
                '<td>' + e["ClassDesc"] + '</td>' +
                '<td class="col-md-2">' + '<a class="actionbtn">' +
                '          <span class="glyphicon glyphicon-plus"></span> Enroll\n' +
                '        </a>' +
                '<a class="actionbtn">' +
                '          <span class="glyphicon glyphicon-minus"></span> Drop\n' +
                '        </a>' +
                '<br>' +
                '<a class="actionbtn">' +
                '          <span class="glyphicon glyphicon-pencil"></span> Modify\n' +
                '        </a>' +
                '<a class="actionbtn rmbtn">' +
                '          <span class="glyphicon glyphicon-remove"></span> Remove\n' +
                '        </a>' +
                '</td>' +
                '</tr>';
        }
    });
    response.send(rethtml);
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

function userPriviledges(userid){
    ret = [[],[],[]]
    client.hget("ClassTranscribe::Users::"+userid,'courses_as_student', function(err, reply) {

        client.hget("ClassTranscribe::Users::"+userid,'courses_as_TA', function(err, reply) {

            client.hget("ClassTranscribe::Users::"+userid,'courses_as_instructor', function(err, reply) {

            });
        });
    });
}


module.exports = router;