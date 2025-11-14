---
title: 资源限制
description: 限制容器资源使用，防止资源耗尽
---

限制容器资源可以防止单个容器耗尽系统资源，提高系统稳定性。

## 内存限制

```bash
# 限制内存为 512MB
docker run -d --memory="512m" nginx

# 限制内存和 swap
docker run -d --memory="512m" --memory-swap="1g" nginx

# 禁用 swap
docker run -d --memory="512m" --memory-swap="512m" nginx
```

## CPU 限制

```bash
# 限制 CPU 使用率为 50%
docker run -d --cpus="0.5" nginx

# 限制 CPU 核心数
docker run -d --cpus="2" nginx

# 设置 CPU 权重
docker run -d --cpu-shares=512 nginx
```

## Docker Compose 配置

```yaml
services:
  web:
    image: nginx
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## 查看资源使用

```bash
# 查看所有容器资源使用
docker stats

# 查看特定容器
docker stats container_name

# 不实时更新
docker stats --no-stream
```

## 最佳实践

1. ✅ 根据应用实际需求设置限制
2. ✅ 监控资源使用情况
3. ✅ 设置合理的内存限制防止 OOM
4. ✅ 使用健康检查配合资源限制
5. ✅ 在生产环境始终设置资源限制
