---
layout: post
title: "Browser Rendering Optimization"
---

這篇是線上課程[Browser Rendering Optimization](https://classroom.udacity.com/courses/ud860)的筆記。

課程使用Chrome DevTool，可以看到很多CSS和JS在無意間造成頁面render效能的瓶頸的例子，也呼應了課程不斷強調的最重要的一件事：**在最佳化之前先對網站作profile。**

# TL;DR

1. 瀏覽器每個Frame固定執行的步驟：JS > Style > Layout > Paint > Composite
2. RAIL: 使用者在各個使用情況下的反應時間不同，亦即Response(100s), Animation(16ms), Idle(50ms), Loading(1s)，超出限制將會感覺畫面頓頓的。
3. 如果要用JS呈現動畫，請愛用`requestAnimationFrame`，並且將運算壓在3~4ms間；大量運算請愛用web worker。
4. 小心*Forced Synchronous Layout*，亦即在JS中引發大量重複計算Layout
5. CSS的selector matching，越簡單(層數越少)效能越好。
6. CSS的屬性，依性質可能觸發Layout/Paint/Composite，觸發越少效能越好。可用CSS增加畫面的Layer，減少Layout或Paint的次數。

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

|Item|Time|Description|
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

JS是single thread，所以如果跑需要大量計算的JS，main thread沒辦法做其他事，畫面看起來就會凍結。web worker可以跑script在另外一個thread上，main thread透過`postMessage`跟worker thread溝通，同樣地worker也透過`postMessage`和main thread溝通。

例：起一個worker做image processing，做完通知main thread結果

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

~~~jsx
for (var p = 0; p < paragraphs; ++p) {
  var blockWidth = greenBlock.offsetWidth;
  paragraph[p].style.width = blockWidth + 'px';
}
~~~

記得每個frame被執行的動作：JS > Style > Layout > Paint > Composite

JS讀`offsetWidth`需要先layout才知道，所以迴圈的每一輪都會重跑一次layout，稱為**Forced Synchronous Layout** (FSL)。注意每次Layout都會花不少時間。

Layout完馬上改變style，導致迴圈的下一輪又要重新layout。在JS執行的階段做多次的FSL，導致執行時間太長，稱作Layout Thrashing。

解法：只讀一次style，並且batch修改style，可以避掉迴圈重複layout的步驟，

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

例如頁面上有主頁和menu兩個元素，menu會從畫面側邊滑入/滑出。瀏覽器可以每個frame都重畫(*Paint*)主頁和Menu，但是paint是很花資源的。

如果設定得當，瀏覽器可以預先在Paint階段分別畫好主頁和menu兩個layer，Composite階段只要調整menu的水平位置蓋在主頁上面，之後就不需要重複Paint了。

## 如何產生layer

No transform hack:

~~~css
/* Chrome, Firefox */
will-change: transform; /* or any visual property */
/* Other */
transform: translateZ(0);
~~~
