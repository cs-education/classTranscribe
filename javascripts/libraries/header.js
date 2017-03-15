
//<!-- Piwik -->
//<script type="text/javascript">
  var _paq = _paq || [];
  // tracker methods like "setCustomDimension" should be called before "trackPageView"

  _paq.push(['enableHeartBeatTimer', '2']);
/*
  _paq.push(['trackEvent', 'Video Play', 'Play']);
  _paq.push(['trackEvent', 'Video Duration', 'Duration']);
  _paq.push(['trackEvent', 'Video Pause', 'Pause']);
*/

//   _paq.push(['trackAllContentImpressions']);
   _paq.push(['trackPageView']);
//   alert( _paq.push(['enableLinkTracking']));

  (function() {

	/* Change this to the Piwik server*/
     var u="//192.17.96.13:7002/";

 //   _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', '1']);


   _paq.push(['setTrackerUrl', u+'piwik.php']);

    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
//</script>
//<!-- End Piwik Code -->

