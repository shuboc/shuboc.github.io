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

# App Lifecycles

RAIL (Response, Animate, Idle, Load)

載入順序：Load > Idle > Animate > Response

|Item|Time|Description
|---|---|---|
|Response|100ms|使用者與頁面互動到頁面反饋的間隔|
|Animate|16ms|60fps => 1000ms/60f = 16ms/f|
|Idle|50ms|頁面上有東西到使用者開始跟頁面互動的間隔|
|Load|1s|頁面初始到第一次看到畫面上有東西的間隔|

例：[FLIP, or First Last Invert Play](https://www.youtube.com/watch?v=7N1vvNUavVU)

原理是先做繁重的計算，之後的動畫就會很順暢，只要計算落在100ms的response time裡，使用者就不會感覺到LAG。(opacity和transform只會觸發composite，但clipRect會觸發layout，效能有差別)

# Weapons of Jank Destruction

請愛用Chrome DevTool Timeline，手機可也測唷～

# JavaScript

## Request Animation Frame

requestAnimationFrame讓你在每個frame的一開始可以執行JS

這是每個frame要做的事情：
JS > Style > Layout > Paint > Composite

每次執行JS最好不要超過3ms~4ms，因為每個frame最多只有16ms，扣掉瀏覽器的工作，保守估計10ms裡還要做style ~ composite。

用法：

~~~jsx
function animate() {
  ...
  requestAnimationFrame(animate)
}
animate()
~~~

## Web Worker

JS通常是single thread，所以如果跑需要大量計算的JS，main thread沒辦法做其他事，畫面看起來就會變慢或是凍結。web worker可以跑script在另外一個thread上，main thread透過postMessage跟worker thread溝通，同樣地worker也透過postMessage和main thread溝通。

main.js

~~~jsx
var worker = new Worker('worker.js')
worker.onmessage = function(e) {
  var data = e.data
  // Do something with the returned data
}
worker.postMessage({'imageData': imageData})
~~~

worker.js

~~~jsx
this.onmessage = function(e) {
  var imageData = e.data.imageData
  // Do something with the imageData
  ...
  postMessage(imageData)
}
~~~

## GC

Some helpful links:

https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management
http://buildnewgames.com/garbage-collector-friendly-code/

# Styles and Layout

## Selector Matching

Selector Matching越簡單越快。（在CSSOM tree裡面上下搜尋的次數越少越好）

## Layout Thrashing

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
