// Video sources
var VIDEOS = [
  // ["video title", "video source"]
  ["Video: Hello World", "http://angrave.github.io/sysassets/mp4/0010-HelloWorld-v2.mp4"],
  ["Video: Hello Std Err", "http://angrave.github.io/sysassets/mp4/0020-HelloStdErr-24fps600kbs.mp4"],
  ["Video: Open and Create a file", "http://angrave.github.io/sysassets/mp4/0030-OpenCreateAFile-650kb.mp4"],
  ["Video: Open Errors and Printf", "http://angrave.github.io/sysassets/mp4/0040-OpenErrorsPrintf-600kbs.mp4"],
  ["Video: Not All Bytes Are 8Bits", "http://angrave.github.io/sysassets/mp4/0050-NotAllBytesAre8Bits.mp4"],
  ["Video: Follow The Int Pointer", "http://angrave.github.io/sysassets/mp4/0060-FollowTheIntPointer.mp4"],
  ["Video: Character Pointers", "http://angrave.github.io/sysassets/mp4/0070-CharacterPointers.mp4"],
  ["Video: Program Arguments", "http://angrave.github.io/sysassets/mp4/0080-ProgramArguments.mp4"],
  ["Video: Environment", "http://angrave.github.io/sysassets/mp4/0090-Environment.mp4"],
  ["Video: Char Array Searching", "http://angrave.github.io/sysassets/mp4/0100-CharArraySearching.mp4"],
  ["Video: Pointers To Automatic Variables", "http://angrave.github.io/sysassets/mp4/0110-PointersToAutomaticVariables-v2.mp4"],
  ["Video: Time For Mallocing Heap Memory", "http://angrave.github.io/sysassets/mp4/0120-TimeForMallocingHeapMemory.mp4"],
  ["Video: HeapGotchas -Dangling Pointers And Double Free", "http://angrave.github.io/sysassets/mp4/0130-HeapGotchas-DanglingPointersAndDoubleFree.mp4"],
  ["Video: Struct Typedef LinkedList", "http://angrave.github.io/sysassets/mp4/0140-StructTypedefLinkedList.mp4"],
  ["Video: Creating Links Strdup", "http://angrave.github.io/sysassets/mp4/0150-CreatingLinksStrdup.mp4"],
  ["Video: Get Put Char", "http://angrave.github.io/sysassets/mp4/0160-getputchar-gets-puts-v2.mp4"],
  ["Video: Scanf Intro", "http://angrave.github.io/sysassets/mp4/0170-scanf-intro.mp4"],
  ["Video: Getline", "http://angrave.github.io/sysassets/mp4/0180-getline.mp4"],
  ["Video: SIGINT SIGALRM", "http://angrave.github.io/sysassets/mp4/0190-SIGINT-SIGALRM.mp4"],
  ["Video: Fork Waitpid Forkbomb", "http://angrave.github.io/sysassets/mp4/0200-forkwaitpid-forkbomb.mp4"],
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