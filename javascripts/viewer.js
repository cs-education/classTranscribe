/*
  Begin Global Variables
*/

  // Video sources
  var VIDEOS = [
    "http://angrave.github.io/sysassets/mp4/0010-HelloWorld-v2.mp4",
    "http://angrave.github.io/sysassets/mp4/0020-HelloStdErr-24fps600kbs.mp4",
    "http://angrave.github.io/sysassets/mp4/0030-OpenCreateAFile-650kb.mp4",
    "http://angrave.github.io/sysassets/mp4/0040-OpenErrorsPrintf-600kbs.mp4",
  ];

  // Data structure that holds captions for the videos
  var videoCaptions =[
    [{"text":"Okay welcome to systems programming","width":103.18181824684143},{"text":"so let's get started","width":83.18181824684143},{"text":"let's write our first c program","width":102.18181824684143},{"text":"that makes use of a system call","width":102.18181824684143},{"text":"i'll do an example and then I'll let you play as well","width":219.18181824684143},{"text":"so uh here's a little virtual machine","width":189.18181824684143},{"text":"i've got up and running","width":121.18181824684143},{"text":"and i can write a little c file here","width":238.18181824684143},{"text":"so what we're going to do is make use of a system call called write","width":204.18181824684143},{"text":"so let's try this","width":154.18181824684143},{"text":"say okay write","width":102.18181824684143},{"text":"and then i need to give it a file descriptor","width":173.18181824684143},{"text":"more about that in a moment","width":122.18181824684143},{"text":"a little message like hello","width":139.18181824684143},{"text":"and then the number of characters or bytes that i actually want to send here","width":295.18181824684143},{"text":"so h e l l o","width":179.18181824684143},{"text":"that's five bytes we want to send","width":205.18181824684143},{"text":"so let's try compiling this","width":203.18181824684143},{"text":"and once that's going we'll see that whoops","width":233.18181824684143},{"text":"we've got a little bit of a problem here","width":143.18181824684143},{"text":"that write was not declared before","width":247.18181824684143},{"text":"okay so the c compiler here is warning us that we're trying to call a function called write which hasn't yet been declared","width":513.1818182468414},{"text":"so we could declare it","width":109.18181824684143},{"text":"now i happen to know for example that the write signature looks a little something like this","width":255.18181824684143},{"text":"it's called write ","width":217.18181824684143},{"text":"it takes a file descriptor which is going to be an integer","width":185.18181824684143},{"text":"it takes a pointer to a character","width":183.18181824684143},{"text":"and it takes another integer which is the number of characters to write","width":221.18181824684143},{"text":"so it looks a little like that","width":137.18181824684143},{"text":"in fact it takes a void pointer which means point to it without any particular type","width":502.18181824684143},{"text":"so i could attempt to compile this for example","width":246.18181824684143},{"text":"to see if this works","width":185.18181824684143},{"text":"and oh ho ho","width":92.18181824684143},{"text":"if we look at the left hand side","width":102.18181824684143},{"text":"we can see we managed to compile a program called program here","width":202.18181824684143},{"text":"and when we ran it we got hello","width":102.18181824684143},{"text":"alright so let's do a little better then that though","width":220.18181824684143},{"text":"rather than me having to manually write the declaration in here","width":313.18181824684143},{"text":"these are already included inside an existing file which we get for free","width":326.18181824684143},{"text":"it's actually unistd.h","width":268.18181824684143},{"text":"okay so let's tell the preprocessor to read in the contents of the file","width":213.18181824684143},{"text":"go in and find a file named unistd.h","width":179.18181824684143},{"text":"and include all the text that is in that file","width":179.18181824684143},{"text":"okay so now when we run this","width":123.18181824684143},{"text":"we'll compile it and run it and great it prints out hello","width":255.18181824684143},{"text":"if i wanted to print out hello with a new line","width":154.18181824684143},{"text":"let's increment this to six","width":153.18181824684143},{"text":"and now i've got a program called Hello","width":166.18181824684143},{"text":"okay great and of course i could make my program print out hello world and do it on two different lines","width":678.1818182468414},{"text":"alright so uh that's my program working","width":248.18181824684143},{"text":"now it's time for you to play","width":195.18181824684143},{"text":"you play a create which uses a system call write","width":197.18181824684143},{"text":"to write a little message on the two lines","width":253.18181824684143},{"text":"see you in the next video after you've said hello to the world","width":413.18181824684143},{"text":"bye","width":0.18181824684143}],
    [{"text":"so let's talk more about that file descriptor","width":154},{"text":"I'm gonna make my program be a little bit more useful by printing out \"Hello World\" a few times","width":325},{"text":"For example, I have a variable 'count' here and a little for-loop","width":282},{"text":"Start with count equal to five, while count is greater than zero","width":358},{"text":"each time we loop we're going to decrement 'count'","width":205},{"text":"In C, there is no boolean type.","width":102},{"text":"instead, if I've got an integer value which is nonzero, that is treated as a true value","width":307},{"text":"So, I could actually write this more tersely just by saying \"hey, count!\"","width":461},{"text":"meaning is count a non-zero value","width":193},{"text":"and if you compare two things, you'll learn that with an int value of either 0 or 1 they are either the same or different","width":563},{"text":"so, we're going to print out \"hello world\" 5 times","width":255},{"text":"I want to show you just a little idea here that actually I've got two file descriptors.","width":325},{"text":"I've got two file descriptors which are valid when my program starts.","width":422},{"text":"And they're called 1 and 2.","width":103},{"text":"Why might it be useful to have two output streams?","width":236},{"text":"well, you can imagine we have a program that is calculating something","width":395},{"text":"for example it's thinking of something to say or it's going to write to a file","width":304},{"text":"but we may also want to display some error messages back to the user","width":238},{"text":"or we might want to print some progress information","width":153},{"text":"the first output stream identified by the number '1' is the standard output","width":410},{"text":"The second one is reserved for error messages.","width":399},{"text":"Let's, for example, use this. Instead of error messages, we'll put a little dot to see this","width":461},{"text":"We'll run this and we should (if we got everything correct) see \"Hello\" and...lib lib lib lib","width":717},{"text":"Now, why do we see \".lib\", because we said \"hey, I'm going to give you a pointer and I want you to use that pointer and take the next 6 bytes from it which is the next  six character","width":805},{"text":"So we just got whatever happened to be in memory after our dot. So, we only wanted to do the dot","width":646},{"text":"Change that and run it again","width":153},{"text":"And great, we've got Hello and dot Hello dot Hello","width":359},{"text":"So, right now, both the output and the standard error are going to different places","width":295},{"text":"we could actually change that over here in the console before we start the program","width":358},{"text":"Our terminal can actually control where the output goes","width":256},{"text":"So, for example, I might say, I want to take the standard output and put that into a file.","width":358},{"text":"So, \"output.txt\"","width":153},{"text":"So now, if I run this before the program starts, I'm going to redirect it's output into this new file","width":437},{"text":"Okay, so what we see on the console output is anything written to standard error","width":308},{"text":"The standard output is inside output.txt","width":196},{"text":"To prove it, let me have a look at that file.","width":256},{"text":"Let me cat that file","width":51},{"text":"So, output.txt","width":102},{"text":"And here it is! It says \"hello, hello, hello, hello\"","width":239},{"text":"Now, for all those writing 1 and 2 over here, perhaps we should actually have some constants","width":359},{"text":"which signify what those values actually mean","width":299},{"text":"We could say start define things to say have a constant here, I'll call it say \"STDOUT_FILENO 1\"","width":648},{"text":"And I'll say define STDERRFILENO 2","width":524},{"text":"Anytime you use hash define, you're talking to the preprocessor to say \"hey, in the future, parts of this file, if you come across this character sequence, then replace it (in this case) with either a 1 or a 2 depending on what it is\"","width":1063},{"text":"We can compile this, except I'm going to surprise you which is that these particular macros are already defined within unistd.h","width":733},{"text":"So, I don't need to define them here in my program.","width":210},{"text":"You see it's got a return value of zero. Which is a convention for being correct (no errors)","width":660},{"text":"But it's up to us. We could choose a different value, we could choose the value 42.","width":409},{"text":"And, I don't see an output value, but I can find out what the last exit value was of the last process","width":689},{"text":"Let me print out","width":103},{"text":"It happens to be inside special variables","width":256},{"text":"Hello terminal value of this dollar question mark.","width":416},{"text":"which means give me the exit value (or the exit status) of the last command run.","width":256},{"text":"So there's our forty-two.","width":153},{"text":"Okay so, we've covered quite a bit of ground. We've talked about how in C, any non-zero integer is considered \"true\"","width":804},{"text":"and zero is considered \"false\"","width":181},{"text":"And, we've talked about these two different output streams. Now it's your turn to play with this. After that, let's have a go at creating some new files directly from C","width":831},{"text":"by making system calls","width":247},{"text":"So, now it's your turn. Have fun playing! Bye.","width":273}],
    [{"text":"Welcome so let's start creating some files","width":249},{"text":"for that we can use the system call open()","width":251},{"text":"and for open we need to say whether we want to append to an existing file, create a brand new file, and we need to give it a filename","width":631},{"text":"For example, I might have a file name called \"output.txt\"","width":396},{"text":"so the open call takes 2 or 3 arguments. the second argument will be exactly what we want to do","width":605},{"text":"so in this case we want to say create a brand new file and truncate it back to 0 if it doesn't exist","width":469},{"text":"so, I want to truncate as well","width":185},{"text":"if we are creating a new file we better say who can read this file and who can write to this file and who can execute this file","width":533},{"text":"so we are going to have to say something about the mode flags ","width":297},{"text":"who is allowed to do what","width":186},{"text":"inally this call is going to give us back an integer, a file descriptor","width":301},{"text":"just like we've seen so far with file number 1 and file number 2","width":154},{"text":"so lets store that inside a litler variable","width":262},{"text":"ok, so now I better actually find out what the correct syntax is","width":374},{"text":"and the correct arguments are in order to create a file","width":258},{"text":"so lets go and look that up","width":153},{"text":"and that we'll find inside the manual","width":143},{"text":"And, if, for example, I type \"man open\" on a command line on a real linux machine. it doesn't quite work yet in my small virtual one. we didn't have enough memory to include all the manual pages yet","width":990},{"text":"but heres a linux manual page I found on the web for the open()","width":312},{"text":"and you'll see here's the function signature","width":253},{"text":"where we're going to pass in an integer for the flags and the mode type","width":256},{"text":"so, I'm going to look up now the flags I need to open and create a new file","width":581},{"text":"I don't want to do append()","width":154},{"text":"I want to use \"create\" and I want to truncate it as well","width":256},{"text":"let's include \"O_CREAT\" here. I'm going to say \"O_CREAT\" which is a constant and I'm going to bitwise OR it with the flag to say \"truncate\" so let's look that up as well","width":993},{"text":"","width":526},{"text":"alright and i want to say when i open it that i am going to open it for say reading and writing","width":514},{"text":"so let us grab that as well","width":120},{"text":"so that is the first thing","width":160},{"text":"now we need to do the mode","width":109},{"text":"Let's write this as a variable.","width":236},{"text":"and there is actually a typedef","width":192},{"text":"it is essentially an integer but it is wrapped up in this type here called mode","width":435},{"text":"mode_t","width":102},{"text":"we'll say that with our file we want to be fairly private and only the owner of the file can access it","width":563},{"text":"Let's go back up and find those flags, where are you? Here we go.","width":308},{"text":"We'll say that the user has read and write permission","width":340},{"text":"We'll copy the read one and we'll have write permission as well.","width":955},{"text":"But no one else in our linux machine will be allowed to read it nor write it.","width":372},{"text":"So that's the permissions we want","width":199},{"text":"What can we do with this?","width":224},{"text":"Let's write something out to this file.","width":371},{"text":"We will write a little message \"Great!\" and a newline","width":506},{"text":"so how many characters is that? I've got \"one, two, three, four, five, six, and a new line so that's seven characters\"","width":650},{"text":"then we'll close this file descriptor meaning we don't want to use this file descriptor anymore","width":402},{"text":"that will ensure as well that all of the bytes that we send to the file stream have been saved","width":687},{"text":"We're not doing any error checking right now, we're just trying to write the smallest possible program to create a file and send something to it","width":563},{"text":"let's run this and see what we get","width":264},{"text":"we'll run into an error which is: we haven't defined what this mode_t is","width":307},{"text":"what we forgot to do, was to do the includes","width":307},{"text":"the good news is that the man pages tell us which includes we need to put at the top of our program","width":533},{"text":"let's grab those and insert them in here","width":285},{"text":"i will just get the formatting correct","width":279},{"text":"and, run it again","width":187},{"text":"Our program ran and it's still printing \"Hello\" to standard out and dot to standard error","width":617},{"text":"but hopefully, it also secretly created another file","width":256},{"text":"let's have a look at that file","width":51},{"text":"I can do \"ls\" and see if anything exists starting with \"out\"","width":493},{"text":"we've got output.txt. great!","width":233},{"text":"let's look at the contents of that file","width":154},{"text":"and it says \"Great!\" Fantastic","width":102},{"text":"Now it's your turn to play: create a file and see if you can send some bytes to that file.","width":482},{"text":"You'll be using open(), write(), and close(). Bye.","width":169}],
  ];

  // Time that current segment started
  var lastTime = -1;
  // Length of current segment
  var segmentLength = 0;
/*
  End Global Variables
*/

$(document).ready(function () {
  begin();
});

/*
  Started once the DOM finishes loading
*/
function begin() {
  var videoIndex = parseInt($(".video-selector").val(), 10) - 1;

  loadVideo(videoIndex);
  loadCaptions(videoIndex);
  bindEventListeners();
  changePlaybackSpeed();
}

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".video-selector").off().change(begin);
  $(".playback-selector").off().change(changePlaybackSpeed);
}

/*
  Loads the selected video
*/
function loadVideo(videoIndex) {
  var videoSrc = VIDEOS[videoIndex];
  $(".main-video-source").attr("src", videoSrc);
  $(".main-video").get(0).load();
}

/*
  Changes the playback speed
*/
function changePlaybackSpeed() {
  var playbackRate = parseFloat($(".playback-selector").val());
  $(".main-video").get(0).playbackRate = playbackRate;
}

/*
  Load the captions for video at index i
*/
function loadCaptions(i) {
  $(".transcription-viewer-container").empty();
  var captions = videoCaptions[i];
  captions.forEach(function (caption) {
    var captionTime = (caption.width / 64).toFixed(2);
    var template = '<div class="caption" data-time="' + captionTime + '">' + caption.text.toLowerCase() + '</div>'
    $(".transcription-viewer-container").append(template);
  });
  updateHighlightedCaption(0);
}

/*
  Update the highlighted caption given the current time
*/
function updateHighlightedCaption(currentTime) {
  var currentSegment = findCurrentSegment(currentTime);
  $(".selected-caption").removeClass("selected-caption");
  currentSegment.addClass("selected-caption");
  lastTime = parseFloat(currentSegment.data("startingTime"));
  segmentLength = parseFloat(currentSegment.data("time"));
  scrollToSegment(currentSegment);
}

/*
  Interval to refresh highlighted caption
*/
setInterval(function () {
  var currentTime = $(".main-video").get(0).currentTime;
  currentTime = Math.floor(currentTime);

  if (currentTime > (lastTime + segmentLength) || currentTime < lastTime) {
    updateHighlightedCaption(currentTime);
  }
}, 50);

/*
  Find the current segment given a video time
*/
function findCurrentSegment(time) {
  var numCaptions = $(".caption").length;
  var timeAccumulator = 0;

  var currentSegment = $(".caption").first();
  for (var i = 0; i < numCaptions; i++) {
    console.log(timeAccumulator, time)
    if (timeAccumulator > time) {
      break;
    }

    currentSegment = $(".caption").eq(i);
    currentSegment.data("startingTime", timeAccumulator);
    timeAccumulator += parseFloat(currentSegment.data("time"));
  }
  return currentSegment;
}

/*
  Scrolls to a specific segment given the segment object
*/
function scrollToSegment(segment) {
  console.log(segment.offset().top)
  var viewerContainer = $('.transcription-viewer-container');
  console.log(viewerContainer.scrollTop() - viewerContainer.offset().top + segment.offset().top - 100)
  viewerContainer.animate({
      scrollTop: viewerContainer.scrollTop() - viewerContainer.offset().top + segment.offset().top - 100
  }, 1000);
}