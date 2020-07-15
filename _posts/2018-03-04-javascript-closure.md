---
title: "[教學] JavaScript Closure (閉包)、函式與語彙環境"
tags: ["javascript"]
redirect_from: /2018/03/04/javascript-closure-in-depth
last_modified_at: 2020/07/15
---

閉包 (Closure) 是函式以及其語彙環境 (lexical environment) 的組合，函式能夠記住被創造的當下的環境以及變數。事實上 closure 是 JavaScript 中最重要卻又不易理解的概念之一，並且有許多實際應用，例如IIFE、模擬 private member 達到封裝的特性 (module pattern) 等，這篇文章將會一一介紹範例。

<!-- ![JavaScript Closure](/images/javascript-closure.jpg) -->

## 閉包 (Closure) 是什麼？

要我用一句話解釋 closure 的話，就是：**閉包 (Closure) 是一個函式，他能夠存取被宣告當下的環境中的變數。**

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)上對 closure 比較正式的定義是：

> A closure is the combination of a function and the Lexical Environment within which that function was declared.

翻譯成中文就是：closure 是一個函數和此函數被宣告時所在的語彙環境。

讓我來為大家翻譯一下，這句話的意思是：

Closure 是由兩個主角構成的一個組合，分別是：

1. 函式 (function)
2. 函式被宣告時所在的語彙環境 (lexical environment)。

簡單地說，closure 包含了一個函式，這個函式會對應到一個 lexical environment (語彙環境)。

所謂的「語彙環境」，可以簡單地想像成是函式被宣告時所在的 scope，這個 scope 裡面包含了能夠被這個函式存取到的變數。

為了方便理解和記憶，你可以把 closure 想成是**一個函式，它能夠存取自己被宣告時的環境中的變數。**

到這邊或許會有點難理解，但是別擔心！下面我會用一些很簡單的例子說明 closure 的特性，之後再回頭看這段的話，應該會比較有感覺！

讓我們繼續看下去！

### JavaScript 的變數存取規則

要理解 closure，首先我們要談談 JavaScript 中，關於**變數存取的規則**。

下面直接舉一段程式碼當作例子：

```Javascript
function sayHi() {
  let name = "John"; // (1)
  function displayName() { // (2)
    console.log(name);
  }
  displayName();
}

sayHi();
```

首先，我們宣告一個函式 `sayHi()`，在裡頭宣告了一個變數 `name` (1) 和一個函式 `displayName()` (2)，`displayName()` 內部會用到 `name` 這個變數。最後我們呼叫 `sayHi()`。

問題來囉：

> 變數 `name` 並不是宣告在 `displayName()` 內，而是宣告在他的外部環境 `init()`。
> 請問這種情況下 `console.log(name)` 會印出什麼呢？

答案是 `"John"`。為什麼呢？

因為 JavaScript 的變數尋找規則是：

> **內層區塊可以存取定義在外層區塊的變數。反過來說，外層區塊沒辦法存取內層區塊的變數。**

所以內層區塊 `displayName()` 可以存取定義在外層區塊 `init()` 的變數 `name`。

> 這樣的變數查找規則，有個專有名詞叫做 *Lexical Scoping*。大部分的程式語言都採用類似的變數查找規則，另外有一種 *Dynamic Scoping* 的規則，但我就沒詳細研究囉，大家有興趣可以看看這篇關於[Lexical Scoping的介紹](https://stackoverflow.com/questions/1047454/what-is-lexical-scope)。

或許你會覺得，這件事不是理所當然的嗎？

先別急，讓我們耐心看下去！👇

### 函式可以當作另一個函式的回傳值

JavaScript 的另一個特色是：函式在 JavaScript 中是[一等公民 (first-class)](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)。

這是什麼意思呢？白話文的解釋就是在 JavaScript 中，函式是一種物件。

**因為函式是物件，所以函式不僅可以作為函式的參數，也可以當作函式的回傳值。**

下面的例子中，我們把 `sayHi` 當成是函數的回傳值 (1)：

```JavaScript
function makeSayHi() {
  function sayHi() {
    console.log("John");
  }
  return sayHi; // (1)
}

const sayHi = makeSayHi(); // (2)
sayHi(); // John
```

當我們呼叫 `makeSayHi()`，就會回傳一個可以被呼叫的函式 (2)。

你可能會問，函式可以當作回傳值，那又怎樣？其實這個特性會跟下一個要提到的特性有關。

讓我們往下看！

### Closure 可以「保留」環境

第三個特性是：閉包 (closure) 可以「保留」環境。這個特性會用到前面提過的兩個特性：函式可以存取外層變數，以及函式可以作為回傳值。

我用下面這個例子來說明：

1. 首先定義一個函式 `makeFunc()`。
2. `makeFunc()` 裡面定義了一個區域變數 `name`。
3. `makeFunc()` 裡面定義了一個函式 `displayName()`。**注意：`displayName()` 能夠存取外層的 `name` 變數。**
4. **`makeFunc()`的回傳值是`displayName`這個函式。**
5. 最後，我們將 `makeFunc()` 的回傳值存在 `func1` 變數中，並且呼叫 `func1`。

```Javascript
function makeFunc() { // 1
  let name = "John" // 2
  function displayName() { // 3
    console.log(name);
  }
  return displayName; // 4
}

let func1 = makeFunc(); // 5
func1();
```

當 `func1()` 被呼叫的時候，實際上就是呼叫 `makeFunc()` 回傳的 `displayName` 函數。

問題來了：

> 當 `displayName()` 被呼叫時，會執行 `console.log(name)`。
> 變數 `name` 是定義在 `makeFunc()` 裡的一個區域變數，而 `makeFunc()` 已經結束執行並回傳了。
> 請問呼叫 `func1()` 的時候，`name` 的值會是什麼？

答案是 `"John"`。

為什麼呢？🤔明明 `makeFunc()` 已經結束執行並回傳了，`name`卻沒有跟著消失呢？

原因跟以下「這個」特性有關。

我們知道在某些程式語言中，如果函式回傳了，定義在其內部的區域變數就會消失。

但在JavaScript並非如此！

> **在JavaScript中，即使在外層區塊已經回傳的狀況下，只要內層區塊還保留著一份參考，那麽外層區塊的環境不會隨著回傳而消失，我們依然可以存取外層環境中的變數。**

以這個例子來說，雖然 `makeFunc()` 回傳了，但是因為我們還保留著一份 `displayName` 的參考（存在 `func1` 變數裡），所以 JavaScript 會在記憶體中為我們繼續保留 `displayName` 所在的環境，包含 `name` 變數等，所以我們可以繼續存取 `name` 變數。

這就是 closure 的概念：一個函式和它的所處環境是密不可分的，所以只要我們還需要用到函式的一天，函式所在的環境以及所包含的變數都會繼續存在。

看完了這個例子，應該可以了解 **閉包 (closure) 可以「保留」環境** 是什麼意思。

閉包的特性還不只如此喔。

讓我們繼續看下去！

### 每次函式被呼叫時，都會創造一組新的語彙環境 (Lexical Environment)

要說明這個特性，我們從一個例子開始思考：

首先，定義一個 `makeAdder()` 函式，接受 `x` 作為參數，回傳一個以 `y` 作為參數，並回傳 `x + y` 結果的 `add()` 函式。

```Javascript
function makeAdder(x) {
  function add(y) {
    return x + y;
  }
  return add;
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

add5(2) // ?
add10(2) // ?
```

我們分別呼叫了 `makeAdder(5)` 和 `makeAdder(10)`，並分別將結果存在 `add5` 和 `add10` 中。

因為 closure 的特性，`add5` 和 `add10` 能夠記住宣告當下的語彙環境 (Lexical Environment)，包括變數 `x`。

問題來了：

> 1. `add5(2)` = ?
> 2. `add10(2)` = ?

答案分別是 7 和 12。為什麼呢？🤔

問題的關鍵在於，對於 `add5` 和 `add10` 這兩個函數而言，`x` 的值是什麼？他們看到的是相同的 `x`？還是不同的 `x`？

答案是：對 `add5` 而言，`x` 等於 5；對 `add10` 而言，`x` 等於 10。

理由是因為這個特性：

> **每當函式被呼叫時，都會產生一組新的語彙環境 (Lexical Environment)。**

以上面的例子而言，呼叫了兩次的 `makeAdder()`，一共產生了兩組環境。

呼叫 `makeAdder(5)` 的時候，創造了一組 `x` 等於 5 的環境，並且將回傳結果指定給 `add5`。

因為 closure 的特性，函式 `add5` 能夠存取這組 `x` 等於 5 的環境，因此看到的 `x` 等於 5。

呼叫 `makeAdder(10)` 的時候，創造了另一組 `x` 等於 10 的環境，並且將回傳結果指定給 `add10`。

同理，函式 `add10` 看到的 `x` 等於 10。

總而言之，`add5` 和 `add10` 看到的 `x` 變數在記憶體中是不一樣的兩個變數。

### 小結

辛苦了！🙇

看到這裡，你應該大致了解 closure 的特性了吧！

在 JavaScript 中，closure 其實扮演很重要的角色喔！

下面我們就來看看一些 closure 的實際應用吧！

## 閉包 (Closure) 的應用

閉包 (closure) 在比較高層次的概念上，可以想成把函式和一組資料關聯起來。

這對應到物件導向程式設計 (Object-Oriented Programming) 中，物件方法可以存取物件屬性 (property) 的特性。

下面我們就來看幾個簡單的應用：

### 用閉包 (Closure) 模擬物件導向中的私有成員 (Private Member)

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

### 用閉包 (Closure) 達到資料隔離的效果

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

### 避免 for loop 中使用 callback function 的錯誤寫法

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

#### 用 IIFE 包起來執行

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

#### 用 IIFE 產生 callback function

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

#### 用 let

如果沒有硬要用closure解決這個問題的話，其實用`let`解決是最快的：

```Javascript
for (let i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i)
  }, 1000 * i)
}
```

## 補充說明：Lexical Environment (語彙環境)

上面一直提到語彙環境 (Lexical Environment) 這個詞彙，這邊稍加補充說明。

JavaScript 中，一段 code 能夠存取哪些變數，是由 code 所在的 lexical environment 決定的。

所謂 lexical enviroment 包含了：

1. 區域變數
2. 外層的 Lexical Environment 的參考（可以簡單想像成大括號外的區域）

一段 code 要存取一個變數的時候，會先在當下的 Lexical Environment 找，找不到會再往外層找，直到 global scope 為止。

這就是內層的 function 存取外層宣告的變數的原理。

<!-- TODO: 或許可加一段程式碼說明 -->

## 結語

看到這裡，希望你已經對JavaScript Closure(閉包)的概念以及實際應用有了深入了解！這篇文章的例子和說明大部分都是參考自[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)與[JavaScript.info](http://javascript.info/closure)，有興趣更深入了解Closure的朋友可以再去看看喔！

有任何問題，或是覺得寫得不清楚的地方，歡迎在下面👇👇👇留言讓我知道喔。

## Reference

[Closures - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

[Closure - javascript.info](http://javascript.info/closure)
