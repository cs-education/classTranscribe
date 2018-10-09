/* This file is meant to be a wrapper module for every client calls
 * It is exported as a module, use it by using requires()
 * example usage:
 *           var api = require('./api');
 *           var client_api = new api();
 */

/* Global Variables */
// var router = express.Router();
var client = require('./../../modules/redis');

module.exports = class api {
  /* Student Management */
   enrollStudent(userID, classID, callback) {
    client.sadd("ClassTranscribe::Users::"+userid+"::Courses_as_Student", "ClassTranscribe::Course::"+classid);
    client.sadd("ClassTranscribe::Course::"+classid+"::Students", "ClassTranscribe::Users::"+userid);
    callback();
  }

   removeStudent(userID, classID, callback) {
    client.srem("ClassTranscribe::Users::"+userid+"::Courses_as_Student", "ClassTranscribe::Course::"+classid);
    callback();
  }

  /* Course Management */
  /* couse = [subject, classNumber, sectionNumber, className, classDesc, university, instructor, classID] */
   addCourse(course, term) {
    var classID = course[7];
    // General information update
    client.sadd("ClassTranscribe::CourseList", "ClassTranscribe::Course::"+classID); // add class to class list
    client.sadd("ClassTranscribe::Terms::"+term, "ClassTranscribe::Course::"+classID); // add class to term list
    client.sadd("ClassTranscribe::SubjectList", "ClassTranscribe::Subject::"+course[0]); // add class subject to subject list
    client.sadd("ClassTranscribe::Subject::"+course[0], "ClassTranscribe::Course::"+classID); // add class to the subject

    // Add course info
    client.hset("ClassTranscribe::Course::"+classID, "Subject", course[0]);
    client.hset("ClassTranscribe::Course::"+classID, "ClassNumber", course[1]);
    client.hset("ClassTranscribe::Course::"+classID, "SectionNumber", course[2]);
    client.hset("ClassTranscribe::Course::"+classID, "ClassName", course[3]);
    client.hset("ClassTranscribe::Course::"+classID, "ClassDesc", course[4]);
    client.hset("ClassTranscribe::Course::"+classID, "University", course[5]);
    client.hset("ClassTranscribe::Course::"+classID, "Instructor", course[6]);
    client.hset("ClassTranscribe::Course::"+classID, "Term", term);
  }

   addCoursesByTerm(courses, term) {
     var self = this;
     courses.forEach(function(course) {
       /* calling helper function to add course */
       self.addCourse(course, term);
     })
  }

  /* Account Management */
   getUserByEmail(email, callback) {
    client.hgetall("ClassTranscribe::Users::" + email, callback());
  }

   validUserID(email, callback) {
    client.hget("ClassTranscribe::Users::" + email, "change_password_id", callback());
  }

   setPasswordID(email, passwordID, callback) {
    client.hmset("ClassTranscribe::Users::" + email, ["change_password_id", passwordID], callback());
  }

   setPassword(email, newPassword, callback) {
    client.hmset("ClassTranscribe::Users::" + email, ['password', newPassword], callback());
  }

 /* Used under viewer.js */
  fetchCourse(callback) {
    client.smembers("ClassTranscribe::CourseList", callback());
  }

  /* Used under signup.js */
  lookUpTable(email, callback) {
    client.get("ClassTranscribe::UserLookupTable::" + email, callback());
  }

  /*
  userInfo = [ email, userid, first_name, last_name, password, change_password_id,
  university, verified, verify_id, courses_as_instructor, courses_as_TA, courses_as_student]
  */
  signUp(userInfo) {
    var userID = userInfo[1];

    // Potentially better performance using hashes instead
    client.set("ClassTranscribe::UserLookupTable::" + userInfo[0], userID);
    // Add new user to database
    client.hmset("ClassTranscribe::Users::" + userID, [
        'first_name', userInfo[2],
        'last_name', userInfo[3],
        'password', userInfo[4],
        'change_password_id', userInfo[5],
        'university', userInfo[6],
        'verified', userInfo[7],
        'verify_id', userInfo[8],
        'courses_as_instructor', userInfo[9],
        'courses_as_TA', userInfo[10],
        'courses_as_student', userInfo[11]]);
  }

  /* Add the token ID to database to check it is linked with the user */
  setVerifyID(userID, verifyID, callback) {
    client.hmset("ClassTranscribe::Users::" + userID, ['verify_id', verifyID], callback());
  }

  /* Check if the user verify link ID matches the email */
  checkVerifyID(user, callback) {
    client.hget("ClassTranscribe::Users::" + user, "verify_id", callback());
  }

  // Change email as verified
  verifyUser(user, callback) {
    client.hmset("ClassTranscribe::Users::" + user, [
      'verified', true,
      'verify_id', ''
    ], callback());
  }

  /* Used in settings.js */
  getFirstName(email, callback) {
    client.hget("ClassTranscribe::Users::" + email, "first_name", callback());
  }

  getLastName(email, callback) {
    client.hget("ClassTranscribe::Users::" + request.user.email, "last_name", callback());
  }

  setName(email, names, callback) {
    client.hmset("ClassTranscribe::Users::" + email, [
        'first_name', names[0],
        'last_name', names[1],
    ], callback());
  }

  /* [captionFileName, transcriptions, transcriber] */
  addCaption(className, caption) {
    var fileName = caption[0];
    client.sadd("ClassTranscribe::Transcriptions::" + className + "::" + fileName, caption[1]);
    client.sadd("ClassTranscribe::Transcribers::" + className, fileName + "_" + caption[2]);
  }

  addStatsPath(path, stats) {
    client.sadd("ClassTranscribe::Stats::" + path, stats);
  }

  validateTranscription(className, taskName, callback) {
    client.zincrby("ClassTranscribe::Submitted::" + className, 1, taskName);
    client.zscore("ClassTranscribe::Submitted::" + className, taskName, callback());
  }

  prioritize(className, taskName) {
    client.zrem("ClassTranscribe::Submitted::" + className, taskName);
    client.zrem("ClassTranscribe::PrioritizedTasks::" + className, taskName);
  }

  failTranscription(className, fileName) {
    client.lpush("ClassTranscribe::Failed::" + className, fileName);
  }

  addFirst(className, fileName) {
    client.sadd("ClassTranscribe::First::" + className, fileName);
  }

  removeTranscriber(className, netIDTaskTuple) {
    client.hdel("ClassTranscribe::ActiveTranscribers::" + className, netIDTaskTuple);
  }

  /* under search */
  getCourses(callback) {
    client.smembers("ClassTranscribe::CourseList", callback());
  }

  getCaptions(className, callback) {
    client.smembers("ClassTranscribe::Transcriptions::" + className + "::" + file.replace(".mp4", ""), callback());
  }

  /* under queue */
  getTasks(className, callback) {
    var args = ["ClassTranscribe::Tasks::" + className, "0", "99999", "LIMIT", "0", "1"];
    client.zrangebyscore(args, callback());
  }

  getsortedTask(className, taskName, callback) {
    var args = ["ClassTranscribe::Tasks::" + className, "1", taskName];
    client.zincrby(args, callback());
  }

  getFirst(className, callback) {
    client.smembers("ClassTranscribe::First::" + className, callback());
  }

  getFinished(className, callback) {
    client.smembers("ClassTranscribe::Finished::" + className, callback());
  }

  /* under manage*/
  addInstructors(instructors, callback) {
    client.sadd("instructors", instructors, callback());
  }

  addStudents(students, callback) {
    client.sadd("students", students, callback());
  }

  addTranscriptionPath(path, transcriptions) {
    client.sadd("ClassTranscribe::Transcriptions::" + path, transcriptions);
  }

  getTerms(callback) {
    client.smembers("ClassTranscribe::Terms", callback());
  }

  getUserByID(userID, callback) {
    client.hgetall("ClassTranscribe::Users::" + userID, callback());
  }

  getKeysByClass(classID, callback) {
    client.keys("ClassTranscribe::Course::" + classID, callback());
  }

  enrollInstuctor(classID, userID) {
    client.sadd("ClassTranscribe::Course::"+classID+"::Instructors", "ClassTranscribe::Users::"+userID);
    client.sadd("ClassTranscribe::Users::"+userID+"::Courses_as_Instructor", "ClassTranscribe::Course::" + classID);
  }

  multi(commands) {
    client.multi(commands);
  }

  exec(callback) {
    client.exec(callback());
  }

};

// module.exports = router;
