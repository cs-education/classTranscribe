/*
 * npm documentation of acl:
 *     https://www.npmjs.com/package/acl
 */

const roles = ['Admin', 'Student', 'Assistance', 'Instructor'];
const macl = require('acl');
const aclSeq = require('acl-sequelize');
const db = require('../models/index');
const acl = new macl(new aclSeq(db.sequelize, { prefix : 'acl_'}));

function addRole(userID, role) {
  if (roles.indexOf(role) > -1) {
    acl.addUserRoles(userID, role);
  }
}

async function getRoles(userID, cb) {
  return acl.userRoles(userID, cb);
}

function removeRole(userID, role) {
  if (roles.indexOf(role) > -1) {
    acl.removeUserRoles(userID, role);
  }
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
  addRole : addRole,
  getRoles : getRoles,
  removeRole : removeRole,
  addCoursePermission : addCoursePermission,
  checkCoursePermission : checkCoursePermission,
  removeCoursePermission : removeCoursePermission
};
