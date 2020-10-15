---
title: "[教學] 用 img srcset 與 HTML5 picture，讓圖片也能RWD"
tags: [rwd, web browser]
redirect_from: /2017/04/27/responsive-image
last_modified_at: 2020/10/15
---

RWD的網頁顯示圖片，經常會遇到問題：同樣的圖片，檔案過大使得在手機上載入速度過慢，但在桌機上又顯得解析度不夠。這篇文章將會教你如何經由設定 `img` 標籤的 `srcset` 屬性以及 HTML5 picture tag，依據裝置解析度載入適當的圖片，在圖片解析度和下載速度之間取得平衡。

## 目錄
{: .no_toc}

- TOC
{:toc}

![coding](/images/coding.jpg)

## TL;DR

1. `img` `srcset`可以根據**螢幕的pixel density**或是**圖片在螢幕上的實際寬度**，決定要載入哪張圖片。
2. 以螢幕的pixel density區分，適用於圖片大小固定的情況。
3. 以圖片在螢幕上的實際寬度區分，適用於圖片會隨螢幕大小變化的情況。
4.  可以使用 HTML5 picture 元素來達成根據不同的 media query 載入不同圖片的效果。

## `img` `srcset`屬性

前端經常會遇到一個狀況：同一張圖片同時需要在桌機與手機版網頁顯示，結果在桌機上很清晰的圖，在手機上看卻很糊；換了一張解析度比較高的圖，結果在手機上的載入速度卻變慢了。

其中一個解決方法是，準備同一張圖不同大小的好幾個版本，並使用`img`的`srcset`屬性，在不同的條件下載入不同的圖片。

不同圖片的載入條件可以根據：

1. 裝置的Pixel Density
2. 圖片顯示在裝置的實際寬度

## 根據裝置的 Pixel Density 載入不同版本的圖片

`srcset` 可以根據螢幕的 pixel density (單位：dpi, dots per inch) 決定要顯示哪張圖。

通常桌機螢幕的pixel density是1x，手機是2x，高階一點的手機 (比較新一點的 iPhone/Google Pixel等) 可以到3x。

如果我們打算同時在桌機版和手機版放一張500px寬的圖片，我們可以出 500px 跟 1000px 的版本，分別命名為 `pic_1x.jpg` 和 `pic_2x.jpg`。

接著我們可以用 `srcset` 來定義不同 pixel density時，要載入哪一張圖片：

~~~jsx
<img src="pic_1x.jpg" srcset="pic_1x.jpg 1x, pic_2x.jpg 2x" />
~~~

### 如何計算 Pixel Density

這裡再稍微詳細解釋一下 pixel density 的意義。

Pixel density 用白話一點的說法就是：單位長度裡面有幾個實體像素，越高就表示螢幕畫質越細緻。

舉例來說：假設有一張圖片，1x 的螢幕用 500個實體像素去呈現的話，那 2x 的螢幕就會用2000個像素去呈現。

那麼，要如何計算出螢幕的pixel density呢？

為了方便，我們定義 1x 如下：

> 1x = 觀看距離28-inch的96dpi螢幕的pixel density，

則

> 一個螢幕的pixel density = 這個螢幕跟96dpi的螢幕在相同等效距離比較之下的dpi的倍率。

接著，我們只要知道螢幕的dpi，就可以計算 pixel density了。

例如：180dpi的手機螢幕，觀看距離是18-inch。一個觀看距離28-inch的96dpi螢幕，在18-inch的距離觀看時，等效pixel density為96 * (28/18) = 150 dpi。所以這個手機螢幕的pixel density = 180/150 = 1.2x。

詳細的計算方式可以參考 [High DPI Images for Variable Pixel Densities](https://www.html5rocks.com/en/mobile/high-dpi/)。

### 什麼情況適合使用 pixel density 來區分載入圖片的版本？

如果需要圖片寬度在不同的裝置都呈現固定大小（例如：在桌機和手機都要是 500px），用 pixel density 會是個好選擇。

但是實際上在 RWD 更常見的情況是：圖片會隨著螢幕的大小而等比例縮放，並非固定寬度。

因此，我接下來要介紹的方法會更加實用！

## 根據圖片寬度載入不同版本的圖片

`srcset` 可以根據圖片實際在螢幕上的寬度 (單位：pixel數) 決定要顯示哪張圖。

~~~jsx
<img
  src="pic_500x500.jpg"
  srcset="pic_500x500.jpg 500w, pic_1000x1000.jpg 1000w"
/>
~~~

這種設定下，瀏覽器不會管你是桌機或是手機螢幕，只會根據實體像素的數量去決定要載入哪張圖片。

桌機上500px或是手機上顯示250px，會用 `pic_500x500.jpg`的版本，而桌機上1000px或手機上的500px會用 `pic_1000x1000.jpg` 的版本。

### 如何計算寬度？

寬度的算法是：

> 寬度＝圖片寬度 (pixel) * (pixel density)

預設圖片寬度 = 100%的viewport寬度。

1. viewport = 1000px, 1x的螢幕，圖片寬度 = 1000w。
2. viewport = 500px，2x的螢幕上，圖片寬度 = 1000w。（在pixel density = 2x的螢幕上，顯示寬500px的圖片實際上需要1000px）

如果圖片寬度不等於viewport寬度，需透過 `sizes` attribute 提示瀏覽器，細節後述。

### 什麼情況適合使用寬度來區分載入圖片的版本？

適合使用寬度的情況是，圖片寬度會隨螢幕大小變動。這種情況下，比較寬的圖片可以同時讓低解析度的寬螢幕和高解析度的小螢幕使用。

## 為圖片指定大小：`sizes`屬性

假設圖片寬度小於viewport寬度，例如：用 CSS 指定圖片樣式 `img { width: 50vw; }`，那用小張的圖就能清楚呈現了。這種情況可以用 img `sizes` 屬性提示瀏覽器圖片寬度。

上面的公式可以修改成：

> 圖片寬度 = sizes (vw) * 圖片寬度 (pixel) * Pixel Density

例如：

假設圖片寬度 = 50vw，viewport寬度 = 400px, 螢幕pixel density = 2x，則圖片實際寬度 = 400 * 2 * 0.5 = 400w。

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

**注意：圖片寬度也得在CSS裡定義一次**。`sizes`只是提示瀏覽器這張圖預計大小，幫助瀏覽器決定該下載哪張圖，而實際圖片的縮放樣式還是靠 CSS。

### 為何需要額外的 `sizes` 屬性？有 CSS 不就足夠了嗎？

因為瀏覽器資源的載入順序是：下載 HTML -> 解析 HTML -> 下載 CSS -> 解析 CSS，如果在HTML裡定義 `sizes`，可以讓瀏覽器在尚未下載 CSS 之前，預先知道圖片的實際寬度，可以在 CSS 下載並解析之前先決定該下載哪個版本的圖片。

## HTML5 `<picture>`

如果 `srcset` 沒辦法滿足你的需求，那你還可以試試 HTML5 的 `<picture>`！

相較於每個 `<img>` 只能定義一組 `srcset`，每個 `<picture>` 內可以定義多組 `source`，其中每個 `source` 可以各自用 `media` 屬性指定 media query，並且用 `srcset` 定義各自的圖片集。

基本用法如下：

```html
<picture>
    <source media="(min-width: 750px)"
            srcset="images/horses-1600_large_2x.jpg 2x,
                    images/horses-800_large_1x.jpg" />
    <source media="(min-width: 500px)"
            srcset="images/horses_medium.jpg" />
    <img src="images/horses_small.jpg" alt="Horses in Hawaii">
</picture>
```

這個寫法的好處是可以用 media query 更精細地控制要顯示的圖片，例如小螢幕和大螢幕顯示不同的圖片集，並各自針對兩種不同的圖片設置高清和一般的版本。

其他常見的用途包括：

1. 提供同一張圖片的不同版本 (使用 webp，不支援的情況下 fall back to jpg)
2. 針對小螢幕，顯示同一張圖片但細節較少的版本 (例如裁切過後的)

## Reference

* [Responsive Images - Udacity](https://classroom.udacity.com/courses/ud882)
* [High DPI Images for Variable Pixel Densities](https://www.html5rocks.com/en/mobile/high-dpi/)
* [img - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Example_4_Using_the_srcset_and_sizes_attributes)
* [&lt;picture&gt;: The Picture element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
