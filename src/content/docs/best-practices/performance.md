---
title: 性能优化
description: 优化 Docker 容器性能
---

优化 Docker 性能可以提高应用响应速度和资源利用率。

## 镜像优化

详见 [镜像优化](/advanced/image-optimization/) 和 [多阶段构建](/advanced/multi-stage-builds/)。

## 构建缓存优化

```dockerfile
# ✅ 好：依赖文件先复制，利用缓存
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# ❌ 不好：每次都重新安装依赖
COPY . .
RUN npm install
```

## 网络性能

### 使用自定义网络

```bash
# 创建自定义桥接网络
docker network create --driver bridge app-net
```

### 禁用不必要的网络功能

```bash
docker run --network none myapp
```

## 存储性能

### 使用数据卷

```bash
# ✅ 好：使用卷
docker run -v db-data:/var/lib/mysql mysql

# ❌ 不好：数据在容器层
docker run mysql
```

### 选择合适的存储驱动

```json
{
  "storage-driver": "overlay2"
}
```

## 资源限制

合理设置资源限制，防止资源争用：

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

## 并发和扩展

```bash
# 使用 Docker Compose 扩展服务
docker compose up -d --scale web=3
```

## 监控和分析

```bash
# 监控资源使用
docker stats

# 分析镜像层
docker history myapp
```

## 下一步

- [镜像优化](/advanced/image-optimization/)
- [资源限制](/advanced/resource-limits/)
- [生产环境部署](/best-practices/production/)
