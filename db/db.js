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
const CourseOfferingMedia = models.CourseOfferingMedia;
const TaskMedia = models.TaskMedia;
/* ----- end of defining ----- */

function getAllCourses() {
  return Course.findAll({limit: 8})
}

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

async function getMediaIdsByCourseOfferingId(courseOfferingId) {
    var mediaIds = await sequelize.query("SELECT M.id \
        FROM Media as M, CourseOfferingMedia  \
        WHERE M.id = CourseOfferingMedia.mediaId and CourseOfferingMedia.courseOfferingId = ? ",
        { replacements: [courseOfferingId], type: sequelize.QueryTypes.SELECT }).catch(err => perror(err)); /* raw query */
    mediaIds = mediaIds.map(a => a.id);
    return mediaIds;
}

function getPlaylistByCourseOfferingId(courseOfferingId) {
  return sequelize.query(
   'SELECT mst.videoLocalLocation, mst.srtFileLocation, M.siteSpecificJSON, mst.mediaId \
    FROM MSTranscriptionTasks AS mst \
    INNER JOIN TaskMedia as tm on tm.taskId = mst.id \
    INNER JOIN Media as M on tm.mediaId = M.id \
    INNER JOIN CourseOfferingMedia as com on com.mediaId = M.id \
    WHERE com.courseOfferingId = ? \
    ORDER BY M.id',
   { replacements: [ courseOfferingId ], type: sequelize.QueryTypes.SELECT}).catch(err => perror(err)); /* raw query */
}

async function doesEchoMediaExist(echoMediaId) {
    var query = await sequelize.query("SELECT count(*) as count, id as mediaId\
                FROM(Select JSON_VALUE(siteSpecificJSON, '$.mediaId') as echoMediaId, id FROM Media) a \
                WHERE echoMediaId = ? \
                GROUP BY id; ",
        { replacements: [echoMediaId], type: sequelize.QueryTypes.SELECT }).catch(err => perror(err)); /* raw query */
    var count = query.count;
    console.log(query);
    console.log(count);
    return count > 0 ? true : false;
}

async function getIncompleteTasks() {
    var tasks = await MSTranscriptionTask.findAll({
        where: {
            videoHashsum: { [Op.ne]: null },
            srtFileLocation: { [Op.eq]: null }
        }
    });
    return tasks;
}

async function doesYoutubeMediaExist(playlistId, title) {
    var query = await sequelize.query("Select count(*)  as count, id as mediaId\
        FROM(Select JSON_VALUE(siteSpecificJSON, '$.playlistId') as playlistId, JSON_VALUE(siteSpecificJSON, '$.title') as title, id FROM Media) a \
        WHERE playlistId = ? and title = ? \
        GROUP BY id",
        { replacements: [playlistId, title], type: sequelize.QueryTypes.SELECT }).catch(err => perror(err)); /* raw query */
    var count = query.count;
    return count > 0 ? true : false;
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

async function addMSTranscriptionTask(mediaId, task, videoHashsum, videoLocalLocation) {
    if (task == null) {
        task = await MSTranscriptionTask.create({ id: uuid(), videoHashsum: videoHashsum, videoLocalLocation: videoLocalLocation });    
    }
    await TaskMedia.create({ taskId: task.id, mediaId: mediaId });    
    return task;
}

async function getTaskIfNotUnique(videoHashsum) {
    var result = await MSTranscriptionTask.findAndCountAll({ where: { videoHashsum: videoHashsum } });
    if (result.count != 0) {
        // Ensure file exists
        if (fs.existsSync(result.rows[0].dataValues.videoLocalLocation)) {
            return result.rows[0].dataValues;
        } else {
            await MSTranscriptionTask.destroy({ where: { videoHashsum: videoHashsum } });
            return null;
        }
    } else {
        return null;
    }
}

// Return taskId
async function addToMediaAndCourseOfferingMedia(videoURL, sourceType, siteSpecificJSON, courseOfferingId) {
    var mediaId = await addMedia(videoURL, sourceType, siteSpecificJSON);
    await addCourseOfferingMedia(courseOfferingId, mediaId, siteSpecificJSON);    
    return mediaId;
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

/* SELECT * FROM User WHERE googleId=profileId LIMIT 1*/
function getUserByGoogleId(profileId) {
    /* Since the email should be unique,
     * findOne() is sufficient
     */
    return User.findOne({
        where: { googleId: profileId }
    }).then(result => {
        if (result) {
            return result.dataValues;
        } else {
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
    }, defaults: {
      id: uuid(),
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
      id: uuid(),
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
      }, defaults: {
        id: uuid(),
      }
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
        id: uuid(),
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
    defaults : { id: uuid() }
  }).then(result => {
    return result[0].dataValues;
  }).catch(err => perror(err));
}

/* findOrCreate term, and return termId */
function getTermId(term) {
  return Term.findOrCreate({
    where : { termName : term },
    defaults : { id: uuid() }
  }).then( result => {
    return result[0].dataValues;
  }).catch( err => perror(err));
}

function getDeptId(dept) {
  return Dept.findOrCreate({
    where : { deptName : dept.name },
    defaults : {
      id: uuid(),
      acronym : dept.acronym
    }
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
    }, defaults : {
      id: uuid()
    }
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

/* Get All Courses by University */
function getCoursesByUniversityId( universityId ) {

  return sequelize.query(
    'SELECT oid.*, cid.*, coid.id\
     FROM \
     Offerings oid, CourseOfferings coid, Courses cid \
     WHERE \
     oid.id = coid.offeringId AND cid.id = coid.courseId AND oid.universityId = ?',
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

/* Get All Courses by User info */
function getCoursesByUserId( uid ) {

  return UserOffering.findAll({
    where : { userId : uid },
  }).then(values => {

    if(values.length === 0) {
      return values;
    }

    const courseOfferingIds = values.map(value => value.dataValues.courseOfferingId);

    return sequelize.query(
      'SELECT oid.*, cid.*, coid.id\
      FROM \
      Offerings oid, CourseOfferings coid, Courses cid\
      WHERE \
      oid.id = coid.offeringId AND cid.id = coid.courseId AND coid.id IN (:coids)',
      { replacements: { coids : courseOfferingIds }, type: sequelize.QueryTypes.SELECT })
      .then(values => {

        return values.map(value => {
          /* move value.id to value.courseOfferingId */
          value.courseOfferingId = value.id;
          delete value.id;

          /* remove time attribute */
          delete value.createdAt;
          delete value.updatedAt;
          return value;
        });

      }).catch(err => perror(err)); /* rawquery */
    }).catch(err => perror(err)); /* UserOffering.findAll() */
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
  /* empty input */
  if (ids.length === 0) {
    return ids;
  }

  return Role.findOne({
    /* find Instructor's uuid */
    where : { roleName : 'Instructor', },
  }).then(result => {
    var instructorId = result.dataValues.id;

    /*
     * query to fetch informations based on courseOfferingIds and roleId
     *
     * only select relative information
     */
    return sequelize.query(
      'SELECT uoid.courseOfferingId, uid.id, uid.firstName, uid.lastName, uid.mailId \
      FROM \
      UserOfferings uoid, Users uid \
      WHERE \
      uoid.courseOfferingId IN (:coids) AND uoid.roleId = :rid AND uoid.userId = uid.id',
      { replacements: { coids : ids, rid : instructorId }, type: sequelize.QueryTypes.SELECT })
      .catch(err => perror(err)); /* sequelize.query() */
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

function setUserRole(userId, role) {
  return Role.findOrCreate({
    where : { roleName : role },
    defaults : { id: uuid() }
  }).then(result => {
    const roleInfo = reuslt[0].dataValues;
    return User.update({
      roleId : roleInfo.id,
    }, {
      where : { id : userId },
    }).catch(err => perror(err)); /* User.update() */
  }).catch(err => perror(err)); /* Role.findOrCreate() */
}

module.exports = {
    models: models,
    getAllCourses: getAllCourses,
    addCourseOfferingMedia: addCourseOfferingMedia,
    getPlaylistByCourseOfferingId: getPlaylistByCourseOfferingId,
    addCourseAndSection: addCourseAndSection,
    addMedia: addMedia,
    addMSTranscriptionTask: addMSTranscriptionTask,
    addToMediaAndCourseOfferingMedia: addToMediaAndCourseOfferingMedia,
    addLecture : addLecture,
    addCourse : addCourse,
    addPasswordToken : addPasswordToken,
    addStudent : addStudent,
    removeStudent : removeStudent,
    createUser: addUser,
    setUserName: setUserName,
    setUserPassword : setUserPassword,
    verifyUser: verifyUser,
    getTask: getTask,
    getMedia: getMedia,
    getMediaByTask: getMediaByTask,
    getEchoSection: getEchoSection,
    getUserByEmail: getUserByEmail,
    getUserByGoogleId: getUserByGoogleId,
    getUniversityId: getUniversityId,
    getUniversityName : getUniversityName,
    getCoursesByTerms : getCoursesByTerms,
    getCoursesByIds : getCoursesByIds,
    getCoursesByUniversityId : getCoursesByUniversityId,
    getCoursesByUserId : getCoursesByUserId,
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
    validateUserAccess: validateUserAccess,
    getTaskIfNotUnique: getTaskIfNotUnique,
    doesEchoMediaExist: doesEchoMediaExist,
    doesYoutubeMediaExist: doesYoutubeMediaExist,
    getIncompleteTasks: getIncompleteTasks,
    getMediaIdsByCourseOfferingId: getMediaIdsByCourseOfferingId
}
