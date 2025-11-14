---
title: 容器网络
description: 理解和配置 Docker 容器网络
---

Docker 网络让容器能够相互通信，并与外部世界连接。

## 网络类型

Docker 提供了多种网络驱动：

### bridge（桥接网络）

默认网络类型，用于同一主机上的容器通信。

```bash
# 创建自定义桥接网络
docker network create my-network

# 运行容器并连接到网络
docker run -d --name web --network my-network nginx
```

### host（主机网络）

容器直接使用主机网络栈。

```bash
docker run -d --network host nginx
```

### none（无网络）

容器没有网络连接。

```bash
docker run -d --network none nginx
```

## 容器间通信

### 使用容器名称

```bash
# 创建网络
docker network create app-network

# 运行数据库
docker run -d --name db --network app-network postgres

# 运行应用（可以通过 'db' 访问数据库）
docker run -d --name web --network app-network \
  -e DATABASE_HOST=db myapp
```

### 端口映射

```bash
# 映射到主机端口
docker run -d -p 8080:80 nginx

# 映射到本地回环地址
docker run -d -p 127.0.0.1:8080:80 nginx

# 映射所有端口
docker run -d -P nginx
```

## 网络管理

```bash
# 列出网络
docker network ls

# 查看网络详情
docker network inspect my-network

# 连接容器到网络
docker network connect my-network container_name

# 断开连接
docker network disconnect my-network container_name

# 删除网络
docker network rm my-network
```

## 实战示例

### 多容器应用网络

```bash
# 创建网络
docker network create web-app

# 启动数据库
docker run -d \
  --name db \
  --network web-app \
  -e POSTGRES_PASSWORD=secret \
  postgres

# 启动 Redis
docker run -d \
  --name redis \
  --network web-app \
  redis

# 启动应用
docker run -d \
  --name api \
  --network web-app \
  -e DB_HOST=db \
  -e REDIS_HOST=redis \
  myapp

# 启动 Nginx
docker run -d \
  --name nginx \
  --network web-app \
  -p 80:80 \
  nginx
```

现在所有容器都可以通过名称相互访问！

## 下一步

- [Docker Compose](/practice/docker-compose/) - 更方便的多容器管理
- [数据卷管理](/practice/volumes/) - 持久化数据
