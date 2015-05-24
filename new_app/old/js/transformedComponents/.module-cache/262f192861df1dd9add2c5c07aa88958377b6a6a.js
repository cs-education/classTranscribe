/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */



var RegistrationForm = React.createClass({displayName: "RegistrationForm",
    getInitialState: function() {
        return {email: this.props.studentID + "@illinois.edu", firstName: '', lastName: '', password: '', confirmedPassword: ''};
    },
    handleEmailChange: function(event) {
        this.setState({email: event.target.value});
    },
    handleFirstNameChange: function(event) {
        this.setState({firstName: event.target.value});
    },
    handleLastNameChange: function(event) {
        this.setState({lastName: event.target.value});
    },
    handlePasswordChange: function(event) {
        this.setState({password: event.target.value});
    },
    handleConfirmedPasswordChange: function(event) {
        this.setState({confirmedPassword: event.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        alert('hi');

        if (this.state.firstName === '' || this.state.lastName === '' || this.state.password !== this.state.confirmedPassword) {
            //TODO: visual validation
            return;
        }
        $.ajax({
            method: "PUT",
            url: "/api/registerStudent",
            data: { firstName   : this.state.firstName,
                    lastName    : this.state.lastName,
                    email       : this.state.email,
                    password    : this.state.password,
                    studentID   : this.props.studentID,
                    className   : this.props.className }
        }).done(function(data) {

        });
    },
    render: function () {
        return (
            React.createElement("form", {className: "u-cf"}, 
                React.createElement("h2", null, "Register for ", this.props.className), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "four columns"}, 
                        React.createElement("label", {htmlFor: "emailInput"}, "Your email"), 
                        React.createElement("input", {className: "u-full-width", type: "email", id: "emailInput", value: this.state.email, onChange: this.handleEmailChange})
                    ), 
                    React.createElement("div", {className: "four columns"}, 
                        React.createElement("label", {htmlFor: "firstNameInput"}, "First Name"), 
                        React.createElement("input", {className: "u-full-width", type: "text", id: "firstNameInput", value: this.state.firstName, onChange: this.handleFirstNameChange})
                    ), 
                    React.createElement("div", {className: "four columns"}, 
                        React.createElement("label", {htmlFor: "lastNameInput"}, "Last Name"), 
                        React.createElement("input", {className: "u-full-width", type: "text", id: "lastNameInput", value: this.state.lastName, onChange: this.handleLastNameChange})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "six columns"}, 
                        React.createElement("label", {htmlFor: "passwordInput"}, "Password"), 
                        React.createElement("input", {className: "u-full-width", type: "password", id: "passwordInput", value: this.state.password, onChange: this.handlePasswordChange})
                    ), 
                    React.createElement("div", {className: "six columns"}, 
                        React.createElement("label", {htmlFor: "confirmPasswordInput"}, "Password"), 
                        React.createElement("input", {className: "u-full-width", type: "password", id: "confirmPasswordInput", value: this.state.confirmedPassword, onChange: this.handleConfirmedPasswordChange})
                    )
                ), 
                React.createElement("button", {className: "registrationSubmit button-primary", type: "submit", value: "Submit", onClick: this.handleSubmit})
            )
        )
    }
});

//assumes url is of form /:className/register/:studentID
var url = window.location.pathname.split("/");
//0 is blank
var className = url[1];
var studentID = url[3];

React.render(
    React.createElement(RegistrationForm, {studentID: studentID, className: className}),
    document.getElementById('main')
)