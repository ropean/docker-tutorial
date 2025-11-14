---
title: 镜像优化
description: 优化 Docker 镜像大小和构建速度
---

优化镜像可以减少存储空间、加快部署速度、提高安全性。

## 优化策略

### 1. 选择轻量级基础镜像

```dockerfile
# ❌ 不好：使用完整镜像
FROM ubuntu:22.04  # ~77MB

# ✅ 好：使用 alpine
FROM alpine:3.18   # ~7MB

# ✅ 更好：使用语言特定的精简版
FROM node:18-alpine  # ~177MB vs node:18 ~1GB
FROM python:3.11-slim  # ~130MB vs python:3.11 ~900MB
```

### 2. 多阶段构建

详见 [多阶段构建](/advanced/multi-stage-builds/)。

### 3. 合并 RUN 指令

```dockerfile
# ❌ 不好：每个 RUN 创建一层
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim

# ✅ 好：合并为一层
RUN apt-get update && \
    apt-get install -y \
        curl \
        vim && \
    rm -rf /var/lib/apt/lists/*
```

### 4. 及时清理

```dockerfile
# Alpine
RUN apk add --no-cache python3

# Ubuntu/Debian
RUN apt-get update && \
    apt-get install -y python3 && \
    rm -rf /var/lib/apt/lists/*

# Python pip
RUN pip install --no-cache-dir flask

# Node.js npm
RUN npm install && npm cache clean --force
```

### 5. 使用 .dockerignore

创建 `.dockerignore`:

```
node_modules
.git
.env
*.md
.vscode
.idea
coverage
dist
build
```

### 6. 只复制必要文件

```dockerfile
# ❌ 不好
COPY . .

# ✅ 好
COPY package.json package-lock.json ./
RUN npm install
COPY src ./src
```

## 实战示例

### 优化前

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

镜像大小：**1.2GB**

### 优化后

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force
COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

镜像大小：**150MB**（减少 87.5%）

## 分析镜像

### 使用 docker history

```bash
docker history myapp:latest
```

### 使用 dive

```bash
# 安装 dive
brew install dive

# 分析镜像
dive myapp:latest
```

## 优化清单

- [ ] 使用轻量级基础镜像
- [ ] 实施多阶段构建
- [ ] 合并 RUN 指令
- [ ] 清理缓存和临时文件
- [ ] 使用 .dockerignore
- [ ] 只安装必要依赖
- [ ] 压缩静态资源
- [ ] 使用非 root 用户

## 下一步

- [多阶段构建](/advanced/multi-stage-builds/)
- [安全最佳实践](/best-practices/security/)
- [生产环境部署](/best-practices/production/)
