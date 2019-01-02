'use strict';
var Sequelize = require('sequelize');
var models = require('../models');
const uuid = require('uuid/v4');
const sequelize = models.sequelize;

const Op = Sequelize.Op;
const CourseOffering = models.CourseOffering;
const Course = models.Course;
const Dept = models.Dept;
const EchoSection = models.EchoSection;
const Lecture = models.Lecture;
const Media = models.Media;
const MSTranscriptionTask = models.MSTranscriptionTask;
const Offering = models.Offering;
const Role = models.Role;
const Term = models.Term;
const University = models.University;
const User = models.User;
const UserOffering = models.UserOffering;
const YoutubeChannel = models.YoutubeChannel;
const CourseOfferingMedia = models.CourseOfferingMedia;
/* ----- end of defining ----- */

function addCourseOfferingMedia(courseOfferingId, mediaId, description) {
    return CourseOfferingMedia.findOrCreate({
      where: {
        courseOfferingId: courseOfferingId,
        mediaId: mediaId
      },
      defaults: {
          id: uuid(),
          descpJSON: JSON.stringify(description),
          mediaId: mediaId,
          courseOfferingId: courseOfferingId
      }
    })
}

function addYoutubeChannelPlaylist(playlistId, channelId) {
    return YoutubeChannel.findOrCreate({
        where: {
            playlistId: playlistId
        },
        defaults: {
            playlistId: playlistId,
            channelId: channelId
        }
    });
}

function addCourseAndSection(courseId, sectionId, downloadHeader) {
    return EchoSection.findOrCreate({
        where: {
            sectionId: sectionId
        },
        defaults: {
            sectionId: sectionId,
            courseId: courseId,
            json: {
                downloadHeader: downloadHeader
            }
        }
    });
}

async function addMedia(videoURL, sourceType, siteSpecificJSON) {
    var media = await Media.findOrCreate({
        where: {
            videoURL: videoURL
        },
        defaults: {
            videoURL: videoURL,
            sourceType: sourceType,
            siteSpecificJSON: JSON.stringify(siteSpecificJSON)
        }
    });
    return media[0].id;
}

async function addMSTranscriptionTask(mediaId) {
    var task = await MSTranscriptionTask.findOrCreate({
        where: {
        mediaId: mediaId
        },
        defaults: {
        id: uuid(),
        mediaId: mediaId
        }
    });
    return task[0].id;
}

// Return taskId
async function addToMediaAndMSTranscriptionTask(videoURL, sourceType, siteSpecificJSON, courseOfferingId) {
    var mediaId = await addMedia(videoURL, sourceType, siteSpecificJSON);
    await addCourseOfferingMedia(courseOfferingId, mediaId, siteSpecificJSON);
    var taskId = await addMSTranscriptionTask(mediaId);
    return taskId;
}

/* findOrCreate University first,
 * then findOrCreate user, and append universityId
 *
 * This is not a suggested way according to the documentation,
 * though I haven't found a better and correct implementation.
 */
function addUser(user) {

  return University.findOrCreate({
    where : { universityName : user.university }
  }).then((result) => {
    var universityInfo = result[0].dataValues; // result is an array of json object
    /* create the User or find the User */
    return User.findOrCreate({
      where : { mailId : user.mailId },
      defaults : {
        id: uuid(),
        firstName : user.firstName,
        lastName : user.lastName,
        password : user.password,
        passwordToken : '',
        verified : false,
        verifiedId : user.verifiedId,
        universityId : universityInfo.id,
        googleId : user.googleId,
      }
    }).then(result => {
      return result[0].dataValues;
    }).catch(err => {throw new Error('addUser() Failed' + err.message)}); /* User.findOrCreate() */
  }).catch(err => {throw new Error('addUser() Failed');}); /* University.findOrCreate() */
}


function addLecture(courseId, mediaId, date) {
  return Lecture.findOrCreate({
    where : {
      courseId : courseId,
      mediaId : mediaId,
    } ,
    defaults : {
      id: uuid(),
      date : date,
    },
  }).then(result => {
    return result[0].dataValues;
  }).catch(err => {throw new Error('addLecture() Failed' + err.message);});
}

/* findOrCreate the course,
 * then use provided offeringId,
 * update userOffering table
 */
function addCourseHelper(id) {
  return CourseOffering.findOrCreate({
    where : {
      courseId : id.courseId,
      offeringId : id.offeringId,
    },
  }).then(result => {
    var courseOfferingInfo = result[0].dataValues;

    return UserOffering.findOrCreate({
      where : {
        userId : id.userId,
        courseOfferingId : courseOfferingInfo.id,
        roleId : id.roleId,
      }, defaults: {
        id: uuid(),
      }
    }).then(result => {
      return result[0].dataValues;
    }).catch(err => {
      throw new Error('addCourseHelper() Failed' + err.message);
    }); /* UserOffering.findOrCreate() */
  }).catch(err => {
    throw new Error('addCourseHelper() Failed' + err.message);
  }); /*  CourseOffering.findOrCreate() */
}

/*
 * course = {
 *   courseName, courseNumber, courseDescription,
 *   dept, term, section, deptName, acronym
 *  }
 */
function addCourse(user, course) {
  /* if user and courseList are not empty */
  if(user && course) {
    var id = { universityId : user.universityId };
    var role_result = getRoleId( 'Instructor' );
    var user_result = getUserByEmail( user.mailId );
    return Promise.all([role_result, user_result]).then( values => {

      var id = {
        roleId : values[0].id,
        userId : values[1].id,
        universityId : values[1].universityId,
      }

      /* userId is not matched */
      if (id.userId != user.id) {
        throw new Error('User ID is not matched');
      }

      /* add course */
      let term_result = getTermId( course.term );
      let dept_result = getDeptId( course.dept );
      return Promise.all([term_result, dept_result]).then(values => {

        id.termId = values[0].id;
        id.deptId = values[1].id;
        let course_result = getCourseId(course);
        let offering_result = getOfferingId(id, course.section);
        return Promise.all([course_result, offering_result]).then(values => {

          id.courseId = values[0].id;
          id.offeringId = values[1].id;
          return addCourseHelper(id);
        }).catch(err => { throw new Error('addCourse() Failed' + err.message) }); /* end of getOfferingId() */
      }).catch(err => { throw new Error('addCourse() Failed' + err.message) }); /* end of Promise.all */
    }).catch(err => { throw new Error('addCourse() Failed' + err.message) }); /* end of Promise.all */
  }
  throw new Error('User Info or Course List is empty');
}

function addStudent(studentId, courseOfferingId) {
  return Role.findOrCreate({
    where : { roleName : 'Student', },
    defaults: { id: uuid() }
  }).then(result => {
    var roleInfo = result[0].dataValues;

    return UserOffering.findOrCreate({
      where : {
        courseOfferingId : courseOfferingId,
        userId : studentId,
      },
      defaults : {
        id: uuid(),
        roleId : roleInfo.id
      }
    }).then((result, created) => {
      if (created === false) {
        log('YOU HAVE REGISTER ALREADY');
      }
      return result[0].dataValues;
    }).catch(err => perror({userId : studentId, courseOfferingId : courseOfferingId}, err)); /* UserOffering.findOrCreate() */
  }).catch(err => perror({userId : studentId, courseOfferingId : courseOfferingId}, err));/* Role.findOrCreate() */
}

module.exports = {
  addYoutubeChannelPlaylist : addYoutubeChannelPlaylist,
  addCourseOfferingMedia : addCourseOfferingMedia,
  addCourseAndSection : addCourseAndSection,
  addMedia : addMedia,
  addMSTranscriptionTask : addMSTranscriptionTask,
  addToMediaAndMSTranscriptionTask : addToMediaAndMSTranscriptionTask,
  addUser : addUser,
  addLecture : addLecture,
  addCourse : addCourse,
  addStudent : addStudent
}
