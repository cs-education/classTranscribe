
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
var idx;
var data;

function navigateToVideo(video, startTime) {
    console.log(startTime, video);
    if (typeof startTime === 'string') {
        if (startTime.indexOf('#') > -1) {
            startTime = parseInt(startTime.substring(0, startTime.indexOf('#')))
        } else {
            startTime = parseInt(startTime);
        }        
    }
    updateCurrentVideoTranscriptions();
    $('#search').val('');
    var videoId = player.playlist.indexOf(video);
    player.playlist.currentItem(videoId);
    player.currentTime(Math.floor(startTime / 1000));
    player.play();
}

function updateCurrentVideoTranscriptions() {
    var video = player.currentSrc();
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

function attachTranscriptionItemListeners() {
    $(".edit-button").click(function () {
        var id = this.id.substring(this.id.lastIndexOf('-') + 1);
        if ($("#text-view-" + id).css('display') === 'block') {
            $("#text-view-" + id).css('display', 'none');
            $("#text-edit-" + id).css('display', 'block');
        }
    });

    $(".cancel-edit").click(function () {
        var id = this.id.substring(this.id.lastIndexOf('-') + 1);
        if ($("#text-view-" + id).css('display') === 'none') {
            $("#text-view-" + id).css('display', 'block');
            $("#text-edit-" + id).css('display', 'none');
        }
    })

    $(".submit-edit").click(async function () {
        var id = this.id.substring(this.id.lastIndexOf('-') + 1);
        var editedText = $("#edit-box-" + id).val();
        var subFile = data[id].subFile;
        data[id].part = editedText;
        updateTranscriptionsData(data);
        updateCurrentVideoTranscriptions();
        var editedSubsJson = jslinqData.where(function (item) {
            return item.subFile === subFile;
        }).select(function (item) {
            return {
                start: item.start,
                end: item.end,
                part: item.part
            };
        }).toList();

        var result = await $.when($.post('/submitEdit', {
            sub: editedSubsJson,
            subFile: subFile
        }));
    });
}

function generateShareLink(video, startTime) {
    var shareLink = "https://" + window.location.hostname + "/watchLectureVideos/" + courseOfferingId + "?video=" + video + "&startTime=" + startTime;
    utils.copyTextToClipboard(shareLink);
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
            var searchitem = generateItemHTML(currentList[item].id, currentList[item].start, currentList[item].video, currentList[item].part);
            live_transcriptions_div.append(searchitem);
        }
        live_transcriptions_div.show();
    }
    attachTranscriptionItemListeners();
}

function generateItemHTML(id, start, video, part) {
    return "<div class='list-group-item transcription-item' style='display:none;' id='" + id + "'>" +
        "<div class= 'row'>" + 
        "<div class='col-sm-3'>" +
        utils.msToTime(start) + 
        "<a href='#' onclick=generateShareLink('" + video + "'," + start + ")> Share </a>" +
        "<div class='form-check form-check-inline'>" +
        "<input class='btn btn-outline-primary btn-sm edit-button' type='button' id='edit-button-" + id +"' value= 'Edit'>" +
        "</div>" +
        "</div>" +
        "<div class='col-sm-9 text-view' style = 'display:initial;' id='text-view-" + id +"'>" +
        "<a onclick=navigateToVideo('" + video + "'," + start + ") >" + part + "</a>" +
        "</div>" +
        "<div class='col-sm-9 text-edit' style = 'display:none;' id='text-edit-" + id +"'>" +
        "<div class= 'row'>" + 
        "<div class='col-sm-9'>" +
        "<input class='form-control input-sm edit-box' type='text' value='" + part + "' id='edit-box-" + id +"'>" +
        "</div>" +
        "<div class='col-sm-3'>" +
        "<button type='button' class='btn btn-outline-success btn-sm submit-edit' id='submit-edit-" + id +"'>Submit</button>" +
        "<button type='button' class='btn btn-outline-danger btn-sm cancel-edit' id='cancel-edit-" + id +"'>Cancel</button>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
}


function scrollToListItem(listItemId) {
    $("#live_transcriptions").children().removeClass('active');
    $("#" + (listItemId)).addClass('active');
    if (autoScroll) {
        $("#live_transcriptions").scrollTo("#" + (listItemId - 1));
    }
}

function updateTranscriptionsData(data) {
    idx = getLunrObj(data);
    jslinqData = jslinq(data);
    addAllTranscriptionsToList();
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

        data = await $.when($.getJSON(getSrtUrl));
        updateTranscriptionsData(data);
        updateCurrentVideoTranscriptions();

        var queryParams = utils.getUrlVars();
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
                filteredSubs.push(data[index]);
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
            updateCurrentVideoTranscriptions();
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
