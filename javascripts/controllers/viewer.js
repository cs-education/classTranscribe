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
  Started once the DOM finishes loading
*/
function begin() {
  var videoIndex = parseInt($(".video-selector").val(), 10);

  loadVideo(videoIndex);
  loadStartTime();
  loadCaptions(videoIndex);
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
  var video = $(".main-video").off("loadedmetadata").get(0);

  $(".main-video").on("loadedmetadata", function () {
    video.currentTime = startTime;
    var windowLocation = window.location.toString();
    var base_url = windowLocation.substring(0, windowLocation.indexOf("?"));
    // window.history.replaceState({}, document.title, base_url);
    video.play();
  });
}

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".video-selector").off().change(begin);
  $(".playback-selector").off().change(changePlaybackSpeed);
  $(".share-video-button").click(shareVideo);
  $(".copy-text-button").click(copyVideoURL);
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
  $.ajax({
    type: "GET",
    url: "/captions/" + className + "/" + i,
    success: function (data) {
      var captions = data.captions;
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
  });
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

/*
  Copies a url to clipboard to share the video at a specified time
*/
// function shareVideo(event) {
//   var video = $(".main-video")[0];
//   var currentTime = Math.round(video.currentTime)
//   var baseUrl = window.location.href;
//   url = baseUrl.slice(0, baseUrl.lastIndexOf("=") + 1) + currentTime;

//   $(".copy-text-area").text(url);
//   $(".copy-text-area").show();
//   $(".copy-text-button").show();
// }

// function copyVideoURL(event) {
//   var copyTextarea = document.querySelector('.copy-text-area');
//   copyTextarea.select();
//   try {
//     var successful = document.execCommand('copy');
//     var msg = successful ? 'successful' : 'unsuccessful';
//     console.log('Copying text command was ' + msg);
//   } catch (err) {
//     console.log('Oops, unable to copy');
//   }

//   $(".copy-text-area").hide();
//   $(".copy-text-button").hide();
// }

function waitSeconds(iMilliSeconds) {
    var counter= 0
        , start = new Date().getTime()
        , end = 0;
    while (counter < iMilliSeconds) {
        end = new Date().getTime();
        counter = end - start;
    }
}

function shareVideo(event) {
  var originalText = $(".share-video-button").text();
  var video = $(".main-video")[0];
  var currentTime = Math.round(video.currentTime)
  var baseUrl = window.location.href;
  if(baseUrl.indexOf('startTime') > 0) {
    url = baseUrl.slice(0, baseUrl.lastIndexOf("=") + 1) + currentTime;
  } else {
    url = baseUrl + '&startTime=' + currentTime
  }
  

  $(".copy-text-area").text(url);
  $(".copy-text-area").show();


  var copyTextarea = document.querySelector('.copy-text-area');
  copyTextarea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    $(".share-video-button").text("Successfully Copied");
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  $(".copy-text-area").hide();

  setTimeout(function(){ 
    $(".share-video-button").text(originalText);
  }, 1000);

 
}
