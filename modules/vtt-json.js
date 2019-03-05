function convertVttToJson(vttString) {
  return new Promise((resolve, reject) => {
    let current = {}
    let sections = []
    let subtitleIsNext = false;

    let line_pivot = vttString.indexOf('-->');
    while (line_pivot !== -1) {
      let line_start = vttString.lastIndexOf('\n', line_pivot - 1);
      let line_end = vttString.indexOf('\n', line_pivot + 3);
      subtitleIsNext = true;

      let left_lines = vttString.substring(line_start, line_pivot).trimRight();
      let right_lines = vttString.substring(line_pivot + 3, line_end).trimLeft();
      let tmp_idx = right_lines.indexOf(' ');
      current = {
        start: timeString2ms(left_lines.substring(left_lines.lastIndexOf(' ') + 1)),
        end: timeString2ms(tmp_idx < 0 ? right_lines : right_lines.substring(0, tmp_idx)),
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

    resolve(sections);
  })
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
