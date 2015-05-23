/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */

var RegistrationForm = React.createClass({displayName: "RegistrationForm",
    getInitialState: function() {
        return {email: this.props.studentID + "@illinois.edu", firstName: '', lastName: ''};
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
    handleSubmit: function(e) {
        e.preventDefault();

        if (this.state.firstName === '' || this.state.lastName === '') {
            return;
        }
        this.props.onCommentSubmit({parentID: parentID, commentText: text, video: videoName});
        this.setState({value: ''});
        return;
    },
    render: function () {
        return (
            React.createElement("form", null, 
                React.createElement("h2", null, "Register for ", this.props.className), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "four columns"}, 
                        React.createElement("label", {htmlFor: "emailInput"}, "Your email"), 
                        React.createElement("input", {className: "u-full-width", type: "email", value: this.state.email, id: "emailInput", onChange: this.handleEmailChange})
                    ), 
                    React.createElement("div", {className: "four columns"}, 
                        React.createElement("label", {htmlFor: "firstNameInput"}, "First Name"), 
                        React.createElement("input", {className: "u-full-width", type: "text", id: "firstNameInput", onChange: this.handleFirstNameChange})
                    ), 
                    React.createElement("div", {className: "four columns"}, 
                        React.createElement("label", {htmlFor: "lastNameInput"}, "Last Name"), 
                        React.createElement("input", {className: "u-full-width", type: "text", id: "lastNameInput", onChange: this.handleLastNameChange})
                    )
                ), 
                React.createElement("input", {className: "button-primary", type: "submit", value: "Submit", onSubmit: this.handleSubmit})
            )
        )
    }
});

//assumes url is of form /:className/register/:studentID
var url = window.location.pathname.split("/");
var className = url[1];
var studentID = url[3];

React.render(
    React.createElement(RegistrationForm, {studentID: studentID, className: className}),
    document.getElementById('main')
)