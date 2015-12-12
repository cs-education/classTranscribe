# Set Up Tutorial 
Hi! Welcome to a quick introduction on how to set up a ClassTranscribe instance.

### 1. Install docker if you don't already have it
[linux](https://docs.docker.com/linux/step_one/)
[mac](https://docs.docker.com/mac/step_one/)
[windows](https://docs.docker.com/windows/step_one/)

### 2. Grab the docker image
'docker pull obmelvin/class_transcribe:v3'

### 3. Launch the docker image into the CL
`docker run -e "REDIS_PASS=<pass>" -e "REDIS_HOST=<host>" -e "MAILER_ID=<email>" -e "MAILER_PASS=<pass>" -p 80:80 -a stdout -a stdin -i -t obmelvin/class_transcribe:v3 /bin/bash`
Note that REDIS_PASS/HOST and MAILER_ID/PASS should all be environmental variables.
REDIS_PASS/HOST correspond to the password / hostname needed to connect to the desired redis instance.
MAILER_ID/PASS is a gmail address and password that will be used to send the progress emails.

#### NOTE: If the emails aren't sending then you may need to relax the [security settings](https://support.google.com/accounts/answer/6010255?hl=en)

### 4. Now your terminal prompt should be the bash shell inside the docker image.
Update the repository with `git pull origin master`. This is necessary each time the docker instance is restarted.

### 5. Create a sym link so the docker image recognizes `node` instead of `nodejs`
``ln -s `which nodejs` /usr/bin/node``

### 6. Launch the server as a background process
`nohup sudo -E node server.js >> public/server.log &`

### 7. Launch the transcription aligner as a background process
`nohup sudo -E node second_pass.js >> public/second_pass.log &`

### 7. How to reconnect to docker image
`docker ps` to get the running images. Find the desired ID.
`sudo docker exec -i -t <docker_ps_id> bash`


Please email omelvin2@illinois.edu with any questions.