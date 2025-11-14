---
title: 生产环境部署
description: 在生产环境中部署 Docker 应用的最佳实践
---

将 Docker 应用部署到生产环境需要考虑可靠性、安全性和性能。

## 基本原则

### 1. 使用具体的镜像标签

```yaml
# ❌ 不好
services:
  web:
    image: myapp:latest

# ✅ 好
services:
  web:
    image: myapp:v1.2.3
```

### 2. 配置重启策略

```yaml
services:
  web:
    restart: unless-stopped

  db:
    restart: always
```

### 3. 设置资源限制

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 4. 配置健康检查

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 环境配置

### 使用环境文件

```yaml
# docker-compose.prod.yml
services:
  web:
    image: myapp:${VERSION}
    env_file:
      - .env.production
```

`.env.production`:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@db:5432/prod
REDIS_URL=redis://redis:6379
LOG_LEVEL=info
```

### 多环境配置

```bash
# 开发环境
docker compose up

# 生产环境
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## 日志管理

```yaml
services:
  web:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "production,web"
```

## 数据持久化

```yaml
services:
  db:
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/data/postgres
```

## 网络安全

```yaml
services:
  frontend:
    networks:
      - public

  backend:
    networks:
      - public
      - private

  db:
    networks:
      - private

networks:
  public:
  private:
    internal: true
```

## 监控和告警

### Prometheus + Grafana

```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
```

## 备份策略

### 数据库备份

```bash
# 备份脚本
#!/bin/bash
docker exec postgres pg_dump -U user dbname > backup-$(date +%Y%m%d).sql

# 定时备份（crontab）
0 2 * * * /path/to/backup.sh
```

### 卷备份

```bash
# 备份卷数据
docker run --rm \
  -v db-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/db-backup.tar.gz /data
```

## 滚动更新

```bash
# 使用 Docker Compose 进行零停机更新
docker compose pull
docker compose up -d --no-deps --build web

# 使用 Docker Swarm
docker service update --image myapp:v2.0 web
```

## 完整示例

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  web:
    image: myregistry.com/myapp:${VERSION}
    restart: unless-stopped
    env_file:
      - .env.production
    ports:
      - "127.0.0.1:3000:3000"
    networks:
      - app-network
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    restart: always
    env_file:
      - .env.db
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    networks:
      - app-network
    depends_on:
      - web

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
```

## 部署检查清单

- [ ] 使用具体版本标签
- [ ] 配置重启策略
- [ ] 设置资源限制
- [ ] 配置健康检查
- [ ] 使用环境变量文件
- [ ] 配置日志管理
- [ ] 数据持久化
- [ ] 网络隔离
- [ ] 启用 HTTPS
- [ ] 配置监控告警
- [ ] 制定备份策略
- [ ] 测试回滚流程

## 下一步

- [性能优化](/best-practices/performance/)
- [故障排查](/best-practices/troubleshooting/)
- [安全最佳实践](/best-practices/security/)

---

:::tip[生产环境建议]
在生产环境部署前，务必在类生产环境中充分测试！
:::
