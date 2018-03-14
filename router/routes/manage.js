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
  destination: function (req, file, callback) {
    callback(null, './videos');
  },
  filename: function (req, file, callback) {
    var split = file.originalname.split(/(?:.mp4|.avi|.flv|.wmv|.mov|.wav|.ogv|.mpg|.m4v)/);
    callback(null, file.originalname);
  }
});

const nodemailer = require('nodemailer');

const mailID = process.env.EMAIL_ID;
if (!mailID) throw "Need a gmail address in environmental variables!";
const mailSender = 'ClassTranscribe Team <' + mailID + '>'

const mailPass = process.env.EMAIL_PASS;
if (!mailPass) throw "Need a password in environmental variables!";


// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: mailID,
    pass: mailPass
  }
});

const { promisify, isNullOrUndefined } = require('util');
const saddAsync = promisify(client.sadd).bind(client);

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
router.get('/manageCourse', function (request, response) {
  if (request.isAuthenticated()) {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    renderWithPartial(manageCoursePage, request, response);
  } else {
    response.redirect('../');
  }
});


router.get('/getUserCourses', function (request, response) {
  client.smembers("ClassTranscribe::CourseList", function (err, results) {
    if (err) console.log(err);
    console.log(results);
    response.send(results);
  });
});


/* add the instructors to the database */
router.post('/addInstructors', function (request, response) {
  var data = request.body.instructors;
  var instructors = data.split(/[\s,;:\n]+/);
  var toadd = [];
  for (instructor in instructors) {
    if (instructor.match(/\^w+@[a-z]+?\.edu$/)) {
      toadd.push(instructor);
    }
  }
  console.log(instructors);
  console.log(toadd);
  client.sadd("instructors", toadd, function (err, res) {
    if (err) console.log(err);
    console.log("added instructors");
  });
  response.send(instructors);
});

/* Get all students in the current course */
router.get('/students/:courseId', (req, res) => {
  query = `ClassTranscribe::Course::${req.params.courseId}::Students`
  console.log(query)
  client.smembers(query, (err, reply) => {
    if (err) {
      res.status(404)
    } else {
      console.log(req.params, reply)
      res.json({ students: reply })
    }
  })
})

/* add the students to the database */
router.put('/students/:courseId', function (request, response) {
  let newSubscriptions = request.body.students;
  let studentEmails = newSubscriptions.split(/[\s,;:\n]+/);
  let courseId = request.params.courseId
  let query = `ClassTranscribe::Course::${courseId}::Students`

  let results = studentEmails.map(studentEmail => {
    return saddAsync(query, studentEmail)
      .then(value => {
        if (value) {  // value != 0, the account already existed
          transporter.sendMail({
            from: mailSender, // ClassTranscribe no-reply email
            to: studentEmail, // receiver who signed up for ClassTranscribe
            subject: 'You\'re just added to a class!', // subject line of the email
            html: `Hi there,\n\nYou're just added to ${courseId}! You can now get access to all recorded lectures.`
          }, (err, status) => {
            if (err) {
              console.log(`Send to ${studentEmail} failed: ${err}`)
            }
          });

          return studentEmail
        } else {
          return null
        }
      }).catch(reason => {
        console.log(`Add ${studentEmail} failed because ${reason}`)
        return null
      });
  });

  Promise.all(results).then(insertionResults => response.json({
    addedStudents: insertionResults.filter(res => !isNullOrUndefined(res))
  }))
});

/* upload the file of students, then add students to database */
//var upload = multer({ storage : storage}).single('studentsFile');
router.post('/UploadStudentsFiles', function (request, response) {
  var upload = multer({ storage: storage }).any();
  upload(request, response, function (err) {
    //console.log(request.files[0].path);
    var interface = readline.createInterface({
      input: fs.createReadStream(request.files[0].path)
    });
    interface.on('line', function (line) {
      client.sadd("students", line, function (err) {
        console.log("added student: " + line);
      })
    });
    /* delete the file after adding to database */
    fs.unlinkSync(request.files[0].path);
    response.end();
  });
});


/* upload the lecture video and segment it into 4-6 minute chunks */
router.post('/uploadLectureVideos', function (request, response) {
  var upload = multer({ storage: storage }).any();
  //console.log(response.status(200).send(request.file));
  //console.log("uploading...");
  var path_videos = path.join(__dirname, "../../videos");
  //console.log('path_videos: ', path_videos);
  var path_splitRunner = path.join(__dirname, "../../utility_scripts/splitRunner.js");
  var path_taskInitializer = path.join(__dirname, "../../utility_scripts/taskInitializer.js");
  console.log('path_videos');
  upload(request, response, function (err) {
    console.log('upload function')
    files = fs.readdirSync(path_videos);
    files.forEach(function (file) {
      console.log("filename: ", file);
      path_file = path.join(path_videos, file);
      path_file_no_ext = path.join(path_videos, (file.split(/(?:.mp4|.avi|.flv|.wmv|.mov|.wav|.ogv|.mpg|.m4v)/))[0]);
      console.log("About to execute ffmpeg mp4: ", file);
      /** next two execs are for converting the video to the proper format **/
      exec("ffmpeg -i " + path_file + " -codec:v libx264 -strict -2 -profile:v high -preset slow -b:v 500k -maxrate 500k -bufsize 1000k -threads 0 " + path_file_no_ext + ".mp4", function (err, stdout, stderr) {
        console.log("Inside ffmpeg mp4: ", file)
        console.log("%s stdout: ", file, stdout);
        console.log("%s stderr: ", file, stderr);
        if (err !== null) {
          console.log("%s exec ffmpeg mp4 error: ", file, err);
        }
        console.log("About to execute ffmpeg wav: ", file);
        exec("ffmpeg -i " + path_file + " -f wav -ar 22050 " + path_file_no_ext + ".wav", function (err, stdout, stderr) {
          console.log("Inside ffmpeg wav: ", file)
          console.log("%s stdout: ", file, stdout);
          console.log("%s stderr: ", file, stderr);
          if (err !== null) {
            console.log("%s exec ffmpeg wav error: ", file, err);
          }
          console.log("About to execute splitRunner: ", file)
          /** node utility_scripts/splitRunner.js <path_to_directory_with_videos> **/
          /** splits the videos **/
          exec("node " + path_splitRunner + " " + path_videos, function (err, stdout, stderr) {
            console.log("Inside splitRunner: ", file)
            console.log("%s stdout: ", file, stdout);
            console.log("%s stderr: ", file, stderr);
            if (err !== null) {
              console.log("%s exec splitRunner error: ", file, err);
            }
            console.log("About to execute taskInitializer: ", file);
            /** node utility_scripts/taskInitializer.js <path_to_directory_with_videos> <class_name> **/
            /** adds the videos to the queue to be transcribed **/
            exec("node " + path_taskInitializer + " " + path_videos + " " + file, function (err, stdout, stderr) {
              console.log("Inside taskInitializer: ", file);
              console.log("%s stdout: ", file, stdout);
              console.log("%s stderr: ", file, stderr);
              if (err !== null) {
                console.log("%s exec taskInitializer error: ", file, err);
              }
              console.log("Finished taskInitializer: ", file);
            });
          });
        });
      });
    });
    console.log("done");
  });
  response.end();
});


module.exports = router;

