---
layout: post
title: Prototypal Inheritance and Object Creation in JS
---

JS最大的特色之一就是原型繼承(prototypal inheritance)。JS的每個物件都繼承自一個原型委託(delegate prototype)物件。如果對物件查詢某個特性失敗時，就會去查詢他的原型物件上是否存在這個特性。

這個機制使我們可以在prototype物件上定義特性或方法，所有繼承同一個prototype的物件都可以透過原型委託使用這些特性或方法。

知道了這個特性之後，在JS中創造物件時，到底該如何理解和運用原型的概念呢？

## 用建構式(constructor)創造物件

簡單地說，建構式就是一個用來創造新物件的函式。

那要如何使用建構式呢？舉個例子，如果要建構`Cat`物件，並且每個物件都有各自的`name`特性(property)，那我們可以定義`Cat`建構式如下：

~~~jsx
// Constructor
function Cat(name) {
	this.name = name;
}
~~~

那要如何定義物件的方法呢？ＪＳ的每個函式都內建`prototype`特性，我們只需要將方法定義在`prototype`特性裡，如下：

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

### 建構式是如何運作的？

為什麼完成這些步驟，新物件就能夠呼叫我們定義的方法呢？更進一步，物件是如何使用JS的原型機制呢？要回答這個問題，首先我們需要瞭解`new`運算子的機制。

當我們呼叫`new Cat("Kitty")`的時候，JS在背後做了幾件事:

1. 建立新物件，
2. 新物件的繼承自建構式的`prototype`特性，也就是`Cat.prototype`。
3. 將新物件綁定到建構式的`this`物件，並呼叫建構式。
4. (在不特別寫明`return`值的情況下) 回傳剛創造的新物件。

第２步將新物件的原型設為`Cat.prototype`。所以對新物件呼叫`speak()`方法時，會先在本身尋找此方法。然後會發現自己身上找不到此方法，於是再到自己的prototype(也就是`Cat.prototype`)上尋找。因為我們定義了`Cat.prototype.speak`，所以可以順利找到此方法。

簡單地說，當你使用建構式來創造新物件，新物件的原型就是建構式上的`prototype`特性。而在原型上定義方法，就等於所有物件都可以透過原型委託的方式使用原型上的方法。

### 使用建構式的優缺點

建構式長得很像C++或Java之類的class，可能對慣用其他語言的人比較容易理解JS的物件，但經過上面的說明，我們可以知道建構式跟class簡直是天差地遠呀。

除此之外，建構式必須和`new`運算子搭配使用，但萬一我們忘了，直接呼叫建構式：

~~~jsx
var kitty = Cat("kitty");
~~~

此時並不會有任何錯誤或警告，`this`會直接bind到全域變數，有可能會導致很難察覺的bug!

## 用`Object.create()`創造新物件

ES5中提供了`Object.create()`的方法，用來創造新物件。使用方法：

> Object.create(proto[, propertiesObject])

傳入作為參數的`proto`物件，將會被當作回傳新物件的prototype。舉例而言，我們可以創造一個物件`cat`。裡面定義了`speak()`方法：

~~~jsx
var cat = {
	speak: function() {
		console.log(this.name + ": meow!");
	}
};
~~~

當我們呼叫`Object.create(cat)`時，回傳的新物件將會繼承自`cat`。

~~~jsx
// Create a new cat
var kitty = Object.create(cat);
kitty.name = "Kitty";
kitty.speak(); // Kitty: meow!
~~~

`kitty`物件裡找不到`speak()`方法，於是接下來到他的原型物件(也就是`cat`物件)上面尋找。`cat`物件裡定義了`speak()`方法，於是呼叫成功。

#### `Object.create()`是如何運作的？

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

####使用`Object.create()`的優缺點

`Object.create()`似乎更簡單一些，而且還省去了可能會忘記用`new`呼叫建構式的風險。但是會有瀏覽器相容性的問題。

## 結論

JS中可以用建構式，或者是ES5的`Object.create()`來創造新物件。

使用建構式創造的新物件，將繼承自建構式上的`prototype`特性。

使用`Object.create(obj)`創造的新物件，將繼承自`obj`。

這篇沒有講到該如何在這兩種模式底下利用closure做到private data member的效果，還有另一種常見於JS的mixin模式，希望之後有動力研究ＸＤ

## 參考資料

* [new operator - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
* [Object.create() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
* [Object Creation - Programming JavaScript Application](http://chimera.labs.oreilly.com/books/1234000000262/ch03.html#object_creation)
