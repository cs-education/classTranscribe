/**$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/getCaptions",
    data: {
      className: className,
    },
    success: function (data) {
      var videoCaptions = data;
    }
  });
});**/

/**if (typeof module !== 'undefined') {
  module.exports = videoCaptions;
}**/