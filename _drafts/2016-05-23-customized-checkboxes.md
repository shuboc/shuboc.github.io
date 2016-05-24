---
layout: post
title: "iOS Toggle Button in Pure CSS"
---

<p data-height="224" data-theme-id="0" data-slug-hash="GZVKgN" data-default-tab="result" data-user="shubochao" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/shubochao/pen/GZVKgN/">iOS toggle button</a> by Shubo Chao (<a href="http://codepen.io/shubochao">@shubochao</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

最近在[CSS Secrets](http://www.tenlong.com.tw/items/9863478741?item_id=1010373)裡面看到一個可以用CSS自訂checkbox的技巧，聯想到可以利用類似的技巧，做一個iOS的toggle button。

## Checkbox Hack

如果我們想要用CSS自訂核取方塊的樣式，該怎麼做呢？input可以自訂的CSS樣式並不多。作者提到的技巧是：直接把input藏起來，用虛擬元件來做一個假的方塊。

checkbox通常是由一個核取方塊(input)加一段文字(label)構成：

~~~html
<input type="checkbox" id="chkbox" />
<label for="chkbox">Some description</label>
~~~

因為input和label通常會一起搭配使用，所以可以用label::before來做假的方塊。這個技巧最聰明的地方在於，利用CSS的相鄰兄弟選擇器(Adjacent sibling selectors)，可以分別對沒勾和勾的狀態，也就是input+label::before和input:checked+label::before分別設定樣式。

下面示範自訂的核取方塊：

<p data-height="141" data-theme-id="0" data-slug-hash="dMBEyo" data-default-tab="result" data-user="shubochao" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/shubochao/pen/dMBEyo/">customized-checkbox</a> by Shubo Chao (<a href="http://codepen.io/shubochao">@shubochao</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

~~~css
input[type="checkbox"] + label::before {
  content: '\a0';
  display: inline-block;
  border-radius: 0.2em;
  background: #FFF;
  border: 1px solid #CCC;
}
~~~

⬆︎ 用pseudo element做一個方形代替方框。

~~~css
input[type="checkbox"]:checked + label::before {
  content: '\2713';
  background: yellowgreen;
}
~~~

⬆︎ 打勾的時候顯示✓，背景變成黃綠色。

~~~css
input[type="checkbox"]:disabled + label::before {
  background: #DDD;
  color: #AAA;
}
~~~

⬆︎ 也可以設定disabled時的樣式喔。

~~~css
input[type="checkbox"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
~~~
⬆︎ 把原本的方框藏起來。

## iOS Toggle Button

iOS的toggle button，其實就只是一個橢圓形加一個圓形的組合ＸＤ。正好虛擬元素剛也有兩個可以用，我就拿label::before做橢圓形，另外一個label::after做圓形。

~~~css
.list-item input[type="checkbox"] + label {
  position: relative;
  width: 100%;
  /* Ignore the rest... */
}

.list-item input[type="checkbox"] + label::after {
  content: "";
  display: inline-block;
  position: absolute;
  right: 24px;
  /* Ignore the rest... */
}

.list-item input[type="checkbox"]:checked + label::after {
  right: 0;
  border: 1px solid limegreen;
}
~~~

⬆︎ 圓形的部分，將label設成relative定位，將label::after設成absolute定位，定位在相對母元素(label)右側的位置，並分別在checked和unchecked的時候調整圓形的位置。



置中


1. line-height == height

=> you cannot use img along with span, text, etc...