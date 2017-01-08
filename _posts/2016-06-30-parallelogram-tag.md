---
layout: post
title: "CSS 平行四邊形"
tags: [css]
---

今天的主題是平行四邊形的標籤。稍稍改變一下平淡無奇的長方形標籤，或許能替網頁增添一些活潑的感覺？實際在網頁中運用大概像這樣子：

<p data-height="421" data-theme-id="0" data-slug-hash="KMaELj" data-default-tab="result" data-user="shubochao" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/shubochao/pen/KMaELj/">parallelogram</a> by Shubo Chao (<a href="http://codepen.io/shubochao">@shubochao</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

（參考資料：[CSS Secrets](http://www.tenlong.com.tw/items/9863478741?item_id=1010373)）

# 用CSS transform製作長方形

將長方形的元素套用skew的效果後，就變成平行四邊形了。

~~~css-extras
transform: skewX(-30deg);
~~~

問題：標籤裡的文字也會跟著變斜。

今天又要使用CSS的一千零一招：運用擬似元素(pseudo element)。

原理是平行四邊形的部分改用pseudo element呈現，只把歪斜的效果套用在pseudo element上。

母元素:

~~~css-extras
.tag {
    display: inline-block;
    position: relative;
}
~~~

Pseudo element:

~~~css-extras
.tag::before {
    position: absolute;
    z-index: -1;
    content: '';
    top: 0; right: 0; bottom: 0; left: 0;
    background: #58a;
    transform: skew(-30deg);
}
~~~

幾個重點：

1. 設定position屬性，將母元素設成relative，pseudo element設成absolute，表示pseudo element相對於母元素定位。
2. top: 0; right: 0; bottom: 0; left: 0; 可以讓pseudo element大小隨母元素改變。
3. 設定z-index讓pseudo element不要蓋住母元素。

# 結論

最後的設計用上了平行四邊形的標籤，也做了類似時間軸的設計（同樣也用了pseudo element）。終於領悟到pseudo element的妙用，對於減少（因為特殊的版面設計而產生的）多餘的HTML Tag非常有用，真的是個很棒的發明呢～

# 參考資料

* [CSS Secrets](http://www.tenlong.com.tw/items/9863478741?item_id=1010373)
* [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
