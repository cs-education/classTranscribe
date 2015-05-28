/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */
var React = require('react');
var AppActions = require('../actions/AppActions.js');

var InstructorDashboardStore = require('../stores/InstructorDashboardStore');

var WebAPIUtils = require('../utils/WebAPIUtils');

var url = window.location.pathname.split("/");
var currentClass = url[1];
WebAPIUtils.getAllStudents(currentClass);

function getStateFromStores() {
    var studentTemp = InstructorDashboardStore.getAllStudents();
    console.log(studentTemp);
    return {
        students: studentTemp
    };
}

var staticClassList = [{name: 'cs225', classID: 1, instructor: 'Chase Giegle'}, {name: 'cs241', classID: 2, instructor: 'Lawrence Angrave'}];

var InstructorDashboard = React.createClass({
    render: function() {
        return (
            <div className="instructorDashboard">
                {/*<ClassList data={staticClassList}></ClassList>*/}
                <h2>{currentClass}</h2>
                <StudentList></StudentList>
            </div>
        );
    }
});

var ClassList = React.createClass({
    render: function() {
        var classNodes = this.props.data.map(function (aClass) {
            return (
                <li key={aClass.classID}>
                    {aClass.name} - {aClass.instructor}
                </li>
            );
        });
        return (
            <ul className="classList">
                {classNodes}
            </ul>
        )
    }
});

//I'm not sure if the student data should be passed down from InstructorDashboard or retrieved from the store here
var StudentList = React.createClass({
    getInitialState: function() {
        return getStateFromStores();
    },
    componentDidMount: function() {
        InstructorDashboardStore.addChangeListener(this._onChange);
    },
    render: function() {
        var studentNodes;
        if(this.state.students[0] !== undefined) {
            studentNodes = this.state.students.map(function (student) {
                return (
                    <li key={student.studentID}>
                        {student.firstName} {student.lastName} - {student.studentID}
                    </li>
                );
            });
        } else {
            studentNodes = "loading";
        }
        return (
            <ul className="studentList">
                {studentNodes}
            </ul>
        )
    },
    _onChange: function() {
        console.log('_onChange');
        this.setState(getStateFromStores());
    }
});

module.exports = InstructorDashboard;

//React.render(
//    <InstructorDashboard />,
//    document.getElementById('main')
//);