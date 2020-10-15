---
title: "[教學] 深入淺出 JavaScript ES6 Class (類別)"
tags: ["javascript"]
last_modified_at: 2020/10/15
---

你是否還對 ES6 JavaScript class 有點陌生呢？其實 JavaScript class 一點也不難！這篇文章將會解釋 JavaScript class 的觀念以及使用方法，包含 class 和 prototype 的關係，如何用 `extends` 達到繼承 (inheritance) 效果、`constructor` 及 `super` 的寫法，以及如何使用 static method/class function (靜態方法)，一起來看看吧！

## 目錄
{: .no_toc}

- TOC
{:toc}

![Someone coding](/images/javascript-class.jpg)

## `class` 語法

如果要建構新物件，傳統的Prototype-based的寫法會需要：

1. 定義constructor
2. 在`prototype`物件上定義方法

```Javascript
function User(name) {
  this.name = name;
}

User.prototype.sayHi = function() {
  console.log(this.name);
}

let user = new User('John');
user.sayHi();
```

改用 `class` 語法改寫，我們需要在 class body 裡定義：

1. `constructor`方法
2. 其他方法

```Javascript
class User {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log(this.name);
  }
}
```

其中

```Javascript
sayHi() {
  ...
}
```

這種寫法是在 `class` 中定義「物件方法」的語法。

## `class` 只是宣告函式的一種語法

JavaScript中沒有真正的「類別」實體。

**`class` 宣告出來的本體是「函式」。**

換句話說，`class` 只是宣告函式的一種特別的語法。

`class` 背後有幾個分解動作，是JavaScript Engine幫我們完成的：

1. 把class body裡的 `constructor()` 抓出來，指定給`User`。
2. 把class body裡的其他方法指定給`User.prototype`。

也就是說，透過 `class` 語法宣告的 `User`，其實是宣告了一個函式 `User`，其`prototype`屬性上有我們定義在class body內的方法。

## `class` 的靜態方法 (Static Method)

`class` 裡面可以宣告靜態方法 (static method)。

```Javascript
class Article {
  static compare(a, b) {
    return a.date < b.date ? -1 : 1;
  }
}

articles.sort(Article.compare);
```

其效果等同於直接定義一個方法在class的屬性上：

```Javascript
class Article {}

Article.compare = function(a, b) {
  // ...
}
```

## 用 `extends` 繼承類別

類別可以用`extends`語法繼承。

例如，想要 `Rabbit` 類別繼承自 `Animal` 類別。

非常簡單，只要使用 `class Rabbit extends Animal` 語法：

```Javascript
class Animal {
  // ...
  run() {
    // Run...
  }
}

class Rabbit extends Animal {
  // ...
}

let rabbit = new Rabbit();
rabbit.run(); // From `Animal`
```

背後運作的原理是，JavaScript Engine會幫你把 `Rabbit.prototype` 的 [[Prototype]] 設為 `Animal.prototype`，

亦即 `Rabbit.prototype.__proto__ = Animal.prototype;`

## 覆寫 (Override) 母類別方法

就像其他語言一樣，繼承的類別可以覆寫母類別的方法。

但是通常我們不一定想要整個覆蓋掉母類別的方法，而是會根據既有的母類別的方法去延伸功能。

想要延伸既有的方法，可以用 `super` 關鍵字，呼叫母類別的方法。

### 用 `super` 覆寫方法

利用 `super` 關鍵字，在子類別的 `run()` 方法內呼叫母類別的 `run()` 方法：

```Javascript
class Animal {
  // ...
  run() {
    console.log('Animal run!');
  }
}

class Rabbit extends Animal {
  // ...
  run() {
    super.run(); // Animal run!
    console.log('Rabbit jump!');
  }
}
```

非常簡單吧！

另外提個小技巧：

你可以在物件方法中使用 Arrow Function + `super`。

Arrow function沒有自己的 `super`，`super` 的值是什麼，查詢的規則跟 `this`、`arguments` 一樣，都是看「宣告當時」所在scope的 `super` 值。

```Javascript
class Rabbit extends Animal {
  run() {
    setTimeout(() => super.run(), 1000); // OK
    setTimeout(function() { super.run(); }, 1000); // Error
  }
}
```

相反地，你不能用 `function() { ... }`，因為function不是一個類別方法，沒有 `super`。

### 用 `super` 覆寫 `constructor`

利用 `super` 關鍵字，在constructor內，呼叫母類別的 constructor：

```Javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Rabbit extends Animal {
  constructor(name, earLength) {
    super(name);
    this.earLength = earLength;
  }
}

let rabbit = new Rabbit('John', 5);
```

因為母類別已經有 `this.name = name;` 的邏輯了，不需要在子類別重寫一次 `this.name = name;`。

直接呼叫 `super(name);` 就可以了。

沒必要的話你也可以不寫，會自動幫妳生成預設值：

```Javascript
class Rabbit extends Animal {}

// 幫你生成預設值 constructor(...args) { super(...args); }
```

要注意的點：

1. 一定要呼叫 `super()`。
2. 呼叫 `super` 要在使用 `this.earLength = earLength;` 出現之前。

為什麼有這樣的寫法限制？

理由其實很簡單！

一般沒有繼承的情況下，在constructor裡面會先建立一個物件，然後把 `this` 指向這個物件。

相反地，有繼承的情況下，在子類別的constructor裏就不會有建立物件的動作。

為什麼呢？因為建立物件的動作只需要做一次就好了。

所以我們會預期，物件已經在母類別的constructor裏建立了，否則就會在子物件裡重複動作。

所以，我們要在子類別呼叫 `super()`，

在母類別建立好物件，確保執行到 `this.earLength = earLength;` 這一行時，`this` 不是空的。

### `super` 在「物件方法」內使用的限制

定義在「物件」上的方法，有兩種寫法（注意，是「物件」不是「類別」）：

```Javascript
let user = {
  sayHi: function() {
    alert("Hello");
  }
};

// method shorthand looks better, right?
let user = {
  sayHi() { // same as "sayHi: function()"
    alert("Hello");
  }
};
```

舊的寫法，是把方法指定給一種物件的一種「屬性」。

新的寫法，是物件上的一個「物件方法」。

雖然功能看似是一模一樣的，但是其實他們有「這個」微妙的不同！

那就是：

**不能在舊的寫法裡使用 `super`。**

下面的例子，用舊的寫法呼叫 `super` 會有錯誤：

```Javascript
let animal = {
  eat: function() {
    // ...
  }
};

let rabbit = {
  __proto__: animal,
  eat: function() { // Result in errors
    super.eat();
  }
};

rabbit.eat();  // Error calling super
```

原因在 [Home Object](http://javascript.info/class-inheritance#homeobject) 這篇有解釋。

大意是說，因為繼承機制的需要，物件方法需要知道「這個物件繼承自哪個母類別」，也就是 [[Prototype]]。

所以JavaScript的物件方法多了一個隱藏的 **[[HomeObject]]** 屬性，可以記住「這個方法屬於哪個物件」。

簡言之，**「類別方法」或「物件方法」的 [[HomeObject]] 屬性，就是物件本身。**

知道方法屬於哪個物件，才能知道物件的 [[prototype]] 是誰，`super` 才能正確被執行。

這是一個後來才加進JavaScript的新機制。

。

。

。

讓我們來看個 [[HomeObject]] 的例子！

假設有個繼承關係：`longEar` --> `rabbit` --> `animal`，

則各個方法的 [[HomeObject]] 分別如下：

```Javascript
let animal = {
  name: "Animal",
  eat() {
    console.log(`${ this.name } eats!`); // [[HomeObject]] === animal
  }
};

let rabbit = {
  __proto__: animal,
  name: 'Rabbit',
  eat() {
    super.eat(); // [[HomeObject]] === rabbit
  }
};

let longEar = {
  __proto__: rabbit,
  name: 'Long Ear',
  eat() {
    super.eat(); // [[HomeObject]] === longEar
  }
};
```

。

。

。

說了這麼多 [[HomeObject]]，

到底跟兩種語法的不同有什麼關係？

簡單地說，為了和普通函式有所區別，**物件方法必須用 `foo() { ... }` 語法，**

這個函式才會被認為是一個「物件方法」，會多一個特別的隱藏屬性 **[[HomeObject]]**，這樣`super`才能正確執行。

所以改成這樣，就沒問題了：

```Javascript
let animal = {
  eat: function() {
    // ...
  }
};

let rabbit = {
  __proto__: animal,
  eat() { // OK
    super.eat();
  }
};

rabbit.eat();  // OK
```

除了這個差別之外，兩種寫法是等義的。

這樣看來，直接全部改用shorthand寫法替代舊的寫法，應該沒有什麼特別的壞處。

結論是：

**`super` 關鍵字，只能在「物件方法」中使用。**

**`foo() { ... }` 可以用 `super`， `foo: function() { ... }` 不能用 `super`。**

。

。

。

另外，**「類別」 內的「類別方法」寫法就是 `foo() { ... }`**，

所以不會遇到「物件」內寫法的問題。

。

。

。

<del>以下純閒聊，與主題無關，趕時間可跳過🤪</del>

除非用較新的寫法搭配babel。

例如 `handleClick = () => { ... }` 這種 Arrow Functions in Class Properties 的寫法，非常有用，可以用來代替正規 `handleClick() { ... }` 加上constructor內呼叫 `this.handleClick = this.handleClick.bind(this);`的寫法。

不過也有人提出看法，[不鼓勵 Arrow Functions in Class Properties 的用法](https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1)。在獲得語言完全採納某個feature之前，提前採用babel轉譯出的結果可能和想像有落差，小心踩坑！

題外話，我也好奇babel針對 `super` 的case，會做什麼特別的處理？

畢竟對babel來說，物件上的方法 `foo() { ... }` 和 `foo: function() { ... }` 兩種寫法並沒有差別，都會被轉換成一樣的舊寫法。

把範例丟進[babel](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DYUwLgBAhgdglgWysCBeCBvAUBCIpgBcEAZgK4wDGYcA9jABQCUmEA9GxAM4AWtZwACYQARiAhge43rQBOkLgE8YYKAA9i-MM0wA6fQF8cudp327jRgwG4sWUJFlQRIuJHTZcAfS8AHWbRgtD7EsIjIADTGWsTkVDT0Op4mXGS-ILK6Wsy2uFa2WE4ublkEOUA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.3.4)，會跳出錯誤：

> super is only allowed in object methods and classes

看來遇到`super`語法的時候，babel會檢查是否有正確使用object method的寫法，然後才作對應的transpilation，符合新spec的設計。

## 繼承靜態方法 (Static Method)

繼承類別的時候，會連靜態方法也一起繼承！

```Javascript
class Animal {
  static compare(a, b) { // ... }
}

class Rabbit extends Animal {}

let rabbits = [
  new Rabbit('John'),
  new Rabbit('Kevin')
];
rabbits.sort(Rabbit.compare); // calls Animal.compare
```

這是透過 `Rabbit.__proto__ === Animal` 達成的。

## 兩種 `extends` 幫你自動建立的 [[prototype]] 關聯

**以下重點！！！**

使用 `extends` 語法，會自動建立下列兩種 prototype 的繼承關係：

* `Rabbit.proto.__proto__ === Animal.proto`
* `Rabbit.__proto__ === Animal`

第一個是為了達成一般方法的繼承，第二個是為了達成靜態方法的繼承。

## Reference

http://javascript.info/class

http://javascript.info/class-inheritance

http://javascript.info/object-methods#method-shorthand
