var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var ClassHome = require('./../components/ClassHome.react.js');
var RegistrationForm = require('./../components/RegistrationForm.react.js');
var InstructorDashboard = require('./../components/InstructorDashboard.react.js');

module.exports = (
    <Route path=":className" handler={ClassHome}>
        <Route path="instructorDashboard" handler={InstructorDashboard}/>
        <Route path="registration/:studentID" handler={RegistrationForm}>
        </Route>
    </Route>
);