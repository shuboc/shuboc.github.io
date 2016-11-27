# Redux Middleware

所謂的middleware一言以蔽之，就是一個函式，能把現有的dispatch改寫成加強功能版的dispatch。這種函式的輸入是redux store，output是一個經過改寫的dispatch函式。

## Logging Dispatch

monkeypatching dispatch

~~~jsx
const logger = (store) => {
  const rawDispatch = store.dispatch
  return (action) => {
    console.group(action.type)
    console.log('prev state', store.getState())
    console.log('action', action);
    const returnValue = rawDispatch(action)
    console.log('next state', store.getState());
    console.groupEnd(action.type)

    return returnValue
  }
}
~~~

## Redux Promise

dispatch promise as an action:

~~~jsx
// action
export const fetchTodos = (filter) =>
  api.fetchTodos(filter).then(response => ({
    type: 'RECEIVE_TODO',
    filter,
    response
  }))
~~~

monkeypatching dispatch

~~~jsx
const promise = (store) => {
  const rawDispatch = store.dispatch
  return (action) => {
    if (typeof action.then === 'function') {
      return action.then(rawDispatch)
    }
    
    return rawDispatch(action)
  }
}
~~~

# Apply Moneypatches

~~~jsx
store.dispatch = addLoggingToDispatch(store)
store.dispatch = addPromiseSupportToDispatch(store)
~~~

# 定義middlewares

把rawDispatch重新命名成next

~~~jsx
const addLoggingToDispatch = store => {
  const next = store.dispatch
  return action => {
    ...
    const returnValue = next(action)
    ...
    return returnValue
  }
}

const addPromiseSupportToDispatch = (store) => {
  const next = store.dispatch
  return (action) => {
    if (typeof action.then === 'function') {
      return action.then(next)
    }
    
    return next(action)
  }
}
~~~

在addLoggingToDispatch裡面的next就是原本的store.dispatch，加工處理過後回傳了新版本的dispatch。

在addPromiseSupportToDispatch裡面的next就是經過addLoggingToDispatch加工處理過的dispatch，也是加工處理過後再回傳新版本的dispatch

## 用Curry Function改寫

可以再更進一步把重覆的const next = store.dispatch抽出來，改寫成curry function。

~~~jsx
const logger = store => next => action => {
  console.group(action.type)
  console.log('prev state', store.getState())
  console.log('action', action);
  const returnValue = next(action)
  console.log('next state', store.getState());
  console.groupEnd(action.type)

  return returnValue
}

const promise = store => next => action => {
  if (typeof action.then === 'function') {
    return action.then(next)
  }
  return next(action)
}
~~~

經過這種改寫以後，middleware輸入變成是store和store.dispatch，輸出一樣是經過改寫的dispatch函式。

# apply middlewares

我們可以統一用一個wrapDispatchWithMiddlewares函數處理middlewares。他的功能是：對每個middleware，按照順序把store.dispatch覆寫成經過middleware處理過後的版本。

~~~jsx
const middlewares = [promise, logger]
wrapDispatchWithMiddlewares(store, middlewares)
~~~

wrapDispatchWithMiddlewares可以簡單定義如下：

~~~js
const wrapDispatchWithMiddlewares = (store, middlewares) => {
  middlewares.slice().reverse().forEach(middleware => {
    store.dispatch = middleware(store)(store.dispatch)
  })
}
~~~

在這個Loop裡面會apply兩次middleware：

1. 第一次執行相當於store.dispatch = logger(store)(store.dispatch)，其中的next執行完的store.dispatch變成有log的版本。
2. 第二次執行相當於store.dispatch = promise(store)(store.dispatch)，其中的`next`參數會把有logger功能的`store.dispatch`傳進去。

# middleware chain的順序

我們希望middleware的順序是：先處理屬於promise的action，再來是log action，最後才是dispatch action。因此middleware比較符合直覺的順序為：

**action在middleware chain之間傳遞的順序**。

上面的例子中，middleware chain的順序為`[promise, logger]`。

但**apply middleware的順序和middleware功能被執行的順序相反**。因此在`wrapDispatchWithMiddlewares()`裡，apply middleware時候會做一次`reverse()`，**先做logger再來才是promise**。

以上面的例子來說，apply middleware時會先執行`logger(store)(store.dispatch)`再執行`promise(store)(store.dispatch)`，結果就是在`promise`裡面的`store.dispatch`是`logger`回傳的`dispatch`，在`logger`裡面的`store.dispatch`就是原版的`store.dispatch`。所以一個action會先執行完promise的功能才呼叫logger回傳的dispatch，然後寫完log之後再執行原版的store.dispatch。

因應middleware chain的說法，middleware裡的`store.dispatch`可以想成是apply過『下一個』middleware功能的`dispatch`。

因此把`store.dispatch`命名為`next`，一切就很合理了：`promise`的下一個middleware是`logger`，所以`promise`裡的`next`是`logger`回傳的`dispatch`。而`logger`是最後一個middleware，所以`logger`的`next`就是原版的`store.dispatch`，




其實全部都有現成的

~~~js
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger'
import promise from 'redux-promise'

const configureStore = () => {
  const middlewares = [promise]
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger())
  }

  const store = createStore(
    todoApp,
    applyMiddleware(...middlewares) // optional enhancer
  );

  return store
}
~~~

