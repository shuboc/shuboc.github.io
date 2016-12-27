---
layout: post
title: "iOS Toggle Button in Pure CSS"
---

<p data-height="224" data-theme-id="0" data-slug-hash="GZVKgN" data-default-tab="result" data-user="shubochao" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/shubochao/pen/GZVKgN/">iOS toggle button</a> by Shubo Chao (<a href="http://codepen.io/shubochao">@shubochao</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

最近在[CSS Secrets](http://www.tenlong.com.tw/items/9863478741?item_id=1010373)裡面看到一個可以用CSS自訂checkbox的技巧，覺得還滿酷的！今天就來應用類似的技巧，做一個iOS的toggle button吧。

## Checkbox Hack

如果我們想要用CSS自訂核取方塊的樣式，該怎麼做呢？input可以自訂的CSS樣式並不多。作者提到的技巧是：直接把input藏起來，用虛擬元件來做一個假的方塊。

checkbox通常是由一個核取方塊(input)加一段文字(label)構成：

~~~markup
<input type="checkbox" id="chkbox" />
<label for="chkbox">Some description</label>
~~~

因為input和label通常會一起搭配使用，所以可以用label::before來做假的方塊。最巧妙的地方在於，利用CSS的相鄰兄弟選擇器(Adjacent sibling selectors)，可以分別對沒勾和勾的狀態，也就是input+label::before和input:checked+label::before分別設定樣式。

<p data-height="141" data-theme-id="0" data-slug-hash="dMBEyo" data-default-tab="result" data-user="shubochao" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/shubochao/pen/dMBEyo/">customized-checkbox</a> by Shubo Chao (<a href="http://codepen.io/shubochao">@shubochao</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

⬆︎ 自訂的核取方塊：

~~~css-extras
input[type="checkbox"] + label::before {
  content: '\a0';
  display: inline-block;
  border-radius: 0.2em;
  background: #FFF;
  border: 1px solid #CCC;
}
~~~

⬆︎ 用pseudo element做一個白底的方形，替代原本的方塊。

~~~css-extras
input[type="checkbox"]:checked + label::before {
  content: '\2713';
  background: yellowgreen;
}
~~~

⬆︎ 打勾的時候顯示✓，背景變成黃綠色。

~~~css-extras
input[type="checkbox"]:disabled + label::before {
  background: #DDD;
  color: #AAA;
}
~~~

⬆︎ 也可以設定disabled時的樣式喔。

~~~css-extras
input[type="checkbox"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
~~~
⬆︎ 把原本的方框藏起來。

## iOS Toggle Button

### Positioning

iOS的toggle button，其實沒啥學問，就只是一個橢圓形加一個圓形的組合ＸＤ。正好虛擬元素剛也有兩個可以用，這邊拿label::before做橢圓形，另外一個label::after做圓形。

~~~css-extras
.list-item input[type="checkbox"] + label {
  position: relative;
  width: 100%;
}

.list-item input[type="checkbox"] + label::after {
  position: absolute;
  right: 24px;
}

.list-item input[type="checkbox"]:checked + label::after {
  position: absolute;
  right: 0;
}
~~~

⬆︎ 圓形和橢圓形的定位，是用position: absolute將label定位在相對母元素(label)右側的位置。分別在checked和unchecked的時候調整圓形的位置。

### Change Color: Using Box-Shadow

~~~css-extras
.list-item input[type="checkbox"] + label::before {
  box-shadow: 0 0 0 gray inset;
  transition: all 0.25s ease-in-out 0s;
}

.list-item input[type="checkbox"]:checked + label::before {
  box-shadow: 0 0 100px limegreen inset;
}
~~~

⬆︎ 橢圓型變色的部分，是用不同顏色和範圍的內凹陰影，加上CSS transition做的。光靠設定背景的顏色，不知道要怎麼做出從中心開始變色的效果...

### Vertical Alignment

置中效果最後是用flexbox完成的。一開始試了很多方法，例如：

* 調整line-height = height (似乎只對單行的純文字有效，加進img span 虛擬元素等等就歪了)
* 不死心，試著調整`label * { vertical-align: middle;}`，還是會上下飄。加進虛擬元素似乎會改變一個元素的高度，讓他垂直對不齊。如果是img之類的東西也沒辦法用這方法跟文字同時置中對齊。放棄。

~~~css-extras
.list-item {
  display: flex;
  align-items: center;
}

.list-item input[type="checkbox"] + label {
  flex: 1;
}
~~~

⬆︎ 最後還是用flexbox的align-items屬性，瞬間把所有事情都搞定ＸＤ。然後設定label的flex: 1將寬度延展到最長，按鈕才能定位在最右邊。

~~~css-extras
@mixin vertical-align {
  top: 50%;
  transform: translateY(-50%);
}
~~~

圓形和橢圓形的對齊，只要垂直對齊母元素就可以了，因為母元素已經用flexbox垂直置中了。子元素已經用了absolute絕對定位（因為要對齊右邊），直接從母元素最上面往下移50%，再往上移回自己的50%，就水平對齊母元素了。

我自己覺得這個對齊的技巧對虛擬元素還挺實用的，因為虛擬元素通常需要相對母元素定位，特別是水平或垂直置中。（[這邊](/2016/05/08/css-balloon.html)也有用到。）

## Conclusion

今天用了虛擬元素來自訂checkbox。最棒的地方在於，HTML還是和原本一樣簡潔，也不用額外的JS！

~~~markup
<input type="checkbox" id="chkbox" />
<label for="chkbox">Some description</label>
~~~

今天又多學會了一個技巧，但是想想，做這個也是挺無用的呀～不過至少在做的過程中得到了一些小小樂趣和成就感，也是挺不錯的～

### Reference

* [CSS版面配置](http://zh-tw.learnlayout.com/position.html)
* [iOS 6 switch style checkboxes with pure CSS](http://lea.verou.me/2013/03/ios-6-switch-style-checkboxes-with-pure-css/)~~~markup
