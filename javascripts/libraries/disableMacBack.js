function disableMacBack(whitelist) {
  whitelist = whitelist || [];
  (function ( $ ) {
    $(window).on('mousewheel', function(e) {
      var deltaX = e.originalEvent.wheelDeltaX * -1;
      var deltaY = e.originalEvent.wheelDeltaY;
      var x = Math.abs(deltaX);
      var y = Math.abs(deltaY);

      if (whitelist.indexOf(e.target) === -1) {
        var el = $(document.body);
        if (deltaY < 0) {
          el.scrollTop(el.scrollTop() - deltaY);
        } else {
          if (el.scrollTop() > 0) {
            el.scrollTop(el.scrollTop() - deltaY);
          }
        }
        e.preventDefault();
      }
    });
  }( jQuery ));
}