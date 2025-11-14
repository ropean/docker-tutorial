---
title: 数据卷管理
description: 管理和持久化 Docker 容器数据
---

容器删除后数据会丢失，数据卷（Volume）用于持久化和共享数据。

## 为什么需要数据卷？

容器是临时的，删除容器会丢失所有数据：

```bash
# 运行 MySQL 容器
docker run -d --name db mysql

# 删除容器
docker rm -f db

# 数据丢失了！😱
```

使用数据卷可以保留数据：

```bash
# 使用命名卷
docker run -d --name db -v mysql-data:/var/lib/mysql mysql

# 删除容器
docker rm -f db

# 数据还在！重新运行容器数据会恢复
docker run -d --name db -v mysql-data:/var/lib/mysql mysql
```

## 数据卷类型

### 命名卷（Named Volumes）

推荐使用，由 Docker 管理。

```bash
# 创建卷
docker volume create my-data

# 使用卷
docker run -d -v my-data:/app/data nginx

# 查看卷
docker volume ls

# 查看卷详情
docker volume inspect my-data
```

### 绑定挂载（Bind Mounts）

直接挂载主机目录。

```bash
# 挂载当前目录
docker run -d -v $(pwd):/app nginx

# 挂载特定目录
docker run -d -v /host/path:/container/path nginx

# 只读挂载
docker run -d -v /host/path:/container/path:ro nginx
```

### 匿名卷（Anonymous Volumes）

```bash
# Docker 自动创建
docker run -d -v /app/data nginx
```

## 使用场景

### 数据库数据

```bash
docker run -d \
  --name postgres \
  -v postgres-data:/var/lib/postgresql/data \
  postgres
```

### 开发环境代码同步

```bash
docker run -d \
  --name dev \
  -v $(pwd)/src:/app/src \
  -p 3000:3000 \
  node-app
```

### 配置文件

```bash
docker run -d \
  --name nginx \
  -v ./nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx
```

### 日志文件

```bash
docker run -d \
  --name app \
  -v logs:/var/log/app \
  myapp
```

## 数据卷管理

### 基本操作

```bash
# 创建卷
docker volume create my-volume

# 列出卷
docker volume ls

# 查看卷详情
docker volume inspect my-volume

# 删除卷
docker volume rm my-volume

# 清理未使用的卷
docker volume prune
```

### 备份和恢复

#### 备份

```bash
# 将卷数据备份到 tar 文件
docker run --rm \
  -v my-data:/data \
  -v $(pwd):/backup \
  ubuntu tar czf /backup/backup.tar.gz /data
```

#### 恢复

```bash
# 从 tar 文件恢复数据
docker run --rm \
  -v my-data:/data \
  -v $(pwd):/backup \
  ubuntu tar xzf /backup/backup.tar.gz -C /
```

## Docker Compose 中使用卷

```yaml
services:
  db:
    image: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data

  web:
    image: myapp
    volumes:
      - ./src:/app/src        # 绑定挂载
      - node-modules:/app/node_modules  # 命名卷

volumes:
  postgres-data:
  node-modules:
```

## 最佳实践

1. ✅ 数据库使用命名卷
2. ✅ 开发环境使用绑定挂载
3. ✅ 配置文件使用只读挂载
4. ✅ 定期备份重要数据
5. ✅ 及时清理未使用的卷

## 常见问题

### 权限问题

```bash
# 以特定用户运行
docker run -u $(id -u):$(id -g) -v $(pwd):/app myapp
```

### 查看卷在主机上的位置

```bash
docker volume inspect my-volume --format '{{ .Mountpoint }}'
```

## 下一步

- [Docker Compose](/practice/docker-compose/) - 编排多容器应用
- [容器网络](/practice/networking/) - 容器间通信
- [数据备份策略](/best-practices/production/) - 生产环境最佳实践
