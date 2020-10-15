---
title: "《Clean Code 無瑕的程式碼 中文版》介紹＋讀書心得：簡單 10 個日常小技巧，讓你寫出可讀性高、容易維護的程式碼"
tags: ["book"]
last_modified_at: 2020/10/15
---

[《Clean Code 無瑕的程式碼 中文版》](https://www.books.com.tw/exep/assp.php/shubo/products/0010579897?utm_source=shubo&utm_medium=ap-books&utm_content=recommend&utm_campaign=ap-201906)教你如何寫出容易維護的程式碼，第一部分包含了命名、函式、註解、編排、物件與資料結構、錯誤處理、單元測試、類別等基本功。第二部分是關於重構，如何將已經存在的壞程式碼轉變成可讀、可維護的程式碼。第三部分教你如何辨識壞程式碼，包含許多常見的反模式 (Anti-Pattern)，以及如何改善。

雖然這些主題對有些人來說可能太過簡單，但我每隔一陣子重新翻一次都會有越來越深刻的感受：裡面的很多技巧並不華麗、非常容易實踐，甚至簡單到說破了就不值錢的地步，但我總是會很訝異能在工作中好好運用這些技巧的人比想像中還少很多。而每當我讀到自己或他人運用了這些技巧所寫的程式碼，發現他們是多麽的容易理解與維護，我總是會不禁讚嘆這本書的實用性。

我真的覺得這是一本任何工程師都應該讀十遍的好書。俗話說，唯一有效的程式品質度量單位就是每分鐘罵髒話的次數 (WTF/min)，這本書將會讓你擺脫天天對著程式碼罵髒話的日子。看了這本書，你將會學到如何寫出高品質程式碼、花更少的時間維護程式碼、更容易加新功能，早點下班！真心推薦所有工程師朋友都應該要有一本放在案頭隨時參考！

[![Clean Code](https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/057/98/0010579897.jpg&v=513f2000&w=348&h=348)](https://www.books.com.tw/exep/assp.php/shubo/products/0010579897?utm_source=shubo&utm_medium=ap-books&utm_content=recommend&utm_campaign=ap-201906)

## 目錄
{: .no_toc}

- TOC
{:toc}

## 內容介紹

本書分為三個部分。

### 第一部分：原理、模式與實踐

第一個部分是關於Clean Code的原理、模式與實踐，包含了以下十個技巧：

* 命名
* 函式
* 註解
* 編排
* 物件與資料結構
* 錯誤處理
* 邊界
* 單元測試
* 類別
* 系統

從最簡單的變數命名，到最複雜的系統設計，這本書提供了許多可立即應用的建議。

例如，關於函式的參數該如何設計？其實是一門非常深奧的學問。

作者提出的其中一個建議是，盡量不使用旗標參數。

例如：當我們看到前人寫了一行 `render(true)`，想必非常困惑這個 `true` 到底是什麼意思，要把滑鼠移上去才知道原來函式的定義是 `render(boolean isSuite)`。

視情況需要，或許拆成 `renderForSuite()` 和 `renderForSingleTest()` 兩個函式會更好。

### 第二部分：重構

第二個部分是關於重構，如何將有問題的程式碼轉變成更加可讀、可維護的程式碼，包含了以下章節：

* 羽化
* 平行化
* 持續地精鍊
* JUnit的內部結構
* 重構SerialDate

書中展示了實際的重構例子，讓我們了解到要執行一次成功的重構，背後所必須具備的思考邏輯。

### 第三部分：常見的壞味道，以及如何對付他們

第三個部分列出了許多常見的程式碼Anti Pattern，以及解法，包含以下章節：

* 程式碼的氣味與啟發

下面列出部分內容：

**開發環境**

* 需要多個步驟以建立專案或系統
* 需要多個步驟以進行測試

**函式**

* 過多的參數
* 輸出型參數
* 旗標參數
* 被遺棄的函式

以開發環境為例，最常遇到的壞味道就是需要非常多的步驟建立系統或是執行測試，導致太麻煩大家不想用。

或者是函式的參數設計不良，導致可讀性大幅降低。

遇到各種令人頭痛的狀況，本章都有提供解法。

## FAQ

### 什麼人適合讀這本書呢？

寫程式的人，帶領開發團隊的人，都應該讀這本書。

### 什麼語言的開發者適合讀這本書呢？

任何語言的開發者都應該讀這本書。

這本書的範例是用Java寫的，所以特別適合Java的開發人員，但書中的原則適用於各種語言。

## 心得

就我自己工作遇到的經驗，書中很多建議很容易就能運用，並不需要學會很厲害的Design Pattern就可以寫出乾淨好維護的程式碼。

你可能會想：就算我code寫的很乾淨，其他人寫得很糟，那我不是白寫了？但其實下一個看到這段爛程式碼的人，最有可能就是你自己！

為了不要讓現在的自己成為未來的自己的絆腳石，我還是非常推薦入手一本[《Clean Code 無瑕的程式碼 中文版》](https://www.books.com.tw/exep/assp.php/shubo/products/0010579897?utm_source=shubo&utm_medium=ap-books&utm_content=recommend&utm_campaign=ap-201906)的。

[購書連結](https://www.books.com.tw/exep/assp.php/shubo/products/0010579897?utm_source=shubo&utm_medium=ap-books&utm_content=recommend&utm_campaign=ap-201906)

[![Clean Code](https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/057/98/0010579897.jpg&v=513f2000&w=348&h=348)](https://www.books.com.tw/exep/assp.php/shubo/products/0010579897?utm_source=shubo&utm_medium=ap-books&utm_content=recommend&utm_campaign=ap-201906)
