---
title: "[教學] 快速了解JavaScript的call()和apply()的應用"
tags: ["javascript"]
redirect_from: /2018/08/11/javascript-apply-call-call-forwarding
last_modified_at: 2018/12/30
---

這篇教學會介紹JavaScript中的`apply()`和`call()`有什麼差別，以及2種常見的應用場合：Call Forwarding及Method Borrowing。

## Call Forwarding

有時候，我們想要在一個函式原本的功能之上附加額外的功能，這個時候可以使用**Call Forwarding**的技巧。

**Call Forwarding**用一句話來說就是：用一個wrapper函式把原本的函式包起來，並呼叫原本的函式。

```jsx
const wrappedFunction = function wrapper() {
  return anotherFunction.apply(this, arguments)
}
```

這裡就會需要用到`Function.prototype.apply`，用`wrapper`函式的`this`和`arguments`去呼叫原本的`anotherFunction`。

基本的使用方法如下：

```jsx
function wrapper(func) {
  const wrappedFunction = function() {
    const result = func.apply(this, arguments) // (*)
    // Some custom logic...
    return result
  }

  return wrappedFunction
}

const wrappedFoo = wrapper(foo)
wrappedFoo(bar, baz)
```

`wrapper` 函式的引數是一個函式`func`，回傳值是另一個函式 `wrappedFunction`。

當`wrappedFunction` 被呼叫的時候，會執行原本的`func`，並且加上你想要的邏輯，最後回傳`func`被執行的結果。

核心在執行`func`的這一行`(*)`，也就是`func.apply(this, arguments)`。

### `arguments`

`arguments`是一個函式內部特別的變數，對應到函式被呼叫時傳進來的引數。

我們需要用到`wrappedFunction`的`arguments`變數，因為我們會用和`func`一樣的參數呼叫`wrappedFunction`，但是我們事先不知道`func`會有幾個參數。

### `Function.prototype.apply`

`Function.prototype.apply`是函式物件的一個方法，用法是

```jsx
someFunction.apply(context, arguments)
```

以下兩者效果大概相同，除了用`Function.prototype.apply`呼叫`someFunction`時，`this`的值會是`context`。：

```jsx
someFunction(1, 2, 3)
someFunction.apply(context, [1, 2, 3])
```

因此呼叫`func`時的`this`等於`wrappedFunction`被呼叫時的`this`。

我們需要特別注意呼叫時的`this`，是因為也會有以下的使用情境：

```jsx
const worker = {
  someMethod() {
    return 1;
  },
  slow(x) {
    return x * this.someMethod()
  }
}

worker.slow = wrapper(worker.slow)
worker.slow()
```

如此一來`wrappedFunction`呼叫起來跟原本的函式幾乎一模一樣，但是又加上了自己想要的邏輯。

## 範例應用: Cache

假設有個計算量非常費時的函式：

```jsx
function slow(x) {
  // Some CPU heavy task
  return x
}
```

我們希望加上cache的功能，如果用相同的參數去呼叫這個函式第二次的話，就直接回傳上一次計算過的結果：

```jsx
function cachingDecorator(func) {
  let cache = new Map() // The cache

  return function() {
    const key = hash(arguments) // Some hash function
    if (cache.has(key)) {
      return cache.get(key) // Retrieve value from the cache
    }

    const result = func.apply(this, arguments) // Compute result

    cache.set(key, result) // Save value to the cache
    return result
  }
}

slow = cachingDecorator(slow)
slow(1)
slow(1) // Cached!
slow(1) // Cached!
```

## Method Borrowing

上例中的`hash()`的實作需要注意。

以下寫法有問題，因為`arguments`不是一個array，沒有`join`方法：

```jsx
function hash() {
  return arguments.join(',') // Not working!
}
```

但是利用`Function.prototype.call`，就可以借用`Array.prototype.join`方法：

```jsx
function hash() {
  return [].join.call(arguments, ',')
}
```

## Reference

* [Decorators and forwarding, call/apply - JavaScript Info](http://javascript.info/call-apply-decorators)
* [Arguments object - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)
* [Function.prototype.apply - MDN
](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

