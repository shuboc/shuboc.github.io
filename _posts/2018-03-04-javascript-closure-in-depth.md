---
title: "深入了解JavaScript Closure(閉包)的概念以及實際應用"
tags: ["javascript", "closure"]
redirect_from: /2018/03/04/javascript-closure-in-depth
---

如果你是常碰JavaScript的人，相信一定有聽過Closure(閉包)這個名詞。Closure是一種特別的函式，他能夠記住被創造的當下的環境以及變數。Closure有很多不同的用途，是一個很基礎但又非常重要的觀念，相信大家面試的時候也經常遇到ＸＤ，怎麼能不了解它呢！這篇文章將會帶你深入了解JavaScript Closure(閉包)的概念以及實際應用。

## Closure(閉包)的定義

先來看看大家最愛的[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)對Closure的定義：

> A closure is the combination of a function and the Lexical Environment within which that function was declared.

翻成中文就是：

> 閉包（Closure）是函式的組合，以及該宣告函式所包含的作用域環境（Lexical Environment）。

恩，看不太懂ＸＤ，不過翻成白話文的話大概就是**JavaScript的function可以存取宣告在其外層的變數。**

舉例來說：

```Javascript
function init() {
  let name = "John" // A variable defined outside inner function
  function displayName() {
    console.log(name) // Can access variables defined outside inner function
  }
  displayName()
}
init()
```

上面的例子中，我們在`init`的function body內宣告了另一個function `displayName`。

`displayName`沒有自己的local變數，但是他可以存取到定義在外層的`name`變數。

你可能會覺得：**JavaScript的function可以存取宣告在其外層的變數**，這件事不是理所當然的嗎？感覺Closure沒什麼特別的嘛。

先別急，讓我們耐心看下去。

## Closure(閉包)的特別之處

要解釋JavaScript Closure (閉包)的特別之處，就不能不提JavaScript的另一個特色：**在JavaScript中，函式可以當成函式的回傳值。**

舉個例子：

定義一個函式`makeFunc`：

1. `makeFunc`裡面定義了一個區域變數名為`name`。
2. 其回傳值`displayName`也是一個函式。因為closure的關係，`displayName`能夠存取`name`變數。

```Javascript
function makeFunc() {
  let name = "John"
  displayName() {
    console.log(name)
  }
  return displayName // Return the function!
}

let func1 = makeFunc()
func1() // What's the result?
```

我們將`makeFunc()`的回傳值存在`func1`變數中，並且呼叫`func1`。

問題來了：

`makeFunc`已經回傳了，當`func`被呼叫時，定義在`makeFunc`內的區域變數`name`的值會是什麼呢？

1. `undefined`
2. `"John"`
3. 以上皆非

答案是`"John"`。很神奇吧？

在一些程式語言中，如果函式回傳了，定義在其內部的區域變數就會消失。但JavaScript並非如此。原因就跟Closure的特性有關。

**雖然`makeFunc`已經回傳了，但是因為我們保留了一份`func1`的參考，而`func1`是一個Closure，所以JavaScript engine為我們在記憶體中保留了`func1`的環境，讓我們可以繼續存取`name`變數。**

Closure的特性還不只如此喔，讓我們繼續看下去！

### 每次函式被呼叫時都會創造一組新的環境 (Lexical Environment)

問題：

上例的`makeFunc`如果呼叫兩次，產生兩個不同的函式，兩個函式看到的`name`變數會相同還是不同呢？

1. 相同
2. 不同
3. 我不知道RRRRRR

要回答這個問題，我們可以來做個實驗。

定義一個`makeAdder`函式，接受`x`作為參數，回傳一個以`y`作為參數並回傳`x+y`結果的`add`函式。

```Javascript
function makeAdder(x) {
  function add(y) {
    return x+y
  }
  return add
}

let add5 = makeAdder(5)
let add10 = makeAdder(10)

add5(2) // ?
add10(2) // ?
```

我們呼叫了`makeAdder(5)`和`makeAdder(10)`，並分別將結果存在`add5`和`add10`中。

`add5`和`add10`都是closure (閉包)，他們被創造時會記住環境(Lexical Environment)，包括變數`x`。

問題：

1. `add5(2)` = ?
2. `add10(2)` = ?

答案分別是7和12。

為什麼呢？因為**每當function被呼叫時，都會產生一組新的環境(Lexical Environment)。**所以第一次呼叫`makeAdder(5)`的時候，創造了一組`x = 5`的環境，因此`add`函式看到的`x` = 5；而第二次回傳的`add`函式看到的`x` = 10。

總之`add5`和`add10`看到的`x`變數在記憶體中是不一樣的兩個變數。

Closure的這個特性其實非常有用，用途到底是什麼呢？繼續往下看！

## Closure(閉包)的應用

Closure概念上就是把function和一組data關聯起來，這對應到物件導向(Object-Oriented Programming)中，物件方法可以存取物件屬性(Property)的特性。

下面我們就來看幾個簡單的應用：

### 1. 用Closure(閉包)模擬物件導向中的private member (Module Pattern)

我們可以用Closure的特性模擬物件導向中的私有成員(private member)。

下面這個例子，我們創造一個`counter`物件，並提供三個方法存取物件內部的`count`變數。

```Javascript
const counter = (function() {
  let count = 0
  function changeBy(val) {
    count += val
  }

  return {
    increment: function() {
      changeBy(1)
    },
    decrement: function() {
      changeBy(-1)
    },
    value: function() {
      return count
    }
  }
})();

counter.value() // 0
counter.increment()
counter.increment()
counter.value() // 2
counter.decrement()
counter.value() // 1
```

物件的三個方法 (`increment`, `decrement`, `value`) 共同能夠存取同一組環境(Lexical Environment)，因此他們都能夠存取同一組`count`及`changeBy`。

除了透過`counter`物件上的方法以外，我們沒辦法直接存取其內部的`count`變數。`count`就相當於OO中的private member。

### 2. 用Closure(閉包)達到資料隔離的效果

把上面的例子改寫成工廠函式`makeCounter`。

這裡產生了兩個物件`counter1`和`counter2`，他們擁有各自的`count`變數，不會互相干擾，達到資料互相隔離的效果。

```Javascript
const makeCounter = function() {
  let count = 0
  function changeBy(val) {
    count += val
  }

  return {
    increment: function() {
      changeBy(1)
    },
    decrement: function() {
      changeBy(-1)
    },
    value: function() {
      return count
    }
  }
}

let counter1 = makeCount()
let counter2 = makeCount()

counter1.increment()
counter1.increment()

counter2.decrement()

counter1.value() // 2
counter2.value() // -1
```

### 3. 避免for loop中使用callback function的錯誤寫法

在以前只有`var`的時代，在for loop裡使用callback函式很容易不小心寫錯。

舉個例子，假設現在要寫一段code能夠每隔一秒分別印出0 1 2 3 4，你可能會用`setTimeout`搭配一個for loop去寫：

```Javascript
for (var i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i)
  }, 1000 * i)
}
```

但這段code實際上會印出5 5 5 5 5。為什麼呢？

因為`var`宣告的變數是以function作為scope，所以上面那種寫法的`i`可以看成是全域變數：

```Javascript
var i; // A global variable!
for (i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i)
  }, 1000 * i)
}
// After the execution of the for loop, i = 5
```

因此會產生五個callback function，他們看到的變數`i`都是同一個。

而跑完for loop後，`i` = 5。當callback function實際被呼叫到時，才會去看`i`實際的值，也就是5，所以才會印出5 5 5 5 5。

如果我們需要讓每個callback function都可以記住各自的`i`，該怎麼做呢？

我們必須要運用closure的特性，讓每個callback function都有各自的環境。實際上的做法就是用一個function包起來。下面的示範會統一用IIFE去做，但是要額外定義helper函式去做也可以唷。

#### 方法1. 整段code用IIFE包起來執行

第一種方法是，把整段`setTimeout`的code包在一個IIFE中。for loop的每個iteration呼叫IIFE時，都會產生一組新的環境，並且`i`的值會copy給`j`，這樣每個callback都會有各自的`j`了。

```Javascript
for (var i = 0; i < 5; ++i) {
  (function(j) {
    setTimeout(function() {
      console.log(j)
    }, 1000 * j)
  })(i);
}
```

#### 方法2. 用IIFE產生callback function

第二種方法是用IIFE直接產生一個`setTimeout` callback。for loop的每個iteration呼叫IIFE時，同樣會產生一組新的環境，也會把`i`的值會copy給`j`。與上面的差別是，IIFE最後要回傳`setTimeout`需要的callback function。

```Javascript
for (var i = 0; i < 5; ++i) {
  setTimeout((function(j) {
    return function() {
      console.log(j)
    }
  })(i), 1000 * i)
}
```

#### 方法3. 用`let`

如果沒有硬要用closure解決這個問題的話，其實用`let`解決是最快的：

```Javascript
for (let i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i)
  }, 1000 * i)
}
```

## 補充說明：Lexical Environment

上面一直提到環境(Lexical Environment)這個詞彙，這邊稍加補充說明。

JavaScript中，一段code能夠存取哪些變數，是由Code所在的Lexical Environment決定的。

所謂lexical enviroment包含了：

1. 區域變數
2. 外層的Lexical Environment的參考（可以簡單想像成大括號外的區域）

一段code要存取一個變數的時候，會先在當下的Lexical Environment找，找不到會再往外層找，直到global scope為止。

這就是內層的function存取外層宣告的變數的原理。

# 結語

看到這裡，希望你已經對JavaScript Closure(閉包)的概念以及實際應用有了深入了解！這篇文章的例子和說明大部分都是參考自[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)與[JavaScript.info](http://javascript.info/closure)，有興趣更深入了解Closure的朋友可以再去看看喔！

# Reference

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
http://javascript.info/closure
