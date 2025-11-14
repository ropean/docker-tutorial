---
title: 容器间通信
description: 实现 Docker 容器之间的通信
---

了解容器间如何通信是构建多容器应用的关键。

## 通信方式

### 1. 使用网络（推荐）

```bash
# 创建网络
docker network create app-net

# 运行容器
docker run -d --name api --network app-net myapi
docker run -d --name db --network app-net postgres

# api 容器可以通过 'db' 访问数据库
```

### 2. 使用容器链接（已弃用）

```bash
# 不推荐使用
docker run -d --name db postgres
docker run -d --name web --link db:database webapp
```

### 3. 使用 Docker Compose

```yaml
services:
  frontend:
    image: frontend
    depends_on:
      - backend

  backend:
    image: backend
    depends_on:
      - database

  database:
    image: postgres
```

## 实战示例

查看 [容器网络](/practice/networking/) 和 [Docker Compose](/practice/docker-compose/) 了解更多细节。
