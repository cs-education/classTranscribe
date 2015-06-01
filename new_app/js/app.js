var React = require('react');

var RegistrationForm = require('./components/RegistrationForm.react');
var InstructorDashboard = require('./components/InstructorDashboard.react');

var url = window.location.pathname.split("/");
if(url[2] === 'register') {
    var className = url[1];
    var studentID = url[3];
    React.render(
        <RegistrationForm studentID={studentID} className={className} />,
        document.getElementById('app-container')
    )
} else if(url[2] === 'instructorDashboard') {
    React.render(
        <InstructorDashboard />,
        document.getElementById('app-container')
    );
}