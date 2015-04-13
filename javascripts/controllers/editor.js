// Global reference to the wavesurfer
var globalSurfer;

// Metrics object
var metrics = {};

// Video state
var videoPlaying = false;

// Surfer state
var surferPlaying = false;

// Start time global reference
var startTime;

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
  if (stackURL.length === 6) {
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
  loadVideo(videoIndex);
  loadCaptions(videoIndex);
  bindEventListeners();
  bindVideoEvents();
}

/*
  Initialize the UI to default states
*/
function initializeUI() {
  $(".waveform-loading").removeClass("hidden");
  $(".transcription-input").focus();
  $(".submit").click(function () {
    var $that = $(this);
    $that.text("Submitting Transcription...");
    $.ajax({
      type: "POST",
      url: "/second",
      data: {
        stats: stats(),
        transcriptions: save()
      },
      success: function (data) {
        $that.text("Transcription Submitted!");
        $that.addClass("unclickable");
      }
    });
  });
}

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".video-selector").off().change(begin);
  $(".playback-selector").off().change(changePlaybackSpeed);
  $(window).off().keypress(function (e) {
    if (e.which === 126) {
      e.preventDefault();
      incrementMetricCount("toggleVideo");
      toggleVideo();
    } else if (e.which === 96) {
      e.preventDefault();
      incrementMetricCount("rewindTwoSeconds");
      rewindTwoSeconds();
    }
  })
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
      globalSurfer.skip(video.currentTime - globalSurfer.getCurrentTime());
    }
    if (videoPlaying && !surferPlaying) {
      globalSurfer.play();
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
      }
      video.onpause = function () {
        videoPlaying = false;
        globalSurfer.pause();
      }
    });
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
  Changes the playback speed
*/
function changePlaybackSpeed() {
  var playbackRate = parseFloat($(".playback-selector").val());
  $(".main-video").get(0).playbackRate = playbackRate;
  loadWaveform($.noop);
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
  Load the captions for a certain video
*/
function loadCaptions(videoIndex) {
  var captions = videoCaptions[videoIndex];

  $(".caption-track-final-caption").remove();
  captions.forEach(function (caption) {
    var template = '<div class="caption-track-final-caption" draggable="true" contentEditable="true" style="width:' + caption.width + 'px"></div>';
    $(".final-caption-track").append(template);
    $(".caption-track-final-caption").last().text(caption.text).resizable({
        handles: 'e'
    });
  });

  $(".caption-track-final-caption").dblclick(function () {
    var offsetLeft = $(this).offset().left - $(this).parent().offset().left + $(this).parent().scrollLeft();
    var barOffsetLeft = (globalSurfer.getCurrentTime() / globalSurfer.getDuration()) * $(".waveform-outer").width()
    $(this).width(Math.abs(barOffsetLeft - offsetLeft));
    incrementMetricCount("editSegmentLengthDoubleClick", barOffsetLeft - offsetLeft);
  });

  $(".caption-track-final-caption").click(function () {
    incrementMetricCount("editSegmentText");
  });

  var video = $(".main-video").get(0);
  $(".caption-track-final-caption").on("resize", function () {
    var offsetLeft = $(this).offset().left + $(this).width() - $(this).parent().offset().left + $(this).parent().scrollLeft();
    $(".final-caption-black-bar").css('left', offsetLeft + "px");

    video.currentTime = ((offsetLeft + 1) / $(".waveform-outer").width()) * globalSurfer.getDuration();
  });

  var startWidth;
  $(".caption-track-final-caption").on("resizestart, mousedown", function () {
    startWidth = $(this).width();
    $(".final-caption-black-bar").show();
  });

  $(".caption-track-final-caption").on("resizestop, mouseup", function () {
    $(".final-caption-black-bar").hide();
    var endWidth = $(this).width() - startWidth;
    incrementMetricCount("editSegmentLengthDrag", endWidth);
  });

  $(".final-caption-track, .waveform-container").off().scroll(function (e) {
    $(".final-caption-track").scrollLeft($(this).scrollLeft());
    $(".waveform-container").scrollLeft($(this).scrollLeft());
    updateTimeLine($(this).scrollLeft());
    if( $(".final-caption-track").scrollLeft() + $(".final-caption-track").width() + 252 >= $(".waveform-container").scrollLeft() + $(".waveform-container").width()) {
      $(".final-caption-track").scrollLeft($(".waveform-container").scrollLeft());
    }
  });

  $(".final-caption-track, .waveform-container").mousewheel(function(event, delta) {
    $(".final-caption-track").get(0).scrollLeft -= (delta * 20);
    $(".waveform-container").get(0).scrollLeft -= (delta * 20);
    event.preventDefault();
  });
}

/*
  Converts a time integer to a time string
*/
function timeNumToString(timeNum) {
  var timeNumInMinutes = Math.floor(timeNum / 60);
  var timeNumInSeconds = Math.floor(timeNum % 60);

  if (timeNumInSeconds < 10) {
    return timeNumInMinutes + ":0" + timeNumInSeconds;
  }
  return timeNumInMinutes + ":" + timeNumInSeconds;
}

/*
  Update the timeline
*/
var currentStartTime = 0;
function updateTimeLine(scroll) {
  if (currentStartTime + 64 > 64 * scroll || currentStartTime - 64 < 64 * scroll) {
    currentStartTime = 64 * scroll;
    $(".timestamp").each(function (i) {
      var time = timeNumToString(Math.round(scroll / 64) + i);
      $(this).text(time);
    });
  }
}

/*
  Load the waveform for a certain video
*/
function loadWaveform(cb) {
  var videoIndex = parseInt($(".video-selector").val(), 10);
  var wavesurfer = Object.create(WaveSurfer);
  var videoSrc = VIDEOS[videoIndex][2] || VIDEOS[videoIndex][1];
  var video = $(".main-video").get(0);

  $("#waveform").empty();

  var captionTrackWidth = (video.duration * 64) + ($(".caption-track-final-caption").length * (2/64));
  $(".waveform-outer").css("width", captionTrackWidth + "px");

  var options = {
    container     : document.querySelector('#waveform'),
    waveColor     : '#5195CE',
    progressColor : '#005DB3',
    loaderColor   : '#005DB3',
    cursorColor   : 'silver',
    pixelRatio    : 1,
    minPxPerSec   : 5,
    height        : 100,
    audioRate     : parseFloat($(".playback-selector").val()),
    normalize     : true,
  };
  wavesurfer.init(options);
  wavesurfer.setVolume(0);
  wavesurfer.load(videoSrc);

  wavesurfer.on('ready', function () {
    wavesurfer.skip(video.currentTime)
    var scrollLeft = video.currentTime * 64 - 200;
    $(".final-caption-track, .waveform-container").animate({scrollLeft: scrollLeft}, 500);
    $(".waveform-loading").addClass("hidden");
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

    // var currentSegment = findCurrentSegment(wavesurferTime);
    // var previousSegment = currentSegment.prev(".caption-track-final-caption");
    // if (!previousSegment.length) previousSegment = currentSegment;
    // var offsetLeft = previousSegment.offset().left - previousSegment.parent().offset().left + previousSegment.parent().scrollLeft();
    // var barOffsetLeft = (wavesurferTime / globalSurfer.getDuration()) * $(".waveform-outer").width()
    // previousSegment.width(Math.abs(barOffsetLeft - offsetLeft) - 1);

    $(".transcription-input").focus();
    incrementMetricCount("videoSeek", {time: wavesurferTime - previousTime});
  });

  globalSurfer = wavesurfer;
  cb();
}

/*
  Find the current segment given a video time
*/
function findCurrentSegment(time) {
  var numCaptions = $(".caption-track-final-caption").length;
  var timeAccumulator = 0;

  var currentSegment = $(".caption-track-final-caption").first();
  for (var i = 0; i < numCaptions; i++) {
    if (timeAccumulator > time) {
      break;
    }

    currentSegment = $(".caption-track-final-caption").eq(i);
    currentSegment.data("startingTime", timeAccumulator);
    timeAccumulator += parseFloat(currentSegment.width() / 64) + (2/64); // 2/64 accounts for border...
  }
  return currentSegment;
}

/*
  Returns the total width of the transcription
*/
function totalTranscriptionWidth() {
  var totalWidth = 0;
  $(".caption-track-final-caption").each(function(i) {
    totalWidth += parseInt($(this).width(), 10) + (2/64);
  });
  return totalWidth;
}


/*
  Converts a time string to a time integer
*/
function incrementMetricCount(name, data) {
  if (!startTime) {
    startTime = new Date();
  }

  metrics[name] = (metrics[name] || {})
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
  var finalCaptions = [];
  $(".caption-track-final-caption").each(function (i, el) {
    finalCaptions.push({
      text: $(el).text(),
      width: $(el).width()
    });
  });
  console.log(JSON.stringify(finalCaptions));
  return JSON.stringify(finalCaptions);
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

/*
  Interval to update the red bar
*/
var lastTime = -1;
setInterval(function () {
  var currentTime = $(".main-video").get(0).currentTime;

  if (currentTime != lastTime) {
    $(".final-caption-red-bar").css('left', currentTime * 64 + "px");
    lastTime = currentTime;
  }
}, 100);