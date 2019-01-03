---
layout: post
title: "[教學] Redux Middleware Chain"
tags: [react]
redirect_from: /2016/12/26/redux-middleware-chain
last_modified_at: 2018/12/29
---

這篇教學主要是整理Redux middleware的原理，如何實作，以及如何理解middleware chain的順序。

## Middleware

[Redux](http://redux.js.org/)提供了middleware的機制，可以讓我們把原有的dispatch加上想要的功能。比方說：印Log，支援各種形式的action。（Redux最初的設計中，action是一個plain object）

middleware可以用`store.dispatch`當作原料，製造出一個新的patch過後的`dispatch`。

## 如何實作Middleware

### logger

假設我們想要每次dispatch的時候都印一條log，可以用middleware產生一個新的`dispatch`，功能是在原有的`dispatch`之外加上log：

~~~jsx
const logger = (store) => {
  const rawDispatch = store.dispatch

  // Patched dispatch
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

上面這個middleware做的事情是：

1. 把`store.dispatch`讀出來存在`rawDispatch`裡。
2. 回傳了一個patch過版本的`dispatch`，也就是`action => {...}`，當這個`dispatch`被呼叫時，將會印一些log，再呼叫原本的`rawDispatch`。

當我們要使用這個middleware時，用patch過的`dipatch`覆蓋掉原本的`store.dispatch`:

~~~jsx
store.dispatch = logger(store)
~~~

### Redux Promise

假設我們的action需要打API，回傳以後根據取得的資料發送某個action，這整組動作可以被看成是一個promise物件。

~~~jsx
// promise as an action
export const fetchTodos = (filter) =>
  api.fetchTodos(filter).then(response => ({
    type: 'RECEIVE_TODO',
    filter,
    response
  }))
~~~

如果可以直接dispatch這個promise，可以讓程式變得更簡潔。我們可以寫一個promise middleware來做到對promise的支持：

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

上面這個middleware做的事情是:

1. 把`store.dispatch`讀出來存在`rawDispatch`裡。
2. 回傳了一個patch過版本的`dispatch`，也就是`action => {...}`，當這個`dispatch`被呼叫時，將會檢查action是否為promise（檢查的方法就是看看action物件有沒有名為`then`的function），是的話就呼叫`rawDispatch`去dispatch promise的回傳值。
3. 如果是普通的action就呼叫原本的`rawDispatch`。

當我們要使用這個middleware時，用patch過的`dipatch`覆蓋掉原本的`store.dispatch`:

~~~jsx
store.dispatch = promise(store)
~~~

### Apply middlewares

綜合以上，要使用兩個middlewares，需要複寫`store.dispatch`兩次:

~~~jsx
store.dispatch = logger(store)
store.dispatch = promise(store)
~~~

## Middleware chain的順序與next

為了方便理解，middleware的順序可以簡單理解成：**action在middleware chain之間傳遞的順序**。舉本篇的例子，會先判斷action是否屬於promise，再來logging，最後才是原本的`dispatch`，所以middlewares的順序會是`[promise, logger]`。

### next

為了方便理解，對所有的middlewares，我們把`rawDispatch`重新命名成`next`。

~~~jsx
const logger = store => {
  const next = store.dispatch
  return action => {
    console.group(action.type)
    console.log('prev state', store.getState())
    console.log('action', action);
    const returnValue = next(action)
    console.log('next state', store.getState());
    console.groupEnd(action.type)
    return returnValue
  }
}

const promise = (store) => {
  const next = store.dispatch
  return (action) => {
    if (typeof action.then === 'function') {
      return action.then(next)
    }

    return next(action)
  }
}
~~~

決定把`rawDispatch`重新命名成`next`的原因是：`rawDispatch`就是middleware chain中的『下一個』`dispatch`。如何理解這件事呢？

根據上面的定義，middleware chain的順序是`[promise, logger]`。

實際上，apply middleware的順序是先做`store.dispatch = logger(store)(store.dispatch)`，再做`store.dispatch = promise(store)(store.dispatch)`。結果就是在`promise`裡面的`rawDispatch`是`logger`回傳的`dispatch`，在`logger`裡面的`rawDispatch`是原版的`store.dispatch`。

按照`[promise, logger]`的順序，`rawDispatch`自然就會變成middleware chain中的下一個`dispatch`，例如：`promise`裡的`rawDispatch `是`logger`回傳的`dispatch`。而`logger`的`rawDispatch `是原版的`store.dispatch`。

所以我們可以給予`rawDispatch`一個更容易理解的稱呼：`next`。

## Apply middlewares

我們可以統一用一個`wrapDispatchWithMiddlewares`函數處理middlewares。他的功能是：對每個middleware，按照順序覆寫`store.dispatch`：

~~~jsx
const middlewares = [promise, logger]
wrapDispatchWithMiddlewares(store, middlewares)

const wrapDispatchWithMiddlewares = (store, middlewares) => {
  middlewares.slice().reverse().forEach(middleware => {
    store.dispatch = middleware(store)
  })
}
~~~

每個middleware中都會重複做`const next = store.dispatch`，所以我們可以把`next`抽出來，改寫成*curry function*的形式（curry function可以想成：一樣是function，只是他的變數可以分階段apply）：

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

呼叫時將`next`參數用`store.dispatch`帶入：

~~~jsx
const wrapDispatchWithMiddlewares = (store, middlewares) => {
  middlewares.slice().reverse().forEach(middleware => {
    store.dispatch = middleware(store)(store.dispatch)
  })
}
~~~

因為middleware chain順序為`[promise, logger]`，但需要先apply`logger`再apply`promise`的緣故，`wrapDispatchWithMiddlewares()`裡需要先對`middlewares`做`reverse()`。

在這個迴圈裡面會apply兩次middleware：

1. 第一次迴圈執行，相當於`store.dispatch = logger(store)(store.dispatch)`，`logger`接受原始的`dispatch`並回傳有log的版本。然後`store.dispatch`被覆寫成有log的版本。
2. 第二次迴圈執行，相當於`store.dispatch = promise(store)(store.dispatch)`，`promise`接受有log的dispatch，並且回傳有log同時支援promise的版本。最後`store.dispatch`被覆寫成有log同時支援promise的版本。

## Remove Monkeypatching

為了不要動到原本的`dispatch` API，我們可以回傳store的copy，其中`dispatch`是被修改過後的版本:

~~~jsx
const applyMiddleware = (store, middlewares) => {
  let dispatch = store.dispatch
  middlewares.slice().reverse().forEach(middleware => {
    dispatch = middleware(store)(dispatch)
  })

  // Return a copy of store where dispatch() is patched
  return {...store, dispatch}
}
~~~

## applyMiddleware API

上面的`applyMiddleware`版本並不應該在真實的環境中使用，只是為了更加理解middleware，實際上redux原生就提供了[applyMiddleware](https://github.com/reactjs/redux/blob/master/src/applyMiddleware.js) API。

實際的程式碼並不長，但這段程式碼其實大有學問：

~~~jsx
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer)
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
~~~

middleware的形式為`({dispatch, getState}) => next => action => {...}`，所以第一步是將`getState`和`dispatch`注入middleware：

~~~jsx
var middlewareAPI = {
  getState: store.getState,
  dispatch: (action) => dispatch(action)
}
chain = middlewares.map(middleware => middleware(middlewareAPI))
~~~

下一步是將`next`注入middleware，這裡用到了[`compose`](https://github.com/reactjs/redux/blob/master/src/compose.js) API，其功能顧名思義是將一連串的function組合起來，例如：`compose(f, g, h)`會回傳`(...args) => f(g(h(...args)))`。

不斷地把下一個middleware回傳的function當作`next`參數注入當前的middleware，一層一層把`store.dispatch`包起來以後，就可以得到最終版的`dispatch`：

~~~jsx
dispatch = compose(...chain)(store.dispatch)
~~~

最後有一個很重要的關鍵，就是被注入的`middleware.dispatch`實際上用了閉包的形式，也就是`action => dispatch`存了`dispatch`這個變數，並且在最後用`dispatch = compose(...chain)(store.dispatch)`改寫`dispatch`這個變數，也就是說**實際上被注入middleware的`dispatch`變數是加上所有middleware功能的最終版**。

~~~jsx
var dispatch = store.dispatch
...
middlewareAPI = {
  ...,
  dispatch: (action) => dispatch(action)
}
...
dispatch = compose(...chain)(store.dispatch)
~~~

總結以上，原生版本的`applyMiddleware`跟我們自己寫的差異主要有以下幾點：

1. **在middleware裡面看到的`dispatch`對應到加上所有middleware功能的最終版`dispatch`**。
2. 在middleware裡面會多看到`getState`，對應到redux原生的`getState`。
3. 而`next`對應到middleware chain中的下一個middleware。

在官方文件對於middleware的[說明](http://redux.js.org/docs/advanced/Middleware.html#attempt-6-naïvely-applying-the-middleware)中，可以看到以下說明：

> It does a bit of trickery to make sure that if you call `store.dispatch(action)` from your middleware instead of `next(action)`, the action will actually travel the whole middleware chain again, including the current middleware. This is useful for asynchronous middleware, as we have seen previously.

我想所謂的trickery，指的就是將擁有所有middleware功能的`dispatch`注入至middleware，如此一來透過`dispatch`呼叫的action都必然會完整經過middleware chain的每一環。

[redux-thunk](https://github.com/gaearon/redux-thunk)中就運用了類似的特性。thunk是一種利用function的形式來表示一連串的async actions：

~~~jsx
const someAsyncAction = () => (dispatch, getState) => {
  dispatch(anotherAsyncAction())
}

dispatch(someAsyncAction())
~~~

thunk middleware的[實作](https://github.com/gaearon/redux-thunk/blob/master/src/index.js)大致上是將`dispatch`注入到thunk中，讓thunk自行控制內部非同步機制如何實作：

~~~jsx
const thunkMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }

  return next(action);
}
~~~

thunk最方便的功能之一就是thunk裡面可以`dispatch`其他的async thunk，靠的就是applyMiddleware的實作中注入了有全部middleware功能的`dispatch`，保證任何被`dispatch`的thunk一定會被thunk middleware處理到。

### API Usage

~~~jsx
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

## 參考資料

[redux.js.org](http://redux.js.org/docs/advanced/Middleware.html)

[Egghead](https://egghead.io/lessons/javascript-redux-the-middleware-chain)

[深入理解Redux的Middleware](http://guoyongfeng.github.io/idoc/html/React%E8%AF%BE%E7%A8%8B%E4%B8%93%E9%A2%98/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3Redux%E7%9A%84Middleware.html)

[Understanding Redux Middleware](https://medium.com/@meagle/understanding-87566abcfb7a#.oxsw8x1if)
