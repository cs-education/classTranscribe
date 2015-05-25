var React = require('react');

var RegistrationForm = require('./components/registrationForm');
var InstructorDashboard = require('./components/instructorDashboard');

var url = window.location.pathname.split("/");
if(url[2] === 'register') {
    var className = url[1];
    var studentID = url[3];
    React.render(
        <RegistrationForm studentID={studentID} className={className} />,
        document.getElementById('app-container')
    )
} else if(url[1] === 'instructorDashboard') {
    React.render(
        <InstructorDashboard />,
        document.getElementById('app-container')
    );
}


//var ClassTranscribeHome = React.createClass({
//    render: function() {
//        return (
//            <div className="classTranscribeHome">
//
//            </div>
//        );
//    }
//});

//React.render(
//    <ClassTranscribeHome />,
//    document.getElementById('app-container')
//);