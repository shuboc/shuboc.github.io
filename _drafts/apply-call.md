# 進階Function功能實作 (`apply`, `this`, `arguments`等的應用)

## Throttle

```Javascript
function throttle(f, ms) {
      let isThrottled = false;
      let savedThis = null;
      let savedArgs = null;

      return function wrapper() {
        if (isThrottled) {
          savedThis = this;
          savedArgs = arguments;
        } else {
          f.apply(this, arguments);
          isThrottled = true;

          setTimeout(() => {
            isThrottled = false; 
            if (savedArgs) {
              wrapper.apply(savedThis, savedArgs);
              savedThis = null;
              savedArgs = null;
            }
          }, ms);
        }
      }
    }
```

## Curry

```Javascript
function curry(func) {

  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };

}

function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

// still callable normally
alert( curriedSum(1, 2, 3) ); // 6

// get the partial with curried(1) and call it with 2 other arguments
alert( curriedSum(1)(2,3) ); // 6

// full curried form
alert( curriedSum(1)(2)(3) ); // 6
```

## Curry2

```Javascript
function sum(a) {
  let currentSum = a;
  
  function f(b) {
    currentSum += b;
    return f;
  }
  
  f.toString = function() {
    return currentSum;
  }
  
  return f;
}

console.log(sum(0)(1)(2)(3)(4)(5)) // 15
```
