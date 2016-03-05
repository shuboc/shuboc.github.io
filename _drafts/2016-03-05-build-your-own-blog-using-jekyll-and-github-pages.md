---
layout: post
title: 用GitHub Pages快速搭建部落格
---

Github Pages的部落格服務，支援用Markdown語法寫文章，並保有客製化版面的彈性。

## 簡介

### [GitHub Pages](https://pages.github.com/)

GitHub Pages 是GitHub推出的免費網頁服務。個人頁面的連結就是`[GitHub使用者名稱].github.io`，意味著你不需要花錢買網域！

此外，更新網頁很方便，只要利用git將HTML檔案push到GitHub上即可。

GitHub Pages支援兩種格式：

* 靜態網頁
* Markdown格式的純文字檔（需透過Jekyll）

### [Jekyll](https://jekyllrb.com/)

Jekyll 是一個將文字檔轉換成靜態HTML的產生器，支援Markdown語法。

GitHub Pages支援Jekyll，所以我們可以很容易地在GitHub Pages上用Markdown寫文章！

## 從0開始

想要了解Jekyll運作原理，甚至自己改版型，可以試著從內建的版型開始。

（我一開始試著從華麗的現成版型開始改，沒多久就因為太複雜而放棄了ＸＤ）

步驟如下：

* 在Github創建一個名為`[GitHub使用者名稱].github.io`的repo，clone到本地端。

* 在資料夾底下建一個Gemfile：

```
source 'https://rubygems.org'
gem 'github-pages'
```

* 安裝Jekyll跟一些套件：

```
gem install bundler
bundle install
```

* 產生預設內容：

```
bundle exec jekyll new . --force
```

* 在本地端測試：

```
bundle exec jekyll serve
```

此時在瀏覽器打開localhost:4000就會看到熱騰騰的部落格了！

最後，把所有東西Push上去，就可以在`[GitHub使用者名稱].github.io`看到自己的部落格了！

## 使用現成版型

自己調版型比想像中難一些，害我卡關了好一陣子～使用現成版型可以節省很多時間。

Google關鍵字`jekyll theme`就可以找到很多現成的版型。我大量參考[Jekyll Theme](http://jekyllthemes.org/)。

基本的步驟如下：

1. Fork你喜歡的版型的repo
2. 在GitHub的設定裡，把fork過來的repo名稱改成`[GitHub使用者名稱.github.io]`
3. 在`master`branch裡面commit一篇新的文章

我沒做第3步之前GitHub Pages永遠顯示404，似乎是有commit才會觸發GitHub Pages去更新頁面，
而且一定要在`master` branch！ (專案頁面例外，要在`gh-pages`更新)

## 寫文章

寫文章很容易，只要在`_post/`底下新增一個markdown格式的純文字檔，Jekyll就可以幫你變成靜態HTML網頁。

為了要讓Jekyll處理，需要按照一定的格式去寫：

1. 檔名是`YYYY-MM-DD-title-of-a-post`的形式，副檔名是`.md`或`.markdown`的形式。
2. 內容的開頭用兩條橫線包成一個區塊，稱為[Front Matter](https://jekyllrb.com/docs/frontmatter/)。開頭有Front Matter的文件，才會被Jekyll特別處理。裡面定義一些Jekyll處理時需要的變數，例如：

```
---
layout: post
title: An Example Post
---

This is the content.
```

`layout`是用來指定要用什麼版型來呈現頁面。定義了`layout: post`，就會用`_layout/post.html`來呈現頁面。

## 結論





