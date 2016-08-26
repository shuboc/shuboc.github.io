# Typing

Douglas Crockford

* Rebus principle
* alphabet, &
* typing machine
* Why 1/4 shift?
* 1 2 ... 9 0
* ' " -
* ASCII
* line feed, return (= return + linefeed)
* crockford keyboard XD
* [Programma](https://github.com/douglascrockford/Programma)  (a monospace, sans-serif font)
    * squared o, thinner m, 1 & L
    * taller ()[]{}
    * () don't look like 0

# Building and Deploying Scalable Microservices with Go & Kubernetes

Ian Matthew Lewis / Google

monolithic app

* resource/instance
* X scale
* X team ownership
* SLO perf. avail. 

microservices

shared machine

* X iso machi
* namespace
* common lib
* app OS coupled

VM

ineff
coupled guest OS
X mng

Google use container -> 10 yrs
app + libs run on shared kernel

* fast, portable, eff

How to: deploy, node/cont fail, update app, cont discover & communication?

[Ls cl ma @ Go with Borg](http://research.google.com/pubs/pub43438.html)

Borg => Kub

gourp by selector
access policy
stable virtual IP
kube-proxy

GCE

Angular 2

1. template (with {{variable}})
2. \<img (click)="title='123'" ... />
3. [title]="title" [src]="src" 屬性動態binding
4. DI 注入服務元件 e.g., Http
5. this.data = ...
6. ng-for="let item of data"
    [src]="item.src" {{item.title}}
7. [innerHTML]也可以 (DOM的property)
8. 封裝元件
9. ng-cli很方便
10. app-article [item]="item" ngFor="let item of data"
11. 元件可重用
12. for等等的邏輯都放在tag裡面的directives
13. pipe, e.g., {{item.date | date:'y-MM-dd'}} (跟rails有87%像)
14. 關注點分離 （別的地方改了 會影響到我嗎？）=> 在template裡面處理資料格式等等，前後端分離。

# 電子商務 Audience Marketing, Growth Hacking 自動化設計及成效報告

邱煜庭 / 帕格數碼媒體股份有限公司總經理

線下vs線上古典樂：興趣？

年齡興趣性別分眾ＶＳ在網站上的行為 Contact, behavior, loyalty => (RFM Model)

20PB in 3 months => ?

AdWords

AARRR

* acquisition: fbid, lineid, googleid, ip, ... 視為同一個人
* activation
    * 消費記錄 可以信用貸款
    * 瀏覽器記錄
    * 傳貼圖紀錄
    * 搜尋關鍵字

Model 1: Product <-> Customer
* A買了B => tag(A) = tag(B) = tag(A + B)

> 這不就只是collaborative filtering)嗎?

？好奇fb的廣告機制如何

Model 2: POI

從FB Graph API找出產品和人的興趣

> FB lookalike

SEO = ?
Big data = (web behavior + cookie into a big table) => { big data architecture }

fan page like => access to graph API

# 馭風 － 搜狗分散式追蹤系統的設計與實現

distributed storage, service, message, computing

high throughput

disadv:

* complicated
* long calling chain => hard to troubleshoot

Google Dapper => ds for visualization (oss?)

自建：御風系統(why no oss?)

* hetero: c++, java, php
* data too much (don't make wheel again)
* convenient for integration and monitoring

feature:

tracking, data visualization, trending

goal:

perf (disable), transparent and easy, timely to query, big data, scalable, fast

flow:

collect (in RPC, to local and async to server) 
=> processing, change format
=> storage (raw, statistics, ..)
=> analysis (big data)

Zookeeper(採樣，開關)
上傳日誌agent => 流氏計算處理平台 => HBase <= query <= web portal

* 用TraceID串聯callstack
* timestamp => client/server + send/receive
* 單向/雙向

Trace樹: 0 => 0.1 => 0.1.1 => ...

利用四個timestamp+error/exception畫出圖

數據採集

agent: 續傳，滾動，...
IP, service, name, time, level
同步/異步
HTTP or RPC

`flume-NG`

流式数据平台 Storm

Storage
* 寫多讀少
* low latency
* 

HBase 
* scalable storage (hfs)
* no sql => fast but not flexable
* SQL engine - Phoenix => fast and low latency

rowkey
index
merge logs from diff machine

Somehow looks like chrome's debug tool

easy to locate a bottleneck, scalable, ...

* 淘寶 - Eagle eye
* Twitter - zipkin
* 點評 - CAT
* 新浪微薄 - watchman
* 唯品 - Mercury

#	Dance with i13n (與 instrumentation 共舞)

Background: HTML5 & CSS3, e.g., FB (SPA), flickr, ...

Motivation: PM & Designer => WTF UI design

Purpose: tracking how user uses our service (Front End)

Yahoo => YWA/Rapid

* stable
* clear report
* life cycle

Google Analytics (XDD)

gaExt.js

Module Track - make engineer's life easier

send beacon for clickable items only (to save money)

easy for A/B testing

Web components (e.g., embedded youtube video)

have to understand the behavior

e.g., enable video autoplay while scrolling

在video提供的callback裡面去做tracking

放video的確會增加購買率，要放多久？

hashtag "tumblr有的 我們都要有"

* automatic testing
* i13n

增加event

auto add when blur => not as expected

大家都希望自己的module可以很多人用 => 工程師都有一顆玻璃心XDD

要抄fb嗎? enter with space

Make beacons correct => Google Analytics Debugger (Chrome ext)

不希望QA做精緻手工業XDD

cucumber.js

end to end testing support

技術就在我們手上

# 恰如其分的 MySQL 設計技巧

MVP => 逐漸變成技術債

Research: mysql? hadoop?

1. 架構先決
2. 最適合的架構
3. 預想但不過早

Business

license

* GPL => 必須開放source code
* PHP+PDO+MySql (O)
* C/Java/PHP + MariaDB (O)

elastic

互斥狀態：考慮合併

思考延伸需求，擷取出變數


Workload

OLTP

* concurrency
* low lantency
* transaction
* security

OLAP (analytical)

* volume

Intensive

CPU << memory << storage IO << bandwidth

業務的硬限制：

業務需求是什麼？ e.g., 不能放雲端？上萬次，包含加密 => 

* 程式語言
* 單機效能

Scale up

CPU選擇：
InnoDB <-> cache
Node interleaving <-> NUMA
多核心

Memory越多越好 (整張放得進去，or swap...)

Storage Block大小很重要

RAID > SSD???

vm.swappiness = 1
IO scheduler...

FS
ext4 / xfs(?)

Connection Pool

\# of connection

!! note max of DB conn/app

MySQL => thread mode

99% => Application

* N+1 queries ORM
* Bad query
* Bad schema
* Big query
* Big transaction
* Big batch

scale out

讀寫分離
load balance + HA + monitor (Hmm...)

Big data => LAMBDA

SMACK Stack

#Tuning NGINX for High Performance

event-based model (allow many connections)

* monolithic app. (huge bin, single lang, whole recomp & deploy)
* microservice ("the new old thing") => diff cont., VMs, servers, etc. outside the main app.

e.g., deploy more auth app in the morning

HTTP protocol for connecting microservices

caching (proxy can do this?)

## Nginx

tuning nginx: config, system file num limit
ephemeral port exhausion

## Performance Features

* \# worker processes => auto = available CPU cores (in container, you see all cores available, which may not be true)

* ++ \# worker connections (websockets, file server)

* aio threads
* Keep alive
    * benchmark: https w/o keepalive, http, http/2 w/ SSL, keepalive (default)
    * request: 100
    * timeout: 75s (-- when users are many)
* HTTP Caching
    * microcaching
    * cache placement strategies
* HTTP/2
    * helps when many object/requests on the same page
    * caniuse?
    * more complex
    * Nginx amplify (!!!)

# 前端工程體系的變革

手機淘寶

『把你的能力傳達給團隊，創造更高的價值』

工程體系

* 只管人 (只靠人工解決)
    * 100個螺絲釘 vs 10個人
    * 產品非線性成長 => 堆人沒用呀！！
* 依靠工程體系

對產品和業務的理解

* 阿里的流量大部分從淘寶來 (各種其他應用會導進來)
* 整合其他業務
* hybrid (????)
* 圖非常多

維護庫，發展計畫（公司需要有專門的人做這些事情）
=> 希望大家contribute是不現實的。

特性

* 必要性：大家都不想做的，e.g., browser判別，需要有人幹苦功
* 複用性

原則

* 原子性：對同一組數據做操作：lib.promise, lib.env lib.httpurl, lib.img

工具

grunt => gulp => webpack

超強同學，做出來的系統沒人用

sol: 歸類，一次只換一個工具，產生新的工具鏈

運營業務平台：改變流程

產品搭建平台

#電商基礎架構之路

史海峰 / 當當網架構部總監

當當：號稱中國的亞馬遜，有採購，供應鏈，物流

『拋開應用場景，談技術都是耍流氓』

業務：管理商品 運營 賣廣告位＋360整合
不生產書，供應商＝出版社，採購，物流體系，倉儲

100多個系統
邊界模糊：開一個小時的會，溝通協調大家該做什麼
技術債：利潤低，競爭激烈，需求變動快 => 沒空搞技術
不易維護：找個新人接，他也不懂
淘寶的後端用JAVA，大陸主流技術棧用JAVA，追趕也要用一樣，方便招聘
異構，c++ => elastic search，
峰值波動：促銷是電商的常態

## 基礎架構 infra

鐵公雞＝鐵路公路基礎設施

業務系統vs底層系統? 怎麼找工作呀！！我做交易，購物車ＶＳ我做底層

Why?

* 很難培養全棧工程師 => 做平台，讓新手專心實現業務代碼

When?

* 有問題的時候，才看得到技術的價值
* 工程師抱怨 => 抓住痛點，牛人說我來做這個吧！可遇不可求

Deployment

兩地三中心 !== 兩地三中心

公有雲，私有雲 => 需要更強的運維 (容器，分佈式，...)

DB管理

緩存管理

redis

很多人看了書，覺得自己很牛ＸＤ 

是否高可用？

系統監控

Nagios, Zabbix

項目管理

猛！！監控系統全部自己做

技術對業務有促進作用，不然久了技術沒有進步，撐不住未來的需求 => 整天被業務吐槽XD

搞技術 => 只能靠自己的信念，體現架構產生的價值

#	移動開發的銀彈 － React Native 探索與實踐

渲染

技術棧

React => Flux(非標配)
Flexbox => 比原生佈局好用
Virtual DOM繞過DOM render瓶頸

不寫一行原生代碼

## How to comm with native?

最好的學習方法就是實踐中體驗

大陸人安裝很慢 => 架npm私服 (公司內部是翻牆的XDDDD)

* allow private module

原生 => js組件

JSCoach

哲學：學習一次，隨處可用

組建複用

* tab行為一致，區分樣式(CSS?)
* 分離各平台邏輯不同的組件

坑

fetch = polifill (用其他網路庫) 看源代碼

不建議直接修改源碼，更新了會很麻煩。

(可以不通過appstore審查，直接更改app內容嗎??)

時間碎片化場景多樣化ＸＸＸＸＸ？？

選型

* Native 適合效能要求高，遊戲，迭代慢

* Hybrid
    適合M站復用
    
* H5    
    
* React Native

也可開發簽入系統，電視，穿戴式

React受到支持

擁抱變化，不進則退

# 技術驅動用戶體驗優化在趕集的實踐

非ＵＩ的用互體驗（ＣＲＡＳＨ）的影響
推廣一個用戶～20RMB

* 用戶投訴＝老闆反饋（吼叫）
    * 問題定位，安撫，流失
    * 只有少數人會投訴
* automatic tools (can solve problem before deployment)
    * smart monkey, CPU, memory usage, usage analysis
    * senario
    * auto report
    * 複雜狀況，線上才發現的了
    * 行動裝置碎片化，作業系統長尾化
    * 需要等用戶反饋

* 自動上傳crash report/performance log => visualize report
    * 超多report 根本台Ｇ...
* 

GAT

# Universal Angular 2 in FinTech

騰訊 QQ, 廣發證券, 滴滴打車得支付

## What is universal?
* data with first page request
    * reduce RTT of DNS, TCP, ...
* Server-Side Rendering
    * return rendered HTML page

* 2009 Node.js
    * Rendr
    * React.renderToString

* Isomorphic / Universal
* Angular 2核心剖析
* Preboot.js (可以記錄你的事件???) => React原本做不到，但可整合
* parse5 (????)
* Universal Angular 2 is better than Angular 2
* Express透過rendering engine將.ts生成plain HTML
* Cross Platform
* 需要看源碼：Nothing was achieved in the comfort zone.
* prerendering with webpack/gulp/grunt
* localStorage?
* Killer feature = Dependency Injection
    * Same interface, different implementation
* async/await 
* 2 HTTP request
* node cache for a few hours
* Don't use "document" (platform specific)
* Koa.js (=???)

# 移動娛樂直播下監控與極限優化

FB, Twitter, Tencent, Ali, Baidu

社交直播的硬限制

14% < 20fps
20% < 4G
需要極低延遲以保證互動性

能否驗證? 避免無效優化 (回頭用戶? 首次用戶?)

注重復用，前端代碼，後端也可以用

能用工程，絕不人工

資源提前加載

VR移動直播(!!!!!WOW)



