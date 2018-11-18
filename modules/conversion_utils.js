'use strict';
//var db = require('../db/db');

//var youtubedl = require('youtube-dl');
var youtube_google_api_key = process.env.YOUTUBE_API_KEY;
var azureSubscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY;
var azureRegion = process.env.AZURE_REGION;
const _dirname = '/data/';

function convertVideoToWav(pathToFile) {
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

    return ffmpeg.then(result => { return Promise.resolve(outputFile) });
    // return ffmpeg.then(result => { console.log(result) });
}

function convertWavFileToSrt(pathToFile) {
    var outputFile = _dirname + pathToFile.substring(pathToFile.lastIndexOf('/') + 1, pathToFile.lastIndexOf('.')) + '.srt';
    const { spawn } = require('child-process-promise');
    const dotnet = spawn('dotnet', ['/MSTranscription/Release/MSTranscription.dll', azureSubscriptionKey, azureRegion, pathToFile]);
    dotnet.childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    dotnet.childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    return dotnet.then(result => {
        return Promise.resolve(outputFile)
    });
}

module.exports = {
    convertVideoToWav: convertVideoToWav,
    convertWavFileToSrt: convertWavFileToSrt
}