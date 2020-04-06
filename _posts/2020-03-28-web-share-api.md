---
title: "[教學] Web Share API - Navigator.share() 介紹"
tags: ["javascript", "browser"]
---

Web Share API 是現代瀏覽器提供的最新功能之一，它讓網頁的使用者能夠體驗到和原生 app 完全相同的分享體驗。這篇文章將會教你 navigator.share() 的使用方法。

<style>
  .share-image-section {
    text-align: center;
    margin-bottom: 12px;
  }
  .share-image {
    max-width: 320px;
    max-height: 320px;
  }
  @media screen and (max-width: 600px) {
    .share-image {
      max-width: 160px;
      max-height: 160px;
    }
  }
</style>

<div class="share-image-section">
  <img src="/images/web-share-api/ios-share.jpg" alt="iOS Share" class="share-image" >
</div>

## Web Share API 是什麼？

原生的 Android 和 iOS app 如果要做分享，通常會使用原生的分享介面，類似的介面相信大家一定不陌生：

<div class="share-image-section">
  <img src="https://web.dev/web-share/wst-send.png" alt="Android Share" class="share-image" >
</div>

然而手機網頁要達到一樣的效果就沒有那麼容易了，網頁的分享通常體驗會比原生 app 差一點，且如果要讓使用者用得習慣，可能得必須針對不同的平台去盡量模仿原生的介面，這種做法的實作成本相對是高的。這時候 Web Share API 就能派上用場了！

Web Share API 是比較新的瀏覽器 API，可以讓使用者輕鬆地用作業系統原生的介面分享至其他 app、分享給你的朋友等，就像是使用原生 app 一樣。網頁端實作這隻 API，就等於同時實作了 Share to Facebook、Share to Twitter、Share to XXX... 等各種分享至第三方平台的功能了！

另外 Google Chrome Developers 的[影片](https://www.youtube.com/watch?v=zJQNQmE6_UI)也有對 Web Share API 簡單的介紹 (0:18 ~ 1:00)：

> There's an API that everybody should start using today, and that's the Web Share API.

<iframe width="560" height="315" src="https://www.youtube.com/embed/zJQNQmE6_UI?start=18" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

是不是很想趕快一窺究竟呢？讓我們繼續往下看！

## Web Share API 的使用限制

要使用 Web Share API 有幾個限制：

* 你的網站必須支援 https。
* 只能經由使用者所產生的事件觸發，例如 `click` 事件。
* 能夠分享的種類有：文字、URLs、檔案。

## Navigator.share()

`navigator.share()` 使用方法如下：

```javascript
if (navigator.share) {
  navigator.share({
    title: '標題',
    text: '文字描述',
    url: 'https://shubo.io/',
  })
    .then(() => console.log('成功！'))
    .catch((error) => console.log('發生錯誤', error));
}
```

首先我們要判斷瀏覽器是否支援這個功能，所以需要加上 `if (navigator.share) { // ... }` 的判斷。

接著我們呼叫 `navigator.share()` function，它的參數是一個物件，支援 `title`, `text`, `url` 及 `files` 四個 key。

最後這個 function 回傳值是一個 promise，所以我們可以分別對成功或是失敗的情況做額外處理。

> 延伸閱讀：[[教學] 深入淺出 JavaScript Promise](/javascript-promise/)

## Canonical URL

有個小細節需要注意，如果你的網站有不同的網址指向同樣的內容（例如：電腦版網頁 `www.example.com` 用手機瀏覽時會 redirect 到手機版網頁 `m.example.com`），那麼你可能應該分享 canonical URL (標準版的 URL)，而不是 `document.location.href`。

為什麼呢？因為如果你在手機上瀏覽這個網站，分享出去的會是 `m.example.com`，而如果手機版沒有做 redirect 的話，桌機的使用者就會看到手機版的排版 (感覺這狀況在 FB 挺常見的 -.-)。

如何解決呢？一般來說，這種情況為了 SEO 的緣故會在 HTML head 裡面標記 `<link rel="canonical href="xxxxx">`，讓搜尋引擎不要重複 index。因此我們可以用幾行簡單的程式碼抓出 canonical URL：

```javascript
const canonicalElement = document.querySelector('link[rel=canonical]');
const url = canonicalElement && canonicalElement.href || document.location.href;
navigator.share({ url: url });
```

## 瀏覽器支援度 Browser Support

這是一個相對較新的標準，截至寫這篇文章為止 (2020三月)，從 [Web Share API - caniuse.com](https://caniuse.com/#feat=web-share) 可以看到目前支援 Web Share API 的瀏覽器只有 Safari、iOS Safari 和 Chrome for Android，並沒有受到廣泛地支持。

雖然目前瀏覽器支援度不佳，不過很明顯 Web Share API 的使用情境主要集中在手機上，所以我個人認為只要做好 feature detection，搭配原本習慣的分享方式使用應該不成問題。

Happy Sharing!

## Reference

* [Share like a native app with the Web Share API - web.dev](https://web.dev/web-share/)