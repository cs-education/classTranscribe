
var url = window.location.pathname;
var courseOfferingId = url.substring(url.lastIndexOf('/') + 1);
var getPlaylistUrl = '/getPlaylist/' + courseOfferingId;
var getSrtUrl = '/getSrts/' + courseOfferingId;
var player;
var jslinqData;
var currentVideoTranscriptions;
var timeUpdateLastEnd = 0;
function navigateToVideo(startTime, video) {
    var videoId = player.playlist.indexOf(video);
    player.playlist.currentItem(videoId);
    player.ready(function () {
        player.play();
        player.currentTime(startTime / 1000);
    });
}
function updateCurrentVideoTranscriptions(video) {
    currentVideoTranscriptions = jslinqData.where(function (item) {
        // filter out results to currentVideo
        return video === item.video;
    });
    var currentList = currentVideoTranscriptions.toList();
    // Output it
    var resultdiv = $('#live_transcriptions');
    if (currentList.length === 0) {
        // Hide results
        resultdiv.hide();
    } else {
        // Show results
        resultdiv.empty();
        for (var item in currentList) {
            var searchitem = '<button type="button" class="list-group-item" style="display:none;" onclick=navigateToVideo(' +
                currentList[item].start + ",'" + currentList[item].video + "') id=" + currentList[item].id + ">" + currentList[item].part + "</button>";
            resultdiv.append(searchitem);
        }
        resultdiv.show();
    }
}

(async () => {
    var playlist = await $.when($.getJSON(getPlaylistUrl))
    videojs('video').ready(async function () {
        player = this;
        // player.src()    
        player.playlist(playlist);
        // Initialize the playlist-ui plugin with no option (i.e. the defaults).
        player.playlistUi({
            nextButton: true
        });

        var data = await $.when($.getJSON(getSrtUrl))
        var allSubs = data;
        var idx = getLunrObj(data);
        jslinqData = jslinq(data);
        updateCurrentVideoTranscriptions(player.currentSrc());
        console.log(player.currentSrc());

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
                    var searchitem = '<button type="button" class="list-group-item" onclick=navigateToVideo(' +
                        res[item].start + ",'" + res[item].video + "') id=" + res[item].id + ">" + res[item].part + "</button>";
                    resultdiv.append(searchitem);
                }
                resultdiv.show();
            }
        });
        player.on('playlistitem', function () {
            updateCurrentVideoTranscriptions(player.currentSrc());
        });
        player.on('timeupdate', function () {
            var currentTimeinMillis = player.currentTime() * 1000;
            if (currentTimeinMillis > timeUpdateLastEnd) {
                var res = currentVideoTranscriptions.where(function (item) {
                    // find the appropriate subtitle
                    return (currentTimeinMillis >= item.start) && currentTimeinMillis <= item.end;
                }).toList();
                for (var item in res) {
                    timeUpdateLastEnd = res[item].end;
                    var listItemId = res[item].id;
                    $("#live_transcriptions").children().css("display", "none");
                    $("#" + (listItemId - 1)).removeClass('active');
                    $("#" + (listItemId)).addClass('active');
                    for (var i = listItemId-1; i < listItemId + 10; i++) {
                        $("#" + i).show();
                    }
                }
            }            
        });
    });
})();


