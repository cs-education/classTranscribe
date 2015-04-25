var videoIndex = process.argv[2];

for (var i = 0; i < 7; i++) {
  console.log('["Full Lecture Video ' + videoIndex + ' Part ' + i + '", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_' + videoIndex + '/media_' + videoIndex + '_part' + i + '.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_' + videoIndex + '/media_' + videoIndex + '_part' + i + '.mp3"],')
}
