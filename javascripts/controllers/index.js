/*
  Begin Global Variables
*/

  // Data structure that holds transcriptions. Looks something like the following
  // [ {start: "0:00", end: "0:10", text:"Conditional variables are cool"}, ... ]
  var transcriptions = [];

  // Video anchor used to define when the current transcription segment started
  var anchor = "0:00";

  // Global reference to the wavesurfer
  var globalSurfer;

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
  var videoIndex = parseInt($(".video-selector").val(), 10);

  initializeUI();
  loadVideo(videoIndex);
  bindEventListeners();
  bindVideoEvents();
  changePlaybackSpeed();
}

/*
  Initialize the UI to default states
*/
function initializeUI() {
  $(".waveform-loading").removeClass("hidden");
  $(".transcription-input").focus();
}

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".video-selector").off().change(begin);
  $(".playback-selector").off().change(changePlaybackSpeed);
  $(".transcription-input").off().keypress(inputKeypress);
}

/*
  Binds event listeners on the video
*/
function bindVideoEvents() {
  var video = $(".main-video").get(0);

  var lastUpdate = 0;
  video.ontimeupdate = function () {
    globalSurfer.skip(video.currentTime - globalSurfer.getCurrentTime());

    if (Math.abs(lastUpdate - video.currentTime) > 9) {
      var scrollLeft = video.currentTime * 64;
      $(".waveform-container").animate({scrollLeft: scrollLeft}, 500);
      lastUpdate = video.currentTime;
    }
  };

  video.addEventListener("loadedmetadata", function () {
    loadWaveform(function () {
      video.onplay = function () {
        globalSurfer.play();
      }
      video.onpause = function () {
        globalSurfer.pause();
      }
    });
  });
}

/*
  Changes the playback speed
*/
function changePlaybackSpeed() {
  var playbackRate = parseFloat($(".playback-selector").val());
  $(".main-video").get(0).playbackRate = playbackRate;
  loadWaveform($.noop);
}

/*
  Captures the input keypresses and reacts accordingly
*/
function inputKeypress(e) {
  if (e.which === 13) {
    solidifyTranscription(e);
  } else if (e.which === 96) {
    e.preventDefault();
    rewindTwoSeconds();
  } else if (e.which === 126) {
    e.preventDefault();
    toggleVideo();
  }
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
  if (video.paused == false) {
      video.pause();
  } else {
      video.play();
  }
}

/*
  Detects enter key and solidifies transcription in the event of an enter key
*/
function solidifyTranscription(e) {
  var transcriptionSegmentText = $(".transcription-input").val();
  var currentTime = getCurrentTime();

  var transcriptionSegment = {
    start: anchor,
    end: currentTime,
    text: transcriptionSegmentText
  };

  transcriptions.push(transcriptionSegment);

  anchor = currentTime;

  var transcriptionSegmentTemplate = $('<div class="transcription-segment"></div>');
  transcriptionSegmentTemplate.text(transcriptionSegment.start + " - " + transcriptionSegment.end + " : " + transcriptionSegment.text);

  $(".transcription-container").prepend(transcriptionSegmentTemplate);
  $(".transcription-input").val("");
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
  var videoSrc = VIDEOS[videoIndex][1];
  var video = $(".main-video").get(0);

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
    wavesurfer.skip(video.currentTime)
    var scrollLeft = video.currentTime * 64 - 200;
    $(".transcription-track, .final-transcription-track, .waveform-container").animate({scrollLeft: scrollLeft}, 500);
    $(".waveform-loading").addClass("hidden");
  });

  var previousTime = 0;
  wavesurfer.on('seek', function () {
    var wavesurferTime = wavesurfer.getCurrentTime();
    if (Math.abs(previousTime - wavesurferTime) > 2) {
      video.currentTime = wavesurferTime;
      $(".transcription-input").focus();
    }
    previousTime = wavesurferTime;
  })

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
    }
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
  Save the transcriptions
*/
function save() {
  var captions = transcriptionsToCaptions(transcriptions);
  console.log(JSON.stringify(captions));
}