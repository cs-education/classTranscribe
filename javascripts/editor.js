/*
  Begin Global Variables
*/

  // Video sources
  var VIDEOS = [
    "http://angrave.github.io/sysassets/mp4/0010-HelloWorld-v2.mp4",
    "http://angrave.github.io/sysassets/mp4/0020-HelloStdErr-24fps600kbs.mp4",
    "http://angrave.github.io/sysassets/mp4/0030-OpenCreateAFile-650kb.mp4",
    "http://angrave.github.io/sysassets/mp4/0040-OpenErrorsPrintf-600kbs.mp4",
  ];

  // Transcriptions
  var bobTranscription1 = [{"start":"0:00","end":"0:03","text":"Okay welcome to systems programming"},{"start":"0:03","end":"0:04","text":"so let's get started"},{"start":"0:04","end":"0:06","text":"let's write our first c program"},{"start":"0:06","end":"0:08","text":"that makes use of a system call"},{"start":"0:08","end":"0:11","text":"i'll do an example and then ill let you play as well"},{"start":"0:11","end":"0:14","text":"so uh here's a little virtual machine"},{"start":"0:14","end":"0:15","text":"i've got up and running"},{"start":"0:15","end":"0:18","text":"and i can write a little c file here"},{"start":"0:18","end":"0:22","text":"so what we're going to do is make use of a system call called write"},{"start":"0:22","end":"0:25","text":"so let's try this"},{"start":"0:25","end":"0:27","text":"say okay write"},{"start":"0:27","end":"0:29","text":"and then i need to give it a file descriptor"},{"start":"0:29","end":"0:31","text":"more about that in a moment"},{"start":"0:31","end":"0:33","text":"a little message like hello"},{"start":"0:33","end":"0:38","text":"and then the number of characters or bytes that i actually want to send here"},{"start":"0:38","end":"0:41","text":"so h e l l o"},{"start":"0:41","end":"0:45","text":"that's five bytes we want to send"},{"start":"0:45","end":"0:49","text":"so let's try compiling this"},{"start":"0:49","end":"0:52","text":"and once that's going we'll see that whoops"},{"start":"0:52","end":"0:54","text":"we've got a little bit of a problem here"},{"start":"0:54","end":"0:56","text":"that write was not declare befor"},{"start":"0:56","end":"1:06","text":"okay so the c compiler here is warning us that we're trying to call a function called write which hasn't yet been declared"},{"start":"1:06","end":"1:08","text":"so we could declare it"},{"start":"1:08","end":"1:13","text":"now i happen to know for example that the write signature looks a little something like this"},{"start":"1:13","end":"1:15","text":"it's called write "},{"start":"1:15","end":"1:18","text":"it takes a file descriptor which is going to be an integer"},{"start":"1:18","end":"1:21","text":"it takes a pointer to a character"},{"start":"1:21","end":"1:24","text":"and it takes another integer which is the number of characters to write"},{"start":"1:24","end":"1:26","text":"so it look a little something like that"},{"start":"1:26","end":"1:35","text":"in fact it takes a void pointer which means point to it without any particular type"},{"start":"1:35","end":"1:39","text":"so i could attempt to compile this for example"},{"start":"1:39","end":"1:41","text":"to see if this works"},{"start":"1:41","end":"1:42","text":"and oh ho ho"},{"start":"1:42","end":"1:44","text":"if we look at the left hand side"},{"start":"1:44","end":"1:47","text":"we can see we managed to compile a program called program here"},{"start":"1:47","end":"1:49","text":"and when we ran it we got hello"},{"start":"1:49","end":"1:52","text":"alright so let's do a little better then that though"},{"start":"1:52","end":"1:57","text":"rather than me having to manually write the declaration in here"},{"start":"1:57","end":"2:03","text":"these are already included inside an existing file which we get for free"},{"start":"2:03","end":"2:05","text":"it's actually unistd.h"},{"start":"2:05","end":"2:11","text":"okay so let's tell the preprocessor to read in the contents of the file"},{"start":"2:11","end":"2:13","text":"go in and find a file named unistd.h"},{"start":"2:13","end":"2:16","text":"and include all the text that is in that file"},{"start":"2:16","end":"2:17","text":"okay so now when we run this"},{"start":"2:17","end":"2:21","text":"we'll compile it and run it and great it prints out hello"},{"start":"2:21","end":"2:24","text":"if i wanted to print out hello with a new line"},{"start":"2:24","end":"2:27","text":"let's increment this to six"},{"start":"2:27","end":"2:29","text":"and now i've got a program called Hello"},{"start":"2:29","end":"2:39","text":"okay great and of course i could make my program print out hello world and do it on two different lines"},{"start":"2:39","end":"2:43","text":"alright so uh that's my program working"},{"start":"2:43","end":"2:46","text":"now it's time for you to play"},{"start":"2:46","end":"2:49","text":"you play a program which uses a system call write"},{"start":"2:49","end":"2:52","text":"to write a little message on the two lines"},{"start":"2:52","end":"2:57","text":"see you in the next video after you've said hello to the world"},{"start":"2:57","end":"2:57","text":"bye"}];
  var bobTranscription3 = [{"start":"0:00","end":"0:01","text":"Welcome"},{"start":"0:01","end":"0:06","text":"So let us start creating some files"},{"start":"0:06","end":"0:08","text":"for that we can use a system call open"},{"start":"0:08","end":"0:16","text":"and for open we need to say whether we want to say append to an existing file"},{"start":"0:16","end":"0:17","text":"create a brand new file"},{"start":"0:17","end":"0:20","text":"and we need to give it a filename"},{"start":"0:20","end":"0:23","text":"so for example we might have a filename called output"},{"start":"0:23","end":"0:24","text":".txt"},{"start":"0:24","end":"0:31","text":"so the open call takes two or three arguments"},{"start":"0:31","end":"0:34","text":"the second argument will be exactly what we want to do"},{"start":"0:34","end":"0:41","text":"so in this case we want to say create a brand new file and truncate it back to zero if it doesn't exist"},{"start":"0:41","end":"0:43","text":"so i want to truncate as well"},{"start":"0:43","end":"0:53","text":"if we are creating a new file we better say who can read this file and who can write to this file and who can execute this file"},{"start":"0:53","end":"0:58","text":"so we are going to have to say something about the mode flags "},{"start":"0:58","end":"1:00","text":"who is allowed to do what"},{"start":"1:00","end":"1:04","text":"finally this call is going to give us back an integer"},{"start":"1:04","end":"1:07","text":"a file descriptor just like we've seen so far"},{"start":"1:07","end":"1:09","text":"with file number one and file number two"},{"start":"1:09","end":"1:12","text":"so let's store that inside a little variable"},{"start":"1:12","end":"1:17","text":"so now i better actually find out what the correct syntax is"},{"start":"1:17","end":"1:22","text":"and the correct arguments are in order to create a file"},{"start":"1:22","end":"1:25","text":"so let us go and look that up"},{"start":"1:25","end":"1:28","text":"and that we will find inside the manual"},{"start":"1:28","end":"1:36","text":"and if for example i type man open on a command line on a real linux machine"},{"start":"1:36","end":"1:39","text":"it does not quite work yet in my small virtual one"},{"start":"1:39","end":"1:43","text":"we did not have enough memory to include all the manual pages here"},{"start":"1:43","end":"1:47","text":"so here is a linux manual page i found on the web for the open"},{"start":"1:47","end":"1:52","text":"and you will see here is the function signature here"},{"start":"1:52","end":"1:56","text":"where we are going to pass in an integer for the flags and the mode type"},{"start":"1:56","end":"2:03","text":"so i am going to look up now the flags i need to open and create a new file"},{"start":"2:03","end":"2:05","text":"i do not want to do an append"},{"start":"2:05","end":"2:11","text":"i want to use create and i want to truncate it as well"},{"start":"2:11","end":"2:14","text":"so let us include create create here"},{"start":"2:14","end":"2:21","text":"so i am going to say create which is a constant and i am going to bitwise or it with"},{"start":"2:21","end":"2:24","text":"the flag to say truncate "},{"start":"2:24","end":"2:26","text":"so let us look that up as well"},{"start":"2:26","end":"2:28","text":"truncate "},{"start":"2:28","end":"2:40","text":"alright and i want to say when i open it that i am going to open it for say reading and writing"},{"start":"2:40","end":"2:45","text":"so let us grab that as well"},{"start":"2:45","end":"2:47","text":"so that is the first hting"},{"start":"2:47","end":"2:49","text":"now we need to do the mode"},{"start":"2:49","end":"2:53","text":"so let us write this in a variable"},{"start":"2:53","end":"2:56","text":"and there is actually a typedef"},{"start":"2:56","end":"3:02","text":"it is essentially an integer but it is wrapped up in this type here called mode"},{"start":"3:02","end":"3:04","text":"mode_t"},{"start":"3:04","end":"3:13","text":"and we will say our file we want to be fairly private and only the owner of the file can access it "},{"start":"3:13","end":"3:16","text":"so let us get back and find those flags"},{"start":"3:16","end":"3:17","text":"where are you"},{"start":"3:17","end":"3:18","text":"here we go"},{"start":"3:18","end":"3:22","text":"alright so we will say that the user has read and write permission"},{"start":"3:22","end":"3:29","text":"okay so we will have "},{"start":"3:29","end":"3:31","text":"okay we will copy the read one"},{"start":"3:31","end":"3:37","text":"and we will have write permission as well"},{"start":"3:37","end":"3:44","text":"but no one else in my linux system will be allowed to read it and write it"},{"start":"3:44","end":"3:47","text":"that is the permissions we want"},{"start":"3:47","end":"3:50","text":"so what can we do with this"},{"start":"3:50","end":"3:55","text":"well let us write something out"},{"start":"3:55","end":"4:06","text":"this file we will write a little message great add a new line "},{"start":"4:06","end":"4:09","text":"so how many characters is that"},{"start":"4:09","end":"4:14","text":"we have got one two three four five six and a new line so that is seven characters"},{"start":"4:14","end":"4:18","text":"and then we will close this file descriptor"},{"start":"4:18","end":"4:22","text":"meaning we do not want to use this descriptor anymore"},{"start":"4:22","end":"4:30","text":"and that will ensure as well that all of the bytes that we sent to the file stream have been saved"},{"start":"4:30","end":"4:33","text":"so we are not doing any error checking right now"},{"start":"4:33","end":"4:39","text":"we are just trying to write the smallest possible program right now to create a file and send something to it"},{"start":"4:39","end":"4:43","text":"okay so let us run this and see what we get"},{"start":"4:43","end":"4:49","text":"and we will run into an error which is that we have not defined what this mode t is"},{"start":"4:49","end":"4:53","text":"what we forgot to do is to do the includes"},{"start":"4:53","end":"5:02","text":"the good news is that the man pages tell us which includes we need to put at the top of our program"},{"start":"5:02","end":"5:07","text":"so let us grab those an insert them in here"},{"start":"5:07","end":"5:10","text":"i will just get the formatting correct"},{"start":"5:10","end":"5:12","text":"and run it again"},{"start":"5:12","end":"5:20","text":"so our program ran"},{"start":"5:20","end":"5:24","text":"it is still printing hello to standard out and dot to standard error"},{"start":"5:24","end":"5:28","text":"but hopefully it simply created another file"},{"start":"5:28","end":"5:30","text":"let us have a look at that file"},{"start":"5:30","end":"5:38","text":"i could do ls and see if anything exists say starting with out"},{"start":"5:38","end":"5:41","text":"yes we have got output dot text"},{"start":"5:41","end":"5:43","text":"let us look at the contents of that file"},{"start":"5:43","end":"5:44","text":"and it says great"},{"start":"5:44","end":"5:45","text":"fantastic"},{"start":"5:45","end":"5:46","text":"so now it is your turn to play"},{"start":"5:46","end":"5:51","text":"create a file and see if you can send some bytes to that file"},{"start":"5:51","end":"5:54","text":"so you will be using open write and close"},{"start":"5:54","end":"5:55","text":"bye"}];
  var oliverTranscription2 = [{"start":"0:00","end":"0:03","text":"so let's talk more about this file descriptor"},{"start":"0:03","end":"0:05","text":"i'm going to make my program be a little bit more useful"},{"start":"0:05","end":"0:07","text":"by printing out \"hello world\" a few times"},{"start":"0:07","end":"0:12","text":"so for example have a vraible count here"},{"start":"0:12","end":"0:17","text":"and a little for loop so i'll start with count =5"},{"start":"0:17","end":"0:19","text":"is count > 0"},{"start":"0:19","end":"0:22","text":"each time around the loop we're going to decrement count"},{"start":"0:22","end":"0:26","text":"so in C there is no boolean type"},{"start":"0:26","end":"0:32","text":"instead if I've got an int value which is non 0 that is treated as a true value"},{"start":"0:32","end":"0:39","text":"so I could actually write this more tersely by saying 'hey count'"},{"start":"0:39","end":"0:38","text":"meaning is count a non-0 value"},{"start":"0:38","end":"0:49","text":"and if you compare two things, you'll learn that with an int value of either 0 or 1 they are either the same or different"},{"start":"0:49","end":"0:51","text":"so we're going to print out \"hello world\" 5 times"},{"start":"0:51","end":"0:56","text":"and I want to show you just a little idea here"},{"start":"0:56","end":"1:02","text":"I've got 2 file descriptors which are valid when my program starts"},{"start":"1:02","end":"1:05","text":"and they are called 1 and 2"},{"start":"1:05","end":"1:09","text":"so why might it be useful to have 2 output streams?"},{"start":"1:09","end":"1:14","text":"we'll you can imagine we have a program that is calculating something"},{"start":"1:14","end":"1:18","text":"for example it's thinking of something to say or it's going to write to a file"},{"start":"1:18","end":"1:22","text":"but we may also want to display some error messages back to the user"},{"start":"1:22","end":"1:25","text":"or we might want to print some progress information"},{"start":"1:25","end":"1:33","text":"the first output stream identified by 1 is the standard output"},{"start":"1:33","end":"1:38","text":"and the second one is reserved for error messages"},{"start":"1:38","end":"1:47","text":"let's for example use this. instead of error messages we'll have a little dot"},{"start":"1:47","end":"1:46","text":"we'll run this"},{"start":"1:46","end":"1:52","text":"and if we've got everything correct we should see \"Hello\""},{"start":"1:52","end":"2:01","text":"ok, now, why do we see ./lib?"},{"start":"2:01","end":"2:06","text":"because we said I'm going to give you a pointer and I want you to take"},{"start":"2:06","end":"2:11","text":"the 6 bytes from it, so next 6 characters"},{"start":"2:11","end":"2:19","text":"and we just got whatever happened to be in memory after our ."},{"start":"2:19","end":"2:23","text":"so we only want the dot, so lets change that and run it again"},{"start":"2:23","end":"2:30","text":"and great, we've got \"Hello\" and \".Hello\""},{"start":"2:30","end":"2:31","text":"so right now both the standard output and standard error are going to different places"},{"start":"2:31","end":"2:37","text":"so we can actually change that over here in the console before we start a program"},{"start":"2:37","end":"2:42","text":"our terminal can control where the different output goes"},{"start":"2:42","end":"2:47","text":"so for example I might say I want to take the standard output and put that into a file"},{"start":"2:47","end":"2:49","text":"so \"output.txt\" "},{"start":"2:49","end":"2:58","text":"if I run this before the program starts I'm going to redirect it's output into this new file"},{"start":"2:58","end":"2:59","text":"so what we see on the console output "},{"start":"2:59","end":"3:03","text":"is anything written to standard error"},{"start":"3:03","end":"3:04","text":"the standard output is inside \"output.txt\""},{"start":"3:04","end":"3:09","text":"to prove it let me have a look at that file"},{"start":"3:09","end":"3:11","text":"let me cat the file"},{"start":"3:11","end":"3:13","text":"so \"output.txt\""},{"start":"3:13","end":"3:14","text":"and here it is"},{"start":"3:14","end":"3:16","text":"it says Hello x 5"},{"start":"3:16","end":"3:19","text":"now, rather than writing 1 and 2 over here"},{"start":"3:19","end":"3:22","text":"perhaps we should have some constants"},{"start":"3:22","end":"3:26","text":"which signify what these values actually mean"},{"start":"3:26","end":"3:31","text":"we could start to #define things"},{"start":"3:31","end":"3:36","text":"so I'll have a STDOUT_FILENO 1"},{"start":"3:36","end":"3:43","text":"and STDERR_FILENO 2"},{"start":"3:43","end":"3:48","text":"so anytime you do #define you're talking to the preprocessor"},{"start":"3:48","end":"3:59","text":"to say \"hey, in the future if you come across this character sequence then replace it with this value\""},{"start":"3:59","end":"4:04","text":"so we can compile this, except I've got a surprise for you"},{"start":"4:04","end":"4:12","text":"which is that these particular macros are already defined inside unistd.h"},{"start":"4:12","end":"4:16","text":"so I don't actually need to define them here in my program"},{"start":"4:16","end":"4:19","text":"so that's my little program"},{"start":"4:19","end":"4:22","text":"you see it's got a return value of 0"},{"start":"4:22","end":"4:27","text":"which is a convention for being correct and no errors"},{"start":"4:27","end":"4:31","text":"but it's up to us, we could choose a different value"},{"start":"4:31","end":"4:34","text":"for example we could choose the value 42"},{"start":"4:34","end":"4:39","text":"and I don't see an output value"},{"start":"4:39","end":"4:45","text":"but I can find out what the last exit value of the last process was"},{"start":"4:45","end":"4:46","text":"let me print out"},{"start":"4:46","end":"4:50","text":"happens to be some special variables"},{"start":"4:50","end":"4:54","text":"so \"echo $?\""},{"start":"4:54","end":"4:59","text":"which means give me the exit value or status of the last command run"},{"start":"4:59","end":"5:05","text":"we've covered quite a bit of ground"},{"start":"5:05","end":"5:14","text":"we've talked about how in C any non-0 integer is considered true"},{"start":"5:14","end":"5:16","text":"and 0 is considered false"},{"start":"5:16","end":"5:22","text":"and we've talked about these two different output streams"},{"start":"5:22","end":"5:25","text":"now It's your turn to play with this"},{"start":"5:25","end":"5:34","text":"after that let's have a go at creating some new files directly from C by making some system calls"},{"start":"5:34","end":"5:37","text":"have fun playing! bye"}];
  var oliverTranscription3 = [{"start":"0:00","end":"0:06","text":"welcome, ok so lets start creating some files"},{"start":"0:06","end":"0:09","text":"for that we can use the system call open()"},{"start":"0:09","end":"0:20","text":"and for open we need to say whether we want to append to an existing file, create a brand new file, and we need to give it a filename"},{"start":"0:20","end":"0:25","text":"for example we might have a file named \"output.txt\""},{"start":"0:25","end":"0:28","text":"so the open() call"},{"start":"0:28","end":"0:33","text":"takes 2 or 3 arguements. the second arguement will be exactly what we want to do"},{"start":"0:33","end":"0:42","text":"so in this case we want to say create a brand new file and truncate it back to 0 if it doesn't exist"},{"start":"0:42","end":"1:00","text":"if we're creating a new file we'd better say who can read this file, and who can write and execute. so w'ere going to have to say something about the mode flag"},{"start":"1:00","end":"1:06","text":"finally this call is going to give us back an integer, a file descriptor"},{"start":"1:06","end":"1:09","text":"just like we've seen so far with file number 1 and file number 2"},{"start":"1:09","end":"1:11","text":"so lets store that inside a litler variable"},{"start":"1:11","end":"1:18","text":"ok, so now I better actually find out what the correct syntax is"},{"start":"1:18","end":"1:21","text":"and the correct arguments are in order to create a file"},{"start":"1:21","end":"1:24","text":"so lets go and look that up"},{"start":"1:24","end":"1:26","text":"and that we'll find inside the manual"},{"start":"1:26","end":"1:43","text":"and if, for example, I type man open on a command line on a real linux machine, it doesn't quite work on my little virtual machine"},{"start":"1:43","end":"1:48","text":"but heres a linux manual page I found on the web for the open()"},{"start":"1:48","end":"1:59","text":"and you'll see the function signature here, where we're going to pass in an int for the flags and the mode type"},{"start":"1:59","end":"2:03","text":"so now I'm going to look up the flags I need to open and create a new file"},{"start":"2:03","end":"2:07","text":"I don't want to do append, I want to use create"},{"start":"2:07","end":"2:12","text":"and I want to truncate it as well"},{"start":"2:12","end":"2:29","text":"so lets include \"O_CREAT\" and I'm going to bitwise or it with the flag to truncate \"O_TRUNC\""},{"start":"2:29","end":"2:37","text":"alright, uh and I want to say when I open it"},{"start":"2:37","end":"2:48","text":"I'm going to open it for say reading and writing"},{"start":"2:48","end":"2:44","text":"so let's grab that as well"},{"start":"2:44","end":"2:48","text":"ok so that's the first thing and now we need to do the mode"},{"start":"2:48","end":"2:53","text":"ok lets write this as a variable"},{"start":"2:53","end":"3:02","text":"there's actually a typedef, it's essentially an integer but it's wrapped up in this \"mode_t\" type"},{"start":"3:02","end":"3:13","text":"we'll say that with our file we want to be fairly private and only the owner of the file can access it"},{"start":"3:13","end":"3:16","text":"so let's go back up and find those flags"},{"start":"3:16","end":"3:17","text":"here we go"},{"start":"3:17","end":"3:27","text":"right, so we'll say that the user has read and write permission"},{"start":"3:27","end":"3:36","text":"we'll copy the read one \"S_IRUSR\""},{"start":"3:36","end":"3:40","text":"and we'll have write permission as well"},{"start":"3:40","end":"3:45","text":"but no one else in my linux system will be able to read it and write it"},{"start":"3:45","end":"3:48","text":"so that's the permissions we want"},{"start":"3:48","end":"3:50","text":"so what can we do with this"},{"start":"3:50","end":"3:55","text":"let's write something out to this file"},{"start":"3:55","end":"4:06","text":"um, we will write a little message \"Great!\" and a new line"},{"start":"4:06","end":"4:09","text":"so how many characters is that"},{"start":"4:09","end":"4:13","text":"1 2 3 4 5 6 and a new line, so that's 7 characters"},{"start":"4:13","end":"4:18","text":"and then we will close this file descriptor"},{"start":"4:18","end":"4:21","text":"meaning we don't want to use this descriptor anymore"},{"start":"4:21","end":"4:27","text":"and that will ensure that all the bytes that we sent to the file"},{"start":"4:27","end":"4:30","text":"stream have been saved"},{"start":"4:30","end":"4:32","text":"ok, so we're not doing any error checking right now"},{"start":"4:32","end":"4:39","text":"we just tried to write the smallest possible program to create a file and send something to it"},{"start":"4:39","end":"4:43","text":"so lets run this and see what we get"},{"start":"4:43","end":"4:49","text":"and we'll run into an error which is that we haven't defined what this mode_t is"},{"start":"4:49","end":"4:54","text":"what we forgot to do was the include statements"},{"start":"4:54","end":"5:02","text":"the good news is that the man pages tell us which includes we need to put at the top of our program"},{"start":"5:02","end":"5:03","text":"so lets grab those"},{"start":"5:03","end":"5:06","text":"and insert them in here"},{"start":"5:06","end":"5:10","text":"just get the formatting correct"},{"start":"5:10","end":"5:13","text":"and run it again"},{"start":"5:13","end":"5:27","text":"right, so our program ran, it's still printing \"hello\" to std out and \".\" to std err"},{"start":"5:27","end":"5:31","text":"but hopefully it's also creating another file"},{"start":"5:31","end":"5:34","text":"i can do LS and see if anything exists"},{"start":"5:34","end":"5:37","text":"say starting with out"},{"start":"5:37","end":"5:39","text":"yes, we've got output.txt"},{"start":"5:39","end":"5:43","text":"now lets look at the contents of that file"},{"start":"5:43","end":"5:45","text":"and it says great! fantastic"},{"start":"5:45","end":"5:47","text":"now it's your turn to play"},{"start":"5:47","end":"5:50","text":"create a file and see if you can "},{"start":"5:50","end":"5:52","text":"send some bytes to that file"},{"start":"5:52","end":"5:55","text":"so you'll be using open(), write() and close()"},{"start":"5:55","end":"5:55","text":"bye"}];
  var surtaiTranscription2 = [{"start":"0:00","end":"0:03","text":"So let's talk more about that file descriptor."},{"start":"0:03","end":"0:09","text":"I'm gonna make my program be a little bit more useful by printing out Hello World a few times."},{"start":"0:09","end":"0:14","text":"For example, I have a variable 'count' here and a little for-loop."},{"start":"0:14","end":"0:21","text":"Start count equals five, while count greater than zero."},{"start":"0:21","end":"0:25","text":"Each time we loop we're going to decrement 'count'"},{"start":"0:25","end":"0:27","text":"In C, there is no boolean type."},{"start":"0:27","end":"0:30","text":"If I got an integer value which is nonzero, that's treated as a 'true' value."},{"start":"0:30","end":"0:39","text":"So, I could actually write this more tersely just by saying \"hey, count!\""},{"start":"0:39","end":"0:40","text":"Because count is a non-zero value."},{"start":"0:40","end":"0:49","text":"And if you compare two things, you'll learn that with each value of either zero or one would mean if they're same or different."},{"start":"0:49","end":"0:54","text":"So, we're going to print out 'Hello World' five times."},{"start":"0:54","end":"1:00","text":"I want to show you just a little idea here that actually I've got two file descriptors."},{"start":"1:00","end":"1:05","text":"I've got two file descriptors which are valid when my program starts."},{"start":"1:05","end":"1:07","text":"And they're called 1 and 2."},{"start":"1:07","end":"1:10","text":"Why might it be useful to have two output streams?"},{"start":"1:10","end":"1:16","text":"We could imagine a program that is calculating something (for example, it's thinking something to say or it's writing to a file)"},{"start":"1:16","end":"1:21","text":"but we also might also want to display some error messages back to the user."},{"start":"1:21","end":"1:27","text":"We might also want to print some progress information."},{"start":"1:27","end":"1:32","text":"So the first output stream, identified by the number 1."},{"start":"1:32","end":"1:34","text":"Is the regular output (the standard output)"},{"start":"1:34","end":"1:37","text":"The second one is reserved for error messages."},{"start":"1:37","end":"1:46","text":"Let's, for example, use this. Instead of error messages, we'll put a little dot to see this"},{"start":"1:46","end":"2:00","text":"We'll run this and we should (if we got everything correct) see \"Hello\" and...lib lib lib lib"},{"start":"2:00","end":"2:14","text":"Now, why do we see \".lib\", because we said \"hey, I'm going to give you a pointer and I want you to use that pointer and take the next 6 bytes from it which is the next  six character"},{"start":"2:14","end":"2:20","text":"So we just got whatever happened to be in memory after our dot. So, we only wanted to do the dot"},{"start":"2:20","end":"2:23","text":"Change that and run it again"},{"start":"2:23","end":"2:30","text":"And great, we've got Hello and dot Hello dot Hello"},{"start":"2:30","end":"2:32","text":"So, right now, both the output and the standard error are going to different places"},{"start":"2:32","end":"2:39","text":"we could actually change that over here in the console before we start the program"},{"start":"2:39","end":"2:44","text":"Our terminal can actually control where the output goes"},{"start":"2:44","end":"2:47","text":"So, for example, I might say, I want to take the standard output and put that into a file."},{"start":"2:47","end":"2:50","text":"So, \"output.txt\""},{"start":"2:50","end":"2:57","text":"So now, if I run this before the program starts, I'm going to redirect it's output into this new file"},{"start":"2:57","end":"3:03","text":"Okay, so what we see on the console output is anything written to standard error"},{"start":"3:03","end":"3:05","text":"The standard output is inside output.txt"},{"start":"3:05","end":"3:10","text":"To prove it, let me have a look at that file."},{"start":"3:10","end":"3:11","text":"Let me cat that file"},{"start":"3:11","end":"3:13","text":"So, output.txt"},{"start":"3:13","end":"3:17","text":"And here it is! It says \"hello, hello, hello, hello\""},{"start":"3:17","end":"3:24","text":"Now, for all those writing 1 and 2 over here, perhaps we should actually have some constants"},{"start":"3:24","end":"3:27","text":"which signify what those values actually mean"},{"start":"3:27","end":"3:38","text":"We could say start define things to say have a constant here, I'll call it say \"STDOUT_FILENO 1\""},{"start":"3:38","end":"3:44","text":"And I'll say define STDERRFILENO 2"},{"start":"3:44","end":"4:02","text":"Anytime you use hash define, you're talking to the preprocessor to say \"hey, in the future, parts of this file, if you come across this character sequence, then replace it (in this case) with either a 1 or a 2 depending on what it is\""},{"start":"4:02","end":"4:14","text":"We can compile this, except I'm going to surprise you which is that these particular macros are already defined within unistd.h"},{"start":"4:14","end":"4:17","text":"So, I don't need to define them here in my program."},{"start":"4:17","end":"4:29","text":"You see it's got a return value of zero. Which is a convention for being correct (no errors)"},{"start":"4:29","end":"4:37","text":"But it's up to us. We could choose a different value, we could choose the value 42."},{"start":"4:37","end":"4:46","text":"And, I don't see an output value, but I can find out what the last exit value was of the last process"},{"start":"4:46","end":"4:48","text":"Let me print out"},{"start":"4:48","end":"4:53","text":"It happens to be inside special variables"},{"start":"4:53","end":"4:55","text":"Hello terminal value of this dollar question mark."},{"start":"4:55","end":"5:00","text":"which means give me the exit value (or the exit status) of the last command run."},{"start":"5:00","end":"5:03","text":"So there's our forty-two."},{"start":"5:03","end":"5:14","text":"Okay so, we've covered quite a bit of ground. We've talked about how in C, any non-zero integer is considered \"true\""},{"start":"5:14","end":"5:16","text":"and zero is considered \"false\""},{"start":"5:16","end":"5:31","text":"And, we've talked about these two different output streams. Now it's your turn to play with this. After that, let's have a go at creating some new files directly from C"},{"start":"5:31","end":"5:33","text":"by making system calls"},{"start":"5:33","end":"5:37","text":"So, now it's your turn. Have fun playing! Bye."}];
  var surtaiTranscription3 = [{"start":"0:00","end":"0:06","text":"Welcome, so let's start creating some files."},{"start":"0:06","end":"0:10","text":"For that, we can use the system call open()"},{"start":"0:10","end":"0:19","text":"For open() we need to say whether we want to append to an existing file, create a brand file, and we need to give it a file name."},{"start":"0:19","end":"0:26","text":"For example, I might have a file name called \"output.txt\""},{"start":"0:26","end":"0:31","text":"So, the open() call takes 2 or 3 arguments."},{"start":"0:31","end":"0:35","text":"The second argument will be exactly what we want to do."},{"start":"0:35","end":"0:39","text":"In this case, we want to say \"create a brand new file\""},{"start":"0:39","end":"0:43","text":"\"and truncate it back to zero if it doesn't exist\""},{"start":"0:43","end":"0:46","text":"so, I want to truncate as well"},{"start":"0:46","end":"0:54","text":"If we're creating a new file, we better say \"who can read this file and who can write this file and who can execute this file\""},{"start":"0:54","end":"1:01","text":"so, we going to have to say something about the mode flags: who's allowed to do what"},{"start":"1:01","end":"1:06","text":"finally, this call is going to give us back an integer, a file descriptor"},{"start":"1:06","end":"1:08","text":"Just like we've seen so far with FILENO 1 and FILENO 2"},{"start":"1:08","end":"1:14","text":"So let's store that in our little variable."},{"start":"1:14","end":"1:23","text":"So now I better find out what the correct syntax is and what the correct arguments are for creating a file."},{"start":"1:23","end":"1:25","text":"So let's go and look that up."},{"start":"1:25","end":"1:28","text":"That we'll find inside the manual."},{"start":"1:28","end":"1:42","text":"And, if, for example, I type \"man open\" on a command line on a real linux machine (doesn't quite work yet in my small virtual one. we didn't have enough memory to include all the manual pages yet)"},{"start":"1:42","end":"1:47","text":"but, here's a linux manual page I found on the web for the \"open(2)\""},{"start":"1:47","end":"1:51","text":"and you'll see here's the function signature"},{"start":"1:51","end":"1:56","text":"where we're going to pass in an integer for the flags and the mode type"},{"start":"1:56","end":"2:03","text":"so, I'm going to look up now the flags I need to open and create a new file"},{"start":"2:03","end":"2:06","text":"I don't want to do append()"},{"start":"2:06","end":"2:11","text":"I want to use \"create\" and I want to truncate it as well"},{"start":"2:11","end":"2:28","text":"let's include \"O_CREAT\" here. I'm going to say \"O_CREAT\" which is a constant and I'm going to bitwise OR it with the flag to say \"truncate\" so let's look that up as well"},{"start":"2:28","end":"2:43","text":"And, I want to say \"when I open it, I'm going to open it for reading and writing\""},{"start":"2:43","end":"2:49","text":"Now, we need to do the mode"},{"start":"2:49","end":"2:53","text":"Let's write this as a variable."},{"start":"2:53","end":"3:02","text":"It's essentially an integer but it's wrapped in this type here called \"mode_t\""},{"start":"3:02","end":"3:13","text":"We'll say that our file we want to be fairly private and only the owner of the file can access it."},{"start":"3:13","end":"3:19","text":"Let's go back up and find those flags, where are you? Here we go."},{"start":"3:19","end":"3:24","text":"We'll say that the user has read and write permission"},{"start":"3:24","end":"3:38","text":"We'll copy the read one and we'll have write permission as well."},{"start":"3:38","end":"3:45","text":"But no one else in our linux machine will be allowed to read it nor write it."},{"start":"3:45","end":"3:48","text":"So that's the permissions we want"},{"start":"3:48","end":"3:51","text":"What can we do with this?"},{"start":"3:51","end":"3:56","text":"Let's write something out to this file."},{"start":"3:56","end":"4:04","text":"We will write a little message \"Great!\""},{"start":"4:04","end":"4:06","text":"and newline"},{"start":"4:06","end":"4:08","text":"so, how many characters is that?"},{"start":"4:08","end":"4:16","text":"I've got \"one, two, three, four, five, six, and a new line so that's seven characters\""},{"start":"4:16","end":"4:23","text":"then we'll close this file descriptor meaning we don't want to use this file descriptor anymore"},{"start":"4:23","end":"4:30","text":"that will ensure as well that all of the bytes that we send to the file stream have been saved"},{"start":"4:30","end":"4:41","text":"We're not doing any error checking right now, we're just trying to write the smallest possible program to create a file and send somethign to it"},{"start":"4:41","end":"4:44","text":"let's run this and see what we ge"},{"start":"4:44","end":"4:50","text":"we'll run into an error which is: we haven't defined what this mode_t is"},{"start":"4:50","end":"4:56","text":"what we forgot to do, is the includes"},{"start":"4:56","end":"5:03","text":"the good thing is that the man pages tell us which includes we need to put at the top of our program"},{"start":"5:03","end":"5:07","text":"let's grab those and insert them in here"},{"start":"5:07","end":"5:11","text":"just, get the formatting correct"},{"start":"5:11","end":"5:12","text":"and, run it again"},{"start":"5:12","end":"5:23","text":"Our program ran and it's still printing \"Hello\" to standard out and standard error"},{"start":"5:23","end":"5:28","text":"but hopefully, it also secretly created another file"},{"start":"5:28","end":"5:29","text":"let's have a look at that file"},{"start":"5:29","end":"5:37","text":"I can do \"ls\" and see if anything exists starting with \"out\""},{"start":"5:37","end":"5:41","text":"we've got output.txt. great!"},{"start":"5:41","end":"5:44","text":"let's look at the contents of that file"},{"start":"5:44","end":"5:46","text":"and it says \"Great!\" Fantastic"},{"start":"5:46","end":"5:54","text":"Now it's your turn to play: create a file and see if you can send some bytes to that file."},{"start":"5:54","end":"5:55","text":"You'll be using open(), write(), and close(). Bye."}];

  var videoTranscriptions = [
    [
      bobTranscription1
    ],
    [
      oliverTranscription2,
      surtaiTranscription2
    ],
    [
      bobTranscription3,
      oliverTranscription3,
      surtaiTranscription3
    ]
  ];

/*
  End Global Variables
*/

$(document).ready(function () {
  begin();
});

/*
  Started once the DOM finishes loading
*/
function begin() {
  var videoIndex = parseInt($(".video-selector").val(), 10) - 1;

  loadVideo(videoIndex);
  loadTranscriptions(videoIndex);
  bindEventListeners();
  changePlaybackSpeed();
}

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".video-selector").off().change(begin);
  $(".playback-selector").off().change(changePlaybackSpeed);
  $(window).off().keypress(function (e) {
    if (e.which === 126) {
      e.preventDefault();
      toggleVideo();
    } else if (e.which === 96) {
      e.preventDefault();
      rewindFiveSeconds();
    }
  })
}

/*
  Rewind the video 5 seconds
*/
function rewindFiveSeconds() {
  var video = $(".main-video").get(0);
  video.currentTime = video.currentTime - 5;
}

/*
  Loads the selected video
*/
function loadVideo(videoIndex) {
  var videoSrc = VIDEOS[videoIndex];
  $(".main-video-source").attr("src", videoSrc);
  $(".main-video").get(0).load();
}

/*
  Changes the playback speed
*/
function changePlaybackSpeed() {
  var playbackRate = parseFloat($(".playback-selector").val());
  $(".main-video").get(0).playbackRate = playbackRate;
}

/*
  Changes the video play/pause
*/
function toggleVideo() {
  var video = $(".main-video").get(0);
  if (video.paused == false) {
      video.pause();
  } else {
      video.play();
  }
}

/*
  Load the first pass of transcriptions for a certain video
*/
function loadTranscriptions(videoIndex) {
  var transcriptions = videoTranscriptions[videoIndex];

  $(".transcription-track").remove();
  transcriptions.forEach(function (transcription, i) {
    var template = '<div class="transcription-track transcription-track-track-' + i + '"></div>';
    $(".editor-container").prepend(template);
  });

  transcriptions.forEach(function (transcription, i) {
    transcription.forEach(function (segment) {
      var width = (timeStringToNum(segment.end) - timeStringToNum(segment.start)) * 64;
      width = Math.max(width, 64);
      var template = '<div class="transcription-track-transcription" style="width:' + width + 'px">' + segment.text + '</div>';
      $(".transcription-track-track-" + i).append(template);
    });
  })

  $(".transcription-track, .final-transcription-track").off().scroll(function() {
    $(".transcription-track").scrollLeft($(this).scrollLeft());
    $(".final-transcription-track").scrollLeft($(this).scrollLeft());
    updateTimeLine($(this).scrollLeft());
  });

  $(".final-transcription-track-spacer").width(totalTranscriptionWidth() + 200); // Extra padding

  $(".transcription-track-transcription").off().click(function () {
    var template = '<div class="transcription-track-final-transcription" draggable="true" contentEditable="true">' + $(this).text() + '</div>';
    $(".final-transcription-track").append(template);
    $( ".transcription-track-final-transcription" ).dblclick(function () {
      $(this).remove();
    })
    // $( ".transcription-track-final-transcription" ).draggable({ axis: "x" }); // Figure out later
  })
}

/*
  Returns the total width of the transcription
*/
function totalTranscriptionWidth() {
  var totalWidth = 0;
  $(".transcription-track-track-0 .transcription-track-transcription").each(function(i) {
    totalWidth += parseInt($(this).width(), 10);
  });
  return totalWidth;
}

/*
  Converts a time string to a time integer
*/
function timeStringToNum(timeString) {
  var minutes = parseInt(timeString.split(":")[0], 10);
  var seconds = parseInt(timeString.split(":")[1], 10);
  return 60 * minutes + seconds;
}

/*
  Converts a time integer to a time string
*/
function timeNumToString(timeNum) {
  var timeNumInMinutes = Math.floor(timeNum / 60);
  var timeNumInSeconds = Math.floor(timeNum % 60);

  if (timeNumInSeconds < 10) {
    return timeNumInMinutes + ":0" + timeNumInSeconds;
  }
  return timeNumInMinutes + ":" + timeNumInSeconds;
}

/*
  Update the timeline
*/
var currentStartTime = 0;
function updateTimeLine(scroll) {
  if (currentStartTime + 64 > 64 * scroll || currentStartTime - 64 < 64 * scroll) {
    currentStartTime = 64 * scroll;
    $(".timestamp").each(function (i) {
      var time = timeNumToString(Math.round(scroll / 64) + i);
      $(this).text(time);
    });
  }
}

/*
  Save the transcriptions
*/
function save() {
  var finalTranscriptions = [];
  $(".transcription-track-final-transcription").each(function (i, el) {
    finalTranscriptions.push({
      text: $(el).text(),
      width: $(el).width()
    })
  })
  console.log(JSON.stringify(finalTranscriptions));
}

var lastTime = 0;
setInterval(function () {
  var currentTime = $(".main-video").get(0).currentTime;
  currentTime = Math.floor(currentTime);

  if (currentTime != lastTime) {
    $(".final-transcription-red-bar").css('left', currentTime * 63.8 + "px");
    lastTime = currentTime;
  }
}, 50);