---
title: 日志管理
description: 管理和查看 Docker 容器日志
---

良好的日志管理对于调试和监控容器应用至关重要。

## 查看日志

```bash
# 查看容器日志
docker logs container_name

# 实时查看日志
docker logs -f container_name

# 查看最后 100 行
docker logs --tail 100 container_name

# 查看带时间戳的日志
docker logs -t container_name

# 查看特定时间段的日志
docker logs --since 2024-01-01 container_name
docker logs --since 1h container_name
```

## 日志驱动

Docker 支持多种日志驱动：

### 配置日志驱动

```bash
# 使用 json-file（默认）
docker run -d --log-driver json-file nginx

# 使用 syslog
docker run -d --log-driver syslog nginx

# 禁用日志
docker run -d --log-driver none nginx
```

### 配置日志选项

```bash
docker run -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx
```

## Docker Compose 配置

```yaml
services:
  web:
    image: nginx
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 全局配置

编辑 `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## 日志聚合

### 使用 ELK Stack

```yaml
services:
  app:
    image: myapp
    logging:
      driver: "fluentd"
      options:
        fluentd-address: "localhost:24224"
```

### 使用 Loki

```yaml
services:
  app:
    image: myapp
    logging:
      driver: "loki"
      options:
        loki-url: "http://localhost:3100/loki/api/v1/push"
```

## 最佳实践

1. ✅ 设置日志大小限制
2. ✅ 限制日志文件数量
3. ✅ 使用结构化日志
4. ✅ 集中管理日志
5. ✅ 定期清理旧日志
