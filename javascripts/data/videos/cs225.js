// Video sources
var VIDEOS = [
  // Lecture 1
  ["Full Lecture Video 1 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part0.mp3"],
  ["Full Lecture Video 1 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part1.mp3"],
  ["Full Lecture Video 1 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part2.mp3"],
  ["Full Lecture Video 1 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part3.mp3"],
  ["Full Lecture Video 1 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part4.mp3"],
  ["Full Lecture Video 1 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part5.mp3"],
  ["Full Lecture Video 1 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part6.mp3"],
  ["Full Lecture Video 1 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part7.mp3"],
  ["Full Lecture Video 1 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part8.mp3"],
  ["Full Lecture Video 1 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part9.mp3"],
  ["Full Lecture Video 1 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_01/Full_Lecture_Video_01_part10.mp3"],

  // Lecture 2
  ["Full Lecture Video 2 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part0.mp3"],
  ["Full Lecture Video 2 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part1.mp3"],
  ["Full Lecture Video 2 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part2.mp3"],
  ["Full Lecture Video 2 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part3.mp3"],
  ["Full Lecture Video 2 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part4.mp3"],
  ["Full Lecture Video 2 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part5.mp3"],
  ["Full Lecture Video 2 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part6.mp3"],
  ["Full Lecture Video 2 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part7.mp3"],
  ["Full Lecture Video 2 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part8.mp3"],
  ["Full Lecture Video 2 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part9.mp3"],
  ["Full Lecture Video 2 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_02/Full_Lecture_Video_02_part10.mp3"],

  // Lecture 3
  ["Full Lecture Video 3 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part0.mp3"],
  ["Full Lecture Video 3 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part1.mp3"],
  ["Full Lecture Video 3 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part2.mp3"],
  ["Full Lecture Video 3 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part3.mp3"],
  ["Full Lecture Video 3 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part4.mp3"],
  ["Full Lecture Video 3 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part5.mp3"],
  ["Full Lecture Video 3 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part6.mp3"],
  ["Full Lecture Video 3 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part7.mp3"],
  ["Full Lecture Video 3 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part8.mp3"],
  ["Full Lecture Video 3 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_03/Full_Lecture_Video_03_part9.mp3"],

  // Lecture 4
  ["Full Lecture Video 4 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part0.mp3"],
  ["Full Lecture Video 4 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part1.mp3"],
  ["Full Lecture Video 4 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part2.mp3"],
  ["Full Lecture Video 4 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part3.mp3"],
  ["Full Lecture Video 4 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part4.mp3"],
  ["Full Lecture Video 4 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part5.mp3"],
  ["Full Lecture Video 4 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part6.mp3"],
  ["Full Lecture Video 4 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part7.mp3"],
  ["Full Lecture Video 4 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part8.mp3"],
  ["Full Lecture Video 4 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part9.mp3"],
  ["Full Lecture Video 4 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_04/Full_Lecture_Video_04_part10.mp3"],

  // Lecture 5
  ["Full Lecture Video 5 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part0.mp3"],
  ["Full Lecture Video 5 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part1.mp3"],
  ["Full Lecture Video 5 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part2.mp3"],
  ["Full Lecture Video 5 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part3.mp3"],
  ["Full Lecture Video 5 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part4.mp3"],
  ["Full Lecture Video 5 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part5.mp3"],
  ["Full Lecture Video 5 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part6.mp3"],
  ["Full Lecture Video 5 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part7.mp3"],
  ["Full Lecture Video 5 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part8.mp3"],
  ["Full Lecture Video 5 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part9.mp3"],
  ["Full Lecture Video 5 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_05/Full_Lecture_Video_05_part10.mp3"],


  // Lecture 6
  ["Full Lecture Video 6 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part0.mp3"],
  ["Full Lecture Video 6 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part1.mp3"],
  ["Full Lecture Video 6 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part2.mp3"],
  ["Full Lecture Video 6 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part3.mp3"],
  ["Full Lecture Video 6 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part4.mp3"],
  ["Full Lecture Video 6 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part5.mp3"],
  ["Full Lecture Video 6 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part6.mp3"],
  ["Full Lecture Video 6 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part7.mp3"],
  ["Full Lecture Video 6 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part8.mp3"],
  ["Full Lecture Video 6 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part9.mp3"],
  ["Full Lecture Video 6 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_06/Full_Lecture_Video_06_part10.mp3"],

  // Lecture 7
  ["Full Lecture Video 7 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part0.mp3"],
  ["Full Lecture Video 7 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part1.mp3"],
  ["Full Lecture Video 7 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part2.mp3"],
  ["Full Lecture Video 7 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part3.mp3"],
  ["Full Lecture Video 7 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part4.mp3"],
  ["Full Lecture Video 7 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part5.mp3"],
  ["Full Lecture Video 7 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part6.mp3"],
  ["Full Lecture Video 7 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part7.mp3"],
  ["Full Lecture Video 7 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_07/Full_Lecture_Video_07_part8.mp3"],

  // Lecture 8
  ["Full Lecture Video 8 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part0.mp3"],
  ["Full Lecture Video 8 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part1.mp3"],
  ["Full Lecture Video 8 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part2.mp3"],
  ["Full Lecture Video 8 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part3.mp3"],
  ["Full Lecture Video 8 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part4.mp3"],
  ["Full Lecture Video 8 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part5.mp3"],
  ["Full Lecture Video 8 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part6.mp3"],
  ["Full Lecture Video 8 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part7.mp3"],
  ["Full Lecture Video 8 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part8.mp3"],
  ["Full Lecture Video 8 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_08/Full_Lecture_Video_08_part9.mp3"],


  // Lecture 9
  ["Full Lecture Video 9 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part0.mp3"],
  ["Full Lecture Video 9 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part1.mp3"],
  ["Full Lecture Video 9 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part2.mp3"],
  ["Full Lecture Video 9 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part3.mp3"],
  ["Full Lecture Video 9 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part4.mp3"],
  ["Full Lecture Video 9 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part5.mp3"],
  ["Full Lecture Video 9 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part6.mp3"],
  ["Full Lecture Video 9 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part7.mp3"],
  ["Full Lecture Video 9 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part8.mp3"],
  ["Full Lecture Video 9 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_09/Full_Lecture_Video_09_part9.mp3"],

  // Lecture 16
  ["Full Lecture Video 16 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part0.mp3"],
  ["Full Lecture Video 16 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part1.mp3"],
  ["Full Lecture Video 16 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part2.mp3"],
  ["Full Lecture Video 16 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part3.mp3"],
  ["Full Lecture Video 16 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part4.mp3"],
  ["Full Lecture Video 16 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part5.mp3"],
  ["Full Lecture Video 16 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part6.mp3"],
  ["Full Lecture Video 16 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part7.mp3"],
  ["Full Lecture Video 16 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part8.mp3"],
  ["Full Lecture Video 16 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part9.mp3"],
  ["Full Lecture Video 16 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_16/Full_Lecture_Video_16_part10.mp3"],

  // Lecture 17
  ["Full Lecture Video 17 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part0.mp3"],
  ["Full Lecture Video 17 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part1.mp3"],
  ["Full Lecture Video 17 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part2.mp3"],
  ["Full Lecture Video 17 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part3.mp3"],
  ["Full Lecture Video 17 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part4.mp3"],
  ["Full Lecture Video 17 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part5.mp3"],
  ["Full Lecture Video 17 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part6.mp3"],
  ["Full Lecture Video 17 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part7.mp3"],
  ["Full Lecture Video 17 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part8.mp3"],
  ["Full Lecture Video 17 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part9.mp3"],
  ["Full Lecture Video 17 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_17/Full_Lecture_Video_17_part10.mp3"],

  // Lecture 18
  ["Full Lecture Video 18 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part0.mp3"],
  ["Full Lecture Video 18 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part1.mp3"],
  ["Full Lecture Video 18 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part2.mp3"],
  ["Full Lecture Video 18 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part3.mp3"],
  ["Full Lecture Video 18 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part4.mp3"],
  ["Full Lecture Video 18 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part5.mp3"],
  ["Full Lecture Video 18 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part6.mp3"],
  ["Full Lecture Video 18 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part7.mp3"],
  ["Full Lecture Video 18 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part8.mp3"],
  ["Full Lecture Video 18 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part9.mp3"],
  ["Full Lecture Video 18 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_18/Full_Lecture_Video_18_part10.mp3"],

  // Lecture 19
  ["Full Lecture Video 19 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part0.mp3"],
  ["Full Lecture Video 19 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part1.mp3"],
  ["Full Lecture Video 19 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part2.mp3"],
  ["Full Lecture Video 19 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part3.mp3"],
  ["Full Lecture Video 19 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part4.mp3"],
  ["Full Lecture Video 19 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part5.mp3"],
  ["Full Lecture Video 19 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part6.mp3"],
  ["Full Lecture Video 19 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part7.mp3"],
  ["Full Lecture Video 19 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part8.mp3"],
  ["Full Lecture Video 19 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part9.mp3"],
  ["Full Lecture Video 19 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_19/Full_Lecture_Video_19_part10.mp3"],

  // Lecture 20
  ["Full Lecture Video 20 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part0.mp3"],
  ["Full Lecture Video 20 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part1.mp3"],
  ["Full Lecture Video 20 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part2.mp3"],
  ["Full Lecture Video 20 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part3.mp3"],
  ["Full Lecture Video 20 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part4.mp3"],
  ["Full Lecture Video 20 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part5.mp3"],
  ["Full Lecture Video 20 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part6.mp3"],
  ["Full Lecture Video 20 Part 7", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part7.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part7.mp3"],
  ["Full Lecture Video 20 Part 8", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part8.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part8.mp3"],
  ["Full Lecture Video 20 Part 9", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part9.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part9.mp3"],
  ["Full Lecture Video 20 Part 10", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part10.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/CS225/Lecture_20/Full_Lecture_Video_20_part10.mp3"],
];

$(document).ready(function () {
  VIDEOS.forEach(function (video, i) {
    var title = video[0];
    var src = video[1];
    var template = '<option class="video-option" value="' + i + '">' + title + '</option>';
    $(".video-selector").append(template);
  });
});

/*
  Loads the selected video
*/
function loadVideo(videoIndex) {
  var videoSrc = VIDEOS[videoIndex][1];
  $(".main-video-source").attr("src", videoSrc);
  $(".main-video").get(0).load();
}