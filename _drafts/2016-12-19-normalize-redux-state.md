---
layout: post
title: "Normalize Reudx State"
---

## Normalize the shape

假設todo list的資料格式如下：

~~~jsx
todos: [
  {
    id: 1,
    text: 'hey',
    completed: true,
  },
  {
    id: 2,
    text: 'ho',
    completed: true,
  },
  {
    id: 3,
    text: 'let’s go',
    completed: false,
  }
]
~~~

我們可以將`todos` reducer分成兩部分：

1. 以`id`為key的`todos`的集合
2. `id`的array

用`combineReducer` API寫起來就像這樣：

~~~jsx
const todos = combineReducer({
  byId,
  allIds
})
~~~

### `byId`

用來存放`todo`實體。實際上的資料結構是一個object，以`todo.id`為key，`todo`實體作為value。

在`ADD_TODO`和`TOGGLE_TODO`時要去更新`todo`實體：

~~~jsx
const byId = (state = {}, action) => {
  switch(action.type) {
  	case 'ADD_TODO':
  	case 'TOGGLE_TODO':
  	  return {
  	    ...state,
  	    [action.id]: todo(state[action.id], action) // Update the entity
  	  }
  	default:
  	  return state
  }  
}
~~~

其中`todo` reducer會在`ADD_TODO`時新增一筆對應的`todo`，而`TOGGLE_TODO`時更改對應的`todo.completed`：

~~~jsx
const todo = (state = {}, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      return {
        ...state,
        completed: !state.completed
      }
    default:
      return state
  }
}
~~~

### `allIds`

用來存放`id`的array。

當`ADD_TODO`時需要往array新增一筆`todo.id`；當`TOGGLE_TODO`時，因已透過`byId`更新對應的實體，在此處不需做處理：

~~~jsx
const allIds = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [...state, action.id]
    default:
      return state
  }
}
~~~

## Fetch data when filter changes

如果要打API拿資料，在`componentDidMount`和`componentDidUpdate`裡面做：

~~~jsx
class VisibleTodoList extends Component {
  fetchData() {
    const { filter, receiveTodos } = this.props
    fetchTodos(filter).then(todos => {
      receiveTodos(filter, todos)
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  // filter改變時重新取資料
  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      this.fetchData()
    }
  }

  render() {
    const { toggleTodo, ...rest } = this.props
    return (
      <TodoList
        {...rest}
        onTodoClick={toggleTodo}
      />
    )
  }
}
~~~

用react-redux把資料餵進Component：

~~~js
import * as actions from '../actions';

VisibleTodoList = withRouter(connect(
  mapStateToProps,
  actions
)(VisibleTodoList));
~~~

注意`mapDispatchToProps`參數可以直接傳`actions`物件，可以在`this.props`裡存取與action同名的方法。例如：直接呼叫`this.props.receiveTodos`可以dispatch `receiveTodo` action

~~~js
fetchData() {
  const { filter, receiveTodos } = this.props
  fetchTodos(filter).then(todos => {
    receiveTodos(filter, todos)
  })
}
~~~


## Update the state with the fetched data

假設現在todo list要加進filter的功能，分別有all active completed三種filter，我們可以用一個object存`todo`的實體，及三個list分別存filter過後的`id` array。

~~~jsx
const todos = combineReducers({
  byId,
  idsByFilter
})
~~~

`idsByFilter`用來存放三個filtered list：

~~~jsx
const idsByFilter = combineReducers({
  all: createList('all'),
  active: createList('active'),
  completed: createList('completed')
})
~~~

`createList`回傳list reducer（須判斷filter是否和此list reducer相同）：

~~~jsx
const createList = (filter) => {
  return (state = [], action) => {
    if (action.filter !== filter) {
      return state
    }

    switch (action.type) {
      case 'RECEIVE_TODOS':
        return action.response.map(todo => todo.id)
      default:
        return state
    }
  }
}

export default createList

export const getIds = (state) => state // Selector
~~~

`byId`用來存放`todo`實體：

~~~jsx
const byId = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_TODOS':
      const nextState = { ...state }
      action.response.forEach(todo => {
        nextState[todo.id] = todo
      })
      return nextState
    default:
      return state;
  }
};

export default byId

export const getTodo = (state, id) => state[id] // Selector
~~~

最後，export `getVisibleTodos` selector，其中會用到`getIds`把filter對應的`id` array取出，再分別對每個`id`用`getTodo` selector取出對應的`todo`實體。

~~~js
import byId, * as fromById from './byId'
import createList, * as fromList from './createList'

const todos = combineReducers({
  byId,
  idsByFilter
})

export const getVisibleTodos = (state, filter) => {
  const ids = fromList.getIds(state.idsByFilter[filter])
  return ids.map(id => fromById.getTodo(state.byId, id))
};
~~~

## Thunk

打API動作通常有很多步驟，而且經常是非同步的。例如打API時先dispatch開始的action`requestTodos`，讓狀態變成loading中，dispatch打API的action`fetchTodos`，等到API回傳結果後，再dispatch`receiveTodos`來更新結果：

~~~jsx
class VisibleTodoList extends Component {
  fetchData() {
    const { filter, receiveTodos, fetchTodos } = this.props
    requestTodos(filter)

    fetchTodos(filter).then(todos => {
      receiveTodos(filter, todos)
    })
  }
  
  ...
}
~~~

這一連串動作一定得一起使用，容易漏掉一連串動作之中的單獨一步。如果能夠將這一組動作抽象成一個單一的action，比較不容易出錯，也更容易復用。

這種抽象的方法稱為**thunk**。

thunk就是一個回傳function的function，更精確一點可以想成是一個擁有以下的形式的function：

~~~jsx
(...args) => (dispatch, getState) => { // Do something ... }
~~~

如果把一連串的動作都抽象在一個`fetchTodos`的thunk內，大致如下：

~~~jsx
export const fetchTodos = (filter) => (dispatch, getState) => {
  // 判斷是否正在打API
  if (getIsFetching(getState(), filter)) {
    return Promise.resolve()
  }

  // 改變狀態成為loading
  dispatch({
    type: 'FETCH_TODOS_REQUEST',
    filter
  })

  // 打API，根據回傳值成功或失敗分別做處理
  return api.fetchTodos(filter).then(
    response => {
      dispatch({
        type: 'FETCH_TODOS_SUCCESS',
        filter,
        response
      })
    },
    error => {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        filter,
        message: error.message || 'Something went wrong!'
      })
    }
  )
}
~~~

## Thunk Middleware

Redux只能處理plain object形式的action，所以如果要處理thunk必須要用專屬的middleware。

thunk middleware的核心很短，大概只有以下幾行：

~~~jsx
const thunk = store => next => action =>
  typeof action === 'function' ?
    action(store.dispatch, store.getState) :
    next(action)
~~~

Thunk middleware要處理的事情大致上是：如果action是一個function的話就執行，並且把`dispatch`跟`getState`作為參數餵進thunk。如此一來thunk能夠存取到`dispatch`，就能夠自行決定各種同步/非同步`dispatch`的流程，也能根據當下state做流程控制。

值得注意的是Thunk middleware中任何被`dispatch`的action可以從頭到尾跑過一次middleware chain，所以在thunk裡面再`dispatch`thunk也沒問題喔，因為會被thunk middleware處理到。（關於dispatch的更詳細的說明可以參考[Redux Middleware Chain](/2016/12/26/redux-middleware-chain.html)。）

## Normalizr

### addTodo

~~~js
// action
export const addTodo = text => dispatch => {
  api.addTodo(text).then(response =>
    dispatch({
      type: 'ADD_TODO_SUCCESS',
      response
    })
  )
}
~~~

~~~js
  // reducer for id
  const ids = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_TODOS_SUCCESS':
        return action.filter === filter ?
          action.response.map(todo => todo.id) :
          state
      case 'ADD_TODO_SUCCESS':
        return filter !== 'completed' ?
          [...state, action.response.id] :
          state
      default:
        return state
    }
  }
~~~

### response

~~~js
// Before
[
  {
    "id": "ee05070a-eda5-4fcc-a685-a5cf4be6dc60",
    "text": "hey",
    "completed": true
  },
  {
    "id": "0bce8ddb-4f8a-44cf-9050-203ecdbb0d93",
    "text": "ho",
    "completed": true
  },
  {
    "id": "91451381-2fd6-4f81-b316-cc93f927c34a",
    "text": "let’s go",
    "completed": false
  }
]

// After
{
  "entities": {
    "todos": {
      "ee05070a-eda5-4fcc-a685-a5cf4be6dc60": {
        "id": "ee05070a-eda5-4fcc-a685-a5cf4be6dc60",
        "text": "hey",
        "completed": true
      },
      "0bce8ddb-4f8a-44cf-9050-203ecdbb0d93": {
        "id": "0bce8ddb-4f8a-44cf-9050-203ecdbb0d93",
        "text": "ho",
        "completed": true
      },
      "91451381-2fd6-4f81-b316-cc93f927c34a": {
        "id": "91451381-2fd6-4f81-b316-cc93f927c34a",
        "text": "let’s go",
        "completed": false
      }
    }
  },
  "result": [
    "ee05070a-eda5-4fcc-a685-a5cf4be6dc60",
    "0bce8ddb-4f8a-44cf-9050-203ecdbb0d93",
    "91451381-2fd6-4f81-b316-cc93f927c34a"
  ]
}
~~~

~~~js
// Before
{
  "id": "d6a1c390-e729-4c7f-87b2-2f9cb728d6c2",
  "text": "test",
  "completed": false
}

// After
{
  "entities": {
    "todos": {
      "d6a1c390-e729-4c7f-87b2-2f9cb728d6c2": {
        "id": "d6a1c390-e729-4c7f-87b2-2f9cb728d6c2",
        "text": "test",
        "completed": false
      }
    }
  },
  "result": "d6a1c390-e729-4c7f-87b2-2f9cb728d6c2"
}
~~~

### define schema

~~~js
import { Schema, arrayOf } from 'normalizr'

export const todo = new Schema('todos')
export const arrayOfTodos = arrayOf(todo)
~~~

action

~~~js
export const addTodo = text => dispatch => {
  api.addTodo(text).then(response => {
    dispatch({
      type: 'ADD_TODO_SUCCESS',
      response: normalize(response, schema.todo)
    })
  })
}
~~~

normalize response

~~~js
export const fetchTodos = (filter) => (dispatch, getState) => {

  // ...

  api.fetchTodos(filter).then(
    response => {
      dispatch({
        type: 'FETCH_TODOS_SUCCESS',
        filter,
        response: normalize(response, schema.arrayOfTodos)
      })
    },
~~~

~~~js
export const addTodo = text => dispatch => {
  api.addTodo(text).then(response => {
    dispatch({
      type: 'ADD_TODO_SUCCESS',
      response: normalize(response, schema.todo)
    })
  })
}
~~~

simplify reducer

~~~js
const byId = (state = {}, action) => {
  if (action.response) {
    return {
      ...state,
      ...action.response.entities.todos
    }
  }

  return state
};
~~~

~~~js
const ids = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_TODOS_SUCCESS':
        return action.filter === filter ?
          action.response.result : // result is an array of ids
          state
      case 'ADD_TODO_SUCCESS':
        return filter !== 'completed' ?
          [...state, action.response.result] : // result is the id
          state
      default:
        return state
    }
  }
~~~
