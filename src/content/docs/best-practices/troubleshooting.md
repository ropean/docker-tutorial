---
title: 常见问题排查
description: Docker 常见问题及解决方案
---

遇到问题不要慌，本文列出了常见问题和解决方法。

## 容器问题

### 容器立即退出

```bash
# 查看容器日志
docker logs container_name

# 查看退出码
docker inspect --format='{{.State.ExitCode}}' container_name

# 以交互模式运行调试
docker run -it myapp sh
```

### 容器无法访问

```bash
# 检查端口映射
docker port container_name

# 检查容器是否运行
docker ps

# 检查防火墙
sudo ufw status
```

### 权限问题

```bash
# 添加用户到 docker 组
sudo usermod -aG docker $USER
newgrp docker

# 修复文件权限
docker run -u $(id -u):$(id -g) myapp
```

## 镜像问题

### 拉取镜像失败

```bash
# 检查网络连接
docker pull hello-world

# 使用镜像加速
# 编辑 /etc/docker/daemon.json
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}

# 重启 Docker
sudo systemctl restart docker
```

### 构建失败

```bash
# 不使用缓存重新构建
docker build --no-cache -t myapp .

# 查看详细构建日志
docker build --progress=plain -t myapp .
```

## 网络问题

### 容器间无法通信

```bash
# 检查是否在同一网络
docker network inspect network_name

# 确保容器使用自定义网络
docker network create mynetwork
docker run --network mynetwork --name app1 myapp
docker run --network mynetwork --name app2 myapp
```

### DNS 问题

```bash
# 指定 DNS 服务器
docker run --dns 8.8.8.8 myapp
```

## 存储问题

### 磁盘空间不足

```bash
# 查看磁盘使用
docker system df

# 清理未使用资源
docker system prune -a --volumes

# 清理特定类型
docker image prune
docker container prune
docker volume prune
```

### 卷权限问题

```bash
# 以特定用户身份运行
docker run -u $(id -u):$(id -g) -v $(pwd):/data myapp
```

## 性能问题

### 容器运行缓慢

```bash
# 查看资源使用
docker stats

# 增加资源限制
docker run -m 2g --cpus 2 myapp
```

### 构建缓慢

```bash
# 使用 .dockerignore
echo "node_modules" >> .dockerignore

# 使用 BuildKit
DOCKER_BUILDKIT=1 docker build -t myapp .
```

## Docker Compose 问题

### 服务启动失败

```bash
# 查看详细日志
docker compose logs service_name

# 验证配置
docker compose config

# 重新创建容器
docker compose up -d --force-recreate
```

## 调试技巧

### 进入容器调试

```bash
# 进入运行中的容器
docker exec -it container_name sh

# 使用 root 用户
docker exec -u root -it container_name sh
```

### 查看容器变化

```bash
# 查看容器修改的文件
docker diff container_name
```

### 复制文件调试

```bash
# 从容器复制文件
docker cp container_name:/app/logs ./logs
```

## 常用诊断命令

```bash
# 系统信息
docker info

# 容器详细信息
docker inspect container_name

# 网络详细信息
docker network inspect network_name

# 卷详细信息
docker volume inspect volume_name

# 查看事件
docker events

# 查看进程
docker top container_name
```

## 最佳实践

1. ✅ 始终查看日志
2. ✅ 使用 `docker inspect` 获取详细信息
3. ✅ 定期清理未使用资源
4. ✅ 使用健康检查
5. ✅ 监控资源使用

## 获取帮助

- [Docker 官方文档](https://docs.docker.com/)
- [Docker 社区论坛](https://forums.docker.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/docker)
- [GitHub Issues](https://github.com/docker/docker-ce/issues)

## 下一步

- [命令速查表](/reference/cheatsheet/)
- [安全最佳实践](/best-practices/security/)
- [生产环境部署](/best-practices/production/)
