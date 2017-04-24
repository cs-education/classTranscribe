var router = express.Router();
var fs = require('fs');
var mime = require('mime');
var path = require('path');

router.post('/download', function (request, response) {
  var transcriptions = JSON.parse(request.body.transcriptions);
  var fileNumber = Math.round(Math.random() * 10000)
  fs.writeFileSync("public/Downloads/" + fileNumber + ".webvtt", webvtt(transcriptions));
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify({ fileNumber: fileNumber }));
});

router.get('/download/webvtt/:fileNumber', function (request, response) {
  var file = "public/Downloads/" + request.params.fileNumber + ".webvtt";

  fs.stat(file, function handle(err, stats) {
    if (err) {
      if (err.code === "ENOENT") {
        response.send("File doesn't exist");
      }
      else {
        response.send("Something unfathomable happened");
      }
    }
    else {
      var filename = path.basename(file);
      var mimetype = mime.lookup(file);

      response.setHeader('Content-disposition', 'attachment; filename=' + filename);
      response.setHeader('Content-type', mimetype);

      var filestream = fs.createReadStream(file);
      filestream.pipe(response);
    }
  })
});

module.exports = router;
