var http = require('http');
var Router = require('node-simple-router');
var fs = require('fs');
var router = Router();
var zlib = require('zlib');
var path = require('path');
var mime = require('mime');
var webvtt = require('./scripts/webvtt');

var indexHTML = fs.readFileSync('search.html').toString();
router.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.end(indexHTML);
});

var uploadHTML = fs.readFileSync('upload.html').toString();
router.get('/upload', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.end(uploadHTML);
})

router.post('/download', function(request, response) {
  var transcriptions = JSON.parse(request.post.transcriptions);
  var fileNumber = Math.round(Math.random() * 10000)
  fs.writeFileSync("Public/Downloads/" + fileNumber + ".webvtt", webvtt(transcriptions));
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify({fileNumber: fileNumber}));
});

router.get('/download/webvtt/:fileNumber', function (request, reponse) {
  var file = "Public/Downloads/" + request.params.fileNumber + ".webvtt";

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  reponse.setHeader('Content-disposition', 'attachment; filename=' + filename);
  reponse.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(reponse);
});

var firstPassHTML = fs.readFileSync('index.html').toString();
router.get('/first/:videoIndex/:id', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html',
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "POST, GET, PUT, DELETE, OPTIONS"
  });
  response.end(firstPassHTML);
});

router.get('/Video/:fileName', function (request, response) {
  var file = path.resolve(__dirname + "/Video/", request.params.fileName + ".webm");
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
  var transcriptions = JSON.parse(request.post.transcriptions);
  var captionFileName = stats.video.replace(/\ /g,"_") + "-" + stats.name + ".json";
  var statsFileName = stats.video.replace(/\ /g,"_") + "-" + stats.name + ".json";
  fs.writeFileSync("captions/first/" + captionFileName, request.post.transcriptions, {mode: 0777});
  fs.writeFileSync("stats/first/" + statsFileName, request.post.stats, {mode: 0777});
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify({success: true}));
});

router.post('/second', function (request, response) {
  var stats = JSON.parse(request.post.stats);
  var transcriptions = JSON.parse(request.post.transcriptions);
  var captionFileName = stats.video.replace(/\ /g,"_") + "-" + stats.name + ".json";
  var statsFileName = stats.video.replace(/\ /g,"_") + "-" + stats.name + ".json";
  fs.writeFileSync("captions/second/" + captionFileName, request.post.transcriptions, {mode: 0777});
  fs.writeFileSync("stats/second/" + statsFileName, request.post.stats, {mode: 0777});
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify({success: true}));
});

var secondPassHTML = fs.readFileSync('editor.html').toString();
router.get('/second/:videoIndex/:id', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html',
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "POST, GET, PUT, DELETE, OPTIONS"
  });
  response.end(secondPassHTML);
});

router.get('/javascripts/data/captions.js', function (request, response) {
  var raw = fs.createReadStream('public/javascripts/data/captions.js');
  var acceptEncoding = request.headers['accept-encoding'] || '';
  if (acceptEncoding.match(/\bdeflate\b/)) {
    response.writeHead(200, { 'content-encoding': 'deflate' });
    raw.pipe(zlib.createDeflate()).pipe(response);
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    response.writeHead(200, { 'content-encoding': 'gzip' });
    raw.pipe(zlib.createGzip()).pipe(response);
  } else {
    response.writeHead(200, {});
    raw.pipe(response);
  }
});

var captions = require('./public/javascripts/data/captions.js');
router.get('/captions/:index', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  var index = parseInt(request.params.index);
  response.end(JSON.stringify({captions: captions[index]}));
});


var server = http.createServer(router);
server.listen(80);
