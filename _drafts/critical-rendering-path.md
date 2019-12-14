# Critical Rendering Path

## CSS

CSSOM的建構和DOM的建構應可平行進行？(待確認)

## Render Tree

CSSOM + DOM = Render Tree

=> 可以進入 "Layout" stage

## script tag要放哪？為什麼

1. Fetch HTML
2. Parse HTML
3. 遇到script tag
4. 暫停parse，下載並執行js
5. 繼續parse

WHY?

因為JS可以新增/修改/刪除DOM，所以parser必須等JS執行完後，才能繼續parse。

### Block on CSS

執行JS的同時，也可能會修改CSSOM，所以如果這時候還沒建構完CSSOM，JS也會暫停執行，直到CSSOM建構完成。

WHY?

### inline, then external script

TODO

### script放最前面會怎樣

如果script tag放在最前頭的話，瀏覽器會在一開頭的時候就下載JS、執行並暫停parse，接著才會繼續parse。

執行的時候，HTML裡面的東西都還沒背parse!

另外，因為parse要等script結束，所以會比較慢。

### 那script放在body的最底部呢？

1. 先parse HTML
2. 直到遇到body最底部的script tag。
3. pause HTML parsing
4. 開始下載js
5. 執行js
6. 開始render

缺點：雖然HTML parse完了，但是還是得等下載完JS、執行完JS才能render

### 解法2：async

async一邊下載的同時，一邊可以 parse HTML，直到下載完才執行（執行JS的時候 parse 會暫停）

所以你應該把script放在body的最底部，，遇到script就開始download，但是這個過程並不會暫停HTML parse，所以就可以render了

### 解法3：defer

## JS

parse的過程遇到script tag，會停下來下載JS並執行JS，完成後才繼續parse，所以會阻擋render

inline

和initial render無關，用async

FAQ

### jQuery?

雖然不是全部，如果是特效的部分，大部分可以async延遲載入，讓above-the-fold content 可以先 render

### Framework?

* Consider inlining relevant JavaScript module to avoid extra network roundtrip
* Server side rendering (deliver fast initial render, then async load)

## Ref

https://developers.google.com/speed/docs/insights/BlockingJS

https://stackoverflow.com/questions/436411/where-should-i-put-script-tags-in-html-markup

https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript
