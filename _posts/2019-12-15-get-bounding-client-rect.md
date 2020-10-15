---
title: "[教學] Element.getBoundingClientRect()"
tags: ["javascript", "web browser"]
last_modified_at: 2020/10/15
---

Element.getBoundingClientRect() 回傳元素的大小，以及其相對於可視範圍 (viewport) 的位置。這篇文章將會教你 getBoundingClientRect() 的用法，以及 left、top、right、bottom、width、height 等位置及大小的屬性，並教你如何搭配 window.pageXOffset 和 window.pageYOffset 轉換成絕對位置。

## 目錄
{: .no_toc}

- TOC
{:toc}

<br>

![Rect](https://mdn.mozillademos.org/files/15087/rect.png)

## `getBoundingClientRect()` 用法

如果要取得元素 `elem` 「相對於視窗」的座標，我們可以使用 `elem.getBoundingClientRect()` 這個方法。他會量測元素包含 border 的大小，並回傳一個 [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) 物件，其中包含了 `x`/`y`/`width`/`height`/`top`/`right`/`bottom`/`left` 等屬性。

## `getBoundingClientRect()` 屬性說明

* `x`/`left`：`elem` 左上角的 x 座標
* `y`/`top`：`elem` 左上角的 y 座標
* `width`：`elem` 的寬度，通常等於 `offsetWidth`
* `height`：`elem` 的高度，通常等於 `offsetHeight`
* `right`：`elem` 右下角的 x 座標
* `bottom`：`elem` 右下角的 y 座標

這些屬性有一些需要注意的事項：

1. **座標可能是負值**，例如：當元素的頂端超出視窗頂端的範圍時，`top`就會變成負的。
2. IE 跟 Edge 沒有 `x` 跟 `y` 屬性，但可用 `left` 跟 `top`。
3. `rect.width` 跟 `rect.height` 可能有小數，而 `offsetWidth`/`offsetHeight` 會回傳整數。**如果需要精確的大小則需要用到 getBoundingClientRect()。**
4. 一般來說 `rect.width` 等於 `elem.offsetWidth`，但 `elem.offsetWidth` 是 layout 的大小，而 `width` 是實際 rendering 的大小。比如說用了 `transform: scale(0.5)`，寬度 200px 的元素在空間上佔據的位置一樣是 200px (`offsetWidth`)，但是視覺實際看到只有 100px (`rect.width`)。可以看以下的例子：

<p class="codepen" data-height="336" data-theme-id="default" data-default-tab="js,result" data-user="shubochao" data-slug-hash="RwNGJoy" style="height: 336px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="RwNGJoy">
  <span>See the Pen <a href="https://codepen.io/shubochao/pen/RwNGJoy">
  RwNGJoy</a> by Shubo Chao (<a href="https://codepen.io/shubochao">@shubochao</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<br>

想了解更多 `offsetWidth`/`offsetHeight` 細節可以看這篇：

> 延伸閱讀：[[教學] 一次搞懂 clientHeight/clientWidth/offSetHeight/offsetWidth/scrollHeight/scrollWidth/scrollTop/scrollLeft 的區別](/element-size-scrolling)

## 用 window.pageXOffset 和 window.pageYOffset 算出絕對位置

很多時候我們需要的是「絕對位置」，也就是元素相對於「文件左上角」的座標，可惜的是瀏覽器並沒有提供一個原生的值可以讓我們使用。

幸好有個很簡單的公式可以幫助我們很方便地計算出絕對位置，那就是「絕對位置座標系和視窗座標系之間的差距」等於捲軸已捲動的長度，也就是 `[window.pageXOffset, window.pageYOffset]`。

所以，絕對位置的計算方式如下：

```JavaScript
const x = window.pageXOffset + rect.left;
const y = window.pageYOffset + rect.top;
```

即使元素在視窗的範圍以外，上面的等式也成立，因為 `top/left` 是視窗座標系的座標，當超出視窗範圍時會變負值。

想知道更多 `pageXOffset`/`pageYOffset` 的細節，可以看這篇：

> 延伸閱讀：[[教學] 一次搞懂 clientHeight/clientWidth/offSetHeight/offsetWidth/scrollHeight/scrollWidth/scrollTop/scrollLeft 的區別](/element-size-scrolling)

## Reference
* [Element.getBoundingClientRect() - MDN
](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
* [Determining the dimensions of elements - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements)
* [Coordinates - javascript.info](https://javascript.info/coordinates)
