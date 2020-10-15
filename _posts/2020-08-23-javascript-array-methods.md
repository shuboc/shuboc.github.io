---
title: "JavaScript 開發者都該會的 7 個好用陣列方法"
tags: ["javascript"]
image: /images/javascript-array-methods.png
last_modified_at: 2020/10/15
---

本篇文章要教你 7 個好用的 JavaScript 的陣列方法：map(), forEach(), filter(), find(), every(), some() 以及 reduce()。這些陣列方法容易使用，能夠幫助你提升程式碼的可維護性並減少潛在的bug，身為 JavaScript 的開發者的你一定要會！

## 目錄
{: .no_toc}

- TOC
{:toc}

## 何謂宣告式編程：專注在「做什麼」，而非「如何做」

在正式介紹這些好用的方法之前，我們先來深入剖析平常處理陣列資料的方法。

假設我們有一組商品資料：

```JavaScript
const data = [
  {
    name: '蘋果',
    price: 100,
  }, {
    name: '香蕉',
    price: 200,
  }, {
    name: '橘子',
    price: 300,
  },
];
```

我們可以對這組資料做各式各樣的操作。

舉例來說，如果我想要所有品項「價格」的陣列，可以這樣寫：

```JavaScript
const results = [];
for (let i = 0; i < data.length; ++i) {
  results.push(data[i].price);
}

console.log(results); // [100, 200, 300]
```

如果我的需求換成「打完折加上運費的價格」的陣列，那我可以這樣改寫：

```JavaScript
const results = [];
for (let i = 0; i < data.length; ++i) {
  results.push(data[i].price * 0.9 + 30);
}
console.log(results); // [120, 210, 300]
```

注意到上面兩段程式碼有共同的模式，也就是：

1. 新增一個空陣列
2. 用一個 `for` 迴圈遍歷陣列
3. 經過某種計算後將結果放進陣列中

**這些重複使用的邏輯，可以提取成一個新的陣列方法 `map()`：**

```JavaScript
Array.prototype.map = function(callback) {
  const results = [];
  for (let i = 0; i < this.length; ++i) {
    results.push(callback(this[i]));
  }
  return results;
}
```

於是上述兩個例子可以用 `map()` 重新改寫如下：

```JavaScript
const result1 = data.map(item => item.price);
const result2 = data.map(item => item.price * 0.9 + 30);
```

怎麼樣，是不是簡潔許多呢？

這就是 functional programming (函數式編程) 強調的**宣告式編程 (Declarative Paradigm)**。

Functional Programming 是一種程式設計的方法論，主要的特色是函式是第一等物件、提倡純函式 (Pure Function) 及避免副作用 (Side Effect)、宣告式 (Declarative) 程式設計等。

其中這裡使用到的「宣告式編程」指的是，**寫程式的時候專注在「我想要達到什麼結果」，而不是「如何達成這個結果」。**

這裏的 `item => item.price * 0.9 + 30` 就是一種宣告，作用是告訴電腦我想要這樣的結果，結果如何產生的我不需要在意，因為所有細節都已經封裝在 `map()` 裡面了。

這樣做的好處是，寫出來的程式碼的「意圖」會變的很明白，讀程式碼的人只需要關注真正重要的邏輯，也就是 `item => item.price * 0.9 + 30`，而不會迷失在細節中。

實際上 JavaScript 中的 `Array` ˇ已經內建包含 `map()` 在內的許多方法，讓我們可以很方便地以 functional programming 的方式操作資料。

接下來就要介紹這些方法：`forEach()`、`map()`、`filter()`、`find()`、`every()`、`some()` 及 `reduce()`。

## forEach()

`forEach` 可以對陣列中的所有元素執行特定操作。

`forEach` 接受一個 `callback` 函式當作參數，用來定義對每個元素要做的事情：

```JavaScript
arr.forEach(function(item, index, array) {
  // Do something
});
```

`callback` 的參數如下：

* `item`: 目前元素
* `index`: 目前元素的 index
* `array`: array 本身

如果我們希望按照順序印出所有商品資訊，可以這樣寫：

```JavaScript
data.forEach(function(item) {
  console.log(item.name + '的價錢是' + item.price);
});

// 蘋果的價錢是100
// 香蕉的價錢是200
// 橘子的價錢是300
```

如果要知道現在遍歷到第幾個元素，可以用 `index`：

```JavaScript
data.forEach(function(item, index) {
  console.log(`第 ${index} 個元素是 ${JSON.stringify(item)}`)
});

// 第 0 個元素是 {"name":"蘋果","price":100}
// 第 1 個元素是 {"name":"香蕉","price":200}
// 第 2 個元素是 {"name":"橘子","price":300}
```

## map()

當我們需要將 array 中所有元素轉換成另一種形式的資料的時候，可以使用 `map()`。

`map` 接受一個 `callback` 函式作為參數，`callback` 需回傳轉換後的元素：

```JavaScript
let result = array.map(function(item, index, array) {
  // Do something...
  return result;
})
```

`map` 會回傳一個長度一樣的 array，裡面有轉換過後的資料。

如果我們想要算出商品打折完含運費的價格，可以這樣寫：

```JavaScript
const totalPrice = data.map(function(item, index, array) {
  return item.price * 0.9 + 10;
})

console.log(totalPrice); // [100, 190, 280]
```

`map` 跟 `forEach` 最大的差異在於，`forEach` 不會有回傳值，但 `map` 會回傳一個全新的 `array`。

如果你不需要對資料作轉換，例如：印出字串等不會回傳值的情況，就用 `forEach`；如果你需要資料轉換之後的結果，就用 map。

## filter()

`filter` 用來「過濾出陣列中符合條件的元素」，會回傳一個 array。

如果想找出所有價錢大於 150 元的商品，可以這樣寫：

```JavaScript
const filtered = data.filter(function(item) {
  return item.price > 150;
});

console.log(filtered); // [ { name: '香蕉', price: 200 }, { name: '橘子', price: 300 } ]
```

## find()

`find` 用來「找出陣列中第一個符合條件的元素」，回傳值是一個元素或 `undefined`。

如果我想找出第一個價錢大於 150 元的商品，可以這樣寫：

```JavaScript
const found = data.find(function(item) {
  return item.price > 150;
});

console.log(found) // { name: '香蕉', price: 200 }
```

和 `filter` 的不同之處在於，`filter` 會回傳包還所有符合條件的項目的「陣列」，而 `find` 會回傳第一個符合條件的「項目」。

## every()

`every` 用來測試陣列中的所有項目是否符合某個條件，回傳值是布林。

測試是否所有商品的價錢都大於 150 元：

```JavaScript
const test = data.every(function(item) {
  return item.price > 150;
});

console.log(test); // false
```

測試是否所有商品的價錢都大於 70 元：

```JavaScript
const test = data.every(function(item) {
  return item.price > 70;
});

console.log(test); // true
```

## some()

`some` 用來測試陣列中是否存在至少一個項目符合某個條件，回傳值是布林。

測試是否存在商品價格大於 300 元：

```JavaScript
const test = data.some(function(item) {
  return item.price > 300;
});

console.log(test); // false
```

測試是否存在商品價格大於 250 元：

```JavaScript
const test = data.some(function(item) {
  return item.price > 250;
});

console.log(test); // true
```

`some` 和 `every` 的差別是，`every` 必須「所有」的項目都符合條件才會回傳 `true`，`some` 只要其中一個項目符合條件就會回傳 `true`。

## reduce()

`reduce` 的功能是將陣列中的所有項目合併成一個值。

`reduce` 的 callback 參數接受兩個參數，分別為：

* `accumulator`：目前累積的值
* `item`：目前項目

舉個例子，如果我們要知道陣列中所有項目加起來的總和，可以這樣寫：

```JavaScript
const arr = [1, 2, 3, 4];
const sum = arr.reduce(function(accumulator, item) {
  console.log('accumulator: ' + accumulator);
  console.log('item: ' + item);
  return accumulator + item;
});

// accumulator: 1
// item: 2

// accumulator: 3
// item: 3

// accumulator: 6
// item: 4

console.log(sum); // 10
```

`reduce` 預設情況下從第二個元素開始遍歷，此時 `item` 等於 2，`accumulator` 預設是第一個元素 1，回傳值是 1 + 2 = 3。

接著遍歷至第三個元素，此時 `item` 等於 3，`accumulator` 是前一步的結果 3，回傳值是 3 + 3 = 6。

接著遍歷最後一個元素 `item` 等於 4，`accumulator` 是前一步的結果 6，回傳值是 6 + 4 = 10。

### initialValue

`reduce` 可以選擇性地給第二個參數 `initialValue`。

這個參數的使用時機是資料加總的起始值不為 0，或是資料並非數值格式。

例如，我想要知道所有的商品加起來的總價格：

```JavaScript
const sum = data.reduce(function(accumulator, item) {
  console.log('accumulator: ' + accumulator);
  console.log('item: ' + JSON.stringify(item));
  return accumulator + item.price;
}, 0);

// accumulator: 0
// item: {"name":"蘋果","price":100}

// accumulator: 100
// item: {"name":"香蕉","price":200}

// accumulator: 300
// item: {"name":"橘子","price":300}

console.log(sum); // 600
```

注意 `reduce` 的第二個參數 0。若是提供了 `initialValue` 參數，便會從第一個元素開始遍歷，並且用 `initialValue` 當作 `accumulator` 的值。

第一步遍歷第一個元素，此時 `accumulator` 等於 0，`item` 是第一個元素，回傳值是 0 + 100 = 100。

第二步遍歷第二個元素，此時 `accumulator` 等於 100，`item` 是第二個元素，回傳值是 100 + 200 = 300。

第三步遍歷第三個元素，此時 `accumulator` 等於 300，`item` 是第三個元素，回傳值是 300 + 300 = 600。

## 結論

本篇介紹了使用 functional programming 的好處，寫程式的重點從「做什麼」轉移到「如何做」，讓你能夠專注在真正重要的邏輯上。

接著介紹 JavaScript 內建的 7 種常用陣列方法：

* `forEach()`
* `map()`
* `filter()`
* `find()`
* `every()`
* `some()`
* `reduce()`

能夠讓你用 functional programming 的方式完成許多複雜的工作。

最後希望大家可以試著在日常工作使用看看本篇介紹的方法，相信一定能感受其簡潔與優雅！
