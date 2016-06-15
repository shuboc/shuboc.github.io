### One way data flow

用母元件的state當作子元件的props, i.e., 

~~~html
<Component data={this.state.data} />
~~~

### How to load state?

1. getInitialState

2. componentDidMount裡面可以用Ajax, init polling or websocket etc. 

(什麼是websocket, 怎麼用, 何時使用?)

### Controlled Components

input, textarea, checkbox, radio, option

目的：Keep DOM and state in sync

~~~html
<input 
  value={this.state.text} 
  onChange={this.handleTextChange}
/>
~~~

當使用者輸入的時候，onChange被呼叫更新state，根據state值重新render欄位值:

~~~js
handleTextChange: function(event) {
  this.setState({text: event.target.value});
}
~~~

### Callbacks as props

子元件做完動作（例如：送出表單）之後，需要將新增的comment，更新到母元件的state。

在React的世界裡，state由最上層的母元件管理。所以合理的做法是：子元件接受一個callback函式作為props，母元件在callback裡實作更新state，並且把callback傳給子元素的props:

~~~html
<CommentForm onCommentSubmit={this.handleCommentSubmit} />
~~~

送出表單時，子元件執行作為props傳進來的callback。傳入新增的comment當作callback的第一個參數，將資料傳給母元件：

~~~js
var CommentForm = React.createClass({
  ...
  handleSubmit: function() {
    ...
    this.props.onComentSubmit(comment);
  }
});
~~~

母元件實作更新state：

~~~js
var CommentBox = React.createClass({
	...
	handleCommentSubmit: function(comment) {
	  // Submit Ajax request
	  $.ajax(...);
	  
	  // Append comment and update state
	  var comments = this.state.data;
	  comment.id = Date.now();
	  comments = comments.concat([comment]);
	  this.setState(comments);
	}
});
~~~

