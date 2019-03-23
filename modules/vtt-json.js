const fs = require('fs');

function convertVttToJson(vttPath) {
  let vttString = fs.readFileSync(vttPath).toString();

  let current = {}
  let sections = []
  let subtitleIsNext = false;

  let line_pivot = vttString.indexOf('-->');
  while (line_pivot !== -1) {
    let line_start = vttString.lastIndexOf('\n', line_pivot - 1);
    let line_end = vttString.indexOf('\n', line_pivot + 3);
    subtitleIsNext = true;

    let left_half = vttString.substring(line_start, line_pivot).trimRight();
    let first_space_in_left_half_idx = left_half.indexOf(' ');

    let right_half = vttString.substring(line_pivot + 3, line_end).trimLeft();
    let first_space_in_right_half_idx = right_half.indexOf(' ');

    current = {
      //Avoid a copy if no space is found.
      start: timeString2ms(first_space_in_left_half_idx < 0 ? left_half : left_half.substring(first_space_in_left_half_idx + 1)),
      end: timeString2ms(first_space_in_right_half_idx < 0 ? right_half : right_half.substring(0, first_space_in_right_half_idx)),
      subtitles: []
    }
    sections.push(current);

    line_start = line_end + 1;
    line_end = vttString.indexOf('\n', line_start);
    while (line_end > line_start + 1) {
      current.subtitles.push(vttString.substring(line_start, line_end));
      line_start = line_end + 1;
      line_end = vttString.indexOf('\n', line_start);
    }
    if (line_end === -1) {
      break;
    }
    line_pivot = vttString.indexOf('-->', line_end + 1);
  }

  return sections;
}

// helpers
//   http://codereview.stackexchange.com/questions/45335/milliseconds-to-time-string-time-string-to-milliseconds
function timeString2ms(a,b) {// time(HH:MM:SS.mss) // optimized
 return a=a.split('.'), // optimized
  b=a[1]*1||0, // optimized
  a=a[0].split(':'),
  b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
}

module.exports = convertVttToJson;
