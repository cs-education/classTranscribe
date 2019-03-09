/*
 * npm documentation of acl:
 *     https://www.npmjs.com/package/acl
 */



// const client = require('./../../modules/redis');
const macl = require('acl');
const aclSeq = require('acl-sequelize');
const db = require('../models/index');
const acl = new macl(new aclSeq(db.sequelize, { prefix : 'acl_'}));

// acl = new macl(new macl.redisBackend(client, "ClassTranscribe::acl::"));
// var client_api = require('../../db/db');

function addUser(userID) {
  acl.addUserRoles(userID, userID);
}

function addCoursePermission(userID, classID, permission) {
  acl.allow(userID, classID, permission);
}

function checkCoursePermission(userID, classID, permission, callback) {
  acl.isAllowed(userID, classID, permission, callback);
}

function removeCoursePermission(userID, classID, permission) {
  acl.removeAllow(userID, classID, permission);
}

module.exports = {
  addUser : addUser,
  addCoursePermission : addCoursePermission,
  checkCoursePermission : checkCoursePermission,
  removeCoursePermission : removeCoursePermission
};
