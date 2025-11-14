---
title: 镜像仓库
description: 了解 Docker 镜像仓库的使用方法
---

镜像仓库是存储和分发 Docker 镜像的服务。本文介绍如何使用公共和私有镜像仓库。

## Docker Hub

Docker Hub 是 Docker 官方提供的公共镜像仓库。

### 搜索镜像

```bash
docker search nginx
```

### 拉取镜像

```bash
docker pull nginx:latest
```

### 推送镜像

```bash
# 登录
docker login

# 标记镜像
docker tag myapp username/myapp:v1.0

# 推送
docker push username/myapp:v1.0
```

## 私有仓库

### 使用 Docker Registry

```bash
# 启动私有仓库
docker run -d -p 5000:5000 --name registry registry:2

# 推送到私有仓库
docker tag myapp localhost:5000/myapp
docker push localhost:5000/myapp

# 从私有仓库拉取
docker pull localhost:5000/myapp
```

## 其他仓库

- **GitHub Container Registry**
- **GitLab Container Registry**
- **阿里云容器镜像服务**
- **腾讯云容器镜像服务**

详细配置请参考各服务商文档。
