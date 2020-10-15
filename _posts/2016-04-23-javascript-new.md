---
layout: post
title: "[教學] JavaScript new、Function Constructor (建構函式) 及 Object.create()"
tags: [javascript]
redirect_from: /javascript-create-object
last_modified_at: 2020/10/15
---

這篇教學將介紹 JavaScript 中兩種建立物件的方法：使用 JavaScript new 及 Function Constructor (建構函式) 以及 ES5 `Object.create()`。

## 目錄
{: .no_toc}

- TOC
{:toc}

## JavaScript new 和 Function Constructor (建構函式)

在 JavaScript 中，使用 `new` 是最常見的建立新物件的方法之一。那麼要如何使用 `new` 呢？

首先我們需要定義一個 function constructor (建構函式)。簡單來說，function constructor 是一個用來創造新物件的函式，通常會和 `new` 一起搭配使用。

要如何定義建構式呢？舉個例子，如果要建構`Cat`物件，並且每個物件都有各自的`name`特性(property)，那我們可以定義`Cat`建構式如下：

~~~jsx
// Constructor
function Cat(name) {
	this.name = name;
}
~~~

那我們要如何定義物件的方法呢？答案是將方法定義在`prototype`屬性裡。例如：

~~~jsx
// Define 'speak' method for Cat objects
Cat.prototype.speak = function() {
	console.log(this.name + ": meow!");
};
~~~

定義完建構式和方法後，我們用`new`運算子呼叫建構式：

~~~jsx
var kitty = new Cat("Kitty");
kitty.speak(); // Kitty: meow!
~~~

這樣就創造出了一個`kitty`物件，可以呼叫我們定義的`speak`方法！

簡單總結一下，建構式有幾個必要的步驟：

1. 定義建構式
2. 將方法定義在建構式的`prototype`特性裡
3. 用`new`運算子呼叫建構式

### new 運算子和 Function Constructor (建構函式) 的運作原理

要了解其運作原理，首先我們要了解何謂 prototypal inheritance (原型繼承)。

所謂的 prototypal inheritance 用一句話形容就是：JavaScript 每個物件都有個 prototype，物件能夠繼承 prototype 上的屬性或方法；如果物件上找不到某個屬性或方法時，就會去查詢它的 prototype 是否存在這個屬性或方法。

這個機制使我們可以在prototype物件上定義特性或方法，所有繼承同一個prototype的物件都可以透過原型委託使用這些特性或方法。

想知道 prototype 更詳細的原理可以看這篇喔。

> 延伸閱讀：[JavaScript Prototype](/javascript-prototype)

接著我們來瞭解`new`運算子的機制。

當我們呼叫`new Cat("Kitty")`的時候，JS在背後做了幾件事:

1. 建立新物件，
2. 新物件的繼承自建構式的`prototype`特性，也就是`Cat.prototype`。
3. 將新物件綁定到建構式的`this`物件，並呼叫建構式。
4. (在不特別寫明`return`值的情況下) 回傳剛創造的新物件。

第2步將新物件的原型設為 `Cat.prototype`。所以對新物件呼叫`speak()`方法時，會先在物件本身尋找此方法。然後會發現自己身上找不到此方法，於是再到自己的prototype，也就是 `Cat.prototype` 上尋找。因為我們定義了 `Cat.prototype.speak`，所以可以順利找到此方法。

簡單地說，當你使用建構式來創造新物件，新物件的原型就是建構式上的`prototype`特性。而在原型上定義方法，就等於所有物件都可以透過原型委託的方式使用原型上的方法。

### 使用 new 與 Contructor Function 容易犯的錯誤

建構式必須和`new`運算子搭配使用，但萬一我們忘了，直接呼叫建構式：

~~~jsx
var kitty = Cat("kitty");
~~~

此時並不會有任何錯誤或警告，`this`會直接bind到全域變數，有可能會導致很難察覺的bug!

## 用`Object.create()`創造新物件

ES5中提供了`Object.create()`的方法，用來創造新物件。使用方法：

> Object.create(proto[, propertiesObject])

這個 function 會回傳一個新物件，其 prototype 等於第一個被傳入的參數。

例如，我們想要創造很多貓物件，所以我們先創造一個物件 `cat` 來當作 prototype，裡面定義了`speak()`方法：

~~~jsx
var cat = {
	speak: function() {
		console.log(this.name + ": meow!");
	}
};
~~~

當我們呼叫`Object.create(cat)`時，回傳的新物件的 prototype 就是 `cat`。

~~~jsx
// Create a new cat
var kitty = Object.create(cat);
kitty.name = "Kitty";
kitty.speak(); // Kitty: meow!
~~~

`kitty`物件裡找不到`speak()`方法，於是接下來到他的原型物件(也就是`cat`物件)上面尋找。`cat`物件裡定義了`speak()`方法，於是呼叫成功。

#### Object.create() 的原理

被傳進作為參數的物件，將會被當成新物件的原型物件。所以`Object.create()`的內部可能會長得像這樣（示意）：

~~~jsx
if (!Object.create) {
	Object.create = function(o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}
~~~

其中`F()`是建構式，建構式上的`prototype`特性設為`o`，並且由`new`運算子呼叫建構式。所以新物件的特性查找將會委託給`o`。

使用`Object.create()`的好處是，省去了可能會忘記用 `new` 呼叫建構式的風險。

## 結論

JS中可以用建構式，或者是ES5的 `Object.create()` 來創造新物件。

使用建構式創造的新物件，將繼承自建構式上的 `prototype` 屬性。

使用`Object.create(obj)`創造的新物件，將繼承自`obj`。

## 參考資料

* [new operator - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
* [Object.create() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
* [Object Creation - Programming JavaScript Application](http://chimera.labs.oreilly.com/books/1234000000262/ch03.html#object_creation)
