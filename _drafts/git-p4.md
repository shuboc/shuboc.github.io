# git-p4

1. 動機
2. 安裝p4
2. 設定git-p4
3. 常用指令
4. 開發流程

> ~/.gitconfig

```
[git-p4]
        port = (IP@PORT)
        user = chris_chao
        password = (your password)
        client = git
        editor = vim
```

也可以直接寫在.bash_profile裡面，但p4 client也會吃到這個設定
想要分開最好寫在.gitconfig裡面

> ~/.bash_profile

```
export P4PORT=IP
export P4USER=chris_chao
...
```

`git p4 clone //Path/to/P4@all`

`@all` converts P4 revision into a git commit

`git p4 rebase` 相當於`git pull --rebase`

`git p4 submit` 相當於`git push`這時會跳出vim要你編輯commit message


```
git p4 rebase
git merge branch1 --squash
git p4 submit
```



