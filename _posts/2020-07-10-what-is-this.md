---
title: "[教學] JavaScript 中的 this 是什麼？"
tags: ["javascript"]
last_modified_at: 2020/10/15
---

在 JavaScript 中，「this 是什麼」絕對是讓人頭痛難題前三名。This 和物件方法息息相關，因此這篇文章會先介紹在物件方法、物件方法中的 this 是如何被決定的，把握一個簡單原則就可以知道 this 到底是誰。另外，arrow function 的 this 也很常令人搞混，這篇文章也會一併介紹 arrow function 中的 this。

## 目錄
{: .no_toc}

- TOC
{:toc}

![this](/images/this.jpg)

<span>Photo by <a href="https://unsplash.com/@srz?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">sydney Rae</a> on <a href="https://unsplash.com/s/photos/this?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

## 物件方法 (Object Method)

物件通常對應到真實世界的事物，例如用戶、訂單、商品等。物件通常也會有自己的「動作」，可能是由一連串的資料操作、網路請求等構成的有意義的行為，例如用戶的登入登出、訂單結帳取消、商品加入購物車等。

這些「動作」在 JavaScript 中，可以用物件方法 (object method) 來實作。

所謂的物件方法，就是物件可以呼叫的方法。

比方說，我們定義一個使用者的物件 `user`：

```JavaScript
const user = {
  name: 'Shubo',
};
```

我們可以幫 `user` 物件新增一個 `speak()` 的物件方法：

```JavaScript
user.speak = function() {
  console.log('Hello world!');
}
```

這樣 `user` 物件就可以呼叫這個 `speak()` 方法：

```JavaScript
user.speak(); // Hello world!
```

JavaScript 中，還有很多種寫法，可以定義物件方法。

例如，我們可以直接把現成的函式指定給物件：

```JavaScript
function speak() {
  console.log('Hello world!');
}

user.speak = speak;
user.speak(); // Hello world!
```

也可以在創造物件時直接定義物件方法：

```JavaScript
const user = {
  name: 'Shubo',
  speak: function() {
    console.log('Hello world!');
  }
}

user.speak();
```

更簡短的寫法，在創造物件的時候，可以用省略 `function` 關鍵字的方式，來定義物件方法：

```JavaScript
const user = {
  name: 'Shubo',
  speak() {
    console.log('Hello world!');
  }
}

user.speak();
```

## 什麼是 this？

如果我們在物件方法中，要存取物件本身的資料或屬性該怎麼辦呢？

比方說，我們希望使用者呼叫 speak() 方法的時候，可以順便介紹使用者自己的名字。

這個時候 `this` 就派上用場啦！

在物件方法中，要存取物件本身，我們可以用關鍵字 `this`。

`this` 的值就是方法的呼叫者，也就是呼叫方法的物件。

舉個例子：

```JavaScript
const user = {
  name: 'Shubo',
  speak() {
    console.log('Hello world! My name is ' + this.name); // (1)
  }
};

user.speak(); // (2) Hello world! My name is Shubo
```

上面的例子我們可以看到：(1) 我們在物件的 `speak()` 方法中用到了 `this.name`，接著 (2) 我們去呼叫 `user.speak()`。

這裏的 `this` 是 `user` 物件。為什麼呢？

因為「呼叫 `speak()` 方法的物件」是 `user` 物件，所以 `speak()` 方法中的 `this` 就等於 `user` 物件。

## This 的值是動態決定的

這裡有個重要的觀念：函式中的 `this` 並不是一個固定不變的值。

**`this` 的值，是在被呼叫的當下才會決定的。`this` 就是呼叫這個方法的物件。**

單就字面或許有點難以理解，這裏我們看一個實例方便說明。

首先我定義一個 `speak()` 函式：

```JavaScript
function speak() {
  console.log('Hello world! My name is ' + this.name);
}
```

然後我把這個函式，指定成兩個不同物件的方法：

```JavaScript
const john = {
  name: 'John',
};

const chris = {
  name: 'Chris',
};

john.speak = speak;
chris.speak = speak;
```

接著我們讓兩個物件分別呼叫 speak()：

```JavaScript
john.speak();
chris.speak();
```

問題來了：

這兩個物件的 speak 方法是同一個方法，那這個方法中的 `this` 的值會是 `john` 物件還是 `chris` 物件呢？還是 `undefined`？

這邊各位可以思考一下會印出什麼結果。

答案是：

```JavaScript
john.speak(); // Hello world! My name is John
chris.speak(); // Hello world! My name is Chris
```

第一行的 `this` 是 `john` 物件，第二行的 `this` 是 `chris` 物件。

理由是：函式中的 `this` 的值是被呼叫的當下，呼叫函式的物件；

第一行呼叫 speak() 的物件是 `john`，第二行呼叫 `speak()` 的物件是 `chris`，所以 `this` 分別是 `john` 和 `chris`，而 `this.name` 分別是 `"John"` 和 `"Chris"`。

## 沒有物件的時候，this 會是什麼？

經過前面的說明，我們了解到，將函式作為一個物件方法去呼叫時，`this` 就是物件本身。

但是其實我們也可以在沒有物件的情境下，直接呼叫含有 `this` 的函式，這是完全合法的！

舉例來說，我們定義了一個 speak() 函式，其中有用到 `this`：

```JavaScript
function speak() {
  console.log('Hello world! My name is ' + this.name);
}
```

我們可以在沒有任何物件的情況下直接呼叫它：

```JavaScript
speak();
```

這種情況下，因為並沒有一個物件去呼叫這個方法，所以 `this` 的值會是 `window`，或是 strict mode 底下的 `undefined`。

> 註：在瀏覽器中可以用 `"use strict";` 的語法開啟 strict mode，可以讓一些不良的寫法拋出錯誤。詳情請參見 [Strict Mode - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Strict_mode) 的說明。

## Arrow function (箭頭函式) 的 this

Arrow function (箭頭函式) 是一種特別的函式，它沒有自己的 `this`；它的 `this` 會等於被宣告當下所在環境的 `this`。

我們舉一個例子說明比較容易理解。

下面這邊我替 `user` 物件定義了一個物件方法 `speak()`，裡面又定義了一個箭頭函式 `arrow()`。

我會在呼叫 `speak()` 的時候去呼叫 `arrow()` 方法：

```JavaScript
const user = {
  name: 'Shubo',
  speak() {
    const arrow = () => {
      console.log('Hello world, my name is' + this.name);
    }
    arrow();
  }
}

user.speak();
```

值得注意的是，`arrow()` 會使用到 `this.name`。那問題來了，對 `arrow()` 而言，他的 `this` 的值是什麼？

要回答這個問題，首先必須釐清 `arrow()` 所在的「環境」。

我們可以看到，因為 `arrow()` 箭頭函式在 `speak()` 方法內被宣告，所以 `arrow()` 的「環境」就是 `speak()`。

因此 `arrow()` 的 `this` 就是 `speak()` 的 `this`，也就是 `user` 物件。

這裡再提供一個例子供大家思考：

```JavaScript
const arrow = () => {
  console.log('Hello world, my name is ' + this.name);
};
arrow(); // (1)

const user = {
  name: 'Shubo',
  arrow: () => {
    console.log('Hello world, my name is ' + this.name);
  },
  speak() {
    arrow();
  },
};

user.arrow(); // (2)
user.speak(); // (3)
```

請問 (1), (2) 和 (3) 分別會有什麼結果呢？

答案是 `Hello world, my name is `。

原因是 arrow 被宣告的當下，他的環境是 global context。也就是說 `this` 等於 `window`，或是 strict mode 底下的 `undefined`。

## 所以，我該如何判斷 this 的值？

我們可以簡單歸納出決定 `this` 的規則：

**`this` 就是呼叫方法時，「點」前面的那個物件。**

而箭頭函式沒有自己的 `this`，他的 `this` 由外層的環境決定。

希望看到這裡，你已經了解 JavaScript 的 `this` 是怎麼運作的！

## Reference

* [this - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
* [Object methods, "this" - javascript.info](https://javascript.info/object-methods)