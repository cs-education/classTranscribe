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
  
  addPiwikTracking();
  loadVideo(videoIndex);
  loadStartTime();
  loadCaptions(videoIndex);
  bindEventListeners();
  changePlaybackSpeed();
}

function addPiwikTracking() {
  var video = $('.main-video');
  var videoFolder = "classtranscribes3/";

/* == TODO ==
    Does not consider if the page is not in focus
    Better parameters?
        category, action, [name], [value]
    Other functions we can track? (i.e. video.on(X, ...)
*/

/*
    'trackEvent', [location (video name)], [action], [time], [extra parameter]
*/

  video.on('play', function () {
    var time = video[0].currentTime;
    var source = $('.main-video-source')[0].src;

    //Finds substring of video file
    var index = source.indexOf(videoFolder) + videoFolder.length;
   
    //Removes the file extension
    var endIndex = source.indexOf(".mp4");
    var source = source.substring(index, endIndex);
    _paq.push(['trackEvent', source, 'Play', time]);
  });

  video.on('pause', function() {
    var time = video[0].currentTime;
    var source = $('.main-video-source')[0].src;
    var index = source.indexOf(videoFolder) + videoFolder.length;
    var endIndex = source.indexOf(".mp4");
    var source = source.substring(index, endIndex)
    _paq.push(['trackEvent', source, 'Pause', time]);    
    });

    video.on('ratechange', function() {
        var time = video[0].currentTime;
        var rate = video[0].playbackRate;
        var source = $('.main-video-source')[0].src;
        var index = source.indexOf(videoFolder) + videoFolder.length;
        var endIndex = source.indexOf(".mp4");
        var source = source.substring(index, endIndex);
        _paq.push(['trackEvent', source, 'Rate change', time, rate]);
    });

/*
    When dragging the volume around, it records ALL values in between, not just the stopping points.
    
    video.on('volumechange', function() {
        var time = video[0].currentTime;
        var loc = video.context.location;
        var volume = video[0].volume;
        console.log(volume);
        if (volume) {
        _paq.push(['trackEvent', loc.pathname + loc.search, 'Volume change', time, volume]);
        }
    });

*/
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
  var video = $(".main-video").get(0);
  if (video) {
    var currentTime = video.currentTime;

    if (currentTime > (lastTime + segmentLength) || currentTime < lastTime) {
      var currentSegment = findCurrentSegment(currentTime);
      updateHighlightedCaption(currentSegment);
     }
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
//  console.log("view" + viewerContainer.offset().top);
// console.log("segment" + segment.offset().top);

  var value = viewerContainer.scrollTop();
  if (viewerContainer.offset()) {
      value -= viewerContainer.offset().top;
  }
  if (segment.offset()) {
      value += segment.offset().top;
  }
  value -= 100;
  viewerContainer.animate({
      scrollTop:value
  }, 500);
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
    if(!successful) {
      window.alert('Please copy the following link: ' + url)
    }
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  $(".copy-text-area").hide();

  setTimeout(function(){ 
    $(".share-video-button").text(originalText);
  }, 1000);

 
}


function waitSeconds(iMilliSeconds) {
    var counter= 0
        , start = new Date().getTime()
        , end = 0;
    while (counter < iMilliSeconds) {
        end = new Date().getTime();
        counter = end - start;
    }
}

