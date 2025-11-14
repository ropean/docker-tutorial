---
title: 安装 Docker
description: 在不同操作系统上安装和配置 Docker
---

本指南将帮助你在各种操作系统上安装 Docker。选择适合你的操作系统进行安装。

## macOS 安装

### 使用 Docker Desktop（推荐）

Docker Desktop 是 Docker 官方提供的一站式解决方案，包含 Docker Engine、CLI、Compose 等所有工具。

#### 系统要求

- macOS 11 或更高版本
- 至少 4GB 内存
- 启用虚拟化支持

#### 安装步骤

1. **下载 Docker Desktop**

访问 [Docker 官网](https://www.docker.com/products/docker-desktop/) 下载适合你 Mac 芯片的版本：
- Apple Silicon (M1/M2/M3): ARM64 版本
- Intel 芯片: AMD64 版本

2. **安装应用**

```bash
# 打开下载的 .dmg 文件，拖拽到 Applications 文件夹
# 双击 Docker.app 启动
```

3. **验证安装**

```bash
# 检查 Docker 版本
docker --version
# 输出: Docker version 24.0.7, build afdd53b

# 检查 Docker Compose
docker compose version
# 输出: Docker Compose version v2.23.0
```

4. **运行测试容器**

```bash
docker run hello-world
```

### 使用 Homebrew

```bash
# 安装 Docker
brew install --cask docker

# 启动 Docker
open /Applications/Docker.app
```

## Linux 安装

### Ubuntu/Debian

#### 方式 1：使用官方脚本（推荐新手）

```bash
# 下载并运行官方安装脚本
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 将当前用户添加到 docker 组（避免每次使用 sudo）
sudo usermod -aG docker $USER

# 重新登录以使组权限生效，或运行：
newgrp docker
```

#### 方式 2：使用 apt 包管理器

```bash
# 更新包索引
sudo apt-get update

# 安装必要的依赖
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 更新包索引
sudo apt-get update

# 安装 Docker Engine
sudo apt-get install docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin

# 验证安装
sudo docker run hello-world
```

### CentOS/RHEL/Fedora

```bash
# 安装 yum-utils
sudo yum install -y yum-utils

# 添加 Docker 仓库
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker Engine
sudo yum install docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
sudo docker run hello-world
```

### Arch Linux

```bash
# 安装 Docker
sudo pacman -S docker docker-compose

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 添加用户到 docker 组
sudo usermod -aG docker $USER
```

## Windows 安装

### 使用 Docker Desktop（推荐）

#### 系统要求

- Windows 10/11 64位：专业版、企业版或教育版
- 启用 WSL 2（Windows Subsystem for Linux）
- BIOS 中启用虚拟化

#### 安装步骤

1. **启用 WSL 2**

```powershell
# 在 PowerShell (管理员) 中运行
wsl --install
```

2. **下载并安装 Docker Desktop**

访问 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) 下载安装程序。

3. **安装后配置**

- 启动 Docker Desktop
- 在设置中选择使用 WSL 2 backend
- 重启计算机

4. **验证安装**

```powershell
docker --version
docker run hello-world
```

## 配置 Docker

### 配置镜像加速（中国大陆用户）

由于网络原因，从 Docker Hub 拉取镜像可能很慢。可以配置国内镜像源：

#### Docker Desktop 配置

打开 Docker Desktop → Settings → Docker Engine，添加以下配置：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

#### Linux 配置

编辑 `/etc/docker/daemon.json`：

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
EOF

# 重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 配置 Docker 资源限制

#### Docker Desktop

Settings → Resources，可以调整：

- **CPUs**: 分配的 CPU 核心数
- **Memory**: 分配的内存大小
- **Disk**: 虚拟磁盘大小

建议配置：
- CPU: 2-4 核
- Memory: 4-8 GB
- Disk: 64 GB

#### Linux

编辑 `/etc/docker/daemon.json`：

```json
{
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  },
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### 非 root 用户运行 Docker（Linux）

```bash
# 创建 docker 组（如果不存在）
sudo groupadd docker

# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 激活组更改（或重新登录）
newgrp docker

# 验证
docker run hello-world
```

## 验证安装

### 检查版本信息

```bash
# Docker 版本
docker --version

# 详细信息
docker version

# 系统信息
docker info
```

### 运行测试容器

```bash
# 最简单的测试
docker run hello-world

# 运行交互式容器
docker run -it ubuntu bash

# 运行 web 服务
docker run -d -p 8080:80 nginx
# 访问 http://localhost:8080
```

### 检查 Docker Compose

```bash
docker compose version
```

## 常见问题

### 问题 1：权限被拒绝

```bash
# 错误信息
Got permission denied while trying to connect to the Docker daemon socket

# 解决方案
sudo usermod -aG docker $USER
newgrp docker
```

### 问题 2：Docker daemon 未运行

```bash
# macOS/Windows
# 启动 Docker Desktop 应用

# Linux
sudo systemctl start docker
sudo systemctl enable docker
```

### 问题 3：端口已被占用

```bash
# 错误信息
Bind for 0.0.0.0:80 failed: port is already allocated

# 解决方案：使用不同端口
docker run -p 8080:80 nginx
```

### 问题 4：磁盘空间不足

```bash
# 清理未使用的资源
docker system prune -a

# 查看磁盘使用情况
docker system df
```

### 问题 5：WSL 2 安装失败（Windows）

```powershell
# 确保 Windows 版本足够新
winver

# 手动启用 WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 重启后设置 WSL 2 为默认
wsl --set-default-version 2
```

## 卸载 Docker

### macOS

```bash
# 卸载 Docker Desktop
# 在 Applications 中删除 Docker.app

# 清理残留数据
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker
```

### Ubuntu/Debian

```bash
# 卸载 Docker Engine
sudo apt-get purge docker-ce docker-ce-cli containerd.io

# 删除镜像、容器、卷
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

### Windows

- 通过 "添加或删除程序" 卸载 Docker Desktop
- 删除 `C:\ProgramData\Docker` 和 `%USERPROFILE%\.docker`

## 下一步

安装完成！现在你可以：

1. [快速开始](/getting-started/quickstart/) - 运行你的第一个容器
2. [Docker 命令详解](/basics/commands/) - 学习常用命令
3. [构建第一个镜像](/practice/build-first-image/) - 创建自己的 Docker 镜像

:::tip[保持更新]
定期更新 Docker 以获得最新功能和安全补丁：

```bash
# Docker Desktop 会自动提示更新

# Linux 手动更新
sudo apt-get update && sudo apt-get upgrade docker-ce
```
:::

---

:::note[官方文档]
更多安装选项和详细信息，请参考：
- [Docker Desktop 文档](https://docs.docker.com/desktop/)
- [Docker Engine 文档](https://docs.docker.com/engine/install/)
:::
