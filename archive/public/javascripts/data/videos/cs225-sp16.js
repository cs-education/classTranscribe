// Video sources
var VIDEOS = [
  ["Full Lecture Video 01 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_01/Full_Lecture_Video_01_part0.mp4"],
  ["Full Lecture Video 01 part2","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_01/Full_Lecture_Video_01_part2.mp4"],
  ["Full Lecture Video 01 part3","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_01/Full_Lecture_Video_01_part3.mp4"],
  ["Full Lecture Video 01 part4","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_01/Full_Lecture_Video_01_part4.mp4"],
  ["Full Lecture Video 01 part6","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_01/Full_Lecture_Video_01_part6.mp4"],
  ["Full Lecture Video 01 part7","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_01/Full_Lecture_Video_01_part7.mp4"],
  ["Full Lecture Video 02 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_02/Full_Lecture_Video_02_part0.mp4"],
  ["Full Lecture Video 02 part1","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_02/Full_Lecture_Video_02_part1.mp4"],
  ["Full Lecture Video 02 part3","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_02/Full_Lecture_Video_02_part3.mp4"],
  ["Full Lecture Video 02 part8","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_02/Full_Lecture_Video_02_part8.mp4"],
  ["Full Lecture Video 02 part9","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_02/Full_Lecture_Video_02_part9.mp4"],
  ["Full Lecture Video 02 part10","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_02/Full_Lecture_Video_02_part10.mp4"],
  ["Full Lecture Video 03 part1","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_03/Full_Lecture_Video_03_part1.mp4"],
  ["Full Lecture Video 03 part4","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_03/Full_Lecture_Video_03_part4.mp4"],
  ["Full Lecture Video 03 part5","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_03/Full_Lecture_Video_03_part5.mp4"],
  ["Full Lecture Video 03 part6","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_03/Full_Lecture_Video_03_part6.mp4"],
  ["Full Lecture Video 03 part7","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_03/Full_Lecture_Video_03_part7.mp4"],
  ["Full Lecture Video 03 part8","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_03/Full_Lecture_Video_03_part8.mp4"],
  ["Full Lecture Video 03 part9","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_03/Full_Lecture_Video_03_part9.mp4"],
  ["Full Lecture Video 04 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_04/Full_Lecture_Video_04_part0.mp4"],
  ["Full Lecture Video 04 part1","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_04/Full_Lecture_Video_04_part1.mp4"],
  ["Full Lecture Video 04 part2","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_04/Full_Lecture_Video_04_part2.mp4"],
  ["Full Lecture Video 04 part3","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_04/Full_Lecture_Video_04_part3.mp4"],
  ["Full Lecture Video 04 part5","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_04/Full_Lecture_Video_04_part5.mp4"],
  ["Full Lecture Video 04 part7","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_04/Full_Lecture_Video_04_part7.mp4"],
  ["Full Lecture Video 05 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_05/Full_Lecture_Video_05_part0.mp4"],
  ["Full Lecture Video 05 part1","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_05/Full_Lecture_Video_05_part1.mp4"],
  ["Full Lecture Video 05 part2","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_05/Full_Lecture_Video_05_part2.mp4"],
  ["Full Lecture Video 05 part3","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_05/Full_Lecture_Video_05_part3.mp4"],
  ["Full Lecture Video 05 part4","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_05/Full_Lecture_Video_05_part4.mp4"],
  ["Full Lecture Video 05 part5","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_05/Full_Lecture_Video_05_part5.mp4"],
  ["Full Lecture Video 05 part7","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_05/Full_Lecture_Video_05_part7.mp4"],
  ["Full Lecture Video 05 part9","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_05/Full_Lecture_Video_05_part9.mp4"],
  ["Full Lecture Video 06 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_06/Full_Lecture_Video_06_part0.mp4"],
  ["Full Lecture Video 06 part1","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_06/Full_Lecture_Video_06_part1.mp4"],
  ["Full Lecture Video 06 part2","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_06/Full_Lecture_Video_06_part2.mp4"],
  ["Full Lecture Video 06 part4","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_06/Full_Lecture_Video_06_part4.mp4"],
  ["Full Lecture Video 06 part5","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_06/Full_Lecture_Video_06_part5.mp4"],
  ["Full Lecture Video 06 part6","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_06/Full_Lecture_Video_06_part6.mp4"],
  ["Full Lecture Video 07 part0","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_07/Full_Lecture_Video_07_part0.mp4"],
  ["Full Lecture Video 07 part2","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_07/Full_Lecture_Video_07_part2.mp4"],
  ["Full Lecture Video 07 part3","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_07/Full_Lecture_Video_07_part3.mp4"],
  ["Full Lecture Video 07 part5","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_07/Full_Lecture_Video_07_part5.mp4"],
  ["Full Lecture Video 07 part5","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_07/Full_Lecture_Video_07_part5.mp4"],
  ["Full Lecture Video 07 part6","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_07/Full_Lecture_Video_07_part6.mp4"],
  ["Full Lecture Video 07 part9","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_07/Full_Lecture_Video_07_part9.mp4"],
  ["Full Lecture Video 07 part10","https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225-SP16/Lecture_07/Full_Lecture_Video_07_part10.mp4"],
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