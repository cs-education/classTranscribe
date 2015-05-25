/**
 * Created by omelvin on 5/22/15.
 */

var AppActions = require('../actions/AppActions');
var $ = require('jquery');

module.exports = {
    getAllStudents: function(className) {
        $.getJSON('/api/' + className + '/getStudents/', function(data) {
            AppActions.receiveAllStudents(data);
        })
    },

    registerStudent: function(firstName, lastName, email, password, studentID, className) {
        $.ajax({
            method: "PUT",
            url: "/api/registerStudent",
            data: {
                firstName   : firstName,
                lastName    : lastName,
                email       : email,
                password    : password,
                studentID   : studentID,
                className   : className }
        }).done(function(data) {

        });
    }
};