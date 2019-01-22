/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var adminMustache = fs.readFileSync(mustachePath + 'admin.mustache').toString();
const vttToJson = require("vtt-json")

router.get('/admin', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    console.log("~~~~~~~~~")
    input = fs.readFileSync('../data/testJSON.json', 'utf8');
    transferJsonToVtt(input, "testVTT")
    console.log("~~~~~~~~~")
    renderWithPartial(adminMustache, request, response);
});

function transferJsonToVtt(jsonFile, vttFilename) {
    let input = JSON.parse(jsonFile)
    let data = "WEBVTT\n" +
               "Kind: subtitles\n" +
               "Language: en\n\n"
    for (let i = 0; i < input.length; i++) {
      index = i + 1
      part = input[i]["part"]
      data += index.toString() + "\n" +
              convertMStoTime(input[i]["start"]) + " --> " + convertMStoTime(input[i]["end"]) + "\n"
      data = data.concat(part) + "\n\n"
    }
    fs.writeFile(vttFilename + '.vtt', data, (err) => {
      if (err) throw err;
    })
}

function convertMStoTime(duration) {
  let milliseconds = parseInt((duration % 1000)),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

module.exports = router;
