# Prototypal Inheritance in JavaScript

## Classical Inheritance vs Prototypal Inheritance

* In class inheritance, instances inherit from a blueprint (the class), and create sub-class relationships.

* In prototypal inheritance, instances inherit from other instances.
	* Using **delegate prototypes** (setting the prototype of one instance to refer to an examplar object), it’s literally **Objects Linking to Other Objects**, or **OLOO**, as Kyle Simpson calls it. (e.g., `Object.create()`)
	* Using **concatenative inheritance**, you just copy properties from an exemplar object to a new instance. (e.g., `Object.assign()`)

## Do Not Use `new` Keyword

Here is an example on how to create objects with `new` operator and a constructor function `Cat`:

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

Here are what `new` operator does:

* Create a new instance
* Bind `this` to the new instance
* Link the new instance's delegate prototype to the object referenced by the constructor function's `.prototype` property (`Cat.prototype` in this case).
* Name the object type after the constructor function's name. (**Is this done by using F.prototype.constructor?**)
* `instanceof` can work properly

### How does `instanceof` operator works?

Syntax: `object instanceof Constructor`

It checks whether `object`'s prototype is linked to `Constructor.prototype`. In other words, `obj instanceof C` is equivalent to `Object.getPrototypeOf(obj) === C.prototype`.

### Some example that fails to use `instanceof`

// TODO

Advice: Do NOT use `new` operator and constructor functions to create objects!

## The "Right" Way to Create Objects in JavaScript

* Object literal
* `Object.create(prototype_obj)`
* `Object.assign(obj, src1, src2, ...)` (something like `$.extend()` which "composes" multiple objects)

~~~js
let animal = {
  animalType: 'animal',
  
  describe () {
    return `An ${this.animalType}, with ${this.furColor} fur, 
      ${this.legs} legs, and a ${this.tail} tail.`;
  }
};

let mouse = Object.assign(Object.create(animal), {
  animalType: 'mouse',
  furColor: 'brown',
  legs: 4,
  tail: 'long, skinny'
});
~~~

* `animal` is a **delegate prototype**.
* `Object.assign(obj, {...})` is **concatenative inheritance**. It will copy all of the enumerable own properties by assignment from the source objects to the destination objects with last in priority. If there are any property name conflicts, the version from the last object passed in wins.

## Use Factory Function

Use factory function to create objects. For example:

~~~js
let animal = {
  animalType: 'animal',
 
  describe () {
    return `An ${this.animalType} with ${this.furColor} fur, 
      ${this.legs} legs, and a ${this.tail} tail.`;
  }
};
 
let mouseFactory = function mouseFactory () {
  // The profession() interface exposes by the closure keeps this secret.
  let secret = 'secret agent';

  return Object.assign(Object.create(animal), {
    animalType: 'mouse',
    furColor: 'brown',
    legs: 4,
    tail: 'long, skinny',
    profession () {
    	return secret;
    }
  });
};

let mickey = mouseFactory();
~~~

### Some examples of factory function

* `React.createClass()`
* `http.createServer()` in Node.js.
* ... and so on.

> Next on the JS lib popularity roller coaster was jQuery. jQuery’s big claim to fame was jQuery plugins. They worked by extending jQuery’s **delegate prototype** using **concatenative inheritance**.


