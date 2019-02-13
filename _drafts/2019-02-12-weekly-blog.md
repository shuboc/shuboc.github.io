---
title: "Weekly Blog #1"
tags: ["javascript"]
---

## 如何用JavaScipt實作亂數排序 (Random Shuffle)

[Shuffle an Array](http://javascript.info/task/shuffle)提到了javascript中，有一種簡單寫法，可以將一個array作亂數排序 (random shuffle)：

```Javascript
function sort(array) {
  array.sort(() => Math.random() - 0.5);
}
```

原理是array的sort方法接受一個函式作為參數，這個函式是用來告訴JavaScript array裡面的物件的大小關係，所以JavaScript才如何去排序一個array。

這個「比較函式」的輸入參數是array裡的任兩個"東西"a與b，回傳值是一個數字，負數表示a比b小，正數表示a比b大。

一般而言，如果我們想要排序一個數字array，我們會這樣寫：

```JavaScript
array.sort((a, b) => (a - b));
```

回到開頭提到的寫法，其亂數排序原理是：

> 給定任兩個數字(a, b)，隨機回傳一個介於-0.5~+0.5的數值。

對一個array排序，而每個數字的大小關係是隨機的，因此排序完的結果也是隨機的。

個人覺得是非常有趣 (?) 的思路，代碼行數又短，乍看是個滿優雅的寫法。

不過繼續往下看，會發現一件更有趣的事情：

### 機率分佈不等

用瀏覽器跑隨機洗牌一萬次，紀錄可能結果的數量，得到以下結果：

![隨機洗牌機率分佈不等](/images/2019-02-12/random-shuffle-1.png)

同樣的程式碼，用node (v8.10.0)測試，得到以下結果：

```
123: 2497862
132: 1249208
213: 2499671
231: 1250147
312: 1252508
321: 1250604
```

可以看到不管是node或是瀏覽器環境，使用這種亂數排序演算法，各種結果出現的機率並不是均等的。

為什麼會這樣呢？

作者的解釋是，JavaScript的`sort`是個黑盒子，我們不知道引擎內部排序的機制，不同的引擎實作出來的`sort`也會有差異。

我沒有查證作者說的是否正確，這方面可能得看原始碼才會知道了～我暫時不打算深究。

不過結果機率分布不均的現象的確存在，因此要使用此實作要特別小心 (能不用就不用吧)。

那有沒有比較可靠的亂數排序演算法呢？

有的！

下面就來介紹

### 更好的亂數排序 (Random Shuffle) 演算法：Fisher-Yates Shuffle

說到隨機洗牌，

```Javascript
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
```

跑出來得到這樣的結果：

```
123: 166625
132: 167104
213: 167137
231: 166260
312: 166143
321: 166731
```

分布是不是平均多了呢！

## Iterables


Array.from

## Destructuring Assignment

### Array Destructuring

Can be used with any iterables!

Looping with entries

default values

### Object Destructuring

支援複雜的結構

```
let options = {
  size: {
    width: 100,
    height: 200
  },
  items: ["Cake", "Donut"],
  extra: true    // something extra that we will not destruct
};

// destructuring assignment on multiple lines for clarity
let {
  size: { // put size here
    width,
    height
  },
  items: [item1, item2], // assign items here
  title = "Menu" // not present in the object (default value is used)
} = options;
```

## 做自己的生命設計師

利用原型設計生命，是靠著（在風險小的小型學習體驗）多失敗幾次，（在重大事物上）快速成功的好方法。
