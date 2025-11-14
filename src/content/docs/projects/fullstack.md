---
title: 全栈应用部署
description: 使用 Docker Compose 部署完整的全栈应用
---

本文演示如何使用 Docker Compose 部署一个包含前端、后端、数据库的完整全栈应用。

## 项目结构

```
fullstack-app/
├── frontend/
│   ├── Dockerfile
│   └── ...
├── backend/
│   ├── Dockerfile
│   └── ...
├── nginx/
│   └── nginx.conf
└── docker-compose.yml
```

## docker-compose.yml

```yaml
version: '3.8'

services:
  # React 前端
  frontend:
    build: ./frontend
    volumes:
      - ./frontend/src:/app/src
    environment:
      - REACT_APP_API_URL=http://localhost:8000

  # Node.js 后端
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend

  # PostgreSQL 数据库
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Redis 缓存
  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

## Nginx 配置

```nginx
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:8000;
}

server {
    listen 80;

    location / {
        proxy_pass http://frontend;
    }

    location /api {
        proxy_pass http://backend;
    }
}
```

## 启动应用

```bash
docker compose up -d
```

访问 `http://localhost` 查看应用！

## 下一步

- [微服务架构](/projects/microservices/)
- [生产环境部署](/best-practices/production/)
