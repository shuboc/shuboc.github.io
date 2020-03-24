---
title: "[教學] 深入淺出 JavaScript 閉包 (Closure)"
tags: ["javascript"]
redirect_from: /2018/03/04/javascript-closure-in-depth
last_modified_at: 2020/03/24
---

![JavaScript Closure](/images/javascript-closure.jpg)

Closure (閉包) 在 JavaScript 中是一種特別的函式，它能夠記住被創造的當下的環境以及變數，也是 JavaScript 中最重要卻又最難懂的概念之一。這篇文章將會教你 closure 的特性，以及實際演練常見的應用，例如IIFE、模擬 private member 達到封裝的特性等。

## 目錄

* [閉包 (Closure) 的特性](#閉包-closure-的特性)
    * [特性1️⃣: 函式能夠存取其外層變數](#特性1️⃣-函式能夠存取其外層變數)
    * [特性2️⃣: 函式可以當作另一個函式的回傳值](#特性2️⃣-函式可以當作另一個函式的回傳值)
    * [特性3️⃣: 閉包 (closure) 可以「保留」環境](#特性3️⃣-閉包-closure-可以保留環境)
    * [特性4️⃣: 每次函式被呼叫時，都會創造一組新的環境](#特性4️⃣-每次函式被呼叫時都會創造一組新的環境-lexical-environment)
    * [閉包的特性: 小結](#閉包的特性-小結)
* [閉包 (Closure) 的應用](#閉包-closure-的應用)
    * [應用1️⃣: 用閉包 (Closure) 模擬物件導向中的私有成員 (Private Member)](#應用1️⃣-用閉包-closure-模擬物件導向中的私有成員-private-member)
    * [應用2️⃣: 用閉包 (Closure) 達到資料隔離的效果](#應用2️⃣-用閉包-closure-達到資料隔離的效果)
    * [應用3️⃣: 避免for loop中使用callback function的錯誤寫法](#應用3️⃣-避免for-loop中使用callback-function的錯誤寫法)
        * [解法1️⃣: 整段code用IIFE包起來執行](#解法1️⃣-整段code用iife包起來執行)
        * [解法2️⃣: 用IIFE產生callback function](#解法2️⃣-用iife產生callback-function)
        * [解法3️⃣: 用let](#解法3️⃣-用let)
* [補充說明：Lexical Environment](#補充說明lexical-environment)
* [結語](#結語)
* [Reference](#reference)

## 閉包 (Closure) 的特性

只能用一句話解釋閉包的話，我會這樣說：

☝️**閉包 (Closure) 是一種特殊的函式，他能夠存取被宣告當下的環境中的變數。**

真的要深入理解閉包，我們可以來看看[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)上對閉包的定義：

> A closure is the combination of a function and the Lexical Environment within which that function was declared.

其實滿抽象的，要怎麼去理解這個定義呢？

這裡提到了閉包是由兩個主體構成：

1. *函式 (function)*
2. *Lexical Environment within which that function was declared (函式被宣告時所在的環境)*。

我們一項一項分開來看。

首先，由第一句話我們可以知道，閉包 (closure) 是一個函式。

然後，Lexical Environment，你可以把它簡單想像成一個區塊 (scope)，這個區塊裡面包含了一些變數，函式能夠存取這個區塊裡面的變數。

恩...🤔🤔🤔

光看字面意思其實很難理解。

別擔心！

下面我會用一些很簡單的例子，說明閉包的一些特性。

看完之後，再回頭看這段文字，應該會比較有感覺！

讓我們繼續看下去！👇

### 特性1️⃣: 函式能夠存取其外層變數

要理解閉包 (closure)，首先我們要談談JavaScript語言中，關於**變數存取的規則**。

下面直接舉一段程式碼當作例子：

首先，我們宣告一個函式`init()`，在裡頭宣告了一個變數`name`。

緊接著在`init()`內又宣告了另一個函式`displayName()`。

最後我們呼叫`displayName()`，`displayName()`會呼叫`console.log(name)`。

```Javascript
function init() {
  let name = "John" // 宣告在displayName外部的變數
  function displayName() {
    console.log(name) // 試圖存取宣告在displayName外部的變數
  }
  displayName()
}
init()
```

🙋問題來了：

`name`並不是`displayName()`內的區域變數，而是宣告在他的外部環境`init()`的變數。

這種情況下`console.log`會印出什麼呢？

1. `undefined`
2. `"John"`

.

.

.

答案是 `"John"`。

為什麼呢？🤔

因為JavaScript的變數尋找規則是：

☝️**內層區塊可以存取定義在外層區塊的變數。反過來說，外層區塊沒辦法存取內層區塊的變數。**

所以內層區塊 `displayName` 可以存取定義在外層區塊 `init` 的變數 `name`。

> 這樣的變數查找規則，有個專有名詞叫做 *Lexical Scoping*。大部分的程式語言都採用類似的變數查找規則，另外有一種 *Dynamic Scoping* 的規則，但我就沒詳細研究囉，大家自己有興趣可以看看這篇關於[Lexical Scoping的介紹](https://stackoverflow.com/questions/1047454/what-is-lexical-scope)。

或許你會覺得，這件事不是理所當然的嗎？

先別急，讓我們耐心看下去！👇

### 特性2️⃣: 函式可以當作另一個函式的回傳值

JavaScript的另一個特色是：

☝️**在JavaScript中，函式可以當成另一個函式的回傳值。**

這是什麼意思呢？

在JavaScript中，函式是一種物件。

☝️**因為函式是物件，所以函式可以作為函式的參數傳遞，也可以當作函式的回傳值。**

換句話說，函式在JavaScript中是[一等公民(first-class)](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)。

你可能會問，函式可以當作回傳值，那又怎樣？

其實這個特性會跟下一個要提到的特性有關。

讓我們往下看！👇

### 特性3️⃣: 閉包 (closure) 可以「保留」環境

第三個特性是：閉包 (closure) 可以「保留」環境。

這個特性會和前面兩個特性有關。

我用下面這個例子來說明：

1. 首先定義一個函式`makeFunc()`。
2. `makeFunc()`裡面定義了一個區域變數`name`。
3. `makeFunc()`裡面定義了一個函式`displayName()`。注意：`displayName`能夠存取`name`變數。
4. **`makeFunc()`的回傳值是`displayName`這個函式。**
5. 最後，我們將`makeFunc()`的回傳值存在`func1`變數中，並且呼叫`func1`。

當`func1()`被呼叫的時候，實際上就是呼叫`makeFunc()`回傳的`displayName`。

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

🙋問題來了：

當`displayName()`被呼叫時，`console.log(name)`會被執行。

注意：`name`是定義在`makeFunc()`裡的一個區域變數，而`makeFunc`已經結束執行並回傳了。

那這時候`name`印出來的值會是什麼？

1. `undefined`
2. `"John"`

.

.

.

答案是`"John"`。

為什麼呢？🤔

明明`makeFunc()`已經結束執行並回傳了，`name`卻沒有跟著消失呢？

原因跟「這個」特性有關👇。

在一些程式語言中，如果函式回傳了，定義在其內部的區域變數就會消失。

但在JavaScript並非如此！

☝️**在JavaScript中，即使在外層區塊已經回傳的狀況下，只要內層區塊還保留著一份參考，那麽外層的變數不會隨著回傳而消失，我們依然可以存取外層的變數。**

雖然`makeFunc()`回傳了，但是我們還保留著一份`displayName`的參考 (存在`func1`變數裡)。

因為`displayName`是一個閉包 (closure)，JavaScript engine會在記憶體中為我們繼續保留`displayName`的環境 (包含`name`變數)，所以我們可以繼續存取`name`變數。

看完了這個例子，應該可以了解 **閉包 (closure) 可以「保留」環境** 是什麼意思。

閉包的特性還不只如此喔。

讓我們繼續看下去！👇

### 特性4️⃣: 每次函式被呼叫時，都會創造一組新的環境 (Lexical Environment)

要說明這個特性，我們從一個例子開始思考：

首先，定義一個 `makeAdder` 函式，接受 `x` 作為參數，回傳一個以 `y` 作為參數，並回傳 `x + y` 結果的 `add()` 函式。

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

我們分別呼叫了 `makeAdder(5)` 和 `makeAdder(10)`，並分別將結果存在 `add5` 和 `add10` 中。

因為`add5`和`add10`都是閉包 (closure)，所以他們被創造時會記住宣告當下的環境(Lexical Environment)，包括變數`x`。

🙋問題來了：

1. `add5(2)` = ?
2. `add10(2)` = ?

答案分別是7和12。

為什麼呢？🤔

要回答這個問題，需要去思考，`add5` 和 `add10` 兩個閉包 (closure) 看到的 `x` 變數值分別是什麼。

這裡我就直接破梗講答案囉！

對 `add5` 而言，`x = 5`。

對 `add10` 而言，`x = 10`。

`add5` 和 `add10` 同樣都是呼叫 `makeAdder` 的回傳結果，但是就結果而言，分別記住了各自的一組環境。

這個結果的原理來自於這個特性：

☝️**每當函式被呼叫時，都會產生一組新的環境 (Lexical Environment)。**

所以第一次呼叫`makeAdder(5)`的時候，創造了一組`x = 5`的環境，因此`add`函式看到的`x` = 5；而第二次回傳的`add`函式看到的`x` = 10。

總之 `add5` 和 `add10` 看到的 `x` 變數在記憶體中是不一樣的兩個變數。

### 閉包的特性: 小結

辛苦了！🙇

看到這裡，你應該大致了解閉包 (closure) 有哪些特性了吧！

那你一定會想知道，閉包有這些特性又怎樣？🤔

到底哪邊會用到閉包？🤔

👇下面我們就來看看一些閉包 (closure) 的應用吧！

## 閉包 (Closure) 的應用

閉包 (closure) 在比較高層次的概念上，可以想成把函式和一組資料關聯起來。

這對應到物件導向程式設計 (Object-Oriented Programming) 中，物件方法可以存取物件屬性 (property) 的特性。

下面我們就來看幾個簡單的應用：

### 應用1️⃣: 用閉包 (Closure) 模擬物件導向中的私有成員 (Private Member)

我們可以用Closure的特性模擬物件導向中的私有成員(private member)。

(這個方法有時又被稱作 Module Pattern。)

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

除了透過`counter`物件上的方法以外，我們沒辦法直接存取其內部的`count`變數。

☝️`count`就相當於物件導向中的私有成員變數private member。

### 應用2️⃣: 用閉包 (Closure) 達到資料隔離的效果

我們可以把上面的例子改寫成工廠函式 `makeCounter`，用來產生更多的 counter 物件。

這裡產生了兩個物件`counter1`和`counter2`。

☝️`counter1`和`counter2`擁有各自的`count`變數，不會互相干擾，達到資料互相隔離的效果。

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

### 應用3️⃣: 避免for loop中使用callback function的錯誤寫法

在以前只有`var`的時代，在for loop裡使用callback函式很容易不小心寫錯。

舉個例子，假設現在要寫一段code能夠每隔一秒分別印出0 1 2 3 4。

你可能會寫成這樣，用`setTimeout`搭配一個for loop去寫：

```Javascript
for (var i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i)
  }, 1000 * i)
}
```

但這樣寫是錯的❌。

這段code實際上會印出 `5 5 5 5 5` 。

為什麼呢？🤔

因為`var`宣告的變數是以函式作為scope，所以上面那種寫法的`i`可以看成是全域變數：

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

那我們到底該怎麼做才對呢？🤔

關鍵是：我們需要讓每個callback function都可以記住各自的`i`。

☝️所以我們必須要運用closure的特性，讓每個callback function都有各自的環境。

實際上的做法就是用一個function包起來。

👇下面列舉了幾種可能的解法：

#### 解法1️⃣: 整段code用IIFE包起來執行

第一種方法是：把整段code包在一個IIFE中去執行。

for loop的每個iteration呼叫IIFE時，都會產生一組新的環境，並且`i`的值會copy給`j`，這樣每個callback都會有各自的`j`了。

```Javascript
for (var i = 0; i < 5; ++i) {
  (function(j) {
    setTimeout(function() {
      console.log(j)
    }, 1000 * j)
  })(i);
}
```

#### 解法2️⃣: 用IIFE產生callback function

第二種方法是：用IIFE直接回傳一個callback function。

for loop的每個iteration呼叫IIFE時，同樣會產生一組新的環境，也會把`i`的值會copy給`j`。

與前一種做法的差別是，IIFE最後要回傳`setTimeout`需要的callback function。

```Javascript
for (var i = 0; i < 5; ++i) {
  setTimeout((function(j) {
    return function() {
      console.log(j)
    }
  })(i), 1000 * i)
}
```

#### 解法3️⃣: 用`let`

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

## 結語

看到這裡，希望你已經對JavaScript Closure(閉包)的概念以及實際應用有了深入了解！這篇文章的例子和說明大部分都是參考自[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)與[JavaScript.info](http://javascript.info/closure)，有興趣更深入了解Closure的朋友可以再去看看喔！

有任何問題，或是覺得寫得不清楚的地方，歡迎在下面👇👇👇留言讓我知道喔。

## Reference

[Closures - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

[Closure - javascript.info](http://javascript.info/closure)
