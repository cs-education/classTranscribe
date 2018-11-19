'use strict';
var Sequelize = require('sequelize');
var models = require('../models');
const utils = require('../utils/logging');
const uuid = require('uuid/v4');
const sequelize = models.sequelize;

sequelize.sync();

const perror = utils.perror;
const info = utils.info;
const log = utils.log;

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
/* ----- end of defining ----- */

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

function addMedia(videoURL, sourceType, siteSpecificJSON) {
    return Media.create({
        videoURL: videoURL,
        sourceType: sourceType,
        siteSpecificJSON: siteSpecificJSON
    });
}

function addMSTranscriptionTask(mediaId) {
    return MSTranscriptionTask.create({
        id: uuid(),
        mediaId: mediaId
    });
}

function getTask(taskId) {
    return MSTranscriptionTask.findById(taskId);
}

function getMedia(mediaId) {
    return Media.findById(mediaId);
}

function getMediaByTask(taskId) {
    return getTask(taskId).then(task => getMedia(task.mediaId));
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
    var universityInfo = result[0].dataValues; // result is an array of json object
    /* create the User or find the User */
    return User.findOrCreate({
      where : { mailId : user.mailId },
      defaults : {
        firstName : user.firstName,
        lastName : user.lastName,
        password : user.password,
        passwordToken : '',
        verified : false,
        verifiedId : user.verifiedId,
        universityId : universityInfo.id,
      }
    }).then(result => {
      return result[0].dataValues;
    }).catch(err => perror(err)); /* User.findOrCreate() */
  }).catch(err => perror(err)); /* University.findOrCreate() */
}

/* SELECT * FROM User WHERE mailId=email LIMIT 1*/
function getUserByEmail(email) {
  /* Since the email should be unique,
   * findOne() is sufficient
   */
  return User.findOne({
    where : { mailId : email }
  }).then(result => {

    try {
      return result.dataValues;
    } catch (err) {
      perror(err);
      return null;
    }

  }).catch(err => perror(err));
}

/* UPDATE User SET verifiedId = verifiedId WHERE mailId = email */
function verifyUser(verifiedId, email) {
  return User.update( {
    verified : true,
  }, {
    where : {
      mailId : email,
      verifiedId : verifiedId,
    }
  }).catch(err => perror(err));
}

function setUserName(name, email) {
  return User.update({
    firstName : name.firstName,
    lastName : name.lastName,
  }, {
    where : {
      mailId : email,
    }
  }).catch(err => perror(err));
}

function setUserPassword(newPassword, email) {
  return User.update({
    password : newPassword,
    passwordToken : '',
  }, {
    where : {
      mailId : email,
    }
  }).catch(err => perror(err));
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
  }).then(result => {
    return result[0].dataValues;
  }).catch(err => perror(err));
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
  }).then(values => {
    var jsonList = values.map(value => value.dataValues);
    return jsonList;
  }).catch(err => perror(err));
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
  }).then(result => {
    return result[0].dataValues;
  }).catch(err => perror(err));
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
      },
    }).then(result => {
      return result[0].dataValues;
    }).catch(err => perror(err)); /* UserOffering.findOrCreate() */
  }).catch(err => perror(err)); /*  CourseOffering.findOrCreate() */
}

function getCourseId(courseInfo) {
  var dept = courseInfo.dept;
  return Dept.findOne({
    where : {
      deptName : dept.name,
      acronym : dept.acronym,
    }
  }).then(result => {
    var deptInfo = result.dataValues;
    return Course.findOrCreate({
      where : {
        courseName : courseInfo.courseName,
        courseNumber : courseInfo.courseNumber,
        deptId : deptInfo.id,
      },
      defaults : {
        courseDescription : courseInfo.courseDescription,
      }
    }).then(result => {
      return result[0].dataValues;
    }).catch(err => perror(err)); /* Course.findOrCreate() */
  }).catch(err => perror(err)); /* Dept.findOne() */
}

/* getRole() findOrCreate a role */
function getRoleId(role) {
  return Role.findOrCreate({
    where : { roleName : role },
  }).then(result => {
    return result[0].dataValues;
  }).catch(err => perror(err));
}

/* findOrCreate term, and return termId */
function getTermId(term) {
  return Term.findOrCreate({
    where : { termName : term }
  }).then( result => {
    return result[0].dataValues;
  }).catch( err => perror(err));
}

function getDeptId(dept) {
  return Dept.findOrCreate({
    where : { deptName : dept.name },
    defaults : { acronym : dept.acronym }
  }).then(result => {
    return result[0].dataValues;
  }).catch(err => perror(err));
}

/* getOfferingId() findOrCreate an offeringId */
function getOfferingId(id, sectionName) {
  return Offering.findOrCreate({
    where : {
      termId : id.termId,
      deptId : id.deptId,
      universityId : id.universityId,
      section : sectionName,
    },
  }).then(result => {
    return result[0].dataValues;
  }).catch(err => perror(err));
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
        throw Error('User ID is not matched');
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
        }).catch(err => { perror(err) }); /* end of getOfferingId() */
      }).catch(err => { perror(err) }); /* end of Promise.all */
    }).catch(err => { perror(err) }); /* end of Promise.all */
  }
  throw Error('User Info or Course List is empty');
}

/* Get All Terms */
function getTerms() {
  return Term.findAll().then(values => {
    var result = values.map(value => value.dataValues);
    return result;
  });
}

/* Get All Courses */
function getCoursesByUniversityId( universityId ) {

  return sequelize.query(
    'SELECT oid.*, cid.*, coid.id\
     FROM \
     Offerings oid, CourseOfferings coid, Courses cid \
     WHERE \
     oid.id = coid.offeringId AND cid.id = coid.courseId AND universityId = ?',
     { replacements: [ universityId ], type: sequelize.QueryTypes.SELECT })
     .then(values => {
       return values.map(value => {

         /* move value.id to value.courseOfferingId */
         value.courseOfferingId = value.id;
         delete value.id;

         /* remove time attribute */
         delete value.createdAt;
         delete value.updatedAt;
         return value;
       })
     }).catch(err => perror(err)); /* raw query */
}

function addStudent(studentId, courseOfferingId) {
  return Role.findOrCreate({
    where : { roleName : 'Student', }
  }).then(result => {
    var roleInfo = result[0].dataValues;

    return UserOffering.findOrCreate({
      where : {
        courseOfferingId : courseOfferingId,
        userId : studentId,
      },
      defaults : { roleId : roleInfo.id, }
    }).then((result, created) => {
      if (created === false) {
        log('YOU HAVE REGISTER ALREADY');
      }
      return result[0].dataValues;
    }).catch(err => perror(err)); /* UserOffering.findOrCreate() */
  }).catch(err => perror(err));/* Role.findOrCreate() */
}

function removeStudent (studentId, offeringId) {
  /* you need to add students before remove them, assuming the roleId has been created */
  return Role.findOne({
    where : { roleName : 'Student',}
  }).then(result => {
    var roleId = result.dataValues.id;
    return UserOffering.destroy({
      where : {
        roleId : roleId,
        userId : studentId,
        courseOfferingId : courseOfferingId,
      }
    }).then(result => {
      log('Student has been removed.');
    }).catch(err => perror(err)); /* UserOffering.destroy() */
  }).catch(err => perror(err)); /* Role.findOne() */
}

function getUniversityName (universityId) {
  return University.findById(universityId);
}

function getTermsById (ids) {
  return Term.findAll({
    where : {
      id : { [Op.in] : ids }
    }
  }).then(values => {
    return values.map(value => value.dataValues);
  }).catch(err => perror(err))
}

function getDeptsById (ids) {
  return Dept.findAll({
    where : {
      id : { [Op.in] : ids }
    }
  }).then(values => {
    return values.map(value => value.dataValues);
  }).catch(err => perror(err))
}

function getSectionsById (ids) {
  return Offering.findAll({
    where : {
      id : { [Op.in] : ids }
    },
  }).then(values => {
    return values.map(value => value.dataValues);
  }).catch(err => perror(err))
}

function getInstructorsByCourseOfferingId (ids) {
  return Role.findOne({
    where : {
      roleName : 'Instructor',
    },
  }).then(result => {
    var roleInfo = result.dataValues;
    return UserOffering.findAll({
      where : {
        roleId : roleInfo.id,
        courseOfferingId : { [Op.in]: ids }
      }
    }).then(values => {
      var userOfferingList = values.map(value => value.dataValues);
      var userIds = userOfferingList.map(value => value.userId);
      return User.findAll({
        where : {
          id : { [Op.in] : userIds }
        }
      }).then(values => {
        var instructors = [];
        var users = values.map(value => value.dataValues);
        /* match instructors with courses, there should be a clearer way to do so */
        for (let i = 0; i < userOfferingList.length; i++) {
          for (let j = 0; j < users.length; j++) {
            if (userOfferingList[i].userId === users[j].id) {
              var instructor = {
                courseOfferingId : userOfferingList[i].courseOfferingId,
                userId : users[j].id,
                firstName : users[j].firstName,
                lastName : users[j].lastName,
                mailId : users[j].mailId,
              };
              instructors.push(instructor);
            }
          }
        }
        return instructors;
      }).catch(err => perror(err)) /* User.findAll() */
    }).catch(err => perror(err)); /* UserOffering.findAll() */
  }).catch(err => perror(err)); /* Role.findOne() */
}

function validateUserAccess( courseOfferingId, userId ) {
  return UserOffering.findOne({
    where : {
      courseOfferingId : courseOfferingId,
      userId : userId,
    }
  }).then(result => {
    return result.dataValues;
  }).catch(err => perror(err));
}

function getCourseByOfferingId(offeringId) {
  return CourseOffering.findAll({
    where : { offeringId : offeringId }
  }).then(values => {
    var courseInfos = values.map(value => value.dataValues);
    var courseIds = courseInfos.map(courseInfo => courseInfo.id);
    return Course.findAll({
      where : {
        id : { [Op.in] : courseIds },
      }
    }).then(values => {
      return values.map(value => value.dataValues);
    }).catch(err => perror(err)); /* Course.findAll() */
  }).catch(err => perror(err)); /* CourseOffering.findAll() */
}

function getDept(deptId) {
  return Dept.findOne({
    where : {
      id : deptId,
    }
  }).then(result => {
    return result.dataValues;
  }).catch(err => perror(err));
}

function addPasswordToken(userInfo, token) {
  return User.update({
    passwordToken : token,
  }, {
    where : {
      id : userInfo.id,
      mailId : userInfo.mailId,
    }
  }).catch(err => perror(err));
}

module.exports = {
    models: models,
    addCourseAndSection: addCourseAndSection,
    addMedia: addMedia,
    addMSTranscriptionTask: addMSTranscriptionTask,
    addLecture : addLecture,
    addCourse : addCourse,
    addPasswordToken : addPasswordToken,
    addStudent : addStudent,
    removeStudent : removeStudent,
    createUser: createUser,
    setUserName: setUserName,
    setUserPassword : setUserPassword,
    verifyUser: verifyUser,
    getTask: getTask,
    getMedia: getMedia,
    getMediaByTask: getMediaByTask,
    getEchoSection: getEchoSection,
    getUserByEmail: getUserByEmail,
    getUniversityId: getUniversityId,
    getUniversityName : getUniversityName,
    getCoursesByTerms : getCoursesByTerms,
    getCoursesByIds : getCoursesByIds,
    getCoursesByUniversityId : getCoursesByUniversityId,
    getCourseId : getCourseId,
    getCourseByOfferingId : getCourseByOfferingId,
    getRoleId : getRoleId,
    getTermId : getTermId,
    getTermsById : getTermsById,
    getTerms : getTerms,
    getDeptId : getDeptId,
    getDept : getDept,
    getOfferingId : getOfferingId,
    getDeptsById : getDeptsById,
    getSectionsById : getSectionsById,
    getInstructorsByCourseOfferingId : getInstructorsByCourseOfferingId,
    validateUserAccess : validateUserAccess,
}
