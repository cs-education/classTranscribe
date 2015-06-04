var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var RegistrationForm = require('./RegistrationForm.react.js');
var InstructorDashboard = require('./InstructorDashboard.react.js');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Class Transcribe</h1>
                <ul>
                    <li><Link to="dashboard">Instructor Dashboard</Link></li>
                </ul>
                <RouteHandler/>
            </div>
        )
    }
});

var routes = (
    <Route handler={App}>
        <Route name="dashboard" path="instructorDashboard" handler={InstructorDashboard}/>
        <Route name="registrationWithID" path=":className/registration/:studentID" handler={RegistrationForm}/>
    </Route>
);

module.exports = App;

if(typeof document !== 'undefined') {
    Router.run(routes, function (Root) {
        React.render(
            <Root />,
            document.getElementsByClassName('container')[0]
        );
    });
}

//Router.run(routes, req.path, function (Root, state) {
//    var html = React.renderToString(<Root data={data} />);
//    res.send(html);
//});