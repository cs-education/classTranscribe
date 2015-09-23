var fs = require('fs');
var client = require('./../modules/redis');

var path = process.argv[2];
var className = path.split("/").slice(-1)[0];

console.log(path);

var lectures = fs.readdirSync(path).filter(function (dir) {
  return dir.indexOf("Lecture") > -1;
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
  client.zadd("ClassTranscribe::Tasks::" + className, 1, task);
});

console.log(tasks)