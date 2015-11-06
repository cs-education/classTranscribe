var fs = require('fs');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;

var path = process.argv[2];

var videos = fs.readdirSync(path).filter(function (video) {
  return video.indexOf("webm") > -1;
});

videos = videos.map(function (video) {
  return video.replace(".webm", "");
});

console.log(videos);


videos.forEach(function (video) {
  var videoIndex = parseInt(video.split("_")[1], 10) + 1;
  videoIndex = videoIndex > 9 ? videoIndex : "0" + videoIndex;

  var lectureDir = path + "/Lecture_" + videoIndex;
  fs.mkdirSync(lectureDir);
  fs.renameSync(path + "/" + video + ".wav", lectureDir + "/Full_Lecture_Video_" + videoIndex + ".wav");
  fs.renameSync(path + "/" + video + ".webm", lectureDir + "/Full_Lecture_Video_" + videoIndex + ".webm");
});

var folders = fs.readdirSync(path).filter(function (folder) {
  return folder.indexOf("Lecture") > -1;
});

console.log(folders);

var splitsDone = 0;
folders.forEach(function (folder) {
  var folderIndex = folder.split("_")[1];
  var command = 'python';
  var args = ["lectureSegmenter.py", path + "/" + folder + "/Full_Lecture_Video_" + folderIndex + ".wav"];
  var segmenterChild = spawn(command, args);
  segmenterChild.stdout.on('data', function (splitTimes) {
    splitTimes = splitTimes.toString().trim();
    console.log(splitTimes)
    var command = 'node';
    var args = [
      "split.js",
      path + "/" + folder + "/Full_Lecture_Video_" + folderIndex + ".webm"
    ].concat(splitTimes.split(" "));
    var splitChild = spawn(command, args);
    splitChild.on('close', function() {
      splitsDone++;
      console.log(splitsDone);
      if (folders.length === splitsDone) {
        process.exit();
      }
    });
  });
});
