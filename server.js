var http = require('http');
var Router = require('node-simple-router');
var fs = require('fs');
var router = Router();
var zlib = require('zlib');

var indexHTML = fs.readFileSync('search.html').toString();
router.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.end(indexHTML);
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
