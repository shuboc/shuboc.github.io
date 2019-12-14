# `this` and `arguments` in JavaScript

## Arrow Functions

## Arrow functions don't have `this`

```javascript
let group = {
  students: ["John", "Pete", "Alice"],
  showList() {
    this.students.forEach(student => { // `this` equals to group
      console.log(this.student) // `this` is the same as in the outside function showList(), i.e., group
    })
  }
}

group.showList()
```

arrow function沒有自己的`this`；在arrow function裡，`this` 就等於外層function的`this`

## Arrow function don't have `arguments`

假設現在要寫一個function，要把原本的function包一層，做一些處理之後再呼叫。例如：輸入一個function，產生一個新的function，呼叫的效果是先等兩秒才呼叫原版的function。

```javascript
function sayHi(who) {
  console.log('Hello, ' + who)
}

sayHiDeferred = defer(sayHi, 2000)
sayHiDeferred("John") // Print "Hello, John" after 2 seconds
```

不用arrow function的寫法，為了要使function內可以存取`arguments`和`this`，需要把`arguments`存在`args` (1)，`this`存在`that` (2)：

```javascript
function defer(f, ms) {
  return function(...args) { // 1
    const that = this // 2
    setTimeout(function() {
      return f.apply(that, args)
    }, ms)
  }
}
```

如果用arrow function就可以簡化成：

```javascript
function defer(f, ms) {
  return function() { // the scope of this, arguments
    setTimeout(() => {
      return f.apply(this, arguments)
    })
  }
}
```

在 arrow function中，`arguments` 跟 `this` 都會往外層的scope查找
