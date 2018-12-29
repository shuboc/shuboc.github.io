---
layout: post
title: "如何在React元件中使用d3圖表"
tags: [react, d3]
redirect_from: /2016/07/18/combine-d3-with-react
---

最近因為專案的關係稍微研究了一下d3，不過專案本身以React為主，一開始真不知道該如何整合！這篇來分享一下自己在React元件中使用d3的經驗。

## 範例

本篇講解將以在React元件裡面內嵌d3長條圖為例。

* 用svg的rect做長條。
* 按下"Add"會在圖表右側隨機新增一筆資料，按下"Remove"會移除圖表最左側的一筆資料。

完整範例如下：

<p data-height="377" data-theme-id="0" data-slug-hash="pbdGYX" data-default-tab="result" data-user="shubochao" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/shubochao/pen/pbdGYX/">react-d3-lifecycle-example</a> by Shubo Chao (<a href="http://codepen.io/shubochao">@shubochao</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script><br/>

## d3簡介

d3是一個做資料視覺化的函式庫，方便使用者將svg圖形組合成資訊圖表。[D3 Gallery](https://github.com/d3/d3/wiki/Gallery)可以看到許多華麗的範例。

不過個人覺得d3的程式碼乍看之下滿難理解的。我後來是參考[Interactive Data Visualization for the Web](http://chimera.labs.oreilly.com/books/1230000000345/index.html)這本免費電子書，他從零開始講解，非常清楚易懂，照著操作一次範例就可以對d3有初步了解。

下面介紹幾個d3比較重要的特性：

### Data Binding

d3的Data Binding機制，讓資料和DOM節點形成一對一的對應關係；當資料改變時，d3會去更新相對應的DOM節點。

假設資料格式如下：

~~~jsx
let dataset = [
    { key: 0, value: 5 },
    { key: 1, value: 10 },
    { key: 2, value: 13 },
    ...
];
~~~

d3提供了以下方法，可以操作DOM節點和data binding：

* d3.select() 和 d3.selectAll()：用來選取DOM節點。(類似jQuery的$(selector))
* d3.append()：插入DOM節點。
* d3.data()：將每一筆資料都綁定一個DOM節點。當某筆資料需要更新的時候，d3會知道這筆資料對應到哪一個DOM節點。綁定的方式是對每筆資料d，回傳唯一的key值。

將dataset中每筆資料d都綁定到一個rect元素，key是d.key：

~~~jsx
let svg = d3.select('body') // 在body裡面插入svg元素
            .append('svg')
            .attr('width', w)
            .attr('height', h);

let bars = svg.selectAll('rect').data(dataset, d => d.key);
~~~

### Enter, Update and Exit

這裡主要講d3的更新機制：enter()和exit()。

#### Update

資料改變時，根據資料大小，設定長條圖的x, y座標和長寬：

~~~jsx
// Update
bars.attr('x', (d, i) => xScale(i))
    .attr('width', xScale.rangeBand())
    .attr('y', d => yScale(d.value))
    .attr('height', d => h - yScale(d.value)); // 高度正比於資料大小
~~~

#### enter()

新增資料的時候，需要用到enter()。當存在尚未綁定DOM節點的資料時，篩選出這些“尚未存在的DOM節點”。

使用append()可以對每筆資料產生對應的DOM節點，並把資料和DOM節點綁定在一起。

~~~jsx
// Enter
bars.enter()
    .append('rect') // 新增rect元素
    .attr('x', w) // 設定座標，長寬...
    .attr('width', xScale.rangeBand())
    .attr('y', d => yScale(d.value))
    .attr('height', d => h - yScale(d.value));
~~~

#### exit()

資料已被移除時，需要用exit()，篩選出“已經不存在相對應資料的DOM節點“。

對這些節點使用remove()即可從畫面中移除這些DOM節點。

~~~jsx
// Exit
bars.exit().remove();
~~~

## 回到正題 - 在React中嵌入d3圖表

對於d3有了基本認識以後，回到這篇的主題：在React元件中嵌入一個d3圖表。

這件事tricky的地方在於React和d3在呈現UI時的邏輯不同：

* React：當需要改變UI外觀的時候，使用者不直接操作/修改DOM元件，而是改變元件的state，間接觸發render()去根據最新的state重繪UI。
* d3：讓使用者直接去操作/修改DOM元件，達到改變UI外觀的功能。

基本上React不希望你自己操作DOM tree，但是如果需要存取到DOM節點的情況，React提供了Refs的機制，方便存取DOM節點。React也提供了lifecycle method可以在特定的時間點供使用者操作DOM節點。

### React Refs

定義某個元件的ref屬性：

~~~markup
<div ref="myDiv" />
~~~

就能夠在React元件中的this.refs中存取這個DOM節點：

~~~jsx
this.refs.myDiv // DOM node
$(this.refs.myDiv).toggleClass('highlighted') // jQuery
d3.select(this.refs.myDiv).append('svg') // d3
~~~

### componentDidMount & componentDidUpdate

React提供介面，讓你在生命週期的一些階段裡可以安全操作你的DOM。

* componentDidMount：當component完成第一次插入DOM tree。
* componentDidUpdate：當component完成re-render

## Wrap it up! 來做React Component

### render()

~~~jsx
<div>
  <div ref="chart"></div>
  <button onClick={e => this.handleAdd()}>Add</button>
  <button onClick={e => this.handleRemove()}>Remove</button>
</div>
~~~

* `<div ref="chart"></div>`用來放我們的d3長條圖。之後可以用this.refs.chart存取他。
* 有兩個按鈕，按了之後會更新this.state.dataset，觸發`render()`。

### _renderChart()

這個函式運用了enter/update/exit和data binding，每當需要更新圖表時就可以呼叫他。

* 圖表根據`this.state.dataset`去畫。

~~~jsx
_renderChart() {
    const { w, h } = this.props;
    const dataset = this.state.dataset;

    let xScale = d3.scale.ordinal()
      .domain(d3.range(dataset.length))
      .rangeRoundBands([0, w], 0.05);
    let yScale = d3.scale.linear()
      .domain([0, d3.max(dataset, d => d.value)])
      .range([h, 0]);

    // Data binding with key
    let bars = this.svg.selectAll('rect').data(dataset, d => d.key);

    // Enter
    bars.enter()
      .append('rect')
      .classed("bar", true)
      .attr('x', w) // Enter from the right side
      .attr('width', xScale.rangeBand())
      .attr('y', d => yScale(d.value))
      .attr('height', d => h - yScale(d.value));

    // Update
    bars.transition()
      .duration(500)
      .attr('x', (d, i) => xScale(i))
      .attr('width', xScale.rangeBand())
      .attr('y', d => yScale(d.value))
      .attr('height', d => h - yScale(d.value));

    // Exit
    bars.exit()
      .transition()
      .duration(500)
      .attr("x", -xScale.rangeBand()) // Exit to the left side
      .remove();
  }
~~~

### componentDidMount

componentDidMount發生在此component第一次render完畢，此時可以存取this.refs.chart，用來初始化放圖表用的svg：

~~~jsx
componentDidMount() {
    this.svg = d3.select(this.refs.chart)
      .append('svg')
      .attr('width', this.props.w)
      .attr('height', this.props.h);

    this._renderChart();
}
~~~

放完後呼叫this._renderChart()，讓d3根據資料畫出第一次的圖表。

### componentDidUpdate

componentDidUpdate發生在component update完，此時的state已是更新後的狀態，可以呼叫_renderChart()重繪：

~~~jsx
componentDidUpdate() {
    this._renderChart();
}
~~~

## 結論

要結合d3和React，需要瞭解React的生命週期和Refs的用法，以及d3的data binding和enter/update/exit寫法。希望能對需要在React的專案中使用d3的人有幫助！

抱怨：d3雖然自由度很高，但是開發成本也不小，除非時間很充裕，不然自己拿svg在那邊慢慢兜應該會出人命... (默默改用c3)

## 參考

* [Integrating D3.js visualizations in a React app](http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/)
* [Working with Browser](https://facebook.github.io/react/docs/working-with-the-browser.html)
* [Refs to Components](https://facebook.github.io/react/docs/more-about-refs.html)
* [Lifecycle Methods](https://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)
* [Interactive Data Visualization for the Web](http://chimera.labs.oreilly.com/books/1230000000345/index.html)：很棒的教學，範例是參考這裡改的
