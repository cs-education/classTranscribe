'use strict';

var azureSubscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY;
var azureRegion = process.env.AZURE_REGION;
const _dirname = '/data/';


async function downloadFile(url, header, dest) {
    console.log('downloadFile');
    console.log(url, header, dest);
    const { spawn } = require('child-process-promise');
    const curl = spawn('curl', ['-o', dest, '-O', url, '-H', header, '--silent']);
    curl.childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    curl.childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    await curl;
    return dest;
}

async function convertVideoToWav(pathToFile) {
    console.log("convertVideoToWav");
    var outputFile = _dirname + pathToFile.substring(pathToFile.lastIndexOf('/') + 1, pathToFile.lastIndexOf('.')) + '.wav';
    const { spawn } = require('child-process-promise');
    const ffmpeg = spawn('ffmpeg', ['-nostdin', '-i', pathToFile, '-c:a', 'pcm_s16le', '-ac', '1', '-y', '-ar', '16000', outputFile]);

    ffmpeg.childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ffmpeg.childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    return await ffmpeg.then(result => { return Promise.resolve(outputFile) });
}

async function convertWavFileToSrt(pathToFile) {
    var outputFile = _dirname + pathToFile.substring(pathToFile.lastIndexOf('/') + 1, pathToFile.lastIndexOf('.')) + '.vtt';
    const { spawn } = require('child-process-promise');
    const dotnet = spawn('dotnet', ['/MSTranscription/Release/MSTranscription.dll', azureSubscriptionKey, azureRegion, pathToFile]);
    dotnet.childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    dotnet.childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    return await dotnet.then(result => {
        return Promise.resolve(outputFile)
    });
}

async function download_from_youtube_url(videoUrl, outputFile) {
    const { spawn } = require('child-process-promise');
    const youtubedl = spawn('youtube-dl', [videoUrl, '--format=18', '--output', outputFile]);

    youtubedl.childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    youtubedl.childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    await youtubedl;
    return outputFile;
}

async function copy_file(source_file, outputFile) {
    const fs = require('fs');

    // destination.txt will be created or overwritten by default.
    fs.copyFile(source_file, outputFile, (err) => {
        if (err) {
            console.log(err);
        }
    });
    return outputFile
}

async function hash_file(filename, algo) {
    const hasha = require('hasha');

    var hash = await hasha.fromFile(filename, { algorithm: algo });
    return hash;
}

hash_file(_dirname + 'cookies.txt', 'md5').then(hash => { console.log(hash); });
hash_file(_dirname + 'cookies.txt', 'sha256').then(hash => { console.log(hash); });

async function get_thumbnails_from_video(pathToFile) {
    const { getVideoDurationInSeconds } = require('get-video-duration')
 
    var duration_one_fifth = await getVideoDurationInSeconds(pathToFile).then(duration => {
        duration = Math.round(duration / 5);
        let hours = Math.floor(duration / 3600);
        let minutes = Math.floor(duration / 60);
        let seconds = duration % 60;
        return Promise.resolve(hours + ':' + minutes + ':' + seconds);
    });

    var outputFile = _dirname + pathToFile.substring(pathToFile.lastIndexOf('/') + 1, pathToFile.lastIndexOf('.')) + '.jpg';
    const { spawn } = require('child-process-promise');
    const ffmpeg = spawn('ffmpeg', ['-ss', duration_one_fifth, '-i', pathToFile, '-vframes', '1', '-q:v', '2', outputFile]);
    
    ffmpeg.childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ffmpeg.childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    await ffmpeg;
    return outputFile;
}

async function hash_file(filename, algo='sha256') {
    const hasha = require('hasha');

    return await hasha.fromFile(filename, { algorithm: algo }).then(hash => {
        return Promise.resolve(hash);
    });
}

module.exports = {
    convertVideoToWav: convertVideoToWav,
    convertWavFileToSrt: convertWavFileToSrt,
    downloadFile: downloadFile,
    copy_file: copy_file,
    download_from_youtube_url: download_from_youtube_url,
    hash_file: hash_file
}