var fs = require('fs');
var client = require('./../modules/redis');
var redis = require('redis')

var path = process.argv[2];
var className = process.argv[3];

console.log(path);

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on("ready", function (err) {
    console.log('ready');
    console.log('is client connected- ' + client.connected);
});

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

console.log('saving tasks to ClassTranscribe::Tasks::' + className);
console.log('is client connected- ' + client.connected);
tasks.forEach(function (task) {
  client.zadd(["ClassTranscribe::Tasks::" + className, 1, task], function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
    
  });
});

console.log(tasks)
