---
title: "JavaScript 變數 - JavaScript 程式教學 / JS Tutorial"
tags: ["javascript"]
permalink: /javascript/variable
---

在 JavaScript 的程式中，我們經常需要處理各種**資料**，例如：購物網站的購物車中的商品，或是社群網站中的聊天訊息和朋友的上線狀態。

**變數**的功能就是用來**儲存資料**。

## 目錄
{: .no_toc}

- TOC
{:toc}

## JavaScript 變數

變數就像是「資料的容器」，你可以把它想像成是一個箱子，裡面放著我們會用到的資料。

資料有各種不同的種類，例如：數字、字串、布林值等。之後的文章會詳細說明這一點。

## 宣告變數

要開始使用變數，首先要做的事情是「宣告」變數。

宣告變數的方法是在 `var` 關鍵字後面加上變數的名字：

```javascript
var myName;
```

這樣我們就宣告了一個名為 `myName` 的變數。

我們可以宣告任意數量的變數以滿足我們的需求：

```javascript
var myName;
var myAge;
```

我們甚至可以在同一行裡面宣告多個變數：

```javascript
var myName, myAge, myGender;
```

## 初始化變數的值

變數被宣告之後，下一步就是初始化變數的值，讓變數可以儲存我們的資料。

初始化變數的方法是用指定運算子 (assignment operator)，它是一個等號 `=`。

使用的方法是 `變數名稱 = 變數的值`。例如：

```javascript
myName = "Chris";
myAge = 25;
```

這樣我們就讓 `myName` 這個變數儲存了 `"Chris"` 這筆資料，同時讓 `myAge` 這個變數儲存 `25` 這筆資料。

我們也可以同時宣告並且初始化變量，例如：

```javascript
var myName = "Chris";
var myAge = 25;
```

## 更新變數的值

初始化變數的值之後，我們隨時可以將值更新成我們想要的值。

```javascript
var myName = "Chris";
var myAge = 25;
// 更新變數的值
myName = "Bob";
myAge = 30;
```

## 讀取變數的值

用變數將資料儲存起來以後，我們可以用同樣的變數名稱來存取資料。

如果我想要讓瀏覽器跳出一個視窗，視窗的內容顯示變數的內容，我們可以用 `alert(變數)`。例如：

```javascript
var myName = "Chris";
alert(myName); // 彈出視窗，內容顯示 Chris
```

## 變數命名規則

JavaScript 的變數命名有以下規則：

1. 只能由英文、數字、`$` 及 `_` 組合而成。
2. 第一個字不能是數字。

所以下列這些是合法的變數名稱：

```javascript
var userName = "Chris";
var book123 = "Harry Potter";
var $ = 456;
var _ = 789;
```

這些是不合法的變數名稱：

```javascript
var user-name = "Chris"; // 變數名稱不能有 "-"
var 1stBook = "Harry Potter"; // 變數名稱不能以數字開頭
```

### 大小寫區別

變數名稱的大小寫不同，就是完全不同的變數。例如：`apple` 和 `Apple` 是兩個不一樣的變數。

### 保留字

在 JavaScript 中有一些保留字，不能用來當作變數的名稱，因為這些字在 JavaScript 程式碼中有特殊的意義。

例如： `var`、`function`、`return` 等。

```javascript
var var = "some variable"; // 不能用 var 當作變數名稱
```

### 駝峰式命名 (Camel Case)

在 JavaScript 中，慣例的命名方式是[駝峰式命名](https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)。

駝峰式命名中，變數名稱的第一個英文單字開頭是小寫，其餘的英文單字開頭是大寫。

例如： 當我想要用一個變數儲存我最喜歡的一本書，英文是 my favorite book，駝峰式的命名法就會是 `myFavoriteBook`。

在程式碼中使用統一的命名方式，會讓你的程式碼看起來漂亮、一致且容易閱讀。

### 常數大寫命名

寫程式的時候，通常會有一些難以記憶及理解的資料，這時候我們可以把它宣告成常數，幫助我們閱讀理解程式碼。

在 JavaScript 中，這些常數通常是用大寫加上底線 `_` 的方式去命名。

例如：

```javascript
var MY_BIRTHDAY = 'May 5th';
var MY_FAVORITE_BOOK = 'Harry Potter';
```

舉例來說，計算一個圓面積，我們可以寫以下的程式碼：

```javascript
var circleArea = 5 * 5 * 3.1415926;
```

但是過了一陣子之後回頭看這段程式碼，你可能會忘記 5 和 3.1415926 代表什麼意思。

為了幫助我們理解，可以將 5 和 3.1415926 變成常數：

```javascript
var CIRCLE_RADIUS = 5;
var PI = 3.1415926;
var circleArea = CIRCLE_RADIUS * CIRCLE_RADIUS * PI;
```

怎麼樣，是不是清楚多了呢！

## 命名原則：如何為變數取一個好的名字

變數命名最重要的原則是：要能夠清楚地表達它所儲存的資料是什麼。

命名是寫程式中最重要的一件事，原因是命名和程式碼的可維護性息息相關。

在一個團隊裡面，我們寫的程式碼很有可能會被其他人修改到；即使我們的程式碼只有自己一個人會用，我們也經常會需要過一陣子之後回頭閱讀與修改。

這個時候，好的命名可以讓自己/其他人容易理解與修改，節省自己與其他人的時間。

以下是一些可以清楚傳達意義的變數名稱：

```javascript
var myFavoriteBook = "Harry Potter";
var userName = "Chris";
```

以下則是意義不明的變數名稱：

```javascript
var mfb = "Harry Potter";
var aaa = "Chris";
```

下面簡單歸納一些命名的經驗法則：

1. 使用有意義、容易理解的名稱，例如 `userName`、`myFavoriteBook` 等。
2. 不要使用短而意義不明的名稱，如：`a`、`b`、`c`、`aaa`、`bbb`、`ccc`。
3. 不要使用縮寫，除非你能確保這個縮寫是大家都能理解的，例如：`mfb` (沒人會知道他是 my favorite book 的意思！)
4. 不要使用意義太過廣泛的詞語，例如：`data`、`value`，除非在這個情境下你可以很明確的知道他的意義。

好的命名是一項高深的學問，建議大家在寫程式的時候多花一點心力命名！

## 總結

在這篇文章中，我們學到了變數的功用，就像是存放資料的容器。

我們也學到了如何宣告和初始化變數，以及如何修改變數的值。

最後我們學到變數命名的規則，以及如何為變數取一個好的名字，這對我們維護程式碼有長遠的好處！