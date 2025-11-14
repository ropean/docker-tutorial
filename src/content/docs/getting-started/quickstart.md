---
title: 快速开始
description: 5分钟上手 Docker，运行你的第一个容器
---

本指南将带你快速上手 Docker，通过实际操作理解 Docker 的基本概念。

## 运行第一个容器

确保你已经[安装了 Docker](/getting-started/installation/)，然后运行：

```bash
docker run hello-world
```

你会看到类似输出：

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image.
 4. The Docker daemon streamed that output to the Docker client, which sent it to your terminal.
```

### 发生了什么？

当你运行 `docker run hello-world` 时，Docker 执行了以下操作：

1. 🔍 在本地查找 `hello-world` 镜像
2. ⬇️ 本地没有，从 Docker Hub 下载
3. 📦 创建一个新容器
4. ▶️ 启动容器并执行程序
5. 📝 输出信息到终端
6. ⏹️ 容器执行完毕后停止

## 交互式容器

运行一个 Ubuntu 容器并进入交互模式：

```bash
docker run -it ubuntu bash
```

参数说明：
- `-i`: 保持标准输入打开（interactive）
- `-t`: 分配一个伪终端（TTY）
- `ubuntu`: 使用的镜像名称
- `bash`: 在容器中执行的命令

现在你在容器内部了！试试这些命令：

```bash
# 查看系统信息
cat /etc/os-release

# 查看当前目录
pwd

# 创建文件
echo "Hello from container" > test.txt
cat test.txt

# 退出容器
exit
```

:::note[容器的隔离性]
退出容器后，你在容器内创建的文件不会影响主机系统。这就是容器的隔离性。
:::

## 运行 Web 服务器

让我们运行一个真实的 web 服务器：

```bash
docker run -d -p 8080:80 --name my-nginx nginx
```

参数说明：
- `-d`: 后台运行（detached 模式）
- `-p 8080:80`: 端口映射，主机 8080 映射到容器 80
- `--name my-nginx`: 给容器命名
- `nginx`: 使用的镜像

### 访问服务

在浏览器中打开 `http://localhost:8080`，你会看到 Nginx 欢迎页面！

### 查看运行的容器

```bash
# 查看正在运行的容器
docker ps

# 输出示例
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                  NAMES
a1b2c3d4e5f6   nginx     "/docker-entrypoint.…"   10 seconds ago   Up 9 seconds    0.0.0.0:8080->80/tcp   my-nginx
```

### 查看容器日志

```bash
docker logs my-nginx
```

### 停止和启动容器

```bash
# 停止容器
docker stop my-nginx

# 启动容器
docker start my-nginx

# 重启容器
docker restart my-nginx
```

### 删除容器

```bash
# 必须先停止容器
docker stop my-nginx

# 删除容器
docker rm my-nginx

# 或者强制删除（一步完成）
docker rm -f my-nginx
```

## 管理镜像

### 查看本地镜像

```bash
docker images

# 输出示例
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
nginx         latest    a6bd71f48f68   2 weeks ago     187MB
ubuntu        latest    08d22c0ceb15   4 weeks ago     77.8MB
hello-world   latest    9c7a54a9a43c   6 months ago    13.3kB
```

### 搜索镜像

```bash
# 在 Docker Hub 搜索 Redis 相关镜像
docker search redis

# 输出示例
NAME                      DESCRIPTION                                     STARS     OFFICIAL
redis                     Redis is an open source key-value store...     12000     [OK]
redislabs/redisearch      Redis with RedisSearch module...               500
```

### 下载镜像

```bash
# 下载最新版本
docker pull redis

# 下载指定版本
docker pull redis:7.2-alpine

# 查看镜像详细信息
docker inspect redis
```

### 删除镜像

```bash
# 删除指定镜像
docker rmi nginx

# 删除所有未使用的镜像
docker image prune -a
```

## 实战：运行数据库

### 运行 MySQL

```bash
docker run -d \
  --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  -e MYSQL_DATABASE=myapp \
  -p 3306:3306 \
  mysql:8
```

连接数据库：

```bash
# 使用 MySQL 客户端连接
mysql -h 127.0.0.1 -P 3306 -u root -p
# 输入密码: my-secret-pw

# 或者进入容器内部
docker exec -it mysql-db mysql -u root -p
```

### 运行 Redis

```bash
docker run -d \
  --name redis-cache \
  -p 6379:6379 \
  redis:alpine
```

测试连接：

```bash
# 进入容器运行 redis-cli
docker exec -it redis-cache redis-cli

# 测试命令
127.0.0.1:6379> SET mykey "Hello Docker"
OK
127.0.0.1:6379> GET mykey
"Hello Docker"
127.0.0.1:6379> exit
```

### 运行 PostgreSQL

```bash
docker run -d \
  --name postgres-db \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  postgres:15-alpine
```

## 实战：运行应用

### Node.js 应用

创建一个简单的 Node.js 应用：

```bash
# 创建项目目录
mkdir my-node-app && cd my-node-app

# 创建 app.js
cat > app.js << 'EOF'
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js in Docker!\n');
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
EOF

# 创建 Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY app.js .
EXPOSE 3000
CMD ["node", "app.js"]
EOF

# 构建镜像
docker build -t my-node-app .

# 运行容器
docker run -d -p 3000:3000 --name node-app my-node-app

# 测试
curl http://localhost:3000
```

### Python Flask 应用

```bash
# 创建项目目录
mkdir my-flask-app && cd my-flask-app

# 创建 app.py
cat > app.py << 'EOF'
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from Flask in Docker!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

# 创建 requirements.txt
echo "flask==3.0.0" > requirements.txt

# 创建 Dockerfile
cat > Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]
EOF

# 构建和运行
docker build -t my-flask-app .
docker run -d -p 5000:5000 --name flask-app my-flask-app

# 测试
curl http://localhost:5000
```

## 常用命令速查

### 容器操作

```bash
# 运行容器
docker run [OPTIONS] IMAGE [COMMAND]

# 列出容器
docker ps              # 运行中的容器
docker ps -a           # 所有容器

# 停止/启动/重启
docker stop CONTAINER
docker start CONTAINER
docker restart CONTAINER

# 删除容器
docker rm CONTAINER
docker rm -f CONTAINER  # 强制删除

# 查看日志
docker logs CONTAINER
docker logs -f CONTAINER  # 实时查看

# 进入容器
docker exec -it CONTAINER bash

# 查看容器详情
docker inspect CONTAINER
```

### 镜像操作

```bash
# 列出镜像
docker images

# 搜索镜像
docker search IMAGE

# 下载镜像
docker pull IMAGE

# 删除镜像
docker rmi IMAGE

# 构建镜像
docker build -t NAME:TAG .

# 查看镜像历史
docker history IMAGE
```

### 清理命令

```bash
# 清理停止的容器
docker container prune

# 清理未使用的镜像
docker image prune

# 清理未使用的卷
docker volume prune

# 清理所有未使用的资源
docker system prune -a
```

## 常见问题

### 1. 端口已被占用

```bash
# 错误
Error: Bind for 0.0.0.0:8080 failed: port is already allocated

# 解决：使用不同端口
docker run -p 8081:80 nginx
```

### 2. 容器立即退出

```bash
# 查看退出原因
docker logs CONTAINER_ID

# 以交互模式运行调试
docker run -it IMAGE bash
```

### 3. 无法连接到容器服务

```bash
# 确保端口映射正确
docker ps  # 查看 PORTS 列

# 检查容器内服务是否启动
docker logs CONTAINER_ID

# 检查防火墙设置
```

### 4. 磁盘空间不足

```bash
# 查看磁盘使用
docker system df

# 清理未使用资源
docker system prune -a --volumes
```

## 下一步

恭喜！你已经掌握了 Docker 的基本操作。接下来可以：

1. [深入理解镜像与容器](/basics/images-and-containers/)
2. [学习 Docker 命令详解](/basics/commands/)
3. [编写 Dockerfile](/basics/dockerfile-basics/)
4. [使用 Docker Compose](/practice/docker-compose/)

## 实用技巧

### 1. 容器别名

```bash
# 在 .bashrc 或 .zshrc 中添加
alias dps='docker ps'
alias dpa='docker ps -a'
alias di='docker images'
alias drm='docker rm'
alias drmi='docker rmi'
```

### 2. 自动删除容器

```bash
# 使用 --rm 参数，容器退出后自动删除
docker run --rm -it ubuntu bash
```

### 3. 后台运行并查看日志

```bash
# 后台运行
docker run -d --name myapp myimage

# 实时查看日志
docker logs -f myapp
```

### 4. 复制文件

```bash
# 从容器复制到主机
docker cp CONTAINER:/path/to/file /host/path

# 从主机复制到容器
docker cp /host/path CONTAINER:/path/to/file
```

### 5. 查看资源使用

```bash
# 查看所有容器的资源使用情况
docker stats

# 查看特定容器
docker stats CONTAINER
```

---

:::tip[保持学习]
Docker 的学习是一个渐进的过程。多动手实践，遇到问题查文档或社区，你会越来越熟练！
:::
