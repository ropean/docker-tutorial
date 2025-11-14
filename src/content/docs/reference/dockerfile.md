---
title: Dockerfile 指令参考
description: Dockerfile 所有指令的详细说明
---

完整的 Dockerfile 指令参考手册。

## 基础指令

### FROM

指定基础镜像，必须是 Dockerfile 的第一条指令。

```dockerfile
FROM ubuntu:22.04
FROM node:18-alpine
FROM scratch  # 从空白镜像开始
```

### WORKDIR

设置工作目录。

```dockerfile
WORKDIR /app
WORKDIR /app/src  # 相对于上一个 WORKDIR
```

### COPY

复制文件到镜像。

```dockerfile
COPY app.js /app/
COPY --chown=user:group app.js /app/
COPY --from=builder /app/dist /app/
```

### ADD

高级复制，支持 URL 和自动解压。

```dockerfile
ADD app.tar.gz /app/  # 自动解压
ADD https://example.com/file.txt /app/
```

### RUN

执行命令。

```dockerfile
RUN apt-get update && apt-get install -y curl
RUN npm install
RUN ["npm", "install"]  # exec 形式
```

## 运行时指令

### CMD

容器启动时的默认命令。

```dockerfile
CMD ["node", "server.js"]
CMD node server.js
```

### ENTRYPOINT

容器入口点。

```dockerfile
ENTRYPOINT ["python", "app.py"]
ENTRYPOINT python app.py
```

### EXPOSE

声明端口。

```dockerfile
EXPOSE 80
EXPOSE 8080/tcp
EXPOSE 8080/udp
```

## 环境指令

### ENV

设置环境变量。

```dockerfile
ENV NODE_ENV production
ENV PORT=3000 LOG_LEVEL=info
```

### ARG

构建参数。

```dockerfile
ARG VERSION=1.0
ARG NODE_VERSION
RUN echo $VERSION
```

## 元数据指令

### LABEL

添加元数据标签。

```dockerfile
LABEL maintainer="dev@example.com"
LABEL version="1.0"
```

### USER

指定运行用户。

```dockerfile
USER nodejs
USER 1001:1001
```

## 高级指令

### VOLUME

定义卷挂载点。

```dockerfile
VOLUME /data
VOLUME ["/var/log", "/var/db"]
```

### HEALTHCHECK

健康检查。

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/ || exit 1
```

### ONBUILD

为子镜像添加触发器。

```dockerfile
ONBUILD COPY . /app
ONBUILD RUN npm install
```

### STOPSIGNAL

指定停止信号。

```dockerfile
STOPSIGNAL SIGTERM
```

### SHELL

更改默认 shell。

```dockerfile
SHELL ["/bin/bash", "-c"]
```

## 多阶段构建

```dockerfile
FROM golang:1.21 AS builder
WORKDIR /build
COPY . .
RUN go build -o app

FROM alpine:latest
COPY --from=builder /build/app .
CMD ["./app"]
```

## 最佳实践

1. ✅ 合并 RUN 指令减少层数
2. ✅ 使用 COPY 而不是 ADD
3. ✅ 使用 exec 形式的 CMD
4. ✅ 清理缓存和临时文件
5. ✅ 利用构建缓存排序指令

## 相关资源

- [Dockerfile 基础](/basics/dockerfile-basics/)
- [多阶段构建](/advanced/multi-stage-builds/)
- [镜像优化](/advanced/image-optimization/)

---

:::tip[官方文档]
查看 [Dockerfile 官方参考](https://docs.docker.com/engine/reference/builder/) 了解更多细节。
:::
