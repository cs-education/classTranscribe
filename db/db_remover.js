'use strict';
var Sequelize = require('sequelize');
var models = require('../models');
const utils = require('../utils/logging');
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
    }).catch(err => {
      throw new Error('removeStudent() Failed when destroy' + err.message);
    }); /* UserOffering.destroy() */
  }).catch(err => {
    throw new Error('removeStudent() Failed when findOne' + err.message);
  }); /* Role.findOne() */
}

module.exports = {
  removeStudent : removeStudent
}
