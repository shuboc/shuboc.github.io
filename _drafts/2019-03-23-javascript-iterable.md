# Iterable

啥是iterable?

可以被用在 `for .. of` 語法的物件

## `Symbol.iterator`

對 `obj` 物件使用 `for (const elem of obj)` 語法時，會呼叫 `obj` 的 `[Symbol.iterator]()` 方法。

所以如果要讓 `obj` 可以 iterable，需要實作 `obj` 物件的 `[Symbol.iterator]()` 方法，此回傳一個 iterator 物件。

iterator 物件需實做 `next()` 方法，告知 JavaScript engine 目前迭代的狀態。

### 實作1

```Javascript
let range = {
  from: 1,
  to: 5
};

[Symbol.iterator]() {
  return {
    current: this.from,
    last: this.to,

    next() {
      if (this.current <= this.last) {
        return {
          done: false,
          value: this.current++;
        };
      } else {
        return {
          done: true,
        };
      }
    }
  }
}

for (let num of range) {
  console.log(num); // 分別印出 1 2 3 4 5
}
```

這樣寫的好處是，不會修改到原本的物件，而是回傳一個iterator。

可以同時並存多個不同的iterator，分別保有自己的狀態。

### 實作2

也可以回傳物件本身：

```Javascript
let range = {
  from: 1,
  to: 5,
  
  [Symbol.iterator]() {
    this.current = this.from;
    return this;
  }
    
  next() {
    if (this.current <= this.to) {
      return {
        done: false,
        value: this.current++;
      };
    } else {
      return {
        done: true
      };
    }
  }
};

for (let num of range) {
  console.log(num); // 分別印出 1 2 3 4 5
}
```

好處是...壞處是...

## `Array.from`

## `arguments`

1. array-like objects
2. iterable
3. NOT an array，不能用arguments.map等方便的函式

可以用Rest Parameters把`arguments`轉換成array

```Javascript
function foo(...args) {
  // args is an array
}
```

Convert `argument` object to an array

## Spread Operator

NOTE: only works on iterables

## Destructuring Assignment

### Array Destructuring

Can be used with any iterables!

Looping with entries

default values



