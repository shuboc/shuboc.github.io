---
title: "[教學] JavaScript Prototype (原型) 是什麼？"
tags: [javascript]
last_modified_at: 2021/12/31
---

在 JavaScript 中，每個物件都有一個 prototype (原型)，物件可以從原型上繼承屬性和方法，達到復用程式碼的效果，這就是所謂的 prototypal inheritance (原型繼承)。除此之外，原型也能繼承其他物件，因此物件可以繼承一層又一層的屬性和方法，這形成了所謂的 prototype chain (原型鏈)。本篇文章將介紹 prototype、prototype chain，以及 prototypal inheritance 與 class inheritance (類別繼承) 的差異。

## 目錄
{: .no_toc}

- TOC
{:toc}

![Prototype](/images/javascript-prototype.jpg)

Photo by Hal Gatewood on Unsplash

## JavaScript Prototype 原型

JavaScript 中的每個物件都有一個隱藏的屬性 [[Prototype]]，我們稱它為 prototype (原型)。Prototype 只能是一個物件或是 `null`。我們有一個非標準的方法可以存取 prototype：`__proto__`。

例如，我們可以用 `__proto__` 將 `dog` 物件的 prototype 指定為 `animal` 物件：

```js
const animal = {};
const dog = {};

dog.__proto__ = animal;
```

將 A 物件的 prototype 設定為 B 物件，就是 A **繼承 (inherit)** 了 B。

繼承關係還可以更長，例如我們可以再創造一個物件繼承 `dog`:

```js
const goofy = {
  __proto__: dog
};
```

那麼設定完物件的 prototype 以後可以幹嘛呢？

接下來要介紹 prototypal inheritance (原型繼承) 的特性了，讓我們一起往下看！

## Prototypal Inheritance 原型繼承

Prototype 的功能是：當我們在一個物件查詢某個屬性或方法，找不到的時候，我們會到它的 prototype 裡去查詢。換句話說：

> JavaScript 的物件能夠「繼承」其 prototype 的屬性或方法。

例如，我們在 `dog` 物件裡找不到 `isAnimal` 屬性，於是我們到它的 prototype，也就是 `animal` 物件裡查詢 `isAnimal` 屬性，結果找到了：

```js
const animal = {
  isAnimal: true
};

const dog = {
  __proto__: animal
};

console.log(dog.isAnimal) // true
```

同樣的原理也適用於 object method (物件方法)，例如我們可以在 `animal` 物件上定義 `eat()` 方法，並且呼叫 `dog.eat()`：

```js
const animal = {
  eat() {
    console.log('Eat!');
  }
};

const dog = {
  __proto__: animal
};

dog.eat(); // Eat!
```

## Prototypal Inheritance 原型繼承 vs. Class Inheritance 類別繼承

當一個物件繼承自另一個 prototype 物件，它就可以「繼承」 prototype 物件上的屬性和方法。這就是所謂的 prototypal inheritance，原型繼承。

那麼使用 prototypal inheritance 原型繼承有什麼好處呢？簡單地說，「繼承」是一種代碼復用的手段。大部分的程式語言可以透過 Class (類別) 繼承達到這個效果，例如：假設我們有 `Dog` 和 `Cat` 兩種物件，都是動物但又各自有些不同的地方，那麼我們可以定義一個 `Animal` class 實作了所有動物的共通點，再定義 `Dog`、`Cat` 類別在 `Animal` 的基礎上各自增加特性。

而 JavaScript 中，我們可以透過 prototype 達成同樣的效果。和 class 繼承最大的差別在於：JavaScript 中物件是繼承自 prototype，而 prototype 本身也是一個物件。繼承自 prototype 就好比你在創造物件時有一個可以效仿的實體，而 class 則像是一張參考的藍圖。

> 延伸閱讀：[[教學] 深入淺出 JavaScript ES6 Class (類別)](/javascript-class)

## Constructor Function (建構函式) 的 Prototype

我們知道 JavaScript 可以用 `new` 運算子加上 constructor function (建構函式) 建立新物件：

```js
function Animal(name) {
  this.name = name;
}

const dog = new Animal('Barley');
```

如果想知道用 `new` 建立新物件的詳細原理，可以看一下這篇：

> 延伸閱讀：[[教學] JavaScript new、Function Constructor (建構函式) 及 Object.create()](/javascript-new)

然而只有屬性的物件並不是太有用，我們希望建立出來的新物件有一些方法 (method) 可以呼叫。那我們該如何幫新物件增加方法呢？這時候 prototype 就可以派上用場了。

直接說結論：我們得將方法定義在 constructor function 的 `prototype` 屬性上。例如，我們希望建立的新物件有 `eat()` 方法，那我們就得定義 `Animal.prototype.eat`：

```js
Animal.prototype.eat = function() {
  console.log('Eat!');
}

const dog = new Animal('Barley');
dog.eat(); // Eat!
```

如果你只想知道怎麼定義一個有方法的物件，那看到這邊就可以了。

但是如果你想知道這個寫法的原理是什麼的話，我們就來一起往下看吧！

## F.prototype

在 JavaScript 中，constructor 的 `prototype` 屬性是一個特殊的屬性，當我們把一個 function (這裏假設是 `F`) 當成 constructor 使用時，`F.prototype` 會多一個特殊的用途，讓 JavaScript engine 知道：

> 當我建立新物件的時候，新物件的 prototype 要等於 `F.prototype`。

舉上面的例子來說，`dog` 物件的 prototype 是 `F.prototype`；換句話說，`dog` 繼承自 `F.prototype`。

我們可以測試 `dog.__proto__` 屬性來印證：

```js
const dog = new Animal('Barley');
dog.__proto__ === Animal.prototype; // true
```

簡單地說，因為建立的新物件會繼承 `F.prototype`，所以我們在 `F.prototype` 上定義的方法或屬性，也可以被建立的新物件存取。

這就是為什麼我們要將方法定義在 `F.prototype` 上。

## F.prototype 的預設值

`F.prototype` 如果沒有特別指定，預設值會是一個物件，帶有 `constructor` 屬性，指向 constructor 本身：

```js
function Animal() {}

console.log(Animal.prototype); // { constructor: Animal }
console.log(Animal.prototype.constructor === Animal) // true
```

## F.prototype.constructor 屬性

`F.prototype` 預設會擁有 `constructor` 屬性。我們可以透過 `constructor` 屬性得知一個物件如何被創造出來的。甚至還可以用來創造新物件！

```js
const dog = new Animal('Barley');
const cat = new dog.constructor('Chris');
```

## 如何利用 Prototypal Inheritance (原型繼承) 模擬 class inheritance

為了達到程式碼復用，我們可能會想讓 `Dog` 可以繼承 `Animal` 上的屬性和方法。常見的物件導向語言可以讓 child class (子類別) 繼承 parent class (父類別)，也就是類似 `class Dog extends Animal` 之類的方式。那使用 prototype 的 JavaScript 該如何達到類似的效果呢？

首先我們要定義 `Dog` constructor。這裏假設 `Dog` 額外帶有一個 `breed` 屬性，用來表示狗的品種。我們需要在 `Dog` constructor 中呼叫 `Animal` constructor：

```js
function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}
```

`Animal.call(this, name)` 是為了執行 `Animal` constructor 內所有的初始化動作，包含讓建立的新物件帶有 `Animal` 建立物件的屬性 (這裡指的是 `name`)。透過 `Animal.call(this, name)` 我們不用把重複的代碼全部貼到 `Dog`，達到程式碼復用的效果。

現在有另外一個問題：我們沒辦法存取 `Animal` 定義的方法：

```js
const dog = new Dog('Barley', 'Golden Retriever');
dog.eat(); // Uncaught TypeError: dog.eat is not a function
```

為什麼呢？答案在於 `Dog.prototype` 在沒有特別指定的情況下是預設的 prototype，上面查詢不到任何 `Animal` 的方法。怎麼辦呢？解法很簡單，我們只要讓 `Dog.prototype` 繼承 `Animal.prototype` 就行了：

```js
Dog.prototype = Object.create(Animal.prototype);
```

如果不熟悉 `Object.create()` 的讀者，可以看一下這篇唷。

> 延伸閱讀：[[教學] JavaScript new、Function Constructor (建構函式) 及 Object.create()](/javascript-new)

這個做法還會衍生一個問題，就是 `Dog.prototype.constructor` 的值會變成 `Animal`，因為 `Dog.prototype` 繼承 `Animal.prototype`，而 `Animal.prototype.constructor === Animal`。

解法是我們要幫 `Dog.prototype` 手動加上 `constructor` 屬性：

```js
Object.defineProperty(Dog.prototype, 'constructor', {
  value: Dog,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});
```

大功告成！當然你也可以不用那麼費工，直接用 ES6 Class，可以省去一堆冗長的語法。

如果想看 JavaScript Class 的教學，可以看這篇：

> 延伸閱讀：[[教學] JavaScript ES6 Class](/javascript-class)

## Reference

* [Prototypal Inheritance](https://javascript.info/prototype-inheritance)
* [F.prototype](https://javascript.info/function-prototype)
* [Inheritance in JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance)