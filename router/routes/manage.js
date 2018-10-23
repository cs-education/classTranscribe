/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fs = require('fs');
var readline = require('readline');
var sys = require('sys');
var exec = require('child_process').exec;
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './videos');
  },
  filename: function(req, file, callback) {
    var split = file.originalname.split(/(?:.mp4|.avi|.flv|.wmv|.mov|.wav|.ogv|.mpg|.m4v)/);
    callback(null, file.originalname);
  }
});

var client_api = require('./db');
// var api = require('./api');
// var client_api = new api();
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
/**var storage = multer({
  dest: path.join(__dirname, '../../videos'),
  rename: function(fieldname, filename) {
    var split = filename.split(/(?:.mp4|.avi|.flv|.wmv|.mov|.wav|.ogv|.mpg|.m4v)/);
    if(split.length != 2) {
      return "bad_file";
    }
    return split[0] + ".mp4";
  }
});**/

var manageCoursePage = fs.readFileSync(mustachePath + 'manageCourse.mustache').toString();
router.get('/manage/:className', function (request, response) {
  if (request.isAuthenticated()) {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    renderWithPartial(manageCoursePage, request, response, request.params);
  } else {
    response.redirect('../');
  }
});

var upload = multer({ dest: 'manage/' })

/* similar to /uploadLectureVideos,  used for single upload*/
router.post('/manage/:className', upload.single('filename'), function(request, response) {
  var className = request._parsedOriginalUrl.pathname.split("/")[2];
  var upload = multer({ storage : storage}).any();
  var path_videos = path.join(__dirname, "../../videos");
  var path_class = path.join(__dirname, "../../videos/"+className);

  var path_splitRunner = path.join(__dirname, "../../utility_scripts/splitRunner.js");
  var path_taskInitializer = path.join(__dirname, "../../utility_scripts/taskInitializer.js");
  var path_splitted = path.join(__dirname, "../../videos/splitted");

  upload(request, response, function(err) {
    var filename = request.file.filename;
    var directory = request.file.destination;
    var filepath = request.file.path;

    var original_path_file = path.join(path_videos, filename);
    var path_file = path.join(path_class, filename);
    /* add .txt file for test purpose*/
    var file_no_ext = (filename.split(/(?:.mp4|.avi|.flv|.wmv|.mov|.wav|.ogv|.mpg|.m4v|.txt)/))[0];
    var path_file_no_ext = path.join(path_class, file_no_ext);

    fs.renameSync(original_path_file, path_file);

    /* next two execs are for converting the video to the proper format */
    exec("ffmpeg -i " + path_file + " -codec:v libx264 -strict -2 -profile:v high -preset slow -b:v 500k -maxrate 500k -bufsize 1000k -threads 0 " + path_file_no_ext + ".mp4", function(err, stdout, stderr) {
      if (err !== null) {
        console.log("%s exec ffmpeg mp4 error: ", filename, err);
      }
      exec("ffmpeg -i " + path_file + " -f wav -ar 22050 " + path_file_no_ext + ".wav", function(err, stdout, stderr) {
        if (err !== null) {
          console.log("%s exec ffmpeg wav error: ", filename, err);
        }
        /* node utility_scripts/splitRunner.js <path_to_directory_with_videos> <class_name> */
        /* splits the videos */
        exec("node " + path_splitRunner + " " + path_class + " " + className, function(err, stdout, stderr) {
          if (err !== null) {
            console.log("%s exec splitRunner error: ", filename, err);
          }
          /* node utility_scripts/taskInitializer.js <path_to_directory_with_videos> <class_name> */
          /* adds the videos to the queue to be transcribed */
          exec("node " + path_taskInitializer + " " + path_class + " " + className, function(err, stdout, stderr) {
            if (err !== null) {
              console.log("%s exec taskInitializer error: ", filename, err);
            }
            fs.renameSync(path_file, path.join(path_splitted, filename));
          });
        });
      });
    });
  });

  response.end();
});


router.get('/getUserCourses', function (request, response) {
  client_api.getCourses(function(err,results) {
   // client.smembers("ClassTranscribe::CourseList", function(err, results) {
   	 if(err) console.log(err);
   	 console.log(results);
     response.send(results);
   });
});


/* add the instructors to the database */
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
   client_api.addInstructors(toadd, function(err, res) {
   // client.sadd("instructors", toadd, function(err, res) {
      if(err) console.log(err);
   		console.log("added instructors");
   });
   response.send(instructors);
});


/* add the students to the database */
router.post('/addStudents', function (request, response) {
   var data = request.body.students;
   var students = data.split(/[\s,;:\n]+/);
   client_api.addStudents(students, function(err, res) {
   // client.sadd("students", students, function(err, res) {
   		console.log("added students");
   });
   response.send(students);
});


/* upload the file of students, then add students to database */
//var upload = multer({ storage : storage}).single('studentsFile');
router.post('/UploadStudentsFiles', function (request, response) {
  var upload = multer({ storage : storage}).any();
  upload(request, response, function(err) {
    //console.log(request.files[0].path);
    var interface = readline.createInterface({
      input: fs.createReadStream(request.files[0].path)
    });
    interface.on('line', function (line) {
      client_api.addStudents(line, function(err) {
      // client.sadd("students", line, function(err) {
        console.log("added student: " + line);
      })
    });
    /* delete the file after adding to database */
    fs.unlinkSync(request.files[0].path);
    response.end();
  });
});


/* upload the lecture video and segment it into 4-6 minute chunks */
router.post('/uploadLectureVideos', function(request, response) {
  //var className = request.body.className.toUpperCase();
  var className = "CLASSNAME";
  var upload = multer({ storage : storage}).any();
  var path_videos = path.join(__dirname, "../../videos");
  var path_class = path.join(__dirname, "../../videos/"+className);

  var path_splitRunner = path.join(__dirname, "../../utility_scripts/splitRunner.js");
  var path_taskInitializer = path.join(__dirname, "../../utility_scripts/taskInitializer.js");
  var path_splitted = path.join(__dirname, "../../videos/splitted");

  upload(request, response, function(err) {
    var filename = request.files[0].filename;
    var directory = request.files[0].destination;
    var filepath = request.files[0].path;

    console.log("actual filename: ", filename);

    var original_path_file = path.join(path_videos, filename);
    var path_file = path.join(path_class, filename);
    var file_no_ext = (filename.split(/(?:.mp4|.avi|.flv|.wmv|.mov|.wav|.ogv|.mpg|.m4v)/))[0];
    var path_file_no_ext = path.join(path_class, file_no_ext);
    console.log("oringal_path_file: ", original_path_file);
    console.log("path_file: ", path_file);
    console.log("path_file_no_ext", path_file_no_ext);

    console.log("About to execute ffmpeg mp4: ", filename);

    fs.renameSync(original_path_file, path_file);

    /* next two execs are for converting the video to the proper format */
    exec("ffmpeg -i " + path_file + " -codec:v libx264 -strict -2 -profile:v high -preset slow -b:v 500k -maxrate 500k -bufsize 1000k -threads 0 " + path_file_no_ext + ".mp4", function(err, stdout, stderr) {
      console.log("Inside ffmpeg mp4: ", filename);
      console.log("%s stdout: ", filename, stdout);
      console.log("%s stderr: ", filename, stderr);
      if (err !== null) {
        console.log("%s exec ffmpeg mp4 error: ", filename, err);
      }
      console.log("About to execute ffmpeg wav: ", filename);
      exec("ffmpeg -i " + path_file + " -f wav -ar 22050 " + path_file_no_ext + ".wav", function(err, stdout, stderr) {
        console.log("Inside ffmpeg wav: ", filename)
        console.log("%s stdout: ", filename, stdout);
        console.log("%s stderr: ", filename, stderr);
        if (err !== null) {
          console.log("%s exec ffmpeg wav error: ", filename, err);
        }
        console.log("About to execute splitRunner: ", filename);
        /* node utility_scripts/splitRunner.js <path_to_directory_with_videos> <class_name> */
        /* splits the videos */
        exec("node " + path_splitRunner + " " + path_class + " " + className, function(err, stdout, stderr) {
          console.log("Inside splitRunner: ", filename)
          console.log("%s stdout: ", filename, stdout);
          console.log("%s stderr: ", filename, stderr);
          if (err !== null) {
            console.log("%s exec splitRunner error: ", filename, err);
          }
          console.log("About to execute taskInitializer: ", filename);
          /* node utility_scripts/taskInitializer.js <path_to_directory_with_videos> <class_name> */
          /* adds the videos to the queue to be transcribed */
          exec("node " + path_taskInitializer + " " + path_class + " " + className, function(err, stdout, stderr) {
            console.log("Inside taskInitializer: ", filename);
            console.log("%s stdout: ", filename, stdout);
            console.log("%s stderr: ", filename, stderr);
            if (err !== null) {
              console.log("%s exec taskInitializer error: ", filename, err);
            }
            console.log("Finished taskInitializer: ", filename);
            fs.renameSync(path_file, path.join(path_splitted, filename));
          });
        });
      });
    });

    /**files = fs.readdirSync(path_videos);
    files.forEach(function(file) {
      path_file = path.join(path_videos, filename);
      path_file_no_ext = path.join(path_videos, (file.split(/(?:.mp4|.avi|.flv|.wmv|.mov|.wav|.ogv|.mpg|.m4v)/))[0]);
      console.log("filename: ", file);
      console.log("path_file: ", path_file);
      try {
        var isDir = fs.lstatSync(path_file).isDirectory();
        if(!isDir) {
          console.log("About to execute ffmpeg mp4: ", file);
          // next two execs are for converting the video to the proper format
          exec("ffmpeg -i " + path_file + " -codec:v libx264 -strict -2 -profile:v high -preset slow -b:v 500k -maxrate 500k -bufsize 1000k -threads 0 " + path_file_no_ext + ".mp4", function(err, stdout, stderr) {
            console.log("Inside ffmpeg mp4: ", file)
            console.log("%s stdout: ", file, stdout);
            console.log("%s stderr: ", file, stderr);
            if (err !== null) {
              console.log("%s exec ffmpeg mp4 error: ", file, err);
            }
            console.log("About to execute ffmpeg wav: ", file);
            exec("ffmpeg -i " + path_file + " -f wav -ar 22050 " + path_file_no_ext + ".wav", function(err, stdout, stderr) {
              console.log("Inside ffmpeg wav: ", file)
              console.log("%s stdout: ", file, stdout);
              console.log("%s stderr: ", file, stderr);
              if (err !== null) {
                console.log("%s exec ffmpeg wav error: ", file, err);
              }
              console.log("About to execute splitRunner: ", file)
              // node utility_scripts/splitRunner.js <path_to_directory_with_videos> <class_name>
              // splits the videos
              exec("node " + path_splitRunner + " " + path_videos + " " + className, function(err, stdout, stderr) {
                console.log("Inside splitRunner: ", file)
                console.log("%s stdout: ", file, stdout);
                console.log("%s stderr: ", file, stderr);
                if (err !== null) {
                  console.log("%s exec splitRunner error: ", file, err);
                }
                console.log("About to execute taskInitializer: ", file);
                // node utility_scripts/taskInitializer.js <path_to_directory_with_videos> <class_name>
                // adds the videos to the queue to be transcribed
                exec("node " + path_taskInitializer + " " + path_videos + " " + className, function(err, stdout, stderr) {
                  console.log("Inside taskInitializer: ", file);
                  console.log("%s stdout: ", file, stdout);
                  console.log("%s stderr: ", file, stderr);
                  if (err !== null) {
                    console.log("%s exec taskInitializer error: ", file, err);
                  }
                  console.log("Finished taskInitializer: ", file);
                  fs.rename(path_file, path.join(path_splitted, file));
                });
              });
            });
          });
        }
        else {
          console.log(file + " is a directory");
        }
      }
      catch(err) {
        console.log(err);
      }
    });**/
  });
  response.end();
});


module.exports = router;
