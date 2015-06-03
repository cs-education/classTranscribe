var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="classHome">
                <h2>{this.props.params.className}</h2>
            </div>
        )
    }
});