---
title: "[教學] Intersection Observer API 簡潔用法學起來！這樣寫輕鬆搞定無限捲軸、lazy loading"
tags: ["javascript", "web browser"]
---

Intersection Observer API 是一個較新的瀏覽器 API，只要幾行就可以輕鬆方便地實作無限捲軸、lazy loading等需求，而且效能更好。受夠了監聽 scroll event、用 getBoundingClientRect 計算位置？快來看這篇～

![Intersect Ratio](https://developers.google.com/web/updates/images/2016/04/intersectionobserver/intersectratio.png)

圖片來源：[IntersectionObserver’s Coming into View - Google Developer](https://developers.google.com/web/updates/2016/04/intersectionobserver)

## Intersection Observer API

前端經常會需要偵測某個元素是否出現在可視範圍內，像是：

* Lazy loading 圖片：當圖片出現在可視範圍內才開始下載
* 無限捲軸 (Infinite Scroll)：當捲動到頁面的底端時，載入更多內容
* 當元素出現在可視範圍內才顯示動畫
* 計算廣告在頁面上曝光的次數

過往的實作方式是監聽 scroll 事件，並利用 `getBoundingClientRect()` 計算元素和可視範圍的相對位置。

這樣的做法會有的潛在問題是，必須在 main thread 不斷做計算。雖然我們可以很小心地控制每次的處理不要花太多時間，但是我們的網頁有可能同時使用各種第三方套件實現無限捲軸、上百張圖片的 lazy loading、還有廣告成效計算，其中都採用 event handler + main thread 做計算的實現方法，累加起來很容易超過每個 frame 應有的執行時間限制 16ms (1000ms/60 frames ~ 16ms/frame)，造成畫面更新率低於60fps、出現明顯的卡頓。

Intersection Observer API 可以幫你解決這些問題。

Intersection Observer API 的核心精神是「當重疊到某個百分比時，呼叫我的 callback function 做某件事」。他會幫你在背景監控元素的重疊程度，只在你設定的條件發生時呼叫你所提供的 callback，再也不需要時時刻刻佔用main thread去做監控的工作！

注意 Intersection Observer API 並沒有辦法精準確地剛好在重疊了幾個pixel的時候通知你，但是可以涵蓋大多數不需要 100% 準確的使用情境。

## Root 和 Target

在 Intersection Observer API 中有兩個角色：root 和 target。

Root 指的是外層的容器，target 是容器內會出現的元素，root 必須是 target 的 ancestor 元素。

隨著捲軸捲動的程度或樣式的不同，target 的可見程度，可以用一個介於 0 ~ 1 的浮點數來表示。

例如，當捲軸捲到 target 剛好出現在 root 可視範圍或是完整離開可視範圍的那一瞬間，可見程度是 0；當 target 完整的出現在 root 的可視範圍內，可見程度是 1。如果 target 的高度是 root 可視範圍的兩倍，那最高的可見程度只會有 0.5。

以下提供一個簡單的demo，可以觀察看看捲軸捲動時，重疊程度數字的變化：

<p class="codepen" data-height="307" data-theme-id="default" data-default-tab="result" data-user="shubochao" data-slug-hash="GRgWaEW" style="height: 307px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="IntersectionObserver Demo">
  <span>See the Pen <a href="https://codepen.io/shubochao/pen/GRgWaEW">
  IntersectionObserver Demo</a> by Shubo Chao (<a href="https://codepen.io/shubochao">@shubochao</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 創造 Intersection Observer

首先我們需要創造一個 `observer` 物件並指定 root：

```JavaScript
const options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 0.5,
};

const observer = new IntersectionObserver(callback, options);
```

`IntersectionObserver(callback, options)` 接受兩個參數：

* `callback`： 當指定的重疊條件發生時要執行的 callback 函式。
* `options`：
    * `root`：欲觀察的 root 元素，不特別指定或是 `null` 時等於瀏覽器的可視範圍 (browser viewport)。
    * `rootMargin`：用來改變 root 元素觀察的範圍。
    * `threshold`：target的可見程度。可以給浮點數或是給浮點數的 array，例如 `[0, 0.25, 0.5, 0.75, 1]`，每當 target 的可見程度高於 threshold 時，`callback` 都會被觸發。

## 觀察 target

接下來我們要用 `observer.observe()` 指定欲觀察的 target：

```JavaScript
const target = document.querySelector('#listItem');
observer.observe(target);
```

當 target 的可視範圍超過指定的 `threshold`，`callback` 就會被呼叫。

同一個 `observer` 可以同時觀察很多個 target。

## callback 函式

```JavaScript
const callback = (entries, observer) => {
  entries.forEach(entry => {
    // Do something...
  });
}
```

`callback` 函式接受兩個參數：

* `entries` ：[IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 的 array，包含所有可見程度超過 `threshold` 的 target 的資訊。其中幾個常用屬性：
    * `isIntersecting`：target 是否可見，即使只有 1px 也算
    * `intersectionRatio`：target 可見比例 (相對於自身完整高度)
    * 其他請參閱 [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)
* `observer`：`observer` 本身。

## 完整用法範例

```JavaScript
const root = document.querySelector('#root');

const options = {
  root,
  threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
};

const callback = (entries, observer) => {
    entries.forEach(entry => {
      // Do something...
    });
};

const observer = new IntersectionObserver(callback, options);

const target = document.querySelector('#target');
observer.observe(target);
```

## 應用

### 無限捲軸

在文章列表的最後面放一個 [sentinel](https://developers.google.com/web/updates/2016/04/intersectionobserver#intersect_all_the_things) 元素，進入可視範圍表示已至列表最末端，可以載入新的文章：

<p class="codepen" data-height="433" data-theme-id="default" data-default-tab="result" data-user="shubochao" data-slug-hash="NWPpQGG" style="height: 433px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Infinite Scroll with Intersection Observer API">
  <span>See the Pen <a href="https://codepen.io/shubochao/pen/NWPpQGG">
  Infinite Scroll with Intersection Observer API</a> by Shubo Chao (<a href="https://codepen.io/shubochao">@shubochao</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 廣告在可視範圍內出現了多久？

[Timing element visibility with the Intersection Observer API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Timing_element_visibility)

MDN上的範例，有點長就不細說了～

## 支援度

[Can I Use IntersectionObserver?](https://caniuse.com/#feat=intersectionobserver)

約9成的瀏覽器支援度，如果對跨瀏覽器要求不會太嚴格的話可以使用。或是引入 [Polyfill](https://github.com/w3c/IntersectionObserver/blob/master/polyfill/intersection-observer.js)。

## Reference

* [Intersection Observer API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
* [IntersectionObserver’s Coming into View - Google Developer](https://developers.google.com/web/updates/2016/04/intersectionobserver)
* [IntersectionObserver：上篇-基本介紹及使用](https://letswrite.tw/intersection-oserver-basic/)
* [IntersectionObserver：下篇-實際應用 lazyload、進場效果、無限捲動](https://letswrite.tw/intersection-oserver-demo/)
* [IntersectionObserver API 使用教程 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)
