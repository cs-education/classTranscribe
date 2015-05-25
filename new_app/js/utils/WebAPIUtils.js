/**
 * Created by omelvin on 5/22/15.
 */

var AppActions = require('../actions/AppActions');
var $ = require('jquery');

module.exports = {
    getAllStudents: function(className) {
        $.getJSON('/api/getStudents/' + className, function(data) {
            AppActions.receiveAllStudents(data);
        })
    },

    registerStudent: function(payload) {
        $
    }
};