---
title: "[教學] 正規化 (Normalize) Redux State"
tags: [redux]
redirect_from: /2017/01/07/how-to-normalize-redux-state
last_modified_at: 2018/12/29
---

這篇教學介紹Redux如何用正規化(normalization)的方式，儲存從API取得的遠端資料。

## TL;DR

Redux如同前端的in-memory小型資料庫，因此存資料時，會推薦存成正規化(normalized)的形式，可以確保相同的資料只會有一份，減少資料更新時同步的錯誤。

打API時建議使用thunk的形式。

可以透過`normalizr`將API的回應轉換成normalized的形式。

## Normalize the State Shape

假設我們今天要做一個todo list的應用，API response以array的形式回傳：

~~~jsx
{
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
}
~~~

使用Redux來管理資料的情況，要如何規劃儲存的資料結構呢？

假設每筆`todo.id`都是唯一的，我們可以將`todos` reducer分成兩部分：

1. **`byId`**: 以`id`為key的`todos`的集合
2. **`allIds`**: `id`的array

用`combineReducer` API組合reducer如下：

~~~jsx
const todos = combineReducer({
  byId,
  allIds
})
~~~

### `byId` reducer

用來存放`todo`實體。實際上的資料結構是一個object，以`todo.id`為key，`todo`實體作為value。

在`ADD_TODO`和`TOGGLE_TODO`時更新`todo`實體：

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

### `allIds` reducer

用來存放`id`的array。

當`ADD_TODO`時，向array新增一筆`todo.id`：

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

## Why Normalized State?

我們也可以將API回傳的Array原封不動存進Redux state裡面，為什麼要用上面那麼麻煩的作法呢？

考慮一個情境：假設現在todo list要加進filter的功能，分別有`all`, `active`, `completed`三種filter，那我們會需要三個list存三種filter的結果，其中不同的list可能包含重複的實體（例如：`active`的結果必然出現在`all`的結果之中）。這種設計下，假設某一筆Todo實體更新的話，必然要對所有list遍歷更新對應的實體，既沒有效率又容易忘記更新。

Redux的中心思想是：**相同的資料只有一份，並且集中管理**。如果我們用normalized的形式來存這三個list，就會變成用一個mapping table存`todo`的實體，及三個list分別存filter過後的`id` array。

資料放在實體的集合中，可以確保**相同的資料只有一份**。如果實體改變了，只需要更新實體的集合一次，每個list靠著`id`就能夠對應到修改過後的實體。

### Reducer with Filter

Reducer實作如下：

~~~jsx
const todos = combineReducers({
  byId,
  idsByFilter
})
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


`idsByFilter`用來存放三個filtered list：

~~~jsx
const idsByFilter = combineReducers({
  all: createList('all'),
  active: createList('active'),
  completed: createList('completed')
})
~~~

`createList`回傳list reducer（須檢查`action.filter`）：

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

export const getIds = state => state // Selector
~~~

最後export `getVisibleTodos` selector，其中會用到`getIds`把filter對應的`id` array取出，再分別對每個`id`用`getTodo` selector取出對應的`todo`實體：

~~~jsx
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

## Fetch Data from API

如果要打API拿資料，可以寫一個`fetchData()`，在`componentDidMount()`和`componentDidUpdate()`裡面呼叫：

~~~jsx
class VisibleTodoList extends Component {
  fetchData() {
    const {
      filter,
      requestTodos,
      receiveTodos,
      fetchTodos
    } = this.props

    requestTodos(filter)
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

用`react-redux`的`connect` API把資料餵進`Component`：

~~~jsx
import * as actions from '../actions'

class VisibleTodoList extends Component {
  ...
}

VisibleTodoList = connect(
  mapStateToProps,
  actions
)(VisibleTodoList)
~~~

注意如果`mapDispatchToProps`參數傳的是`actions`物件，和action同名的方法會被注入至`this.props`，亦即呼叫`this.props.fetchTodos`可以`dispatch` `fetchTodos` action。

### Thunk

打API動作通常有很多步驟，而且經常是非同步的。例如打API時先`dispatch`開始的action`requestTodos`，讓頁面狀態變成loading，`dispatch`打API的action`fetchTodos`，等到API回傳結果後，再dispatch`receiveTodos`來更新結果：

~~~jsx
class VisibleTodoList extends Component {
  fetchData() {
    const {
      filter,
      requestTodos,
      receiveTodos,
      fetchTodos
    } = this.props

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

Thunk就是一個**回傳function的function**，在redux的使用情境下，可以更精確定義成以下形式的function：

~~~jsx
(...args) => (dispatch, getState) => { // Do something ... }
~~~

舉例來說，如果把一連串的動作都抽象在一個`fetchTodos`的thunk內，大致如下：

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

### Redux Thunk Middleware

Redux只能處理plain object形式的action，所以如果要處理thunk必須要用專屬的middleware。

thunk middleware的核心大致上可以濃縮成以下幾行：

~~~jsx
const thunk = store => next => action =>
  typeof action === 'function' ?
    action(store.dispatch, store.getState) :
    next(action)
~~~

Thunk middleware要處理的事情大致上是：如果action是一個function的話就執行，並且把`dispatch`跟`getState`作為參數餵進thunk。如此一來thunk內部能夠使用`dispatch`，能夠自行決定各種同步/非同步的流程，以及何時要`dispatch`，也能根據當下store的資料做流程控制。

值得注意的是Thunk middleware中任何被`dispatch`的action可以從頭到尾跑過一次middleware chain，所以在thunk裡面再`dispatch`thunk也沒問題喔，因為會被thunk middleware處理到。（關於`dispatch`的更詳細的說明可以參考[Redux Middleware Chain](/2016/12/26/redux-middleware-chain.html#applymiddleware-api)。）

## Using [`normalizr`](https://github.com/paularmstrong/normalizr)

我們從`fetchTodo` API得到的repsonse會是以array的形式返回：

~~~jsx
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
~~~

而`addTodo` API會回傳新增的單筆`Todo`：

~~~jsx
{
  "id": "d6a1c390-e729-4c7f-87b2-2f9cb728d6c2",
  "text": "test",
  "completed": false
}
~~~

如果我們要從array形式的response轉換成normalized的形式，可以利用[`normalizr`](https://github.com/paularmstrong/normalizr)這個library。

### Define Schema

首先我們要定義資料的schema。我們的todo回傳值可能有單筆或多筆資料，因此我們定義`const todo = Schema('todos')`以及`const arrayOfTodos = arrayOf(todo)`兩種schema。

~~~jsx
import { Schema, arrayOf } from 'normalizr'

export const todo = new Schema('todos')
export const arrayOfTodos = arrayOf(todo)
~~~

用`normalize(response, schema.todo)`轉換`addTodo` API的`response`：

~~~jsx
import {normalize} from 'normalizr'

export const addTodo = text => dispatch => {
  api.addTodo(text).then(response => {
    dispatch({
      type: 'ADD_TODO_SUCCESS',
      response: normalize(response, schema.todo)
    })
  })
}
~~~

轉換之後的結果：

~~~jsx
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

用`normalize(response, schema.arrayOfTodos)`轉換`fetchTodos` API的`response`：

~~~jsx
import {normalize} from 'normalizr'

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
    error => {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        filter,
        message: error.message || 'Something went wrong!'
      })
    }
  )
~~~

轉換之後的結果：

~~~jsx
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

可以看到轉換的結果，分成兩個部分：

1. `entities`：一個mapping table，`entities.todos`對應我們定義的`todos` schema，是todo實體的集合。
2. `result`：todo的`id`，差別在於`addTodo`回傳的是單筆`id`，而`fetchTodos`回傳的是`id` array。

### Simplify Reducer

`normalizr`處理過後的格式可以很好地對應到我們想要的normalized state。

`byId` reducer：`action.response.entities.todos`就是todo實體，所以只要直接合併進原本的state即可。

~~~jsx
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

`ids` reducer：`action.response.result`就是`ids` state所表示的todo array。在`ADD_TODO_SUCCESS`的情況下，`result`為單筆，append至state尾端即可；在`FETCH_TODO_SUCCESS`的情況下，`result`為array，直接取代原本的state即可。

~~~jsx
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

## 參考資料

[Redux Official Website](http://redux.js.org/)

[Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)

[`normalizr`](https://github.com/paularmstrong/normalizr)
