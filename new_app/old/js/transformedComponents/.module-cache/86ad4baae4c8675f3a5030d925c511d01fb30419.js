/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */

var InstructorDashboard = React.createClass({displayName: "InstructorDashboard",
    render: function() {
        return (
            React.createElement("div", {className: "instructorDashboard"}, 
                React.createElement("p", null, "hi")
            )
        );
    }
});

var staticClassList = [{name: 'cs225', classID: 1, instructor: 'Chase Giegle'}, {name: 'cs241', classID: 2, instructor: 'Lawrence Angrave'}];
var ClassList = React.createClass({displayName: "ClassList",
    render: function() {
        var classNodes = staticClassList.map(function (aClass) {
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

React.render(
    React.createElement(InstructorDashboard, null),
    document.getElementById('main')
);