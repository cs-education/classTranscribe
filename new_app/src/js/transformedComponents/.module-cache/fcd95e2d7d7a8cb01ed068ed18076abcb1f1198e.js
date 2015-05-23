/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */

var RegistrationForm = React.createClass({displayName: "RegistrationForm",
    getInitialState: function() {
        return {value: ''};
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
    },
    render: function () {
        return (
            React.createElement("form", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "six columns"}, 
                        React.createElement("label", {htmlFor: "emailInput"}, "Your email"), 
                        React.createElement("input", {className: "u-full-width", type: "email", defaultValue: this.props.studentID + "@illinois.edu", id: "emailInput"})
                    ), 
                    React.createElement("div", {className: "six columns"}, 
                        React.createElement("label", {htmlFor: "classInput"}, "Class"), 
                        React.createElement("input", {className: "u-full-width", type: "text", defaultValue: this.className, id: "classInput"})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "six columns"}, 
                        React.createElement("label", {htmlFor: "firstNameInput"}, "First Name"), 
                        React.createElement("input", {className: "u-full-width", type: "text", id: "firstNameInput"})
                    ), 
                    React.createElement("div", {className: "six columns"}, 
                        React.createElement("label", {htmlFor: "lastNameInput"}, "Last Name"), 
                        React.createElement("input", {className: "u-full-width", type: "text", id: "lastNameInput"})
                    )
                ), 
                React.createElement("input", {className: "button-primary", type: "submit", value: "Submit"})
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