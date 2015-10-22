var client = require('./../modules/redis');

var className = process.argv[2];

client.smembers("ClassTranscribe::Finished::" + className, function (err, results) {
  results = results.sort(function (a,b) {
    var aSplit = a.split("_");
    var bSplit = b.split("_");
    return parseInt(aSplit[3]) * 100 + parseInt(a.split("part")[1]) - parseInt(bSplit[3]) * 100 - parseInt(b.split("part")[1]);
  });

  results.forEach(function (videoWithName) {
    var splitVideoWithName = videoWithName.split("-");
    var video = splitVideoWithName[0];
    var splitVideo = video.split("_");
    var s3Url = "https://s3-us-west-2.amazonaws.com/classtranscribe/" + className + "/Lecture_" + splitVideo[3] + "/" + video + ".webm";
    console.log(JSON.stringify([splitVideo.join(" "), s3Url]) + ",");
  })
})