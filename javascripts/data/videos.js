// Video sources
var VIDEOS = [
  // ["video title", "video source"]
  ["Mini Video: Hello World", "https://cs-education.github.io/sysassets/mp4/0010-HelloWorld-v2.mp4"],
  ["Mini Video: Hello Std Err", "https://cs-education.github.io/sysassets/mp4/0020-HelloStdErr-24fps600kbs.mp4"],
  ["Mini Video: Open and Create a file", "https://cs-education.github.io/sysassets/mp4/0030-OpenCreateAFile-650kb.mp4"],
  ["Mini Video: Open Errors and Printf", "https://cs-education.github.io/sysassets/mp4/0040-OpenErrorsPrintf-600kbs.mp4"],
  ["Mini Video: Not All Bytes Are 8Bits", "https://cs-education.github.io/sysassets/mp4/0050-NotAllBytesAre8Bits.mp4"],
  ["Mini Video: Follow The Int Pointer", "https://cs-education.github.io/sysassets/mp4/0060-FollowTheIntPointer.mp4"],
  ["Mini Video: Character Pointers", "https://cs-education.github.io/sysassets/mp4/0070-CharacterPointers.mp4"],
  ["Mini Video: Program Arguments", "https://cs-education.github.io/sysassets/mp4/0080-ProgramArguments.mp4"],
  ["Mini Video: Environment", "https://cs-education.github.io/sysassets/mp4/0090-Environment.mp4"],
  ["Mini Video: Char Array Searching", "https://cs-education.github.io/sysassets/mp4/0100-CharArraySearching.mp4"],
  ["Mini Video: Pointers To Automatic Variables", "https://cs-education.github.io/sysassets/mp4/0110-PointersToAutomaticVariables-v2.mp4"],
  ["Mini Video: Time For Mallocing Heap Memory", "https://cs-education.github.io/sysassets/mp4/0120-TimeForMallocingHeapMemory.mp4"],
  ["Mini Video: HeapGotchas -Dangling Pointers And Double Free", "https://cs-education.github.io/sysassets/mp4/0130-HeapGotchas-DanglingPointersAndDoubleFree.mp4"],
  ["Mini Video: Struct Typedef LinkedList", "https://cs-education.github.io/sysassets/mp4/0140-StructTypedefLinkedList.mp4"],
  ["Mini Video: Creating Links Strdup", "https://cs-education.github.io/sysassets/mp4/0150-CreatingLinksStrdup.mp4"],
  ["Mini Video: Get Put Char", "https://cs-education.github.io/sysassets/mp4/0160-getputchar-gets-puts-v2.mp4"],
  ["Mini Video: Scanf Intro", "https://cs-education.github.io/sysassets/mp4/0170-scanf-intro.mp4"],
  ["Mini Video: Getline", "https://cs-education.github.io/sysassets/mp4/0180-getline.mp4"],
  ["Mini Video: SIGINT SIGALRM", "https://cs-education.github.io/sysassets/mp4/0190-SIGINT-SIGALRM.mp4"],
  ["Mini Video: Fork Waitpid Forkbomb", "https://cs-education.github.io/sysassets/mp4/0200-forkwaitpid-forkbomb.mp4"],
  // Lecture 0
  ["Full Lecture Video 0 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part0.webm"],
  ["Full Lecture Video 0 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part1.webm"],
  ["Full Lecture Video 0 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part2.webm"],
  ["Full Lecture Video 0 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part3.webm"],
  ["Full Lecture Video 0 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part4.webm"],
  ["Full Lecture Video 0 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part5.webm"],
  ["Full Lecture Video 0 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_0/media_part6.webm"],
  // Lecture 1
  ["Full Lecture Video 1 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part0.mp3"],
  ["Full Lecture Video 1 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part1.mp3"],
  ["Full Lecture Video 1 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part2.mp3"],
  ["Full Lecture Video 1 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part3.mp3"],
  ["Full Lecture Video 1 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part4.mp3"],
  ["Full Lecture Video 1 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part5.mp3"],
  ["Full Lecture Video 1 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_1/media_1_part6.mp3"],
  // Lecture 2
  ["Full Lecture Video 2 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part0.mp3"],
  ["Full Lecture Video 2 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part1.mp3"],
  ["Full Lecture Video 2 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part2.mp3"],
  ["Full Lecture Video 2 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part3.mp3"],
  ["Full Lecture Video 2 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part4.mp3"],
  ["Full Lecture Video 2 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part5.mp3"],
  ["Full Lecture Video 2 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_2/media_2_part6.mp3"],
  // Lecture 3
  ["Full Lecture Video 3 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part0.mp3"],
  ["Full Lecture Video 3 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part1.mp3"],
  ["Full Lecture Video 3 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part2.mp3"],
  ["Full Lecture Video 3 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part3.mp3"],
  ["Full Lecture Video 3 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part4.mp3"],
  ["Full Lecture Video 3 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part5.mp3"],
  ["Full Lecture Video 3 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_3/media_3_part6.mp3"],
  // Lecture 4
  ["Full Lecture Video 4 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part0.mp3"],
  ["Full Lecture Video 4 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part1.mp3"],
  ["Full Lecture Video 4 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part2.mp3"],
  ["Full Lecture Video 4 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part3.mp3"],
  ["Full Lecture Video 4 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part4.mp3"],
  ["Full Lecture Video 4 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part5.mp3"],
  ["Full Lecture Video 4 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_4/media_4_part6.mp3"],

  // Lecture 5
  ["Full Lecture Video 5 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part0.mp3"],
  ["Full Lecture Video 5 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part1.mp3"],
  ["Full Lecture Video 5 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part2.mp3"],
  ["Full Lecture Video 5 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part3.mp3"],
  ["Full Lecture Video 5 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part4.mp3"],
  ["Full Lecture Video 5 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part5.mp3"],
  ["Full Lecture Video 5 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_5/media_5_part6.mp3"],

  // Lecture 6
  ["Full Lecture Video 6 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part0.mp3"],
  ["Full Lecture Video 6 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part1.mp3"],
  ["Full Lecture Video 6 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part2.mp3"],
  ["Full Lecture Video 6 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part3.mp3"],
  ["Full Lecture Video 6 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part4.mp3"],
  ["Full Lecture Video 6 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part5.mp3"],
  ["Full Lecture Video 6 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_6/media_6_part6.mp3"],

  // Lecture 7
  ["Full Lecture Video 7 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part0.mp3"],
  ["Full Lecture Video 7 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part1.mp3"],
  ["Full Lecture Video 7 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part2.mp3"],
  ["Full Lecture Video 7 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part3.mp3"],
  ["Full Lecture Video 7 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part4.mp3"],
  ["Full Lecture Video 7 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part5.mp3"],
  ["Full Lecture Video 7 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_7/media_7_part6.mp3"],

  // Lecture 8
  ["Full Lecture Video 8 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part0.mp3"],
  ["Full Lecture Video 8 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part1.mp3"],
  ["Full Lecture Video 8 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part2.mp3"],
  ["Full Lecture Video 8 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part3.mp3"],
  ["Full Lecture Video 8 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part4.mp3"],
  ["Full Lecture Video 8 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part5.mp3"],
  ["Full Lecture Video 8 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_8/media_8_part6.mp3"],

  // Lecture 9
  ["Full Lecture Video 9 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part0.mp3"],
  ["Full Lecture Video 9 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part1.mp3"],
  ["Full Lecture Video 9 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part2.mp3"],
  ["Full Lecture Video 9 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part3.mp3"],
  ["Full Lecture Video 9 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part4.mp3"],
  ["Full Lecture Video 9 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part5.mp3"],
  ["Full Lecture Video 9 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_9/media_9_part6.mp3"],

  // Lecture 10
  ["Full Lecture Video 10 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part0.mp3"],
  ["Full Lecture Video 10 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part1.mp3"],
  ["Full Lecture Video 10 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part2.mp3"],
  ["Full Lecture Video 10 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part3.mp3"],
  ["Full Lecture Video 10 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part4.mp3"],
  ["Full Lecture Video 10 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part5.mp3"],
  ["Full Lecture Video 10 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_10/media_10_part6.mp3"],

  // Lecture 11 (SPECIAL CASE)
  ["Full Lecture Video 11 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_11/Lecture_11_part_1.webm"],
  ["Full Lecture Video 11 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_11/Lecture_11_part_2.webm"],
  ["Full Lecture Video 11 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_11/Lecture_11_part_3.webm"],

  // Lecture 12 (QUIZ... NO TRANSCRIPTIONS)

  // Lecture 13
  ["Full Lecture Video 13 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part0.mp3"],
  ["Full Lecture Video 13 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part1.mp3"],
  ["Full Lecture Video 13 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part2.mp3"],
  ["Full Lecture Video 13 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part3.mp3"],
  ["Full Lecture Video 13 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part4.mp3"],
  ["Full Lecture Video 13 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part5.mp3"],
  ["Full Lecture Video 13 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_13/media_13_part6.mp3"],

  // Lecture 14
  ["Full Lecture Video 14 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part0.mp3"],
  ["Full Lecture Video 14 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part1.mp3"],
  ["Full Lecture Video 14 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part2.mp3"],
  ["Full Lecture Video 14 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part3.mp3"],
  ["Full Lecture Video 14 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part4.mp3"],
  ["Full Lecture Video 14 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part5.mp3"],
  ["Full Lecture Video 14 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_14/media_14_part6.mp3"],

  // Lecture 15
  ["Full Lecture Video 15 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part0.mp3"],
  ["Full Lecture Video 15 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part1.mp3"],
  ["Full Lecture Video 15 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part2.mp3"],
  ["Full Lecture Video 15 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part3.mp3"],
  ["Full Lecture Video 15 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part4.mp3"],
  ["Full Lecture Video 15 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part5.mp3"],
  ["Full Lecture Video 15 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_15/media_15_part6.mp3"],

  // Lecture 16 (QUIZ... NO TRANSCRIPTIONS)

  // Lecture 17
  ["Full Lecture Video 17 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part0.mp3"],
  ["Full Lecture Video 17 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part1.mp3"],
  ["Full Lecture Video 17 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part2.mp3"],
  ["Full Lecture Video 17 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part3.mp3"],
  ["Full Lecture Video 17 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part4.mp3"],
  ["Full Lecture Video 17 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part5.mp3"],
  ["Full Lecture Video 17 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_17/media_17_part6.mp3"],

  // Lecture 18
  ["Full Lecture Video 18 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part0.mp3"],
  ["Full Lecture Video 18 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part1.mp3"],
  ["Full Lecture Video 18 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part2.mp3"],
  ["Full Lecture Video 18 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part3.mp3"],
  ["Full Lecture Video 18 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part4.mp3"],
  ["Full Lecture Video 18 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part5.mp3"],
  ["Full Lecture Video 18 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_18/media_18_part6.mp3"],

  // Lecture 19
  ["Full Lecture Video 19 Part 0", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part0.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part0.mp3"],
  ["Full Lecture Video 19 Part 1", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part1.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part1.mp3"],
  ["Full Lecture Video 19 Part 2", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part2.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part2.mp3"],
  ["Full Lecture Video 19 Part 3", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part3.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part3.mp3"],
  ["Full Lecture Video 19 Part 4", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part4.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part4.mp3"],
  ["Full Lecture Video 19 Part 5", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part5.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part5.mp3"],
  ["Full Lecture Video 19 Part 6", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part6.webm", "https://s3-us-west-2.amazonaws.com/classtranscribe/lecture_19/media_19_part6.mp3"],
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