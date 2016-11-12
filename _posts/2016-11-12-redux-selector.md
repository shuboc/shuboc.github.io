---
layout: post
title: "Redux Selector"
---

在`mapStateToProps()`裡面，通常會將state經過一番計算後轉換成props，例如：經過filter過濾後的todos。我們通常會寫一個`getVisibleTodos(todos, filter)`作轉換的工作：

~~~jsx
const mapStateToProps = (state, { params }) => ({
  todos: getVisibleTodos(state.todos, params.filter || 'all'
})
~~~

問題是，使用者必須要記得state的結構，像是記得傳入`state.todos`而不是`state`，而且萬一結構改了就要到處更新，很不方便。

我們可以改成把邏輯放在`todos`的reducer裡面：

~~~jsx
export const getVisibleTodos = (state, filter) => {
  switch (filter) {
    case 'all':
      return state;
    case 'completed':
      return state.filter(t => t.completed);
    case 'active':
      return state.filter(t => !t.completed);
    default:
      throw new Error(`Unknown filter: ${filter}.`);
  }
};
~~~

這函式稱之為**selector**，因為他從state裡面"select"東西出來。

在root reducer裡面，再把剛寫好的selector包一層：

~~~jsx
import todos, * as fromTodos from './todos'

const todoApp = combineReducers({
  todos
})

export const getVisibleTodos = (state, filter) =>
  fromTodos.getVisibleTodos(state.todos, filter)
~~~

使用時只要傳入state，不需知道state的內部結構。

~~~jsx
const mapStateToProps = (state, { params }) => ({
  todos: getVisibleTodos(state, params.filter || 'all'),
});
~~~