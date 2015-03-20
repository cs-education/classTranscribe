# ClassTranscribe
Class Transcribe is a project that utilizes crowdsourcing to quickly, reliably and accurately transcribe college lectures.

## How to get started

### Getting Set up (Part A)
1. First clone the repository by running `git clone git@github.com:bobrenjc93/classTranscribe.git`
2. Switch into the classTranscribe directory `cd classTranscribe`
3. Remove existing captions/transcriptions `rm captions/*; rm transcriptions/*`
4. Modify `/javascripts/data/videos.js` to import the videos you wish to transcribe
6. Download and install the latest version of [node](https://nodejs.org/)
7. Install http-server module `npm install http-server -g`
5. Start the node http-server webserver in the root directory `http-server -p 8000`

### First pass transcription (Part B)

![First Pass Transcription](http://i.imgur.com/RtDixJH.png "First Pass Transcription")

1. Open `http://localhost:8000/index.html` to start transcribing (first pass)
2. When done transcribing open the console (cmd + option + j for mac chrome)
3. Enter `save()` into the console to output captions in JSON format
4. Save captions in captions/ folder

### Second pass transcription (Part C)

![First Pass Transcription](http://i.imgur.com/6bbshSt.png "First Pass Transcription")

1. Import first pass captions into editor interface by modifying `/javascripts/data/captions.js`
2. Open `http://localhost:8000/editor.html` to start editing first pass captions
3. Follow same save instructions from step 2 & 3 from part B when done with second pass
4. Resave edited captions in captions/ folder and modify `/javascripts/data/captions.js` accordingly

### How to view captions (Part D)

![Transcription Viewer](http://i.imgur.com/cRPnyMl.png "Transcription Viewer")

2. Open `http://localhost:8000/viewer.html` to start viewing captions

### How to edit captions (Part E)
1. Follow steps 2-4 from part C to edit and save captions

### How to search through captions (Part F)

![Transcription Search](http://i.imgur.com/VGM2ITS.png "Transcription Search")

1. Open `http://localhost:8000/search.html` (Captions should already be here from step 13)

##FAQs
###Are there are hot keys?
Yes, \` (left of the 1 key) goes back in the video 2 seconds. shift \` pauses the video

###Do you have any tutorials for these interfaces?
I've got a few short videos demonstrating the interfaces. Feel free to reach out directly if you have any unanswered questions.

First pass - https://www.youtube.com/watch?v=ZK0jsd6yMf8

Second pass - https://www.youtube.com/watch?v=1RX1Dwe8UtI

Viewer - https://www.youtube.com/watch?v=XAEqrFGaDwQ

Search - https://www.youtube.com/watch?v=4tnhe4Eevw0

Old depreciated editor - https://www.youtube.com/watch?v=rmazSHa688U
