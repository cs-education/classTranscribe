/*
    /Video

*/

router.get('/Video/:fileName', function (request, response) {
  var file = path.resolve(__dirname + "/Video/", request.params.fileName + ".mp4");

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
    }
  });
});

module.exports = router;
