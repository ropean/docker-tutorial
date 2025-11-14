---
title: Node.js 应用容器化
description: 完整的 Node.js 应用 Docker 化实战
---

本文通过一个完整的 Node.js 应用示例，演示如何将应用容器化并部署。

## 创建应用

### package.json

```json
{
  "name": "docker-nodejs-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### server.js

```javascript
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// 数据库连接
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Hello from Docker!',
      time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装所有依赖（包括 devDependencies）
RUN npm ci

# 复制源代码
COPY . .

# 运行阶段
FROM node:18-alpine

# 创建非 root 用户
RUN addgroup -g 1001 nodejs && \
    adduser -D -u 1001 -G nodejs nodejs

WORKDIR /app

# 从构建阶段复制 node_modules 和应用代码
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs server.js ./

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动命令
CMD ["node", "server.js"]
```

## docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
      - PORT=3000
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres-data:
```

## .dockerignore

```
node_modules
npm-debug.log
.env
.git
.vscode
*.md
coverage
dist
```

## 开发环境配置

`docker-compose.override.yml`:

```yaml
services:
  app:
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

## 构建和运行

```bash
# 构建镜像
docker compose build

# 启动服务
docker compose up -d

# 查看日志
docker compose logs -f

# 测试应用
curl http://localhost:3000
```

## 生产部署

`docker-compose.prod.yml`:

```yaml
services:
  app:
    image: myregistry.com/nodejs-app:${VERSION}
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
    environment:
      - NODE_ENV=production
    restart: always
```

部署：

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 下一步

- [Python 应用容器化](/projects/python/)
- [全栈应用部署](/projects/fullstack/)
- [生产环境部署](/best-practices/production/)
