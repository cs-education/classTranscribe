'use strict';
var Sequelize = require('sequelize');
var models = require('../models');
models.sequelize.sync();

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
/* ----- end of defining ----- */

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

function addMedia(videoURL, sourceType, siteSpecificJSON) {
    return Media.create({
        videoURL: videoURL,
        sourceType: sourceType,
        siteSpecificJSON: siteSpecificJSON
    });
}

function addMSTranscriptionTask(mediaId) {
    return MSTranscriptionTask.create({
        mediaId: mediaId
    });
}

function getTask(taskId) {
    return MSTranscriptionTask.findById(taskId);
}

function getMedia(mediaId) {
    return Media.findById(mediaId);
}

function getEchoSection(sectionId) {
    return EchoSection.findById(sectionId);
}

/* findOrCreate University first,
 * then findOrCreate user, and append universityId
 *
 * This is not a suggested way according to the documentation,
 * though I haven't found a better and correct implementation.
 */
function createUser(user) {
  return University.findOrCreate({
    where : { universityName : user.university }
  }).then((result) => {
    console.log('result:', result);
    return User.findOrCreate({
      where : { mailId : user.mailId },
      defaults : {
        firstName : user.firstName,
        lastName : user.lastName,
        password : user.password,
        verifiedId : null, // provide verifyId after being verified
        universityId : result[0].dataValues.id, // result is an array of json object
      }
    });
  });
}

/* SELECT * FROM User WHERE mailId=email LIMIT 1*/
function getUserByEmail(email) {
  /* Since the email should be unique,
   * findOne() is sufficient
   */
  return User.findOne({
    where : { mailId : email }
  });
}

/* UPDATE User SET verifiedId = verifiedId WHERE mailId = email */
function verifyUser(verifiedId, email) {
  return User.update( {
    verifiedId : verifiedId,
  }, {
    where : {
      mailId : email,
    }
  });
}

function setUserName(name, email) {
  return User.update({
    firstName : name.firstName,
    lastName : name.lastName,
  }, {
    where : {
      mailId : email,
    }
  });
}

function setUserPassword(newPassword, email) {
  return User.update({
    password : newPassword,
  }, {
    where : {
      mailId : email,
    }
  });
}

/* findOrCreate university to Table Universities,
 * Shouldn't be used since we
 * currently only support UIUC
 */
function getUniversityId(universityName) {

  return University.findOrCreate({
    where: {
      universityName : universityName,
    }
  });
}

/* Assuming input is an array */
function getCoursesByTerms(term) {
  var termId_list = []
  var offeringId_list = [];
  var courseId_list = [];

  return Term.findAll({ // fetch termId
    where : {
      termName : { [Op.in] : term } // SELECT * FROM Term WHERE termName IN term
    }
  }).then((result) => { // fetch offeringId
    for (let i = 0; i < result.length; i++) {
      termId_list[i] = result[i].dataValues.id;
    }
    return Offering.findAll({
      where : {
        termId: { [Op.in] : termId_list } // SELECT * FROM Offering WHERE termId == result:  (list)
      }
    });
  }).then((result) => { // fetch courseId
    for (let i = 0; i < result.length; i++) {
      offeringId_list[i] = result[i].dataValues.id;
    }
    return CourseOffering.findAll({
      where : {
        offeringId : { [Op.in] : offeringId_list} // SELECT * FROM CourseOffering WHERE offeringId IN result
      }
    });
  }).then((result) => { // fetch Courses
    for (let i = 0; i < result.length; i++) {
      courseId_list[i] = result[i].dataValues.courseId;
    }
    return getCoursesByIds(courseId_list);
  });
}

/* SELECT * FROM Course WHERE id IN courseId */
function getCoursesByIds(courseId) {
  return Course.findAll({
    where : {
      id : {[Op.in] : courseId}
    }
  })
}

function addLecture(courseId, mediaId, date) {
  return Lecture.findOrCreate({
    where : {
      courseId : courseId,
      mediaId : mediaId,
    } ,
    defaults : {
      date : date,
    },
  });
}

/* findOrCreate the course,
 * then use provided offeringId,
 * update userOffering table
 */
function addCourse(id) {
  return CourseOffering.findOrCreate({
    where : {
      courseId : id.courseId,
      offeringId : id.offeringId,
    },
  }).then(result => {
    return UserOffering.findOrCreate({
      where : {
        userId : id.userId,
        offeringId : id.offeringId,
        roleId : id.roleId,
      },
    })
  })
}

function getCourseId(courseInfo) {
  return Course.findOrCreate({
    where : {
      courseName : courseInfo.courseName,
      courseNumber : courseInfo.courseNumber,
    },
    defaults : {
      courseDescription : courseInfo.courseDescription,
    }
  })
}

/* getRole() findOrCreate a role */
function getRoleId(role) {
  return Role.findOrCreate({
    where : { roleName : role },
  });
}

/* findOrCreate term, and return termId */
function getTermId(term) {
  return Term.findOrCreate({
    where : { termName : term }
  });
}

function getDeptId(dept) {
  return Dept.findOrCreate({
    where : { deptName : dept.name },
    defaults : { acronym : dept.acronym }
  })
}

/* getOfferingId() findOrCreate an offeringId */
function getOfferingId(id) {
  return Offering.findOrCreate({
    where : {
      termId : id.termId,
      deptId : id.deptId,
      universityId : id.universityId,
    },
  });
}

module.exports = {
    models: models,
    addCourseAndSection: addCourseAndSection,
    addMedia: addMedia,
    addMSTranscriptionTask: addMSTranscriptionTask,
    addLecture : addLecture,
    addCourse : addCourse,
    createUser: createUser,
    setUserName: setUserName,
    verifyUser: verifyUser,
    getTask: getTask,
    getMedia: getMedia,
    getEchoSection: getEchoSection,
    getUserByEmail: getUserByEmail,
    getUniversityId: getUniversityId,
    getCoursesByTerms : getCoursesByTerms,
    getCoursesByIds : getCoursesByIds,
    getCourseId : getCourseId,
    getRoleId : getRoleId,
    getTermId : getTermId,
    getDeptId : getDeptId,
    getOfferingId : getOfferingId,
}
