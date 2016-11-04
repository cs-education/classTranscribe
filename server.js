var http = require('http');
var express = require('express');
var Mustache = require('mustache');
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var mime = require('mime');
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');
var bodyParser = require('body-parser');
var Promise = require('bluebird');

var webvtt = require('./modules/webvtt');
var client = Promise.promisifyAll(require('./modules/redis'));
var mailer = require('./modules/mailer');
var validator = require('./modules/validator');

var app = express();

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static('public'));

client.on("monitor", function (time, args, raw_reply) {
    console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
});

var mustachePath = 'templates/';

var exampleTerms = {
  "cs241": "printf",
  "cs225": "pointer",
  "cs225-sp16": "pointer",
  "chem233-sp16": 'spectroscopy',
  "adv582": "focus group",
  "ece210": "Energy Signals",
  "cs446-fa16": "Decision Trees"
}


var homeMustache = fs.readFileSync(mustachePath + 'home.mustache').toString();
app.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  var html = Mustache.render(homeMustache);
  response.end(html);
});

var viewerMustache = fs.readFileSync(mustachePath + 'viewer.mustache').toString();
app.get('/viewer/:className', function (request, response) {
  var className = request.params.className.toLowerCase();

  response.writeHead(200, {
    'Content-Type': 'text/html',
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "POST, GET, PUT, DELETE, OPTIONS"
  });

  var view = {
    className: className,
  };
  var html = Mustache.render(viewerMustache, view);
  response.end(html);
});

var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
app.get('/:className', function (request, response) {
  var className = request.params.className.toLowerCase();

  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  var view = {
    className: className,
    exampleTerm: exampleTerms[className]
  };
  var html = Mustache.render(searchMustache, view);
  response.end(html);
});

var progressDashboardMustache = fs.readFileSync(mustachePath + 'progressDashboard.mustache').toString();
app.get('/viewProgress/:className/:uuid', function (request, response) {
  var className = request.params.className;
  var uuid = request.params.uuid;

  var isMemberArgs = ['ClassTranscribe::AllowedUploaders', uuid]
  client.sismember(isMemberArgs, function (err, result) {
    if (result) {
      progressDict = {}
      client.smembers("ClassTranscribe::First::" + className, function (err, firstMembers) {
        if (err) {
          console.log(err);
        }

        client.smembers("ClassTranscribe::Finished::" + className, function (err, finishedMembers) {
          if (err) {
            console.log(err);
          }

          firstMembers.forEach(function (member) {
            var netID = member.split("-")[1].replace(".json", "").replace(".txt", "");
            if (progressDict.hasOwnProperty(netID)) {
              progressDict[netID] = progressDict[netID] + 1;
            } else {
              progressDict[netID] = 1;
            }
          });

          finishedMembers.forEach(function (member) {
            var netID = member.split("-")[1].replace(".json", "").replace(".txt", "");
            if (progressDict.hasOwnProperty(netID)) {
              progressDict[netID] = progressDict[netID] + 1;
            } else {
              progressDict[netID] = 1;
            }
          });

          var studentProgress = []
          for (netID in progressDict) {
            if (progressDict.hasOwnProperty(netID) && netID !== 'omelvin2') {
              studentProgress.push({'netID': netID, 'count': progressDict[netID]});
            }
          }

          response.writeHead(200, {
            'Content-Type': 'text/html'
          });

          var view = {
            className: className,
            studentProgress: studentProgress
          };
          var html = Mustache.render(progressDashboardMustache, view);
          response.end(html);
        });
      });
    }
  })
});

app.post('/download', function(request, response) {
  var transcriptions = JSON.parse(request.body.transcriptions);
  var fileNumber = Math.round(Math.random() * 10000)
  fs.writeFileSync("public/Downloads/" + fileNumber + ".webvtt", webvtt(transcriptions));
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify({fileNumber: fileNumber}));
});

app.get('/download/webvtt/:fileNumber', function (request, reponse) {
  var file = "public/Downloads/" + request.params.fileNumber + ".webvtt";

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  reponse.setHeader('Content-disposition', 'attachment; filename=' + filename);
  reponse.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(reponse);
});

var firstPassMustache = fs.readFileSync(mustachePath + 'index.mustache').toString();
app.get('/first/:className/:id', function (request, response) {
  var className = request.params.className.toUpperCase();
  response.writeHead(200, {
    'Content-Type': 'text/html',
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "POST, GET, PUT, DELETE, OPTIONS"
  });

  var view = {
    className: className,
    taskName: request.query.task,
  };
  var html = Mustache.render(firstPassMustache, view);
  response.end(html);
});

app.get('/Video/:fileName', function (request, response) {
  var file = path.resolve(__dirname + "/Video/", request.params.fileName + ".mp4");
  var range = request.headers.range;
  var positions = range.replace(/bytes=/, "").split("-");
  var start = parseInt(positions[0], 10);

  fs.stat(file, function(err, stats) {
    var total = stats.size;
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    var chunksize = (end - start) + 1;

    response.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    });

    var stream = fs.createReadStream(file, { start: start, end: end })
      .on("open", function() {
        stream.pipe(response);
      }).on("error", function(err) {
        response.end(err);
      });
  });
})

app.post('/first', function (request, response) {
  var stats = JSON.parse(request.body.stats);
  var transcriptions = request.body.transcriptions;//
  var className = request.body.className.toUpperCase();//
  var statsFileName = stats.video.replace(/\ /g,"_") + "-" + stats.name + ".json";
  var captionFileName = stats.video.replace(/\ /g,"_") + "-" + stats.name + ".txt";
  var taskName = stats.video.replace(/\ /g,"_");
  mkdirp("captions/first/" + className, function (err) {
    if (err) {
      console.log(err);
    }
    transcriptionPath = "captions/first/" + className + "/" + captionFileName;
    client.sadd("ClassTranscribe::Transcriptions::" + transcriptionPath, transcriptions);
    fs.writeFileSync(transcriptionPath, transcriptions, {mode: 0777});
  });

  mkdirp("stats/first/" + className, function (err) {
    if (err) {
      console.log(err);
    }
    statsPath = "stats/first/" + className + "/" + statsFileName;
    client.sadd("ClassTranscribe::Stats::" + statsPath, request.body.stats);
    fs.writeFileSync(statsPath, request.body.stats, {mode: 0777});


    var isTranscriptionValid = validator.validateTranscription("stats/first/" + className + "/" + statsFileName)

    if (isTranscriptionValid) {
      console.log("Transcription is good!");
      client.zincrby("ClassTranscribe::Submitted::" + className, 1, taskName);
      client.zscore("ClassTranscribe::Submitted::" + className, taskName, function(err, score) {
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
        sendProgressEmail(className, stats.name);
      });
    } else {
      console.log("Transcription is bad!");
      client.lpush("ClassTranscribe::Failed::" + className, captionFileName);
      return;
    }
  });
});

var secondPassMustache = fs.readFileSync(mustachePath + 'editor.mustache').toString();
app.get('/second/:className/:id', function (request, response) {
  var className = request.params.className.toUpperCase();
  response.writeHead(200, {
    'Content-Type': 'text/html',
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "POST, GET, PUT, DELETE, OPTIONS"
  });

  var view = {
    className: className,
    taskName: request.query.task,
  };
  var html = Mustache.render(secondPassMustache, view);
  response.end(html);
});

var queueMustache = fs.readFileSync(mustachePath + 'queue.mustache').toString();
app.get('/queue/:className', function (request, response) {
  var className = request.params.className.toUpperCase();

  var view = {
    className: className
  };

  var html = Mustache.render(queueMustache, view);
  response.end(html);
});

/**
 * client.moveQueue 
 */
app.get('/queue/:className/:netId', function (request, response) {
  var className = request.params.className.toUpperCase();
  var netId = request.params.netId.toLowerCase();

  var updateQueue = Promise.promisify(updatePriorirityQueue);

  updateQueue(className, netId).then(function (data) {
    var taskArgs = ["ClassTranscribe::Tasks::" + className, "0", "99999", "WITHSCORES", "LIMIT", "0", "20"];
    var priorityTaskArgs = ["ClassTranscribe::PrioritizedTasks::" + className, "0", "99999",
        "WITHSCORES", "LIMIT", "0", "20"];
    
    return Promise.all([client.zrangebyscoreAsync(taskArgs), client.zrangebyscoreAsync(priorityTaskArgs)]);
  }).spread(function (coverageResults, priorityResults) {
    if (!coverageResults.length && !priorityResults.length) {
      response.end("No more tasks at the moment. Please email classtranscribe@gmail.com.");
    } else {
      var taskScore = coverageResults[1]; // WITHSCORES returns an array alternating between item and score
      if (taskScore <= 2) {
        //coverage not yet achieved
        return selectTaskNotCompletedByUser(className, netId, coverageResults);
      } else {
        return selectTaskNotCompletedByUser(className, netId, priorityResults);
      }
    }
  }).then(function (taskName) {
    response.end(taskName);
  })
});

function selectTaskNotCompletedByUser(className, netId, possibleTasks) {
  for (var i = 0; i < possibleTasks.length; i += 2) {
     
  }
}

function updatePriorirityQueue(className, netId, cb) {
  var numTasksToPrioritize = 5;
  // Can't call zcard if doesn't exist. Unable to be directly handled by err in zcard call
  // due to how the redis client works
  client.existsAsync("ClassTranscribe::PrioritizedTasks::" + className).then(function (code) {
    if (code === 0) {
      return 0;
    } else {
      return client.zcardAsync("ClassTranscribe::PrioritizedTasks::" + className);
    }
  }).then(function (numTasksCurrentlyPrioritized) {
    if (numTasksCurrentlyPrioritized < numTasksToPrioritize) {
      var numDifference = numTasksToPrioritize - numTasksCurrentlyPrioritized;
      var args = ["ClassTranscribe::Tasks::" + className, "0", "99999",
        "WITHSCORES", "LIMIT", "0", numDifference];
      return client.zrangebyscoreAsync(args);
    }
  }).then(function (tasks) {
    for (var i = 0; i < tasks.length; i += 2) {
      var taskName = tasks[i];
      var score = parseInt(tasks[i + 1], 10);
      if (score > 2) {
        client.zrem("ClassTranscribe::Tasks::" + className, taskName);
        client.zadd("ClassTranscribe::PrioritizedTasks::" + className, score, taskName);
      }
    }

    cb(null, 'hi');
  });
}

// function updatePriorirityQueueAsync(className, netId) {
//   return new Promise(function(resolve, reject){
// 		updatePriorirityQueue(function(error, data){
// 			if (err) {
// 				reject(err);
// 			} else {
// 				resolve(data)
// 			}
// 		});
// 	});
// }

function queueResponse(response, queueName, netId, className, chosenTask, attemptNum) {
  console.log(chosenTask);

  if (attemptNum === 10) {
    response.end('It looks like you have already completed the available tasks.\n' +
      'If you believe this is incorrect please contact classtranscribe@gmail.com')
    return;
  }

  var incrArgs = ["ClassTranscribe::" + queueName + "::" + className, "1", chosenTask];
  client.zincrby(incrArgs);

  var netIDTaskTuple = netId + ":" + chosenTask;
  console.log('tuple ' + netIDTaskTuple);
  var date = new Date();
  var dateString = date.getTime();
  var hsetArgs = ["ClassTranscribe::ActiveTranscribers::" + className, netIDTaskTuple, dateString];
  client.hset(hsetArgs);

  var fileName = chosenTask + "-" + netId + ".txt";
  var isMemberArgs = ["ClassTranscribe::First::" + className, fileName]
  client.sismember(isMemberArgs, function (err, result) {
    if (result) {
      highDensityQueue(response, className, netId, attemptNum + 1);
    } else {
      // If not in First it may be in Finished
      isMemberArgs = ["ClassTranscribe::Finished::" + className, fileName]
      client.sismember(isMemberArgs, function (err, result) {
          if (result) {
            highDensityQueue(response, className, netId, attemptNum + 1);
          } else {
            response.end(chosenTask);
          }
      });
    }
  });
}

function clearInactiveTranscriptions() {
  var classesToClear = ["CS241-SP16", "CHEM233-SP16", "CS225-SP16"];
  var curDate = new Date();

  classesToClear.forEach(function (className) {
    client.hgetall("ClassTranscribe::ActiveTranscribers::" + className, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }

      if (result !== null) {
        for(var i = 0; i < result.length; i += 2) {
          var netIDTaskTuple = result[i].split(":");
          var netId = netIDTaskTuple[0];
          var taskName = netIDTaskTuple[1];
          var startDate = new Date(result[i + 1]);

          var timeDiff = Math.abs(curDate.getTime() - startDate.getTime());
          var diffHours = Math.ceil(timeDiff / (1000 * 3600));

          if (diffHours >= 2) {
            client.hdel("ClassTranscribe::ActiveTranscribers::" + className, result[i]);
            // dont' know which queue task is currently in
            var taskArgs = ["ClassTranscribe::Tasks::" + className, taskName];
            client.zscore(taskArgs, function (err, result) {
              if (err) {
                throw err;
              } else if (result !== null) {
                client.zincrby("ClassTranscribe::Tasks::" + className, -1, taskName);
              }
            })

            var priorityArgs = ["ClassTranscribe::PrioritizedTasks::" + className, taskName];
            client.zscore(priorityArgs, function (err, result) {
              if (err) {
                throw err;
              } else if (result !== null) {
                client.zincrby("ClassTranscribe::Tasks::" + className, -1, taskName);
              }
            })
          }
        }
      }
    })
  });

}

var captionsMapping = {
  "cs241": require('./public/javascripts/data/captions/cs241.js'),
  "cs225": require('./public/javascripts/data/captions/cs225.js'),
  "cs225-sp16": require('./public/javascripts/data/captions/cs225-sp16.js'),
  "chem233-sp16": require('./public/javascripts/data/captions/chem233-sp16.js'),
  "adv582": require('./public/javascripts/data/captions/adv582.js'),
  "ece210": require('./public/javascripts/data/captions/ece210.js'),
  "cs446-fa16": require('./public/javascripts/data/captions/cs446-fa16.js'),
}

app.get('/captions/:className/:index', function (request, response) {
  var className = request.params.className.toLowerCase();
  var captions = captionsMapping[className];

  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  var index = parseInt(request.params.index);
  response.end(JSON.stringify({captions: captions[index]}));
});

var progressMustache = fs.readFileSync(mustachePath + 'progress.mustache').toString();
app.get('/progress/:className', function (request, response) {
  var className = request.params.className.toUpperCase();

  var view = {
    className: className,
  };
  var html = Mustache.render(progressMustache, view);

  response.end(html);
});

app.post('/progress/:className/:netId', function (request, response) {
  var className = request.params.className.toUpperCase();
  var netId = request.params.netId;
  sendProgressEmail(className, netId, function () {
    response.end('success');
  });
});

function sendProgressEmail(className, netId, callback) {
  client.smembers("ClassTranscribe::First::" + className, function (err, firstMembers) {
    if (err) {
      console.log(err);
    }

    client.smembers("ClassTranscribe::Finished::" + className, function (err, finishedMembers) {
    if (err) {
      console.log(err);
    }

      var count = 0;
      firstMembers.forEach(function (member) {
        var user = member.split("-")[1].replace(".json", "").replace(".txt", "");
        if (user === netId) {
          count++;
        }
      });

      finishedMembers.forEach(function (member) {
        var user = member.split("-")[1].replace(".json", "").replace(".txt", "");
        if (user === netId) {
          count++;
        }
      });

      mailer.progressEmail(netId, className, count);
      if (callback) {
        callback();
      }
    });
  });
}

var thirtyMinsInMilliSecs = 30 * 60 * 1000;
//setInterval(clearInactiveTranscriptions, thirtyMinsInMilliSecs);

client.on("monitor", function (time, args, raw_reply) {
    console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
});

client.on('error', function (error) {
	console.log('redis error');
});

var port = 80;
app.listen(port, function () {
  console.log('listening on port ' + port + '!');
});