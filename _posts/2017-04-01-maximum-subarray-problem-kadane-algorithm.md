---
title: "最大子數列問題 (Maximum Subarray Problem) 及Kadane's Algorithm"
tags: [algorithm, kadane's algorithm, dynamic programming]
redirect_from: /2017/04/01/maximum-slice-problem
---

給定`A = [a0, a1, ..., an-1]`，如何使得slice的和 `sum(A[p], A[p+1], ..., A[q])` 有最大值（slice長度可以為0）？有個有名的Kadane's Algorithm可以解決這個問題。

## Kadane's Algorithm

如果已知`A[:i]`的max sum，那麼`A[:i+1]`的max sum必定包含或不包含`A[:i]`的prefix。

對每個A內的元素，求那個位置所能達到的sum最大值，令其為`max_ending_here`。

包含prefix的情況下，`max_ending_here`為prefix加上當前元素`a`；不包含prefix的情況下，`max_ending_here`為0。（不包含的情況，表示`max_ending_here + a`小於0，就直接捨棄掉prefix和當前元素`a`，令`max_ending_here`歸零，從下一個元素開始計算）

~~~Python
def max_slice(A):
    max_ending_here = max_so_far = 0
    for a in A:
        max_ending_here = max(0, max_ending_here + a)
        max_so_far = max(max_so_far, max_ending_here)

    return max_so_far
~~~

## 參考

[Maximum Subarray Problem - Wikipedia](https://en.wikipedia.org/wiki/Maximum_subarray_problem)
