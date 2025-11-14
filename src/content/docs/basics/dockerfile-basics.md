---
title: Dockerfile 基础
description: 学习如何编写 Dockerfile 构建自定义镜像
---

Dockerfile 是一个文本文件，包含了构建 Docker 镜像所需的所有指令。本文将教你如何编写高质量的 Dockerfile。

## 什么是 Dockerfile？

Dockerfile 是构建 Docker 镜像的**配方（Recipe）**，它定义了：

- 🏗️ 使用哪个基础镜像
- 📦 安装哪些软件包
- 📁 复制哪些文件
- ⚙️ 设置哪些环境变量
- ▶️ 容器启动时执行什么命令

## 第一个 Dockerfile

创建一个简单的 Node.js 应用：

```dockerfile
# 使用官方 Node.js 镜像作为基础
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json
COPY package.json .

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "app.js"]
```

### 构建镜像

```bash
# 在 Dockerfile 所在目录执行
docker build -t my-node-app .

# -t: 指定镜像名称和标签
# .: 构建上下文路径（当前目录）
```

### 运行容器

```bash
docker run -d -p 3000:3000 my-node-app
```

## 常用 Dockerfile 指令

### FROM - 指定基础镜像

```dockerfile
# 使用官方镜像
FROM node:18-alpine

# 使用特定版本
FROM python:3.11-slim

# 多阶段构建
FROM golang:1.21 AS builder
```

:::tip[选择合适的基础镜像]
- 优先选择**官方镜像**
- 使用**alpine** 或 **slim** 变体减小体积
- 指定**明确的版本**而非 latest
:::

### WORKDIR - 设置工作目录

```dockerfile
# 设置工作目录
WORKDIR /app

# 后续的 RUN, COPY, CMD 等命令都在此目录下执行
```

等价于：

```bash
cd /app
```

### COPY - 复制文件

```dockerfile
# 复制单个文件
COPY app.js /app/

# 复制多个文件
COPY app.js config.json /app/

# 复制目录
COPY src/ /app/src/

# 复制所有文件
COPY . /app/

# 使用通配符
COPY *.json /app/
```

### ADD - 高级复制

```dockerfile
# 基本用法同 COPY
ADD app.js /app/

# 自动解压 tar 文件
ADD archive.tar.gz /app/

# 从 URL 下载（不推荐）
ADD https://example.com/file.txt /app/
```

:::caution[COPY vs ADD]
除非需要自动解压功能，否则使用 **COPY** 而不是 ADD。COPY 语义更清晰。
:::

### RUN - 执行命令

```dockerfile
# 安装软件包
RUN apt-get update && apt-get install -y curl

# 多行命令
RUN npm install && \
    npm cache clean --force

# 多个 RUN 指令
RUN apk add --no-cache python3
RUN pip3 install flask
```

:::tip[合并 RUN 指令]
每个 RUN 都会创建新的层。合并相关命令可以减少层数：

```dockerfile
# ❌ 不好：创建多层
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim

# ✅ 好：单层
RUN apt-get update && \
    apt-get install -y \
        curl \
        vim && \
    rm -rf /var/lib/apt/lists/*
```
:::

### CMD - 默认启动命令

```dockerfile
# exec 形式（推荐）
CMD ["node", "app.js"]

# shell 形式
CMD node app.js

# 为 ENTRYPOINT 提供默认参数
CMD ["--help"]
```

:::note[CMD 特点]
- 一个 Dockerfile 只能有一个 CMD
- 可以被 `docker run` 命令覆盖
:::

### ENTRYPOINT - 入口点

```dockerfile
# exec 形式
ENTRYPOINT ["python", "app.py"]

# 配合 CMD 使用
ENTRYPOINT ["python", "app.py"]
CMD ["--port", "5000"]

# 运行时可以追加参数
# docker run myapp --debug
# 实际执行: python app.py --debug
```

### ENV - 环境变量

```dockerfile
# 设置单个变量
ENV NODE_ENV production

# 设置多个变量
ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info

# 在后续指令中使用
RUN echo $NODE_ENV
```

### ARG - 构建参数

```dockerfile
# 定义构建参数
ARG NODE_VERSION=18

# 使用参数
FROM node:${NODE_VERSION}-alpine

# 也可以设置默认值
ARG APP_ENV=development
ENV APP_ENV=${APP_ENV}
```

构建时传递参数：

```bash
docker build --build-arg NODE_VERSION=20 -t myapp .
```

:::note[ARG vs ENV]
- **ARG**: 仅在构建时可用
- **ENV**: 构建时和运行时都可用
:::

### EXPOSE - 声明端口

```dockerfile
# 声明容器监听的端口
EXPOSE 3000

# 声明多个端口
EXPOSE 3000 8080

# 指定协议
EXPOSE 8080/tcp
EXPOSE 8080/udp
```

:::caution[EXPOSE 不会自动映射端口]
EXPOSE 只是声明，实际映射需要在运行时指定：

```bash
docker run -p 3000:3000 myapp
```
:::

### VOLUME - 定义卷

```dockerfile
# 定义数据卷
VOLUME /data

# 定义多个卷
VOLUME ["/data", "/logs"]
```

### USER - 指定运行用户

```dockerfile
# 创建用户
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser

# 切换用户
USER appuser

# 后续命令以 appuser 身份运行
```

:::tip[安全最佳实践]
不要使用 root 用户运行应用。创建专门的用户：

```dockerfile
FROM node:18-alpine
RUN addgroup -g 1001 nodejs && \
    adduser -D -u 1001 -G nodejs nodejs
USER nodejs
```
:::

### LABEL - 添加元数据

```dockerfile
# 添加标签
LABEL maintainer="your@email.com"
LABEL version="1.0"
LABEL description="My awesome app"

# 多行标签
LABEL org.opencontainers.image.authors="your@email.com" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.description="Production app"
```

## 完整示例

### Node.js 应用

```dockerfile
# 使用官方 Node.js 镜像
FROM node:18-alpine

# 设置元数据
LABEL maintainer="dev@example.com"
LABEL version="1.0"

# 设置环境变量
ENV NODE_ENV=production \
    PORT=3000

# 创建应用目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production && \
    npm cache clean --force

# 复制应用代码
COPY . .

# 创建非 root 用户
RUN addgroup -g 1001 nodejs && \
    adduser -D -u 1001 -G nodejs nodejs && \
    chown -R nodejs:nodejs /app

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# 启动命令
CMD ["node", "server.js"]
```

### Python Flask 应用

```dockerfile
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建非 root 用户
RUN useradd -m -u 1001 appuser && \
    chown -R appuser:appuser /app

USER appuser

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### Go 应用（多阶段构建）

```dockerfile
# 构建阶段
FROM golang:1.21-alpine AS builder

WORKDIR /build

# 复制 go mod 文件
COPY go.mod go.sum ./
RUN go mod download

# 复制代码
COPY . .

# 编译
RUN CGO_ENABLED=0 GOOS=linux go build -o app .

# 运行阶段
FROM alpine:latest

# 安装 ca 证书
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 从构建阶段复制二进制文件
COPY --from=builder /build/app .

# 暴露端口
EXPOSE 8080

# 运行
CMD ["./app"]
```

## Dockerfile 最佳实践

### 1. 使用 .dockerignore

创建 `.dockerignore` 文件排除不需要的文件：

```
node_modules
npm-debug.log
.git
.env
.DS_Store
*.md
```

### 2. 合理排序指令

```dockerfile
# ✅ 好：不常变的指令放前面
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./    # 依赖不常变
RUN npm install
COPY . .                 # 代码经常变

# ❌ 不好：顺序不对，每次代码改变都要重新安装依赖
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
```

### 3. 利用构建缓存

```dockerfile
# 分离依赖安装和代码复制
COPY package.json .
RUN npm install        # 只有 package.json 变化时才重新执行
COPY . .              # 代码变化不影响依赖安装
```

### 4. 减少镜像层数

```dockerfile
# ❌ 不好：多层
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim

# ✅ 好：合并
RUN apt-get update && \
    apt-get install -y \
        curl \
        vim && \
    rm -rf /var/lib/apt/lists/*
```

### 5. 清理临时文件

```dockerfile
RUN apt-get update && \
    apt-get install -y build-essential && \
    # ... 构建操作 ... && \
    apt-get purge -y build-essential && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*
```

### 6. 使用多阶段构建

```dockerfile
# 构建阶段 - 体积大
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段 - 体积小
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

## 构建上下文

### 什么是构建上下文？

执行 `docker build` 时，Docker 会将指定目录（通常是 `.`）的所有内容发送给 Docker daemon，这就是构建上下文。

```bash
# . 是构建上下文
docker build -t myapp .

# 可以指定其他目录
docker build -t myapp /path/to/context
```

### 优化构建上下文

```dockerfile
# .dockerignore
node_modules/
.git/
*.log
.env
coverage/
```

## 调试 Dockerfile

### 查看构建过程

```bash
# 显示详细构建过程
docker build -t myapp . --progress=plain

# 不使用缓存
docker build -t myapp . --no-cache
```

### 进入中间层调试

```bash
# 构建到某一步失败后，使用最后成功的镜像
docker run -it <image_id> sh
```

### 使用 dive 分析镜像

```bash
# 安装 dive
brew install dive  # macOS

# 分析镜像
dive myapp:latest
```

## 小结

### 关键要点

1. ✅ 使用官方基础镜像
2. ✅ 选择轻量级变体（alpine/slim）
3. ✅ 合理排序指令，利用缓存
4. ✅ 合并 RUN 指令减少层数
5. ✅ 使用 .dockerignore 排除文件
6. ✅ 不要使用 root 用户运行应用
7. ✅ 使用多阶段构建优化体积
8. ✅ 清理临时文件和缓存

## 下一步

- [多阶段构建](/advanced/multi-stage-builds/) - 深入学习多阶段构建
- [镜像优化](/advanced/image-optimization/) - 优化镜像体积
- [构建第一个镜像](/practice/build-first-image/) - 实战练习

---

:::tip[在线工具]
- [Dockerfile 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Hadolint](https://github.com/hadolint/hadolint) - Dockerfile 代码检查工具
:::
