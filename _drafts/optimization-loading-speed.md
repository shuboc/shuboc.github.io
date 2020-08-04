# 優化網頁載入速度

## 使用者抱怨網頁載入速度很慢，怎麼辦？

首先第一步我們要來診斷出可能的問題。

* Google PageSpeed Insight

PageSpeed 建議我們移除未使用的 JavaScript

影響網站載入速度的因素很多，最常見的：CSS、JavaScript

我們可以發現因為桌機版的網頁和手機版的網頁共用同一個 vendor bundle，所以對手機版的網頁而言，載入了很多不必要的 library，拖慢了載入速度。

## 決定優先順序

我們怎麼決定第一步要如何下手？

PageSpeed 抱怨的方向主要有兩個：JavaScript bundle 過大，以及圖片大小過大及畫質沒有優化，因此初步方向會以這兩個為主。

另一方面需要考量容易實行的程度。在這間公司的架構之下，前端工程師比較有自主權的部分在於 JavaScript 跟 CSS 這兩塊，而圖片等靜態資源的管理會牽涉到 server side 以及 app 端的許多邏輯，因此若要改變靜態資源的快取策略，或是實作 long term caching，牽動的範圍非常廣，需要跟很多人協調。因此在優化的策略上將會側重於幫 JavaScript bundle 減肥，而將圖片的優化擺在後面的順位。

## 背景

先介紹我們的網頁架構，我們的網頁是用 React.js 寫的，使用的打包工具是 webpack。

一般而言，用 Webpack 打包的專案，為了效能考量，通常會將打包出來的 JavaScript bundle 分成三個部分：https://webpack.js.org/concepts/manifest/

* Application Code，也就是產品的ＵＩ跟商業邏輯等
* Vendor，你的產品依賴的第三方套件，例如 React.js 或是各種 npm 上的套件
* Webpack runtime and manifest，負責所有模組之間的互動，一般來說體積很小可以忽略不計。

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

## Code Splitting

Webpack 提供了強大的 code splitting 工具，可以將巨大的 bundle 分成很多小 chunk，並且在用到的時候才去下載需要的 bundle。

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

共計 1156KB -> 1147KB。在有快取的情況下，至少也需要下載 585KB -> 310KB。

手機版：

* arcade.js: 218KB, gzipped
* vendor.js: 632KB, gzipped
* omlib.js: 205KB, gzipped

共計 997KB -> 1055KB。在有快取的情況下，至少需下載 426KB -> 218KB。

(註：因為 vendor bundle 有 desktop only 的第三方套件，所以反而總體積變大，這是一個未來可以改進的點)

## Dynamic imports

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

這邊我們使用的策略是對所有的 route 作 dynamic loading：

```JavaScript
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
  ...
</Route>
```

經過 dynamic loading 之後，每一頁需要的 bundle 約在 20KB 以下。

* arcade.js: 215KB, gzipped
* vendor.js: 630KB, gzipped
* omlib.js: 205KB, gzipped

共計 1156KB -> (1050KB + 20KB = 1080KB)。application bundle: 310KB -> (215KB + 20KB = 235KB)。

手機版：

* arcade.js: 169KB, gzipped
* vendor.js: 630KB, gzipped
* omlib.js: 205KB, gzipped

共計 997KB -> (1055KB + 20KB) = 1075KB。application bundle 218KB -> (169KB + 20KB = 189KB)。

## 其他: preset-env

Babel loader 搭配 preset-2015 可以把 ES2015 的語法轉換成瀏覽器支援的語法，而 preset-env 是用來取代 preset-2015。

preset-env 的好處是可以根據你要支援的瀏覽器，決定要啟用哪些語法 plugin。

Ref: https://babeljs.io/docs/en/env/

polyfill = 31KB, gzipped -> TODO: ??KB

## 處理大型 package

到目前為止，我們大幅減少了有快取的情況下，使用者需要等待載入的時間，但對於第一次進到網站的使用者來說，他們需要下載的量並沒有減少。

所以接下來我們要抓出佔很大體積的第三方套件，找尋方法移除或是用更輕量的套件取代。

Dynamic loading example code

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

* hls.js: 77KB
* moment.js: 64KB
* JSZip: 27KB
* request: 70KB

request 是因為歷史因素，這個專案要給 node 和 web 使用，所以有些地方用到 request。

## Webpack Tree Shaking

[Tree Shaking](https://webpack.js.org/guides/tree-shaking/) 指的是把沒用到的 code 從 bundle 中移除。

這個功能可以實現是因為 ES2015 模組語法 import 跟 export 的[靜態結構](https://exploringjs.com/es6/ch_modules.html#static-module-structure)。

使用 tree shaking 的方法是

1. 將 CommonJS 的語法改寫成 import 跟 export
2. 標示出具有 side effect 的模組

```JavaScript
// Package.json
"sideEffects": [
  "*.css",
  "*.scss"
],
```

這邊比較多是苦工，改寫成新語法的同時需要一邊確定各種功能沒有壞掉。

我們的專案針對 API 會對各平台產生和 server API 溝通用的 protocol，其中 JS 的 protocol 使用舊的 module 語法，因此也有針對這個部分去做改寫。

結果:

* omlib.js: 205KB -> 86.65KB

## 其他: 第三方 library 使用 CDN

大家很常使用到的 library 像是 jQuery、React 等，可用 CDN 提供的版本。

使用 CDN 的好處是，因為可能在瀏覽別的網站的時候就先快取了一份，所以有機會第一次進佔的時候就省下流量。

* react-dom: 36KB

## Final Result

* arcade.js: 202KB, gzipped
* vendor.js: 267KB, gzipped
* omlib.js: 87KB, gzipped

<!-- Total: 1156KB -> 556KB。 -->
Home: 87 + 267 + 36 (React) + 202 + 77 (hls.js) + 20 = 689KB

手機版：

* arcade.js: 151KB, gzipped
* vendor.js: 267KB, gzipped
* omlib.js: 87KB, gzipped

Total: 997KB -> 505KB。
Home: 87 + 267 + 151 + 20 = 525KB

結論：桌機結果還不錯，手機結果還需要再加強
