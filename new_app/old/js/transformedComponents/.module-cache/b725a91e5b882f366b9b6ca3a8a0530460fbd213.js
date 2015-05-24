/**
 * Created by omelvin on 5/21/15.
 */

//TODO: instructor dashboard should be hidden from students. for some reason jsx isn't recognizing my comment when put end of line
var NavBar = React.createClass({displayName: "NavBar",
    render: function() {
        return (
            React.createElement("div", {className: "navBar"}, 
                React.createElement("h1", null, "Class Transcribe"), 
                React.createElement("nav", null, 
                    React.createElement("a", {href: "/instructorDashboard.html"}, "Instructor Dashboard")
                )
            )
        )
    }
});

React.render(
    React.createElement(NavBar, null),
    document.getElementById('navbar-container')
)