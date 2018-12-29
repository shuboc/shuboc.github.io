---
title: "瀏覽器事件：Event Bubbling, Event Capturing 及 Event Delegation"
tags: ["javascript", "browser event"]
redirect_from: /2018/02/25/event-bubbling-capturing-and-event-delegation
---

這篇文章是我閱讀 [javacript.info](http://javascript.info/) 的 [Introduction into Events](http://javascript.info/events) 篇的筆記，簡單整理了瀏覽器事件的運作機制 (event bubbling, event capturing)，以及以其為基礎的event delegation機制。

順帶一提[javacript.info](http://javascript.info/)這個網站真的做得很不錯，雖然自稱前端工程師但是其實很多零碎的東西沒有花心思弄懂（遮臉），他都整理得滿清楚的，也有許多範例幫助理解，篇幅不會太長，適合每天抽空讀一點（雖然我還沒看完～），真心推薦！

# Event Bubbling

Event Bubbling指的是當某個事件發生在某個DOM element上（如：點擊），這個事件會觸發DOM elemtn的event handler，接下來會再觸發他的parent的event handler，以及parent的parent的event handler...直到最上層。

以下的例子中，點擊`p`會依序觸發p -> div -> form的`onclick` handler。

```Html
<form onclick="alert('form')">FORM
  <div onclick="alert('div')">DIV
    <p onclick="alert('p')">P
    </p>
  </div>
</form>
```

Parent element的event handler中可以得到實際觸發事件的DOM element的資訊。實際觸發event的DOM element稱為**target**。上面的例子中，點擊`p`時target就是`p`，點擊`div`時target就是`div`，以此類推。

Event handler中可以透過`event.target`物件存取target。而event handler中，如果要存取event handler綁定的DOM element本身，可以透過`this`或是`event.currentTarget`存取。（如果需要bind `this`到別的東西的情況可用`event.currentTarget`。）

```Javascript
form.onclick = function(event) {
  console.log(event.target) // the element that is actually clicked, say p
  console.log(event.currentTarget) // form
}
```

# Event capturing

和Event bubbling相反，event發生在某個DOM element上的時候，會從他的最上層parent開始觸發capturing handler，再來是倒數第二上層的ancestor的capturing handler，以此類推，直到觸發事件的DOM element本身的capturing handler。

如果要設定capturing handler，將`addEventListener`的第三個參數設為`true`（預設值為`false`）：

```Javascript
form.addEventListener('click', handler, true)
```

因此，如果把event bubbling和event capturing的機制一起看的話，順序會是由上而下的Event capturing -> 由下而上的Event bubbling，所以依序會觸發的event handler是：


1. Capturing (form)
2. Capturing (div)
3. Capturing (p)
4. Bubbling (p)
5. Bubbling (div)
6. Bubbling (form)

# Event Delegation

Event delegation指的是：假設同時有很多DOM element都有相同的event handler，與其在每個DOM element上個別附加event handler，不如**利用event bubbling的特性，統一在他們的ancestor的event handler處理。**

舉個例子，假設有個list，按下去的時候要顯示item所代表的資料：

```Html
<ol id="list">
  <li data-num="1"><em>1</em></li>
  <li data-num="2"><em>2</em></li>
  <li data-num="3"><em>3</em></li>
  <li data-num="4"><em>4</em></li>
</ol>
```

雖然可以對個別的`li`附加click event hander，但也可以透過event delegation的方式，統一在`ol`處理：

```Javascript
list.addEventListener('click', e => {
  // 檢查被按的元件確實在這個list裡面
  const li = e.target.closest('li')
  if (!li || !list.contains(li)) return

  alert(li.dataset.num)
})
```

注意`e.target`是實際上觸發click event的DOM element，可能是`li`或是`li`的descendants (如此處的`em`)，所以handler前兩行是為了要檢查這個target是不是在這個`ol`底下。

即使動態增加list item，也不用寫額外的code幫他們新增click event handler，是不是挺方便的！

## Behavior Pattern

我們可以利用event delegation的機制，幫element增加"行為"。做法是：

1. 在需要某種行為的DOM element增加attribute。
2. 在最上層的`document`增加event listener，並檢查元件是否帶有特定attribute。

```Html
Counter: <input type="button" value="1" data-counter>

<script>
  document.addEventListner('click', e => {
    if (typeof e.target.dataset.counter !== undefined) {
      e.target.value++
    }
  })
</script>
```

# Reference

[Introduction into Events - javascript.info](http://javascript.info/events)
