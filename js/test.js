// var React = require('react');
// var ReactDOM = require('react-dom');

// var testButton = (
//   <Button bsStyle="primary" bsSize="large">Large button</Button>
// );

document.addEventListener("DOMContentLoaded", function (event) {
  var TestButton = React.createClass({
    displayName: "TestButton",

    render: function () {
      return React.createElement(
        "div",
        null,
        "Hello world!"
      );
    }
  });

  ReactDOM.render(React.createElement(TestButton, null), document.getElementsByClassName('react-test-container')[0]);
});