/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */

React.render(
    React.createElement(InstructorDashboard, null),
    document.getElementById('main')
);

var InstructorDashboard = React.createClass({displayName: "InstructorDashboard",
    render: function() {
        return (
            React.createElement("div", {className: "InstructorDashboard"}, 
                React.createElement("p", null, " hi ")
            )
        );
    }
});