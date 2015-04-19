/*
  Begin Global Variables
*/
  // Time that current segment started
  var lastTime = -1;
  // Length of current segment
  var segmentLength = 0;
/*
  End Global Variables
*/

$(document).ready(function () {
  setVideoFromUrl();
  begin();
});

/*
  Asynchronously Load Scripts
*/
var loadedScripts = Object.create(null);
function asyncLoadScript(src, cb)
{
  if (loadedScripts[src]) {
    cb();
  } else {
    var s;
    var r;
    var t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function() {
      if (!r && (!this.readyState || this.readyState == 'complete'))
      {
        r = true;
        loadedScripts[src] = true;
        cb();
      }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  }
}

/*
  Started once the DOM finishes loading
*/
function begin() {
  var videoIndex = parseInt($(".video-selector").val(), 10);

  loadVideo(videoIndex);
  loadStartTime();
  asyncLoadScript("/javascripts/data/captions.js", function () {
    loadCaptions(videoIndex);
  });
  bindEventListeners();
  changePlaybackSpeed();
}

/*
  Sets the correct video from url parameters
*/
function setVideoFromUrl() {
  var videoIndex = getParameterByName("videoIndex");
  if (videoIndex) {
    $(".video-selector option").eq(videoIndex).attr('selected', true);
  }
}

/*
  Gets a URL parameter by name
*/
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/*
  Load video start time from url parameters
*/
function loadStartTime() {
  var startTime = getParameterByName("startTime");
  var video = $(".main-video").get(0);
  video.addEventListener("loadedmetadata", function () {
    video.currentTime = startTime;
    var windowLocation = window.location.toString();
    var base_url = windowLocation.substring(0, windowLocation.indexOf("?"));
    window.history.replaceState({}, document.title, base_url);
    video.play();
  });
}

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".video-selector").off().change(begin);
  $(".playback-selector").off().change(changePlaybackSpeed);
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
    var template = '<div class="caption" data-time="' + captionTime + '">' + caption.text.toLowerCase() + '</div>';
    $(".transcription-viewer-container").append(template);
  });

  $(".caption").click(function () {
    var video = $(".main-video").get(0);
    var startingTime = findSegmentTime($(this));
    $(this).data("startingTime", startingTime);
    video.currentTime = startingTime;
    updateHighlightedCaption($(this));
  });

  var currentSegment = findCurrentSegment(0);
  updateHighlightedCaption(currentSegment);
}

/*
  Update the highlighted caption given the current time
*/
function updateHighlightedCaption(currentSegment) {
  scrollToSegment(currentSegment);
  $(".selected-caption").removeClass("selected-caption");
  currentSegment.addClass("selected-caption");
  lastTime = parseFloat(currentSegment.data("startingTime"));
  segmentLength = parseFloat(currentSegment.data("time"));
}

/*
  Interval to refresh highlighted caption
*/
setInterval(function () {
  var currentTime = $(".main-video").get(0).currentTime;

  if (currentTime > (lastTime + segmentLength) || currentTime < lastTime) {
    var currentSegment = findCurrentSegment(currentTime);
    updateHighlightedCaption(currentSegment);
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
    if (timeAccumulator > time) {
      break;
    }

    currentSegment = $(".caption").eq(i);
    currentSegment.data("startingTime", timeAccumulator);
    timeAccumulator += parseFloat(currentSegment.data("time")) + (2/64); // 2/64 accounts for border...
  }
  return currentSegment;
}

/*
  Find the time that the segment starts
*/
function findSegmentTime(segment) {
  var numCaptions = $(".caption").length;
  var timeAccumulator = 0;

  var currentSegment = $(".caption").first();
  for (var i = 0; i < numCaptions; i++) {
    currentSegment = $(".caption").eq(i);
    if (segment.is(currentSegment)) {
      break;
    }
    timeAccumulator += parseFloat(currentSegment.data("time")) + (2/64); // 2/64 accounts for border...
  }
  return timeAccumulator;
}

/*
  Scrolls to a specific segment given the segment object
*/
function scrollToSegment(segment) {
  var viewerContainer = $('.transcription-viewer-container');
  viewerContainer.animate({
      scrollTop: viewerContainer.scrollTop() - viewerContainer.offset().top + segment.offset().top - 100
  }, 500);
}