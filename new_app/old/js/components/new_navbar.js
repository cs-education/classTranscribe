/**
 * Created by omelvin on 5/21/15.
 */

//TODO: instructor dashboard should be hidden from students. for some reason jsx isn't recognizing my comment when put end of line
var NavBar = React.createClass({
    render: function() {
        return (
            <div className="navbar">
                <h1 className="u-pull-left">Class Transcribe</h1>
                <nav className="u-pull-left">
                    <a className="button" href="/instructorDashboard.html">Instructor Dashboard</a>
                </nav>
            </div>
        )
    }
});

React.render(
    <NavBar />,
    document.getElementById('navbar-container')
)