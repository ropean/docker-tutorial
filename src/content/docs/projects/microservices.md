---
title: 微服务架构
description: 使用 Docker 构建微服务架构
---

Docker 天然适合微服务架构。本文介绍如何使用 Docker Compose 编排微服务。

## 微服务示例

```yaml
services:
  # API 网关
  gateway:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./gateway/nginx.conf:/etc/nginx/nginx.conf

  # 用户服务
  user-service:
    build: ./services/user
    environment:
      - DATABASE_URL=postgresql://postgres:secret@user-db:5432/users
    depends_on:
      - user-db

  # 订单服务
  order-service:
    build: ./services/order
    environment:
      - DATABASE_URL=postgresql://postgres:secret@order-db:5432/orders
    depends_on:
      - order-db

  # 支付服务
  payment-service:
    build: ./services/payment
    environment:
      - REDIS_URL=redis://redis:6379

  # 通知服务
  notification-service:
    build: ./services/notification
    environment:
      - SMTP_HOST=smtp.example.com

  # 用户数据库
  user-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: users
      POSTGRES_PASSWORD: secret
    volumes:
      - user-db-data:/var/lib/postgresql/data

  # 订单数据库
  order-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: orders
      POSTGRES_PASSWORD: secret
    volumes:
      - order-db-data:/var/lib/postgresql/data

  # Redis 消息队列
  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data

volumes:
  user-db-data:
  order-db-data:
  redis-data:
```

## 服务发现

容器可以通过服务名称相互访问：

```javascript
// 在 order-service 中调用 user-service
fetch('http://user-service:3000/api/users/123')
```

## 负载均衡

```bash
# 扩展服务实例
docker compose up -d --scale order-service=3
```

## 最佳实践

1. ✅ 每个服务独立数据库
2. ✅ 使用消息队列解耦服务
3. ✅ 实施服务健康检查
4. ✅ 使用 API 网关统一入口
5. ✅ 集中日志和监控

## 下一步

- [Docker Compose](/practice/docker-compose/)
- [容器网络](/practice/networking/)
- [生产环境部署](/best-practices/production/)
