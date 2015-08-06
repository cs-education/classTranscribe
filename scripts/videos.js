var videoIndex = process.argv[2];

for (var i = 0; i < 11; i++) {
  console.log(
    '["Full Lecture Video ' +
    videoIndex +
    ' Part ' +
    i +
    '", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_' +
    videoIndex +
    '/Full_Lecture_Video_' +
    videoIndex +
    '_part' +
    i +
    '.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_' +
    videoIndex +
    '/Full_Lecture_Video_' +
    videoIndex +
    '_part' +
    i +
    '.mp3"],')
}
