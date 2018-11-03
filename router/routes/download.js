/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const router = express.Router();
const fs = require('fs');
const mime = require('mime');
const path = require('path');

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
