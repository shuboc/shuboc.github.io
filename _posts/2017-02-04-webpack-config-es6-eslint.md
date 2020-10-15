---
title: "[教學] Webpack基礎設定 (支援ES6、ESLint)"
tags: [webpack, react]
redirect_from: /2017/02/04/webpack-config-01-basic-babel-eslint-wds
last_modified_at: 2020/10/15
---

這篇教學介紹React專案的基本webpack設定。包含支援ES6需要的Babel，程式碼風格檢查的ESLint和開發工具`webpack-dev-server`。

## 目錄
{: .no_toc}

- TOC
{:toc}

## 專案資料夾結構 Overview

假設我們專案的資料夾結構如下：

~~~
├── package.json
├── src
│   ├── actions/
│   ├── containers/
│   ├── components/
│   ├── reducers/
│   ├── store/
│   ├── client.jsx
│   ├── routes.jsx
└── webpack.client.config.js
~~~

`src/`包含所有client-side的程式碼，其中`src/client.jsx`是我們app的進入點。而webpack設定放在`webpack.client.config.js`裡。

## Webpack基本設定

安裝webpack：

`npm install -D webpack`

在根目錄底下編輯`webpack.client.config.js`：

~~~jsx
// webpack.client.config.js
module.exports = {
  entry: {
    client: './src/client'
  },
  output: {
    path: './bin',
    filename: '[name].js'
  },
  resolve: {
    extensions: ["", ".js", '.jsx']
  },
  devtool: "source-map"
}
~~~

* `entry`是js的進入點，`client`是bundle的名稱，而`./src/client`表示當bundle被載入時會載入`./src/client`的module，而`webpack`會從這個進入點開始編譯。
* `output.filename: '[name].js'`設定成編譯出來的bundle會根據`entry`的key值命名，也就是`client.js`。
* `resolve.extension`可以讓我們import `js`及`jsx`時可以省略附檔名。
* `devtool`則是source map的設定，基於速度快慢和訊息的詳盡程度，選一個自己喜歡的即可。

## Babel設定

[Babel](https://babeljs.io/)是用來將ES6和react的jsx語法轉譯成ES5的工具。

安裝Babel：

~~~
npm install -D babel-core babel-loader
~~~

安裝ES6和`react`的presets：

~~~
npm install -D babel-preset-es2015 babel-preset-react
~~~

在專案根目錄底下設定`.babelrc`：

~~~jsx
//.babelrc
{
  "presets": ["es2015", "react"]
}
~~~

設定使用`babel-loader`載入`js`及`jsx`：

~~~jsx
// webpack.client.config.js
module.exports = {
  ...
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: /src/
      }
    ]
  },
  ...
}
~~~

## ESLint設定

[ESLint](http://eslint.org/)可以用靜態分析的方法抓出程式中的語法錯誤，以及容易出錯的寫法，讓開發過程中減少很多低級失誤。

安裝ESLint和loader：

~~~
npm install -D eslint eslint-loader
~~~

初始設定（推薦用問答的方式，產生的設定會在`.eslintrc.js`）：

~~~
./node_modules/.bin/eslint --init
~~~

在webpack config中加入`eslint-loader` (要放在最後面，才能檢查到react/es6語法)：

~~~jsx
module.exports = {
  ...
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel', 'eslint'],
        include: /src/
      }
    ]
  },
  ...
}
~~~

加入React rules（避免unused React錯誤，以及`jsx`的語法檢查）：

~~~jsx
// .eslintrc.js
"extends": [
  ...
  "plugin:react/recommended"
]
~~~

### `eslint-plugin-import`

當你import某個module時不小心打錯字，只會默默的import成`undefined`。舉例來說，這是我曾經犯過的一個錯：

~~~jsx
import {Provider} from 'redux' // Should be from 'react-redux'
~~~

JS沒給我任何警告或錯誤，只在runtime時狂噴莫名其妙的error，害我浪費超多時間QQ。後來找到`eslint-plugin-import`，他可以幫你檢查import的正確性（雖然實際使用起來似乎不是百分之百都抓得到錯誤）。

加入`eslint-plugin-import`外掛：

~~~
npm install -D eslint-plugin-import eslint-import-resolver-webpack
~~~

新增設定：

~~~jsx
// .eslintrc.js
module.exports = {
  ...
  "extends": [
    ...
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  plugins: [
    ...
    "import"
  ],
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": {
          "resolve": {
            "extensions": ['', '.js', '.jsx']
          }
        }
      }
    }
  }
}
~~~

## `webpack-dev-server`

[webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)是個express server，主要的功能負責serve bundle。他能夠做到當檔案修改時會重新編譯bundle，並且讓網頁自動refresh。更進階一點，還能在網頁不更動的情況下作Hot Module Replacement，讓開發的工作更加輕鬆。

webpack-dev-server會把bundle放在memory裡面，不會產生實體的檔案。而靜態檔案預設會從當前目錄serve。

安裝：

`npm install -D webpack-dev-server`

首先在`webpack.client.config.js`新增devServer的設定：

~~~jsx
module.exports = {
  ...
  output: {
    ...
    publicPath: '/static/' // bundle is served at this path
  },
  devServer: {
    historyApiFallback: true,
    inline: true
  }
}
~~~

* `output.publicPath`的設定表示bundle可以在`<domain>/static/client.js`的路徑被存取。
* 設定`devServer`。`inline`讓瀏覽器可以自動refresh。`historyApiFallback`是讓single page application第一次進入的路徑不管為何都能讓routing正常運作。

我們還需要一個靜態的`index.html`。因為靜態檔案預設從當前目錄serve，我們把`index.html`放在根目錄底下：

~~~jsx
<!doctype html>
<html>
  <head>
    <title>Redux Universal Example</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="/static/client.js"></script>
  </body>
</html>
~~~

注意`<script src="/static/client.js"></script>`相對路徑同`publicPath`。

最後加上npm script：

~~~jsx
// package.json
"scripts": {
  "start": "webpack-dev-server --config webpack.client.config.js"
},
~~~

執行：

~~~
npm start
~~~

## Conclusion

這樣專案就設定完成了，可以使用ES6及React的語法，包含ESLint檢查，以及支援瀏覽器自動refresh的`webpack-dev-server`。

完整的範例可以參考[react-universal-example](https://github.com/shuboc/react-universal-example/tree/01-basic-babel-eslint-wds)。

## Reference

[Webpack Official](https://webpack.github.io/docs/webpack-dev-server.html)

[Survivejs](http://survivejs.com/webpack/): 很詳盡的教學，比官方文件多很多範例

[Webpack your bags](https://blog.madewithlove.be/post/webpack-your-bags/): 一篇講解code splitting, chunk和css滿清楚的文章
