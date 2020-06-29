---
title: "[教學] @babel/preset-env 設定"
tags: ["webpack", "javascript"]
---

這篇文章要介紹如何設定 `@babel/preset-env`。`@babel/preset-env` 是 babel 7 架構下的一組 preset，能讓你用最新的 JavaScript 語法寫程式，並且智慧地根據瀏覽器的環境引入需要的 polyfill，節省手動管理 syntax transform 的時間，還能夠減少 bundle 檔案大小，是現代前端開發不可或缺的利器，快跟我一起來看看設定上有哪些要注意的地方吧！

![cat](/images/cat2.jpg)

Photo by Timothy Meinberg on Unsplash

## @babel/preset-env 是什麼？

`@babel/preset-env` 的主要功能有兩個：(1) 將尚未被大部分瀏覽器支援的 JavaScript 語法轉換成能被瀏覽器支援的語法，以及 (2) 讓較舊的瀏覽器也能支援大部分瀏覽器能支援的語法，例如 Promise、Map、Set等。

`@babel/preset-env` 最大的特點是，會根據 [browserslist](https://github.com/browserslist/browserslist) 的配置決定要轉換哪些語法，以及引入哪些 polyfill。

[browserslist](https://github.com/browserslist/browserslist) 的配置是用來列出我們支援的瀏覽器，例如我們想要支援使用人數高於0.25%，而且不包含停止安全性更新的瀏覽器，那我們可以用簡單的 query 語法來配置：

```
> 0.25%
not dead
```

## 為什麼要使用 @babel/preset-env？

`@babel/preset-env` 可以取代以往使用的 `babel-preset-2015`，那它與以往使用的 `babel-preset-2015` 有什麼不同呢？

`babel-preset-2015` 其實是很多種語法轉換規則的集合。（詳細清單可以看 [babel-preset-2015](https://babeljs.io/docs/en/6.26.3/babel-preset-es2015) 的頁面。另外也有 [babel-preset-2016](https://babeljs.io/docs/en/6.26.3/babel-preset-es2016) 和 [babel-preset-2017](https://babeljs.io/docs/en/6.26.3/babel-preset-es2017)。）在過去如果我們要使用新的語法，必須一一引入我們需要的 presets；另外如果有需要 polyfill 內建的功能像是 Promise，也需要一個一個手動引入，而像 `babel-preset-2015` 這樣的 preset 就是一組語法懶人包的概念，讓我們可以方便引用。

而使用 `@babel/preset-env` 的情況下，只要設置好 [browserslist](https://github.com/browserslist/browserslist) 即可，它會根據你的 browserslist 設定，決定要將哪些語法轉換和 polyfill 引入，不需要手動一個一個去檢視每個語法 transform 或是 preset 是否需要被引入，相對之下方便許多。

另外 `@babel/preset-env` 也可以幫助我們優化 bundle 檔案大小。舉個極端的例子來說，假設今天你的業務需求只需要支援最新的 Chrome，那使用 `@babel/preset-env` 的情況下，它可能就不會幫你引入太多的 polyfill，最終產生的 bundle 檔案就會比較小。

## @babel/preset-env 設定

**安裝**

`npm i -S @babel/polyfill @babel/runtime && npm i -D @babel/preset-env @babel/plugin-transform-runtime`

**.browserslistrc**

```
defaults
```

如果沒有特殊要求，可以設成 `defaults`，等同於 `> 0.5%, last 2 versions, Firefox ESR, not dead`。如果有其他需求，可以到 browserslist 的頁面看 [query 怎麼寫](https://github.com/browserslist/browserslist#full-list)。

**webpack.config.js**

```JavaScript
module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                modules: false,
                corejs: 3.6,
              }],
            ],
            // ...
          },
        },
      ],
    }],
  },
}
```

[useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) 有好幾種選項，其中 usage 表示當使用到新語法的地方才會做 transform。這樣可以產生較小的 bundle size，是個非常實用的選項。

例如：

```JavaScript
var a = new Promise();
```

會被轉換成：（假設你必須支援很舊的瀏覽器）

```JavaScript
import "core-js/modules/es.promise";
var a = new Promise();
```

另外[使用 usage 的時候會用到 core-js](https://babeljs.io/docs/en/babel-preset-env#usebuiltins)，所以需一併設置 [corejs](https://babeljs.io/docs/en/babel-preset-env#corejs) 選項。

安裝 core-js：

`npm install core-js@3 --save`

最後，`modules: false` 表示不要將 ES module 中的 `import` 語法轉換成 `require`，因為只有 `import` 才能使用 webpack 的進階功能 [tree shaking](https://webpack.js.org/guides/tree-shaking/)，可以讓 bundle size 變得更小。

## 進階篇：@babel/plugin-transform-runtime

如果想要進一步優化產生出的 bundle size，可以使用 [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/en/babel-plugin-transform-runtime)。

**webpack.config.js**

```JavaScript
module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      ],
    }],
  },
}
```

這個 plugin 是幹嘛用的呢？因為 babel 在做轉換的時候會將一些 helper function 加到每個檔案之中，無形中就增加了 bundle size。

例如：

```JavaScript
class Person {}
```

會被轉換成：

```JavaScript
"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Person = function Person() {
  _classCallCheck(this, Person);
};
```

可以看到多了一個 `_classCallCheck`，如果每個檔案都有一個一模一樣的 function 顯得很冗余。

而 `@babel/plugin-transform-runtime` 預設會將一些 helper function 改用 import 的形式，所以上面的程式碼會變成：

```JavaScript
"use strict";

var _classCallCheck2 = require("@babel/runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Person = function Person() {
  (0, _classCallCheck3.default)(this, Person);
};
```

這樣可以再減少一些 bundle size 喔。

## Reference

* [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
* [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)
* [Show me the code，babel 7 最佳实践！](https://github.com/SunshowerC/blog/issues/5)
