'use strict';
var db = require('../db/db');
var rp = require('request-promise');
var path = require('path');
var conversion_utils = require('./conversion_utils');
var youtube_google_api_key = process.env.YOUTUBE_API_KEY;
const _dirname = '/data/';
const _tempdir = '/data/temp';
var utils = require('../utils/utils');
const fs = require('fs');

const promiseSerial = funcs =>
    funcs.reduce((promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]))

function youtube_complete_flow(channel_id) {
    youtube_scraper_channel(channel_id)
        .then(playlists => {
            var funcs = playlists.map(playlist => () => download_youtube_playlist(playlist.playlistId));
            return promiseSerial(funcs);
        });
}

function youtube_scraper_channel(channel_id) {
    var url_channel = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet&' +
        'channelId=' + channel_id + '&key=' + youtube_google_api_key;
    return rp({ url: url_channel })
        .then(function (body) {
            var body_channel_json = JSON.parse(body);
            var arr_playlist = body_channel_json['items'];
            var output = [];
            for (var playlist in arr_playlist) {
                var item = {
                    "publishedAt": arr_playlist[playlist].snippet.publishedAt,
                    "title": arr_playlist[playlist].snippet.title,
                    "playlistId": arr_playlist[playlist].id
                }
                output.push(item);
            }
            return Promise.resolve(output);
        });
}

function download_youtube_playlist(playlist_id, courseOfferingId) {
    // TODO: Support more than 50 videos
    var url_playlist = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&' +
        'playlistId=' + playlist_id + '&key=' + youtube_google_api_key + '&maxResults=' + 50;
    return rp({ url: url_playlist })
        .then(async function (body) {
            var body_playlist_json = JSON.parse(body);
            var arr_videoInfo = body_playlist_json['items'];
            var mediaIds = [];
            await utils.asyncForEach(arr_videoInfo, async function (videoInfo) {
                var mediaId = await add_youtube_video_info(videoInfo, courseOfferingId);
                if (mediaId != null) {
                    mediaIds.push(mediaId);
                }                
            });
            await processTasks(mediaIds);
        });
}

async function add_youtube_video_info(videoInfo, courseOfferingId) {
    var publishedAt = videoInfo['snippet']['publishedAt'];
    var channelId = videoInfo['snippet']['channelId'];
    var title = videoInfo['snippet']['title']
    var description = videoInfo['snippet']['description'];
    var channelTitle = videoInfo['snippet']['channelTitle'];
    var playlistId = videoInfo['snippet']['playlistId'];
    var videoId = videoInfo['snippet']['resourceId']['videoId'];
    var videoUrl = 'http://www.youtube.com/watch?v=' + videoId;
    var media = {
        channelTitle: channelTitle,
        channelId: channelId,
        playlistId: playlistId,
        title: title,
        description: description,
        publishedAt: publishedAt,
        videoUrl: videoUrl,
        createdAt: new Date(publishedAt)
    };
    if (await db.doesYoutubeMediaExist(playlistId, title)) {
        return null;
    } else {
        var mediaId = await db.addToMediaAndCourseOfferingMedia(videoUrl, 1, media, courseOfferingId)
        return mediaId;
    }    
}

async function download_lecture(media, alt = false) {
    console.log("Download_lecture");
    var outputFile;
    switch (media.sourceType) {
        case 0:
            outputFile = await download_echo_lecture(media, alt);
            break;
        case 1:
            outputFile = await download_youtube_video(media, alt);
            break;
        case 2:
            outputFile = await download_local_video(media, alt);
            break;
        default:
            console.log("Invalid sourceType");
            outputFile = "";
    }
    return outputFile;
}

async function download_youtube_video(media, alt = false) {
    console.log("download_youtube_video");
    var videoUrl = alt ? JSON.parse(media.siteSpecificJSON).altVideoUrl : JSON.parse(media.siteSpecificJSON).videoUrl;
    var suffix = alt ? "_alt" : "";
    var randstr = Math.random().toString(36).substring(4);
    var outputFile = _tempdir + '_' + randstr + '_' + media.id + suffix + '.mp4';
    outputFile = await conversion_utils.download_from_youtube_url(videoUrl, outputFile);
    return outputFile;
}

async function download_local_video(media, alt = false) {
    console.log("download_local_video");
    var videoUrl = alt ? JSON.parse(media.siteSpecificJSON).altVideoUrl : JSON.parse(media.siteSpecificJSON).videoUrl;
    var suffix = alt ? "_alt" : "";
    var outputFile = _tempdir + media.id + suffix + '.mp4';
    outputFile = await conversion_utils.copy_file(videoUrl, outputFile);
    return outputFile;
}

async function download_echo_lecture(media, alt = false) {
    console.log("download_echo_lecture");
    var videoUrl = alt ? JSON.parse(media.siteSpecificJSON).altVideoUrl : JSON.parse(media.siteSpecificJSON).videoUrl;
    var suffix = alt ? "_alt" : "";
    var siteSpecificJSON = JSON.parse(media.siteSpecificJSON);
    var randstr = Math.random().toString(36).substring(4);
    var dest = _tempdir + '_' + randstr + '_' + media.id + suffix + videoUrl.substring(videoUrl.lastIndexOf('.'));
    var outputFile = await conversion_utils.downloadFile(videoUrl, siteSpecificJSON.download_header, dest);
    console.log("Outputfile " + outputFile);
    return outputFile;
}

async function download_alt_video(task, media) {
    var altVideoUrl = JSON.parse(media.siteSpecificJSON).altVideoUrl;
    if (altVideoUrl != null && altVideoUrl.length > 0) {
        var outputFile = await download_lecture(media, true);
        await db.updateAltVideoFileName(task, outputFile);
    }
}

async function processTasks(mediaIds) {
    console.log("processing all mediaIds" + mediaIds);
    var tasks = [];
    // Download all
    await utils.asyncForEach(mediaIds, async function (mediaId) {
        // Download File, check if exists
        var media = await db.getMedia(mediaId);
        var outputFile = await download_lecture(media);
        var videoHashsum = await conversion_utils.hash_file(outputFile);
        var taskId = await db.getTaskIdIfNotUnique(videoHashsum);
        var duplicate = false;
        if (taskId != null) {
            duplicate = true;
            console.log("Duplicate: " + taskId);
            try {
                console.log("Deleting:" + outputFile);
                fs.unlinkSync(path.resolve(outputFile));
            } catch (err) {
                console.log(err);
            }
        }

        var task = await db.addMSTranscriptionTask(mediaId, taskId, videoHashsum, path.resolve(outputFile));
        await download_alt_video(task, media);
        if(!duplicate) {
            tasks.push(task);
        }
    });
    await wavAndSrt(tasks);
}

async function wavAndSrt(tasks) {
    await utils.asyncForEach(tasks, async function (task) {
        console.log("ConvertVideoToWav:" + task.id);
        var result = await convertTaskVideoToWav(task);
        
        if (result != null) {
            console.log("ConvertTaskToSrt:" + task.id);
            await convertTaskToSrt(task);
        }        
    });
}

async function wavAndSrtParallel(tasks) {
    await Promise.all(tasks.map(async task => {
        await convertTaskVideoToWav(task);
        console.log("ConvertVideoToWav:" + task.id);
        await convertTaskToSrt(task);
        console.log("ConvertTaskToSrt:" + task.id);
    }));
}

async function reprocessIncompleteMedias(courseOfferingId) {
    var mediaIds = await db.getMediaIdsByCourseOfferingId(courseOfferingId);
    await processTasks(mediaIds);
}

async function reprocessIncompleteTaskIdsForCourseOfferingId(courseOfferingId, parallel) {
    var taskIds = await db.getIncompleteTaskIdsForCourseOfferingId(courseOfferingId);
    console.log(taskIds);
    var tasks = [];
    for (var taskId in taskIds) {
        tasks.push(await db.getTask(taskIds[taskId]));
    }
    if (parallel) {
        await wavAndSrtParallel(tasks);
    } else {
        await wavAndSrt(tasks);
    }    
}

async function convertTaskVideoToWav(task) {
    console.log("convertVideoToWav");
    //console.log(task);
    console.log(task.id, task.videoLocalLocation);
    var outputFile = await conversion_utils.convertVideoToWav(task.videoLocalLocation);
    if (outputFile != null) {
        await task.update({
            wavAudioLocalFile: path.resolve(outputFile)
        });
        return outputFile;
    } else {
        return null;
    }   
}

async function convertTaskToSrt(task) {
    console.log("convertTaskToSrt");
    var outputFile = await conversion_utils.convertWavFileToSrt(task.wavAudioLocalFile);
    await task.update({ srtFileLocation: path.resolve(outputFile) });
    fs.copyFileSync(path.resolve(outputFile), path.resolve(outputFile) + ".copy");
}

async function requestCookies(publicAccessUrl) {
    console.log("requestCookies");
    const { spawn } = require('child-process-promise');
    const curl = spawn('curl', ['-D', 'cookies.txt', publicAccessUrl]);
    curl.childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    curl.childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    await curl;

    var fs  = require('fs-promise');
    return fs.readFile('cookies.txt')
        .then(f => {
            var lines = f.toString().split('\n');
            var Cookies = ['PLAY_SESSION', 'CloudFront-Key-Pair-Id', 'CloudFront-Policy', 'CloudFront-Signature'];
            var value_Cookies = ['', '', '', ''];
            for(var i in lines) {
                let line = lines[i];
                for(var j in Cookies) {
                    let index = line.indexOf(Cookies[j]);
                    if(index != -1) {
                        value_Cookies[j] = line.substring(index + Cookies[j].length + 1, line.indexOf(';'));
                        break;
                    }
                }
            }
            var fullText = f.toString();
            var sectionId = fullText.substring(fullText.indexOf('section') + 'section'.length + 1, fullText.indexOf('home') - 1);

            return Promise.resolve({
                PLAY_SESSION: value_Cookies[0],
                cloudFront_Key_Pair_Id: value_Cookies[1],
                cloudFront_Policy: value_Cookies[2],
                cloudFront_Signature: value_Cookies[3],
                sectionId: sectionId
            });
        });
}

async function download_public_echo_course(publicAccessUrl, courseOfferingId, params) {
    var cookiesAndHeader = await requestCookies(publicAccessUrl)
        .then(cookieJson => {
            let download_header = 'Cookie: CloudFront-Key-Pair-Id=' + cookieJson.cloudFront_Key_Pair_Id;
            download_header += "; CloudFront-Policy=" + cookieJson.cloudFront_Policy;
            download_header += "; CloudFront-Signature=" + cookieJson.cloudFront_Signature;
            return Promise.resolve({
                cookieJson: cookieJson,
                download_header: download_header
            });
        });
    var syllabus = await get_syllabus(cookiesAndHeader);
    await extractSyllabusAndDownload(syllabus, cookiesAndHeader.download_header, courseOfferingId, params);    
}

async function get_syllabus(cookiesAndHeader) {
    var play_session_login = 'PLAY_SESSION' + "=" + cookiesAndHeader.cookieJson['PLAY_SESSION'];
    var sectionId = cookiesAndHeader.cookieJson.sectionId;
    var options_syllabus = {
        method: 'GET',
        url: 'https://echo360.org/section/' + sectionId + '/syllabus',
        resolveWithFullResponse: true,
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: play_session_login
        }
    };
    var response_syllabus = await rp(options_syllabus);
    var syllabus = JSON.parse(response_syllabus.body);
    return Promise.resolve(syllabus);
}

async function extractSyllabusAndDownload(syllabus, download_header, courseOfferingId, params) {
    console.log("CALLING EXTRACT SYLLABUS");
    var audio_data_arr = syllabus['data'];
    var mediaIds = [];
    var playlist = await db.getPlaylistByCourseOfferingId(courseOfferingId);
    var echoMediaIds = [];
    for (var j = 0; j < audio_data_arr.length; j++) {
        var audio_data = audio_data_arr[j];
        try {            
            var media = audio_data['lesson']['video']['media'];
            var sectionId = audio_data['lesson']['video']['published']['sectionId'];
            var echoMediaId = media['id'];
            var userId = media['userId'];
            var institutionId = media['institutionId'];
            var createdAt = media['createdAt'];
            var audioUrl = media['media']['current']['audioFiles'][0]['s3Url'];
            var videoUrl;
            var altVideoUrl;
            if (params.stream == 0) {
                videoUrl = media['media']['current']['primaryFiles'][1]['s3Url']; // 0 for SD, 1 for HD
                altVideoUrl = media['media']['current']['secondaryFiles'][1]['s3Url']; // 0 for SD, 1 for HD
            } else {
                videoUrl = media['media']['current']['secondaryFiles'][1]['s3Url']; // 0 for SD, 1 for HD
                altVideoUrl = media['media']['current']['primaryFiles'][1]['s3Url']; // 0 for SD, 1 for HD
            }
            var termName = audio_data['lesson']['video']['published']['termName'];
            var lessonName = audio_data['lesson']['video']['published']['lessonName'];
            var courseName = audio_data['lesson']['video']['published']['courseName'];

            
            var mediaJson = {
                sectionId: sectionId,
                mediaId: echoMediaId,
                userId: userId,
                institutionId: institutionId,
                createdAt: new Date(createdAt),
                audioUrl: audioUrl,
                videoUrl: videoUrl,
                altVideoUrl: altVideoUrl,
                download_header: download_header,
                termName: termName,
                lessonName: lessonName,
                courseName: courseName
            };

            if (await db.doesEchoMediaExist(echoMediaId)) {
                var existingMediaId = await db.getMediaIdForEchoMedia(echoMediaId);
                var existingMedia = await db.getMedia(existingMediaId);
                var existingTaskId = await db.getTaskIdForMediaId(existingMediaId) ;
                var existingTask = await db.getTask(existingTaskId);
                console.log('ADDING ALT VIDEO' + echoMediaId + ',   ' + existingMediaId + ', ' + existingTaskId);
                if (existingTask.altVideoLocalLocation == null || existingTask.altVideoLocalLocation.length == 0) {
                    // console.log(existingTask.dataValues);
                    await existingMedia.update({
                        siteSpecificJSON: JSON.stringify(mediaJson)
                    });
                    await download_alt_video(existingTask, existingMedia);
                }
                continue;
            }
            echoMediaIds.push(echoMediaId);
            var mediaId = await db.addToMediaAndCourseOfferingMedia(mediaJson.videoUrl, 0, mediaJson, courseOfferingId);
            mediaIds.push(mediaId);
        } catch (err) {
            // console.log(err);
        }
    }
    await processTasks(mediaIds);
}

async function addLocalVideosToCourse(jsonFile, courseOfferingId) {
    console.log(jsonFile, courseOfferingId);
    var fs = require('fs');
    var json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    var mediaIds = [];
    var dateFormat = require('dateformat');
    var playlist = await db.getPlaylistByCourseOfferingId(courseOfferingId);
    var counter = playlist.length;
    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        console.log(obj.id);
        try {
            var mediaJson = {
                createdAt: new Date(obj.createdAt),
                videoUrl: obj.videoUrl,
                lessonName: obj.lessonName,
                title: (counter++ + 1) + ":" + dateFormat(obj.createdAt, "yyyy-mm-dd") + ":" + obj.lessonName
            };
            var mediaId = await db.addToMediaAndCourseOfferingMedia(mediaJson.videoUrl, 2, mediaJson, courseOfferingId);
            mediaIds.push(mediaId);
        } catch (err) {
            console.log(err);
        }
    }
    await processTasks(mediaIds);
}

module.exports = {
    youtube_scraper_channel: youtube_scraper_channel,
    download_youtube_playlist: download_youtube_playlist,
    download_lecture: download_lecture,
    download_public_echo_course: download_public_echo_course,
    addLocalVideosToCourse: addLocalVideosToCourse,
    reprocessIncompleteTaskIdsForCourseOfferingId: reprocessIncompleteTaskIdsForCourseOfferingId,
    reprocessIncompleteMedias: reprocessIncompleteMedias,
    processTasks: processTasks
}
