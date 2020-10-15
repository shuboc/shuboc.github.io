---
title: "[教學] 深入淺出 Preload, Prefetch 和 Preconnect：三種加快網頁載入速度的 Resource Hint 技巧"
tags: ["web browser"]
redirect_from: /preload-preconnect-prefetch
last_modified_at: 2020/10/15
---

現代瀏覽器提供了 `preload`、`prefetch` 和 `preconnect` 等功能，能讓開發者指定 link tag 的 rel 屬性提示瀏覽器提前下載圖片、JS、CSS等資源，以達到優化效能的效果。這篇文章將會教你這三種 resource hint 技巧的使用方法與時機，讓你了解如何優化資源的下載順序並提升網頁載入效能。

## 目錄
{: .no_toc}

- TOC
{:toc}

![Fetch](/images/fetch.jpg)

## 優先度

瀏覽器的資源下載順序會依照優先度。以 Chrome 為例，對於各種資源的預設優先度如下：

* Highest: HTML, CSS, Fonts
* High: script (預載影像之前), 在 viewport 內的影像
* Medium: script
* Low: script (async), image, media
* Lowest: mismatched CSS, `prefetch` resources

來源：[Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)

那麼有哪些方法可以改變資源的優先度呢？

讓我們往下看：

## Preload

`preload` 告訴瀏覽器：「這份資源對目前的頁面是必要的，請用最快的速度下載此資源。」

使用方法如下：

```html
<link rel="preload" as="script" href="super-important.js">
<link rel="preload" as="style" href="critical.css">
```

`as` 是用來指定資源的類別的。這個屬性需要指定，不然可能會重複下載同一份資源。

`preload` 對瀏覽器有「強制作用」而非「建議」，所以你必須很確定它是真正重要的資源。

雖然瀏覽器可以先掃一遍 html 提早發現資源，但是有些「隱藏」在 CSS/JS 內的資源就沒辦法了。這時候用 preload 就非常有幫助。例如：

* CSS 中的字體檔。
* script 中動態載入其他 script/CSS 等。

### Caching 行為

用 `preload` 下載的資源，也適用於 cache。

[Chrome 有四種 cache](https://calendar.perfplanet.com/2016/a-tale-of-four-caches/)：HTTP cache、memory cache、service worker cache、push cache。

`preload` 取得的資源，和一般的 HTTP request 使用相同的快取。所以資源如果可以快取的話會放在 HTTP cache 和 memory cache，不能快取的話，會在memory cache。

下面介紹一些使用情境，讓我們一起看下去！

### Use Case 1: Critical Path (關鍵路徑) CSS and JavaScript

我們知道，在 HTML 中引用 JS/CSS 檔案會阻擋 (block) [關鍵轉譯路徑 (critical rendering path)](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)。

換句話說，在這些資源被下載且解析完成之前，render (轉譯/渲染) 的動作沒辦法開始。所以這些資源越慢被下載，畫面出現的速度就越慢。

其中一個解決方法是：用 `preload` 來提示瀏覽器儘快下載這些資源：

```html
<link rel="preload" as="script" href="super-important.js">
<link rel="preload" as="style" href="critical.css">
```

對於 script 而言，一般來說會放在 html 的最後面，所以有可能會等到 parse 完整個 html 才會開始下載，但又希望越早被下載越好。

如果是重要的資源，那 `preload` 可能是比較好的優化方式。相較之下，同樣是可以非同步下載資源，`async` script 會 block `onload` event。

### Use Case 2: Font 字體

```html
<link rel="preload" as="font" crossorigin="anonymous" type="font/woff2" href="myfont.woff2">
```

注意如果是對字體作 `preload`，必須加上 [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) 這個 attribute，表示 anonymous mode CORS，否則[字型會被重複下載兩次](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)。`crossorigin` 也適用於其他支援 CORS 的資源。

補充說明：在HTML5中，有些元素有CORS的支援，如 script、img、video 等。Anonymous mode 表示送這個 request 的時候不帶任何 user credential，包含 cookie、HTTP authentication 等 (一種基本的認證機制，在 HTTP request header 裡面帶明文credential，如使用者帳號密碼等。)

參考資料：

* [Preload](https://w3c.github.io/preload/#early-fetch-of-critical-resources)
* [The crossorigin attribute: Requesting CORS access to content
](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)
* [Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)

### Use Case 3: Decouple Load from Execution

用 JavaScript 動態觸發 `preload`，預先下載好，等到需要時才執行：([Source](http://yoavweiss.github.io/link_htmlspecial_16/#59))

```Javascript
function downloadScript(src) {
  var el = document.createElement("link");
  el.as = "script";
  el.rel = "preload";
  el.href = src;
  document.body.appendChild(el);
}

function runScript(src) {
  var el = document.createElement("script");
  el.src = src;
}
```

### Use Case 4: Asnyc Loading of CSS

`preload` 可以用來非同步載入CSS：([Source](http://yoavweiss.github.io/link_htmlspecial_16/#61))

```jsx
<link rel=preload as=style href="async_style.css"
      onload="this.rel='stylesheet'">
```

### Use Case 5: Responsive Loading

`preload` 也可以搭配 media query 一起使用：([Source](http://yoavweiss.github.io/link_htmlspecial_16/#63))

```jsx
<link rel=preload as=image href="someimage.jpg"
      media="(max-width: 600px)">
```

### Use Case 6: Preload Header

我們也可以用 server response header 來觸發瀏覽器的 `preload`。

這個方法比 `<link rel="preload>` 更快觸發資源下載，因為不用等到 `link` tag 被preload scanner掃描到。也可以動態地調整 `preload` header。

注意：可能會觸發HTTP/2 server push。（如果這不是你想要的，server可用`nopush` 通知瀏覽器。）

參考資料：

[Server Push (HTTP/2)](https://w3c.github.io/preload/#server-push-http-2)

## Preconnect

`preconnect` 告訴瀏覽器：「這個網頁將會在不久的將來下載某個 domain 的資源，請先幫我建立好連線。」

使用方法如下：

```html
<link rel="preconnect" href="https://example.com">
```

為什麼需要提前建立連線呢？

要理解這個功能的用途，我們必須先知道，瀏覽器在實際傳輸資源前，有以下步驟需要做：

1. 向DNS請求解析域名
2. TCP Handshake
3. (HTTPS連線) SSL Negotiation
4. 連線建立完成，等待拿到資料的第一個byte

用時間軸表示如下：

![建立連線](https://www.igvita.com/posts/15/xsocket-setup.png.pagespeed.ic.DV8rwlxj05.webp)

(Source: [Eliminating Roundtrips with Preconnect](https://www.igvita.com/2015/08/17/eliminating-roundtrips-with-preconnect/))

上面四個步驟，每一步都會需要一個 RTT (Round Trip Time) 的來回時間。

所以在實際傳輸資料之前，已經花了3個RTT的時間。

如果是在 latency 很高的情況下（例如手機網路），會大大拖慢取得資源的速度。

### Preconnect 的效果是什麼？

這裏我引用 [Eliminating Roundtrips with Preconnect](https://www.igvita.com/2015/08/17/eliminating-roundtrips-with-preconnect/) 裡面提到的範例來做說明。

下圖是一個網頁載入資源的時間軸。

這個網站引用了 Google Fonts 的 CSS 檔，而 CSS 檔又引用到另外兩個字形檔。上半部/下半部分別未使用/用了 `preconnect`。

![preconnect 使用前與使用後](https://www.igvita.com/posts/15/xfont-preconnect.png.pagespeed.ic.ALPEs7sMxi.webp)

首先，圖上半部是單純直接下載 CSS 的結果。依時間先後順序，瀏覽器做了以下的事情：

1. 和 `font.googleapis.com` 建立連線
2. 下載 CSS
3. 和 `fonts.gstatic.com` 建立連線
4. 下載字體 (over HTTP/2 multiplexing)

接著，我們來看圖下半部。這邊使用了 `<link href='https://fonts.gstatic.com' rel='preconnect' crossorigin>`。依時間先後順序，瀏覽器做了以下的事情：

1. 和 `font.googleapis.com` 與 `fonts.gstatic.com` 建立連線
2. 下載 CSS
3. 下載字體 (over HTTP/2 multiplexing)

可以很明顯看到，因為利用 `preconnect` 提早建立好與 `fonts.gstatic.com` 之間的連線，省去了一次完整的 (DNS Lookup + TCP Handshake + SSL Negotiation) ，共三個 RTT 的時間。

### `preconnect` via `Link` HTTP Header / JavaScript

`preconnect` 除了靜態地在 HTML 內宣告，還有其他動態的觸發方式：

* `preconnect` 的指令可以由 server 帶在 HTTP Response Header 裡，讓 server side 可以動態產生欲使用 `preconnect` 的 domain。

* `preconnect` 也可以透過 JavaScript 觸發：

```Javascript
function preconnectTo(url) {
    var hint = document.createElement("link");
    hint.rel = "preconnect";
    hint.href = url;
    document.head.appendChild(hint);
}
```

下面簡單介紹一些使用情境：

### Use Case 1: CDN

如果你有很多資源要從某個CDN去拿，你可以提示 `preconnect` CDN的域名。

特別是你不太能預先知道有哪些資源要下載的情況，只需要給定域名這點滿方便的。

### Use Case 2: Streaming

如果頁面上有個串流媒體，但你沒有要馬上播放，又希望按下播放的時候可以越快開始越好，那麼可以考慮先用 `preconnect` 建立連線，節省一段連線時間。

## dns-prefetch

跟 `preconnect` 類似，差別在於只提示瀏覽器預先處理 DNS lookup 而已。

## Prefetch

`prefetch` 告訴瀏覽器：「這資源我等等會用到，有空的話幫我先下載」。

資源將會等頁面完全下載完以後，以 Lowest 優先度下載。

### Use Case: 分頁的下一頁

如果你確定使用者有很高的機率會點下一頁的話。

## 結論

* `preload` 告訴瀏覽器：「這份資源對目前的頁面是必要的，請用最快的速度下載此資源。」
* `preconnect` 告訴瀏覽器：「這個網頁將會在不久的將來下載某個 domain 的資源，請先幫我建立好連線。」
* `prefetch` 告訴瀏覽器：「這資源我等等會用到，有空的話幫我先下載」。

## Reference

* [&lt;link&gt; - Yoav Weiss](http://yoavweiss.github.io/link_htmlspecial_16/)
* [Resource Prioritization - Google Developer](https://developers.google.com/web/fundamentals/performance/resource-prioritization)
* [Resource Hints](https://www.keycdn.com/blog/resource-hints)
* [Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
