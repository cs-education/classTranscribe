/**
  * Gets the list of videos and their paths
  * VIDEOS becomes an array of arrays each with 2 elements in the form [video, path to video]
**/
$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/getVideos",
    data: {
      className: className,
    },
    success: function (data) {
      VIDEOS = data;
      $(".video-selector").append('<option class="video-option" value="0" disabled selected value> -- select a video -- </option>');
      VIDEOS.forEach(function (video, i) {
        if(i != 0) {
          var title = video[0];
          var src = video[1];
          var template = '<option class="video-option" value="' + i + '">' + title + '</option>';
          $(".video-selector").append(template);
        }
      });
    }
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