/**
 * Created by omelvin on 5/21/15.
 * @jsx React.DOM
 */

var RegistrationForm = React.createClass({displayName: "RegistrationForm",
    render: function () {
        return (
            React.createElement("form", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "six columns"}, 
                        React.createElement("label", {htmlFor: "emailInput"}, "Your email"), 
                        React.createElement("input", {className: "u-full-width", type: "email", placeholder: "test@illinois.edu", id: "emailInput"})
                    ), 
                    React.createElement("div", {className: "six columns"}, 
                        React.createElement("label", {htmlFor: "classInput"}, "Class"), 
                        React.createElement("input", {className: "u-full-width", type: "text", id: "classInput"})
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