var fs = require('fs');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;

var className = process.argv[2];
var videoDirectory = process.argv[3];
var videoRoot = videoLocation.slice(0, -4);

var videos = fs.readdirSync(videoDirectory).filter(function (video) {
  return video.indexOf("Lecture") > -1;
});

var extension = videos[0].slice(-4);

videos = videos.map(function (video) {
  return video.replace(extension, "");
});

function ffmpegAudio() {
  //check if each arg needs to be in separate string or if all middle can be put together
  var numComplete = 0;

  videos.forEach(function (video) {
    var ffmpegAudioArgs = ['ffmpeg',
                          '-i', video + extension,
                          '-f', 'wav',
                          '-ar', 22050,
                          videoRoot + '.wav'];

    console.log('starting to encode audio');
    var ffmpegChild = spawn('nice', ffmpegAudioArgs);

    ffmpegChild.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegChild.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    ffmpegChild.on('close', (code) => {
      numComplete++
      console.log(`child process exited with code ${code}`);
      console.log(numComplete);

      if (videos.length === numComplete) {
        ffmpegVideo();
      }
    });
  }); 
}

function ffmpegVideo() {
  //check if each arg needs to be in separate string or if all middle can be put together
  var ffmpegVideoArgs = ['ffmpeg',
    '-i',
    videoLocation,
    '-codec:v',
    'libx264',
    '-profile:v', 'high',
    '-preset', 'slow',
    '-b:v', '500k',
    '-maxrate', '500k',
    '-bufsize', '1000k',
    '-threads', 0,
    videoRoot + '.mp4'];

  console.log('starting to encode video');
  var ffmpegChild = spawn('nice', ffmpegVideoArgs);

  var numComplete = 0;

  videos.forEach(function (video) {
    var ffmpegAudioArgs = ['ffmpeg',
      '-i', videoLocation,
      '-f', 'wav',
      '-ar', 22050,
      videoRoot + '.wav'];

    console.log('starting to encode audio');
    var ffmpegChild = spawn('nice', ffmpegVideoArgs);

    ffmpegChild.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegChild.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    ffmpegChild.on('close', (code) => {
      numComplete++
      console.log(`child process exited with code ${code}`);
      console.log(numComplete);

      if (videos.length === numComplete) {
        splitVideo();
      }
    });
  });
}


function splitVideo() {
  var splitArgs = ['scripts/splitRunner.js',
  videoDirectory];

  console.log('starting to split');
  var splitChild = spawn('node', splitArgs);

  splitChild.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  splitChild.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  splitChild.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    createTasks();
  });
}

function createTasks() {
  var createArgs = ['scripts/taskInitializer.js',
                    '-i',
                    videoLocation,
                    '-codec:v',
                    'libx264',
                    '-profile:v', 'high', 
                    '-preset', 'slow', 
                    '-b:v', '500k', 
                    '-maxrate', '500k', 
                    '-bufsize', '1000k', 
                    '-threads', 0,
                    videoRoot + '.mp4'];

  console.log('starting to create tasks');
  var createTasksChild = spawn('nice', splitArgs);

  createTasksChild.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  createTasksChild.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  createTasksChild.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    createTasks();
  });
}

function uploadTasks() {
  var uploadArgs = ['put',
                    '-i',
                    videoLocation,
                    '--acl-public',
                    '-r',
                    videoDirectory,
                    's3://<s3_bucket_name>/' + className + '/'
                    ];

  console.log('starting to upload to s3');
  var uploadChild = spawn('s3cmd', uploadArgs);

  uploadChild.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  uploadChild.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  uploadChild.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    cleanup();
  });
}

function cleanup() {
  // delete local files
}

// should iterate over files in the ffmpeg functions, rest already iterate
ffmpegAudio();