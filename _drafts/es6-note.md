# ES6 Note

## String

## Symbol

Use symbol as property key

~~~js
const MY_KEY = Symbol();
const FOO = Symbol();

let obj = {
  [MY_KEY]: 123 // Computed property key
  [FOO]() { //This is a function
    return "bar";
  }
};

obj[MY_KEY] // 123
obj[FOO]() // bar
~~~

Symbol cannot implicitly converted to String

~~~js
String(Symbol('hello')) // 'Symbol(hello)'
~~~