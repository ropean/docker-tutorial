---
title: 常用镜像推荐
description: 精选的常用 Docker 官方镜像
---

这里列出了最常用的官方 Docker 镜像及其使用方法。

## 编程语言

### Node.js

```bash
# 最新版本
docker pull node:latest

# 推荐：指定版本 + alpine
docker pull node:18-alpine
docker pull node:20-alpine

# 使用
docker run -it node:18-alpine node
```

### Python

```bash
# 推荐：slim 变体
docker pull python:3.11-slim
docker pull python:3.12-slim

# Alpine 版本（更小）
docker pull python:3.11-alpine

# 使用
docker run -it python:3.11-slim python
```

### Java

```bash
# OpenJDK
docker pull openjdk:17-jdk-slim
docker pull eclipse-temurin:17-jdk-alpine

# 使用
docker run -it openjdk:17-jdk-slim java -version
```

### Go

```bash
docker pull golang:1.21-alpine

# 使用
docker run -it golang:1.21-alpine go version
```

### PHP

```bash
docker pull php:8.2-fpm-alpine
docker pull php:8.2-apache

# 使用
docker run -d -p 80:80 php:8.2-apache
```

## 数据库

### PostgreSQL

```bash
docker pull postgres:15-alpine

docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  postgres:15-alpine
```

### MySQL

```bash
docker pull mysql:8

docker run -d \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=mydb \
  -p 3306:3306 \
  mysql:8
```

### MongoDB

```bash
docker pull mongo:7

docker run -d \
  --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -p 27017:27017 \
  mongo:7
```

### Redis

```bash
docker pull redis:alpine

docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:alpine
```

## Web 服务器

### Nginx

```bash
docker pull nginx:alpine

docker run -d \
  --name nginx \
  -p 80:80 \
  -v ./html:/usr/share/nginx/html \
  nginx:alpine
```

### Apache

```bash
docker pull httpd:alpine

docker run -d \
  --name apache \
  -p 80:80 \
  httpd:alpine
```

### Caddy

```bash
docker pull caddy:alpine

docker run -d \
  --name caddy \
  -p 80:80 \
  -p 443:443 \
  caddy:alpine
```

## 工具和服务

### Adminer（数据库管理）

```bash
docker pull adminer

docker run -d \
  --name adminer \
  -p 8080:8080 \
  adminer
```

### Grafana（监控可视化）

```bash
docker pull grafana/grafana

docker run -d \
  --name grafana \
  -p 3000:3000 \
  grafana/grafana
```

### Prometheus（监控）

```bash
docker pull prom/prometheus

docker run -d \
  --name prometheus \
  -p 9090:9090 \
  prom/prometheus
```

## 操作系统

### Ubuntu

```bash
docker pull ubuntu:22.04

docker run -it ubuntu:22.04 bash
```

### Alpine

```bash
docker pull alpine:latest

docker run -it alpine:latest sh
```

### Debian

```bash
docker pull debian:bullseye-slim

docker run -it debian:bullseye-slim bash
```

## 镜像选择建议

### 1. 使用 Alpine 变体

```bash
# ✅ 推荐：体积小
node:18-alpine       # ~180MB
python:3.11-alpine   # ~50MB

# ❌ 不推荐：体积大
node:18              # ~1GB
python:3.11          # ~900MB
```

### 2. 使用 Slim 变体

```bash
# Debian slim 变体（比 Alpine 稍大，但兼容性更好）
python:3.11-slim     # ~130MB
```

### 3. 固定版本

```bash
# ✅ 好
FROM node:18.17-alpine3.18

# ❌ 不好
FROM node:latest
```

## 镜像大小对比

| 镜像 | latest | alpine | slim |
|------|--------|--------|------|
| node | ~1GB | ~180MB | ~250MB |
| python | ~900MB | ~50MB | ~130MB |
| nginx | ~187MB | ~42MB | - |
| postgres | ~400MB | ~240MB | - |

## 查找镜像

### Docker Hub

访问 [Docker Hub](https://hub.docker.com/) 搜索镜像。

### 搜索命令

```bash
docker search nginx
docker search --filter stars=100 postgres
```

## 下一步

- [Dockerfile 基础](/basics/dockerfile-basics/)
- [镜像优化](/advanced/image-optimization/)
- [构建第一个镜像](/practice/build-first-image/)

---

:::tip[官方镜像优先]
始终优先使用官方镜像，它们经过安全审查和优化。
:::
