// Video sources
var VIDEOS = [
  // ["video title", "video source"]
  ["Mini Video: Hello World", "https://cs-education.github.io/sysassets/mp4/0010-HelloWorld-v2.mp4"],
  ["Mini Video: Hello Std Err", "https://cs-education.github.io/sysassets/mp4/0020-HelloStdErr-24fps600kbs.mp4"],
  ["Mini Video: Open and Create a file", "https://cs-education.github.io/sysassets/mp4/0030-OpenCreateAFile-650kb.mp4"],
  ["Mini Video: Open Errors and Printf", "https://cs-education.github.io/sysassets/mp4/0040-OpenErrorsPrintf-600kbs.mp4"],
  ["Mini Video: Not All Bytes Are 8Bits", "https://cs-education.github.io/sysassets/mp4/0050-NotAllBytesAre8Bits.mp4"],
  ["Mini Video: Follow The Int Pointer", "https://cs-education.github.io/sysassets/mp4/0060-FollowTheIntPointer.mp4"],
  ["Mini Video: Character Pointers", "https://cs-education.github.io/sysassets/mp4/0070-CharacterPointers.mp4"],
  ["Mini Video: Program Arguments", "https://cs-education.github.io/sysassets/mp4/0080-ProgramArguments.mp4"],
  ["Mini Video: Environment", "https://cs-education.github.io/sysassets/mp4/0090-Environment.mp4"],
  ["Mini Video: Char Array Searching", "https://cs-education.github.io/sysassets/mp4/0100-CharArraySearching.mp4"],
  ["Mini Video: Pointers To Automatic Variables", "https://cs-education.github.io/sysassets/mp4/0110-PointersToAutomaticVariables-v2.mp4"],
  ["Mini Video: Time For Mallocing Heap Memory", "https://cs-education.github.io/sysassets/mp4/0120-TimeForMallocingHeapMemory.mp4"],
  ["Mini Video: HeapGotchas -Dangling Pointers And Double Free", "https://cs-education.github.io/sysassets/mp4/0130-HeapGotchas-DanglingPointersAndDoubleFree.mp4"],
  ["Mini Video: Struct Typedef LinkedList", "https://cs-education.github.io/sysassets/mp4/0140-StructTypedefLinkedList.mp4"],
  ["Mini Video: Creating Links Strdup", "https://cs-education.github.io/sysassets/mp4/0150-CreatingLinksStrdup.mp4"],
  ["Mini Video: Get Put Char", "https://cs-education.github.io/sysassets/mp4/0160-getputchar-gets-puts-v2.mp4"],
  ["Mini Video: Scanf Intro", "https://cs-education.github.io/sysassets/mp4/0170-scanf-intro.mp4"],
  ["Mini Video: Getline", "https://cs-education.github.io/sysassets/mp4/0180-getline.mp4"],
  ["Mini Video: SIGINT SIGALRM", "https://cs-education.github.io/sysassets/mp4/0190-SIGINT-SIGALRM.mp4"],
  ["Mini Video: Fork Waitpid Forkbomb", "https://cs-education.github.io/sysassets/mp4/0200-forkwaitpid-forkbomb.mp4"],
  // Lecture 0
  ["Full Lecture Video 0 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part0.webm"],
  ["Full Lecture Video 0 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part1.webm"],
  ["Full Lecture Video 0 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part2.webm"],
  ["Full Lecture Video 0 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part3.webm"],
  ["Full Lecture Video 0 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part4.webm"],
  ["Full Lecture Video 0 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part5.webm"],
  ["Full Lecture Video 0 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part6.webm"],
  // Lecture 1
  ["Full Lecture Video 1 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part0.mp3"],
  ["Full Lecture Video 1 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part1.mp3"],
  ["Full Lecture Video 1 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part2.mp3"],
  ["Full Lecture Video 1 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part3.mp3"],
  ["Full Lecture Video 1 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part4.mp3"],
  ["Full Lecture Video 1 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part5.mp3"],
  ["Full Lecture Video 1 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part6.mp3"],
  // Lecture 2
  ["Full Lecture Video 2 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part0.mp3"],
  ["Full Lecture Video 2 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part1.mp3"],
  ["Full Lecture Video 2 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part2.mp3"],
  ["Full Lecture Video 2 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part3.mp3"],
  ["Full Lecture Video 2 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part4.mp3"],
  ["Full Lecture Video 2 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part5.mp3"],
  ["Full Lecture Video 2 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part6.mp3"],
  // Lecture 3
  ["Full Lecture Video 3 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part0.mp3"],
  ["Full Lecture Video 3 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part1.mp3"],
  ["Full Lecture Video 3 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part2.mp3"],
  ["Full Lecture Video 3 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part3.mp3"],
  ["Full Lecture Video 3 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part4.mp3"],
  ["Full Lecture Video 3 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part5.mp3"],
  ["Full Lecture Video 3 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part6.mp3"],
  // Lecture 4
  ["Full Lecture Video 4 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part0.mp3"],
  ["Full Lecture Video 4 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part1.mp3"],
  ["Full Lecture Video 4 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part2.mp3"],
  ["Full Lecture Video 4 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part3.mp3"],
  ["Full Lecture Video 4 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part4.mp3"],
  ["Full Lecture Video 4 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part5.mp3"],
  ["Full Lecture Video 4 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part6.mp3"],

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