shell的原理？

export 可以讓當前的shell啟動的subprocess都能夠讀取這個環境變數，例如

```
export VAR = foo
some command # VAR = 'foo'
```

貌似是複製一份相同的變數內容到子shell中，所以沒辦法修改母shell的變數內容。

以下這樣不work:

```
VAR = foo
some command # VAR = ''
```

export也適用於用source設置環境變數的情況。

source

這樣也不work

```
cat "VAR = foo" > .env
source .env
some command # VAR = ''
```

要改成

```
cat "export VAR = foo" > .env
source .env
some command # VAR = 'foo'
```


Makefile 可以存取環境變數，例如：

```
DB_HOST=$DB_HOST # Assume there is an env var called "DB_HOST"
```

Makefile 每一行應該是獨立的shell?

所以

這樣可以：（因為是同一行）

```export $$( cat $(PROJECT_ENV_FILE) | xargs ); \
python manage.py --offline testdata;```


這樣不行：（因為下一行用別的shell去執行了）

```export $$( cat $(PROJECT_ENV_FILE) | xargs );
python manage.py --offline testdata;```

export 出來的環境變數在Makefile裡就只有那一行有效而已
