/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fs = require('fs');

function stage_1(transcript_file) {
  try {
    var statistics = JSON.parse(fs.readFileSync(transcript_file, 'utf8'));
  } catch (error) {
      console.log(error);
      return false;
  }
  
  var totalTime = 0;
  try {
    var totalTime = statistics.totalTime
  } catch (err) {
    console.log('error parsing time');
  }

  if (totalTime < 1000)
    return false;
  else
    return true;
}


module.exports = {
  validateTranscription: stage_1
};
