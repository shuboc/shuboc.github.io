# Prototype筆記

## [[Prototype]] / `__proto__`

通常用 [[Prototype]] 的記述法來表示物件的原型。

可以用物件的 `__proto__` 屬性，或是 `Object.getPrototypeOf()` / `Object.setPrototypeOf()` 存取。

(`__proto__` === [[Prototype]])

```Javascript
let animal = {
  eats: true
};

let rabbit = {
  jumps: true
};

rabbit.__proto__ = animal;
rabbit.eats // true
```

## `F.prototype`

函式的`prototype`屬性很重要。

使用`new F()`的方式創造物件的話，他們的 [[Prototype]] 會等於 `F.prototype`。

函式被宣告的時候，其`prototype`屬性就會等於一個預設的物件，天生帶有`constructor`屬性，指向函式本身：

```Javascript
F.prototype // { constructor: F }
```

## Prototype如何實現繼承?

```Javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  // Eat...
}

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype.jump = function() {
  // Jump...
}

// ***** Setup the inheritance chain
Rabbit.prototype.__proto__ = Animal.prototype;

let rabbit = new Rabbit("White Rabbit");
rabbit.eat();
rabbit.jump();
```

或是

```
// ***** Setup the inheritance chain
Rabbit.prototype = Object.create(Animal.prototype);

Rabbit.prototype.jump = function() {
  // Jump...
}

// ???
Rabbit.prototype.constructor = Rabbit;
```
