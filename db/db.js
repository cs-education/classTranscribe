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
    return User.findOrCreate({
      where : { mailId : user.mailId },
      defaults : {
        firstName : user.firstName,
        lastName : user.lastName,
        password : user.password,
        verified : false,
        verifiedId : user.verifiedId, // provide verifyId after being verified
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
    verified : true,
  }, {
    where : {
      mailId : email,
      verifiedId : verifiedId,
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
  var jsonList = [];
  return Course.findAll({
    where : {
      id : {[Op.in] : courseId}
    }
  }).then(result => {
    for (let  i = 0; i < result.length; i++) {
      jsonList[i] = result[i].dataValues;
    }
    return jsonList;
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
function addCourseHelper(id) {
  return CourseOffering.findOrCreate({
    where : {
      courseId : id.courseId,
      offeringId : id.offeringId,
    },
  }).then(result => {
    return UserOffering.findOrCreate({
      where : {
        userId : id.userId,
        courseOfferingId : result[0].dataValues.id,
        roleId : id.roleId,
      },
    })
  })
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
    });
  }).catch(err => perror(err)); /* Dept.findOne() */
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
function getOfferingId(id, sectionName) {
  return Offering.findOrCreate({
    where : {
      termId : id.termId,
      deptId : id.deptId,
      universityId : id.universityId,
      section : sectionName,
    },
  });
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
        roleId : values[0][0].dataValues.id,
        userId : values[1].dataValues.id,
        universityId : values[1].dataValues.universityId,
      }

      /* userId is not matched */
      if (id.userId != user.id) {
        throw Error('User ID is not matched');
      }

      /* add course */
      let term_result = getTermId( course.term );
      let dept_result = getDeptId( course.dept );
      return Promise.all([term_result, dept_result]).then(values => {
        id.termId = values[0][0].dataValues.id;
        id.deptId = values[1][0].dataValues.id;
        let course_result = getCourseId(course);
        let offering_result = getOfferingId(id, course.section);
        return Promise.all([course_result, offering_result]).then(values => {
          id.courseId = values[0][0].dataValues.id;
          id.offeringId = values[1][0].dataValues.id;
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
    var result = [];
    for (let i = 0; i < values.length; i++) {
      result[i] = values[i].dataValues;
    }
    return result;
  });
}

/* Get All Courses */
function getCoursesByUniversityId( universityId ) {
  return Offering.findAll({
    where : {universityId : universityId},
  }).then(values => {
    var offeringValues = values.map( value => value.dataValues);
    var offeringIds = offeringValues.map( offeringValue => offeringValue.id );
    return CourseOffering.findAll({
      where : {
        offeringId : { [Op.in] : offeringIds }
      }
    }).then(values => {
      var courseMap = {};
      var courseList = values.map( value => {
        value = value.dataValues;
        courseMap[value.courseId] = value.id;
        return value.courseId;
      });

      return Course.findAll({
        where : {
          id : { [Op.in] : courseList }
        }
      }).then(values => {
        var v = values.map((value, index) => {
          value = value.dataValues;
          value.offeringId = offeringIds[index];
          value.termId = offeringValues[index].termId;
          value.courseOfferingId = courseMap[value.id];
          return value;
        });
        return v;
      }).catch(err => perror(err)); /* Course.findAll() */
    }).catch(err => perror(err)); /* CourseOffering.findAll() */
  }).catch(err => perror(err)) /* Offering.findAll() */
}

function addStudent(studentId, courseOfferingId) {
  return Role.findOrCreate({
    where : { roleName : 'Student', }
  }).then(result => {
    var roleId = result[0].dataValues.id;
    return UserOffering.findOrCreate({
      where : {
        courseOfferingId : courseOfferingId,
        userId : studentId,
      },
      defaults : { roleId : roleId, }
    }).then((result, created) => {
      if (created === false) {
        console.log('YOU HAVE REGISTER ALREADY');
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
      console.log('Student has been removed.');
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
    return UserOffering.findAll({
      where : {
        roleId : result.dataValues.id,
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
    var courseIds = values.map(value => value.dataValues.courseId);
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

/* wrapper function to print error */
function perror(err) {
  /* change font to red, print err, then reset color */
  console.log('\x1b[31m %s \x1b[0m', err);
}

module.exports = {
    models: models,
    addCourseAndSection: addCourseAndSection,
    addMedia: addMedia,
    addMSTranscriptionTask: addMSTranscriptionTask,
    addLecture : addLecture,
    addCourse : addCourse,
    addStudent : addStudent,
    removeStudent : removeStudent,
    createUser: createUser,
    setUserName: setUserName,
    setUserPassword : setUserPassword,
    verifyUser: verifyUser,
    getTask: getTask,
    getMedia: getMedia,
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
