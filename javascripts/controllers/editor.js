$(document).ready(function () {
  begin();
});

/*
  Started once the DOM finishes loading
*/
function begin() {
  var videoIndex = parseInt($(".video-selector").val(), 10);

  loadVideo(videoIndex);
  loadTranscriptions(videoIndex);
  bindEventListeners();
  changePlaybackSpeed();
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
      toggleVideo();
    } else if (e.which === 96) {
      e.preventDefault();
      rewindTwoSeconds();
    }
  })
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
  Load the first pass of transcriptions for a certain video
*/
function loadTranscriptions(videoIndex) {
  var transcriptions = videoTranscriptions[videoIndex];

  $(".transcription-track").remove();
  transcriptions.forEach(function (transcription, i) {
    var template = '<div class="transcription-track transcription-track-track-' + i + '"></div>';
    $(".editor-container").prepend(template);
  });

  transcriptions.forEach(function (transcription, i) {
    transcription.forEach(function (segment) {
      var width = (timeStringToNum(segment.end) - timeStringToNum(segment.start)) * 64;
      width = Math.max(width, 64);
      var template = '<div class="transcription-track-transcription" style="width:' + width + 'px">' + segment.text + '</div>';
      $(".transcription-track-track-" + i).append(template);
    });
  })

  $(".transcription-track, .final-transcription-track").off().scroll(function() {
    $(".transcription-track").scrollLeft($(this).scrollLeft());
    $(".final-transcription-track").scrollLeft($(this).scrollLeft());
    updateTimeLine($(this).scrollLeft());
  });

  $(".final-transcription-track-spacer").width(totalTranscriptionWidth() + 200); // Extra padding

  $(".transcription-track-transcription").off().click(function () {
    var template = '<div class="transcription-track-final-transcription" draggable="true" contentEditable="true">' + $(this).text() + '</div>';
    $(".final-transcription-track").append(template);
    $( ".transcription-track-final-transcription" ).dblclick(function () {
      $(this).remove();
    })
    // $( ".transcription-track-final-transcription" ).draggable({ axis: "x" }); // Figure out later
  });

  $(".final-transcription-track").mousemove(function (e) {
    if ($(e.target).hasClass('final-transcription-track')) {
      var scrollLeft = $(this).scrollLeft();
      $(".final-transcription-black-bar").css('left', (e.offsetX + scrollLeft) + "px");
    }
  });

  $(".final-transcription-track").click(function (e){
    if ($(e.target).hasClass('final-transcription-track')) {
      var otherWidths = 0;
      $(".transcription-track-final-transcription").slice(0, -1).each(function (i, el) {
        otherWidths += $(el).outerWidth(); // for border
      });
      var scrollLeft = $(".final-transcription-track").scrollLeft();
      $(".transcription-track-final-transcription").last().width(e.offsetX + scrollLeft - otherWidths - 2);
    }
  });
}

/*
  Returns the total width of the transcription
*/
function totalTranscriptionWidth() {
  var totalWidth = 0;
  $(".transcription-track-track-0 .transcription-track-transcription").each(function(i) {
    totalWidth += parseInt($(this).width(), 10);
  });
  return totalWidth;
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
  Save the transcriptions
*/
function save() {
  var finalTranscriptions = [];
  $(".transcription-track-final-transcription").each(function (i, el) {
    finalTranscriptions.push({
      text: $(el).text(),
      width: $(el).width()
    })
  })
  console.log(JSON.stringify(finalTranscriptions));
}

/*
  Interval to update the red bar
*/
var lastTime = -1;
setInterval(function () {
  var currentTime = $(".main-video").get(0).currentTime;

  if (currentTime != lastTime) {
    $(".final-transcription-red-bar").css('left', currentTime * 64 + "px");
    lastTime = currentTime;
  }
}, 100);