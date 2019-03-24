'use strict';
var models = require('../models');
const uuid = require('uuid/v4');

const CourseOffering = models.CourseOffering;
const Offering = models.Offering;
const Role = models.Role;
const User = models.User;
const UserOffering = models.UserOffering;

async function updateCoursePermission(userId, courseOfferingId, roleName) {

  return Role.findOrCreate({
    where : {roleName : roleName},
    defaults : {id : uuid()}
  }).then(result => {

    var roleInfo = result[0].dataValues;

    return UserOffering.findOrCreate({ 
      where : {userId : userId, courseOfferingId : courseOfferingId}, 
      defaults : {id : uuid(), roleId : roleInfo.id}
    }).then((_, create) => {
      
      if (create === true) { return true; }

      return UserOffering.update(
        { roleId : roleInfo.id },
        { where : {
          userId :userId,
          courseOfferingId : courseOfferingId
        }}).then(result => result);

    }).catch(err => {
      console.log(err);
      return false;
    })
  })
}

async function addCoursePermission(userId, courseOfferingId, permission) {
  switch (permission) {
    case 'View': return updateCoursePermission(userId, courseOfferingId, 'Student');
    case 'Edit': return updateCoursePermission(userId, courseOfferingId, 'Instructor');
    case 'Delete': return updateCoursePermission(userId, courseOfferingId, 'Administrator');
    default: return false; 
  }
}

async function removeCoursePermission(userId, courseOfferingId) {
  switch (permission) {
    case 'Delete': return updateCoursePermission(userId, courseOfferingId, 'Instructor');
    case 'Edit': return updateCoursePermission(userId, courseOfferingId, 'Student');
    case 'View': return await UserOffering.destroy( {where : {userId : userId, courseOfferingId : courseOfferingId}});
    default: return false;
  }
}

async function isWatchingUniversityAllowed(userData, courseData) {
  if (userData === null || courseData === null) { return false; }

  var courseUniversity = await Offering.findOne({where : {id : courseData.OfferingId}});
  courseUniversity = courseUniversity.dataValues;

  return userData.universityId === courseUniversity.universityId;
}

async function isWatchingPrivateAllowed(userData, courseData) {
  if (userData === null || courseData === null) { return false; }

  // Since every valid role has [View] access, we only need to check if 
  // there is a corresponding information inside of table
  var userCourse = await UserOffering.findOne({ where: { userId : userData.id}});
  
  return userCourse !== null;
}

async function isWatchingAllowed(userId , courseOfferingId) {

  var findCourseInfo = CourseOffering.findOne({ where : {id : courseOfferingId}});
  var findUserInfo = User.findOne({ where : {id : userId}});

  return Promise.all([findCourseInfo, findUserInfo]).then(values => {
    var data = values.map(value => value === null ? null : value.dataValues);
    var courseData = data[0];
    var userData = data[1];

    switch(courseData.role) {
      /* Public Courses */
      case 0: return true;
      
      /* Private Courses */
      case 1: return await isWatchingPrivateAllowed(userData, courseData);
      
      /* Signed In Courses */
      case 2: return userData !== null;

      /* University Only */
      case 3: return await isWatchingUniversityAllowed(userData, courseData);

      /* Don't know what it is */
      default: return false;
    }
  })
}

async function isManagingAllowed(userId, courseOfferingId) {
  var findCourse = UserOffering.findOne({ 
    where: { 
      userId: userId, 
      courseOfferingId: courseOfferingId
    }});
  
  var findRole = Role.findOne({ where : {roleName : 'Student'}});

  return Promise.all([findCourse, findRole]).then(values => {
    var data = values.map(value => value === null ? null : value.dataValues);
    var courseInfo = data[0];
    var roleInfo = data[1];
    
    if (courseInfo === null) { return false; }

    /* Only Student has no permission of [Edit] */
    return courseInfo.roleId !== roleInfo.id;
  })
}

async function allWatchableCourses(userId) {
  var publicCourses = CourseOffering.findAll({where : {role : 0}});
  var privateCourses = UserOffering.findAll({where : {userId : userId}});
  var findUserInfo = User.findOne({where : {id : userId}});
  var signInCourses = CourseOffering.findAll( { where : {role : 2}});
  var univeristyCourses = CourseOffering.findAll({ where : {role : 3}});

  return Promise.all([publicCourses, privateCourses, findUserInfo, signInCourses, univeristyCourses]).then(values => {
    var publicCoursesData = values[0];
    var privateCoursesData = values[1];
    var userInfo = values[2];
    var signedInCoursesData = values[3];

    // Add Public
    var courses = publicCoursesData === null ? [] : publicCoursesData.map(course => course.dataValues.id);

    // Add Private
    courses.concat( privateCoursesData === null ? [] : privateCoursesData.map(course => course.dataValues.courseOfferingId) );
    
    if (userInfo === null) { return courses; }

    // Add Sign In
    courses.concat(signedInCoursesData === null ? [] : signedInCoursesData.map(course => course.dataValues.courseOfferingId));

    if (univeristyCoursesData === null) { return courses; } 

    var universityCourses = univeristyCoursesData.map(course => course.dataValues);
    
    return Offering.findAll({where : {universityId : userInfo.univeristyId }}).then(result => {
      if (result === null) { return courses; }
      
      result = result.map(course => course.dataValues.offeringId);    
      
      // Add University Only
      courses.concat( universityCourses.filter(course => result.indexOf(course.offeringId) > 0) );

      return courses;
    })
  })

}

async function allManageableCourses(userId) {
  var userCourses = UserOffering.findAll({ where : {userId : userId}});
  var roleInfo = Role.findOne({ where : {roleName : 'Student'}});

  return Promise.all([userCourses, roleInfo]).then(values => {
    var rawCourseData = values[0];
    var roleData = values[1];
    
    if (rawCourseData === null) { return []; }

    var courseData = rawCourseData.map(data => data.dataValues);
    var managableCourses = courseData.filter(course => course.roleId !== roleData.id);

    return managableCourses.map(course => course.id);
  })
}

module.exports = {
  addCoursePermission : addCoursePermission,
  checkCoursePermission : checkCoursePermission,
  removeCoursePermission : removeCoursePermission,
  isWatchingAllowed : isWatchingAllowed,
  isManagingAllowed : isManagingAllowed,
  allWatchableCourses : allWatchableCourses,
  allManageableCourses : allManageableCourses
};
