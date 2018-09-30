# General Guide of Files

This is a general guide of the role of each directory. If something doesn't make sense to you, there is a high possibility that it is wrong. You are welcomed to modify this file.

## [deprecated](/deprecated)
contains [old_editor.html](/deprecated/old_editor.html) that has no influence to current project

## [documentation](/documentation)
documentations in the website.
website tutorials, and FAQs.

## [javascripts](/javascripts)
[manageCourse.js](/javascripts/controllers/manageCourse.js) is relative to manageCourse page

## [modules] (/modules)
[mailer.js](/modules/mailer.js) is relative to mailing systems
[redis.js](/modules/redis.js) is relative to redis database
[validator.js](/modules/validator.js) is relative to validating transcript files
[webvtt.js](/modules/webvtt.js) is relative to displaying captions

## [p2fa-vislab-master](/p2fa-vislab-master)
Have no idea.

## [public](/public)
public sources, seems to have some redundant files.

## [router](/router)
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

## [stylesheets](/stylesheets)
[manageCourse.css](/stylesheets/manageCourse.css) is meant for manageCourse
[resetPassword.css](/stylesheets/resetPassword.css) is meant for resetPassword

## [templates](/templates)
This directory has various mustache templates that are rendered in [Javascripts](/router/routes).

## [utility_scripts](/utility_scripts)
Use those scripts for files management

## [utils](/utils)
dummy data?
