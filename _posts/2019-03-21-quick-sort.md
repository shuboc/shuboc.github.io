---
title: "[教學] Quick Sort 演算法原理與實作"
tags: ["javascript", "algorithm"]
redirect_from: /quick-sort-quick-selection/
last_modified_at: 2020/10/15
---

Quick Sort (快速排序) 演算法是一種「各個擊破」的 divide andconquer 方法，這篇文章將會教你 Quick Sort (快速排序) 演算法的原理，並教你如何用程式實作 Quick Sort，最後介紹其進階應用: Quick Select (快速選擇演算法)。

## 目錄
{: .no_toc}

- TOC
{:toc}

![Sort](/images/sort.jpg)

## 什麼是 Quick Sort？

[Quick Sort (快速排序)](https://en.wikipedia.org/wiki/Quicksort)，是一種 divide and conquer 的排序方法，其過程如下：

1. 先從 array 中選出一個元素當基準 (pivot)，然後讓 pivot 左邊的元素都小於 pivot，pivot 右邊的元素都大於等於 pivot。（先不用排序）
2. 分別對左邊的 array 和右邊的 array 重複這個過程。

舉個例子：

有個 array，初始狀態 = `[9, 4, 1, 6, 7, 3, 8, 2, 5]`。

首先，選定 5 作為 pivot。我們把小於 pivot 的通通擺在左邊，剩下的擺右邊，結果如下：

```
<--小於pivot--|--大於pivot->
[4, 1, 3, 2, 5, 9, 6, 7, 8]
             ^pivot
```

接下來分別對 `[4, 1, 3, 2]` 和 `[9, 6, 7, 8]` 重複一樣的動作，以此類推，就可以達到排序的效果。

## Quick Sort 實作程式碼範例

為了方便實作，我們選擇 `arr` 的最後一個元素當作 `pivot`。

我們用 `less` 和 `greater` 兩個 array，分別紀錄小於 `pivot` 和大於等於 `pivot` 的元素。

接著，對 `arr` 中的每個元素去檢查大小，放進 `less` 或 `greater`。

最後，對 `less` 和 `greater` 遞迴呼叫 `quickSort`。

將回傳後的結果合併，排序就完成了。

```Javascript
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const less = [];
  const greater = [];
  const pivot = arr[arr.length - 1];
  for (let i = 0; i < arr.length - 1; ++i) {
    const num = arr[i];
    if (num < pivot) {
      less.push(num);
    } else {
      greater.push(num);
    }
  }

  return [...quickSort(less), pivot, ...quickSort(greater)];
}
```

完整版：[quick-sort-simple.js](https://gist.github.com/shuboc/19795e88ba38e52f790a9c3969561c70)

## In-Place Quick Sort 實作 (版本1)

上面的實作會需要額外的暫存空間。

實際上 quick sort 有另外一個 in-place 的版本，只需要常數的額外空間。

這個版本的 quick sort 會需要一個輔助函式，稱為 `partition`。

### 輔助函式 partition(arr, start, end)

`partition` 的作用是從 array 中選出一個 pivot 當作標準，用這個 pivot 把 array 分成兩半，使得左半邊元素全部小於 pivot，右半邊元素全部大於等於 pivot。

**注意它會直接修改原本的 array。**

參數及回傳值的意義如下：

* `start` 和 `end` 分別是開始和結束的範圍。(包含 `end`)

* 回傳值 `pivotIndex` 是 pivot 的 index。

### partition() 如何運作？

接下來講詳細的運作方式。

首先，一樣選出一個 `pivot`，這邊是用範圍內的最後一個元素 `arr[end]`。

接著遍歷 `arr`，當發現小於 `pivot` 的元素時，就跟大於等於 `pivot` 的元素交換位置。

我們用 `nextLeftIdx` 紀錄下一個小於 `pivot` 的元素要交換到的位置。

每次交換完位置，就把 `nextLeftIdx` 往前加一。

`arr` 遍歷結束以後，再把 `pivot` 交換到 `nextLeftIdx`，這樣 `nextLeftIdx` 左邊的元素都會小於 `pivot`，右邊都會大於等於 `pivot`。

最後回傳 `nextLeftIdx`，因為它同時也是 `pivot` 的 index。

實作如下：

```Javascript
function partition(arr, start, end) {
  const pivot = arr[end];
  let nextLeftIdx = start;
  for (let i = start; i < end; ++i) {
    if (arr[i] < pivot) {
      swap(arr, nextLeftIdx, i);
      nextLeftIdx++;
    }
  }

  swap(arr, nextLeftIdx, end);

  return nextLeftIdx;
}
```

### partition() 實際運作過程示範

下面來看實際的操作過程，比較好理解。

這邊的範例，我直接照抄其他介紹 quick sort 的[文章](http://alrightchiu.github.io/SecondRound/comparison-sort-quick-sortkuai-su-pai-xu-fa.html)，`nextLeftIdx` 簡寫為 `l`。

i = 0:

```
 l
[9, 4, 1, 6, 7, 3, 8, 2, 5] // 9 >= 5
 i
```

i = 1:

```
 l
[9, 4, 1, 6, 7, 3, 8, 2, 5] // 4 < 5, swap(arr, i, l)
    i

 l
[4, 9, 1, 6, 7, 3, 8, 2, 5] // 4 < 5, swapped
    i

    l
[4, 9, 1, 6, 7, 3, 8, 2, 5] // 4 < 5, l++
    i
```

i = 2:

```
    l
[4, 9, 1, 6, 7, 3, 8, 2, 5] // 1 < 5, swap(arr, i, l)
       i

    l
[4, 1, 9, 6, 7, 3, 8, 2, 5] // 1 < 5, swapped
       i

       l
[4, 1, 9, 6, 7, 3, 8, 2, 5] // 1 < 5, l++
       i
```

i = 3:

```
       l
[4, 1, 9, 6, 7, 3, 8, 2, 5] // 6 >= 5
          i
```

i = 4:

```
       l
[4, 1, 9, 6, 7, 3, 8, 2, 5] // 7 >= 5
             i
```

i = 5:

```
       l
[4, 1, 9, 6, 7, 3, 8, 2, 5] // 3 < 5, swap(arr, i, l)
                i

       l
[4, 1, 3, 6, 7, 9, 8, 2, 5] // 3 < 5, swapped
                i

          l
[4, 1, 3, 6, 7, 9, 8, 2, 5] // 3 < 5, l++
                i
```

i = 6:

```
          l
[4, 1, 3, 6, 7, 9, 8, 2, 5] // 8 >= 5
                   i
```

i = 7:

```
          l
[4, 1, 3, 6, 7, 9, 8, 2, 5] // 2 < 5, swap(arr, i, l)
                      i

          l
[4, 1, 3, 2, 7, 9, 8, 6, 5] // 2 < 5, swapped
                      i

             l
[4, 1, 3, 2, 7, 9, 8, 6, 5] // 2 < 5, l++
                      i
```

交換 pivot:

```
             l
[4, 1, 3, 2, 7, 9, 8, 6, 5] // swap pivot and l

             l
[4, 1, 3, 2, 5, 9, 8, 6, 7] // swapped, return pivot index
```

最後 `pivot === arr[4] === 5`，`pivot` 以左小於 5，以右大於等於 5。

你可能會注意到，每次交換時， `arr[l]` 都會大於等於 `pivot`，`arr[i]` 小於 `pivot`。

完整版：[quick-sort-in-place.js](https://gist.github.com/shuboc/5014cb7d4c415a3f940b07bdd7606ee5)

## In-Place Quick Sort 實作 (版本2)

另外一種版本的 Quick Sort 實作是基於 [Hoare partition scheme](https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme)，與上一種實作的差別在於 `partition` 的實作方式。

這種 `partition` 選擇 array 中央的元素作為 `pivot`，從最前面開始掃描大於 `pivot` 的元素，從最後面開始掃描小於 `pivot` 的元素，找到之後交換，重複這樣的步驟就完成了 `partition`。

實作如下：

```Javascript
function partition(arr, left, right) {
  const pivot = arr[Math.floor((left+right)/2)];
  while (true) {
    while (arr[left] < pivot) {
      left++;
    }

    while (arr[right] > pivot) {
      right--;
    }

    if (left >= right) {
      return right;
    }

    swap(arr, left, right);
  }
}
```

回傳值 `right` 表示這個位置以右，值全都會大於等於 `pivot`。

這邊 `quickSort` 和前一個實作大同小異，但需注意遞迴的範圍和前一個實作不同，介於 `[left, index]` 和 `[index+1, right]`。

```Javascript
function quickSort(arr, left, right) {
  if (left < right) {
    const index = partition(arr, left, right);
    quickSort(arr, left, index);
    quickSort(arr, index + 1, right);
  }
}

let arr = [9, 4, 1, 6, 7, 3, 8, 2, 5];
quickSort(arr, 0, arr.length - 1);
```

完整版：[quick-sort-in-place-2.js](https://gist.github.com/shuboc/46ba75900b1e8ff1b5952ee94b33bd0c)

## 延伸應用： Quick Select (快速選擇演算法)

[Quick Select](https://en.wikipedia.org/wiki/Quickselect) 是一個 quick sort 的變形應用，用來找出 array 裡面大小為第 `k` 的元素。

(這裏為了方便說明，先假設 `k` 是 zero-based。`k === 0` 是最小的元素。)

### Quick Select 如何運作？

接下來解釋一下 quick select 是如何運作的。

首先，如果對 array 用 `partition`，就可以得到分成兩半的 array 和 `pivotIdx`。

因為左邊元素一定都比 `pivot` 小，右邊元素一定大於等於 `pivot`，

所以 `pivot` 就是第 `pivotIdx` 個元素。

接下來可以分成兩種情況：

1. 如果 `pivotIdx` 等於 `k`，那就找到了我們要的東西。
2. 如果 `pivotIdx` 不是 `k`，我們只要對其中一邊做 `partition` 繼續往下找就可以了。

怎麼說呢？

假設 `k` < `pivotIdx`的情況，因為左半邊都小於 `pivot`，表示第 `0` 個 ~ 第 `(pivotIdx - 1)` 個數都在左半邊，包括第 `k` 個數，也就是我們的目標。所以只要找左半邊就行了。另一邊也是一樣的道理。

### Quick Select 程式碼實作示範 (遞迴版)

實作如下：

```Javascript
function quickSelect(arr, left, right, k) {
  if (left === right) {
    return arr[left];
  }

  const pivotIdx = partition(arr, left, right);
  if (pivotIdx === k) {
    return arr[k];
  } else if (k < pivotIdx) {
    return quickSelect(arr, left, pivotIdx - 1);
  } else {
    return quickSelect(arr, pivotIdx + 1, right, k)
  }
}
```

### Quick Select 程式碼實作示範 (迴圈版)

如果不喜歡遞迴，也可以改寫成迴圈的版本:

```Javascript
function quickSelect(arr, left, right, k) {
  if (left === right) {
    return arr[left];
  }

  while (true) {
    const pivotIdx = partition(arr, left, right, k);
    if (pivotIdx === k) {
      return arr[pivotIdx];
    } else if (k < pivotIdx) {
      right = pivotIdx - 1;
    } else {
      left = pivotIdx + 1;
    }
  }
}
```

完整版：[quick-select.js](https://gist.github.com/shuboc/ec96e63a3b07f009ccdd295e10628f73)

## Reference

https://en.wikipedia.org/wiki/Quicksort

https://en.wikipedia.org/wiki/Quickselect

http://alrightchiu.github.io/SecondRound/comparison-sort-quick-sortkuai-su-pai-xu-fa.html

## Appendix

[quick-sort-simple.js](https://gist.github.com/shuboc/19795e88ba38e52f790a9c3969561c70)

[quick-sort-in-place.js](https://gist.github.com/shuboc/5014cb7d4c415a3f940b07bdd7606ee5)

[quick-sort-in-place-2.js](https://gist.github.com/shuboc/46ba75900b1e8ff1b5952ee94b33bd0c)

[quick-select.js](https://gist.github.com/shuboc/ec96e63a3b07f009ccdd295e10628f73)
