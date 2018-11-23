﻿'use strict';

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

module.exports = {
    convertVideoToWav: convertVideoToWav,
    convertWavFileToSrt: convertWavFileToSrt,
    downloadFile: downloadFile,
    download_from_youtube_url: download_from_youtube_url
}