/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */

var AppActions = require('../actions/AppActions.js');

var InstructorDashboardStore = require('../stores/InstructorDashboardStore');

var WebAPIUtils = require('../utils/WebAPIUtils');

var staticClassList = [{name: 'cs225', classID: 1, instructor: 'Chase Giegle'}, {name: 'cs241', classID: 2, instructor: 'Lawrence Angrave'}];
var staticStudentList = [{name: 'Oliver', netID: 'omelvin2'}, {name: 'Bob', netID: 'jren'}];
var InstructorDashboard = React.createClass({displayName: "InstructorDashboard",
    getInitialState: function() {
      return({studentList: []});
    },
    componentDidMount: function() {
        InstructorDashboardStore.addChangeListener(this._onChange);
        var url = window.location.pathname.split("/");
        WebAPIUtils.getAllStudents(url[2]);
    },
    render: function() {
        return (
            React.createElement("div", {className: "instructorDashboard"}, 
                React.createElement(ClassList, {data: staticClassList}), 
                React.createElement("h2", null, "cs241"), 
                React.createElement(StudentList, {data: staticStudentList})
            )
        );
    }
});

var ClassList = React.createClass({displayName: "ClassList",
    render: function() {
        var classNodes = this.props.data.map(function (aClass) {
            return (
                React.createElement("li", {key: aClass.classID}, 
                    aClass.name, " - ", aClass.instructor
                )
            );
        });
        return (
            React.createElement("ul", {className: "classList"}, 
                classNodes
            )
        )
    }
});

var StudentList = React.createClass({displayName: "StudentList",
    render: function() {
        var studentNodes = this.props.data.map(function (student) {
            return (
                React.createElement("li", {key: student.netID}, 
                    student.name, " - ", student.netID
                )
            );
        });
        return (
            React.createElement("ul", {className: "studentList"}, 
                studentNodes
            )
        )
    }
})

React.render(
    React.createElement(InstructorDashboard, null),
    document.getElementById('main')
);