// /** Copyright 2015 Board of Trustees of University of Illinois
//  * All rights reserved.
//  *
//  * This source code is licensed under the MIT license found in the
//  * LICENSE file in the root directory of this source tree.
//  */
// var fs = require('fs')
// var spawn = require('child_process').spawn;
// var client = require('./modules/redis');
//
// var lock = false;
//
// function secondPass() {
//   client.keys("ClassTranscribe::First::*", function (err, keys) {
//     if (keys.length === 0) {
//       lock = false;
//       return;
//     }
//
//     var key = keys[0];
//     var className = key.split("::")[2];
//
//     client.smembers(key, function (err, members) {
//       if (err) {
//         console.log(err);
//       }
//
//       member = members[Math.floor(Math.random()*members.length)];
//       var videoIndexNetid = member.replace(".txt", "");
//       var command = 'python';
//       var args = ["runner.py", className, videoIndexNetid];
//       var child = spawn(command, args);
//       console.log('className ' + className)
//       console.log('fileName ' + videoIndexNetid)
//
//
//       var threeMinuteTimeout = setTimeout(function () {
//         console.log("Killing p2fa process for taking too long")
//         child.kill('SIGKILL');
//       }, 1000 * 60 * 3);
//
//       var tenMinuteTimeout = setTimeout(function () {
//         console.log("Killing p2fa process for taking too long")
//         child.kill('SIGKILL');
//       }, 1000 * 60 * 10);
//
//       child.on("error", function (err) {
//         console.log("failed to execute the second process");
//         console.log(err);
//       });
//       child.stderr.on('data', process.stderr.write.bind(process.stderr));
//       child.stdout.on('data', process.stdout.write.bind(process.stdout));
//       child.stdout.on('data', function (data) {
//         if(data.toString().indexOf("tmp/sound.wav -> tmp/tmp.plp") > -1) {
//           console.log("THIS WILL WORK");
//           clearTimeout(threeMinuteTimeout);
//         }
//       });
//       child.on('close', function (code, type) {
//         clearTimeout(threeMinuteTimeout);
//         clearTimeout(tenMinuteTimeout);
//
//         if (type === 'SIGKILL') {
//           console.log("Killed for taking too long")
//         } else if (code === 0) {
//           console.log("Task moved")
//           var fname = 'captions/second/' + className + '/' + videoIndexNetid + '.json';
//           var transcription = fs.readFileSync(fname);
//           client.sadd('ClassTranscribe::Transcriptions::' + fname, transcription);
//
//           client.smove(key, "ClassTranscribe::Finished::" + className, member, function (err,status) {
//             if (err) {
//               console.log(err);
//             }
//           })
//         }
//
//         lock = false;
//       });
//     })
//   })
// }
//
// setInterval(function () {
//   if (lock === false) {
//     lock = true;
//     secondPass();
//   }
// }, 1000*2)
