/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */

var AppActions = require('../actions/AppActions.js');

var InstructorDashboardStore = require('../stores/InstructorDashboardStore');

var WebAPIUtils = require('../utils/WebAPIUtils');

var url = window.location.pathname.split("/");
var currentClass = url[2];
WebAPIUtils.getAllStudents(currentClass);

function getStateFromStores() {
    return {
        students: InstructorDashboardStore.getAllStudents(currentClass)
    };
}

var staticClassList = [{name: 'cs225', classID: 1, instructor: 'Chase Giegle'}, {name: 'cs241', classID: 2, instructor: 'Lawrence Angrave'}];
var staticStudentList = [{name: 'Oliver', netID: 'omelvin2'}, {name: 'Bob', netID: 'jren'}];
var InstructorDashboard = React.createClass({
    getInitialState: function() {
        return getStateFromStores();
    },
    componentDidMount: function() {
        InstructorDashboardStore.addChangeListener(this._onChange);
    },
    render: function() {
        return (
            <div className="instructorDashboard">
                <ClassList data={staticClassList}></ClassList>
                <h2>cs241</h2>
                <StudentList data={staticStudentList}></StudentList>
            </div>
        );
    },
    _onChange: function() {
        this.setState(getStateFromStores());
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

var StudentList = React.createClass({
    render: function() {
        var studentNodes = this.state.students.map(function (student) {
            return (
                <li key={student.netID}>
                    {student.name} - {student.netID}
                </li>
            );
        });
        return (
            <ul className="studentList">
                {studentNodes}
            </ul>
        )
    }
})

React.render(
    <InstructorDashboard />,
    document.getElementById('main')
);