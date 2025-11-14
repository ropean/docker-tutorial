---
title: 多阶段构建
description: 使用多阶段构建优化 Docker 镜像
---

多阶段构建是优化镜像大小的强大技术，可以在一个 Dockerfile 中使用多个 FROM 指令。

## 为什么需要多阶段构建？

### 问题：单阶段构建体积大

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]
```

问题：最终镜像包含了构建工具和源代码，体积很大（~1GB）。

### 解决方案：多阶段构建

```dockerfile
# 构建阶段
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

最终镜像只包含运行时需要的文件，体积大幅减小（~200MB）。

## Go 应用示例

```dockerfile
# 编译阶段
FROM golang:1.21-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o app .

# 运行阶段
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /build/app .
EXPOSE 8080
CMD ["./app"]
```

镜像大小对比：
- 单阶段：~800MB
- 多阶段：~10MB

## Python 应用示例

```dockerfile
# 构建阶段
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# 运行阶段
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "app.py"]
```

## 前端应用示例

```dockerfile
# 构建阶段
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段（使用 Nginx 提供静态文件）
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 高级技巧

### 命名构建阶段

```dockerfile
FROM node:18 AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18 AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

### 使用外部镜像

```dockerfile
# 从其他镜像复制文件
FROM nginx:alpine
COPY --from=myregistry/static-files:latest /app /usr/share/nginx/html
```

### 构建特定阶段

```bash
# 只构建到 builder 阶段
docker build --target builder -t myapp:builder .

# 构建完整镜像
docker build -t myapp:latest .
```

## 最佳实践

1. ✅ 构建阶段使用完整镜像
2. ✅ 运行阶段使用精简镜像（alpine/slim）
3. ✅ 只复制必要的文件
4. ✅ 为每个阶段命名
5. ✅ 利用构建缓存

## 镜像大小对比

| 应用类型 | 单阶段 | 多阶段 | 减少 |
|---------|--------|--------|------|
| Node.js | ~1GB | ~200MB | 80% |
| Go | ~800MB | ~10MB | 99% |
| Python | ~1GB | ~150MB | 85% |
| React | ~1.5GB | ~25MB | 98% |

## 下一步

- [镜像优化](/advanced/image-optimization/) - 更多优化技巧
- [Dockerfile 基础](/basics/dockerfile-basics/) - 基础知识回顾
- [生产环境部署](/best-practices/production/) - 部署最佳实践

---

:::tip[显著减小镜像体积]
多阶段构建是减小镜像体积最有效的方法之一，强烈推荐在生产环境使用！
:::
