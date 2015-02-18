# ClassTranscribe
Class Transcribe is a project that utilizes crowdsourcing to quickly, reliably and accurately transcribe college lectures.

## How to get started
### Getting Set up (Part A)
1. First clone the repository by running `git clone git@github.com:bobrenjc93/classTranscribe.git`
2. Switch into the classTranscribe directory `cd classTranscribe`
3. Remove existing captions/transcriptions `rm captions/*; rm transcriptions/*`
4. Modify `/javascripts/data/videos.js` to import the videos you wish to transcribe

### First pass transcription (Part B)
1. Open index.html to start transcribing (first pass)
2. When done transcribing open the console (cmd + option + j for mac chrome)
3. Enter `save()` into the console to output transcriptions in JSON format
4. Save transcription in transcriptions/ folder

### Second pass transcription (Part C)
1. Import transcriptions into editor interface by modifying `/javascripts/data/transcriptions.js`
2. Open editor.html to start editing first pass transcriptions
3. Follow same save instructions from step 2 & 3 from part B when done with second pass
4. Save captions in captions/ folder

### How to view captions (Part D)
1. Import transcriptions into editor interface by modifying `/javascripts/data/captions.js`
2. Open viewer.html to start viewing captions

### How to edit captions (Part E)
1. Open reviewer.html (Captions should already be here from step 13)
2. Make necessary edits
3. Follow steps 3 & 4 from part C to save captions

##FAQs
###Are there are hot keys?
Yes, \` (left of the 1 key) goes back in the video 2 seconds. shift \` pauses the video

###Do you have any tutorials for these interfaces?
I've got a few short videos demonstrating the interfaces. Feel free to reach out directly if you have any unanswered questions.

First pass - https://www.youtube.com/watch?v=ZK0jsd6yMf8

Second pass - https://www.youtube.com/watch?v=rmazSHa688U

Viewer - https://www.youtube.com/watch?v=XAEqrFGaDwQ

Reviewer - https://www.youtube.com/watch?v=1RX1Dwe8UtI
