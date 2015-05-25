var React = require('react');

var RegistrationForm = require('./components/registrationForm');
var InstructorDashboard = require('./components/instructorDashboard');

React.render(
    <InstructorDashboard />,
    document.getElementById('app-container')
);