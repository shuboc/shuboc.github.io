---
title: "Caterpillar Method"
tags: [algorithm, caterpillar method]
---

令 `A = [a0, a1, ..., an-1], ai > 0`，要如何判斷是否存在一組`(p, q), p <= q `使得 `sum(ap, ap+1, ... aq) = s`？我們可以用下面介紹的**Caterpillar Method**。

## Caterpillar Method

設`front, back`分別為毛毛蟲的“頭”和“尾”，當尾端固定時，我們讓頭往前最多伸長至總和不超過`s`的範圍，然後檢查總和是否剛好為`s`。如果不是`s`，則將尾端向前移動並更新總和。

~~~Python
def caterpillar(A, s):
    n = len(A)
    front, total = 0, 0
    for back in xrange(n):
        while front < n and total + A[front] <= s:
            total += A[front]
        if total == s:
            return True

        total -= A[back]

    return False
~~~

由於`ai > 0`，總和只會隨著頭向前伸長而遞增而最多不超過`s`，而尾端向前時總和必定減少，所以可以保證所有總和可能 >= `s`的情況都被檢查過了。

## Count Triangle

令 `A = [a0, a1, ..., an-1], ai > 0`，如何找出數組`(x, y, z)`的數量，其中 `0 <= x < y < z < n`，使得數組可以形成三角形的邊長？

### 解法

先針對邊長由小到大排序，然後對`x, y`迭代，判斷是否 `A[x] + A[y] > A[z]`。

令`z`為毛毛蟲的“頭“，並讓`z`遞增直到`A[x] + A[y] <= A[z]`，`z - y - 1`即為給定`x, y`能得到的三角形數量。

當`y`遞增為`y'`的時候，`z`可以由舊的位置繼續計算，因為`A[y'] > A[y]` => `A[x] + A[y'] > A[z-1]`，能夠組成三角形的`(x, y, z)`必定使得`(x, y', z)`也能組成三角形。

~~~Python
def triangles(A):
    n = len(A)
    result = 0
    A.sort()
    for x in xrange(n):
        z = x + 2
        for y in xrange(x + 1, n):
            while z < n and A[x] + A[y] > A[z]:
                z += 1
            result += z - y - 1

    return result
~~~
