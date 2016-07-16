---
layout: post
title: "如何使用ES2015 REPL"
---

REPL (read–eval–print loop) 可以讓人方便用Command line快速的實驗語法。正好最近在看ES2015，需要三不五時實地練習一下，這篇來記錄一下安裝的方法。

# Setup

<pre><code class="language-bash">
# install the cli and this preset
npm install --save-dev babel-cli babel-preset-es2015

# make a .babelrc (config file) with the preset
echo '{ "presets": ["es2015"] }' > .babelrc
</code></pre>

# Run the REPL

<pre><code class="language-bash">
./node_modules/.bin/babel-node
</code></pre>

名詞解釋：

**Preset** = babel plugin = .babelrc configuration

(Babel官方提供的presets: **es2015, react**。)

# 參考

* [CLI](https://babeljs.io/docs/usage/cli/)
* [ES2015 preset](http://babeljs.io/docs/plugins/preset-es2015/)