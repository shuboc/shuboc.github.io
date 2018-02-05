Cookie有幾個特性

1. Domain，用點開頭的domain表示此domain及其subdomain。例如 cookie 的 domain `.example.com` 表示這個 cookie 在 `example.com`, `www.example.com`, `image.example.com` 皆可被存取。

不論是client side或server side，設cookie時可以指定domain，但需遵循原則：

// TODO: 可以存取? 可以讀不能寫? 可以寫不能讀?

假設有 `example.com` 和 `www.example.com` 兩個domain，則寫cookie的規則是：

1. 在 `example.com` 可以寫cookie到 `.example.com`。
2. 在 `www.example.com` 可以寫cookie到 `.www.example.com`。
3. 在 subdomain **可以**寫cookie到parent domain。例如： `www.example.com` 可以寫cookie到 `.example.com`。這個 cookie可以被 `example.com` 以及其subdomain存取，例如：`example.com`, `www.example.com`, `image.example.com` 等。
4. 在 parent domain **不能**寫 cookie 到subdomain。例如：`example.com` 不能寫 cookie到 `.www.example.com`

Keyword: cookie domain

http://taiwantc.com/js/js_tut_c_cookie0.htm
https://www.electrictoolbox.com/cookies-and-domains/
https://blog.miniasp.com/post/2008/02/22/Explain-HTTP-Cookie-in-Detail.aspx