---
title: "如何開始寫 JavaScript - JavaScript 程式教學 / JS Tutorial"
tags: ["javascript"]
permalink: /javascript/howto
---

這篇文章教你如何挑選一個適合你的程式碼編輯器，以及如何執行 JavaScript。

## 目錄
{: .no_toc}

- TOC
{:toc}

## 程式碼編輯器 (Code Editor)

JavaScript 程式碼的本質只是純文字，所以用作業系統內建的記事本就能夠寫程式了，但是我不推薦這麼做，原因是文字編輯器的功能並不適合寫程式。

為了讓我們事半功倍，我們需要使用專門為寫程式而設計的程式碼編輯器 (Code Editor)。

好的程式碼編輯器可以做到下列事情，幫助我們開發程式：

* 針對程式碼語法作語法突顯 (syntax highlighting)。
* 自動完成 (autocompletion)
* 分析檔案/資料夾結構
* 整合版本控制軟體 (e.g., git)
* 型別定義

下列是幾種常用的程式碼編輯器：

* [Visual Studio Code](https://code.visualstudio.com/) (跨平台，免費)
* [Webstorm](https://www.jetbrains.com/webstorm/) (跨平台，付費)
* [Atom](https://atom.io/) (跨平台，免費)
* [Sublime Text](http://www.sublimetext.com/) (跨平台，免費)
* [Notepad++](https://notepad-plus-plus.org/) (Windows，免費)
* [Vim](https://www.vim.org/) / [Emacs](https://www.gnu.org/software/emacs/)

### 新手應該用哪種程式碼編輯器？

不管程式老手或新手，我個人最推薦 [Visual Studio Code](https://code.visualstudio.com/)，原因是：

1. 整合功能完整
2. 由微軟持續維護，品質穩定
3. 免費
4. UI 直覺好用

## 線上開發平台

如果你不想要大費周章下載程式碼編輯器、建置開發環境，我推薦一些線上開發平台，讓你在 30 秒內開始練習寫程式：

* [JS Fiddle](https://jsfiddle.net/) (適合快速練習)
* [CodePen](https://codepen.io/pen/) (快速練習之餘可以欣賞許多大神的前端作品)
* [CodeSandbox](https://codesandbox.io/) (快速建置專案的檔案資料夾結構，適合有一定基礎的人使用)

這些線上開發平台的功能日益強大，寫起來幾乎和真正的程式碼編輯器相差無幾了呢！

## 如何執行 JavaScript?

在正式學習 JavaScript 的細節之前，我們需要有一個可以執行 JavaScript 的環境。

### HTML script 標籤

JavaScript 可以寫在 HTML 網頁中的 `script` 標籤內。

當瀏覽器開啟這個網頁，會解析這個 HTML 結構，處理到 `script` 標籤時，JavaScript 便會被執行。

> 小練習：請你試著建立一個 helloworld.html，用 VS Code 開啟，複製以下程式碼貼進去後存檔，或是在任一線上開發平台貼進 html 的區塊。

```html
<!DOCTYPE HTML>
<html>
<body>
  <script>
    alert('Hello, world!');
  </script>
</body>
</html>
```

用瀏覽器打開 helloworld.html，你將會看到一個警告視窗跳出來！

### 引用外部 JavaScript

為了方便管理程式碼，我們可以把 JavaScript 程式碼單獨放在一個檔案中，比方說 hello.js：

```js
alert('Hello, world!');
```

並且在 HTML 中引用 JavaScript 檔案：

```html
<!DOCTYPE HTML>
<html>
<body>
  <script src="hello.js"></script>
</body>
</html>
```

JavaScript 檔案的路徑可以是一個完整的絕對路徑：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script>
```

也可以是相對於根目錄的路徑 (以 `/` 開頭)：

```html
<script src="/js/hello.js"></script>
```

或是相對於目前網頁的路徑：

```html
<script src="hello.js"></script>
```

需要多種功能時，同時引用多個檔案也是沒問題的：

```html
<script src="/js/1.js"></script>
<script src="/js/2.js"></script>
```

### 將 JavaScript 獨立成分開檔案的好處是？

將 JavaScript 獨立成分開的檔案是網頁開發中的 best practice，這個做法有以下好處：

1. 方便管理，可以根據不同的頁面/功能撰寫分開的 JS
2. 瀏覽器下載檔案時也會儲存在瀏覽器的快取 (cache) 之中，之後只要用到這個檔案的頁面，都不需要再重複下載這個檔案，可以加快頁面的載入速度。

## 總結

我們學到了如何用程式碼編輯器或是線上開發平台寫程式，以及如何在 HTML 網頁中執行 JavaScript。