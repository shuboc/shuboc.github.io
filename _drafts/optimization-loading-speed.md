# 優化網頁載入速度 - JavaScript bundle 篇

## 介紹

我是 Shubo，目前在一家外商新創擔任前端工程師。我們的產品目前是全球前幾大的手機遊戲直播與社群。今天會分享我在優化我們家網頁載入速度的過程，之後如果各位有類似的需求也可以參考這篇的思路，或是試試看這篇提到的方法。

## 使用者抱怨網頁載入速度很慢，怎麼辦？

首先第一步我們要來診斷出可能的問題。

如果你對於網站載入速度為什麼會慢沒有概念的話，建議可以先試試 Google 出的 PageSpeed Insight。這是一套測速用的工具， Google 會用 bot 造訪你的網站，去模擬使用者感受到的載入速度，並且分析你的網站有哪些需要改進的部分。

舉個例子，我們把自家網站餵進去可以看到 PageSpeed 建議我們移除未使用的 JavaScript，這是因為桌機版的網頁和手機版的網頁共用同一個 vendor bundle，所以對手機版的網頁而言，載入了很多不必要的 library，拖慢了載入速度。所以參考他的建議，就會有一些初步可以著手的部分了。如果對於他的建議事項不是很明白，也可以點進去看文件的說明。

要注意的是雖然 Google PageSpeed Insight 是優化載入速度的很好的起點，但不用過度在意他的評分。因為以手機版網頁來說，要能在他的標準下拿到高分個人覺得還滿困難的，桌機版的標準就相對寬鬆，所以分數看看就好，可以將重心放在他給的建議上。

## 決定優先順序

我們怎麼決定第一步要如何下手？

首先我們會先參考 PageSpeed 給的建議。PageSpeed 建議的方向主要有兩個：JavaScript bundle 過大，以及圖片大小沒有優化，因此初步方向會以這兩個為主。

另一方面需要考量容易實行的程度。以我們公司的分工來說，前端工程師比較有自主權的部分在於 JavaScript 跟 CSS 這兩塊，而圖片等靜態資源的管理會牽涉到 server side 以及 app 端的許多邏輯，因此若要改變靜態資源的快取策略，或是實作 long term caching，牽動的範圍非常廣，需要跟很多人協調。

因此這次優化載入速度的策略上，優先事項會定調在如何幫 JavaScript bundle 減肥。

## 專案背景介紹

先介紹我們的網頁架構，我們的網頁是用 React.js 寫的，使用的打包工具是 webpack。

Webpack 提供了強大的 [code splitting](https://webpack.js.org/guides/code-splitting/) 工具，可以將巨大的 bundle 分成很多小 chunk，並且在用到的時候才去下載需要的 bundle。

一般而言，用 Webpack 打包的專案，為了效能考量，通常會將打包出來的 JavaScript bundle 分成三個部分：

* Application：也就是產品的 UI 跟商業邏輯等。
* Vendor：你的產品依賴的第三方套件，例如 React.js 或是各種 npm 上的套件。
* [Webpack runtime and manifest](https://webpack.js.org/concepts/manifest/)：負責所有模組之間的互動，一般來說體積很小可以忽略不計。

讓我簡單解釋一下這裡的邏輯：

我們知道 JavaScript bundle 的大小會影響載入速度，但具體而言它是怎麼影響載入速度的呢？

讓我快速解釋一下瀏覽器的運作原理：瀏覽器會解析 HTML 的內容以建造出 DOM tree，之後才可以畫出第一個畫面；然而，瀏覽器在建造 DOM tree 的過程中，遇到 JavaScript 必須要停下來執行；換句話說，JavaScript 必須全部被下載並且執行完才能畫出第一個畫面。所以說如果 JavaScript bundle size 非常大，就得花很多時間下載，拖慢第一個畫面被畫出來的時間。

所以 JavaScript 的大小會影響到瀏覽器畫出第一個畫面的時間。

回到 webpack 的話題，我們分成 application bundle 跟 vendor bundle 的原理就是，一般情況下我們的第三方套件相較於商業邏輯不太會頻繁更動，因此在大部分的情況下，使用者如果有造訪過我們的網站，瀏覽器很有可能已經將 vendor bundle 放在快取裡了，那瀏覽器是不是只要下載 application bundle 的部分就好了呢？這樣就能夠有效加快 JavaScript 的下載速度。

那我們的產品的 JavaScript 的 bundle 是如何規劃的呢？

除了 webpack 的經典配置之外，我們額外多出一塊第一方套件，一共規劃成四塊：

* manifest.js
* arcade.js：商業邏輯
* vendor.js：第三方套件
* omlib.js：第一方 (公司內部) 套件，主要定義和 server API 溝通用的規格。

那麼我們來檢視開始優化前的大小吧！

manifest基本上都很小可以忽略不計，所以我們優化前的 bundle 大小如下：

* arcade.js: 585KB, gzipped
* vendor.js: 366KB, gzipped
* omlib.js: 205KB, gzipped

共計 1156KB。在有快取的情況下，至少也需要下載 585KB。

手機版：

* arcade.js: 426KB, gzipped
* vendor.js: 366KB, gzipped
* omlib.js: 205KB, gzipped

共計 997KB。在有快取的情況下，至少需下載 426KB。

## 分析瓶頸

在這裡我們需要用到的工具是 `webpack-bundle-analyzer`。他是一個視覺化工具，可以將 bundle 的內容物按照檔案大小排列，讓我們可以知道哪些東西必須優先處理。

## vendor bundle

第一步我們看到我們的 application bundle 之中還有許多 node_modules。

細看一下前人的作法是，手動將一些比較大的第三方套件取出變成 vendor bundle。

更自動的作法是將 node_modules 的內容物統一放在 vendor bundle 之中：

```JavaScript
// webpack.config.js
optimization: {
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
      },
      omlib: {
        test: /[\\/]libs[\\/]/,
        name: 'omlib',
        chunks: 'all',
      },
    },
  },
},
```

* arcade.js: 310KB, gzipped
* vendor.js: 632KB, gzipped
* omlib.js: 205KB, gzipped

整體：1156KB，不變
application bundle: 585KB -> 310KB。

手機版：

* arcade.js: 218KB, gzipped
* vendor.js: 632KB, gzipped
* omlib.js: 205KB, gzipped

整體：997KB -> 1055KB (因為包含了桌機的 library，所以反而變得肥大了)
application bundle: 426KB -> 218KB。

這一個改動的主要功效是，減小 application bundle 的大小，讓有快取的情況下使用者進站的速度變快。

到目前為止，我們大幅減少了有快取的情況下，使用者需要等待載入的時間，但對於第一次進到網站的使用者來說，他們需要下載的量並沒有減少。

接下來要提到的 dynamic import 技巧可以加快第一次進站的速度。

## 根據路徑作 Dynamic imports

Webpack 支援 dynamic import `import()` 的語法，可以根據需要下載需要的 module。

下面的例子，我們用 import() 語法載入第三方套件 lodash：

```JavaScript
function getComponent() {
  return import('lodash')
    .then(({ default: _ }) => {
      const element = document.createElement('div');
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
      return element;
    })
    .catch(error => 'An error occurred while loading the component');
}

getComponent()
  .then(component => {
    document.body.appendChild(component);
  })
```

Webpack 在打包的時候便會將 lodash 獨立打包，等到真正用到的時候才載入。

```
...
                   Asset      Size          Chunks             Chunk Names
         index.bundle.js  7.88 KiB           index  [emitted]  index
vendors~lodash.bundle.js   547 KiB  vendors~lodash  [emitted]  vendors~lodash
Entrypoint index = index.bundle.js
...
```

這邊我們使用的策略是對所有的 route 作 dynamic loading，因為根據 GA 觀察到使用者平均瀏覽的頁面數不會太多，因此只在換頁的時候去下載那一頁的程式碼，似乎是非常合邏輯的選擇：

```jsx
<Route path="/" component={AppRoot}>
  <IndexRoute
    getComponent={() => {
      return import('containers/HomeContainer').then(({ default: HomeContainer }) => HomeContainer);
    }}
  />
  <Route path="/games"
    getComponent={() => {
      return import('containers/GamesContainer').then(({ default: GamesContainer }) => GamesContainer);
    }}
  />
  {/* Other routes */}
</Route>
```

經過 dynamic loading 之後，每一頁需要的 bundle 均在 20KB 以下。

* arcade.js: 215KB, gzipped
* vendor.js: 630KB, gzipped
* omlib.js: 205KB, gzipped

原本 1156 -> 205 + 630 + 215 + 20 = 1060KB。

手機版：

* arcade.js: 169KB, gzipped
* vendor.js: 630KB, gzipped
* omlib.js: 205KB, gzipped

原本 997 -> 205 + 630 + 169 + 20 = 1024KB。

## 對大型 package 做 dynamic import

延續 dynamic loading，為了要讓使用者第一次進站的速度提升，接下來我們要抓出佔很大體積的第三方套件，只在需要的時候動態載入。

Webpack 支援 ES2015 的動態 import 語法，使用方法如下：

```JavaScript
componentDidMount() {
  this.importJSZip = import('jszip/dist/jszip.min.js').then(({ default: JSZip }) => JSZip);
}

onDrop() {
  this.importJSZip.then(JSZip => {
    const newZip = new JSZip();
    // ...
  });
}
```

```JavaScript
splitChunks: {
  cacheGroups: {
    vendor: {
      test: /[\\/]node_modules[\\/](?!moment|hls.js)/, // Exclude modules that need to be dynamically loaded
      name: 'vendor',
    },
  },
}.
```

以下是我們抓到的體積肥大的 library，只有在需要的時候我們才會動態載入：

* hls.js: 77KB
* moment.js: 64KB
* JSZip: 27KB
* request: 70KB (request 是因為歷史因素，這個專案要給 node 和 web 使用，所以有些地方用到 request。)

## Webpack Tree Shaking

[Tree Shaking](https://webpack.js.org/guides/tree-shaking/) 指的是把沒用到的 code 從 JavaScript bundle 中移除。

這個功能可以實現是因為 ES2015 模組語法 import 跟 export 的[靜態結構](https://exploringjs.com/es6/ch_modules.html#static-module-structure)。

使用 tree shaking 的方法是：

1. 將 CommonJS 的 require 語法改寫成 import 跟 export
2. 標示出具有 side effect 的模組

```JavaScript
// Package.json
"sideEffects": [
  "*.css",
  "*.scss"
],
```

這邊比較多是苦工，改寫成新語法的同時需要一邊確定各種功能沒有壞掉。

另外，我們的專案針對 API 會對各平台產生和 server API 溝通用的 protocol，其中 JS 的 protocol 使用舊的 module 語法，因此也有針對這個部分去做改寫。

使用 tree shaking 的技巧之後，我們的內部 library 體積大幅縮小：

* omlib.js: 205KB -> 86.65KB

## 第三方 library 使用 CDN

大家很常使用到的 library 像是 jQuery、React 等，可用 CDN 提供的版本。

使用 CDN 的好處是，因為可能在瀏覽別的網站的時候就先快取了一份，所以有機會第一次進佔的時候就省下流量。

* react-dom: 36KB

## 其他：使用 preset-env

Babel loader 搭配 preset-2015 可以把 ES2015 的語法轉換成瀏覽器支援的語法，而 preset-env 是用來取代 preset-2015。

preset-env 的好處是可以根據你要支援的瀏覽器，決定要啟用哪些語法 plugin。

Ref: https://babeljs.io/docs/en/env/

polyfill = 31KB, 打包完剩 18KB

## Final Result

我們將 JavaScript bundle 體積減少成以下結果：

桌機版：

* arcade.js: 202KB, gzipped
* vendor.js: 267KB, gzipped
* omlib.js: 87KB, gzipped

如果舉最常被使用到的首頁為例，需要下載的量：

1156KB -> 87 + 267 + 36 (React) + 202 + 77 (hls.js) + 20 = 689KB (-41%)

注意這是 worst case，其中每一項都是可以因為快取而省下的。

手機版：

* arcade.js: 151KB, gzipped
* vendor.js: 267KB, gzipped
* omlib.js: 87KB, gzipped

997KB -> 87 + 267 + 36 (React) + 151 + 20 = 561KB (-44%)

結論：減少的比例滿高的，桌機結果還不錯，剛優化完成的時候還曾經在 PageSpeed 拿到 79 的分數，算是進步很多了。但是手機結果還需要再加強，因為手機的網路速度比較慢，尤其是考慮到一些網路比較沒那麼普及的區域，事實上是還有再進步的空間。

## 結論

這篇針對 JavaScript bundle 的優化提供一些可用的招數，包括

* 取出 vendor bundle
* 根據頁面去做 dynamic imports
* 對大型 library 做 dynamic imports
* 使用 Tree Shaking 移除沒用到的程式碼
* 很多人在用的第三方套件使用 CDN 版本

以及未來可以做的優化：

* 不使用佔體積過大的 library，例如 moment.js 有許多輕量級的替代品，可以參考[you-dont-need/You-Dont-Need-Momentjs](https://github.com/you-dont-need/You-Dont-Need-Momentjs)
* 針對手機版網頁抽取出 vendor bundle (因為手機版網頁的功能比較陽春，用到較少的第三方套件，理論上可以有更小的 vendor bundle)。
* 善用 webpack tree shaking 的特性去改寫程式碼架構

最後，關於如何優化載入速度，Google Developer 有相當豐富的資源可以參考：https://developers.google.com/web/fundamentals/performance/get-started
