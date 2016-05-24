# iOS Toggle Button in Pure CSS

最近看到一個可以用CSS自訂checkbox的技巧，就想到可以利用類似的技巧，做一個iOS的toggle button。

## Checkbox Hack

checkbox通常是由一個核取方塊(input)加一段文字(label)構成：

~~~html
<input type="checkbox" id="chkbox" />
<label for="chkbox">Some description</label>
~~~

通常我們會想要改變方塊的樣式，但是input可以自訂的樣式並不多。所以今天要用的技巧是：直接把input藏起來，用虛擬元件來做一個假的方塊。

因為input和label通常會一起搭配使用，所以可以用label::before來做假的方塊。這個技巧最特別的一點是，利用CSS的相鄰兄弟選擇器(Adjacent sibling selectors)，可以對沒勾和勾的狀態，也就是input+label::before和input:checked+label::before分別設定樣式。很神奇吧！

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

⬆︎ 打勾的時候勾勾變成✓，背景會變成黃綠色。

~~~css
input[type="checkbox"]:disabled + label::before {
  background: #DDD;
  color: #AAA;
}
~~~

⬆︎ 也可以設定disabled的樣式喔。

~~~css
input[type="checkbox"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
~~~
⬆︎ 把原本的方框藏起來。

## iOS Toggle Button

要做成iOS的toggle button的樣子，其實就是做一個橢圓形加一個圓形。我用label::before做橢圓形，label::after做圓形。

~~~css

~~~

checked的時候調整圓形的位置，把橢圓形的背景變成綠色。


1. line-height == height

=> you cannot use img along with span, text, etc...