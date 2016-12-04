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
