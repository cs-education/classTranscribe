'use strict';
var db = require('../db/db');
const request = require('request');
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
        .then(function (body) {
            var body_playlist_json = JSON.parse(body);
            var arr_videoInfo = body_playlist_json['items'];
            var funcs = arr_videoInfo.map(videoInfo => () => add_youtube_video_info(videoInfo, courseOfferingId));
            return promiseSerial(funcs);
        });
}

// download_youtube_playlist('PLjgj6kdf_snaBCTJEi53DvRVgOuVbzyku', '1526fd19-6aa4-4a25-9cbb-0e9bf45a3209');

function add_youtube_video_info(videoInfo, courseOfferingId) {
    var publishedAt = videoInfo['snippet']['publishedAt'];
    var channelId = videoInfo['snippet']['channelId'];
    var title = videoInfo['snippet']['title'];
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
    return db.addToMediaAndMSTranscriptionTask(videoUrl, 1, media, courseOfferingId)
        .then(taskId => downloadConvertAndSrt(taskId))
        .then(result => {
            console.log("Done!");
        });
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

function echo_scraper(publicAccessUrl) {
    request({ url: publicAccessUrl, resolveWithFullResponse: true, followAllRedirects: true }, function (error_directLogin, response_directLogin, body_directLogin) {
        console.log(response_directLogin.headers)
    });
    return rp({ url: publicAccessUrl, resolveWithFullResponse: true, followAllRedirects: true })
        .then(function (response_directLogin) {
            console.log(response_directLogin.headers['set-cookie']);
            var cookie_directLogin = response_directLogin.headers['set-cookie'][0];
            var play_session_directLogin = new Cookie(cookie_directLogin);
            var csrf_token = play_session_directLogin.value.substring(play_session_directLogin.value.indexOf('csrf') + 10)

            var options_login = {
                method: 'POST',
                url: url_login,
                qs: { csrfToken: csrf_token },
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Cookie: play_session_directLogin.key + "=" + play_session_directLogin.value
                },
                form:
                {
                    email: email,
                    password: password,
                    action: 'Save'
                },
                resolveWithFullResponse: true
            };

            return new Promise((resolve, reject) => {
                resolve(options_login);
            });
        });
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
    var audio_data_arr = syllabus['data'];
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
                courseName: courseName
            };
            var taskId = await db.addToMediaAndMSTranscriptionTask(mediaJson.videoUrl, 0, mediaJson, courseOfferingId);
            await downloadConvertAndSrt(taskId);
        } catch (err) {
            console.log(err);
        }
    }
}

// download_echo_course_info('https://echo360.org/section/286c2340-3852-469d-ba1c-f2cb3f1e2636','cb3836f0-f9fc-45a3-aab1-2c30e3ae2ab9');

async function downloadConvertAndSrt(taskId) {
    await download_lecture(taskId);
    await convertTaskVideoToWav(taskId);
    await convertTaskToSrt(taskId);
}

async function download_echo_lecture(task, media) {
    console.log("download_echo_lecture");
    var url = media.videoURL;
    var siteSpecificJSON = JSON.parse(media.siteSpecificJSON);
    var dest = _dirname + media.id + "_" + url.substring(url.lastIndexOf('/') + 1);
    var outputFile = await conversion_utils.downloadFile(url, 'Cookie: ' + siteSpecificJSON.download_header, dest);
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

module.exports = {
    youtube_scraper_channel: youtube_scraper_channel,
    download_youtube_playlist: download_youtube_playlist,
    download_echo_course_info: download_echo_course_info,
    download_lecture: download_lecture
}
