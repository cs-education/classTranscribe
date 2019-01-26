# ![ClassTranscribe](http://i.imgur.com/jvyjBXY.png)

ClassTranscribe is an open-source, web-based platform that leverages crowdsourcing to address the problem of accurate,
reliable and fast transcriptions of college lectures. Completed transcriptions provide search functionality that augments
existing lecture recordings and enable enhanced educational features including closed captioning. Read the ClassTranscribe paper here - [https://www.slate2015.org/files/submissions/Ren15-CAN.pdf](https://www.slate2015.org/files/submissions/Ren15-CAN.pdf)

## How to run your own instance of ClassTranscribe

Refer to Docker/readme.txt

## Structure
### [db.js](/db/db.js)
A MSSQL based API tool offering database-interaction functions.

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
