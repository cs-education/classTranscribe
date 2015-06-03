var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var ClassHome = require('./../components/ClassHome.react.js');
var RegistrationForm = require('./../components/RegistrationForm.react.js');
var InstructorDashboard = require('./../components/InstructorDashboard.react.js');

//var routes = require('../routes');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Class Transcribe</h1>
                <RouteHandler/>
            </div>
        )
    }
});

var routes = (
    <Route handler={App}>
        <Route path="instructorDashboard" handler={InstructorDashboard}/>
        <Route path="registration/:studentID" handler={RegistrationForm}/>
    </Route>
);

Router.run(routes, function (Root) {
    React.render(
        <Root/>,
        document.getElementById('container')
    );
});