
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
var download_transcriptions_div = $('#dwnld-vtt-div')
var search_all_box = $('#full_course_search')
var idx;
var data;
var srctoTitle = {};
var dummy_transcriptions_count = 10; // Hardcode the numbers of dummy transcriptions to 10

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

// Update live_transcriptions_div with items in list
function updateLiveTranscriptionsDiv(list) {
    console.log("Total Transcriptions for video: " + list.length);

    live_transcriptions_div.children().css('display', 'none');
    // Show the dummy transcriptions (with negative ids)
    for (let i = 0; i < dummy_transcriptions_count; i++) {
        $("#" + (-i - 1)).css('display', 'block');
    }
    if (list.length !== 0) {
        // Show results
        for (var item in list) {
            var listItemId = list[item].id;
            $("#" + (listItemId)).css('display', 'initial');
        }
    }
}
function updateCurrentVideoTranscriptions() {
    var video = player.currentSrc();
    currentVideoTranscriptions = jslinqData.where(function (item) {
        // filter out results to currentVideo
        return video === item.video;
    });
    var currentList = currentVideoTranscriptions.toList();
    // Output it
    updateLiveTranscriptionsDiv(currentList);
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
        // Append with the dummy transcriptions (with negative ids)
        for (let i = 0; i < dummy_transcriptions_count; i++) {
            live_transcriptions_div.append(
                "<div class='list-group-item transcription-item' style='display:block;' id='" + (-i - 1) + "'></div>");
                $("#" + (-i - 1)).css('display', 'block');
        }
        live_transcriptions_div.show();
    }
    attachTranscriptionItemListeners();
}

function generateItemHTML(id, start, video, part) {
    return "<div class='list-group-item transcription-item' style='display:none;' id='" + id + "'>" +
        "<div class= 'row'>" + 
        "<div class='col-sm-3'><tt>" +
        utils.msToTime(start) + 
        "</tt><button type='button' class='btn btn-outline-secondary btn-sm align-top' onclick=generateShareLink('" + video + "'," + start + ")> Share </button>" +
        "<div class='form-check form-check-inline'>" +
        "<input class='btn btn-outline-secondary btn-sm edit-button' type='button' id='edit-button-" + id +"' value= 'Edit'>" +
        "</div>" +
        "</div>" +
        "<div class='col-sm-9 text-view' style = 'display:initial;' id='text-view-" + id +"'>" +
        "<a onclick=navigateToVideo('" + video + "'," + start + ") >" + part + "</a>" +
        "<div class='video-name-for-vtt' style='display:None;'>" +
        "<a>" + srctoTitle[video] + "</a>" +
        "</div>" +
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
        "</div>" +
        "</div>";
}

function updateDownloadVttButton(srcid) {
  currentVideoTranscriptions = jslinqData.where(function (item) {
      // filter out results to currentVideo
      return srcid === item.video;
  });
  var currentList = currentVideoTranscriptions.toList();
  var filePath = currentList[0].subFile;
  var buttonItem = generateDownloadVttButtonHTML(filePath);
  download_transcriptions_div.append(buttonItem);
  live_transcriptions_div.show();
}

function generateDownloadVttButtonHTML(srcid) {
  return "<a class='btn download-button' href=\""+ srcid +"\") download>" +
         "Down The Vtt File" +
         "</a>"
}

function scrollToListItem(listItemId) {
    $("#live_transcriptions").children().removeClass('active_line');
    $("#" + (listItemId)).addClass('active_line');
    if (autoScroll) {
        $("#live_transcriptions").scrollTo("#" + (listItemId - 1));
    }
}

function updateTranscriptionsData(data) {
    idx = getLunrObj(data);
    jslinqData = jslinq(data);
    addAllTranscriptionsToList();
}

function linkSrcAndTitle(playlist) {
  for (var i = 0; i < playlist.length; i++){
    srctoTitle[playlist[i].sources[0].src] = playlist[i].name;
  }
}

(async () => {
    var playlist = await $.when($.getJSON(getPlaylistUrl))
    linkSrcAndTitle(playlist)
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
        var srcid = player.currentSrc()
        updateTranscriptionsData(data);
        updateCurrentVideoTranscriptions();
        updateDownloadVttButton(srcid);

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
                if (fullCourseSearch) {
                  if ($("#search").val()){
                    $('.video-name-for-vtt').css('display', 'initial');
                  }
                } else {
                  $('.video-name-for-vtt').css('display', 'none');
                }
                live_transcriptions_div.children().css('display', 'none');
                for (var item in res) {
                    var listItemId = res[item].id;
                    $("#" + (listItemId)).css('display', 'initial');
                }
            }
            updateLiveTranscriptionsDiv(res);
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
            srcid = player.currentSrc();
            download_transcriptions_div.empty()
            updateDownloadVttButton(srcid);
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

        // Enables the autoplay functionality
        player.on('ended', function () {
            // autoplays if duration < 90 mins (in unit of seconds)
            if(player.duration() < 5400 && $('.vjs-up-next').length) {
                $('.vjs-up-next').click();
            }
        })

    });
})();
