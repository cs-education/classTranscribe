/*
 * npm documentation of acl:
 *     https://www.npmjs.com/package/acl
 */


 
// client = require('./../../modules/redis');
// macl = require('acl');
// acl = new macl(new macl.redisBackend(client, "ClassTranscribe::acl::"));
var client_api = require('../../db/db');

function addUser(userID) {
  acl.addUserRoles(userID, userID);
}

function addCoursePermission(userID, classID, permission) {
  acl.allow(userID, "ClassTranscribe::Course::"+classID, permission);
}

function checkCoursePermission(userID, classID, permission, callback) {
  acl.isAllowed(userID, classID, permission, callback());
}

function removeCoursePermission(userID, classID, permission) {
  acl.removeAllow(userID, "ClassTranscribe::Course::"+classID, permission);
}

module.exports = {
  addUser : addUser,
  addCoursePermission : addCoursePermission,
  checkCoursePermission : checkCoursePermission,
  removeCoursePermission : removeCoursePermission
};
