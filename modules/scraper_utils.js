'use strict';
var db = require('../db/db');
const request = require('request');
var Cookie = require('request-cookies').Cookie;
var rp = require('request-promise');
var path = require('path');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var youtube_google_api_key = 'AIzaSyDKnpdznYOFxm_IRnrclGh4oSdQloZycOo';
//var azureSubscriptionKey = '926e97a14b9946b98175f9b740af6579';
//var azureRegion = 'westus';
const _dirname = '../../Data/';

const promiseSerial = funcs =>
    funcs.reduce((promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]))

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
            return new Promise((resolve, reject) => {
                resolve(output);
            });
        });
}

function download_youtube_playlist(playlist_id) {
    var url_playlist = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&' +
        'playlistId=' + playlist_id + '&key=' + youtube_google_api_key + '&maxResults=' + 50;
    return rp({ url: url_playlist })
        .then(function (body) {
            var body_playlist_json = JSON.parse(body);
            var arr_videoInfo = body_playlist_json['items'];
            var funcs = arr_videoInfo.map(videoInfo => () => addVideoInfo(videoInfo));
            
            return promiseSerial(funcs);
        });
}

function addVideoInfo(videoInfo) {
    var publishedAt = videoInfo['snippet']['publishedAt'];
    var channelId = videoInfo['snippet']['channelId'];
    var title = videoInfo['snippet']['title'];
    var description = videoInfo['snippet']['description'];
    var channelTitle = videoInfo['snippet']['channelTitle'];
    var playlistId = videoInfo['snippet']['playlistId'];
    var videoId = videoInfo['snippet']['resourceId']['videoId'];
    var videoUrl = 'http://www.youtube.com/watch?v=' + videoId;
    var i = 2;
    return db.addMedia(videoUrl, 1, {
        channelTitle: channelTitle,
        channelId: channelId,
        playlistId: playlistId,
        title: title,
        description: description,
        publishedAt: publishedAt,
        videoUrl: videoUrl
    })
        .then(media => db.addMSTranscriptionTask(media[0].id))
        .then(task => {
            i--;
            if (i == 0) return null;
            return download_lecture(task[0].id)
                .then(result => convertVideoToWav(task[0].id))
                .then(result => wavToSrt(task[0].id))
                .then(result => { console.log("Done!") });
            console.log("Youtube TaskId:" + task[0].id);
        });
}

function download_lecture(taskId, callback) {
    console.log("Download_lecture");
    return db.getTask(taskId)
        .then(task => {
            return db.getMedia(task.mediaId)
                .then(media => {
                    switch (media.sourceType) {
                        case 0:
                            return download_echo_lecture(task, media, callback);
                            break;
                        case 1:
                            return download_youtube_video(task, media, callback);
                            break;
                        default:
                            console.log("Invalid sourceType");
                    }
                });
        });
}

function download_youtube_video(task, media) {
    console.log("download_youtube_video");
    var videoUrl = JSON.parse(media.siteSpecificJSON).videoUrl;
    var outputFile = _dirname + media.id + '.mp4';
    const { spawn } = require('child-process-promise');
    const youtubedl = spawn('youtube-dl', [videoUrl, '--format=18', '--output', outputFile]);

    youtubedl.childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    youtubedl.childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    return youtubedl.then(result => task.update({
        videoLocalLocation: path.resolve(outputFile)
    }));
}

//function echo_scraper(email, password) {
//    var url_directLogin = 'https://echo360.org/directLogin';
//    var url_login = 'https://echo360.org/login';
//    return rp({ url: url_directLogin, resolveWithFullResponse: true })
//        .then(function (response_directLogin) {
//            var cookie_directLogin = response_directLogin.headers['set-cookie'][0];
//            var play_session_directLogin = new Cookie(cookie_directLogin);
//            var csrf_token = play_session_directLogin.value.substring(play_session_directLogin.value.indexOf('csrf') + 10)
            
//            var options_login = {
//                method: 'POST',
//                url: url_login,
//                qs: { csrfToken: csrf_token },
//                headers:
//                {
//                    'Content-Type': 'application/x-www-form-urlencoded',
//                    Cookie: play_session_directLogin.key + "=" + play_session_directLogin.value
//                },
//                form:
//                {
//                    email: email,
//                    password: password,
//                    action: 'Save'
//                },
//                resolveWithFullResponse: true
//            };
//            return new Promise((resolve, reject) => {
//                resolve(options_login);
//            });
//        }).then(option_login => rp(option_login))
//        .then(function (response_login) {
//            console.log(response_login)
//            var cookie_login = response_login.headers['set-cookie'][0];
//            var play_session_login = new Cookie(cookie_login);
//            var options_home = {
//                method: 'GET',
//                url: url_home,
//                headers:
//                {
//                    'Content-Type': 'application/x-www-form-urlencoded',
//                    Cookie: play_session_login.key + "=" + play_session_login.value
//                }
//            };
//            console.log(options_home);
//        });
//}

//function echo_scraper(email, password) {
//    var url_directLogin = 'https://echo360.org/directLogin';
//    request({ url: url_directLogin }, (error_directLogin, response_directLogin, body_directLogin) => {
//        if (error_directLogin) { return console.log(error_directLogin); }
//        var cookie_directLogin = response_directLogin.headers['set-cookie'][0];
//        var play_session_directLogin = new Cookie(cookie_directLogin);
//        var csrf_token = play_session_directLogin.value.substring(play_session_directLogin.value.indexOf('csrf') + 10)

//        var url_login = 'https://echo360.org/login';
//        var options_login = {
//            method: 'POST',
//            url: url_login,
//            qs: { csrfToken: csrf_token },
//            headers:
//            {
//                'Content-Type': 'application/x-www-form-urlencoded',
//                Cookie: play_session_directLogin.key + "=" + play_session_directLogin.value
//            },
//            form:
//            {
//                email: email,
//                password: password,
//                action: 'Save'
//            }
//        };

//        var url_home = 'https://echo360.org/home';
//        request(options_login, function (error_login, response_login, body_login) {
//            if (error_login) throw new Error(error_login);

//            var cookie_login = response_login.headers['set-cookie'][0];
//            var play_session_login = new Cookie(cookie_login);
//            var options_home = {
//                method: 'GET',
//                url: url_home,
//                headers:
//                {
//                    'Content-Type': 'application/x-www-form-urlencoded',
//                    Cookie: play_session_login.key + "=" + play_session_login.value
//                }
//            };

//            request(options_home, function (error_home, response_home, body_home) {
//                if (error_home) throw new Error(error_home);
//                var cookie_home = response_home.headers['set-cookie'];
//                var cloudFront_Key_Pair_Id = new Cookie(cookie_home[0]);
//                var cloudFront_Policy = new Cookie(cookie_home[1]);
//                var cloudFront_Signature = new Cookie(cookie_home[2]);
//                console.log(cloudFront_Key_Pair_Id.key + "=" + cloudFront_Key_Pair_Id.value);
//                console.log(cloudFront_Policy.key + "=" + cloudFront_Policy.value);
//                console.log(cloudFront_Signature.key + "=" + cloudFront_Signature.value);
//                var download_header = cloudFront_Key_Pair_Id.key + "=" + cloudFront_Key_Pair_Id.value;
//                download_header += "; " + cloudFront_Policy.key + "=" + cloudFront_Policy.value;
//                download_header += "; " + cloudFront_Signature.key + "=" + cloudFront_Signature.value;
//                console.log(download_header);
//                var body_home_str = JSON.stringify(body_home);
//                var sections_str = body_home_str.match(/\/section\/([\w-]*)\/home\\" target([^>]*)>/g);
//                // console.log(sections_str);
//                var courses = [];
//                for (var i = 0; i < 2; i++) {
//                    var course_id = sections_str[i].substring(sections_str[i].indexOf('in ') + 3);
//                    course_id = course_id.substring(0, course_id.search(/\s[\w]+\s-/g));
//                    var section_id = sections_str[i].substring(9, sections_str[i].indexOf('/home'));
//                    courses.push([course_id, section_id]);
//                }


//                courses.forEach(function (course) {
//                    // course[0]: courseId
//                    // course[1]: sectionId
//                    console.log(course[0]);
//                    //db.addCourseAndSection(course[0], course[1], download_header)
//                    // .then(function () {
//                    //     download_course_info(course, play_session_login, download_header);
//                    // });
//                });
//            });
//        });
//    });
//}

//function echo_scrape_selected_section(email, password, selected_section) {
//    var url_directLogin = 'https://echo360.org/directLogin';
//    request({ url: url_directLogin }, (error_directLogin, response_directLogin, body_directLogin) => {
//        if (error_directLogin) { return console.log(error_directLogin); }
//        var cookie_directLogin = response_directLogin.headers['set-cookie'][0];
//        var play_session_directLogin = new Cookie(cookie_directLogin);
//        var csrf_token = play_session_directLogin.value.substring(play_session_directLogin.value.indexOf('csrf') + 10)

//        var url_login = 'https://echo360.org/login';
//        var options_login = {
//            method: 'POST',
//            url: url_login,
//            qs: { csrfToken: csrf_token },
//            headers:
//            {
//                'Content-Type': 'application/x-www-form-urlencoded',
//                Cookie: play_session_directLogin.key + "=" + play_session_directLogin.value
//            },
//            form:
//            {
//                email: email,
//                password: password,
//                action: 'Save'
//            }
//        };

//        var url_home = 'https://echo360.org/home';
//        request(options_login, function (error_login, response_login, body_login) {
//            if (error_login) throw new Error(error_login);

//            var cookie_login = response_login.headers['set-cookie'][0];
//            var play_session_login = new Cookie(cookie_login);
//            var options_home = {
//                method: 'GET',
//                url: url_home,
//                headers:
//                {
//                    'Content-Type': 'application/x-www-form-urlencoded',
//                    Cookie: play_session_login.key + "=" + play_session_login.value
//                }
//            };

//            request(options_home, function (error_home, response_home, body_home) {
//                if (error_home) throw new Error(error_home);
//                var cookie_home = response_home.headers['set-cookie'];
//                var cloudFront_Key_Pair_Id = new Cookie(cookie_home[0]);
//                var cloudFront_Policy = new Cookie(cookie_home[1]);
//                var cloudFront_Signature = new Cookie(cookie_home[2]);
//                console.log(cloudFront_Key_Pair_Id.key + "=" + cloudFront_Key_Pair_Id.value);
//                console.log(cloudFront_Policy.key + "=" + cloudFront_Policy.value);
//                console.log(cloudFront_Signature.key + "=" + cloudFront_Signature.value);
//                var download_header = cloudFront_Key_Pair_Id.key + "=" + cloudFront_Key_Pair_Id.value;
//                download_header += "; " + cloudFront_Policy.key + "=" + cloudFront_Policy.value;
//                download_header += "; " + cloudFront_Signature.key + "=" + cloudFront_Signature.value;
//                console.log(download_header);
//                var body_home_str = JSON.stringify(body_home);
//                var sections_str = body_home_str.match(/\/section\/([\w-]*)\/home\\" target([^>]*)>/g);
//                // console.log(sections_str);
//                var courses = [];
//                for (var i = 0; i < 2; i++) {
//                    var course_id = sections_str[i].substring(sections_str[i].indexOf('in ') + 3);
//                    course_id = course_id.substring(0, course_id.search(/\s[\w]+\s-/g));
//                    var section_id = sections_str[i].substring(9, sections_str[i].indexOf('/home'));
//                    courses.push([course_id, section_id]);
//                }

//                courses.forEach(function (course) {
//                    // course[0]: courseId
//                    // course[1]: sectionId
//                    // select all when selected_section is not specified
//                    if (selected_section.includes(course[1]) || !selected_section) {
//                        db.addCourseAndSection(course[0], course[1], download_header)
//                            .then(function () {
//                                download_course_info(course, play_session_login, download_header);
//                            });
//                    }
//                });
//            });
//        });
//    });
//}

//function download_course_info(course, play_session_login, download_header) {
//    var url_syllabus = 'https://echo360.org/section';
//    var options_syllabus = {
//        method: 'GET',
//        url: url_syllabus + '/' + course[1] + '/syllabus',
//        headers:
//        {
//            'Content-Type': 'application/x-www-form-urlencoded',
//            Cookie: play_session_login.key + "=" + play_session_login.value
//        }
//    };
//    request(options_syllabus, function (error_syllabus, response_syllabus, body_syllabus) {
//        if (error_syllabus) throw new Error(error_syllabus);
//        var syllabus = JSON.parse(response_syllabus.body);
//        var audio_data_arr = syllabus['data'];
//        for (var j = 0; j < audio_data_arr.length; j++) {
//            var audio_data = audio_data_arr[j];
//            try {
//                var media = audio_data['lesson']['video']['media'];
//                var sectionId = audio_data['lesson']['video']['published']['sectionId'];
//                var mediaId = media['id'];
//                var userId = media['userId'];
//                var institutionId = media['institutionId'];
//                var createdAt = media['createdAt'];
//                var audioUrl = media['media']['current']['audioFiles'][0]['s3Url'];
//                var videoUrl = media['media']['current']['primaryFiles'][0]['s3Url'];

//                db.addMedia(videoUrl, 0, {
//                    sectionId: sectionId,
//                    mediaId: mediaId,
//                    userId: userId,
//                    institutionId: institutionId,
//                    createdAt: createdAt,
//                    audioUrl: audioUrl
//                }).then(function (media) {
//                    db.addMSTranscriptionTask(media.id)
//                        .then(function (task) {
//                            console.log("TaskId" + task.id);
//                        });
//                });

//            } catch (err) {
//                console.log(err);
//            }
//            // download_file(audio_url, course[0] + '_' + String(j) + '.mp3', download_header);
//        }
//    });
//}

//function download_echo_lecture(task, media) {
//    console.log("download_echo_lecture");
//    var sectionId = media.siteSpecificJSON.sectionId;
//    return db.getEchoSection(sectionId)
//        .then(section => {
//            var wget = require('node-wget-promise');
//            var url = media.videoURL;
//            var dest = _dirname + media.id + "_" + url.substring(url.lastIndexOf('/') + 1);
//            return wget(url, {
//                output: dest,
//                headers:
//                {
//                    Cookie: section.json.downloadHeader
//                },
//            })
//                .then(result => task.update({
//                    videoLocalLocation: path.resolve(dest)
//                }));
//        });
//}

function convertVideoToWav(taskId, callback) {
    console.log("convertVideoToWav");
    return db.getTask(taskId)
        .then(task => {
            var pathToFile = task.videoLocalLocation;
            var outputFile = _dirname + pathToFile.substring(pathToFile.lastIndexOf('/') + 1, pathToFile.lastIndexOf('.')) + '.wav';
            const { spawn } = require('child-process-promise');
            const ffmpeg = spawn('ffmpeg', ['-nostdin', '-i', pathToFile, '-c:a', 'pcm_s16le', '-ac', '1', '-y', '-ar', '16000', outputFile]);

            ffmpeg.childProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            ffmpeg.childProcess.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });

            return ffmpeg.then(result => task.update({
                wavAudioLocalFile: path.resolve(outputFile)
            }));
        });
}



function wavToSrt(taskId, callback) {
    console.log("wavToSrt");
    return db.getTask(taskId).then(task => {
        var pathToFile = task.wavAudioLocalFile;
        var outputFile = _dirname + pathToFile.substring(pathToFile.lastIndexOf('/') + 1, pathToFile.lastIndexOf('.')) + '.srt';
        const { spawn } = require('child-process-promise');
        const dotnet = spawn('dotnet', ['MSCognitiveDotNetCore/MSCog.dll', azureSubscriptionKey, azureRegion, pathToFile]);
        dotnet.childProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        dotnet.childProcess.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        return dotnet.then(result => task.update({
            srtFileLocation: path.resolve(outputFile)
        }));
    });
}

module.exports = {
    youtube_scraper_channel: youtube_scraper_channel,
    download_youtube_playlist: download_youtube_playlist
    //echo_scrape_selected_section: echo_scrape_selected_section,
}
