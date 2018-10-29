# ![ClassTranscribe](http://i.imgur.com/jvyjBXY.png)

ClassTranscribe is an open-source, web-based platform that leverages crowdsourcing to address the problem of accurate,
reliable and fast transcriptions of college lectures. Completed transcriptions provide search functionality that augments
existing lecture recordings and enable enhanced educational features including closed captioning. Read the ClassTranscribe paper here - [https://www.slate2015.org/files/submissions/Ren15-CAN.pdf](https://www.slate2015.org/files/submissions/Ren15-CAN.pdf)

## How to run your own instance of ClassTranscribe

1. Install Docker on your machine using one of the following OS specific tutorials: [linux](https://docs.docker.com/linux/step_one/), [mac](https://docs.docker.com/mac/step_one/) or [windows](https://docs.docker.com/windows/step_one/).
2. Pull down the ClassTranscribe container by running `docker pull cs-education/classtranscribe`.
3. If you are contributing to an existing ClassTranscribe instance, ask the admin for the redis and email credentials.
Otherwise, setup your own gmail account, and do one of the following for redis:
    1. **Preferred** Setup a docker instance running redis ([we use this](https://hub.docker.com/_/redis/))
    2. Run your own redis instance ([tutorial here](http://redis.io/topics/quickstart))
4. Run the ClassTranscribe docker image locally either by:
    1. `docker run -i -t -p 443:8000 -p 80:7000 --link REDIS_CONTAINER_NAME:redis -e "REDIS_PASS=<redis password>" -e "MAILER_ID=<email>" -e "MAILER_PASS=<pass>" pranaygp/classtranscribe /bin/bash -c "npm install; npm start"`. If you're not running a docker instance for redis, then remove `--link REDIS_CONTAINER_NAME:redis` and instead, have `-e "REDIS_HOST=<redis url>` to point to your redis db
    2. (Mounting) `docker run -i -t --mount type=bind,source={local_repo_of_classtransbribe}, target=/data -p 443:8000 -p 80:7000 --link {redis_id}:redis -e "MAILER_ID=<email>" -e "MAILER_PASS=<pass>" -e "REDIS_PASS=<pass>" -e "MAILER_ID=<email>" -e "MAILER_PASS=<pass>" cs-education/classtranscribe /bin/bash -c "npm install; npm install passport-hash; npm audit fix"`

## How to run a docker build if you have the source code (DO THIS WHEN YOU CHANGE CODE AND CONFIRM IT WORKS - It effectively tests in a production like environment)

1. `docker build -t classtranscribe .`
2. Run the ClassTranscribe docker image locally either by:
    1. `docker run -i -t -p 443:8000 -p 80:7000 --link REDIS_CONTAINER_NAME:redis -e "REDIS_PASS=<redis password>" -e "MAILER_ID=<email>" -e "MAILER_PASS=<pass>" classtranscribe /bin/bash -c "npm install; npm start"`
    2. (Mounting) `docker run -i -t --mount type=bind,source={local_repo_of_classtransbribe}, target=/data -p 443:8000 -p 80:7000 --link {redis_id}:redis -e "MAILER_ID=<email>" -e "MAILER_PASS=<pass>" -e "REDIS_PASS=<pass>" -e "MAILER_ID=<email>" -e "MAILER_PASS=<pass>" cs-education/classtranscribe /bin/bash -c "npm install; npm install passport-hash; npm audit fix"`
> Please prefer using a docker container running redis rather than hitting a production database when testing

## How to launch a class

1. Download lecture videos for a course, place in a directory.
2. Rename videos to follow format Lecture_`<lecture_index>`.`<any video file format (wmv/m4a/etc)>`.
3. Copy convert.sh script to directory with videos `cp utility_scripts/convert.sh <path_to_directory_with_videos>`.
4. Run convert.sh `<path_to_directory_with_videos>/convert.sh`. This will transcode all the videos and may take a while.
5. Split videos into 4-6 minute chunks by running `node utility_scripts/splitRunner.js <path_to_directory_with_videos>`.
6. Upload videos to S3 (May need to install s3cmd utility) `s3cmd put --acl-public -r ./ s3://<s3_bucket_name>/<class_name>/`.
7. Initialize transcription tasks in redis queue by running `node utility_scripts/taskInitializer.js <path_to_directory_with_videos> <class_name>`.
8. Send an email to your students. Below is an example email template:

> Dear `<class_name>` students,
>
> As discussed in lecture, we will be transcribing the focus groups for `<class_name>`.
>
> Completed transcriptions will enable you to search through the entire semesters' lecture videos and skip to the exact segment where a segment was covered (very useful when studying for exams!). As a quick demo, you can search through the entire UIUC CS241 2015 Spring semester here: http://classtranscribe.com. Try searching for "Buffer Overflow" or "Segmentation Fault"! Once progress has been made on the backlog of lectures the homepage will be updated to search <class_name>.
>
> <insert motivation (ideally Extra Credit) and policies>
>
> Below are the steps to get started
>
> 1. Read this tutorial on how to use ClassTranscribe: http://tinyurl.com/classtranscribetutorial
>
> 2. To begin a transcription task (~15 min) go to `http://classtranscribe.com/queue/<class_name>`. You will revisit this link in the future to get another task.
>
> 3. Visit `http://classtranscribe.com/progress/<class_name>` to view the progress that you and your classmates have made!
>
> 4. You can view and search finished transcriptions at `http://classtranscribe.com/<class_name>`
>
> If you have any questions or concerns regarding the transcription process, please don't hesitate to email `<admin_email_address>`.
>
> Thanks, `<professor_name>`

## How to upload finished transcriptions

1. Have the latest version of transcriptions in your local repository by running `git pull origin master`.
2. Run `utility_scripts/videoGenerator.js <class_name>` to generate a list of videos. Create/Modify `javascripts/data/videos/<classname>.js` accordingly.
3. Run `utility_scripts/captionGenerator.js <class_name>` to generate a list of captions. Create/Modify `javascripts/data/captions/<classname>.js` accordingly.
4. If it's the first time uploading transcriptions, modify the `exampleTerms` and `captionsMapping` configuration in `server.js` to add example terms and mappings to the video and caption files accordingly.
5. Restart the server.

## Structure
### [db.js](/db/db.js)
A SQLite based API tool offering database-interaction functions.

### [models](/models)
> models used to build sql tables

#### [index.js](/models/index.js)
>Initialize the tables

*primary_key*<br>
**foreign_key**

#### [courseOffering.js](/models/courses.js)
| *courseId*        | *offeringId*           |
| ----------------- |----------------------|

#### [courses.js](/models/courses.js)
| **id**   | courseNumber | courseName  | courseDescription | *deptId* |
| -------|----------------|:-------------------:|-------------:|-------:|

#### [dept.js](/models/dept.js)
| **id**        | deptName   | acronym   |
|-------------|:----------:|:----------:|

#### [echo_section.js](/models/lecture.js)
| **sectionId**   | courseId  | json |
|-------------|:----------:|:----------:|

#### [lecture.js](/models/lecture.js)
| **id**        | date   | *offeringId*  | *mediaId* |
|-------------|:----------:|:----------:|:-----------:|

#### [media.js](/models/media.js)
| **id**        |  videoURL   | sourceType  | siteSpecificJSON |
|-------------|:----------:|:----------:|:--------------:|

#### [ms-transcription-task.js](/models/ms-transcription-task.js)
|**id**|videoLocalLocation|audioLocalLocation|siteSpecificJSON|videoHashsum|audioHashsum|wavAudioLocalFile|wavHashsum|srtFileLocation|log|*taskCreatorUserId*|*mediaId*|
|------|------|-----|------|------|----|----|----|----|----|----|----|

#### [offering.js](/models/offering.js)
| **id**     |  section   | *termId*  | *deptId* | *universityId* |
|-------------|:----------:|:----------:|:-----------:|-------:|

#### [role.js](/models/role.js)
| **id**     |  roleName  |
|------------|:----------:|

#### [term.js](/models/term.js)
| **id**   |  termName  |
|----------|:----------:|

#### [university.js](/models/university.js)
| **id**  |  universityName  |
|---------|:----------------:|

#### [user.js](/models/user.js)
| **id** | mailId | firstName | lastName | password | verifiedId | *universityId* |
|---------|:--------:|--------:|--------:|--------:|--------:|------:|

#### [userOffering.js](/models/userOffering.js)
| *userId* | *offeringId* | *roleId* |
|---------|:--------:|--------:|

### [router](/router)
> Here contains server side features and functions

[index.js](/router/index.js) is the general setup
[routes](/router/routes) has various js files that we are currently using
  * [accountRecovery.js](/router/routes/accountRecovery.js) renders [accountRecovery](/templates/accountRecovery.mustache) mustache
  * [activated.js](/router/routes/activated.js) renders [activated](/templates/activated.mustache) mustache
  * [admin.js](/router/routes/admin.js) renders [admin](/templates/admin.mustache) mustache
  * [base.js](/router/routes/base.js) renders [home](/templates/home.mustache) mustache
  * [captions.js](/router/routes/captions.js) not sure
  * [changePassword.js](/router/routes/changePassword.js) renders [changePassword](/templates/changePassword.mustache) with changePassword functions
  * **[courses.js](/router/routes/courses.js)** renders [courses](/templates/courses.mustache) mustache, it is relative to addCourse page. **Important file**
  * [dashboard.js](/router/routes/dashboard.js) renders [dashboard](/templates/dashboard.mustache)
  * [download.js](/router/routes/download.js) is relative to files in /public/Downloads
  * [first.js](/router/routes/first.js) renders [index](/templates/index.mustache) mustache, it is relative to lecture videos
  * [login.js](/router/routes/login.js) renders [login](/templates/login.mustache) mustache, it is relative to login page
  * [logout.js](/router/routes/logout.js) logout the account, and change the URL to home directory
  * [manage.js](/router/routes/mange.js) renders [manageCourse](/templates/manageCourse.mustache) mustache, it has relative functions about adding instructors, lectures, students
  * [progress.js](/router/routes/progress.js) renders [progress](/templates/progress.mustache) mustache, it is relative of sending progress emails
  * [queue.js](/router/routes/queue.js) renders [queue](/templates/queue.mustache) mustache, it uploads files?
  * [resetPassword.js](/router/routes/resetPassword.js) renders [resetPassword](/templates/resetPassword.mustache) mustache, it has relative functions about resetPassword
  * [search.js](/router/routes/search.js) renders [search](/templates/search.mustache) mustache, it has relative functions about getting videos, course, or captions
  * [second.js](/router/routes/second.js) renders [editor](/templates/editor.mustache) mustache, it has a function that saves the transcription
  * [settings.js](/router/routes/settings.js) renders [settings](/templates/settings.mustache) mustache, it has relative functions about settings
  * [signup.js](/router/routes/signup.js) renders [signup](/templates/signup.mustache) mustache and [verify](/templates/verify.mustache), it has relative functions of signing up.
  * [viewer.js](/router/routes/viewer.js) renders [viewer](/templates/templates.mustache) mustache
  * [viewProgress.js](/router/routes/viewProgress.js) renders [progressDashboard](templates/progressDashboard.mustache) mustache
  * [watchLectureVideos.js](/router/routes/watchLectureVideos.js) renders [watchLectureVideos](/templates/watchLectureVideos.mustache) mustache, it has a relative function of getting videos
