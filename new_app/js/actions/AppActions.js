/**
 * Created by omelvin on 5/22/15.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var WebAPIUtils = require('../utils/WebAPIUtils');

var AppActions = {
    receiveAllStudents: function(students) {
        AppDispatcher.dispatch({
            type: AppConstants.GET_STUDENTS,
            students: students
        });
    },

    registerStudent: function(newStudent) {
        //If I understood https://youtu.be/i__969noyAM?t=917 correctly it is kosher to just send data to server
        // as in actions do not necessarily have to interact with the dispatcher
        WebAPIUtils.registerStudent(newStudent);
    }
};

module.exports = AppActions;