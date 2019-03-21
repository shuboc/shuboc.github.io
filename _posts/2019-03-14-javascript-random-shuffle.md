---
title: "[筆記] 居然可以這樣寫！JavaScript 實作亂數排序演算法 (Random Shuffle)"
tags: ["javascript"]
---

你知道用 JavaScript 居然只要寫一行，就可以將array作亂數排序？真的有這麼好的事情嗎？這篇文章就要來討論如何用 JavaScript 作亂數排序 (random shuffle)。

![Shuffle Poker Cards](/images/javascript-random-shuffle.jpg)

## `sort()`

先前情提要一下 JavaScript 內建的 `sort()` 函數。

`Array.prototype.sort()` 接受一個「比較函數」作為參數，這個函式的用途是讓 JavaScript engine 知道 array裡面的物件的大小關係，如此一來 JavaScript engine才能夠排序。

這個「比較函式」的輸入參數 `(a, b)` 是 array 裡的任兩個要比較的項目，回傳值是一個數字，負數表示a比b小，正數表示a比b大，相等表示一樣大。

總之，如果我們想要排序一個「數字」的 array，最簡潔的寫法如下：

```JavaScript
array.sort((a, b) => (a - b));
```

## 神奇的 JavaScript 亂數排序演算法

網路上看到 JavaScript 有一種很簡潔的寫法，可以將一個array作亂數排序 (random shuffle)：

```Javascript
function sort(array) {
  array.sort(() => Math.random() - 0.5);
}
```

太簡潔了吧！但是原理到底是什麼？

就讓我們一起來看一下這段 code 有什麼作用吧！

首先，`Math.random()` 會回傳一個介於0 ~ 1的數字，

那麼，`Math.random() - 0.5` 自然就會回傳一個介於-0.5 ~ +0.5的數字。

如果排序時，給定任兩個數字(a, b)，隨機回傳一個介於-0.5 ~ +0.5的數值，表示任兩個數字之間的大小相對關係是隨機的。

所以排序完的結果也是隨機的。

個人覺得是非常有趣 (?) 的思路，代碼行數又短，乍看是個滿優雅的寫法。

不過繼續往下看，會發現一件有趣的事情：

## 機率分佈不等

用瀏覽器跑隨機洗牌一萬次，紀錄可能結果的數量，得到以下結果：

![隨機洗牌機率分佈不等](/images/javascript-random-shuffle/javascript-random-shuffle-simulation.jpg)

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

[Shuffle an Array](http://javascript.info/task/shuffle) 的解釋是，JavaScript的`sort`是個黑盒子，我們不知道引擎內部排序的機制，不同的引擎實作出來的`sort`也會有差異。

我沒有特別深入了解引擎內部的機制，不過結果機率分布不均的現象的確存在，因此這似乎不是一個可以在認真的場合使用的實作。

那有沒有比較可靠的亂數排序演算法呢？

有的！

下面就來介紹：

## Fisher-Yates Shuffle

說到亂數排序演算法，其中一個有名的就是Fisher-Yates演算法。

他的算法是從array的最後一個元素開始，和他前方隨機一個位置的元素交換位置。

接下來將倒數第二個元素，和其前方隨機一個位置的元素交換位置，以此類推。

實作如下：

```Javascript
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
```

它的運作原理就像是有一個大籤筒，每次抽出一支籤，依序擺在array的最後一個位置、倒數第二個位置...直到所有的籤都被抽出來為止。

這個隨機排序的各種結果的機率是相等的。

用同樣的模擬方法，跑出來得到這樣的結果：

```
123: 166625
132: 167104
213: 167137
231: 166260
312: 166143
321: 166731
```

是可以實際在認真的場合使用的亂數排序演算法。

## Reference

[Shuffle an Array](http://javascript.info/task/shuffle)

[Fisher-Yates Shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
