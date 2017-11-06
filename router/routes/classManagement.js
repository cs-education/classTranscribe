
var router = express.Router();
var shelper = require("../../utility_scripts/searchContent.js");
//===========================my section=========================================

//=======================Sample data for testing=====================================
function getClassUid(university, term, number, section) {
    if(!university|| !term|| !number|| !section){
        console.log("potential problem in uid, empty/null value detected");
    }
    return university+"-"+term+"-"+number+"-"+section;
}

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


Object.keys(courseList).forEach( function ( t) {
    client.sadd("ClassTranscribe::Terms", "ClassTranscribe::Terms::"+t);
    print(t)
    courseList[t].forEach(function (course) {
        // Add course
        //console.log(course);
        var classid=getClassUid(university=course[5], term=t, number=course[1], section=course[2]);

        //General Information update
        client.sadd("ClassTranscribe::CourseList", "ClassTranscribe::Course::"+classid); // add class to class list
        client.sadd("ClassTranscribe::Terms::"+t, "ClassTranscribe::Course::"+classid); // add class to term list
        client.sadd("ClassTranscribe::SubjectList", "ClassTranscribe::Subject::"+course[0]); // add class subject to subject list
        client.sadd("ClassTranscribe::Subject::"+course[0], "ClassTranscribe::Course::"+classid); // add class to the subject


        // Add Course Info
        client.hset("ClassTranscribe::Course::"+classid, "Subject", course[0]);
        client.hset("ClassTranscribe::Course::"+classid, "ClassNumber", course[1]);
        client.hset("ClassTranscribe::Course::"+classid, "SectionNumber", course[2]);
        client.hset("ClassTranscribe::Course::"+classid, "ClassName", course[3]);
        client.hset("ClassTranscribe::Course::"+classid, "ClassDesc", course[4]);
        client.hset("ClassTranscribe::Course::"+classid, "University", course[5]);
        client.hset("ClassTranscribe::Course::"+classid, "Instructor", course[6]);
    });
});


console.log("Sample Data Loaded");

var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
//======================End of sample data==========================================================


//----------------Management Page Section-------------------------------------------
var allterms = [];
var managementMustache = fs.readFileSync(mustachePath + 'management.mustache').toString();
router.get('/manage-classes', function (request, response) {
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
        console.log("terms initted");
        console.log(allterms);

        // add create-a-class section if user is authenticated
        // TODO: use a more appropriate authentication method
        //var form = '';
        if (request.isUnauthenticated()) {
          form = "<section> <div class=\"row\"> <h3>Create a new course</h3> </div> <form id=\"creation-form\" method=\"POST\"> <div class=\"row\"> <div class=\"col-md-3\"> <label>Subject</label> <input type=\"text\" class=\"form-control\" id=\"fminput1\" placeholder=\"Example input\" value=\"CS\" name=\"Subject\"> <label>Course Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput2\" placeholder=\"Another input\" name=\"ClassNumber\"> </div> <div class=\"col-md-3\"> <label>Class Name</label> <input type=\"text\" class=\"form-control\" id=\"fminput3\" placeholder=\"Example input\" name=\"ClassName\"> <label>Instructor</label> <input type=\"text\" class=\"form-control\" id=\"fminput4\" placeholder=\"Example input\" name=\"Instructor\"> </div> <div class=\"col-md-2\"> <label>Section Number</label> <input type=\"text\" class=\"form-control\" id=\"fminput5\" placeholder=\"Example input\" name=\"SectionNumber\"> <label>University</label> <input type=\"text\" class=\"form-control\" id=\"fminput6\" placeholder=\"Example input\" name=\"University\"> </div> </div> <div class=\"row\"> <div class=\"col-md-8\"> <label>Course Description</label> <input type=\"text\" class=\"form-control\" id=\"fminput7\" placeholder=\"Example input\" name=\"ClassDescription\"> </div> </div> <div class=\"row\"> <div class=\"col-md-3\"> <button type=\"submit\" class=\"btn btn-primary\" id=\"subbtn\">Create Class</button> </div> </div> </form> </section>";
        }




        var view = {
            termlist: allterms,
            className: "cs225-sp16",
            exampleTerm: exampleTerms["cs225-sp16"],
            createform:form
        };
        var html = Mustache.render(managementMustache, view);
        console.log("is authenticated = "+request.isAuthenticated());



        response.end(html);
    });
});

// TODO: Security check, and university info should come from session not submitted
// Add new class
router.post('/manage-classes/newclass', function (request, response) {
    console.log("new class to be added, start processing...");
    var classid = getClassUid(university=request.body["University"], term=request.body["Term"], number=request.body["University"], section=request.body["SectionNumber"]);
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
    response.end();
//    console.log(request.body);
});


// handles search
router.get('/manage-classes/search/', function (request, response) {
    console.log("start processing search...");
    var searchterm = request.query.Search;
    console.log("Searching: "+searchterm);

    var search = new shelper.SearchHelper(request.query.Search);
    search.search(function (line) {
        var html= "<tr id=\"#header\">\n" +
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
            //arr[i]='hgetall "ClassTranscribe::Course::'+c.slice(0, -3)+'"';
            arr[i]=['hgetall',"ClassTranscribe::Course::"+c.slice(0, -3)];
        });
        //console.log(commands)
        client.multi(commands).exec(function (err, replies) {
            if (err) throw(err)
            var olen =replies.length;
            replies = replies.filter(function(n){ return n != undefined });
            if(replies.length!=olen){console.log("nil in search replies detected")}
            replies.forEach(function(e){
               html+='<tr>\n' +
                   '<td>' + e["University"] + '</td>'+
                   '<td>' + e["Subject"] + '</td>'+
                   '<td>' + e["ClassNumber"] + '</td>'+
                   '<td>' + e["SectionNumber"] + '</td>'+
                   '<td>' + e["ClassName"] + '</td>' +
                   '<td>' + e["Instructor"] + '</td>'+
                   '<td>' + e["ClassDesc"] + '</td>'+
                   '<td>' + '<button type="button" class="btn btn-default btn-sm">\n' +
                   '          <span class="glyphicon glyphicon-plus"></span> Enroll\n' +
                   '        </button>' +
                   '<button type="button" class="btn btn-default btn-sm">\n' +
                   '          <span class="glyphicon glyphicon-minus"></span> Drop\n' +
                   '        </button>' +
                   '<button type="button" class="btn btn-default btn-sm">\n' +
                   '          <span class="glyphicon glyphicon-remove"></span> Remove \n' +
                   '        </button>' + '</td>' +
                   '</tr>'
            });

            if (replies.length==0){
                html = 'No result found for "'+searchterm+'"';
            }
            response.send(html);
            response.end();
        });
    });
});



// handles class deletion
router.post('/manage-classes/deleteclass/', function (request, response) {
    console.log("start processing deletion...");
    var params = request.body.classinfo;
    console.log(params);
    params = params.split(',,');
    var delclass = getClassUid(params[0],  request.body.term, params[2], params[3])
    console.log(delclass);
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
    //TODO: might want to delete transcription file too
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

//----------------Management Section-------------------------------------------

module.exports = router;