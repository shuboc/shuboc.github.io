---
title: "[教學] JavaScript Closure (閉包)、函式與語彙環境"
tags: ["javascript"]
redirect_from: /2018/03/04/javascript-closure-in-depth
last_modified_at: 2020/07/20
---

JavaScript 中的閉包 (Closure) 是函式以及其語彙環境 (Lexical Environment) 的組合，所有的函式都能夠記住被創造的當下的環境以及變數。這篇教學將會從 JavaScript 函式的特性開始講解，包含變數的存取規則、以及函式可以作為另一個函式的回傳值，最後帶到 closure 的特性，也就是函式能夠保留其環境。本篇還會講解 closure 的實際應用範例，包括 IIFE (Immediately Invoked Function Expression)、以及用 closure 的特性模擬物件導向中的 private member 以達到封裝的特性 (又稱為 module pattern)。

![Sea Turtle](/images/sea-turtle.jpg)

## 閉包 (Closure) 是什麼？

簡單用一句話解釋 closure 就是：**閉包 (Closure) 是一種函式，它能夠存取被宣告當下的環境中的變數。**

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)上對 closure 比較正式的定義是：

> A closure is the combination of a function and the Lexical Environment within which that function was declared.

翻譯成中文就是：closure 是一個函數和此函數被宣告時所在的語彙環境。

讓我來為大家翻譯一下，這句話的意思是：Closure 是由兩個主體構成的一個組合，分別是：

1. 函式 (function)
2. 函式被宣告時所在的語彙環境 (Lexical Environment)。

函式大家應該都很熟悉，但所謂的「語彙環境」又是什麼呢？

語彙環境簡單地說，就是函式被宣告時所在的 scope，這個 scope 裡面包含了能夠被這個函式存取到的變數。為了方便理解，你可以把語彙環境想成是**函式能夠存取到的所有變數。**

因此 closure 就是**一個函式能夠存取自己被宣告時的環境中的變數。**

前面講的東西，沒有搭配實際的程式碼或許會有點難理解，但是別擔心！下面我會用一些很簡單的程式碼範例說明 closure，之後再回頭看這段的話，應該會比較有感覺！

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

恭喜你！看到這裡，你應該能夠大致了解 closure 的特性了！

在 JavaScript 中，closure 其實有很多應用，下面我們就來看看一些 closure 應用的範例吧！

## 閉包 (Closure) 的應用

閉包 (closure) 在比較高層次的概念上，可以想成把函式和一組資料關聯起來。

這對應到物件導向程式設計 (Object-Oriented Programming) 中，物件方法可以存取物件屬性 (property) 的特性。

下面我們就來看幾個簡單的應用：

### 用閉包 (Closure) 模擬物件導向中的私有成員 (Private Member)

我們可以用 closure 的特性，模擬物件導向中的私有成員 (private member)。這個方法有時又被稱作 Module Pattern。

下面這個範例，我們創造一個 `counter` 物件，並提供三個方法存取物件內部的 `count` 變數。

```Javascript
function makeCounter() {
  let count = 0;
  function changeBy(val) {
    count += val;
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
  };
};

const counter = makeCounter();

console.log(counter.value()); // 0
counter.increment();
counter.increment();
console.log(counter.value()); // 2
counter.decrement();
console.log(counter.value()); // 1
```

因為 closure 的特性，`counter` 物件的三個方法 `increment()`、`decrement()` 和 `value()` 能夠存取同一個語彙環境 (Lexical Environment)，所以這三個方法能夠存取 `makeCounter()` 中的同一個 `count` 變數及 `changeBy()` 函式。

透過呼叫這三個方法，我們能夠改變或讀取隱藏起來的 `count` 變數。

值得注意的是，除非透過 `counter` 物件上的 `increment()`、`decrement()` 或 `value()` 方法，我們沒辦法直接存取其內部的 `count` 變數。因此這裏的 `count` 就相當於物件導向中的私有成員變數 (private member)。

不僅如此，closure 還能夠達到資料隔離的效果。

延續上個例子，這裡利用 `makeCounter()` 函式產生了兩個物件 `counter1` 和 `counter2`:

```Javascript
const counter1 = makeCount();
const counter2 = makeCount();

counter1.increment();
counter1.increment();

counter2.decrement();

counter1.value(); // 2
counter2.value(); // -1
```

因為每次呼叫 `makeCounter()` 時都會產生新的一組環境，所以 `counter1` 和 `counter2` 擁有各自的 `count` 變數，不會互相干擾，達到資料互相隔離的效果。

### 利用 IIFE (Immediately Invoked Function Expression) 產生獨立的環境

以下是一題很經典的 JavaScript closure 面試題：

> 請問以下這段 code 會印出什麼值呢？

```Javascript
for (var i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i)
  }, 1000 * i)
}
```

你可能會很直覺地覺得是每隔一秒印出一個數字，第一秒印出 `0`，第二秒印出 `1`，以此類推，最後印出 `0 1 2 3 4`。

很遺憾，這段 code 並不會如你想的運行。這段 code 實際上會印出 `5 5 5 5 5`。

為什麼呢？下面讓我來說明：

<!-- TODO: JavaScript 的 scope 到底是怎麼一回事？ hoisting 又是什麼？ -->
<!-- Scope 跟 Lexical Environment 的關係是什麼？ 可以這樣混著用嗎？ -->

首先 `var` 宣告的變數是以函式作為 scope，所以變數 `i` 可以看成是全域變數。上面那樣的寫法實際上等於：

```Javascript
var i; // A global variable!
for (i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i)
  }, 1000 * i)
}
```

這段程式碼總共會產生五個 callback 函式，因為 closure 的特性，它們都會存取到 global scope 中的同一個變數 `i`。

當跑完 for 迴圈後，`i` 等於 5。

接著每隔一秒會有一個 callback 被呼叫到。當 callback 實際被呼叫到時，才會去看 `i` 實際的值，也就是 5，所以才會印出 5 5 5 5 5。

現在我們已經知道上面的寫法有問題，那我們到底該怎麼寫才對呢？

關鍵是：我們需要讓每個 callback 都可以有各自的變數 `i`。也就是對第一個 callback 來說，變數 `i` 要等於 0；對第二個 callback 變數來說，`i` 要等於 1，以此類推。

這裏我們可以運用 closure 的特性，讓每個 callback 函數都有各自的環境。**關鍵在於我們要把 callback 用一個 function 包起來。**

下面列舉了幾種可能的解法：

#### 1. 用 IIFE (Immediately Invoked Function Expression) 把程式碼包起來執行

<!-- TODO: 解釋一下什麼是 IIFE? -->

<!-- TODO: 說明為什麼 IIFE 能夠產生新環境 -->

第一種方法是：把整段 `setTimeout()` 的程式碼包在 IIFE 中去執行。

```Javascript
for (var i = 0; i < 5; ++i) {
  (function(j) {
    setTimeout(function() {
      console.log(j)
    }, 1000 * j)
  })(i);
}
```

for 迴圈的每個 iteration 中，callback 都會被包在一個新的 IIFE 中，每個 IIFE 都是一組獨立的環境。

呼叫 IIFE 時，會將 `i` 的值複製給 `j`，因此每個 IIFE 都會保存各自的變數 `j`。

因為 closure 的關係，每個 callback 都可以存取到 IIFE 中的變數 `j`，並且不同 callback 存取到的變數 `j` 都是各自獨立的變數。

另一種方法是：用 IIFE 產生一個 callback 函數。

```Javascript
for (var i = 0; i < 5; ++i) {
  setTimeout((function(j) {
    return function() {
      console.log(j)
    }
  })(i), 1000 * i)
}
```

這裏的 IIFE 回傳了我們需要讓 `setTimeout()` 執行的 callback。

原理和前一個範例相同，都是利用 IIFE 在 for 迴圈的每個 iteration 產生一組新的環境。

#### 2. 用 let

上面是比較傳統的寫法，如果沒有硬要用 IIFE 解決這個問題的話，其實用 `let` 解決是最方便快速的：

```Javascript
for (let i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i)
  }, 1000 * i)
}
```

因為對 `let` 而言，每個 for 迴圈中的 iteration 都是一個獨立的環境，所以很自然地每個 `setTimeout()` 的 callback 看到的 `i` 是不同的 `i`。

## Lexical Environment (語彙環境)

前面一直提到語彙環境 (Lexical Environment) 這個詞彙，這邊稍加補充說明。

JavaScript 中，每段函數及區塊 (code block，也就是大括號 `{}` 圍起來的範圍) 都會對應到一個稱為 Lexical Environment (語彙環境) 的資料結構。

Lexical Environment 包含了以下兩個部分：

1. Environment Record：儲存了所有的區域變數。
2. 外層的 Lexical Environment 的參考。

<!-- 接下來會用一些例子帶大家看 Lexical Environment 是怎麼運作的。

下面這個例子在 global 的環境中簡單地宣告了一個變數 `name`。

```JavaScript
                  // [[ name: <uninitialized> ]] -> null
let name;         // [[ name: undefined       ]] -> null
name = "John";    // [[ name: "John"          ]] -> null
```

`[[ ]]` 的部分指的是 Environment Record；箭頭的部分是指向外層的 Lexical Environment。

這裏只有一個 Lexical Environment，也就是 "global" Lexical Environment。因為 Global Lexical Environment 已經是最外層了，所以其外層的 Lexical Environment 是 `null`。

當我們創造或修改一個變數時，其實就是在新增或是修改 enviromental record 的屬性。

這邊一步步解釋上面這段 code 怎麼運作。

1. 首先 script 開始執行時，Lexical Environment 被創造出來且包含了所有被宣告的變數，也就是這裏的 `name` 變數，但因為還沒宣告，所以處於一個特別的 uninitialized 狀態。
2. 我們宣告 `let name;`，此時 `name` 的值為 `undefined`。
3. 我們把一個值指定給 `name` 變數。 -->

<!-- TODO: function 如何運作 -->

一段 code 要存取一個變數的時候，會先在自己的 environment record 裡面找，找不到會再往外層的 Lexical Environment 找，直到 global Lexical Environment 為止。

**這就是內層的 function 能夠存取宣告在外層的變數的原理。**

## Reference

[Closures - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

[Closure - javascript.info](http://javascript.info/closure)
