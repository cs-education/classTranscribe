/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const db = require('../../db/db');

const searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
const invalidClassHTML = "<p>Could not find the requested page.<\p> <a href=\"/\">Click here to return to the home page.</a>";

router.get('/search/:courseId/:offeringId', function (request, response) {
    var offeringId = request.params.offeringId;
    var courseId = request.params.courseId;

    db.getCourseByOfferingId(offeringId).then(values => {
      var course = values.filter(value.courseId === courseId);
      if (!values || !course) {
        console.log('Not Valid Course');
        response.end(invalidClassHTML);
        return;
      }

      db.getDept(course[0].deptId).then(value => {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });

        var className = value.acronym + ' ' + course[0].courseNumber;
        renderWithPartial(searchMustache, request, response, {className : className});
      }).catch(err => console.log(err)); /* db.getDept() */
    }).catch(err => console.log(err)); /* db.getCourseByOfferingId() */
    response.end(invalidClassHTML);
  });



/* Gets all the videos for a class and puts in an array with the path */
router.get('/getVideos', function(request, response) {
  var className = request.query.className.toUpperCase();
  console.log("getting list of videos: " + className);
  var path_videos = path.join(__dirname, "../../videos/" + className);
  var videos = [[]];
  try {
    fs.readdirSync(path_videos).forEach(function(dir) {
      /* filters hidden directories/files */
      if(! /^\..*/.test(dir)) {
        fs.readdirSync(path_videos + "/" + dir).forEach(function(file) {
          if(! /^\..*/.test(file) && !/.mp3/.test(file) && !/.wav/.test(file)) {
            lecture_video = file.replace(".mp4", "");
            path_video = "../../videos/" + className + "/" + dir + "/" + file
            videos.push([lecture_video, path_video]);
          }
        });
      }
    });
  }
  catch(err) {
    console.log('no such class video directory: ' + className);
    console.log(err);
    response.end();
  }
  response.send(videos);
});



/* Gets all the captions for a class */
router.get('/getCaptions', function(request, response) {
  var className = request.query.className.toUpperCase();
  console.log("getting captions: " + className);
  var path_videos = path.join(__dirname, "../../videos/" + className);
  var promises = [];

  try {
    fs.readdirSync(path_videos).forEach(function(dir) {
      /* filters hidden directories/files */
      if(! /^\..*/.test(dir)) {
        fs.readdirSync(path_videos + "/" + dir).forEach(function(file) {
          if(! /^\..*/.test(file) && !/.mp3/.test(file) && !/.wav/.test(file)) {
            promises.push(new Promise(function(resolve, reject) {
              db.getCaptions(className, function(err, results) {
              // client.smembers("ClassTranscribe::Transcriptions::" + className + "::" + file.replace(".mp4", ""), function(err, results) {
                if(err) {
                  reject(err);
                }
                resolve(results);
              })
            }));
          }
        });
      }
    });
  }
  catch(err) {
    console.log('no such class video directory: ' + className);
    console.log(err);
    response.end();
  }

  // If there is even an error in any of the promises, it will only execute the catch part //
  Promise.all(promises).then(function(results) {
    var captions = [[]];
    // filter out empty arrays //
    results.forEach(function(result) {
      if(result.length > 0 ) {
        captions.push(JSON.parse(result[0]))
      }
      else {
        captions.push([]);
      }
    })
    response.send(captions);
  }).catch(function(err) {
    console.log(err);
  });
});

module.exports = router;
