
(function() {
    var childProcess = require("child_process");
    oldSpawn = childProcess.spawn;
    function mySpawn() {
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

var inputFile = process.argv[2];
var segments = process.argv.slice(3);

var cp = require('child_process');

var splitCommands = [];
segments.slice(0, -1).forEach(function (segment, i) {
  var splitCommand = ["ffmpeg"
                      ,"-i"
                      ,inputFile
                      ,"-vcodec"
                      ,"copy"
                      ,"-acodec"
                      ,"copy"
                      ,"-ss"
                      ,segment
                      ,"-t"
                      ,timeDifference(segment, segments[i+1])
                      ,[inputFile.split(".webm")[0], "_part", i, ".webm"].join("")
                     ];
  splitCommands.push(splitCommand);

  var mp3Command = ["ffmpeg"
                      ,"-i"
                      ,[inputFile.split(".webm")[0], "_part", i, ".webm"].join("")
                      ,"-codec:a"
                      ,"libmp3lame"
                      ,"-qscale:a"
                      ,"2"
                      ,[inputFile.split(".webm")[0], "_part", i, ".mp3"].join("")
                     ];

  splitCommands.push(mp3Command);

  var wavCommand = ["ffmpeg"
                      ,"-i"
                      ,[inputFile.split(".webm")[0], "_part", i, ".webm"].join("")
                      ,"-f"
                      ,"wav"
                      ,"-ar"
                      ,"22050"
                      ,[inputFile.split(".webm")[0], "_part", i, ".wav"].join("")
                     ];

  splitCommands.push(wavCommand);
});

executeSplitCommands();

function executeSplitCommands() {

  if (splitCommands.length) {
    var splitCommand = splitCommands.shift();
    console.log(splitCommand)
    var child = cp.spawn(splitCommand[0], splitCommand.slice(1));
    child.on('error', function (e) {
      console.log(e.stack);
    })
    child.on('data', function () {
      console.log("data", arguments);
    })
    child.on('close', function (code) {
      console.log("close", arguments)
      executeSplitCommands();
    });
  }
}

function timeDifference(time1, time2) {
  return timeNumToString(timeStringToNum(time2) - timeStringToNum(time1));
}

/*
  Converts a time string to a time integer
*/
function timeStringToNum(timeString) {
  var minutes = parseInt(timeString.split(":")[0], 10);
  var seconds = parseInt(timeString.split(":")[1], 10);
  return 60 * minutes + seconds;
}

/*
  Converts a time integer to a time string
*/
function timeNumToString(timeNum) {
  var timeNumInMinutes = Math.floor(timeNum / 60);
  var timeNumInSeconds = Math.floor(timeNum % 60);

  if (timeNumInSeconds < 10) {
    return timeNumInMinutes + ":0" + timeNumInSeconds;
  }
  return timeNumInMinutes + ":" + timeNumInSeconds;
}