$(document).ready(function () {
  begin();
});

/*
  Started once the DOM finishes loading
*/
function begin() {
  var videoIndex = parseInt($(".video-selector").val(), 10);

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
  Load the captions for a certain video
*/
function loadCaptions(videoIndex) {
  var captions = videoCaptions[videoIndex];

  $(".caption-track-final-caption").remove();
  captions.forEach(function (caption) {
    var template = '<div class="caption-track-final-caption" draggable="true" contentEditable="true" style="width:' + caption.width + 'px"></div>';
    $(".final-caption-track").append(template);
    $(".caption-track-final-caption").last().text(caption.text);
  });

  $(".caption-track-final-caption").dblclick(function () {
    var offsetLeft = $(this).offset().left;
    var barOffsetLeft = $(".final-caption-red-bar").offset().left;
    $(this).width(barOffsetLeft - offsetLeft);
  })

  $(".final-caption-track").off().scroll(function() {
    updateTimeLine($(this).scrollLeft());
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
  Save the transcriptions
*/
function save() {
  var finalCaptions = [];
  $(".caption-track-final-caption").each(function (i, el) {
    finalCaptions.push({
      text: $(el).text(),
      width: $(el).width()
    })
  })
  console.log(JSON.stringify(finalCaptions));
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