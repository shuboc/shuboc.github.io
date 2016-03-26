# JavaScript



## 原型繼承

JS最大的特色之一就是原型繼承(prototypal inheritance)。JS的每個物件建立時，都隱含繼承自一個原型物件(prototype)。如果對物件查詢屬性或呼叫方法失敗時，就會到他的原型物件去查詢。

-

以下是如何創建新物件的範例：

### 用類似Class的方式創造物件

在JS中可以用類似C++或Java等物件導向的方式來創造新物件。舉個例子：

~~~js
function Cat(name) {
	this.name = name;
}

Cat.prototype.speak = function() {
	console.log(this.name + ": meow!");
};

var kitty = new Cat("Kitty");
kitty.speak(); // Kitty: meow!
~~~

為了創造物件，我們需要一個函式，稱為建構式(constructor)，例如此例的`Cat`函式。
以定義新物件的屬性(例如`.name`屬性)。

建構式包含了一個`.prototype`屬性，是用來和`new`運算子搭配使用時，當作新物件的原型。
通常新物件會繼承某個原型物件，所以在原型物件上定義方法，就等於是讓所有物件都能使用同一個方法。
所以我們會在Cat.pro



`new Cat("Kitty")`在這裡做了幾件事:

1. 建立新物件，其原型繼承自`Cat.prototype`(也就是建構式本身的`.prototype`屬性)。
2. 用創造出的新物件綁定到`this`物件，呼叫`Cat`建構式。(以這個例子而言，將`name`參數指定給新物件的`.name`屬性。)
3. (在不特別寫明`return`值的情況下) 回傳剛創造的新物件。

`kitty`物件本身並沒有`.speak()`方法，但繼承自`Cat.prototype`物件。所以呼叫`.speak()`方法時，會先在`kitty`物件上尋找此方法，找不到再到`Cat.prototype`上尋找。因為我們在`Cat.prototype`裡面定義了`.speak()`方法。

## 如何創建新物件

## Factory Function

## 