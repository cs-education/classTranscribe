var fs = require('fs')
var spawn = require('child_process').spawn;
var client = require('./modules/redis');

var lock = false;

function secondPass() {
  client.keys("ClassTranscribe::First::*", function (err, keys) {
    if (keys.length === 0) {
      lock = false;
      return;
    }

    var key = keys[0];
    var className = key.split("::")[2];

    client.smembers(key, function (err, members) {
      if (err) {
        console.log(err);
      }

      member = members[0];
      var videoIndexNetid = member.replace(".txt", "");
      var command = 'python';
      var args = ["runner.py", className, videoIndexNetid];
      var child = spawn(command, args);
      child.on("error", function (err) {
        console.log("failed to execute the second process");
        console.log(err);
      })
      child.stderr.on('data', process.stderr.write.bind(process.stderr));
      child.stdout.on('data', process.stdout.write.bind(process.stdout));
      child.on('close', function (code) {
        console.log("Success!")
        if (code === 0) {
          var fname = 'captions/first/' + className + '/' + videoIndexNetid + '.json';
          var transcription = fs.readFileSync(fname);
          client.sadd('ClassTranscribe::Transcriptions::' + fname, transcription);

          client.smove(key, "ClassTranscribe::Finished::" + className, member, function (err,status) {
            if (err) {
              console.log(err);
            }
          })
        }

        lock = false;
      })
    })
  })
}

setInterval(function () {
  if (lock === false) {
    lock = true;
    secondPass();
  }
}, 1000*2)