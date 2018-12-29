---
layout: post
title: "Redux筆記：如何和React Router搭配使用"
tags: [redux, react router]
redirect_from: /2016/10/16/filtering-redux-state-with-react-router-params
---

React Router是一個管理URL的庫，能根據瀏覽器的URL決定要渲染哪些元件。

React Router有兩種基本的用法，一種是透過`<Route path="XXX" />`元件定義routing，比對符合的元件就會被渲染。

今天要講的另一種方法是把URL params讀出來，透過React props的方法傳進元件。

比方說，我們有個Todo List，希望可以過濾全部，未完成，已完成事項等。目標是URL為`/`，`/active`，`/completed`的時候分別對應三種不同的filter。我們要做的事是：把filter的值從URL比對出來，傳給底下的元件，顯示根據條件過後的todo list。

我們可以這樣做：

## 透過React Router讀出URL參數

我們可以在`Route`component裡面定義`path="/(:filter)"`，表示將match URL中斜線後面的結果作為`filter`。

~~~jsx
const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/(:filter)" component={App} />
    </Router>
  </Provider>
)
~~~

比對URL params的結果，可以在被渲染元件的`props.params`讀到。

把`filter`讀出來以後傳給`VisibleTodoList`元件：

~~~jsx
const App = ({ params }) => (
	...
	<VisibleTodoList filter={params.filter} />
)
~~~

`VisibleTodoList`只是個container component，作用是利用`react-redux`的`connect()`API把state從redux中讀出來，傳給真正有顯示樣式的presentation component `TodoList`。(presentational and container component可以參照[說明](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.s1cp7e6a7))

`connect()`的`mapStateToProps(state, ownProps)`參數是個callback函數，我們可以從`ownProps`裡讀到傳給`VisibleTodoList`的`filter`的值：


~~~jsx
const mapStateToProps = (state, ownProps) => ({
  todos: getVisibleTodos(state.todos, ownProps.filter),
});

const VisibleTodoList = connect(mapStateToProps)(TodoList)
}

~~~

這樣就讀出了URL params，然後顯示了過濾後的todo list！

## withRouter

`App`只負責讀出`filter`以後再往下傳給`VisibleTodoList`，但`App`本身用不到`filter`。如果元件很多層的情況下就得一層一層往下傳，很不方便。

因此React Router提供了`withRouter(component)`的enhancer，功用是把URL params注入到元件的`props.params`裡。URL params再也不用一層層往下傳，只要在需要用到的那一層元件，透過enhancer注入props即可。

~~~jsx
// App.js
const App = ({ params }) => (
	...
	<VisibleTodoList /> // Do not pass props down
)

// VisibleTodoList.js
import { withRouter } from 'react-router'

const VisibleTodoList = withRouter(connect(
  mapStateToProps
)(TodoList));

const mapStateToProps = (state, { params }) => ({
  todos: getVisibleTodos(state.todos, params.filter || 'all'),
});
~~~

但自己測了一下只有試出來`react-router@^3.0.0-alpha.1`是可以用的，相容性可能還有些問題？

## 總之可以讀URL params了，所以呢？

現在很多app會用Redux。他是一個容器，用來集中存放和管理app的狀態。

上述的`filter`概念上也是app狀態的一部份，放在redux store裡面統一管理很合理。但是如果同時也想要透過URL params去操作他，就會衍生問題：

到底是要從redux裡面讀出filter的值還是從URL讀？同樣的資料，有兩份就違反了**Single Source of Truth**的原則。

有兩個解決方法，一個是用react-router-redux，他會把URL存在store裡面，有變化的時候store和URL會兩邊同步。從store讀出來或是從URL讀，理論上都可以。

另外一個比較簡單的方法就是，要用URL params控制的狀態就不要存在store裡面。以前面的例子來說，只要改成store裡面不存filter，直接從URL裡面透過React Router讀出來就好了。

Redux store + URL = app的**single source of truth**!

上面的例子都可以在官方文件的[Redux: Usage with React Router](http://redux.js.org/docs/advanced/UsageWithReactRouter.html)裡找到。

## 參考資料

[Redux: Usage with React Router](http://redux.js.org/docs/advanced/UsageWithReactRouter.html)

[Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.s1cp7e6a7)

[Redux: Filtering Redux State with React Router Params](https://egghead.io/lessons/javascript-redux-filtering-redux-state-with-react-router-params) 作者本人解說
