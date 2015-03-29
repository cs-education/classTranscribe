# ClassTranscribe
Class Transcribe is a project that utilizes crowdsourcing to quickly, reliably and accurately transcribe college lectures.

Check out the live site here: [http://classtranscribe.com](http://classtranscribe.com)

## How to run your own instance of ClassTranscribe

### Getting Set Up (Part A)
1. First clone the repository by running `git clone git@github.com:bobrenjc93/classTranscribe.git`
2. Switch into the classTranscribe directory `cd classTranscribe`
3. Remove existing captions `rm captions/*;`
4. Modify `/javascripts/data/videos.js` to import the videos you wish to transcribe
5. Download and install the latest version of [node](https://nodejs.org/)
6. Start the node webserver root directory `sudo node server.js`

### First Pass Transcription (Part B)

![First Pass Transcription](http://i.imgur.com/RtDixJH.png "First Pass Transcription")

1. Open `http://localhost/first/[Desired Video Index]/[Your name]` to start transcribing (first pass).
2. When done transcribing click the "Submit Transcriptions" button.
3. Your caption will be saved in `/captions/first/[Video Title]-[Your name]`.

### Second Pass Transcription (Part C)

![Second Pass Transcription](http://i.imgur.com/6bbshSt.png "Second Pass Transcription")

1. Import first pass captions into the second pass interface by modifying `/javascripts/data/captions.js`
2. Open `http://localhost/second/[Desired Video Index]/[Your name]` to start editing first pass captions.
3. Follow same save instructions from step 2 & 3 from part B when done with second pass.
4. Import newly created caption into `/javascripts/data/captions.js`.

### How to View Captions (Part D)

![Transcription Viewer](http://i.imgur.com/cRPnyMl.png "Transcription Viewer")

2. Open `http://localhost/viewer.html` to start viewing captions

### How to Edit Captions (Part E)
1. Follow steps 2-4 from part C to edit and save captions

### How to Search Through Captions (Part F)

![Transcription Search](http://i.imgur.com/VGM2ITS.png "Transcription Search")

1. Open `http://localhost:8000`

##FAQs
###Are there any hot keys?
Yes, \` (left of the 1 key) goes back in the video 2 seconds. shift \` pauses the video

###Do you have any tutorials for these interfaces?
Here are a few short videos demonstrating the interfaces. Feel free to reach out directly if you have any unanswered questions.

First pass - https://www.youtube.com/watch?v=ZK0jsd6yMf8

Second pass - https://www.youtube.com/watch?v=1RX1Dwe8UtI

Viewer - https://www.youtube.com/watch?v=XAEqrFGaDwQ

Search - https://www.youtube.com/watch?v=4tnhe4Eevw0

Old depreciated editor - https://www.youtube.com/watch?v=rmazSHa688U
