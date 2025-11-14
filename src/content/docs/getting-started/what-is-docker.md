---
title: 什么是 Docker
description: 深入理解 Docker 的概念、优势和应用场景
---

## Docker 简介

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 或 Windows 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。

### 核心概念

在深入学习之前，先理解几个关键概念：

- **镜像（Image）**：一个只读的模板，包含了运行应用所需的代码、运行时、库、环境变量和配置文件
- **容器（Container）**：镜像的运行实例，可以被启动、停止、删除
- **仓库（Repository）**：存放镜像的地方，类似于代码仓库

## 为什么使用 Docker？

### 1. 环境一致性

:::tip[解决"在我机器上能运行"问题]
Docker 确保应用在开发、测试、生产环境中的行为完全一致。
:::

**传统方式的问题：**
```bash
开发者A: "这个功能在我电脑上正常啊！"
开发者B: "奇怪，我这里运行不了..."
运维人员: "生产环境又出问题了..."
```

**使用 Docker：**
```bash
# 所有人使用相同的环境
docker run myapp:latest
```

### 2. 快速部署

传统虚拟机启动需要几分钟，而 Docker 容器启动只需几秒：

| 特性 | 虚拟机 | Docker 容器 |
|------|--------|-------------|
| 启动时间 | 分钟级 | 秒级 |
| 性能 | 较差 | 接近原生 |
| 磁盘占用 | GB 级 | MB 级 |
| 系统支持 | 少量 | 成百上千 |

### 3. 资源利用率高

Docker 容器直接运行在宿主机的内核上，不需要额外的操作系统开销：

```
┌─────────────────────────────────────┐
│         虚拟机架构                    │
├─────────────────────────────────────┤
│  App A  │  App B  │  App C          │
│  Bins   │  Bins   │  Bins           │
│  Guest  │  Guest  │  Guest          │
│  OS     │  OS     │  OS   ← 额外开销 │
├─────────────────────────────────────┤
│         Hypervisor                  │
│         Host OS                     │
│         Hardware                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Docker 架构                  │
├─────────────────────────────────────┤
│  App A  │  App B  │  App C          │
│  Bins   │  Bins   │  Bins           │
├─────────────────────────────────────┤
│      Docker Engine                  │
│      Host OS                        │
│      Hardware                       │
└─────────────────────────────────────┘
```

### 4. 微服务架构

Docker 天然适合微服务架构：

```yaml
# 使用 docker-compose 编排多个服务
services:
  frontend:
    image: myapp/frontend:latest
  backend:
    image: myapp/backend:latest
  database:
    image: postgres:15
  redis:
    image: redis:alpine
```

### 5. 持续集成/持续部署 (CI/CD)

```bash
# CI/CD 流程示例
git push → 自动构建镜像 → 自动测试 → 自动部署
```

## Docker 的应用场景

### 1. Web 应用部署

```bash
# 快速部署一个 Web 应用
docker run -d -p 80:80 nginx
```

### 2. 微服务架构

将大型应用拆分为多个小服务，每个服务独立容器化：

```
用户服务 → Container 1
订单服务 → Container 2
支付服务 → Container 3
通知服务 → Container 4
```

### 3. 开发环境

无需在本地安装各种开发工具：

```bash
# 直接运行 Node.js 环境
docker run -it node:18 bash

# 直接运行 Python 环境
docker run -it python:3.11 python

# 运行数据库
docker run -d postgres:15
```

### 4. 测试环境

```bash
# 快速创建测试环境
docker run --rm -v $(pwd):/app myapp npm test
```

### 5. 持续集成

在 CI 环境中构建和测试：

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: node:18
    steps:
      - uses: actions/checkout@v3
      - run: npm test
```

## Docker vs 虚拟机

### 虚拟机的工作方式

虚拟机在物理硬件上模拟完整的计算机系统，包括操作系统：

```
应用 → Guest OS → Hypervisor → Host OS → 硬件
```

### Docker 的工作方式

Docker 容器共享主机操作系统内核，只包含应用和依赖：

```
应用 → Docker Engine → Host OS → 硬件
```

### 关键区别

| 方面 | 虚拟机 | Docker |
|------|--------|--------|
| **隔离级别** | 操作系统级 | 进程级 |
| **启动速度** | 慢（分钟） | 快（秒） |
| **性能损耗** | 大 | 小 |
| **磁盘占用** | 大（GB） | 小（MB） |
| **数量限制** | 几十个 | 几千个 |
| **迁移速度** | 慢 | 快 |

## Docker 的核心优势

### 1. 轻量级

容器镜像通常只有几十 MB，而虚拟机镜像可能有几 GB。

### 2. 可移植性

:::tip[一次构建，到处运行]
在笔记本上构建的镜像可以直接部署到云服务器。
:::

### 3. 版本控制

```bash
# 镜像支持版本标签
docker pull nginx:1.24
docker pull nginx:1.25
docker pull nginx:latest
```

### 4. 快速回滚

```bash
# 出问题？立即回滚到上一个版本
docker stop myapp-v2
docker start myapp-v1
```

### 5. 易于分享

```bash
# 分享你的应用
docker push username/myapp:1.0

# 别人使用你的应用
docker pull username/myapp:1.0
```

## 实际案例

### 案例 1：快速搭建博客

```bash
# 一条命令启动 WordPress 博客
docker run -d \
  -p 8080:80 \
  -e WORDPRESS_DB_HOST=db \
  -e WORDPRESS_DB_PASSWORD=secret \
  wordpress
```

### 案例 2：隔离的开发环境

```bash
# 项目 A 使用 Node.js 14
docker run -v $(pwd):/app node:14 npm install

# 项目 B 使用 Node.js 18
docker run -v $(pwd):/app node:18 npm install
```

### 案例 3：一致的测试环境

```bash
# 在任何机器上都能运行相同的测试
docker run --rm -v $(pwd):/workspace \
  myapp:test npm run test
```

## 小结

Docker 通过容器化技术，解决了应用部署中的诸多痛点：

✅ 环境一致性
✅ 快速部署
✅ 资源高效利用
✅ 易于扩展
✅ 简化运维

准备好开始使用 Docker 了吗？下一步，让我们[安装 Docker](/getting-started/installation/)。

---

:::note[延伸阅读]
- [容器生命周期](/basics/container-lifecycle/)
- [镜像与容器的区别](/basics/images-and-containers/)
- [Docker 架构详解](https://docs.docker.com/get-started/overview/)
:::
