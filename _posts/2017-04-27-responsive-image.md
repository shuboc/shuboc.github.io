---
title: "[教學] 響應式圖片(Responsive Image): 使用img srcset屬性"
tags: [rwd, html5]
redirect_from: /2017/05/20/javascript-promise
---

這篇要介紹響應式(Responsive)網頁如何利用`img`標籤的`srcset`屬性，為一張圖片指定多個版本的原始路徑，為不同的裝置載入大小最適合的圖片。

## TL;DR

1. `img` `srcset`可以根據**螢幕的pixel density**或是**圖片在螢幕上的實際寬度**，決定要載入哪張圖片。
2. 以螢幕的pixel density區分，適用於圖片大小固定的情況。
3. 以圖片在螢幕上的實際寬度區分，適用於圖片會隨螢幕大小變化的情況。

## `img` `srcset`屬性

原始圖片太小，在網頁上放大會變模糊；原始圖片太大，載入速度會變慢。因此比較好的策略是準備同一張圖不同大小的好幾個版本，並使用`img`的`srcset`屬性，在不同的條件下載入不同的圖片。

不同圖片的載入條件可以根據：

1. 裝置的Pixel Density
2. 圖片顯示在裝置的實際寬度

## 根據裝置的Pixel Density載入圖片

根據螢幕的pixel density (單位：dpi, dots per inch)決定要秀哪張圖。通常桌機螢幕是1x，手機是2x。

~~~jsx
<img src="pic_1x.jpg" srcset="pic_1x.jpg 1x, pic_2x.jpg 2x" />
~~~

若我們定

> 1x = 觀看距離28-inch的96dpi螢幕的pixel density，

則

> 一個螢幕的pixel density = 這個螢幕跟96dpi的螢幕在相同距離比較之下的dpi的倍率。

例如：180dpi的手機螢幕，觀看距離是18-inch。一個觀看距離28-inch的96dpi螢幕，在18-inch的距離觀看時，等效pixel density為96 * (28/18) = 150 dpi。所以這個手機螢幕的pixel density = 180/150 = 1.2x。

詳細的計算方式可以參考[這篇](https://www.html5rocks.com/en/mobile/high-dpi/)。

適合使用pixel density的情況是：圖片寬度固定，但需要支援不同pixel density的螢幕。

## 根據圖片寬度載入圖片

根據圖片實際在螢幕上的寬度 (單位：pixel數) 決定要秀哪張圖。

~~~jsx
<img
  src="pic_500x500.jpg"
  srcset="pic_500x500.jpg 500w, pic_1000x1000.jpg 1000w"
/>
~~~

寬度的算法是：

> 寬度＝圖片寬度 (pixel) * (pixel density)

例如：

1. viewport = 1000px, 1x的螢幕，圖片寬度 = 1000w。
2. viewport = 500px，2x的螢幕上，圖片寬度 = 1000w。（在pixel density = 2x的螢幕上，顯示寬500px的圖片實際上需要1000px）

注意：預設圖片寬度 = 100%的viewport寬度。（如果圖片寬度不等於viewport寬度，可透過`sizes` attribute指定。）

適合使用寬度的情況是，圖片寬度會隨螢幕大小變動。這種情況下，比較寬的圖片可以同時讓低解析度的寬螢幕和高解析度的小螢幕使用。

## 為圖片指定大小：`sizes`屬性

假設圖片寬度小於viewport寬度，實際上的寬度可能用小張的圖就能清楚呈現了。這種情況可以用`sizes` attribute指定圖片寬度。

上面的公式可以修改成：

> 圖片寬度 = sizes (vw) * 圖片寬度 (pixel) * (pixel density)

例如：

假設圖片佔螢幕的50%寬度，viewport寬度 = 400px, 螢幕pixel density = 2x，則圖片實際寬度 = 400px * 2 * 0.5 = 400px。

~~~jsx
<img
  src="pic_500x500.jpg"
  srcset="pic_500x500.jpg 500w, pic_1000x1000.jpg 1000w"
  sizes="50vw"
/>
~~~

以這個例子來說，只要下載500x500的圖就夠用了。

`sizes`單位可以用`px`或`vw`，也支援media query的形式：

~~~jsx
<img src="clock-demo-thumb-200.png"
      alt="Clock"
      srcset="clock-demo-thumb-200.png 200w,
          clock-demo-thumb-400.png 400w"
      sizes="(min-width: 600px) 200px, 50vw">
~~~

**注意：只有在srcset以w為單位時才可使用`sizes`。**

**注意：圖片寬度也得在CSS裡定義一次**。`sizes`只是告訴瀏覽器該下載哪張圖，實際圖片的縮放還是靠CSS。

### Why `sizes`?

在HTML裡定義`sizes`，瀏覽器尚未下載CSS之前就能預先知道圖片的實際寬度，也就能知道要先下載哪張圖了。

## Reference

* [Responsive Images - Udacity](https://classroom.udacity.com/courses/ud882)
* [High DPI Images for Variable Pixel Densities](https://www.html5rocks.com/en/mobile/high-dpi/)
* [img - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Example_4_Using_the_srcset_and_sizes_attributes)
