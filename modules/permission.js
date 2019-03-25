'use strict';
var models = require('../models');
const uuid = require('uuid/v4');

const CourseOffering = models.CourseOffering;
const Offering = models.Offering;
const Role = models.Role;
const User = models.User;
const UserOffering = models.UserOffering;

async function updateCoursePermission(userId, courseOfferingId, roleName) {
  try {
      var role = await Role.findOrCreate({
        where: { roleName: roleName },
        defaults: { id: uuid() }
      });
      
      var roleInfo = role[0].dataValues;
      var userOfferingResult = await UserOffering.findOrCreate({
        where: { userId: userId, courseOfferingId: courseOfferingId },
        defaults: { roleId: roleInfo.id }});
      
      if (userOfferingResult[1] === true) { 
        return true; 
      } else {
        
        var updateResult = await UserOffering.update(
          { roleId: roleInfo.id },
          {
            where: {
              userId: userId,
              courseOfferingId: courseOfferingId
            }
          });

        return null !== updateResult;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
}

async function addCoursePermission(userId, courseOfferingId, permission) {
  switch (permission) {
    case 'View': return await updateCoursePermission(userId, courseOfferingId, 'Student');
    case 'Edit': return await updateCoursePermission(userId, courseOfferingId, 'Instructor');
    case 'Delete': return await updateCoursePermission(userId, courseOfferingId, 'Administrator');
    default: return false; 
  }
}

async function removeCoursePermission(userId, courseOfferingId) {
  switch (permission) {
    case 'Delete': return await updateCoursePermission(userId, courseOfferingId, 'Instructor');
    case 'Edit': return await updateCoursePermission(userId, courseOfferingId, 'Student');
    case 'View': return await UserOffering.destroy( {where : {userId : userId, courseOfferingId : courseOfferingId}});
    default: return false;
  }
}

async function isWatchingUniversityAllowed(userData, courseData) {
  if (userData === null || courseData === null) { return false; }

  var courseUniversity = await Offering.findOne({where : {id : courseData.offeringId}});

  if (courseUniversity === null) return false;

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
  try {
    var courseInfo = await CourseOffering.findOne({ where : {id : courseOfferingId}});
    var userInfo = await User.findOne({ where : {id : userId}});

    var courseData = courseInfo === null ? null : courseInfo.dataValues;
    var userData = userInfo === null ? null : userInfo.dataValues;
    
    switch (courseData.role) {
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
  } catch(err) {
    console.log(err);
    return false;
  }
}

async function isManagingAllowed(userId, courseOfferingId) {
  try {

    var courseInfo = await UserOffering.findOne({ 
      where: { 
        userId: userId, 
        courseOfferingId: courseOfferingId
      }});
      
      var roleInfo = await Role.findOrCreate({ where : {roleName : 'Student'}, defaults: {id : uuid()}});
      
      var courseData = courseInfo === null ? null : courseInfo.dataValues;
      var roleData = roleInfo === null ? null : roleInfo[0].dataValues;
      
      if (courseData === null) { return false; }
      
      return courseData.roleId !== roleData.id;
    }
  catch(err) {
    console.log(err);
    return false;
  }
}

async function allWatchableCourses(userId) {
  var publicCoursesInfo = await CourseOffering.findAll({where : {role : 0}});
  var privateCoursesInfo = await UserOffering.findAll({where : {userId : userId}});
  var userInfo = await User.findOne({where : {id : userId}});
  var signInCoursesInfo = await CourseOffering.findAll( { where : {role : 2}});
  var univeristyCoursesInfo = await CourseOffering.findAll({ where : {role : 3}});

  // Add Public
  var courses = publicCoursesInfo === null ? [] : publicCoursesInfo.map(course => course.dataValues.id);

  // Add Private
  courses.concat(privateCoursesInfo === null ? [] : privateCoursesInfo.map(course => course.dataValues.courseOfferingId ));

  if (userInfo === null) { return courses; }

  // Add Sign In
  courses.concat(signInCoursesInfo === null ? [] : signInCoursesInfo.map(course => course.dataValues.id));

  if (univeristyCoursesInfo === null) { return courses; } 

  var univeristyCoursesData = univeristyCoursesInfo.map(course => course.dataValues);

  var coursesInfo = await Offering.findAll({ where: { universityId: userInfo.univeristyId } });

  if (coursesInfo === null) { return courses; }

  coursesData = coursesInfo.map(course => course.dataValues.offeringId);

  // Add University
  courses.concat(univeristyCoursesData.filter(course => coursesData.indexOf(course.offeringId) > 0));

  return courses;
}

async function allManageableCourses(userId) {
  var userCoursesInfo = await UserOffering.findAll({ where : {userId : userId}});

  if (userCoursesInfo === null) { return []; }
  
  var roleInfo = await Role.findOne({ where : {roleName : 'Student'}});
  var roleData = roleInfo.dataValues;

  var userCoursesData = userCoursesInfo.map(data => data.dataValues);
  var managableCourses = userCoursesData.filter(course => course.roleId !== roleData.id);

  return managableCourses.map(course => course.id);
}

module.exports = {
  addCoursePermission : addCoursePermission,
  removeCoursePermission : removeCoursePermission,
  isWatchingAllowed : isWatchingAllowed,
  isManagingAllowed : isManagingAllowed,
  allWatchableCourses : allWatchableCourses,
  allManageableCourses : allManageableCourses
};
