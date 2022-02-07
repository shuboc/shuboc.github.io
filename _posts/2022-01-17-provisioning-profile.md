---
title: "Provisioning profile 是什麼? 如何設定 provisioning profile?"
tags: ["ios"]
---

最近用 React Native 開發 app 時，又遇到了 provisioning profile 設定不對的問題。因為太常遇到這個問題，所以決定來好好整理一下到底什麼是 provisioning profile，以及要如何正確設定。Provisioning profile 是一組設定檔，主要有兩個用途：確保正確的簽署 app，和確保 app 能夠安全地在指定的裝置上運行。

## Sign (簽署)

首先，要上架到 App Store 的 app 都必須要經過簽署 (sign) 的程序，所謂的簽署程序會涉及一組public key/private key的組合。private key 是用來簽署 app 的，而 public key 用途則是讓其他人驗證 app 的簽署者確實是你本人。

這裡的 public key 就是所謂的 Certificate (憑證)，其功能就是驗證 app 的開發者身份。

所有要上架到 App Store 的 app，都必須經過簽署的程序。

產生憑證檔的步驟可以參考這篇：[iOS APP上架流程圖文教學](https://franksios.medium.com/ios-app%E4%B8%8A%E6%9E%B6%E6%B5%81%E7%A8%8B%E5%9C%96%E6%96%87%E6%95%99%E5%AD%B8-724636ddc78b)。

大致流程是會需要你產生一組 CSR (Certificate Signing Request)，產生 CSR 的同時會在你的電腦的 keychain 裡生成 private key，這就是你用來簽署 app 的 private key，千萬不能弄丟。Apple 會用這個 CSR 去生成 Certificate，可供你在 Apple Developer 的後台下載。

## Provisioning Profile

有了 certificate 之後，還得要建立一個 provisioning profile 才能將 app 上架。

Provisioning profile 可以想成是一組設定檔，其中包含了以下資訊：

* Certificate
* App ID
* 可使用的設備 device id

Provisioning profile 有兩個用途：

* 確保正確的簽署 app
* 確保 app 能夠安全地在指定的裝置上運行。

要在裝置上執行的 app 必須先經過 XCode 的簽署，XCode 會核對電腦上的 certificate, app id, device id, team id 等是否和 provisioning profile 裡面含的 certificate, app id, device id, team id 一致，正確無誤的話才會用對應的私鑰來簽署你的 app。

Provisioning profile 和 code signing 的詳細機制可以看這一篇: [What is a provisioning profile & code signing in iOS?
](https://abhimuralidharan.medium.com/what-is-a-provisioning-profile-in-ios-77987a7c54c2)。

打包的 app 中也會包含了 provisioning profile，在裝置端執行前也會再驗證一次。透過 App Id 能夠驗證是哪個 app，透過 certificate 可以驗證作者是誰，並且可以在指定的裝置上被執行。

值得注意的是，實機測試或打包上架的時候需要指定一個 provisioning profile。Provisioning profile 有分成開發用 (development) 和發布用(distribution) 兩種。在開發階段的時候，可供測試的裝置是有限制的，但是上架用的 provisioning profile 則不會限制可使用的裝置。

要怎麼產生 provisioning profile 呢？可以參考這篇：[iOS APP上架流程圖文教學](https://franksios.medium.com/ios-app%E4%B8%8A%E6%9E%B6%E6%B5%81%E7%A8%8B%E5%9C%96%E6%96%87%E6%95%99%E5%AD%B8-724636ddc78b)。

## 如何讓團隊成員打包上架 iOS app

這邊有一個重點，要正確的發布上架，你的電腦上的 keychain 裡必須要有對應的私鑰。

這個私鑰就是前面提到的 public key/private key pair 中的 private key，他的 public key 則會對應到 provisioning profile 所包含的 certificate。

如果你是一人團隊，那正常來說你已經有這把 private key了；但如果你身處一個多人的團隊，很有可能私鑰是在別人的電腦產生的，所以你並沒有私鑰，這樣就沒辦法 sign 和發布到 App Store。

解決方法是：請私鑰的擁有者給你私鑰對應的 p12 檔。

要如何產生 p12 檔呢？可以參考這篇 [讓同一個專案的其它成員也能夠使用各自的 Apple ID 打包並上傳 APP](https://franksios.medium.com/ios-%E8%AE%93%E5%90%8C%E4%B8%80%E5%80%8B%E5%B0%88%E6%A1%88%E7%9A%84%E5%85%B6%E5%AE%83%E6%88%90%E5%93%A1%E4%BD%BF%E7%94%A8%E5%90%84%E8%87%AA%E7%9A%84-apple-id-%E4%B9%9F%E8%83%BD%E5%A4%A0%E6%89%93%E5%8C%85%E4%B8%8A%E5%82%B3-app-%E8%A9%B2%E5%81%9A%E7%9A%84%E9%82%A3%E4%BA%9B%E4%BA%8B%E5%85%92-6f10d6d689dc) 或是這篇 [How to make a p12 file for iOS](https://calvium.com/how-to-make-a-p12-file/)。