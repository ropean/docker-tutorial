---
title: Docker 命令详解
description: 详细介绍 Docker 常用命令及其使用方法
---

本章详细介绍 Docker 的常用命令，帮助你熟练掌握 Docker 的日常操作。

## 命令分类

Docker 命令可以分为以下几类：

- 🖼️ **镜像管理**: pull, push, build, images, rmi
- 📦 **容器管理**: run, start, stop, rm, ps, exec
- 🌐 **网络管理**: network create, connect, disconnect
- 💾 **数据卷管理**: volume create, rm, ls
- 🔧 **系统管理**: info, version, system prune

## 容器生命周期命令

### docker run - 运行容器

这是最常用的命令，从镜像创建并启动容器。

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

#### 常用选项

```bash
# 后台运行
docker run -d nginx

# 指定容器名称
docker run --name my-nginx nginx

# 端口映射
docker run -p 8080:80 nginx

# 环境变量
docker run -e MYSQL_ROOT_PASSWORD=secret mysql

# 挂载卷
docker run -v /host/path:/container/path nginx

# 自动删除
docker run --rm nginx

# 交互式终端
docker run -it ubuntu bash
```

#### 完整示例

```bash
docker run -d \
  --name my-web-app \
  -p 8080:80 \
  -e NODE_ENV=production \
  -v /data:/app/data \
  --restart unless-stopped \
  myapp:latest
```

### docker ps - 查看容器

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 只显示容器 ID
docker ps -q

# 显示最近创建的 N 个容器
docker ps -n 5
```

### docker start/stop/restart

```bash
# 启动已停止的容器
docker start container_name

# 停止运行中的容器
docker stop container_name

# 强制停止容器
docker stop -t 0 container_name

# 重启容器
docker restart container_name
```

### docker exec - 在容器中执行命令

```bash
# 进入容器
docker exec -it container_name bash

# 执行单个命令
docker exec container_name ls /app

# 以特定用户执行
docker exec -u root container_name whoami
```

### docker logs - 查看日志

```bash
# 查看日志
docker logs container_name

# 实时查看日志
docker logs -f container_name

# 查看最后 100 行
docker logs --tail 100 container_name

# 查看带时间戳的日志
docker logs -t container_name

# 查看某时间段的日志
docker logs --since 2024-01-01 container_name
```

## 镜像管理命令

### docker images - 列出镜像

```bash
# 列出所有镜像
docker images

# 只显示镜像 ID
docker images -q

# 显示悬空镜像
docker images -f "dangling=true"
```

### docker pull - 拉取镜像

```bash
# 拉取最新版本
docker pull nginx

# 拉取指定版本
docker pull nginx:1.25-alpine

# 拉取特定平台
docker pull --platform linux/amd64 nginx
```

### docker build - 构建镜像

```bash
# 基本构建
docker build -t myapp .

# 指定 Dockerfile
docker build -t myapp -f Dockerfile.prod .

# 不使用缓存
docker build --no-cache -t myapp .

# 传递构建参数
docker build --build-arg VERSION=1.0 -t myapp .
```

### docker push - 推送镜像

```bash
# 推送到 Docker Hub
docker push username/myapp:latest

# 推送到私有仓库
docker push registry.example.com/myapp:latest
```

### docker rmi - 删除镜像

```bash
# 删除单个镜像
docker rmi nginx

# 删除多个镜像
docker rmi nginx redis mysql

# 强制删除
docker rmi -f nginx
```

## 网络命令

```bash
# 列出网络
docker network ls

# 创建网络
docker network create my-network

# 查看网络详情
docker network inspect my-network

# 连接容器到网络
docker network connect my-network container_name

# 断开连接
docker network disconnect my-network container_name

# 删除网络
docker network rm my-network
```

## 数据卷命令

```bash
# 创建卷
docker volume create my-volume

# 列出卷
docker volume ls

# 查看卷详情
docker volume inspect my-volume

# 删除卷
docker volume rm my-volume

# 清理未使用的卷
docker volume prune
```

## 系统命令

```bash
# 查看系统信息
docker info

# 查看版本
docker version

# 查看磁盘使用
docker system df

# 清理系统
docker system prune
docker system prune -a --volumes
```

## 更多内容

完整的命令列表和详细用法，请查看 [命令速查表](/reference/cheatsheet/)。

## 下一步

- [Dockerfile 基础](/basics/dockerfile-basics/) - 学习如何构建镜像
- [容器生命周期](/basics/container-lifecycle/) - 深入理解容器状态
- [命令速查表](/reference/cheatsheet/) - 快速查找命令

---

:::tip[练习建议]
最好的学习方式是实践。尝试运行这些命令，观察结果，理解它们的作用。
:::
