---
title: "[教學] 如何使用 JavaScript Promise 簡化非同步流程"
tags: [javascript]
redirect_from: /2017/05/20/javascript-promise
last_modified_at: 2020/07/26
---

JavaScript 中的 Promise 是專門用來執行非同步操作的資料結構，提供了 then、catch、all、race 等方法，使得複雜的非同步流程變得簡潔好管理。這篇文章將會介紹 promise 的 resolve 和 reject，如何使用 then 串接非同步流程以及 catch 處理錯誤，方便好用的 promise chain，以及如何利用 Promise.all 及 Promise.race 平行處理非同步流程。

## Why Promise?

JavaScript在執行非同步（例如API request，等待使用者點擊）的流程時，因為不知道什麼時候會完成，通常會接受一個callback function作為參數，完成會呼叫此callback function以執行下一步。

我們很容易遇到一個狀況：有好幾件非同步的工作，並且每一件都依賴前一件工作的結果，必須按照順序完成，就會形成所謂的callback hell，讓程式碼變得難以維護：

```Javascript
asyncA(function(dataA) {
  asyncB(dataA, function(dataB) {
    asyncC(dataB, function() {
      ...
    })
  })
})
```

Promise能夠將非同步流程包裝成簡潔的結構，並提供統一的錯誤處理機制（某種程度上可以想成是把複雜的非同步流程用一個try/catch包起來）。

```Javascript
asyncA()
  .then(asyncB)
  .then(asyncC)
  .catch() // Error Handling
```

## Create Promise

Promise的constructor接受一個執行函式(executor)，用來定義非同步行為。執行函式會被馬上呼叫並傳入兩個參數：`(resolve, reject)`。

Promise物件的初始狀態為*pending*，在執行函式中呼叫`resolve()`，會將Promise的狀態轉變成*resolved*，而呼叫`reject()`會將狀態轉為*rejected*。

```Javascript
const p = new Promise(function(resolve, reject) {
  doSomethingAsync(function(err, value) {
    if (err) {
      reject(new Error(err))
    } else {
      resolve(value)
    }
  })
})
```

### Example: Check `document.readyState`

```Javascript
function ready() {
  return new Promise(function(resolve) {
    function checkState() {
      if (document.readyState !== 'loading') {
        resolve()
      }
    }

    document.addEventListener('readystatechange', checkstate)
    checkstate()
  })
}
```

## `.then()`

Promise具有`.then()`方法，用來定義非同步行為完成後的動作。`.then()`方法接受一個callback function作為參數，當promise轉變成*resolved*狀態時，這個callback function會被執行。

在Promise的執行函式中，傳入`resolve()`的參數，會在`.then()`的callback function中作為參數傳入：

```Javascript
const p = new Promise(resolve => {
  resolve(42)
})

p.then(function(value) {
  console.log(value) // 42
})
```

### Example: `setTimeout`

```Javascript
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  })
}

delay(3000).then(function() {
  console.log('hello!')
})
```

## `.catch()`

在執行函數中呼叫reject，或非同步的過程中有exception被拋出（`throw new Error(...)`）時，可以用`.catch()`方法來處理錯誤：

```Javascript
new Promise(function(resolve, reject) {
  ...
  reject(new Error())
})
.then(function(value) {
  ...
  throw new Error()
})
.catch(function(error) {
  // Error Handling...
})
```

### Why `.catch()`?

非同步的錯誤處理其實很麻煩！

參考下面的例子，如果在callback function裡面`throw new Error`的話，無法被try/catch捕捉到，因為等到callback function被執行時，已經離開try/catch的範圍了：

```Javascript
function callApi(callback) {
  try {
    doSomethingAsync(function(err) {
      if (err) {
        throw err // Throw error in a callback
      }
    })
  } catch(err) {
    callback(err) // Can not catch error properly!
  }
}
```

解法是callback function裡面也必須要有try/catch。這凸顯了一個難處：寫非同步程式的人必須仔細在各處捕捉錯誤，否則程式一不小心就crash了。

有了`.catch()`之後，不管是`reject(new Error())`或是`throw new Error()`通通都可以在`.catch()`中統一處理，相當方便！

[更多Node.js的error handling](https://www.joyent.com/node-js/production/design/errors)

### `.then(onResolve, onReject)` / `.then(onResolve).catch(onReject)`的差異

`.catch`有兩種寫法，其中第二種比較好：

1. `then(onResolve, onReject)`：只會有其中一個被執行，如果執行`onResolve`錯誤無法被`onReject`處理。
2. `.then(onResolve).catch(onReject)`：如果執行`onResolve`錯誤會被`onReject`處理。

### `resolve`也可能失敗

在promise裡面呼叫`resolve(value)`，或是`.then(function() {return value})`都有可能發生錯誤，例如：

1. `value === undefined`
2. `value`是一個*rejected*的promise

值得注意當`resolve(promise)`時，resolve的值＝`promise` resolve的結果。

詳見 [Promises: resolve is not the opposite of reject](https://jakearchibald.com/2014/resolve-not-opposite-of-reject/)

### 使用`reject`而不是`throw`

可以區分是我們主動回傳錯誤，還是非預期的異常，[debug的時候可能會滿有用的](http://liubin.org/promises-book/#not-throw-use-reject)。

`.then()`中需要reject的時候，可用`return Promise.reject(new Error())`)

## Chaining

`.then()`方法是可以串接的，且callback function中的回傳值就會是下一個`.then()`的callback function的參數。

```Javascript
doAsync()
  .then(function() {
    return 42 // Return value of callback
  })
  .then(function(value) {
    console.log(value) // 42
  })
```

### 為何可以串接？

**`.then()`方法會回傳一個新Promise**，其resolve的值等於`.then()`的callback function的回傳值。上面的程式碼等同於：

```Javascript
// .then()回傳一個promise
const p1 = doAsync().then(function() {
  return 42 // p1的resolve值為42
})

// promise可以呼叫then方法
p1.then(function(value) {
  console.log(value) // 42
})
```

## Sequencing (串接)

`resolve`或是`.then()`的callback function的回傳值可以是任何東西，包括promise。

resolve一個promise，會等promise完成之後才呼叫`.then()`，這個特性可以讓我們達成一件非同步工作完成後，再做另一件非同步工作的效果：

```Javascript
fetch(urls[0]).then(processData)
  .then(function() {
    return fetch(urls[1]).then(processData) // return a promise
  })
  .then(function() {
    return fetch(urls[2]).then(processData) // return a promise
  })
```

### 用`Array#forEach`串接

上面的例子用`.forEach()`改寫。注意：`p.then()`會回傳一個新的promise，如果要達到串接的效果，每次都必須對新回傳的promise去呼叫`.then()`。

```Javascript
let sequence = Promise.resolve()
urls.forEach(function(url) {
  sequence = sequence.then(function() {
    return fetch(url).then(processData)
  })
})
```

以下是錯誤的寫法，所有的`.then()`都對同一個p呼叫，p一旦resolve，所有的`.then()`callback functions都會同時執行：

```Javascript
let sequence = Promise.resolve()
urls.forEatch(function(url) {
  // Calling .then on the same promise
  sequence.then(function() {
    return fetch(url).then(processData)
  })
})
```

### 用`Array#reduce`串接

```Javascript
urls.reduce(function(sequence, url) {
  return sequence.then(function(url) {
    return fetch(url).then(processData)
  })
}, Promise.resolve())
```

參考 [专栏: 每次调用then都会返回一个新创建的promise对象](http://liubin.org/promises-book/#then-return-new-promise)

## Parallelism (平行化)

### `Promise.all()`

如果我們需要平行執行非同步工作，可以利用`Promise.all()`，它接受一個array of promises作為參數，並回傳一個promise。

當參數的promise全數resolve時，回傳的promise才會resolve，resolve的值是array of promises按照順序resolve的值：

```Javascript
Promise.all(
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
).then(function(arrayOfValue) {
  console.log(arrayOfValue) // [1, 2, 3]
})

```

### 利用`Promise.all()`平行化執行非同步工作

當`Promise.all()`接受array of promises作為參數時，所有的非同步工作會同時進行。

注意array of promises完成的順序通常不等於在array裡的順序，但是`.then()`的callback參數會按照array of promise的順序，結果的順序很重要的情況下非常有用！

```Javascript
Promise.all(
  urls.map(function(url) {
    return fetch(url)
  })
).then(function(arrayOfValue) {
  arrayOfValue.forEach(processData)
})
```

### 進階：平行化＋串接

假設想要平行發送`urls`，但不等所有url都收到回應後才按照順序`processData`，想要個別url一完成就做`processData`，但必須等前面url的回應做完`processData`之後才能對後面url的回應做`processData`，該怎麼做呢？

```Javascript
const arrayOfFetchPromises = urls.map(function(url) {
  return fetch(url)
})

const sequence = Promise.resolve()
arrayOfFetchPromises.forEach(function(fetchPromise) {
  sequence = sequence.then(function() {
    return fetchPromise.then(processData)
  })
})
```

1. 分別對所有url創promise，開始平行送request。
2. 不斷串接`fetchPromise.then(processData)`的非同步工作，這樣就可以保證`processData`是按照順序的。

## Misc

* Promise polyfill
* [用Promise.race和setTimeout實現超時取消fetch操作](http://liubin.org/promises-book/#promise-and-method-chain)
* [`Promise.then()`保證非同步呼叫](http://liubin.org/promises-book/#promise-is-always-async)
* [方法鏈如何實作](http://liubin.org/promises-book/#promise-and-method-chain)

## Reference

* [JavaScript Promises - An Introduction](https://developers.google.com/web/fundamentals/getting-started/primers/promises)
* [JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)
* [JavaScript Promise - Udacity](https://classroom.udacity.com/courses/ud898)
* [Promises: resolve is not the opposite of reject](https://jakearchibald.com/2014/resolve-not-opposite-of-reject/)
