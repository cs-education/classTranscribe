// Video sources
var VIDEOS = [
  ["Full Lecture Video 01 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_01/Full_Lecture_Video_01_part0.mp4"],
  ["Full Lecture Video 02 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_02/Full_Lecture_Video_02_part0.mp4"],
  ["Full Lecture Video 02 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_02/Full_Lecture_Video_02_part0.mp4"],
  ["Full Lecture Video 02 part1","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_02/Full_Lecture_Video_02_part1.mp4"],
  ["Full Lecture Video 02 part2","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_02/Full_Lecture_Video_02_part2.mp4"],
  ["Full Lecture Video 02 part3","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_02/Full_Lecture_Video_02_part3.mp4"],
  ["Full Lecture Video 02 part4","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_02/Full_Lecture_Video_02_part4.mp4"],
  ["Full Lecture Video 03 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_03/Full_Lecture_Video_03_part0.mp4"],
  ["Full Lecture Video 03 part1","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_03/Full_Lecture_Video_03_part1.mp4"],
  ["Full Lecture Video 03 part1","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_03/Full_Lecture_Video_03_part1.mp4"],
  ["Full Lecture Video 03 part2","https://s3-us-west-2.amazonaws.com/classtranscribes3/ADV582/Lecture_03/Full_Lecture_Video_03_part2.mp4"],
];

$(document).ready(function () {
  VIDEOS.forEach(function (video, i) {
    var title = video[0];
    var src = video[1];
    var template = '<option class="video-option" value="' + i + '">' + title + '</option>';
    $(".video-selector").append(template);
  });
});

/*
  Loads the selected video
*/
function loadVideo(videoIndex) {
  var videoSrc = VIDEOS[videoIndex][1];
  $(".main-video-source").attr("src", videoSrc);
  $(".main-video").get(0).load();
}