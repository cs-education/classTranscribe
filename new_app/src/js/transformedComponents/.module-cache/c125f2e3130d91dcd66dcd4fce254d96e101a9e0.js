/**
 * Created by omelvin on 5/21/15.
 */

var NavBar = React.createClass({displayName: "NavBar",
    render: function() {
        return (
            React.createElement("div", {className: "navBar"}, 
                React.createElement("nav", null, 
                    React.createElement("a", {href: "/instructorDashboard.html"}, "Instructor Dashboard"), " //should be hidden for students"
                )
            )
        )
    }
});

React.render(
    React.createElement(NavBar, null),
    document.getElementById('navBar')
)