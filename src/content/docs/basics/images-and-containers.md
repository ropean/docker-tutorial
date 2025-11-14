---
title: 镜像与容器
description: 深入理解 Docker 镜像和容器的概念及关系
---

理解镜像和容器的区别是掌握 Docker 的关键。本文将详细解释这两个核心概念。

## 什么是镜像（Image）？

Docker 镜像是一个**只读的模板**，包含了运行应用所需的所有内容：

- 📦 应用代码
- 🔧 运行时环境（Node.js、Python 等）
- 📚 系统库和依赖
- ⚙️ 环境变量和配置
- 📝 默认命令

### 镜像的特点

1. **只读性**：镜像创建后不能修改
2. **分层结构**：由多个层组成，层层叠加
3. **可复用**：同一镜像可以创建多个容器
4. **可分享**：可以上传到仓库供他人使用

### 镜像的结构

```
┌─────────────────────────────┐
│   应用代码层                 │  ← 你的应用
├─────────────────────────────┤
│   依赖库层                   │  ← npm packages / pip packages
├─────────────────────────────┤
│   运行时层                   │  ← Node.js / Python
├─────────────────────────────┤
│   操作系统层                 │  ← Ubuntu / Alpine
└─────────────────────────────┘
       镜像（只读）
```

## 什么是容器（Container）？

容器是镜像的**运行实例**，是一个**可读写的环境**。

### 容器的特点

1. **可写性**：容器运行时可以修改文件
2. **隔离性**：每个容器独立运行，互不影响
3. **临时性**：容器删除后，未保存的数据会丢失
4. **轻量级**：启动快速，资源占用少

### 镜像与容器的关系

```
       镜像                          容器
    (模板/类)                    (实例/对象)

    nginx:latest  ──────┬────→  容器1 (端口 8080)
    (只读)              ├────→  容器2 (端口 8081)
                        └────→  容器3 (端口 8082)
```

就像面向对象编程中的**类与对象**：
- 镜像 = 类（Class）
- 容器 = 对象实例（Object Instance）

## 镜像的分层架构

Docker 镜像使用联合文件系统（Union File System），采用分层结构。

### 分层示例

以 Node.js 应用为例：

```dockerfile
FROM node:18-alpine        # 基础层 (约 40MB)
WORKDIR /app               # 创建工作目录
COPY package*.json ./      # 依赖配置层
RUN npm install            # 依赖安装层 (可能很大)
COPY . .                   # 应用代码层
CMD ["node", "app.js"]     # 启动命令
```

构建后的层级结构：

```
┌────────────────────────────┐
│ Layer 5: CMD               │  ← 启动命令
├────────────────────────────┤
│ Layer 4: 应用代码          │  ← COPY . .
├────────────────────────────┤
│ Layer 3: node_modules      │  ← RUN npm install
├────────────────────────────┤
│ Layer 2: package.json      │  ← COPY package*.json
├────────────────────────────┤
│ Layer 1: Node.js 运行时    │  ← FROM node:18-alpine
└────────────────────────────┘
```

### 分层的优势

#### 1. 高效存储

```bash
# 两个应用共享相同的基础层
my-app-v1:
  ├─ Layer: node:18-alpine (共享)
  ├─ Layer: dependencies (共享)
  └─ Layer: app code v1

my-app-v2:
  ├─ Layer: node:18-alpine (共享)
  ├─ Layer: dependencies (共享)
  └─ Layer: app code v2 (仅此不同)
```

#### 2. 快速构建

```dockerfile
# 修改代码后重新构建
FROM node:18-alpine        # ✓ 缓存命中
WORKDIR /app               # ✓ 缓存命中
COPY package*.json ./      # ✓ 缓存命中
RUN npm install            # ✓ 缓存命中
COPY . .                   # ✗ 重新执行 (代码变了)
CMD ["node", "app.js"]     # ✗ 重新执行
```

#### 3. 快速分发

只需传输新增或变化的层，不需要传输整个镜像。

## 容器的写层（Container Layer）

当从镜像创建容器时，Docker 会在镜像层之上添加一个**可写层**：

```
┌────────────────────────────┐
│  容器写层 (可读写)          │  ← 容器运行时的修改
├────────────────────────────┤
│                            │
│    镜像层 (只读)            │  ← 原始镜像
│                            │
└────────────────────────────┘
```

### 写时复制（Copy-on-Write）

当容器修改文件时：

1. 如果文件在镜像层，先复制到容器层
2. 然后在容器层修改
3. 原始镜像层保持不变

```
容器1 修改 /app/config.json:
  ┌─ Container Layer ─┐
  │ config.json (修改)│
  ├───────────────────┤
  │ Image Layer       │
  │ config.json (原始)│  ← 保持不变
  └───────────────────┘

容器2 使用相同镜像:
  ┌─ Container Layer ─┐
  │ (空)              │
  ├───────────────────┤
  │ Image Layer       │
  │ config.json (原始)│  ← 独立访问
  └───────────────────┘
```

## 镜像操作

### 查看镜像

```bash
# 列出所有镜像
docker images

# 输出示例
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
nginx         latest    a6bd71f48f68   2 weeks ago    187MB
node          18-alpine 3c7f6d8c3e1a   3 weeks ago    177MB
```

### 拉取镜像

```bash
# 拉取最新版本
docker pull nginx

# 拉取指定版本
docker pull nginx:1.25-alpine

# 拉取指定平台的镜像
docker pull --platform linux/amd64 nginx
```

### 查看镜像详情

```bash
# 查看镜像分层历史
docker history nginx

# 输出示例
IMAGE          CREATED BY                                      SIZE
a6bd71f48f68   /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B
<missing>      /bin/sh -c #(nop)  EXPOSE 80                    0B
<missing>      /bin/sh -c apt-get update && apt-get install…   52MB
```

```bash
# 查看镜像详细信息（JSON 格式）
docker inspect nginx
```

### 标记镜像

```bash
# 给镜像打标签
docker tag nginx:latest myregistry/nginx:v1.0

# 查看
docker images | grep nginx
```

### 删除镜像

```bash
# 删除单个镜像
docker rmi nginx

# 删除多个镜像
docker rmi nginx redis mysql

# 强制删除
docker rmi -f nginx

# 删除所有悬空镜像（dangling images）
docker image prune
```

## 容器操作

### 创建和运行容器

```bash
# 从镜像创建并启动容器
docker run nginx

# 后台运行
docker run -d nginx

# 指定容器名称
docker run -d --name my-nginx nginx

# 端口映射
docker run -d -p 8080:80 nginx

# 环境变量
docker run -d -e MYSQL_ROOT_PASSWORD=secret mysql

# 挂载卷
docker run -d -v /host/data:/container/data nginx
```

### 查看容器

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 只显示容器 ID
docker ps -q

# 显示最近创建的 5 个容器
docker ps -n 5
```

### 容器生命周期管理

```bash
# 启动已停止的容器
docker start container_name

# 停止运行中的容器
docker stop container_name

# 重启容器
docker restart container_name

# 暂停容器
docker pause container_name

# 恢复容器
docker unpause container_name

# 删除容器
docker rm container_name

# 强制删除运行中的容器
docker rm -f container_name
```

### 与容器交互

```bash
# 查看容器日志
docker logs container_name

# 实时查看日志
docker logs -f container_name

# 查看最后 100 行日志
docker logs --tail 100 container_name

# 进入运行中的容器
docker exec -it container_name bash

# 在容器中执行命令
docker exec container_name ls /app

# 查看容器内进程
docker top container_name

# 查看容器资源使用
docker stats container_name
```

## 镜像与容器的数据持久化

### 问题：容器数据易失性

```bash
# 创建容器并写入数据
docker run -it --name test ubuntu bash
echo "important data" > /data/file.txt
exit

# 删除容器
docker rm test

# 数据丢失了！
```

### 解决方案：数据卷

```bash
# 使用命名卷
docker run -d \
  --name mysql-db \
  -v mysql-data:/var/lib/mysql \
  mysql

# 使用主机目录
docker run -d \
  --name web \
  -v /host/website:/usr/share/nginx/html \
  nginx

# 现在数据保存在卷中，删除容器也不会丢失
docker rm -f mysql-db
docker run -d --name new-mysql -v mysql-data:/var/lib/mysql mysql
# 数据还在！
```

## 实战示例

### 示例 1：从镜像创建多个容器

```bash
# 从同一个 nginx 镜像创建 3 个容器
docker run -d -p 8001:80 --name web1 nginx
docker run -d -p 8002:80 --name web2 nginx
docker run -d -p 8003:80 --name web3 nginx

# 三个独立的 web 服务器同时运行
curl http://localhost:8001
curl http://localhost:8002
curl http://localhost:8003
```

### 示例 2：修改容器并保存为新镜像

```bash
# 运行容器
docker run -it --name custom-nginx nginx bash

# 在容器内修改
echo "Custom Page" > /usr/share/nginx/html/index.html
exit

# 保存为新镜像
docker commit custom-nginx my-custom-nginx:v1

# 从新镜像创建容器
docker run -d -p 8080:80 my-custom-nginx:v1
```

:::caution[不推荐使用 docker commit]
虽然 `docker commit` 可以工作，但不推荐在生产环境使用。更好的做法是使用 Dockerfile 构建镜像，这样更透明、可复现。
:::

### 示例 3：查看镜像占用的磁盘空间

```bash
# 查看 Docker 磁盘使用情况
docker system df

# 输出示例
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          10        5         2.5GB     1.2GB (48%)
Containers      15        3         120MB     100MB (83%)
Local Volumes   5         2         500MB     300MB (60%)
```

## 镜像标签（Tags）

### 标签的作用

标签用于区分同一镜像的不同版本：

```bash
nginx:1.25          # 具体版本
nginx:1.25-alpine   # 版本 + 变体
nginx:latest        # 最新版本
nginx:stable        # 稳定版本
```

### 标签最佳实践

```bash
# ❌ 不推荐：使用 latest（不明确）
docker pull nginx:latest

# ✅ 推荐：使用具体版本
docker pull nginx:1.25-alpine

# ✅ 推荐：在 Dockerfile 中指定版本
FROM node:18.17-alpine
```

:::tip[避免使用 latest]
在生产环境中，始终使用明确的版本标签，而不是 `latest`。这样可以确保环境的一致性和可预测性。
:::

## 小结

### 关键要点

1. **镜像**是只读模板，**容器**是运行实例
2. 镜像采用**分层结构**，高效存储和传输
3. 容器在镜像层之上添加**可写层**
4. 使用**数据卷**持久化重要数据
5. 使用**明确的版本标签**而非 latest

### 对比总结

| 特性 | 镜像 | 容器 |
|------|------|------|
| 可读写 | 只读 | 可读写 |
| 生命周期 | 长期存在 | 可临时 |
| 创建方式 | Dockerfile / commit | docker run |
| 存储方式 | 分层存储 | 写时复制 |
| 用途 | 模板/分发 | 运行应用 |

## 下一步

- [容器生命周期](/basics/container-lifecycle/) - 深入理解容器的各个阶段
- [Docker 命令详解](/basics/commands/) - 掌握常用命令
- [Dockerfile 基础](/basics/dockerfile-basics/) - 学习如何构建镜像

---

:::note[扩展阅读]
- [Docker 存储驱动详解](https://docs.docker.com/storage/storagedriver/)
- [镜像分层原理](https://docs.docker.com/build/building/layers/)
:::
