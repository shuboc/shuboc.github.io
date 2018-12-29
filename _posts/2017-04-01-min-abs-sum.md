---
title: "Min Abs Sum"
tags: [algorithm, dynamic programming]
redirect_from: /2017/04/01/min-abs-sum
---

給定A = [a0, a1, ..., an-1]，如何找到一組S = [s0, s1, ... sn-1], sj ∈ {-1, 1}, 使得abs(sum(ai * si))有最小值？關鍵在於對於`A`中的每個元素a能夠產生的sum作動態規劃。

## 思路

先將`A`的值全部轉正，問題就轉化成如何將A分成兩組，其sum分別為P和Q，使得`P - Q`有最小值。

令`dp[j]`表示能否加總出sum = j，`dp[j]` >= 0 表示可以，<0 則否。我們將對每個`A`的值`a`迭代更新`dp[j]`，`dp[j]`的值填入目前還有多少a可供使用。因為`a`可能會重複，先算`count[a]`備用。

例如：

`A = [1, 3, 3]`, 迭代到a = 3 (count = 2)的情況下，因為已知可以達成sum = 1且有兩個3，所以將sum = 4 和 sum = 7也更新成可以達成的狀態。結果會是`dp[1] = 2, dp[4] = 1, dp[7] = 0`。

## 動態規劃

如果`dp[j]` >= 0的話，表示靠先前出現過的a0, a1, ...a-1已經可以計算出sum = j，`dp[j]`填入`count[a]`備用。

否則如果是`dp[j-a]` > 0的情況，表示可以算出sum = j-a，再加上`a`即可算出sum = j。
如上一步所言，`dp[j-a]`為可用`a`的數量，因此更新`dp[j] = dp[j-a] - 1`。

最後找到最大的P使得P < S / 2 + 1

=> 答案 = Q - P = (S - P) - P = S - 2 * P

~~~C
int solution(vector<int> &A) {
    int N = A.size();
    int M = 0;
    int S = 0;
    for (int i = 0; i < N; ++i) {
        A[i] = abs(A[i]);
        M = max(M, A[i]);
        S += A[i];
    }

    int count[M+1] = {0};
    for (int i = 0; i < N; ++i) {
        count[A[i]] += 1;
    }

    int dp[S+1] = {0};
    for (int i = 1; i < S+1; ++i) {
        dp[i] = -1;
    }

    for (int a = 1; a < M+1; ++a) {
        if (count[a] > 0) {
            for (int j = 0; j < S; ++j) {
                if (dp[j] >= 0) {
                    dp[j] = count[a];
                } else if (j-a >= 0 && dp[j-a] > 0) {
                    dp[j] = dp[j-a] - 1;
                }
            }
        }
    }

    int res = S;
    for (int i = 0; i < S/2 + 1; ++i) {
        if (dp[i] >= 0) {
            res = min(res, S - 2*i);
        }
    }

    return res;
}
~~~

觀察：`A`的值介於-100~100之間，所以重複的數量應該會很多，對於**每個可能的值**去迭代更新`dp[j]`，相對於對**A的每個元素**迭代更有效率。

## 參考

[題目](https://codility.com/programmers/lessons/17-dynamic_programming/min_abs_sum/)

[解答](https://codility.com/media/train/solution-min-abs-sum.pdf)
