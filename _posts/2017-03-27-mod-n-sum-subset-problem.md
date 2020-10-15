---
title: "0 mod n Sum Subset Problem"
tags: [algorithm]
redirect_from: /2017/04/01/maximum-slice-problem
last_modified_at: 2020/10/15
---

Given a set of numbers {a1-an}, what is the best way to come up with a nonempty subset such that the sum of its elements is 0 mod n, where n is the size of the original set?

## 目錄
{: .no_toc}

- TOC
{:toc}

## 思路

令`Si = a0 + a1 + ... + ai`，考慮數列`[S0 % n, S1 % n, ..., Sn % n]`，根據鴿籠原理，必定其中有一個`Si`是0 mod n，或是任兩個`Si, Sj`同屬k mod n。

所以mod n的情況下，必定存在subarray使得sum(subarray) = 0 mod n。

`Si` = 0 mod n的情況，`Si`就是要找的subset。
`Si`和`Sj`同屬k mod n的情況，`Sj - Si`就是要找的subset。

心得：滿有趣的性質，所有的subarray都可以用Si - Sj組出來

## 參考

[Ref](https://www.quora.com/Given-a-set-of-numbers-a1-an-what-is-the-best-way-to-come-up-with-a-nonempty-subset-such-that-the-sum-of-its-elements-is-0-mod-n-where-n-is-the-size-of-the-original-set-Is-there-a-polynomial-time-solution)
