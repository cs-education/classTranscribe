/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fs = require('fs');
var client = require('./../modules/redis');

var path = process.argv[2];
var className = process.argv[3].toUpperCase();

var lectures = fs.readdirSync(path).filter(function (dir) {
  return dir.indexOf("Lecture") > -1 && fs.statSync(path+'/'+dir).isDirectory();
});

var tasks = [];
lectures.forEach(function (lecture) {
  var lectureVideoSegments = fs.readdirSync(path + "/" + lecture);
  lectureVideoSegments = lectureVideoSegments.filter(function (segment) {
    return segment.indexOf("mp3") > -1;
  });
  lectureVideoSegments = lectureVideoSegments.map(function (segment) {
    return segment.split(".")[0];
  });
  tasks = tasks.concat(lectureVideoSegments);
});

tasks.forEach(function (task) {
  console.log("task: ", task);
  client.zadd("ClassTranscribe::Tasks::" + className, 1, task);
});


