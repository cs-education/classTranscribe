/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var videoIndex = process.argv[2];

for (var i = 0; i < 11; i++) {
  console.log(
    '["Full Lecture Video ' +
    videoIndex +
    ' Part ' +
    i +
    '", "https://s3-us-west-2.amazonaws.com/classtranscribes3s3/CS225/Lecture_' +
    videoIndex +
    '/Full_Lecture_Video_' +
    videoIndex +
    '_part' +
    i +
    '.mp4", "https://s3-us-west-2.amazonaws.com/classtranscribes3s3/CS225/Lecture_' +
    videoIndex +
    '/Full_Lecture_Video_' +
    videoIndex +
    '_part' +
    i +
    '.mp3"],')
}
