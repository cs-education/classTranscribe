/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */

var React = require('react');

var InstructorDashboard = React.createClass({displayName: "InstructorDashboard",
    render: function() {
        return (
            React.createElement("div", {className: "InstructorDashboard"}, 
                React.createElement("p", null, " hi ")
            )
        );
    }
});

module.exports = InstructorDashboard;