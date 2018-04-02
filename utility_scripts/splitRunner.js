/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;

var video_path = process.argv[2];

var className = process.argv[3].toUpperCase();

var videos = fs.readdirSync(video_path).filter(function (video) {
  return video.indexOf("mp4") > -1;
});

videos = videos.map(function (video) {
  return video.replace(".mp4", "");
});

console.log("path: " + video_path);
console.log("videos: " + videos);

videos.forEach(function (video) {
  console.log("full lecture videos");
  var videoIndex = parseInt(video.split("_")[1], 10);
  videoIndex = videoIndex > 9 ? videoIndex : "0" + videoIndex;

  //var lectureDir = video_path + "/Lecture" + videoIndex
  var lectureDir = video_path + "/LECTURE_" + videoIndex;
  fs.mkdirSync(lectureDir);
  fs.renameSync(video_path + "/" + video + ".wav", lectureDir + "/Full_Lecture_Video_" + videoIndex + ".wav");
  fs.renameSync(video_path + "/" + video + ".mp4", lectureDir + "/Full_Lecture_Video_" + videoIndex + ".mp4");
});

var folders = fs.readdirSync(video_path).filter(function (folder) {
  return folder.indexOf("LECTURE") > -1 && fs.statSync(video_path+'/'+folder).isDirectory();
});

console.log("folders: ", folders);

segmenter_path = path.join(__dirname, '../utility_scripts/lectureSegmenter.py');
split_path = path.join(__dirname, '../utility_scripts/split.js');
console.log(split_path);
var splitsDone = 0;
folders.forEach(function (folder) {
  console.log("folder: ", folder);
  var folderIndex = folder.split("_")[1];
  console.log("folder index: ", folderIndex);
  console.log(video_path + "/" + folder + "/Full_Lecture_Video_" + folderIndex + ".wav");
  var command = 'python';
  var args = [segmenter_path, video_path + "/" + folder + "/Full_Lecture_Video_" + folderIndex + ".wav"];
  var segmenterChild = spawn(command, args);
  console.log(args);
  segmenterChild.stdout.on('data', function (splitTimes) {
    splitTimes = splitTimes.toString().trim();
    console.log(splitTimes);
    var command = 'node';
    var args = [
      split_path,
      video_path + "/" + folder + "/Full_Lecture_Video_" + folderIndex + ".mp4"
    ].concat(splitTimes.split(" "));
    var splitChild = spawn(command, args);
    splitChild.stderr.on('data', function(err) {
      console.log(err.toString('utf-8'));
    });
    splitChild.on('close', function() {
      splitsDone++;
      console.log(splitsDone);
      if (folders.length === splitsDone) {
        process.exit();
      }
    });
  });
  segmenterChild.stderr.on('data', function (err) {
    console.log(err.toString('utf-8'));
  });


});
