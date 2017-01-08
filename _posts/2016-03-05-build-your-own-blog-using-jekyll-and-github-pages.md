---
layout: post
title: Build a Blog with GitHub Pages and Jekyll
tags: [jekyll]
---

Github Pages的部落格服務是免費的，支援用Markdown語法寫文章，搭建快速，並保有客製化版面和功能的彈性，是個方便又功能強大的部落格服務！

## 簡介

### [GitHub Pages](https://pages.github.com/)

GitHub Pages 是GitHub推出的免費網頁服務。個人頁面的連結就是`[GitHub使用者名稱].github.io`，意味著你不需要花錢買網域！

此外，更新網頁很方便，只要利用Git將HTML檔案push到GitHub上即可。

GitHub Pages支援兩種格式：

* 靜態網頁
* Markdown格式的純文字檔（透過Jekyll轉換成靜態網頁）

### [Jekyll](https://jekyllrb.com/)

Jekyll 是一個將文字檔轉換成靜態HTML的產生器，支援Markdown語法。

GitHub Pages支援Jekyll，所以在GitHub Pages上用Markdown寫文章非常容易。

## 快速搭建

想要快速感受一下部落格架起來的樣子，步驟如下：

* 在Github創建一個名為`[GitHub使用者名稱].github.io`的repo，clone到本地端。

* 在資料夾底下建一個Gemfile：

~~~
source 'https://rubygems.org'
gem 'github-pages'
~~~

* 安裝Jekyll跟一些套件：

~~~
gem install bundler
bundle install
~~~

* 產生預設內容：

~~~
bundle exec jekyll new . --force
~~~

* 在本地端測試：

~~~
bundle exec jekyll serve
~~~

此時在瀏覽器打開localhost:4000就會看到熱騰騰的部落格了！

最後，把所有東西Push上去，就可以在`[GitHub使用者名稱].github.io`看到自己的部落格了！

## 使用現成版型

快速搭建起來的部落格外觀比較沒有美感，此時我們可以考慮客製化或是使用現成版型。

客製化需要先搞懂很多Jekyll的眉角，因此我推薦套用現成版型，可以節省一些時間。

Google關鍵字`jekyll theme`就可以找到很多現成的版型。[Jekyll Theme](http://jekyllthemes.org/)是一個不錯的範例。

套用現成版型的步驟如下：

1. Fork你喜歡的版型的repo
2. 在GitHub的設定裡，把fork過來的repo名稱改成`[GitHub使用者名稱.github.io]`

實測在`master` branch裡面commit一篇新的文章之前，GitHub Pages永遠顯示404 not found，推測在`master` branch有commit才會觸發GitHub Pages去更新頁面。

## 寫文章

寫文章很容易，只要在`_post/`底下新增一個markdown格式的純文字檔，Jekyll就可以幫你變成靜態HTML網頁。

為了要讓Jekyll正確處理，需要按照一定的格式去寫：

1. 檔名是`YYYY-MM-DD-title-of-a-post`的形式，副檔名是`.md`或`.markdown`的形式。
2. 內容的開頭用兩條橫線包成一個區塊，稱為[Front Matter](https://jekyllrb.com/docs/frontmatter/)。開頭有Front Matter的文件，才會被Jekyll特別處理。Front Matter是用來定義一些Jekyll處理時需要的變數，例如：

~~~
---
layout: post
title: An Example Post
---
This is the content.
~~~

其中`layout`是用來指定要用什麼版型來呈現頁面。定義了`layout: post`，Jekyll就會去用`_layout/post.html`來呈現頁面。

## 結論

用Github Pages + Jekyll，搭架部落格和寫文章都非常容易。我推薦寫部落格使用GitHub Pages。

至於想要客製化版面或功能，可以參考[Jekyll Documentation](https://jekyllrb.com/docs/home/)，先讀過一遍Jekyll的原理和設定。
