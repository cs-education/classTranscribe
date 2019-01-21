
var url = window.location.pathname;
var courseOfferingId = url.substring(url.lastIndexOf('/') + 1);
var getPlaylistUrl = '/getPlaylist/' + courseOfferingId;
var getSrtUrl = '/getSrts/' + courseOfferingId;
var player;
var jslinqData;
var currentVideoTranscriptions;
var timeUpdateLastEnd = 0;
var fullCourseSearch = false;
var autoScroll = true;
var live_transcriptions_div = $('#live_transcriptions');

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function navigateToVideo(video, startTime) {
    console.log(startTime, video);
    if (typeof startTime === 'string') {
        if (startTime.indexOf('#') > -1) {
            startTime = parseInt(startTime.substring(0, startTime.indexOf('#')))
        } else {
            startTime = parseInt(startTime);
        }        
    }
    updateCurrentVideoTranscriptions(player.currentSrc());
    $('#search').val('');
    var videoId = player.playlist.indexOf(video);
    player.playlist.currentItem(videoId);
    player.play();
    player.currentTime(Math.floor(startTime / 1000));
}

function msToTime(s) {

    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

function updateCurrentVideoTranscriptions(video) {
    currentVideoTranscriptions = jslinqData.where(function (item) {
        // filter out results to currentVideo
        return video === item.video;
    });
    var currentList = currentVideoTranscriptions.toList();
    // Output it
    if (currentList.length === 0) {
        // Hide results
        live_transcriptions_div.hide();
    } else {
        // Show results
        console.log("Total Transcriptions for video: " + currentList.length);
        live_transcriptions_div.children().css('display', 'none');
        for (var item in currentList) {
            var listItemId = currentList[item].id;
            $("#" + (listItemId)).css('display', 'initial');
        }
    }
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
        if (successful) {
            alert("Copied link to Clipboard!");
        }        
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    console.log(window.location.href);
    console.log(window.location.hostname);
    console.log(window.location.href);
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
        alert("Copied link to Clipboard!");
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function generateShareLink(video, startTime) {
    var shareLink = "https://" + window.location.hostname + "/watchLectureVideos/" + courseOfferingId + "?video=" + video + "&startTime=" + startTime;
    copyTextToClipboard(shareLink);
}

function addAllTranscriptionsToList() {
    var currentList = jslinqData.toList();
    // Output it
    if (currentList.length === 0) {
        // Hide results
        live_transcriptions_div.hide();
    } else {
        // Show results
        live_transcriptions_div.empty();
        for (var item in currentList) {
            if (currentList[item].part === '') {
                continue;
            }
            var searchitem = "<div class='list-group-item transcription-item' style='display:none;' id='" + currentList[item].id + "'>" + msToTime(currentList[item].start) +
                "&emsp;" + "<a href='#' onclick=generateShareLink('" + currentList[item].video + "'," + currentList[item].start + ")> Share </a>" +
                "&emsp;" + "<a onclick=navigateToVideo('" +currentList[item].video + "'," + currentList[item].start + ") >" + currentList[item].part + "</a> </div>";
            live_transcriptions_div.append(searchitem);
        }
        live_transcriptions_div.show();
    }
}

function scrollToListItem(listItemId) {
    $("#live_transcriptions").children().removeClass('active');
    $("#" + (listItemId)).addClass('active');
    if (autoScroll) {
        $("#live_transcriptions").scrollTo("#" + (listItemId - 1));
    }
}

(async () => {
    var playlist = await $.when($.getJSON(getPlaylistUrl))
    videojs('video').ready(async function () {
        player = this;
        player.hotkeys({                          // press F to full screen
            volumeStep: 0.1,                      // increase and decrease the volume with Up and Down
            seekStep: 5,                          // seek forward and backwards 5s of video with Left and Right
            enableModifiersForNumbers: false
            // scrolling the mouse wheel to decrease or increase volumn
            // press M to mute
            // press number button to jump to the section piece of the video
        });

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
        addAllTranscriptionsToList();
        updateCurrentVideoTranscriptions(player.currentSrc());

        var queryParams = getUrlVars();
        if (queryParams.hasOwnProperty('video')) {
            if (queryParams.hasOwnProperty('startTime')) {
                navigateToVideo(queryParams['video'], queryParams['startTime']);
            } else {
                navigateToVideo(queryParams['video'], 0);
            }
        }
        

        function update_search_results() {
            // Get query
            var query = $("#search").val();
            results = idx.search(query);
            filteredSubs = []
            results.forEach(function (result) {
                index = parseInt(result.ref);
                filteredSubs.push(allSubs[index]);
            });
            var queryObj = jslinq(filteredSubs);
            var res;
            if (fullCourseSearch) {
                res = queryObj.toList();
            } else {
                res = queryObj.where(function (item) {
                    return item.video === player.currentSrc();
                }).toList();
            }
            console.log("Total Search Results" + res.length);
            if (res.length === 0) {
                // Hide results
                live_transcriptions_div.children().css('display', 'initial');
            } else {
                // Show results
                live_transcriptions_div.children().css('display', 'none');
                for (var item in res) {
                    var listItemId = res[item].id;
                    $("#" + (listItemId)).css('display', 'initial');
                }
            }
        }

        $('#search').on('keyup', update_search_results);


        $('#full_course_search').change(function () {
            if (this.checked) {
                fullCourseSearch = true;

            } else {
                fullCourseSearch = false;
            }
            update_search_results();
        });

        $('#auto_scroll').change(function () {
            if (this.checked) {
                autoScroll = true;

            } else {
                autoScroll = false;
            }
            update_search_results();
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
                var res = currentVideoTranscriptions.where(function (item) {
                    // find the appropriate subtitle
                    return (item.start <= currentTimeinMillis);
                }).orderByDescending(function (item) { return item.start; }).take(1).toList();

                for (var item in res) {
                    scrollToListItem(res[item].id);                 
                }
            }
        });
    });
})();


