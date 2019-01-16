'use strict';
var db = require('../db/db');
var Cookie = require('request-cookies').Cookie;
var rp = require('request-promise');
var path = require('path');
var conversion_utils = require('./conversion_utils');
var youtube_google_api_key = process.env.YOUTUBE_API_KEY;
const _dirname = '/data/';

const promiseSerial = funcs =>
    funcs.reduce((promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]))

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

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
            var taskIds = [];
            await asyncForEach(arr_videoInfo, async function (videoInfo) {
                var taskId = await add_youtube_video_info(videoInfo, courseOfferingId);
                taskIds.push(taskId);
            });
            await processTasks(taskIds);
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
        videoUrl: videoUrl
    };
    var taskId = await db.addToMediaAndMSTranscriptionTask(videoUrl, 1, media, courseOfferingId)
    return taskId;
}

async function download_lecture(taskId) {
    console.log("Download_lecture");
    console.log(taskId);
    var task = await db.getTask(taskId);
    var media = await db.getMedia(task.mediaId);
    console.log("MediaId" + media.sourceType);
    switch (media.sourceType) {
        case 0:
            return await download_echo_lecture(task, media);
            break;
        case 1:
            return await download_youtube_video(task, media);
            break;
        case 2:
            return await download_local_video(task, media);
            break;
        default:
            console.log("Invalid sourceType");
            return null;
    }
}

async function download_youtube_video(task, media) {
    console.log("download_youtube_video");
    var videoUrl = JSON.parse(media.siteSpecificJSON).videoUrl;
    var outputFile = _dirname + media.id + '.mp4';
    outputFile = await conversion_utils.download_from_youtube_url(videoUrl, outputFile);
    await task.update({ videoLocalLocation: path.resolve(outputFile) });
}

async function download_local_video(task, media) {
    console.log("download_local_video");
    var videoUrl = JSON.parse(media.siteSpecificJSON).videoUrl;
    var outputFile = _dirname + media.id + '.mp4';
    outputFile = await conversion_utils.copy_file(videoUrl, outputFile);
    await task.update({ videoLocalLocation: path.resolve(outputFile) });
}

async function download_echo_course_info(section_url, courseOfferingId) {
    var jsonCookieString = require('../cookieJson.json');
    var Cookies = ['PLAY_SESSION', 'CloudFront-Key-Pair-Id', 'CloudFront-Policy', 'CloudFront-Signature'];
    var play_session_login = '';
    for (var j in jsonCookieString) {
        if (jsonCookieString[j].name === Cookies[0]) {
            play_session_login = jsonCookieString[j].name + "=" + jsonCookieString[j].value;
        }
    }
    var download_header = '';
    var options_section = {
        method: 'GET',
        url: section_url + '/home',
        resolveWithFullResponse: true,
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: play_session_login
        }
    };
    var options_syllabus = {
        method: 'GET',
        url: section_url + '/syllabus',
        resolveWithFullResponse: true,
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: play_session_login
        }
    };
    var response_syllabus = await rp(options_section).then(function (response_section) {
        var cookie_home = response_section.headers['set-cookie'];
        var cloudFront_Key_Pair_Id = new Cookie(cookie_home[0]);
        var cloudFront_Policy = new Cookie(cookie_home[1]);
        var cloudFront_Signature = new Cookie(cookie_home[2]);
        for (var j in jsonCookieString) {
            if (jsonCookieString[j].name === Cookies[1]) {
                cloudFront_Key_Pair_Id = jsonCookieString[j].name + "=" + jsonCookieString[j].value;
            } else if (jsonCookieString[j].name === Cookies[2]) {
                cloudFront_Policy = jsonCookieString[j].name + "=" + jsonCookieString[j].value;
            } else if (jsonCookieString[j].name === Cookies[3]) {
                cloudFront_Signature = jsonCookieString[j].name + "=" + jsonCookieString[j].value;
            }
        }
        download_header = cloudFront_Key_Pair_Id;
        download_header += "; " + cloudFront_Policy;
        download_header += "; " + cloudFront_Signature;
        console.log(download_header);
    }).then(function () { return rp(options_syllabus) });

    var syllabus = JSON.parse(response_syllabus.body);
    await extractSyllabusAndDownload(syllabus, download_header, courseOfferingId);
}

async function processTasks(taskIds) {
    console.log("processing all tasks");
    await asyncForEach(taskIds, async function (taskId) {
        await downloadConvertAndThumbnail(taskId);
    });
    console.log("downloaded all");
    await asyncForEach(taskIds, async function (taskId) {
        await convertTaskToSrt(taskId);
        console.log("ConvertTaskToSrt:" + taskId);
    });
}

async function downloadConvertAndThumbnail(taskId) {
    await download_lecture(taskId);
    console.log("Downloaded:" + taskId);
    await convertTaskVideoToWav(taskId);
    console.log("ConvertVideoToWav:" + taskId);
}

async function download_echo_lecture(task, media) {
    console.log("download_echo_lecture");
    var url = media.videoURL;
    var siteSpecificJSON = JSON.parse(media.siteSpecificJSON);
    var dest = _dirname + media.id + "_" + url.substring(url.lastIndexOf('/') + 1);
    var outputFile = await conversion_utils.downloadFile(url, siteSpecificJSON.download_header, dest);
    console.log("Outputfile " + outputFile);
    await task.update({ videoLocalLocation: path.resolve(outputFile) });
}

async function convertTaskVideoToWav(taskId) {
    console.log("convertVideoToWav");
    var task = await db.getTask(taskId);
    //console.log(task);
    console.log(task.id, task.videoLocalLocation);
    var outputFile = await conversion_utils.convertVideoToWav(task.videoLocalLocation);
    await task.update({
        wavAudioLocalFile: path.resolve(outputFile)
    });
}

async function convertTaskToSrt(taskId) {
    console.log("convertTaskToSrt");
    var task = await db.getTask(taskId);
    var outputFile = await conversion_utils.convertWavFileToSrt(task.wavAudioLocalFile);
    await task.update({ srtFileLocation: path.resolve(outputFile) });
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

async function download_public_echo_course(publicAccessUrl, courseOfferingId) {
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
    await extractSyllabusAndDownload(syllabus, cookiesAndHeader.download_header, courseOfferingId);    
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

async function extractSyllabusAndDownload(syllabus, download_header, courseOfferingId) {
    var audio_data_arr = syllabus['data'];
    var taskIds = [];
    var dateFormat = require('dateformat');
    for (var j = 0; j < audio_data_arr.length; j++) {
        var audio_data = audio_data_arr[j];
        try {
            var media = audio_data['lesson']['video']['media'];
            var sectionId = audio_data['lesson']['video']['published']['sectionId'];
            var mediaId = media['id'];
            var userId = media['userId'];
            var institutionId = media['institutionId'];
            var createdAt = media['createdAt'];
            var audioUrl = media['media']['current']['audioFiles'][0]['s3Url'];
            var videoUrl = media['media']['current']['primaryFiles'][1]['s3Url']; // 0 for SD, 1 for HD
            var termName = audio_data['lesson']['video']['published']['termName'];
            var lessonName = audio_data['lesson']['video']['published']['lessonName'];
            var courseName = audio_data['lesson']['video']['published']['courseName'];
            var mediaJson = {
                sectionId: sectionId,
                mediaId: mediaId,
                userId: userId,
                institutionId: institutionId,
                createdAt: createdAt,
                audioUrl: audioUrl,
                videoUrl: videoUrl,
                download_header: download_header,
                termName: termName,
                lessonName: lessonName,
                courseName: courseName,
                title: (j + 1) + ":" + dateFormat(createdAt, "yyyy-mm-dd")
            };
            var taskId = await db.addToMediaAndMSTranscriptionTask(mediaJson.videoUrl, 0, mediaJson, courseOfferingId);
            taskIds.push(taskId);
        } catch (err) {
            console.log(err);
        }
    }
    await processTasks(taskIds);
}

function addLocalVideosToCourse(jsonFile, courseOfferingId) {
    console.log(jsonFile, courseOfferingId);
    var fs = require('fs');
    var json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    var taskIds = [];
    var dateFormat = require('dateformat');
    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        console.log(obj.id);
        try {
            var mediaJson = {
                createdAt: obj.createdAt,
                videoUrl: obj.videoUrl,
                lessonName: obj.lessonName,
                title: (i + 1) + ":" + dateFormat(obj.createdAt, "yyyy-mm-dd") + ":" + obj.lessonName
            };
            var taskId = await db.addToMediaAndMSTranscriptionTask(mediaJson.videoUrl, 0, mediaJson, courseOfferingId);
            taskIds.push(taskId);
        } catch (err) {
            console.log(err);
        }
    }
    await processTasks(taskIds);
}

module.exports = {
    youtube_scraper_channel: youtube_scraper_channel,
    download_youtube_playlist: download_youtube_playlist,
    download_echo_course_info: download_echo_course_info,
    download_lecture: download_lecture,
    download_public_echo_course: download_public_echo_course,
    addLocalVideosToCourse: addLocalVideosToCourse
}
