---
title: "[教學] 如何用 getBoundingClientRect 計算元素在視窗中的相對與絕對位置"
tags: ["javascript", "web browser"]
last_modified_at: 2020/03/24
---

如何取得元素在視窗中的相對以及絕對位置，是前端工程師最常需要處理的問題之一。這篇文章將會教你如何用 `getBoundingClientRect()` 取得元素的相對位置，以及如何用一條非常簡單的公式轉換成絕對位置。

![Rect](https://mdn.mozillademos.org/files/15087/rect.png)

## `getBoundingClientRect()`

如果要取得元素 `elem` 「相對於視窗」的座標，我們可以使用 `elem.getBoundingClientRect()` 這個方法。他會量測元素包含 border 的大小，並回傳一個 [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) 物件，其中包含了 `x`/`y`/`width`/`height`/`top`/`right`/`bottom`/`left` 等屬性。

* `x`/`left`：`elem` 左上角的 x 座標
* `y`/`top`：`elem` 左上角的 y 座標
* `width`：`elem` 的寬度，通常等於 `offsetWidth`
* `height`：`elem` 的高度，通常等於 `offsetHeight`
* `right`：`elem` 右下角的 x 座標
* `bottom`：`elem` 右下角的 y 座標

* 注意：**座標可能是負值**，例如：當元素的頂端超出視窗頂端的範圍時，`top`就會變成負的。
* 注意：IE 跟 Edge 沒有 `x` 跟 `y` 屬性，但可用 `left` 跟 `top`。
* 注意：`rect.width` 跟 `rect.height` 可能有小數，而 `offsetWidth`/`offsetHeight` 會回傳整數。
* 注意：一般來說 `rect.width` 等於 `elem.offsetWidth`，但 `elem.offsetWidth` 是 layout 的大小，而 `width` 是實際 rendering 的大小。比如說用了 `transform: scale(0.5)`，寬度 200px 的元素在空間上佔據的位置一樣是 200px (`offsetWidth`)，但是視覺實際看到只有 100px (`rect.width`)。

<p class="codepen" data-height="336" data-theme-id="default" data-default-tab="js,result" data-user="shubochao" data-slug-hash="RwNGJoy" style="height: 336px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="RwNGJoy">
  <span>See the Pen <a href="https://codepen.io/shubochao/pen/RwNGJoy">
  RwNGJoy</a> by Shubo Chao (<a href="https://codepen.io/shubochao">@shubochao</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

如果還不熟 `offsetWidth`/`offsetHeight`，可以先看這篇：

延伸閱讀：[[教學] 一次搞懂 clientHeight/clientWidth/offSetHeight/offsetWidth/scrollHeight/scrollWidth/scrollTop/scrollLeft 的區別](/element-size-scrolling)

## 絕對位置

很多時候我們需要的是「絕對位置」，也就是元素相對於「文件左上角」的座標，可惜的是瀏覽器並沒有提供一個原生的值可以讓我們使用。

但是有個很重要的事實，可以幫助我們很方便地計算出絕對位置，那就是「絕對位置座標系和視窗座標系之間的差距」等於捲軸已捲動的長度，亦即 `[window.pageXOffset, window.pageYOffset]`。

所以，絕對位置的計算方式如下：

```JavaScript
const x = window.pageXOffset + rect.left;
const y = window.pageYOffset + rect.top;
```

即使元素在視窗的範圍以外，上面的等式也成立，因為 `top/left` 是視窗座標系的座標，當超出視窗範圍時會變負值。

如果還不熟 `pageXOffset`/`pageYOffset`，可以先看這篇：

延伸閱讀：[[教學] 一次搞懂 clientHeight/clientWidth/offSetHeight/offsetWidth/scrollHeight/scrollWidth/scrollTop/scrollLeft 的區別](/element-size-scrolling)

## Reference
* [Element.getBoundingClientRect() - MDN
](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
* [Determining the dimensions of elements - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements)
* [Coordinates - javascript.info] (https://javascript.info/coordinates)
