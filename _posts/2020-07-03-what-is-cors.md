---
title: "[教學] CORS 是什麼? 如何設定 CORS?"
tags: ["javascript", "web browser"]
---

當我們在 JavaScript 中透過 fetch 或 XMLHttpRequest 存取資源時，需要遵守 CORS (Cross-Origin Resource Sharing，跨來源資源共用)。瀏覽器在發送請求之前會先發送 preflight request (預檢請求)，確認伺服器端設定正確的 `Access-Control-Allow-Methods`、`Access-Control-Allow-Headers` 及 `Access-Control-Allow-Origin` 等 header，才會實際發送請求。使用 cookie 的情況下還需額外設定 `Access-Control-Allow-Credentials` header。

![dog](/images/dog.jpg)

<span>Photo by <a href="https://unsplash.com/@annadudkova?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Anna Dudkova</a> on <a href="https://unsplash.com/s/photos/dog?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

## TL;DR

只想知道有哪些東西要設定的話，可以直接跳到[總結](./#總結)的部分唷！

## 同源政策 (Same-Origin Policy)

首先我們來認識瀏覽器的「同源政策」。

大家應該都有用過瀏覽器提供的 fetch API 或 XMLHttpRequest 等方式，讓我們透過 JavaScript 取得資源。常見的應用是向後端 API 拿取資料再呈現在前端。

需要注意的是，用 JavaScript 透過 fetch API 或 XMLHttpRequest 等方式發起 request，必須遵守[同源政策 (same-origin policy)](https://developer.mozilla.org/zh-TW/docs/Web/Security/Same-origin_policy)。

什麼是同源政策呢？簡單地說，用 JavaScript 存取資源時，如果是同源的情況下，存取不會受到限制；

然而，在同源政策下，非同源的 request 則會因為安全性的考量受到限制。瀏覽器會強制你遵守 CORS (Cross-Origin Resource Sharing，跨域資源存取) 的規範，否則瀏覽器會讓 request 失敗。

### 什麼是同源?

那什麼情況是同源，什麼情況不是呢？所謂的同源，必須滿足以下三個條件：

1. 相同的通訊協定 (protocol)，即 http/https
2. 相同的網域 (domain)
3. 相同的通訊埠 (port)

舉例：下列何者與 https://example.com/a.html 為同源？

* https://example.com/b.html (⭕️)
* http://example.com/c.html (❌，不同 protocol)
* https://subdomain.example.com/d.html (❌，不同 domain)
* https://example.com:8080/e.html (❌，不同 port)

### 跨來源請求

不是同源的情況下，就會產生一個跨來源 http 請求（cross-origin http request）。

舉個例子，例如我想要在 https://shubo.io 的頁面上顯示來自 https://othersite.com 的資料，於是我利用瀏覽器的 fetch API 發送一個請求:

```JavaScript
try {
  fetch('https://othersite.com/data')
} catch (err) {
  console.error(err);
}
```

這時候就產生了一個跨來源請求。而跨來源請求必須遵守 CORS 的規範。

當伺服器沒有正確設定時，請求就會因為違反 CORS 失敗，在 Chrome DevTool 就會看到以下的經典錯誤 (大家一定都有遇過的那種XD)：

```plaintext
Access to fetch at *** from origin *** has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

我們接下來就一起來看 CORS 到底是什麼，又該如何正確地設定 CORS 吧！

## 什麼是 CORS (Cross-Origin Resource Sharing)?

終於要進入重點了，到底什麼是 CORS?

簡單地說，CORS (Cross-Origin Resource Sharing) 是針對不同源的請求而定的規範，透過 JavaScript 存取非同源資源時，server 必須明確告知瀏覽器允許何種請求，只有 server 允許的請求能夠被瀏覽器實際發送，否則會失敗。

在 CORS 的規範裡面，跨來源請求有分兩種：「簡單」的請求和非「簡單」的請求。

接下來會分別解釋兩種請求的 CORS 分別如何運作。

## 簡單跨來源請求

所謂的「簡單」請求，必須符合下面兩個條件：

1. 只能是 HTTP GET, POST or HEAD 方法
2. 自訂的 request header 只能是 `Accept`、`Accept-Language`、`Content-Language` 或 `Content-Type`（值只能是 `application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain`）。細節可以看 [fetch spec](https://fetch.spec.whatwg.org/#simple-header)。

不符合以上任一條件的請求就是非簡單請求。

舉個例子來說，下面這個請求不是一個簡單的請求：

```JavaScript
const response = await fetch('https://othersite.com/data', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'X-CUSTOM-HEADER': '123'
  }
});
```

違反簡單請求的地方有三個，分別是：(1) 他是 http DELETE 方法；(2) 他的 Content-Type 是 application/json；(3) 他帶了不合規範的 X-CUSTOM-HEADER。

### Origin (來源)

首先，瀏覽器發送跨來源請求時，會帶一個 `Origin` header，表示這個請求的來源。

`Origin` 包含通訊協定、網域和通訊埠三個部分。

所以從 `https://shubo.io` 發出的往 `https://othersite.com/data` 的請求會像這樣：

```plaintext
GET /data/
Host: othersite.com
Origin: https://shubo.io
...
```

### Access-Control-Allow-Origin

當 server 端收到這個跨來源請求時，它可以依據「請求的來源」，亦即 `Origin` 的值，決定是否要允許這個跨來源請求。如果 server 允許這個跨來源請求，它可以「授權」給這個來源的 JavaScript 存取這個資源。

授權的方法是在 response 裡加上 `Access-Control-Allow-Origin` header：

```plaintext
Access-Control-Allow-Origin: https://shubo.io
```

如果 server 允許任何來源的跨來源請求，那可以直接回 `*`：

```plaintext
Access-Control-Allow-Origin: *
```

當瀏覽器收到回應時，會檢查請求中的 `Origin` header 是否符合回應的 `Access-Control-Allow-Origin` header，相符的情況下瀏覽器就會讓這個請求成功，我們也可以順利地用 JavaScript 讀取到回應；反之，則瀏覽器會將這個 request 視為是不安全的而讓他失敗，即便 server 確實收到請求也成功地回應了，但基於安全性的理由 JavaScript 中沒有辦法讀到回應。

### Access-Control-Expose-Headers

JavaScript 預設可以存取的「簡單」response header 有以下這些：

* Cache-Control
* Content-Language
* Content-Type
* Expires
* Last-Modified
* Pragma

如果要讓 JavaScript 存取其他 header，server 端可以用 `Access-Control-Expose-Headers` header 設定。

```plaintext
X-MY-CUSTOM-HEADER: 123
X-MY-OTHER-CUSTOM-HEADER: 123
Access-Control-Expose-Headers: X-MY-CUSTOM-HEADER, X-MY-OTHER-CUSTOM-HEADER
```

## 一般跨來源請求

非「簡單」的跨來源請求，例如：HTTP PUT/DELETE 方法，或是 `Content-Type: application/json` 等，瀏覽器在發送請求之前會先發送一個 「preflight request（預檢請求）」，其作用在於先問伺服器：你是否允許這樣的請求？真的允許的話，我才會把請求完整地送過去。

### Preflight Request (預檢請求)

什麼是 preflight request 呢？

Preflight request 是一個 http OPTIONS 方法，會帶有兩個 request header：`Access-Control-Request-Method` 和 `Access-Control-Request-Headers`。

* `Access-Control-Request-Method`： 非「簡單」跨來源請求的 HTTP 方法。
* `Access-Control-Request-Headers` 非「簡單」跨來源請求帶有的非「簡單」header。

比方說我發送的非「簡單」跨來源請求是這樣：

```JavaScript`
fetch('https://othersite.com/data/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CUSTOM-HEADER': '123'
  }
})
```

那我的 request header 預計會長得會像這樣：

```plaintext
POST /data/
Host: othersite.com
Origin: https://shubo.io
Content-Type: application/json
X-MY-CUSTOM-HEADER: 123
```

瀏覽器幫我們發送的 preflight request 就會像這樣：

```plaintext
OPTIONS /data/
Host: othersite.com
Origin: https://shubo.io
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-MY-CUSTOM-HEADER, Content-Type
```

### Preflight Response

那收到 preflight request 時，Server 該做什麼呢？

Server 必須告訴瀏覽器：我允許的方法和 header 有哪些。因此 Server 的回應必須帶有以下兩個 header:

* `Access-Control-Allow-Methods`: 允許的 HTTP 方法。
* `Access-Control-Allow-Headers`: 允許的非「簡單」header。

當瀏覽器看到跨來源請求的方法和 header 都有被列在允許的方法和 header 中，就表示可以實際發送請求了！

以上面提到例子來說，如果 server 可以接受上述的請求，server 的 preflight response 應該要像這樣：

```plaintext
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: X-MY-CUSTOM-HEADER, Content-Type
```

瀏覽器收到正確的 preflight response，表示 CORS 的驗證通過，就可以送出跨來源請求了！

接下來，瀏覽器實際幫我們送出以下的跨來源請求：

```plaintext
POST /data/
Host: othersite.com
Origin: https://shubo.io
Content-Type: application/json
X-MY-CUSTOM-HEADER: 123
```

最後一步，server 還是要回應 `Access-Control-Allow-Origin` header。瀏覽器會再檢查一次跨來源請求的回應是否帶有正確的 `Access-Control-Allow-Origin` header：

```plaintext
Access-Control-Allow-Origin: https://shubo.io
```

這一步也檢查無誤的話，我們的跨來源請求才算正式成功喔！這時候我們才能在 JavaScript 中讀取回應的內容：

```JavaScript
fetch('https://othersite.com/data/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CUSTOM-HEADER': '123'
  }
})
.then(response => response.json())
.then(json => {
  console.log(json);
});
```

## 跨來源請求的 Cookie

一般的 http request 會帶有該網域底下的 cookie；然而，**跨來源請求預設是不能帶 cookie 的。**

為什麼呢？因為帶有 cookie 的請求非常強大，如果請求攜帶的 cookie 是 session token，那這個請求可以以你的身份做很多機敏的事情，像是存取你的隱私資料、從你的銀行帳戶轉帳等。

> 想了解 cookie 跨域相關的議題，可以參考以下文章：
> 延伸閱讀：[[教學] Cookie 與 document.cookie](/cookies/#samesite)

所以瀏覽器端針對跨來源請求的 cookie 也做了規範。

首先，請求必須要明確地標示「我要存取跨域 cookie」。使用 fetch API 和 XMLHttpRequest 的設定方法如下：

* `credentials`

透過 fetch API 發送跨來源請求，需要設定 `credentials: 'include'`：

```JavaScript
fetch('https://othersite.com/data', {
  credentials: 'include'
})
```

* `withCredentials`

透過 XMLHttpRequest 發送跨來源請求，需要設定 `withCredentials = true;`

```JavaScript
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.open('POST', 'https://othersite.com/data');
```

如此一來跨來源請求就會攜帶 cookie 了！

Server 端也需要額外的設定：如果是信任的來源，回應要帶有 `Access-Control-Allow-Credentials` header：

```plaintext
Access-Control-Allow-Credentials: true
```

如此一來，瀏覽器才會將 cookie 寫進該 domain。

**注意：如果是允許使用 cookie 的情況，`Access-Control-Allow-Origin` 不能用 `*`，必須明確標示哪些來源允許存取。**理由也是基於安全性考量，因為可以用 cookie 的情況下，通常表示會存取一些比較個人化的資料，假設任何網站都能夠存取這樣的資料，顯然是有點危險的！所以不能設為 `*`!

如果你偷懶地用了 `Access-Control-Allow-Origin: *`，就會無情地收到來自瀏覽器的錯誤：

```plaintext
The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when therequest's credentials mode is 'include'. Origin http://localhost:8080 is therefore not allowed access. Thecredentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
```

## 總結

遇到 CORS 的問題，可以歸納出這樣的 SOP：

1. 先認清楚是否為「簡單」的跨來源請求，如果是，在後端 GET/POST/HEAD 方法本身加上 `Access-Control-Allow-Origin` header。
2. 如果非「簡單」跨來源請求，在後端 OPTIONS 加上 `Access-Control-Allow-Methods` 及 `Access-Control-Allow-Headers` header。另外，在後端方法本身加上 `Access-Control-Allow-Origin` header。
3. (Optional) 需要使用 cookie 的情況下，前端要加上 `credentials: 'include'` 或是 `withCredentials` 參數，後端要加上 `Access-Control-Allow-Credentials` header，而且 `Access-Control-Allow-Origin` header 不能用 `*`。

## Reference

* [跨來源資源共用 (CORS) - MDN](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS)
* [同源政策 (Same-origin policy) - MDN](https://developer.mozilla.org/zh-TW/docs/Web/Security/Same-origin_policy)
* [Fetch: Cross-Origin Requests - javascript.info](https://javascript.info/fetch-crossorigin)