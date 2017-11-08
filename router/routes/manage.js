/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fs = require('fs');
var client = require('./../../modules/redis');
var readline = require('readline');
var sys = require('sys');
var exec = require('child_process').exec;
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './videos');
  },
  filename: function(req, file, callback) {
    var split = file.originalname.split(/(?:.mp4|.avi|.flv|.wmv|.mov|.wav|.ogv|.mpg|.m4v)/);
    callback(null, split[0]+".mp4");
  }
});
/**var storage = multer.diskStorage({
  dest: './videos',
  rename: function(fieldname, filename) {
    var split = filename.split(/(?:.mp4|.avi|.flv|.wmv|.mov|.wav|.ogv|.mpg|.m4v)/);
    console.log(filename);
    if(split.length != 2) {
      return "bad_file";
    }
    return split[0]+".mp4";
  },
  onFileUploadStart: function(file) {
    if(file.name == "bad_file") {
      return false;
    }
    console.log(file.name + " upload is starting...");
  }
});**/

var manageCoursePage = fs.readFileSync(mustachePath + 'manageCourse.mustache').toString();
router.get('/manageCourse', function (request, response) {
console.log("Got ROUTE", manageCoursePage)
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(manageCoursePage, request, response);
});

router.get('/getUserCourses', function (request, response) {

   client.smembers("ClassTranscribe::CourseList", function(err, results) {
   	 if(err) console.log(err);
   	 console.log(results);
     response.send(results);
   });
});

router.post('/addInstructors', function (request, response) {
   var data = request.body.instructors;
   var instructors = data.split(/[\s,;:\n]+/);
   var toadd = [];
   for(instructor in instructors) {
    if(instructor.match(/\^w+@[a-z]+?\.edu$/)) {
      toadd.push(instructor);
    }
   }
   console.log(instructors);
   console.log(toadd);
   client.sadd("instructors", toadd, function(err, res) {
      if(err) console.log(err);
   		console.log("added instructors");
   });
   response.send(instructors);
});

router.post('/addStudents', function (request, response) {
   var data = request.body.students;
   var students = data.split(/[\s,;:\n]+/);
   client.sadd("students", students, function(err, res) {
   		console.log("added students");
   });
   response.send(students);
});

//var upload = multer({ storage : storage}).single('studentsFile');
router.post('/UploadStudentsFiles', function (request, response) {
  var upload = multer({ storage : storage}).any();
  upload(request, response, function(err) {
    //console.log(request.files[0].path);
    var interface = readline.createInterface({
      input: fs.createReadStream(request.files[0].path)
    });
    interface.on('line', function (line) {
      client.sadd("students", line, function(err) {
        console.log("added student: " + line);
      })
    }); 
    fs.unlinkSync(request.files[0].path);
    response.end();
  });
});

router.post('/uploadLectureVideos', function(request, response) {
  var upload = multer({ storage : storage}).any();
  //console.log(response.status(200).send(request.file));
  console.log("uploading...");
  var path_videos = path.join(__dirname, "../../videos");
  var path_splitRunner = path.join(__dirname, "../../utility_scripts/splitRunner.js");
  var path_taskInitializer = path.join(__dirname, "../../utility_scripts/taskInitializer.js");
  upload(request, response, function(err) {
    files = fs.readdirSync(path_videos);
    files.forEach(function(file) {
      console.log("filename: ", file);
      path_file = path.join(path_videos, file);
      path_file_no_ext = path.join(path_videos, (file.split(/(?:.mp4)/))[0]);
      exec("ffmpeg -i " + path_file + " -codec:v libx264 -profile:v high -preset slow -b:v 500k -maxrate 500k -bufsize 1000k -threads 0 " + path_file_no_ext + ".mp4", function(err, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);
        if (err !== null) {
          console.log('exec ffmpeg mp4 error: ' + err);
        }
      });
      exec("ffmpeg -i " + path_file + " -f wav -ar 22050 " + path_file_no_ext + ".wav", function(err, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);
        if (err !== null) {
          console.log('exec ffmpeg wav error: ' + err);
        }
      });
      exec("node " + path_splitRunner + " " + path_videos, function(err, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);
        if (err !== null) {
          console.log('exec splitRunner error: ' + err);
        }
      });
      /**exec("node " + path_taskInitializer + " " + path_videos + " " + file, function(err, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);
        if (err !== null) {
          console.log('exec taskInitializer error: ' + err);
        }
      });**/
    });
  });
  console.log("done");
  response.end();
});

module.exports = router;