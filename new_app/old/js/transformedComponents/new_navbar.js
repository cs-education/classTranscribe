/**
 * Created by omelvin on 5/21/15.
 */

//TODO: instructor dashboard should be hidden from students. for some reason jsx isn't recognizing my comment when put end of line
var NavBar = React.createClass({displayName: "NavBar",
    render: function() {
        return (
            React.createElement("div", {className: "navbar"}, 
                React.createElement("h1", {className: "u-pull-left"}, "Class Transcribe"), 
                React.createElement("nav", {className: "u-pull-left"}, 
                    React.createElement("a", {className: "button", href: "/instructorDashboard.html"}, "Instructor Dashboard")
                )
            )
        )
    }
});

React.render(
    React.createElement(NavBar, null),
    document.getElementById('navbar-container')
)