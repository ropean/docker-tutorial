---
title: docker-compose.yml 配置参考
description: Docker Compose 文件配置详解
---

Docker Compose 文件配置的完整参考。

## 基本结构

```yaml
version: '3.8'

services:
  # 服务定义
  web:
    # ...

networks:
  # 网络定义

volumes:
  # 卷定义
```

## 服务配置

### 镜像相关

```yaml
services:
  web:
    image: nginx:alpine          # 使用镜像
    build: .                     # 构建镜像
    build:
      context: ./dir
      dockerfile: Dockerfile
      args:
        VERSION: "1.0"
```

### 端口和网络

```yaml
services:
  web:
    ports:
      - "8080:80"
      - "443:443"
    networks:
      - frontend
      - backend
    dns:
      - 8.8.8.8
```

### 环境变量

```yaml
services:
  web:
    environment:
      NODE_ENV: production
      PORT: 3000
    env_file:
      - .env
      - .env.production
```

### 数据卷

```yaml
services:
  web:
    volumes:
      - ./src:/app/src           # 绑定挂载
      - data:/app/data           # 命名卷
      - /app/node_modules        # 匿名卷
```

### 依赖和启动顺序

```yaml
services:
  web:
    depends_on:
      - db
    depends_on:
      db:
        condition: service_healthy
```

### 重启策略

```yaml
services:
  web:
    restart: always              # always, on-failure, unless-stopped, no
```

### 资源限制

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

### 健康检查

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 日志配置

```yaml
services:
  web:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

## 网络配置

```yaml
networks:
  frontend:
    driver: bridge
  backend:
    internal: true
```

## 卷配置

```yaml
volumes:
  db-data:
    driver: local
  cache:
    external: true
```

## 完整示例

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      args:
        NODE_VERSION: 18
    image: myapp:${VERSION:-latest}
    container_name: web-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:pass@db:5432/mydb
    env_file:
      - .env
    volumes:
      - ./src:/app/src
      - node-modules:/app/node_modules
    networks:
      - frontend
      - backend
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  frontend:
    driver: bridge
  backend:
    internal: true

volumes:
  node-modules:
  postgres-data:
```

## 相关资源

- [Docker Compose](/practice/docker-compose/)
- [官方文档](https://docs.docker.com/compose/compose-file/)
