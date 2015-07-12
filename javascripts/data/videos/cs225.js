// Video sources
var VIDEOS = [
  // Lecture 1
  ["Full Lecture Video 1 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part0.mp3"],
  ["Full Lecture Video 1 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part1.mp3"],
  ["Full Lecture Video 1 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part2.mp3"],
  ["Full Lecture Video 1 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part3.mp3"],
  ["Full Lecture Video 1 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part4.mp3"],
  ["Full Lecture Video 1 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part5.mp3"],
  ["Full Lecture Video 1 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part6.mp3"],
  ["Full Lecture Video 1 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part7.mp3"],
  ["Full Lecture Video 1 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part8.mp3"],
  ["Full Lecture Video 1 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part9.mp3"],
  ["Full Lecture Video 1 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part10.mp3"],

  // Lecture 2
  ["Full Lecture Video 2 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part0.mp3"],
  ["Full Lecture Video 2 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part1.mp3"],
  ["Full Lecture Video 2 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part2.mp3"],
  ["Full Lecture Video 2 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part3.mp3"],
  ["Full Lecture Video 2 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part4.mp3"],
  ["Full Lecture Video 2 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part5.mp3"],
  ["Full Lecture Video 2 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part6.mp3"],
  ["Full Lecture Video 2 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part7.mp3"],
  ["Full Lecture Video 2 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part8.mp3"],
  ["Full Lecture Video 2 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part9.mp3"],
  ["Full Lecture Video 2 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part10.mp3"],

  // Lecture 3
  ["Full Lecture Video 3 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part0.mp3"],
  ["Full Lecture Video 3 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part1.mp3"],
  ["Full Lecture Video 3 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part2.mp3"],
  ["Full Lecture Video 3 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part3.mp3"],
  ["Full Lecture Video 3 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part4.mp3"],
  ["Full Lecture Video 3 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part5.mp3"],
  ["Full Lecture Video 3 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part6.mp3"],
  ["Full Lecture Video 3 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part7.mp3"],
  ["Full Lecture Video 3 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part8.mp3"],
  ["Full Lecture Video 3 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part9.mp3"],

  // Lecture 4
  ["Full Lecture Video 4 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part0.mp3"],
  ["Full Lecture Video 4 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part1.mp3"],
  ["Full Lecture Video 4 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part2.mp3"],
  ["Full Lecture Video 4 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part3.mp3"],
  ["Full Lecture Video 4 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part4.mp3"],
  ["Full Lecture Video 4 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part5.mp3"],
  ["Full Lecture Video 4 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part6.mp3"],
  ["Full Lecture Video 4 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part7.mp3"],
  ["Full Lecture Video 4 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part8.mp3"],
  ["Full Lecture Video 4 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part9.mp3"],
  ["Full Lecture Video 4 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part10.mp3"],

  // Lecture 5
  ["Full Lecture Video 5 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part0.mp3"],
  ["Full Lecture Video 5 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part1.mp3"],
  ["Full Lecture Video 5 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part2.mp3"],
  ["Full Lecture Video 5 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part3.mp3"],
  ["Full Lecture Video 5 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part4.mp3"],
  ["Full Lecture Video 5 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part5.mp3"],
  ["Full Lecture Video 5 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part6.mp3"],
  ["Full Lecture Video 5 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part7.mp3"],
  ["Full Lecture Video 5 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part8.mp3"],
  ["Full Lecture Video 5 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part9.mp3"],
  ["Full Lecture Video 5 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part10.mp3"],


  // Lecture 6
  ["Full Lecture Video 6 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part0.mp3"],
  ["Full Lecture Video 6 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part1.mp3"],
  ["Full Lecture Video 6 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part2.mp3"],
  ["Full Lecture Video 6 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part3.mp3"],
  ["Full Lecture Video 6 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part4.mp3"],
  ["Full Lecture Video 6 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part5.mp3"],
  ["Full Lecture Video 6 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part6.mp3"],
  ["Full Lecture Video 6 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part7.mp3"],
  ["Full Lecture Video 6 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part8.mp3"],
  ["Full Lecture Video 6 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part9.mp3"],
  ["Full Lecture Video 6 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part10.mp3"],
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