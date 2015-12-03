var http = require('http');
var Router = require('node-simple-router');
var Mustache = require('mustache');
var fs = require('fs');
var router = Router();
var zlib = require('zlib');
var path = require('path');
var mime = require('mime');
var webvtt = require('./scripts/webvtt');
var client = require('./modules/redis');
var mailer = require('./modules/mailer');
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');

var exampleTerms = {
  "cs241": "printf",
  "cs225": "pointer",
  "adv582": "focus group",
  "ece210": "Energy Signals",
}

var searchMustache = fs.readFileSync('search.mustache').toString();
router.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  var view = {
    className: "cs241",
    exampleTerm: exampleTerms["cs241"]
  };
  var html = Mustache.render(searchMustache, view);
  response.end(html);
});

var viewerMustache = fs.readFileSync('viewer.mustache').toString();
router.get('/viewer/:className', function (request, response) {
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

var searchMustache = fs.readFileSync('search.mustache').toString();
router.get('/:className', function (request, response) {
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

var uploadHTML = fs.readFileSync('upload.html').toString();
router.get('/upload', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.end("Endpoint Deprecated.");
})

router.post('/download', function(request, response) {
  var transcriptions = JSON.parse(request.post.transcriptions);
  var fileNumber = Math.round(Math.random() * 10000)
  fs.writeFileSync("public/Downloads/" + fileNumber + ".webvtt", webvtt(transcriptions));
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify({fileNumber: fileNumber}));
});

router.get('/download/webvtt/:fileNumber', function (request, reponse) {
  var file = "public/Downloads/" + request.params.fileNumber + ".webvtt";

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  reponse.setHeader('Content-disposition', 'attachment; filename=' + filename);
  reponse.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(reponse);
});

var firstPassMustache = fs.readFileSync('index.mustache').toString();
router.get('/first/:className/:id', function (request, response) {
  var className = request.params.className.toUpperCase();
  response.writeHead(200, {
    'Content-Type': 'text/html',
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "POST, GET, PUT, DELETE, OPTIONS"
  });

  var view = {
    className: className,
    taskName: request.get.task,
  };
  var html = Mustache.render(firstPassMustache, view);
  response.end(html);
});

router.get('/Video/:fileName', function (request, response) {
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

router.post('/first', function (request, response) {
  var stats = JSON.parse(request.post.stats);
  var transcriptions = request.post.transcriptions;//
  var className = request.post.className.toUpperCase();//
  var statsFileName = stats.video.replace(/\ /g,"_") + "-" + stats.name + ".json";
  var captionFileName = stats.video.replace(/\ /g,"_") + "-" + stats.name + ".txt";
  var taskName = stats.video.replace(/\ /g,"_");
  mkdirp("captions/first/" + className, function (err) {
    if (err) {
      console.log(err);
    }
    fs.writeFileSync("captions/first/" + className + "/" + captionFileName, request.post.transcriptions, {mode: 0777});
  });

  mkdirp("stats/first/" + className, function (err) {
    if (err) {
      console.log(err);
    }
    fs.writeFileSync("stats/first/" + className + "/" + statsFileName, request.post.stats, {mode: 0777});

    var command = 'python';
    var args = ["validator_new.py","stats/first/" + className + "/" + statsFileName];
    var validationChild = spawn(command, args);
    validationChild.stdout.on('data', function (code) {
      code = code.toString().trim();
      if (code === "1") {
        console.log("Transcription is good!");
        client.zrem("ClassTranscribe::Tasks::" + className, taskName);
        client.sadd("ClassTranscribe::First::" + className, captionFileName);
      } else {
        console.log("Transcription is bad!");
        client.lpush("ClassTranscribe::Failed::" + className, captionFileName);
      }
      response.end("Validation Done");
    });
  });
});

var secondPassMustache = fs.readFileSync('editor.mustache').toString();
router.get('/second/:className/:id', function (request, response) {
  var className = request.params.className.toUpperCase();
  response.writeHead(200, {
    'Content-Type': 'text/html',
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "POST, GET, PUT, DELETE, OPTIONS"
  });

  var view = {
    className: className,
    taskName: request.get.task,
  };
  var html = Mustache.render(secondPassMustache, view);
  response.end(html);
});

var queueMustache = fs.readFileSync('queue.mustache').toString();
router.get('/queue/:className', function (request, response) {
  var className = request.params.className.toUpperCase();
  var args = ["ClassTranscribe::Tasks::" + className, "-inf", "+inf", "LIMIT", "0", "1"];
  client.zrangebyscore(args, function (err, result) {
    if (err) {
      throw err;
    }

    if (!result.length) {
      return response.end("No more tasks at the moment. More tasks are being uploaded as you read this. Please check back later.");
    }

    var view = {
      className: request.params.className,
      taskName: result[0],
    };
    var html = Mustache.render(queueMustache, view);

    args = ["ClassTranscribe::Tasks::" + className, "1", result[0]];
    client.zincrby(args);

    response.end(html);
  });
});

var captionsMapping = {
  "cs241": require('./public/javascripts/data/captions/cs241.js'),
  "cs225": require('./public/javascripts/data/captions/cs225.js'),
  "adv582": require('./public/javascripts/data/captions/adv582.js'),
  "ece210": require('./public/javascripts/data/captions/ece210.js'),
}

router.get('/captions/:className/:index', function (request, response) {
  var className = request.params.className.toLowerCase();
  var captions = captionsMapping[className];

  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  var index = parseInt(request.params.index);
  response.end(JSON.stringify({captions: captions[index]}));
});

var progressMustache = fs.readFileSync('progress.mustache').toString();
router.get('/progress/:className', function (request, response) {
  var className = request.params.className.toUpperCase();

  var view = {
    className: className,
  };
  var html = Mustache.render(progressMustache, view);

  response.end(html);
});

router.post('/progress/:className/:netId', function (request, response) {
  var className = request.params.className.toUpperCase();
  var netId = request.params.netId;

  client.smembers("ClassTranscribe::First::" + className, function (err, members) {
    if (err) {
      console.log(err);
    }

    var count = 0;
    members.forEach(function (member) {
      var user = member.split("-")[1].replace(".txt", "");
      if (user === netId) {
        count++;
      }
    });

    mailer.progressEmail(netId, className, count);
    response.end('success');
  });
})

var server = http.createServer(router);
server.listen(80);
