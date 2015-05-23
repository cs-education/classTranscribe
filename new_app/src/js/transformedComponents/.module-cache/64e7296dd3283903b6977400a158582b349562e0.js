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

React.render(
    React.createElement(InstructorDashboard, null),
    document.getElementById('main')
);