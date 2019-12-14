# Mixin

```Javascript
let sayHiMixin = {
  sayHi() {
    console.log(`${ this.name } says hi!`);
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

Object.assign(User.prototype, sayHiMixin);

let user = new User('Shubo');
user.sayHi();
```

基本用法：

```Javascript
Object.assign(F.prototype, mixin);
```

使用了mixin，依然可以繼承：

```Javascript
class User extends Person {
  // ...
}

Object.assign(User, someMixin);
```

Mixin本身可以繼承其他東西：

```Javascript
let sayMixin = {
  say(phrase) {
    console.log(phrase);
  }
};

let sayHiMixin = {
  __proto__: sayMixin, // 繼承
  sayHi() {
    // call parent method
    super.say(`{ this.name } says hi!`);
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

// Add the mixin to User
Object.assign(User.prototype, sayHiMixin);

new User('Shubo').sayHi();
```


