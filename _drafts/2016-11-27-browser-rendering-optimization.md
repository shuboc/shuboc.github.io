這篇是[Browser Rendering Optimization](https://classroom.udacity.com/courses/ud860)的筆記。

# Critical Rendering Path

## What Goes Into One Frame?

每個frame瀏覽器會執行下面的動作：

1. 建立 DOM & CSSOM to Render Tree (element + style) (*Recalculate Styles*) 

2. 算出元素實際的長寬和位置 (*Layout*)

3. 實際在螢幕上畫出pixel，例如：raster(在螢幕上描點)，畫出長方形等動作 (*Paint*)

4. 把畫好的layer疊起來 (*Composite*)

再加上可能會在frame的一開始用JS做style的修改，所以每個frame裡執行的動作依序為：

**JS > Style > Layout > Paint > Composite**

## Layout and Paint

每種CSS屬性，依據其特性，會觸發不同的動作，例如：

1. `margin-left` (會改變長寬的屬性，會觸發layout)

  JS > Style > Layout > Paint > Composite

2. `color` (只改變外觀不改變長寬的屬性，不觸發Layout，但會觸發Paint)

  JS > Style > -- > Paint > Composite

3. `transform` (只是改變Layer和Layer之間的相對位置，不觸發layout和paint，只觸發composite)

  JS > Style > -- > -- > Composite
  
觸發越多動作，效能就越差，較容易造成畫面卡卡。

CSS屬性會觸發哪些動作，可參閱[csstriggers.com](https://csstriggers.com/)

# App Lifecycles

App的狀態可粗分成以下四類：RAIL (Response, Animate, Idle, Load)

|Item|Time|Description
|---|---|---|
|Response|100ms|使用者與頁面互動到頁面反饋的間隔|
|Animate|16ms|60fps => 1000ms/60f = 16ms/f|
|Idle|50ms|頁面上有東西到使用者開始跟頁面互動的間隔|
|Load|1s|頁面初始到第一次看到畫面上有東西的間隔|

頁面初始的載入順序：Load > Idle > Animate > Response。

**Load**: 要看*Critical Rendering Path*，想辦法加速讓頁面可以在一秒內render出頁面上最重要的資訊。

**Idle**: 50ms之後使用者就會開始點頁面上的東西，所以如果有額外資料要下載要趁現在。

**Animate**: 每個frame保守估計只有10ms左右讓你執行JS，不能在裡面做繁重的運算或是下載資源。

**Response**: 使用者點某個按鈕，他會預期最遲100ms後畫面會有反應（例如動畫之類的），所以如果動畫不順，可以利用這100ms先做運算，幫助之後的動畫變順暢，例：[FLIP, or First Last Invert Play](https://www.youtube.com/watch?v=7N1vvNUavVU)

# JavaScript

## Request Animation Frame

60fps等於每個frame必須要在16ms內執行完。如果要用JS做動畫，瀏覽器提供`requestAnimationFrame`的API，讓你在每個frame的一開始可以執行JS。

為何要在每個frame的開始執行JS? 因為若是在Style > Layout > Paint > Composite的過程間執行JS並且改變style，那這整個過程極有可能要重新來過，容易超過16ms的限制。

有了`requestAnimationFrame`可以盡量確保在每個frame的開始就執行JS，但每次執行JS最好不要超過3ms~4ms，因為每個frame最多只有16ms，扣掉瀏覽器的工作，保守估計剩10ms的時間裡還要做Style > Layout > Paint > Composite等工作。

用法：

~~~jsx
function animate() {
  ... // 執行一格動畫
  requestAnimationFrame(animate) // 排程下一格的動畫
}
animate() // 開始動畫
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
