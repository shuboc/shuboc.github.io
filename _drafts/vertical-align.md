#垂直置中

有兩件事 => 1將所有子元素視為一個單位，排在正中間 2所有子元素之間彼此對齊中線

##相對置中

使用vertical-align這個屬性，他的意義是：這個元素如何對齊其他文字。

(講解各種vertical-align的意思。)

所以同一行內的元素(圖片，文字等等)要完美置中，所有的元素都要有 vertical-align: middle 的屬性。

##整體置中

1. 事先知道容器高度，而且確定內文不會換行 => 用height + line-height
2. 事先不知道容器高度 e.g.內容會越長越高 => 用display: table-cell + vertical-align: middle

vertical-align和display: table-cell一起用的時候會有不同的意義：表示如何對齊一個table-cell的內容。將table-cell的vertical-align: middle => 內容會被垂直置中。(但注意內容的元素間可能有高有低，所以還需要調整他們的vertical-align屬性) 

#table layout

行為:

疊在一起會自己生成一個table
不同row的同一column (table-cell) 會自動對齊 => 這個特性很有用，可以拿來垂直對齊不固定寬度的元素
欄寬度是根據內容去動態調整的，除非設定table-layout: fixed

e.g. //TODO

##動態調整欄寬

假設我們需要一些欄位能夠動態調整寬度，i.e.,內文寬度不固定，然後剩下的欄位去自動佔滿剩下的寬度，可以對剩下的欄位下width: 100%，他不會真的佔滿table的100%寬度，而是會盡量擠滿。



1. display: table裡面可以有非display: table-*的元素
3. 當欄位寬度不固定時，display: table-cell可以用width: 100%盡量撐滿寬度


