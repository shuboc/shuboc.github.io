## Docker run

-d

--name

--restart

### [Exit Status](https://docs.docker.com/engine/reference/run/#exit-status)

除了幾種情況：Docker本身的問題/command could not be invoked/command not found之外，回傳值＝執行的command的回傳值

```bash
$ docker run busybox /bin/sh -c 'exit 3'; echo $?
# 3
```

### [Clean up (--rm)](https://docs.docker.com/engine/reference/run/#clean-up---rm)

