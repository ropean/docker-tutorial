---
title: Docker Compose
description: 使用 Docker Compose 编排多容器应用
---

Docker Compose 是一个用于定义和运行多容器 Docker 应用的工具。通过一个 YAML 文件配置应用的所有服务，然后用一条命令启动所有服务。

## 为什么需要 Docker Compose？

### 单容器的局限

```bash
# 手动启动多个容器很麻烦
docker run -d --name db postgres
docker run -d --name redis redis
docker run -d --name web --link db --link redis myapp
docker run -d --name nginx --link web nginx
```

### 使用 Compose

```yaml
# docker-compose.yml
services:
  db:
    image: postgres
  redis:
    image: redis
  web:
    image: myapp
  nginx:
    image: nginx
```

```bash
# 一条命令启动所有服务
docker compose up
```

## 安装 Docker Compose

### Docker Desktop

Docker Desktop 已内置 Compose V2，无需额外安装。

### Linux

```bash
# Compose 已作为 Docker 插件安装
docker compose version

# 如果没有，手动安装
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### 验证安装

```bash
docker compose version
# Docker Compose version v2.23.0
```

## 第一个 Compose 应用

### 创建项目结构

```bash
mkdir my-web-app && cd my-web-app
```

### 创建应用代码

`app.py`:

```python
from flask import Flask
from redis import Redis

app = Flask(__name__)
redis = Redis(host='redis', port=6379)

@app.route('/')
def hello():
    count = redis.incr('hits')
    return f'Hello! This page has been visited {count} times.\n'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

`requirements.txt`:

```
flask==3.0.0
redis==5.0.0
```

`Dockerfile`:

```dockerfile
FROM python:3.11-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .
CMD ["python", "app.py"]
```

### 创建 docker-compose.yml

```yaml
services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - redis

  redis:
    image: redis:alpine
```

### 启动应用

```bash
# 构建并启动
docker compose up

# 后台运行
docker compose up -d

# 查看日志
docker compose logs

# 停止应用
docker compose down
```

访问 `http://localhost:5000`，每次刷新计数器都会增加！

## docker-compose.yml 详解

### 基本结构

```yaml
services:          # 定义服务
  service1:
    # ...
  service2:
    # ...

networks:          # 定义网络（可选）
  # ...

volumes:           # 定义卷（可选）
  # ...
```

### services - 服务定义

#### image - 使用镜像

```yaml
services:
  db:
    image: postgres:15-alpine
  redis:
    image: redis:7-alpine
  nginx:
    image: nginx:alpine
```

#### build - 构建镜像

```yaml
services:
  web:
    build: .                    # 使用当前目录的 Dockerfile

  api:
    build:
      context: ./api            # 构建上下文
      dockerfile: Dockerfile    # Dockerfile 名称
      args:                     # 构建参数
        NODE_VERSION: 18
```

#### ports - 端口映射

```yaml
services:
  web:
    ports:
      - "8080:80"              # 主机:容器
      - "443:443"
      - "127.0.0.1:3000:3000"  # 绑定到本地回环
```

#### environment - 环境变量

```yaml
services:
  db:
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_USER: admin
      POSTGRES_DB: myapp

  # 或使用数组语法
  web:
    environment:
      - NODE_ENV=production
      - DEBUG=false
```

#### env_file - 环境变量文件

`.env`:

```env
DATABASE_URL=postgresql://user:pass@db:5432/myapp
REDIS_URL=redis://redis:6379
SECRET_KEY=my-secret-key
```

`docker-compose.yml`:

```yaml
services:
  web:
    env_file:
      - .env
```

#### volumes - 数据卷

```yaml
services:
  db:
    volumes:
      - db-data:/var/lib/postgresql/data    # 命名卷
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # 主机目录

  web:
    volumes:
      - ./src:/app/src         # 开发时代码同步
      - /app/node_modules      # 匿名卷

volumes:
  db-data:                     # 定义命名卷
```

#### depends_on - 依赖关系

```yaml
services:
  web:
    depends_on:
      - db
      - redis

  # 高级健康检查
  app:
    depends_on:
      db:
        condition: service_healthy

  db:
    healthcheck:
      test: ["CMD", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5
```

#### networks - 网络配置

```yaml
services:
  frontend:
    networks:
      - frontend-net

  backend:
    networks:
      - frontend-net
      - backend-net

  db:
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:
```

#### restart - 重启策略

```yaml
services:
  web:
    restart: always           # 总是重启

  worker:
    restart: on-failure       # 失败时重启

  cache:
    restart: unless-stopped   # 除非手动停止
```

#### command - 覆盖默认命令

```yaml
services:
  web:
    command: python app.py --debug

  worker:
    command: ["celery", "worker", "-A", "tasks"]
```

#### healthcheck - 健康检查

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 完整实例

### 全栈应用

```yaml
version: '3.8'

services:
  # 前端
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    volumes:
      - ./frontend/src:/app/src
    depends_on:
      - backend
    networks:
      - app-network

  # 后端 API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    env_file:
      - ./backend/.env
    volumes:
      - ./backend:/app
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network
    restart: unless-stopped

  # 数据库
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network
    restart: unless-stopped

  # 缓存
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - app-network
    restart: unless-stopped

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
```

### WordPress + MySQL

```yaml
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: secret
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress-data:/var/www/html
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootsecret
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: secret
    volumes:
      - db-data:/var/lib/mysql
    restart: always

volumes:
  wordpress-data:
  db-data:
```

## Compose 命令

### 基本命令

```bash
# 启动服务
docker compose up

# 后台运行
docker compose up -d

# 构建镜像
docker compose build

# 重新构建并启动
docker compose up --build

# 停止服务
docker compose stop

# 停止并删除容器
docker compose down

# 停止并删除容器、网络、卷
docker compose down -v
```

### 管理命令

```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs

# 实时查看日志
docker compose logs -f

# 查看特定服务日志
docker compose logs web

# 执行命令
docker compose exec web bash

# 在服务中运行一次性命令
docker compose run web python manage.py migrate
```

### 扩展命令

```bash
# 扩展服务实例
docker compose up -d --scale web=3

# 查看配置
docker compose config

# 验证配置
docker compose config --quiet

# 拉取镜像
docker compose pull

# 推送镜像
docker compose push
```

## 开发环境配置

### 热重载开发

```yaml
services:
  web:
    build: .
    volumes:
      - ./src:/app/src        # 源码挂载
      - /app/node_modules     # 排除 node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev       # 使用开发命令
```

### 多环境配置

基础配置 `docker-compose.yml`:

```yaml
services:
  web:
    image: myapp
    environment:
      - NODE_ENV=production
```

开发环境 `docker-compose.override.yml` (自动加载):

```yaml
services:
  web:
    build: .
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development
    command: npm run dev
```

生产环境 `docker-compose.prod.yml`:

```yaml
services:
  web:
    image: myregistry/myapp:latest
    restart: always
```

```bash
# 开发环境（自动加载 override）
docker compose up

# 生产环境
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## 最佳实践

### 1. 使用 .env 文件

```env
# .env
POSTGRES_VERSION=15
REDIS_VERSION=7
APP_PORT=8000
```

```yaml
services:
  db:
    image: postgres:${POSTGRES_VERSION}-alpine

  redis:
    image: redis:${REDIS_VERSION}-alpine

  web:
    ports:
      - "${APP_PORT}:8000"
```

### 2. 健康检查

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
```

### 3. 资源限制

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### 4. 网络隔离

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
      - private      # 数据库只在内部网络

networks:
  public:
  private:
    internal: true   # 内部网络，无外网访问
```

## 故障排查

### 查看日志

```bash
# 所有服务日志
docker compose logs

# 特定服务
docker compose logs web

# 实时查看
docker compose logs -f

# 最后 100 行
docker compose logs --tail=100
```

### 调试容器

```bash
# 进入容器
docker compose exec web bash

# 查看环境变量
docker compose exec web env

# 查看网络
docker compose exec web ping db
```

### 重建服务

```bash
# 重建特定服务
docker compose up -d --force-recreate web

# 重建并不使用缓存
docker compose build --no-cache web
docker compose up -d web
```

## 小结

Docker Compose 让多容器应用管理变得简单：

✅ 一个文件定义所有服务
✅ 一条命令启动整个应用
✅ 自动管理网络和卷
✅ 支持多环境配置
✅ 易于扩展和维护

## 下一步

- [容器网络](/practice/networking/) - 深入理解容器网络
- [数据卷管理](/practice/volumes/) - 管理持久化数据
- [生产环境部署](/best-practices/production/) - 部署到生产环境

---

:::tip[参考资料]
- [Compose 文件规范](https://docs.docker.com/compose/compose-file/)
- [Compose CLI 参考](https://docs.docker.com/compose/reference/)
:::
