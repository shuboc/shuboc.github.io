# JavaScript的物件導向

## 原型繼承 (Prototypal Inheritance)

JS最大的特色之一就是原型繼承。JS的每個物件建立時，都繼承自一個原型物件。如果對物件查詢特性或方法失敗時，就會到他的原型物件去查詢。所以我們可以說在JS中，

### TODO: an example

## JavaScript中的類別

JS本身並沒有類別，但是可以用一些方法讓他看起來很"類別"。

### 定義類別

在JS中可以用類似C++或Java等物件導向的方式來定義類別和創造新物件。舉個例子：

~~~js
// Constructor
function Cat(name) {
	this.name = name;
}

// Prototype
Cat.prototype.speak = function() {
	console.log(this.name + ": meow!");
};
~~~

首先，創造物件時需要一個函式，稱為建構式 (constructor)，用來定義新物件的屬性。建構式和`new`運算子搭配使用，就能創造新物件。

然後，我們需要定義原形物件，把所有物件共用的函式定義在原形物件裡。建構式既是函式同時也是物件，可以擁有自己的特性。函式物件被創造時，JS會自動幫他產生一個`.prototype`特性。

當一個函式和`new`運算子搭配使用時，會產生新物件，而函式的`.prototype`特性會被當成新物件繼承的原型。

### 用`new`運算子創造新物件

定義完類別，我們可以用`new`運算子創造新物件：

~~~js
// Create an object
var kitty = new Cat("Kitty");
kitty.speak(); // Kitty: meow!
~~~

`new`運算子在這裡做了幾件事:

1. 建立新物件，其原型繼承自建構式本身的`.prototype`屬性。(`Cat.prototype`)。
2. 將`this`綁定到創造出的新物件，並呼叫`Cat`建構式。
3. (預設在不特別寫明`return`敘述的情況下) 回傳剛創造的新物件。

### JS的類別如何運作

~~~js
kitty.speak(); // Kitty: meow!
~~~

`kitty`物件本身並沒有`.speak()`方法，但繼承自`Cat.prototype`物件。當呼叫`.speak()`時，會先在`kitty`物件上尋找此特性，找不到再到`Cat.prototype`上尋找。最後在`Cat.prototype`裡面找到了`.speak()`。

### 缺點

## `Object.create()`

## Factory Function

## 