---
title: 开发环境配置
description: 使用 Docker 配置高效的开发环境
---

Docker 可以为开发提供一致、隔离的环境，提高团队协作效率。

## 热重载开发

### Node.js 应用

```yaml
# docker-compose.yml
services:
  app:
    build: .
    volumes:
      - ./src:/app/src          # 源码同步
      - /app/node_modules       # 不覆盖 node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    command: npm run dev        # 使用开发命令
```

### Python 应用

```yaml
services:
  app:
    build: .
    volumes:
      - .:/app
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=development
      - FLASK_DEBUG=1
    command: flask run --host=0.0.0.0
```

## 多环境配置

### 基础配置

`docker-compose.yml`:

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
```

### 开发环境覆盖

`docker-compose.override.yml` (自动加载):

```yaml
services:
  web:
    volumes:
      - ./src:/app/src
    environment:
      - DEBUG=true
    command: npm run dev
```

### 使用

```bash
# 开发环境（自动加载 override）
docker compose up

# 生产环境
docker compose -f docker-compose.yml up
```

## 调试配置

### Node.js 调试

```yaml
services:
  app:
    ports:
      - "3000:3000"
      - "9229:9229"  # 调试端口
    command: node --inspect=0.0.0.0:9229 server.js
```

VSCode `launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Docker: Attach to Node",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/app"
    }
  ]
}
```

### Python 调试

```yaml
services:
  app:
    ports:
      - "5000:5000"
      - "5678:5678"  # 调试端口
    command: python -m debugpy --listen 0.0.0.0:5678 app.py
```

## 数据库开发

```yaml
services:
  app:
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: devdb
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres-data:
```

## 完整开发环境示例

```yaml
version: '3.8'

services:
  # 前端开发服务器
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    volumes:
      - ./frontend/src:/app/src
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - CHOKIDAR_USEPOLLING=true  # 热重载
    stdin_open: true
    tty: true

  # 后端 API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
      - "9229:9229"  # 调试端口
    environment:
      - DATABASE_URL=postgresql://dev:dev@db:5432/devdb
      - NODE_ENV=development
    depends_on:
      - db
      - redis
    command: npm run dev

  # 数据库
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: devdb
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  # Adminer（数据库管理）
  adminer:
    image: adminer
    ports:
      - "8080:8080"

volumes:
  postgres-data:
```

## 开发工具集成

### VS Code

安装 Docker 扩展，可以直接在 VS Code 中管理容器。

### JetBrains IDEs

配置 Docker 集成，支持远程调试和开发。

## 最佳实践

1. ✅ 使用卷挂载实现热重载
2. ✅ 分离开发和生产配置
3. ✅ 配置调试端口
4. ✅ 使用 .dockerignore 排除文件
5. ✅ 为开发环境添加开发工具

## Makefile 简化命令

```makefile
.PHONY: up down logs shell clean

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

shell:
	docker compose exec app sh

clean:
	docker compose down -v
	docker system prune -f
```

使用：

```bash
make up      # 启动
make logs    # 查看日志
make shell   # 进入容器
make clean   # 清理
```

## 下一步

- [Docker Compose](/practice/docker-compose/)
- [生产环境部署](/best-practices/production/)
- [故障排查](/best-practices/troubleshooting/)
