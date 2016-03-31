// var React = require('react');
// var ReactDOM = require('react-dom');

// var testButton = (
//   <Button bsStyle="primary" bsSize="large">Large button</Button>
// );

document.addEventListener("DOMContentLoaded", function(event) {
  var TestButton = React.createClass({
    render: function() {
      return (
        <div>Hello world!</div>
      );
    }
  });

  ReactDOM.render(<TestButton />, document.getElementsByClassName('react-test-container')[0]);
});
