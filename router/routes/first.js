/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//var router = express.Router();

//var mustachePath = 'templates/';

var router = express.Router();
var fs = require('fs');
var mkdirp = require('mkdirp');
var validator = require('../../modules/validator.js');
//var client = require('./modules/redis');

var firstPassMustache = fs.readFileSync(mustachePath + 'index.mustache').toString();
router.get('/first/:className/:id', function (request, response) {
  var className = request.params.className.toUpperCase();
  response.writeHead(200, {
    'Content-Type': 'text/html',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
  });

  var view = {
    className: className,
    taskName: request.query.task,
  };
  var html = Mustache.render(firstPassMustache, view);
  response.end(html);
});

/**router.get('/loadVideo/:video_dir/:video', function(request, response) {
  var video_dir = request.params.video_dir;
  var video = request.params.video;
  var video = path.join(__dirname, "../../videos/"+video_dir+'/'+video);
  console.log("video: ", video);

  fs.stat(video, function handle(err, stats) {
    if (err) {
      if (err.code === "ENOENT") {
        response.send("File doesn't exist");
      }
      else {
        response.send("Something unfathomable happened");
      }
    }
    else {
      if(request.headers.range) {
        var range = request.headers.range;
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);

        fs.stat(video, function (err, stats) {
          var total = stats.size;
          var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
          var chunksize = (end - start) + 1;

          response.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
          });

          var stream = fs.createReadStream(video, { start: start, end: end })
            .on("open", function () {
              stream.pipe(response);
            }).on("error", function (err) {
              response.end(err);
            });
        });
      }  
    }
  });
});**/

router.post('/first', function (request, response) {
  var stats = JSON.parse(request.body.stats);
  var transcriptions = request.body.transcriptions;//
  var className = request.body.className.toUpperCase();//
  var statsFileName = stats.video.replace(/\ /g, "_") + "-" + stats.name + ".json";
  var captionFileName = stats.video.replace(/\ /g, "_") + "-" + stats.name + ".txt";
  var taskName = stats.video.replace(/\ /g, "_");
  mkdirp("captions/first/" + className, function (err) {
    if (err) {
      console.log(err);
    }
    transcriptionPath = "captions/first/" + className + "/" + captionFileName;
    client.sadd("ClassTranscribe::Transcriptions::" + transcriptionPath, transcriptions);
    fs.writeFileSync(transcriptionPath, transcriptions, { mode: 0777 });
  });

  mkdirp("stats/first/" + className, function (err) {
    if (err) {
      console.log(err);
    }
    statsPath = "stats/first/" + className + "/" + statsFileName;
    client.sadd("ClassTranscribe::Stats::" + statsPath, request.body.stats);
    fs.writeFileSync(statsPath, request.body.stats, { mode: 0777 });


    var isTranscriptionValid = validator.validateTranscription("stats/first/" + className + "/" + statsFileName);

    if (isTranscriptionValid) {
      console.log("Transcription is good!");
      client.zincrby("ClassTranscribe::Submitted::" + className, 1, taskName);
      client.zscore("ClassTranscribe::Submitted::" + className, taskName, function (err, score) {
        score = parseInt(score, 10);
        if (err) {
          return err;
        }

        if (score === 10) {
          client.zrem("ClassTranscribe::Submitted::" + className, taskName);
          client.zrem("ClassTranscribe::PrioritizedTasks::" + className, taskName);
        }

        client.sadd("ClassTranscribe::First::" + className, captionFileName);
        var netIDTaskTuple = stats.name + ":" + taskName;
        console.log('tuple delete: ' + netIDTaskTuple);
        client.hdel("ClassTranscribe::ActiveTranscribers::" + className, netIDTaskTuple);
        //sendProgressEmail(className, stats.name);
        return;
      });
    } else {
      console.log("Transcription is bad!");
      client.lpush("ClassTranscribe::Failed::" + className, captionFileName);
      return;
    }
    response.send("success!");
  });
});

module.exports = router;
