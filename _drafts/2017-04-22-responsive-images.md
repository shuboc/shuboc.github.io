# Responsive Images - Udacity (QN)



resolution vs dpi vs pixel density

普通桌機螢幕 = 1x, 手機 = 2x

畫質差 -> DPI高的螢幕上看起來很糊
畫質好 -> DPI低的裝置上載入很慢

[圖片本身的寬度] 大於 [在螢幕上的實際寬度]，看起來就不會太模糊。

[圖片本身的寬度] 遠超過 [在螢幕上的實際寬度]，就會造成檔案大小的浪費。

根據寬度載入不同圖片是個好策略。一種可能的分法：

1. img\_250.jpg: 小於250px
2. img\_500.jpg: 小於500px
3. img\_1000.jpg: 500px以上

## img srcset

HTML5的srcset可以針對不同的裝置顯示不同的圖片

1. 裝置的Pixel Density
2. 圖片顯示在螢幕的實際Width

### By Pixel Density

根據螢幕的PPI(Points Per Inch)決定要秀哪張圖。

~~~html
<img src="pic_1x.jpg" srcset="pic_1x.jpg 1x, pic_2x.jpg 2x" />
~~~

PPI通常桌機螢幕是1x，手機是2x。

x的意思是，一個螢幕跟96ppi的螢幕在相同距離相比之下，ppi的倍率。

例如：180ppi的手機螢幕，假設看的距離是18-inch。拿一個觀看距離28-inch的96ppi螢幕相比，在18-inch的等效ppi為96 * (28/18) = 150 ppi，所以這個手機螢幕的pixel density = 180/150 = 1.2x。

https://www.html5rocks.com/en/mobile/high-dpi/

### By Width

根據寬度（圖片實際在螢幕上的pixel數量）決定要秀哪張圖。

~~~html
<img
  src="pic_500x500.jpg"
  srcset="pic_500x500.jpg 500w, pic_1000x1000.jpg 1000w"
/>
~~~

我們需要為同一張圖，提供兩種不同寬度的版本，分別為500px和1000px。

寬度算法如下：

**寬度＝圖片寬度(pixel) * pixel density**

（圖片寬度可透過sizes指定。如果不指定，預設圖片寬度＝viewport寬度。）

例如：

1. viewport=1000px, 1x的螢幕，圖片寬度=1000w。
2. viewport=500px，2x的螢幕上，圖片寬度=1000w。（在pixel density 2x的螢幕上，寬500px的圖片實際上需要1000px）

## img sizes

假設圖片寬度不等於viewport寬度，就要用`sizes`告訴瀏覽器各種情況下的圖片寬度。（HTML內定義sizes，不需等CSS瀏覽器就知道該下載哪張圖片。）

1. 圖片寬度＝viewport寬度 * 解析度（不指定sizes）
2. 圖片寬度＝sizes * 解析度。

Why?

(O) screen resolution
(O) image dimension (srcset w value)
(X) image actual display size

view port = 400px, resolution = 2x, width = 50vw => 400 * 2 * 0.5 = 400px (image dimension)

### vw

1. sizes="50vw"

2. sizes="(max-width: 250px) 100vw, 50vw"

基本上跟CSS裡描述的一樣，只是因為CSS比HTML慢parse，寫在HTML裡可以讓browser在parse CSS前就去下載尺寸最適合的一張。

注意：sizes描述的寬度，也需要寫在ＣＳＳ裡。

sizes裡的media query只是告訴瀏覽器在某個viewport寬度下的display size，方便計算image dimension (% width in `sizes` * image dimension (w in srcset))；ＣＳＳ才能讓圖片改變寬度。

注意：只有在srcset使用width descriptor (w)的時候才有用。

## picture

~~~html
<picture>
  <source
    media="(min-width: 1000px)"
    srcset="large_1x.jpg 1x, large_2x.jpg 2x"
  />
  <source
    media="(min-width: 500px)"
    srcset="medium_1x.jpg 1x, medium_2x.jpg 2x"
  />
  <img src="small.jpg" />
</picture>
~~~
