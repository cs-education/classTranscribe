/*
  Begin Global Variables
*/

  // Data structure that holds transcriptions. Looks something like the following
  // [ {start: "0:00", end: "0:10", text:"Conditional variables are cool"}, ... ]
  var transcriptions = [];

  // Video anchor used to define when the current transcription segment started
  var anchor = "0:00";

  // Metrics object
  var metrics = {};

  // Global reference to the wavesurfer
  var globalSurfer;

  // Video state
  var videoPlaying = false;

  // Surfer state
  var surferPlaying = false;

  // Completely state
  var completelyRef;

  // Start time global reference
  var startTime;

/*
  End Global Variables
*/

window.onbeforeunload = function() {
  if ($(".submit").text() !== "Transcription Submitted!") {
    return 'Are you sure you want to leave without submitting your transcription?';
  }
};

$(document).ready(function () {
  setVideoFromUrl();
  begin();
  initializeMetricsBaseInformation();
});

/*
  Sets the correct video from url parameters
*/
function setVideoFromUrl() {
  var stackURL = document.URL.split("/");
  if (stackURL.indexOf("upload") > -1) {
    var template = '<option class="video-option" value="0">Upload Video</option>';
    $(".video-selector").empty().append(template);
    var videoURL = document.URL.split("=")[1];
    var audioURL = videoURL.replace("webm", "mp3");
    VIDEOS = [["Uploaded Video", videoURL.replace(".webm",""), audioURL]];
  } else if (stackURL.length === 6) {
    var videoIndex = parseInt(stackURL[4]);
    $(".video-selector option").eq(videoIndex).attr('selected', true);
  }
}

/*
  Gets basic metrics information
*/
function initializeMetricsBaseInformation() {
  var stackURL = document.URL.split("/");
  if (stackURL.length === 6) {
    var user = stackURL.pop();
    metrics["name"] = user;
  }
}

/*
  Started once the DOM finishes loading
*/
function begin() {
  var videoIndex = parseInt($(".video-selector").val(), 10);

  initializeUI();
  initializeCompletely();
  loadVideo(videoIndex);
  bindEventListeners();
  bindVideoEvents();

  $(".transcription-input-main").focus();
}

/*
  Initialize the UI to default states
*/
function initializeUI() {
  $(".waveform-loading").removeClass("hidden");
  $(".submit").click(function () {
    var stackURL = document.URL.split("/");
    if (stackURL.indexOf("upload") > -1) {
      // Save transcriptions to local storage
      localStorage.setItem("transcriptions", save());
      // Redirect to second pass
      window.onbeforeunload = null;
      window.location = document.URL.replace("first", "second");
    } else {
      var $that = $(this);
      $that.text("Submitting Transcription...");
      $.ajax({
        type: "POST",
        url: "/first",
        data: {
          stats: stats(),
          transcriptions: save()
        },
        success: function (data) {
          $that.text("Transcription Submitted!");
          $that.addClass("unclickable");
        }
      });
    }
  });
}

/*
  Initialize completely auto complete plugin
*/
function initializeCompletely() {
  var input = document.getElementById('completely-input-container');

  $(input).empty();

  completelyRef = completely(input);

  completelyRef.onChange = function (text) {
    completelyRef.startFrom = text.lastIndexOf(' ')+1;
    completelyRef.repaint();
  };
  completelyRef.options = ["going","actually","something","variable","different","processes","character","function","remember","critical","variables","standard","structure","condition","finished","continue","programs","anything","pointers","question","operating","solution","questions","characters","malloc()","contents","arguments","multiple","counting","pointing","directory","discover","progress","programming","information","allocate","beginning","immediately","possible","descriptor","semaphore","happened","particular","process","neighbor","increment","whatever","probably","program","environment","everything","hardware","initialize","fantastic","implement","functions","alright","compiler","eventually","location","exclusion","original","unlocked","printing","argument","pointer","complicated","children","currently","completely","correctly","directly","allocated","sleeping","efficient","following","automatic","everybody","thinking","semaphores","structures","background","ampersand","finishes","creating","fragmentation","problem","[something]","interrupt","printf()","expression","algorithm","instructions","lifetime","terminal","complete","followed","pthread_create","integers","hopefully","important","problems","solutions","meditating","arbitrary","bathroom","examples","allocations","additional","secondly","includes","somewhere","constant","constants","exciting","previous","changing","basically","returned","underscore","executing","allocation","sem_wait","interrupts","asterisk","sem_wait()","practice","non-zero","negative","shouldn't","decrement","checking","dereference","initialized","straight","pthread_join","declared","resource","allocator","question]","understand","afterwards","messages","[silence]","happens","slightly","language","powerful","initially","certainly","capacity","meditate","addresses","wonderful","pthread_mutex_lock","security","overflow","otherwise","represent","definition","[student","commands","wouldn't","waitpid()","difference","unsigned","remaining","underneath","normally","resources","identifier","descriptors","infinite","pthread_exit","together","assembly","incremented","performance","segfault","getlast()","would've","deadlock","interesting","essentially","accidentally","incredibly","peterson's","behavior","destination","returning","surprising","programmer","wednesday","signature","peterson","carefully","preprocessor","pseudocode","outputtxt","sigalarm","starting","possibly","potential","knowledge","compiled","synchronization","dangerous","impossible","sixteenth","efficiently","compiles","couldn't","separate","suddenly","automatically","incrementing","designed","published","parameters","available","correct","nevermind","strlen()","debugging","disappear","interview","mistakes","threads","overhead","compiling","broadcast","sem_post","accident","included","software","etcetera","overwritten","surprise","truncate","could've","unfortunately","sometimes","signal()","happening","register","programmers","instruction","process'","parameter","#include","exchange","terminate","touching","keyboard","required","architecture","pthread_join()","fortunately","presumably","reader-writer","occasionally","therefore","generate","segmentation","especially","beforehand","properties","pushdata","advanced","challenge","represents","nothing","explicitly","parenthesis","candidate","necessary","evaluate","handout","kilobyte","assert()","statement","ourselves","calculation","exclusive","buffering","example","contiguous","cond_wait","provided","differences","terminated","declaration","equivalent","existing","dekker's","versions","primitives","definitions","calculating","temporary","implementation","volunteer","guarantee","accessing","updating","overwrite","reasonable","readable","pthread_exit()","platform","meanwhile","scheduler","requests","provides","semester","connected","physical","medium-sized","specification","incorrect","malloc'd","converted","reference","typically","sections","environmental","explicit","everyone","somebody","particularly","zombies","recursive","ultimate","corresponds","milliseconds","countgold","everywhere","starters","scattered","purposes","sigaction()","internally","running","situation","communicate","assumption","exception","portable","reminder","lecture","assignment","thousand","machines","scheduling","excluding","semicolon","standards","fairness","asterisks","valuable","competition","successfully","execution","placement","strategies","created","expected","advantages","disadvantages","continued","attacking","conditions","confident","currenttime","relatively","potentially","students","/usr/include","should've","attributes","pthread_cancel","attention","cancelled","attempts","providing","anywhere","continuing","executes","mathematical","recognize","principle","representation","unlocking","secretly","pthread_mutex","formatting","demonstration","discovered","dreadlocks","asynchronously","waiting","undefined","considered","locations","introduce","allocating","identified","interviews","sem_post()","extremely","defensive","proposed","streams","similarly","dangling","unistdh","standoff","specifiers","typedef","minecraft","exercise","address","stdlibh","subtract","internal","meditative","bervandes","intended","expensive","programc","unlock()","identifiers","cond_signal","operation","hexadecimal","understanding","backwards","conditional","deliberately","including","implicit","reserved","wexitstatus","relevant","supplied","parallel","operator","simplest","terminating","brackets","introduction","classically","long-running","request","manipulate","morning","directories","cleaning","computation","addition","terrible","independently","homework","complaining","collecting","fprintf()","positive","stopped","sigaction","production","entries","currenttime()","defining","agentsmith","delivered","superuser","yourself","handlers","annoying","typedefs","commonly","developed","interface","fprintf","continues","idiomatic","disappears","libraries","diferent","non-null","section","finishing","simulation","experiment","illinois","recently","thumbnails","exported","mistake","commented","system's","temporarily","fundamentally","duplicate","continually","implementing","attempting","doppleganger","disappeared","convention","interfaces","malfunctioning","preserve","decisions","themselves","memory's","nothankyou","fragmented","backslash","redirect","sequence","manipulating","lectures","processor","carefree","machine","obviously","coalesce","outputtext","arbitrarily","asserth","assumptions","determine","reused'","pointer'","concerned","numbers","realloc","warnings","management","fundamental","believe","promised","started","password","anymore","incomplete","pthreads","appropriate","pthread_t","implicitly","executed","o_creat","appending","boyfriend","girlfriend","previously","disarray","forever","forty-two","please_stop","(waiting)","memories","arithmetic","_killer_monsters_take_over_the_world","immediate","kitchens","precisely","suggested","permission","complain","sizeof()","patterns","claiming","nanoseconds","mentioned","beautiful","necessarily","limitsh","pthread_mutex_t","pthread_mutex_lock()","forgotten","pthread_mutex_init","conceptually","stepping","analysis","confusing","absolutely","unnecessary","specified","personally","correspond","simplify","whenever","released","promises","climbing","material","thursday","properly","readline","audience","suspended","animation","[laughter]","permissions","counters","forwards","corruption","multi-threaded","generator","addressable","sufficient","literature","direction","shifting","throughout","articles","duplicating","student)","linkedlist","littered","algorithms","spotting","concurrency","signaling","practices","succeeded","usr/include","/usr/include/","implemented","exchanges","cellphone","great","generally","guaranteed","compilers","wisconsin","associated","depending","[students","alternative","meditation","assembler","experience","internet","conference","/program","gentlemen","prepared","recursion","perror()","waitpid","allowing","readers","assuming","displayed","speaking","derailing","accurate","non-negative","relative","modifications","beggining","horrendous","anyways","december","smallest","executable","while(p)","consider","tempting","(application","nutshell","describe","interface)","discussing]","captain's","vocabulary","redirected","significant","encourage","expectation","astericks","cesspool","occasion","technique","expectations","represented","brilliant","calculatingok","invented","entirely","presented","limitations","delegating","write()","inherits","parents","welcome","zerowhat","anybody'","snprintf","stdout_fileno","excludes","lowercase","stderrfileno","interacting","/usr/include/stdlibh","bothering","onevalue","onenext","gravestone","postmortem","<stdlibh>","overloading","doppelganger","physicist","re-parented","change()","parlance","initiate","reparented","hesitate","webserver","wheeeeee","tutorials","scenario","reserving","publishing","two-fold","installed","learning","weekend","reserves","enrolled","midterm","allocates","recommended","zombie's","distinction","outlives","parent","'malloc'","directives","superbowl","congratulations","correct)","believes","remembers","everything)","asymmetric","accidently","chemistry","navigate","parent's","string","reparent","significantly","buffers","declares","callling","closing","buffers'","consuming","perforance","wanted","somewhat","involved","hierarchal","everybodys","dokie","anybodys","introductory","syntactically","executing'","differnt","prepended","attitude","someones","lefthand","well-behaved","callback","responsible","malloc's","(*sighandler_t)(int)","sighandler","disorganized","unpacking","(between","parenthesis)","free(ptr1)","while(1)","unallocated","free(ptr2)","strlen(mesg)","sigchild","notified","variable)","link_create","single-file","components","char_bits","citizens","explanation","lectures'","delivers","programmatically","registers","duplicates","destroying","seriously","extended","finished'","processing'","identifer","characters)","seconds","seconds'","thanks()","thanks","destroyed","discussed","minutes","anyone's","cluttered","evalutated","meaningless","terminates","if-expression","definedwhoops","envelope)","following:","strings","sizeof(char)","football","address)","someting","append()","tomorrow's","termination","subversion","proccesses'","duplication","training","searches","unbreak","plugging","engineer","tenacity","stubborn","hexdecimal","noticing","create","breaking","executeand","sophistication","andlib","universe","artibrary","produced","transcoding","ancestry","futures","histories","importantly","working","registering","wifsignaled","wsigterm","-termsig","unencrypt","sophisticated","'segfault","program'","argv[0]","generates","controller","behaving","assemlby","satemetns","possibilites","12345678","/usr/bin","command","requiring","vulnerable","filetxt","modified","application","read/write","poitners","everytime","opposite","conclude","abcdabcdabcd","identify","specific","/bin/ls","sulking","entrance","tenacious","execvp()","strcpy()","buffer[len]","replacing","buffer[len","overflowed","processes'","replaced","readonly","suggestion:","<gibberish>","committees","formalize","thirteenth","stormunds","utilites","describes","abstraction","features","insulation","undeclared","protection","universes","dfiferent","unreadable","processs","bufferings","tomorrow","computing","allocation;","buffered","41424344","recurse","stack","'delete'","'typically'","optimizations","optimize","new/delete","c-library","reinforce","knapsack","malloc()s","non-trivial","computationally","*picture","problems*","indicate","assembled","memory","book-keeping","please","exclamation","malloc(2","small","systematic","corrupted","stackwhere's","watermark","threshold)","re-using","passengers","unoccupied","inefficient","suitable","watching","there'll","neighbor's","shuffling","invalid","sfprintf","intermediate","pointer)","mechanism","fragmentation's","assemble","manually","setvbuff","assignments","unitstdh","earliest","segment","contrary","wherever","sufficiently","searching","happened:","*nothing","discussion","choices","scrappy-doo","mechanics","close()","comparisons","nanosecond","descriptor)","longer-running","identical","interpret","attacked","nibbling","question's","realistic","immdiately","kilobytes","difficult","challenges","disjoint","someone's","coalescing","sayfork","inefficiently","'oooooh","buffer","correctly'","nineteen","wheeeee","program:","wanted'","sneakier","(pointers)","activation","presenting","arithmatic","subtracting","overwrites","programmed","whati","supposed","running)","elements","multiply","answered","inspiration","canaries","barrier","hexidecimal","deadbeef","deadcode","endpoints","override","virtualized","connection","mapping","7fffffff","truncated","contained","official","drive]","recreate","intercept","conjuring","procrastinating","effectively","beginnings","definitely","minority","introduced","function;","shorter)","it's","registered","username","threaded","crashes","quicksand","processes's","occurance","[stack]","wikibook","[another","supposing","possibility","framework","angrave","recorded","hundred","fuctionality","routine","arguement","0xdeadcode","o'clock","looking","celebrating","maintain","yesterday","announce","advances","sandbox","position","undersore","expanded","_gnu_source","additions","therelet's","activity","<stdioh>","runtime","discovering","bitcoins","currency","cs241coins","intensive","crashing","wondering","arguments)","(please_stop)","variablethere","remembered","pthread_id","(grumbling)","constantly","assertion","development","favorite","includeasserth","thread's","exitvalue","for-loop","funciton","playing","duration","employed","commment","scheduled","popcorn","absolute","shouldnt","kidding","interested","results","[background","bountiful","interpretter","langauge","tremendous","countgold()","informationâ all","technically","milliion","million","maintenance","gorillas","filestream","competing","mistake:","cirtical","inconsistent","reperesnet","consistent","sentinal","fortuitous","one-seven","objective","mallocing","outburst","afterwords","twiddiling","retrieve","architectures","bloodstream","variables:","pthread_mutex_unlock()","magnitute","[laughs]","appeared","magnitude","arrrrrayyy","bounjour","attribrutes","pthread_mutex_initializer","unwanted","serialize","similariliy","(bonjour)","program's","magically","w-o-r-l-d","eventaully","conflict","unlikley","non-numbers","variacle","parallelism","updateding","confidently","ecetera","mutable","goodhair","proceeds","soemthing","<stringh> let's","sherlock","spinning","parallesism","spawning","malloc-ing","pthread_mutex_destroy()","instead","analaogy","unlocked'","obliterated","facebook","primatives","safeguards","nostalgia","politely","'hello'","reiterate","primitive","'world:-)'","constrictive","opportunity","responsibility","embedded","converting","downside","seventeen","conscious","'alright","whitespace","decrementing","integer'","[nothing]","dependant","pressing","priority","non-surgeon","priorities","controls","semphore","versatile","entering","interrupted","mainframes","processing","generating","computational","structure's","retrieved","sempahores","sem_init()","carrying","handler","structrues","-pthread","according","refusing","protecting","printf's","floating","connections","critically","historic","configure","abstract","filename","historically","aggressive","menacing","uhhhhhhh","description","persuade","specifies","deadlocked","considering","generalizing","satisfied","think","desirable","overwriting","technical","thread","associative","modifying","specifically","strictly","concrete","enumerate","sometime","challenged","assistant","professor","specifics","fascinating","booleans","analyzing","preferences","getpid()","wooohooo","millisecond","[something","instance","reviewed","conferences","journals","relationship","(student:","in-class","exam/quiz","transcendental","requirements","threads)","respects","seperate","processors","test&set","secondssince1970","atomically","guerilla","fashion","minimums","microphone","completes","officially","beginners","number okay","sleep","scrumple","signal","almost-exact","communication","pattern","supported","doubling","spurious","purchase","decision","deferred","standing","desperately","arrived","perhaps","sequences","documentation","generalize","morning's","propogated","volunteers","completed","silently","bothered","workstation","initialization","uninvite","applause","milliamps","milliamperes","pthread's","[clapping]","because","conpletely","becoming","otherwords","wahahaha","me-di-tate","peaceful","delete()","python's","moment's","comments","amazingly","occurred","afternoon","pthread_cond","administrator","pthread_cond_wait","writing","everyone's","pthread_cond_signal","reasoning","apparently","confused","companies","noteworthy","educational","technologies","improvements","projects","subtitles","captions","crowdsourcing","nontrivial","perfectly","elevator","statistical","generators","schedule","wohahahahaha","wohaahaha","indentical","wohahahah","continuously","pthread_condition_wait","meditates","chillax","vulnerability","pthread_condition_signal","shouting","pthread_condition_broadcast","comparison","paradigm","performant","fourteen","pthread_cond_t","pthread_cond_init","asymmetry","database","surgeons","internship","producer","consumer","producer-consumer","p_threads","p_thread","version","insufficient","midnight","inspired","reading","read/written","endeavor","writers","greaters","weprobably","pthread_cond_broadcast","invariant","p_cond_signal","attempt","decremented","bounded","free(null)","succeeds","multithreaded","accesses","boundary","strongly","scanning","contains","calloc()","california","representing","speaking","coursera","partners","miracle"];
}

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".video-selector").off().change(begin);
  $(".playback-selector").off().change(changePlaybackSpeed);
  $(".transcription-input-main").off().keypress(inputKeypress);
}

/*
  Binds event listeners on the video
*/
function bindVideoEvents() {
  var video = $(".main-video").get(0);

  var lastUpdate = 0;
  video.ontimeupdate = function () {
    var globalSurferTime = globalSurfer.getCurrentTime();
    var videoCurrentTime = video.currentTime;
    if (Math.abs(globalSurferTime - videoCurrentTime) > 0.1) {
      globalSurfer.skip(videoCurrentTime - globalSurferTime);
    }

    if (videoPlaying && !surferPlaying) {
      globalSurfer.play();
    }

    if (Math.abs(lastUpdate - videoCurrentTime) > 9 || lastUpdate > videoCurrentTime) {
      var scrollLeft = videoCurrentTime * 64;
      $(".waveform-container").animate({scrollLeft: scrollLeft}, 500);
      lastUpdate = videoCurrentTime;
    }
  };

  video.onended = function(e) {
    calculateTotalTime();
  };

  video.addEventListener("loadedmetadata", function () {
    changePlaybackSpeed();
    loadWaveform(function () {
      video.onplay = function () {
        videoPlaying = true;
        globalSurfer.play();
      };
      video.onpause = function () {
        videoPlaying = false;
        globalSurfer.pause();
      };
    });
  });
}

/*
  Changes the playback speed
*/
function changePlaybackSpeed() {
  var playbackRate = parseFloat($(".playback-selector").val());
  $(".main-video").get(0).playbackRate = playbackRate;
  if (globalSurfer) {
    globalSurfer.setPlaybackRate(playbackRate);
  }
  $(".transcription-input").focus();
}

/*
  Captures the input keypresses and reacts accordingly
*/
function inputKeypress(e) {
  // $(".transcription-input-main").scrollLeft(0);
  if (e.which === 13) {
    solidifyTranscription(e);
  } else if (e.which === 96) {
    e.preventDefault();
    incrementMetricCount("rewindTwoSeconds");
    rewindTwoSeconds();
  } else if (e.which === 126) {
    e.preventDefault();
    incrementMetricCount("toggleVideo");
    toggleVideo();
  }

  if (!startTime) {
    startTime = new Date();
  }

  $(".transcription-input-main").blur(function () {
    $(".transcription-input").eq(0).val("");
  });
}

/*
  Rewind the video 5 seconds
*/
function rewindTwoSeconds() {
  var video = $(".main-video").get(0);
  video.currentTime = video.currentTime - 2;
}

/*
  Changes the video play/pause
*/
function toggleVideo() {
  var video = $(".main-video").get(0);
  if (video.paused === false) {
      video.pause();
  } else {
      video.play();
  }
}

/*
  Detects enter key and solidifies transcription in the event of an enter key
*/
function solidifyTranscription(e) {
  var transcriptionSegmentText = $(".transcription-input-main").val();
  var currentTime = getCurrentTime();

  var transcriptionSegment = {
    start: anchor,
    end: currentTime,
    text: transcriptionSegmentText
  };

  transcriptionSegmentText.split(/\s+/g).forEach(function (word) {
    if (word.length > 7) { completelyRef.addToOptionsHash(word); }
  });

  transcriptions.push(transcriptionSegment);

  anchor = currentTime;

  var transcriptionSegmentTemplate = $('<div class="transcription-segment"></div>');
  transcriptionSegmentTemplate.text(transcriptionSegment.start + " - " + transcriptionSegment.end + " : " + transcriptionSegment.text);

  $(".transcription-container").prepend(transcriptionSegmentTemplate);
  $(".transcription-input-main").val("");
}

/*
  Returns the current time nicely formatted
*/
function getCurrentTime() {
  var currentTime = $(".main-video").get(0).currentTime;

  var currentTimeInMinutes = Math.floor(currentTime / 60);
  var currentTimeInSeconds = Math.floor(currentTime % 60);

  if (currentTimeInSeconds < 10) {
    return currentTimeInMinutes + ":0" + currentTimeInSeconds;
  }
  return currentTimeInMinutes + ":" + currentTimeInSeconds;
}

/*
  Load the waveform for a certain video
*/
function loadWaveform(cb) {
  var videoIndex = parseInt($(".video-selector").val(), 10);
  var wavesurfer = Object.create(WaveSurfer);
  var videoSrc = VIDEOS[videoIndex][2] || VIDEOS[videoIndex][1];
  var video = $(".main-video").get(0);

  surferPlaying = false;

  $("#waveform").empty();
  $(".waveform-outer").css("width", (video.duration * 64) + "px");

  var options = {
    container     : document.querySelector('#waveform'),
    waveColor     : '#5195CE',
    progressColor : '#005DB3',
    loaderColor   : '#005DB3',
    cursorColor   : 'silver',
    pixelRatio    : 1,
    minPxPerSec   : 5,
    height        : 25,
    audioRate     : parseFloat($(".playback-selector").val()),
    normalize     : true,
  };
  wavesurfer.init(options);
  wavesurfer.setVolume(0);
  wavesurfer.load(videoSrc);

  wavesurfer.on('ready', function () {
    wavesurfer.skip(video.currentTime);
    var scrollLeft = video.currentTime * 64 - 200;
    $(".transcription-track, .final-transcription-track, .waveform-container").animate({scrollLeft: scrollLeft}, 500);
    $(".waveform-loading").addClass("hidden");
    disableMacBack($("canvas").toArray());
    $("canvas").mousewheel(function(e) {
      var deltaX = e.originalEvent.wheelDeltaX * -1;
      var deltaY = e.originalEvent.wheelDeltaY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        $(".waveform-container").get(0).scrollLeft -= (deltaY);
        e.preventDefault();
      }
    });
  });

  wavesurfer.on('play', function () {
    surferPlaying = true;
  });

  wavesurfer.on('pause', function () {
    surferPlaying = false;
  });

  wavesurfer.drawer.on('click', function (e, position) {
    var previousTime = wavesurfer.getCurrentTime();
    var wavesurferTime = position * video.duration;
    video.currentTime = wavesurferTime;
    $(".transcription-input-main").focus();
    incrementMetricCount("videoSeek", {time: wavesurferTime - previousTime});
  });

  globalSurfer = wavesurfer;
  cb();
}

/*
  Converts transcriptions to caption format
*/
function transcriptionsToCaptions(transcriptions) {
  return transcriptions.map(function (transcription) {
    var startTime = timeStringToNum(transcription.start);
    var endTime = timeStringToNum(transcription.end);
    var width = Math.max(endTime - startTime, 1) * 64;
    return {
      text: transcription.text,
      width: width
    };
  });
}

/*
  Converts a time string to a time integer
*/
function timeStringToNum(timeString) {
  var minutes = parseInt(timeString.split(":")[0], 10);
  var seconds = parseInt(timeString.split(":")[1], 10);
  return 60 * minutes + seconds;
}

/*
  Converts a time string to a time integer
*/
function incrementMetricCount(name, data) {
  metrics[name] = (metrics[name] || {});
  metrics[name].count = (metrics[name].count || 0) + 1;
  if (data) {
    metrics[name].data = (metrics[name].data || []).concat(data);
  }
}

/*
  Calculate total trancsription time
*/
function calculateTotalTime() {
  if (!metrics["totalTime"] && startTime) {
    metrics["totalTime"] = (new Date()).getTime() - startTime.getTime();
  }
}

/*
  Save the transcriptions
*/
function save() {
  var captions = transcriptionsToCaptions(transcriptions);
  console.log(JSON.stringify(captions));
  return JSON.stringify(captions);
}

/*
  Save the metrics
*/
function stats() {
  var videoIndex = parseInt($(".video-selector").val(), 10);
  metrics["video"] = VIDEOS[videoIndex][0];
  calculateTotalTime();
  console.log(JSON.stringify(metrics));
  return JSON.stringify(metrics);
}
