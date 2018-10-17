/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
// var client = require('./../../modules/redis');

var client_api = require('./db');
// var api = require('./api');
// var client_api = new api();

// router.get('/:className',
//   ensureAuthenticated,
router.get('/class/:className',
  function (request, response) {
    var className = request.params.className.toLowerCase();
    console.log(className);
    client_api.getCourses(function(err, results) {
    // client.smembers("ClassTranscribe::CourseList", function(err, results) {
      var invalid = true;
      if (results.indexOf("ClassTranscribe::Course::" + className.toUpperCase()) >= 0) {
        invalid = false;
      }

      if (!isClassNameValid(className) && invalid || err) {
        console.log("not valid course: ", err);
        response.end(invalidClassHTML);
        return;
      }
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });

      var view = {
        className: className,
        //exampleTerm: exampleTerms[className]
      };

      renderWithPartial(searchMustache, request, response, view);
    });
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
              client_api.getCaptions(className, function(err, results) {
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
