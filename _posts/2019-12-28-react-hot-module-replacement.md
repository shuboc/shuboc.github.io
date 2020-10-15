---
title: "[教學] 如何設定 Webpack HMR + React Hot Loader (2020更新)"
tags: ["react", "webpack"]
last_modified_at: 2020/10/15
---

Hot Module Replacement (HMR) 是 Webpack 提供方便開發過程的功能，讓你修改原始碼時不需要重新載入頁面，這篇文章將會教你如何設定 Webpack Config 使你的專案支援 HMR，增加團隊的開發效率。

## 目錄
{: .no_toc}

- TOC
{:toc}

<img src="/images/webpack.jpg" style="
    width: 400px;
    margin: 0 auto;
    display: block;
" />

註：本篇寫作時版本為 `webpack@4.41.5` 及 `react-hot-loader@4.12.18`。

## 開啟 Webpack HMR (Hot Module Replacement) 設定

修改 webpack.config.js 的 `devServer.hot` 選項：

```JavaScript
// webpack.config.js
module.exports = {
  devServer: {
    hot: true,
  },
};
```

## 設定 `style-loader`/`css-loader` 的 HMR (Hot Module Replacement)

打開 webpack 選項後，`style-loader` 和 `css-loader` 不用特別更改設定就可以讓 HMR 生效。

```JavaScript
// webpack.config.js
module.exports = {
    module: {
        rules: [
           {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
        ]
    }
}
```

## 設定 React/JavaScript 的 HMR (Hot Module Replacement)

### 安裝 [React Hot Loader](https://github.com/gaearon/react-hot-loader)

```bash
npm install --save react-hot-loader
```

### 設定 babel plugin

在 webpack.config.js 新增 `react-hot-loader/babel` plugin：

```JavaScript
// webpack.config.js
module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['react-hot-loader/babel'],
            },
          },
        ],
      },
    ]
}
```

注意！webpack.config.js 中的 `babel-loader` 設定會覆蓋 .babelrc 設定，如果本來已經在 webpack.config.js 設定了 `options.plugins`，也應在 `options.plugins` 中新增 plugin；在 `.babelrc` 設定會被覆蓋。)

或是在 .babelrc 設定：

```JavaScript
// .babelrc
{
  "plugins": ["react-hot-loader/babel"]
}
```

### 設定 Root Component

在最頂層的元件使用 `hot()`  High Order Component (HOC) ：

```JavaScript
// App.js
import { hot } from 'react-hot-loader/root';

const App = () => <div>Hello World!</div>;

export default hot(App);
```

### Patch React

`react-hot-loader` 需在 `react` 和 `react-dom` 之前 import：

```JavaScript
// index.js
import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
```

或是在 webpack.config.js 中設定：

```JavaScript
// webpack.config.js
module.exports = {
  entry: ['react-hot-loader/patch', './src'],
  // ...
};
```

## Reference

https://webpack.js.org/guides/hot-module-replacement/
