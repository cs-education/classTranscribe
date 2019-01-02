'use strict';
var Sequelize = require('sequelize');
var models = require('../models');
const utils = require('../utils/logging');
const uuid = require('uuid/v4');
const sequelize = models.sequelize;

// sequelize.sync();

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
/* ----- end of defining ----- */

/* UPDATE User SET verifiedId = verifiedId WHERE mailId = email */
function verifyUser(verifiedId, email) {
  return User.update( {
    verified : true,
  }, {
    where : {
      mailId : email,
      verifiedId : verifiedId,
    }
  }).catch(err => {
    throw new Error('verifyUser() Failed' + err.message);
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
  }).catch(err => {
    throw new Error('setUserName() Failed' + err.message);
  })
}

function setUserPassword(newPassword, email) {
  return User.update({
    password : newPassword,
    passwordToken : '',
  }, {
    where : {
      mailId : email,
    }
  }).catch(err => {
    throw new Error('setUserPassword() Failed' + err.message);
  });
}

function validateUserAccess( courseOfferingId, userId ) {
  return UserOffering.findOne({
    where : {
      courseOfferingId : courseOfferingId,
      userId : userId,
    }
  }).then(result => {
    return result.dataValues;
  }).catch(err => {
    throw new Error('validateUserAccess() Failed' + err.message);
  })
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
    }).catch(err => {
      throw new Error('setUserRole() Failed When update' + err.message);
    }); /* User.update() */
  }).catch(err => {
    throw new Error('setUserRole() Failed when findOrCreate Role' + err.message);
  }); /* Role.findOrCreate() */
}

function setPasswordToken(userInfo, token) {
  return User.update({
    passwordToken : token,
  }, {
    where : {
      id : userInfo.id,
      mailId : userInfo.mailId,
    }
  }).catch(err => {
    throw new Error('setPasswordToken() Failed' + err.message);
  });
}

module.exports = {
  verifyUser : verifyUser,
  setUserName : setUserName,
  setUserPassword : setUserPassword,
  validateUserAccess : validateUserAccess,
  setUserRole : setUserRole,
  setPasswordToken : setPasswordToken
}
