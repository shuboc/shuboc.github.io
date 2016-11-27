# Critical Rendering Path

## What goes into a frame?

Parse HTML

=> Build DOM & CSSOM  to Render Tree (element + style) (*Recalculate Styles*)

=> layout算出元素實際的長寬和位置 (*Layout*)

=> 實際在螢幕上畫出pixel，raster(在螢幕上描點)，畫出長方形(*Paint*)

=> 把畫好的layer疊起來(*Composite*)

## Layout and Paint

1. `margin-left` (those will change dimension)

JS > Style > Layout > Paint > Composite

2. `color` (those only changes appearance)

JS > Style > -- > Paint > Composite

3. `transform`

JS > Style > -- > Paint > Composite

[csstriggers.com](https://csstriggers.com/)

# Styles and Layout

## Selector Matching

Selector Matching越簡單越快。（在CSSOM tree裡面上下搜尋的次數越少越好）

##Layout Thrashing

render步驟：JS > Style > Layout > Paint > Composite

~~~jsx
for (var p = 0; p < paragraphs; ++p) {
  var blockWidth = greenBlock.offsetWidth;
  paragraph[p].style.width = blockWidth + 'px';
}
~~~

JS讀offsetWidth需要先layout才知道，所以迴圈的每一輪都會重跑一次layout，稱為Forced Synchronous Layout (FSL)

layout完馬上改變style，導致迴圈的下一輪又要重新layout，在JS執行的階段做多次的FSL，導致執行時間超過一個frame，稱作Layout Thrashing。

解法：只讀一次style，可以避掉迴圈重複layout的步驟，並且batch修改style

~~~jsx
var blockWidth = greenBlock.offsetWidth;
for (var p = 0; p < paragraphs; ++p) {
  paragraph[p].style.width = blockWidth + 'px';
}
~~~

# Compositing and Painting

## Painting

Chrome DevTool > More Tools > Rendering > Paint Flashing

在網頁上操作時可以看到哪些部分被重繪。

## Composite

頁面上的元素可以分成不同的layer，在composite的階段會把畫好的layer疊在一起，變成最終呈現在螢幕上的樣子。

例如頁面上有主頁和menu兩個元素，menu會從畫面側邊滑入/滑出。瀏覽器可以像皮影戲一般每個frame都重畫(Painting)主頁和Menu，但是painting是很花資源的。

瀏覽器可以預先在Paint階段分別畫好主頁和menu兩個layer，composite階段只要調整menu的水平位置，並且依位置蓋住主頁。之後的frame就可以略過Painting的步驟了，因為已經畫過了。

## 如何產生layer

No transform hack:

~~~css
// Chrome, Firefox
will-change: transform; // or any visual property
// Safari
transform: translateZ(0);
~~~

可以針對一些資源做優化。
