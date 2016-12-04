module.exports = function (captions) {
  var result = "WEBVTT\n\n";
  var currentTime = 0;
  captions.forEach(function (caption) {
    var start = currentTime;
    var end = currentTime + (caption.width / 64) + (2/64);

    var timeRange = timeNumToString(start) + " --> " + timeNumToString(end);
    result += timeRange
    result += "\n"
    result += "<v Speaker>" + caption.text
    result += "\n\n"

    currentTime = end;
  })
  console.log(result);
  return result
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

  var stringSeconds = (timeNum % 60) + "";

  var timeInMilliseconds = (stringSeconds.split(".")[1] || "");
  if (timeInMilliseconds.length < 3) {
    var loopNumber = 3 - timeInMilliseconds.length;
    for (var i = 0; i < loopNumber; i++) {
      timeInMilliseconds += "0";
    }
  } else if (timeInMilliseconds.length > 3) {
    timeInMilliseconds = timeInMilliseconds.substring(0, 3);
  }

  timeInMilliseconds = "." + timeInMilliseconds

  if (timeNumInMinutes < 10) {
    timeNumInMinutes = "0" + timeNumInMinutes;
  }

  if (timeNumInSeconds < 10) {
    return timeNumInMinutes + ":0" + timeNumInSeconds + timeInMilliseconds;
  }
  return timeNumInMinutes + ":" + timeNumInSeconds + timeInMilliseconds;
}