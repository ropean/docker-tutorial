---
title: Docker 命令速查表
description: 快速查找常用 Docker 命令
---

这是一份完整的 Docker 命令速查表，涵盖日常开发中最常用的命令。

## 镜像命令

### 查看和搜索

```bash
# 列出本地镜像
docker images
docker image ls

# 搜索镜像
docker search nginx

# 查看镜像详细信息
docker inspect nginx

# 查看镜像历史
docker history nginx

# 查看镜像构建历史
docker image history --no-trunc nginx
```

### 拉取和推送

```bash
# 拉取镜像
docker pull nginx
docker pull nginx:1.25-alpine

# 推送镜像
docker push myusername/myapp:latest

# 登录 Docker Hub
docker login

# 登出
docker logout
```

### 构建和标记

```bash
# 构建镜像
docker build -t myapp .
docker build -t myapp:v1.0 .

# 从不同目录构建
docker build -t myapp -f ./docker/Dockerfile .

# 不使用缓存构建
docker build --no-cache -t myapp .

# 使用构建参数
docker build --build-arg VERSION=1.0 -t myapp .

# 标记镜像
docker tag myapp:latest myapp:v1.0
docker tag myapp myregistry.com/myapp:latest
```

### 删除镜像

```bash
# 删除单个镜像
docker rmi nginx

# 删除多个镜像
docker rmi nginx redis mysql

# 强制删除
docker rmi -f nginx

# 删除所有悬空镜像
docker image prune

# 删除所有未使用的镜像
docker image prune -a

# 删除所有镜像
docker rmi $(docker images -q)
```

## 容器命令

### 运行容器

```bash
# 运行容器
docker run nginx

# 后台运行
docker run -d nginx

# 指定名称
docker run -d --name my-nginx nginx

# 端口映射
docker run -d -p 8080:80 nginx
docker run -d -p 127.0.0.1:8080:80 nginx

# 环境变量
docker run -d -e MYSQL_ROOT_PASSWORD=secret mysql

# 挂载卷
docker run -d -v /host/path:/container/path nginx
docker run -d -v myvolume:/data nginx

# 自动删除容器
docker run --rm -it ubuntu bash

# 资源限制
docker run -d --memory="512m" --cpus="1.5" nginx

# 重启策略
docker run -d --restart=always nginx
```

### 查看容器

```bash
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 只显示容器 ID
docker ps -q

# 显示最近创建的 N 个容器
docker ps -n 5

# 显示容器大小
docker ps -s

# 自定义格式
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
```

### 启动、停止和重启

```bash
# 启动容器
docker start container_name

# 停止容器
docker stop container_name

# 强制停止
docker kill container_name

# 重启容器
docker restart container_name

# 暂停容器
docker pause container_name

# 恢复容器
docker unpause container_name
```

### 容器操作

```bash
# 查看日志
docker logs container_name

# 实时查看日志
docker logs -f container_name

# 查看最后 100 行
docker logs --tail 100 container_name

# 查看带时间戳的日志
docker logs -t container_name

# 进入容器
docker exec -it container_name bash
docker exec -it container_name sh

# 在容器中执行命令
docker exec container_name ls /app

# 以 root 用户执行
docker exec -u root -it container_name bash

# 查看容器详细信息
docker inspect container_name

# 查看容器内进程
docker top container_name

# 查看资源使用情况
docker stats container_name

# 查看所有容器资源使用
docker stats
```

### 复制文件

```bash
# 从容器复制到主机
docker cp container_name:/path/to/file /host/path

# 从主机复制到容器
docker cp /host/path container_name:/path/to/file

# 复制目录
docker cp container_name:/app /host/backup
```

### 删除容器

```bash
# 删除容器（必须先停止）
docker rm container_name

# 强制删除运行中的容器
docker rm -f container_name

# 删除多个容器
docker rm container1 container2 container3

# 删除所有停止的容器
docker container prune

# 删除所有容器
docker rm -f $(docker ps -aq)
```

## Docker Compose 命令

### 基本操作

```bash
# 启动服务
docker compose up

# 后台启动
docker compose up -d

# 构建并启动
docker compose up --build

# 停止服务
docker compose stop

# 停止并删除
docker compose down

# 停止并删除（包括卷）
docker compose down -v

# 重启服务
docker compose restart
```

### 查看和调试

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

# 运行一次性命令
docker compose run web python manage.py migrate

# 查看配置
docker compose config

# 验证配置
docker compose config --quiet
```

### 服务管理

```bash
# 构建服务
docker compose build

# 拉取镜像
docker compose pull

# 推送镜像
docker compose push

# 扩展服务
docker compose up -d --scale web=3

# 查看服务日志
docker compose logs -f web
```

## 网络命令

```bash
# 列出网络
docker network ls

# 创建网络
docker network create mynetwork

# 查看网络详情
docker network inspect mynetwork

# 连接容器到网络
docker network connect mynetwork container_name

# 断开连接
docker network disconnect mynetwork container_name

# 删除网络
docker network rm mynetwork

# 删除所有未使用的网络
docker network prune
```

## 数据卷命令

```bash
# 列出卷
docker volume ls

# 创建卷
docker volume create myvolume

# 查看卷详情
docker volume inspect myvolume

# 删除卷
docker volume rm myvolume

# 删除所有未使用的卷
docker volume prune

# 删除所有卷
docker volume rm $(docker volume ls -q)
```

## 系统命令

### 系统信息

```bash
# 查看 Docker 版本
docker version

# 查看系统信息
docker info

# 查看磁盘使用
docker system df

# 详细磁盘使用
docker system df -v
```

### 清理命令

```bash
# 清理未使用的容器
docker container prune

# 清理未使用的镜像
docker image prune

# 清理未使用的网络
docker network prune

# 清理未使用的卷
docker volume prune

# 清理所有未使用的资源
docker system prune

# 清理所有（包括卷）
docker system prune -a --volumes

# 不提示确认
docker system prune -f
```

### 事件和监控

```bash
# 查看 Docker 事件
docker events

# 查看特定容器事件
docker events --filter container=container_name

# 查看镜像事件
docker events --filter type=image
```

## 导入导出

### 镜像导入导出

```bash
# 导出镜像
docker save -o myapp.tar myapp:latest

# 导入镜像
docker load -i myapp.tar

# 导出压缩镜像
docker save myapp:latest | gzip > myapp.tar.gz

# 导入压缩镜像
gunzip -c myapp.tar.gz | docker load
```

### 容器导入导出

```bash
# 导出容器文件系统
docker export container_name > container.tar

# 导入为镜像
docker import container.tar myimage:latest

# 从 URL 导入
docker import http://example.com/container.tar myimage
```

## 实用组合命令

### 停止所有容器

```bash
docker stop $(docker ps -q)
```

### 删除所有容器

```bash
docker rm -f $(docker ps -aq)
```

### 删除所有镜像

```bash
docker rmi -f $(docker images -q)
```

### 删除悬空镜像

```bash
docker rmi $(docker images -f "dangling=true" -q)
```

### 进入最新创建的容器

```bash
docker exec -it $(docker ps -l -q) bash
```

### 查看容器 IP 地址

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name
```

### 查看容器端口映射

```bash
docker port container_name
```

### 监控所有容器资源

```bash
docker stats --all --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## 常用别名

将这些添加到 `.bashrc` 或 `.zshrc`：

```bash
# Docker 别名
alias d='docker'
alias dc='docker compose'
alias dps='docker ps'
alias dpa='docker ps -a'
alias di='docker images'
alias dex='docker exec -it'
alias dlogs='docker logs -f'
alias dstop='docker stop'
alias drm='docker rm'
alias drmi='docker rmi'
alias dprune='docker system prune -a'

# Docker Compose 别名
alias dcu='docker compose up -d'
alias dcd='docker compose down'
alias dcl='docker compose logs -f'
alias dcr='docker compose restart'
alias dcb='docker compose build'
```

## 调试技巧

### 查看容器为什么退出

```bash
docker logs container_name
docker inspect container_name | grep -A 10 State
```

### 查看容器环境变量

```bash
docker exec container_name env
```

### 测试网络连接

```bash
docker exec container1 ping container2
docker exec container_name curl http://api:8000
```

### 查看容器修改的文件

```bash
docker diff container_name
```

### 查看镜像构建时间

```bash
docker inspect -f '{{.Created}}' myimage
```

## 性能优化

### 构建优化

```bash
# 使用 BuildKit
DOCKER_BUILDKIT=1 docker build -t myapp .

# 指定平台
docker build --platform linux/amd64 -t myapp .

# 并行构建多个镜像
docker build -t app1 ./app1 & docker build -t app2 ./app2 &
```

### 资源限制

```bash
# CPU 限制
docker run -d --cpus="1.5" nginx

# 内存限制
docker run -d --memory="512m" --memory-swap="1g" nginx

# I/O 限制
docker run -d --device-read-bps /dev/sda:10mb nginx
```

## 安全相关

### 以非 root 用户运行

```bash
docker run -u 1000:1000 nginx
```

### 只读文件系统

```bash
docker run --read-only nginx
```

### 限制容器能力

```bash
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx
```

### 安全扫描

```bash
# 使用 Docker Scout
docker scout cves nginx

# 使用 Trivy
trivy image nginx
```

## 小技巧

### 快速清理

```bash
# 清理所有未使用资源（谨慎使用）
docker system prune -a --volumes -f
```

### JSON 格式化输出

```bash
docker inspect container_name | jq '.'
```

### 查看镜像大小

```bash
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### 自定义 PS 格式

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

:::tip[收藏此页]
建议将此页面加入书签，方便随时查阅！
:::
