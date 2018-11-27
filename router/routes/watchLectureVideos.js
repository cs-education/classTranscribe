const fs = require('fs');
const db = require('../../db/db');

const utils = require('../../utils/logging');
const perror = utils.perror;
const info = utils.info;
const log = utils.log;

const watchLectureVideosPage = fs.readFileSync(mustachePath + 'watchLectureVideos.mustache').toString();

router.get('/watchLectureVideos/:courseOfferingId', function (request, response) {
  if(request.isAuthenticated()) {

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    var courseOfferingId = request.params.courseOfferingId;


    db.getPlaylistByCourseOfferingId( courseOfferingId ).then(
      values => {

        var playlist = values.map(result => {
          let video = {};
            let des = JSON.parse(result.siteSpecificJSON);
            video['name'] = des.title;
          video['sources'] = [{src: result['videoLocalLocation'], type:'video/mp4'}];
          video['textTracks'] = [{src: result['srtFileLocation'], srclang: 'eng', label: 'English'}];
            video['thumbnail'] = false;
          return video;
        });

        renderWithPartial(watchLectureVideosPage, request, response, { playlist : JSON.stringify(playlist) });
    }).catch(err => { perror(err); }); /* db.getPlaylistByCourseOfferingId() */
  } else {
    response.redirect('../../');
  }
});


/* not used */
router.get('/getVideo', function(request, response) {
  var lectureNumber = "1";
  var file = path.join(__dirname, "../../videos/Lecture_" + lectureNumber + ".mp4");
  console.log(file);

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
