var http = require('http');
var express = require('express');
var Mustache = require('mustache');
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var mime = require('mime');
var webvtt = require('./modules/webvtt');
var client = require('./modules/redis');
var mailer = require('./modules/mailer');
var validator = require('./modules/validator');
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var saml = require('passport-saml');
var dotenv = require('dotenv');

dotenv.load();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var CALLBACK_URL = "https://classtranscribe.herokuapp.com/login/callback";
var ENTRY_POINT = "https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO";
var ISSUER = 'ClassTranscribe';
var LOGOUT_URL = "https://www.testshib.org/Shibboleth.sso/Logout";

var samlStrategy = new saml.Strategy({
  // URL that goes from the Identity Provider -> Service Provider
  callbackUrl: CALLBACK_URL,
  // URL that goes from the Service Provider -> Identity Provider
  entryPoint: ENTRY_POINT,
  // Usually specified as `/shibboleth` from site root
  issuer: ISSUER,
  logoutUrl: LOGOUT_URL,
  identifierFormat: null,
  // Service Provider private key
  decryptionPvk: process.env.KEY,
  // Service Provider Certificate
  privateCert: process.env.KEY,
  // Identity Provider's public key
  cert: fs.readFileSync(__dirname + '/cert/idp_cert.pem', 'utf8'),
  validateInResponseTo: false,
  disableRequestedAuthnContext: true,
  forceAuthn: true
}, function (profile, done) {

  /*user.saml = {};
  user.saml.nameID = profile.nameID;
  user.saml.nameIDFormat = profile.nameIDFormat;*/
  return done(null, profile);
});

passport.use(samlStrategy);

var app = express();

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: "secret" }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

// view/:classname, /:classname, /

/*

TODO: Redirect to correct url as such...
  Likely have to parse req somehow

  https://classtranscribe.herokuapp.com/viewer/cs446-fa16?videoIndex=3

  localhost:8000/viewer/cs446-fa16?videoIndex=3

  TODO: What else will we need to protect?

*/

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    samlStrategy['Redirect'] = req['_parsedOriginalUrl']['path'];
    //console.log(req['_parsedOriginalUrl']['path']);
    return res.redirect('/login');
  }
}

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


var authenticatedPartial = fs.readFileSync(mustachePath + 'authenticated.mustache').toString();
var notAuthenticatedPartial = fs.readFileSync(mustachePath + 'notAuthenticated.html').toString();

function renderWithPartial(mustacheFile, request, response) {
  var html;
  if (request.isAuthenticated()) {
    html = Mustache.render(mustacheFile, {
      list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
    }, {
        partial: authenticatedPartial
      })
  }
  else {
    html = Mustache.render(mustacheFile,
      {
        list: [{ user: null }]
      }, {
        partial: notAuthenticatedPartial
      })
  }
  response.end(html);
}


var homeMustache = fs.readFileSync(mustachePath + 'home.mustache').toString();
app.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(homeMustache, request, response);
  /*
    var header = getHeader(req);
  
  
    var html = Mustache.render(homeMustache, {
      list: header['list']
    }, {
        partial: header['partial']
      });
    response.end(html);
  */
});

app.get('/profile', function (request, response) {

});
/*
var piwik = require("piwik").setup("https://classtranscribe.herokuapp.com", "abc");
piwik.track({idsite: 1, url: "https://classtranscribe.herokuapp.com"}, console.log);
*/

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  function (req, res) {
    // TODO: change login redirect?
    res.redirect('/');
  }
);

app.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  function (req, res) {
    /*
        User information in: req["user"]
    
     */
    var redirectUrl = samlStrategy['Redirect'];
    if (redirectUrl != null) {
      res.redirect(redirectUrl);
    }
    else {
      res.redirect('/');
    }
  }
);

app.get('/login/fail',
  function (req, res) {
    res.status(401).send('Login failed');
  }
);

app.get('/logout', function (req, res) {
  simpleLogout(req, res);
});

function simpleLogout(req, res) {
  req.logout();
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
};

app.get('/Metadata',
  function (req, res) {
    res.type('application/xml');
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(process.env.CERT));
  }
);

var viewerMustache = fs.readFileSync(mustachePath + 'viewer.mustache').toString();
app.get('/viewer/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();

    response.writeHead(200, {
      'Content-Type': 'text/html',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
    });

    var view = {
      className: className,
    };
    var html = Mustache.render(viewerMustache, view);
    response.end(html);
  });

var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
app.get('/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

/*        html = Mustache.render(mustacheFile, {
      list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
    }, {
        partial: authenticatedPartial
      })
*/
    var view = {
      className: className,
      exampleTerm: exampleTerms[className],
//
      list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
    };
    var html = Mustache.render(searchMustache, view, {
        partial: authenticatedPartial
    });
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
              studentProgress.push({ 'netID': netID, 'count': progressDict[netID] });
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

app.post('/download', function (request, response) {
  var transcriptions = JSON.parse(request.body.transcriptions);
  var fileNumber = Math.round(Math.random() * 10000)
  fs.writeFileSync("public/Downloads/" + fileNumber + ".webvtt", webvtt(transcriptions));
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify({ fileNumber: fileNumber }));
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

app.get('/Video/:fileName', function (request, response) {
  var file = path.resolve(__dirname + "/Video/", request.params.fileName + ".mp4");
  var range = request.headers.range;
  var positions = range.replace(/bytes=/, "").split("-");
  var start = parseInt(positions[0], 10);

  fs.stat(file, function (err, stats) {
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
      .on("open", function () {
        stream.pipe(response);
      }).on("error", function (err) {
        response.end(err);
      });
  });
})

app.post('/first', function (request, response) {
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


    var isTranscriptionValid = validator.validateTranscription("stats/first/" + className + "/" + statsFileName)

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
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
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

app.get('/queue/:className/:netId', function (request, response) {
  var className = request.params.className.toUpperCase();
  var netId = request.params.netId.toLowerCase();

  var args = ["ClassTranscribe::Tasks::" + className, "0", "99999", "LIMIT", "0", "1"];
  client.zrangebyscore(args, function (err, result) {
    if (err) {
      throw err;
    }

    if (!result.length) {
      return response.end("No more tasks at the moment. More tasks are being uploaded as you read this. Please check back later.");
    }

    var taskName = result[0];
    // var fileName = chosenTask + "-" + netId + ".txt";

    args = ["ClassTranscribe::Tasks::" + className, "1", result[0]];
    client.zincrby(args);

    response.end(taskName);
  });
});

function highDensityQueue(response, className, netId, attemptNum) {
  var args = ["ClassTranscribe::Tasks::" + className, "0", "99999", "WITHSCORES", "LIMIT", "0", "1"];
  client.zrangebyscore(args, function (err, result) {
    if (err) {
      throw err;
    }

    // Tasks will only be empty if there are no tasks left or they've moved to PrioritizedTasks
    if (!result.length) {
      var args = ["ClassTranscribe::PrioritizedTasks::" + className, "0", "99999",
        "WITHSCORES", "LIMIT", "0", "1"];
      client.zrangebyscore(args, function (err, result) {
        if (!result.length) {
          response.end("No more tasks at the moment. Please email classtranscribe@gmail.com.");
        } else {
          taskName = result[0];
          taskScore = parseInt(result[1], 10);

          queueResponse(response, "PrioritizedTasks", netId, className, taskName, attemptNum);
        }
      });
    } else {
      var taskName = result[0];
      var taskScore = parseInt(result[1], 10);

      if (taskScore >= 2) {
        initPrioritizedTask(response, className, attemptNum);
      } else {
        queueResponse(response, "Tasks", netId, className, taskName, attemptNum);
      }
    }
  });
}

function initPrioritizedTask(response, className, netId, attemptNum) {
  var numTasksToPrioritize = 10;
  // Can't call zcard if doesn't exist. Unable to be directly handled by err in zcard call
  // due to how the redis client works
  client.exists("ClassTranscribe::PrioritizedTasks::" + className, function (err, code) {
    if (err) {
      throw err;
    }

    if (code === 0) {
      moveToPrioritizedQueue(response, className, netId, 0, numTasksToPrioritize, attemptNum);
    } else {
      client.zcard("ClassTranscribe::PrioritizedTasks::" + className, function (err, numberTasks) {
        if (err) {
          throw err;
        }

        moveToPrioritizedQueue(response, className, netId, numberTasks, numTasksToPrioritize, attemptNum);
      });
    }
  });
}

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

/**
 *  This function moves tasks from the Tasks to PrioritizedTasks queue, if needed.
 *  Then returns a task to be completed
 *
 * @param  {int} Number of tasks already in set
 * @param  {int} Number tasks desired in set
 * @return {string} task to be completed
 */
function moveToPrioritizedQueue(response, className, netId, numberTasks, numTasksToPrioritize, attemptNum) {
  if (numberTasks < numTasksToPrioritize) {
    var numDifference = numTasksToPrioritize - numberTasks;
    var args = ["ClassTranscribe::Tasks::" + className, "0", "99999",
      "WITHSCORES", "LIMIT", "0", numDifference];
    client.zrangebyscore(args, function (err, tasks) {
      if (err) {
        throw err;
      }

      for (var i = 0; i < tasks.length; i += 2) {
        var taskName = tasks[i];
        var score = parseInt(tasks[i + 1], 10);
        client.zrem("ClassTranscribe::Tasks::" + className, taskName);
        client.zadd("ClassTranscribe::PrioritizedTasks::" + className, score, taskName);
      }
      getPrioritizedTask(response, className, netId, attemptNum);
    });
  } else {
    getPrioritizedTask(response, className, netId, attemptNum);
  }
}

function getPrioritizedTask(response, className, netId, attemptNum) {
  var args = ["ClassTranscribe::PrioritizedTasks::" + className, "0", "99999", "LIMIT", "0", "1"];
  client.zrangebyscore(args, function (err, tasks) {
    if (err) {
      throw err;
    }
    var task = tasks[0]
    console.log('tasks from priority ' + task);
    queueResponse(response, "PrioritizedTasks", netId, className, task, attemptNum);
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
        for (var i = 0; i < result.length; i += 2) {
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
  response.end(JSON.stringify({ captions: captions[index] }));
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

var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('listening on port ' + port + '!');
});