//  // Current database structure overview
//  //  ========== Class section ==========
//  //                                |--ClassTranscribe::Course::Classid_1
//  //                                |--ClassTranscribe::Course::C2
//  //  |--ClassTranscribe::CourseList|--ClassTranscribe::Course::C3
//  //  |
//  //  |--ClassTranscribe::Terms::XX|--ClassTranscribe::Course::Classid_1
//  //  |                            |--ClassTranscribe::Course::C2
//  //  |
//  //  |--ClassTranscribe::Terms::YY|--ClassTranscribe::Course::C3
//  // -|
//  //  |--ClassTranscribe::SubjectList--|--ClassTranscribe::Subject::XX --ClassTranscribe::Course::Classid_1
//  //  |                                |--ClassTranscribe::Subject::YY::|--ClassTranscribe::Course::C2
//  //  |                                                                 |--ClassTranscribe::Course::C3
//  //  |--ClassTranscribe::Course::C1--Attributes("ClassNumber","SectionNumber","ClassName","ClassDesc","University","Instructor","Term"...)
//  //  |--ClassTranscribe::Course::...::Students
//  //  |                                |--Instructors
//  //  |
//  //  ========== User section ==========
//  //  |
//  //  |--ClassTranscribe::Users::userid_1--Attributes('first_name', 'last_name', 'password'...)
//  //  |--ClassTranscribe::Users::userid_1::Courses_as_Instructor
//  //  |--ClassTranscribe::Users::userid_1::Courses_as_TA
//  //  |--ClassTranscribe::Users::userid_1::Courses_as_Student//  |--ClassTranscribe::Users::...
//  //  |
//  //  |--ClassTranscribe::Users::...
//  //  |
//  //  |
//  //  ========== Misc section ==========
//  //  |--ClassTranscribe::UserLookupTable::Email_1
//  //  |
//
// /* Global Variables */
// // var router = express.Router();
// var client = require('./../../modules/redis');
//
// // module.exports = class api {
//   /* Student Management */
//   function enrollStudent(userID, classID, callback) {
//     client.sadd("ClassTranscribe::Users::"+userid+"::Courses_as_Student", "ClassTranscribe::Course::"+classid);
//     client.sadd("ClassTranscribe::Course::"+classid+"::Students", "ClassTranscribe::Users::"+userid);
//     callback();
//   };
//
//   function removeStudent(userID, classID, callback) {
//     client.srem("ClassTranscribe::Users::"+userid+"::Courses_as_Student", "ClassTranscribe::Course::"+classid, callback());
//   };
//
//   /* Course Management */
//   /* course = [subject, classNumber, sectionNumber, className, classDesc, university, instructor, classID] */
//   function addCourse(course, term) {
//     var classID = course[7];
//     // General information update
//     client.sadd("ClassTranscribe::CourseList", "ClassTranscribe::Course::"+classID); // add class to class list
//     client.sadd("ClassTranscribe::Terms::"+term, "ClassTranscribe::Course::"+classID); // add class to term list
//     client.sadd("ClassTranscribe::SubjectList", "ClassTranscribe::Subject::"+course[0]); // add class subject to subject list
//     client.sadd("ClassTranscribe::Subject::"+course[0], "ClassTranscribe::Course::"+classID); // add class to the subject
//
//     // Add course info
//     client.hset("ClassTranscribe::Course::"+classID, "Subject", course[0]);
//     client.hset("ClassTranscribe::Course::"+classID, "ClassNumber", course[1]);
//     client.hset("ClassTranscribe::Course::"+classID, "SectionNumber", course[2]);
//     client.hset("ClassTranscribe::Course::"+classID, "ClassName", course[3]);
//     client.hset("ClassTranscribe::Course::"+classID, "ClassDesc", course[4]);
//     client.hset("ClassTranscribe::Course::"+classID, "University", course[5]);
//     client.hset("ClassTranscribe::Course::"+classID, "Instructor", course[6]);
//     client.hset("ClassTranscribe::Course::"+classID, "Term", term);
//   };
//
//   function addCoursesByTerm(courses, term) {
//      var self = this;
//      courses.forEach(function(course) {
//        /* calling helper function to add course */
//        self.addCourse(course, term);
//      })
//   };
//
//   /* Account Management */
//   function getUserByEmail(email, callback) {
//     client.hgetall("ClassTranscribe::Users::" + email, callback());
//   };
//
//   function validUserID(email, callback) {
//     client.hget("ClassTranscribe::Users::" + email, "change_password_id", callback());
//   };
//
//   function setPasswordID(email, passwordID, callback) {
//     client.hmset("ClassTranscribe::Users::" + email, ["change_password_id", passwordID], callback());
//   };
//
//   function setPassword(email, newPassword, callback) {
//     client.hmset("ClassTranscribe::Users::" + email, ['password', newPassword], callback());
//   };
//
//  /* Used under viewer.js */
//   function fetchCourse(callback) {
//     client.smembers("ClassTranscribe::CourseList", callback());
//   };
//
//   /* Used under signup.js */
//   function lookUpTable(email, callback) {
//     client.get("ClassTranscribe::UserLookupTable::" + email, callback());
//   };
//
//   /*
//   userInfo = [ email, userid, first_name, last_name, password, change_password_id,
//   university, verified, verify_id, courses_as_instructor, courses_as_TA, courses_as_student]
//   */
//   function signUp(userInfo, callback) {
//     var userID = userInfo[1];
//     var signUpCallback = callback || function(err){ console.log("err:", err); };
//
//     // Potentially better performance using hashes instead
//     client.set("ClassTranscribe::UserLookupTable::" + userInfo[0], userID, function(err, res){
//       console.log("set UserID to UserLookupTable: ", res);
//
//       // Add new user to database
//       if(callback) {
//         client.hmset(
//           "ClassTranscribe::Users::" + userID,
//           [
//             'first_name', userInfo[2],
//             'last_name', userInfo[3],
//             'password', userInfo[4],
//             'change_password_id', userInfo[5],
//             'university', userInfo[6],
//             'verified', userInfo[7],
//             'verify_id', userInfo[8],
//             'courses_as_instructor', userInfo[9],
//             'courses_as_TA', userInfo[10],
//             'courses_as_student', userInfo[11]
//           ],
//           callback());
//       } else {
//         client.hmset(
//           "ClassTranscribe::Users::" + userID,
//           [
//             'first_name', userInfo[2],
//             'last_name', userInfo[3],
//             'password', userInfo[4],
//             'change_password_id', userInfo[5],
//             'university', userInfo[6],
//             'verified', userInfo[7],
//             'verify_id', userInfo[8],
//             'courses_as_instructor', userInfo[9],
//             'courses_as_TA', userInfo[10],
//             'courses_as_student', userInfo[11]
//           ]);}
//     });
//   };
//
//   /* Add the token ID to database to checOk it is linked with the user */
//   function setVerifyID(userID, verifyID, callback) {
//     client.hmset("ClassTranscribe::Users::" + userID, ['verify_id', verifyID], callback());
//   };
//
//   /* Check if the user verify link ID matches the email */
//   function checkVerifyID(user, callback) {
//     client.hget("ClassTranscribe::Users::" + user, "verify_id", callback());
//   };
//
//   // Change email as verified
//   function verifyUser(user, callback) {
//     client.hmset("ClassTranscribe::Users::" + user, [
//       'verified', true,
//       'verify_id', ''
//     ], callback());
//   };
//
//   /* Used in settings.js */
//   function getFirstName(email, callback) {
//     client.hget("ClassTranscribe::Users::" + email, "first_name", callback());
//   };
//
//   function getLastName(email, callback) {
//     client.hget("ClassTranscribe::Users::" + request.user.email, "last_name", callback());
//   };
//
//   function setName(email, names, callback) {
//     client.hmset("ClassTranscribe::Users::" + email, [
//         'first_name', names[0],
//         'last_name', names[1],
//     ], callback());
//   };
//
//   /* [captionFileName, transcriptions, transcriber] */
//   function addCaption(className, caption) {
//     var fileName = caption[0];
//     client.sadd("ClassTranscribe::Transcriptions::" + className + "::" + fileName, caption[1]);
//     client.sadd("ClassTranscribe::Transcribers::" + className, fileName + "_" + caption[2]);
//   };
//
//   function addStatsPath(path, stats) {
//     client.sadd("ClassTranscribe::Stats::" + path, stats);
//   }
//
//   function validateTranscription(className, taskName, callback) {
//     client.zincrby("ClassTranscribe::Submitted::" + className, 1, taskName);
//     client.zscore("ClassTranscribe::Submitted::" + className, taskName, callback());
//   }
//
//   function prioritize(className, taskName) {
//     client.zrem("ClassTranscribe::Submitted::" + className, taskName);
//     client.zrem("ClassTranscribe::PrioritizedTasks::" + className, taskName);
//   }
//
//   function failTranscription(className, fileName) {
//     client.lpush("ClassTranscribe::Failed::" + className, fileName);
//   }
//
//   function addFirst(className, fileName) {
//     client.sadd("ClassTranscribe::First::" + className, fileName);
//   }
//
//   function removeTranscriber(className, netIDTaskTuple) {
//     client.hdel("ClassTranscribe::ActiveTranscribers::" + className, netIDTaskTuple);
//   }
//
//   /* under search */
//   function getCourses(callback) {
//     client.smembers("ClassTranscribe::CourseList", callback());
//   }
//
//   function getCaptions(className, callback) {
//     client.smembers("ClassTranscribe::Transcriptions::" + className + "::" + file.replace(".mp4", ""), callback());
//   }
//
//   /* under queue */
//   function getTasks(className, callback) {
//     var args = ["ClassTranscribe::Tasks::" + className, "0", "99999", "LIMIT", "0", "1"];
//     client.zrangebyscore(args, callback());
//   }
//
//   function getsortedTask(className, taskName, callback) {
//     var args = ["ClassTranscribe::Tasks::" + className, "1", taskName];
//     client.zincrby(args, callback());
//   }
//
//   function getFirst(className, callback) {
//     client.smembers("ClassTranscribe::First::" + className, callback());
//   }
//
//   function getMemberArgs(args, callback) {
//     client.sismember(args, callback());
//   }
//
//   function getFinished(className, callback) {
//     client.smembers("ClassTranscribe::Finished::" + className, callback());
//   }
//
//   /* under manage*/
//   function addInstructors(instructors, callback) {
//     client.sadd("instructors", instructors, callback());
//   }
//
//   function addStudents(students, callback) {
//     client.sadd("students", students, callback());
//   }
//
//   function addTranscriptionPath(path, transcriptions) {
//     client.sadd("ClassTranscribe::Transcriptions::" + path, transcriptions);
//   }
//
//   function getTerms(callback) {
//     client.smembers("ClassTranscribe::Terms", callback());
//   }
//
//   function getUserByID(userID, callback) {
//     client.hgetall("ClassTranscribe::Users::" + userID, callback());
//   }
//
//   function getKeysByClass(classID, callback) {
//     client.keys("ClassTranscribe::Course::" + classID, callback());
//   }
//
//   function enrollInstuctor(classID, userID) {
//     client.sadd("ClassTranscribe::Course::"+classID+"::Instructors", "ClassTranscribe::Users::"+userID);
//     client.sadd("ClassTranscribe::Users::"+userID+"::Courses_as_Instructor", "ClassTranscribe::Course::" + classID);
//   }
//
//   function multi(commands) {
//     client.multi(commands);
//   }
//
//   function exec(callback) {
//     client.exec(callback());
//   }
//
// // };
//
// module.exports = {
//   enrollStudent: enrollStudent,
//   removeStudent: removeStudent,
//   addCourse: addCourse,
//   addCoursesByTerm: addCoursesByTerm,
//   getUserByEmail: getUserByEmail,
//   validUserID: validUserID,
//   setPasswordID: setPasswordID,
//   setPassword: setPassword,
//   fetchCourse: fetchCourse,
//   lookUpTable: lookUpTable,
//   signUp: signUp,
//   setVerifyID: setVerifyID,
//   checkVerifyID: checkVerifyID,
//   verifyUser: verifyUser,
//   getFirstName: getFirstName,
//   getLastName: getLastName,
//   getMemberArgs: getMemberArgs,
//   setName: setName,
//   addCaption: addCaption,
//   addStatsPath: addStatsPath,
//   validateTranscription: validateTranscription,
//   prioritize: prioritize,
//   failTranscription: failTranscription,
//   addFirst: addFirst,
//   removeTranscriber: removeTranscriber,
//   getCourses: getCourses,
//   getCaptions: getCaptions,
//   getTasks: getTasks,
//   getsortedTask: getsortedTask,
//   getFirst: getFirst,
//   getFinished: getFinished,
//   addInstructors: addInstructors,
//   addStudents: addStudents,
//   addTranscriptionPath: addTranscriptionPath,
//   getTerms: getTerms,
//   getUserByID: getUserByID,
//   getKeysByClass: getKeysByClass,
//   enrollInstuctor: enrollInstuctor,
//   multi: multi,
//   exec: exec
// };
