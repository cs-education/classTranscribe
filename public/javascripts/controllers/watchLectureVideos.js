
var url = window.location.pathname;
var courseOfferingId = url.substring(url.lastIndexOf('/') + 1);
var getPlaylistUrl = '/getPlaylist/' + courseOfferingId;
var getSrtUrl = '/getSrts/' + courseOfferingId;
var player;
function navigateToVideo(startTime, video) {
    var videoId = player.playlist.indexOf(video);
    player.playlist.currentItem(videoId);
    player.currentTime(startTime);
    console.log(startTime + " + " + video + " + " + videoId);
}

(async () => {
    var playlist = await $.when($.getJSON(getPlaylistUrl))
    console.log(playlist);
    player = videojs('video');
    // player.src()
    player.playlist(playlist);
    // Initialize the playlist-ui plugin with no option (i.e. the defaults).
    player.playlistUi({
        nextButton: true
    });

    var data = await $.when($.getJSON(getSrtUrl))
    var allSubs = data;
    var idx = getLunrObj(data);

    $('#search').on('keyup', function () {
        // Get query
        var query = $(this).val();
        results = idx.search(query);
        filteredSubs = []
        results.forEach(function (result) {
            index = parseInt(result.ref);
            filteredSubs.push(allSubs[index]);
        });
        var queryObj = jslinq(filteredSubs);
        var res = queryObj.select(function (item) { return item; }).take(3).toList();

        // Output it
        var resultdiv = $('#search_results');
        if (res.length === 0) {
            // Hide results
            resultdiv.hide();
        } else {
            // Show results
            resultdiv.empty();
            for (var item in res) {
                var searchitem = '<li>' + res[item].part + '<a href="#" onclick=navigateToVideo(' + res[item].start + ",'" + res[item].video + "')>navigate</a></li>";                
                resultdiv.append(searchitem);
            }
            resultdiv.show();
        }
    });    
})();


