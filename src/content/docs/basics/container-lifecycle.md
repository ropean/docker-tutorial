---
title: 容器生命周期
description: 理解 Docker 容器的完整生命周期
---

了解容器的生命周期对于有效管理和调试容器至关重要。本文将详细介绍容器从创建到销毁的整个过程。

## 容器的状态

Docker 容器在其生命周期中会经历多个状态：

```
Created → Running → Paused → Stopped → Removed
   ↓         ↓         ↓         ↓
   └─────────┴─────────┴─────────┘
              可以重启
```

### 主要状态

- **Created（已创建）**: 容器已创建但未启动
- **Running（运行中）**: 容器正在运行
- **Paused（暂停）**: 容器进程被暂停
- **Stopped（已停止）**: 容器已停止
- **Removed（已删除）**: 容器被删除

## 完整生命周期

### 1. 创建（Create）

```bash
# 创建容器但不启动
docker create --name my-nginx nginx
```

此时容器处于 **Created** 状态。

### 2. 启动（Start）

```bash
# 启动容器
docker start my-nginx
```

容器进入 **Running** 状态。

### 3. 运行（Run）

```bash
# 创建并启动（一步完成）
docker run --name my-nginx nginx
```

等同于 `docker create` + `docker start`。

### 4. 暂停（Pause）

```bash
# 暂停容器
docker pause my-nginx

# 恢复容器
docker unpause my-nginx
```

### 5. 停止（Stop）

```bash
# 优雅停止（发送 SIGTERM，等待 10 秒后发送 SIGKILL）
docker stop my-nginx

# 立即停止（发送 SIGKILL）
docker kill my-nginx
```

### 6. 重启（Restart）

```bash
# 重启容器
docker restart my-nginx
```

### 7. 删除（Remove）

```bash
# 删除已停止的容器
docker rm my-nginx

# 强制删除运行中的容器
docker rm -f my-nginx
```

## 状态转换图

```
┌─────────┐  create  ┌─────────┐  start   ┌─────────┐
│  null   │─────────→│ Created │─────────→│ Running │
└─────────┘          └─────────┘          └─────────┘
                          │                    │ ↑
                          │ rm                 │ │restart
                          ↓                    ↓ │
                     ┌─────────┐    stop  ┌─────────┐
                     │ Removed │←─────────│ Stopped │
                     └─────────┘          └─────────┘
                                               ↑ │
                                          rm   │ │start
                                               │ ↓
                                          ┌─────────┐
                                          │ Created │
                                          └─────────┘
```

## 查看容器状态

```bash
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 查看容器详细状态
docker inspect my-nginx | grep Status

# 输出示例
"Status": "running"
```

## 重启策略

Docker 提供了自动重启策略：

### no（默认）

```bash
# 不自动重启
docker run --restart=no nginx
```

### on-failure

```bash
# 失败时重启（可指定最大重启次数）
docker run --restart=on-failure:5 nginx
```

### always

```bash
# 总是重启
docker run --restart=always nginx
```

### unless-stopped

```bash
# 除非手动停止，否则总是重启
docker run --restart=unless-stopped nginx
```

## 容器退出码

当容器停止时，会返回退出码：

- **0**: 正常退出
- **1**: 应用错误
- **125**: Docker daemon 错误
- **126**: 命令无法执行
- **127**: 命令未找到
- **137**: 被 SIGKILL 杀死（通常是 OOM）
- **143**: 被 SIGTERM 终止

```bash
# 查看容器退出码
docker inspect my-nginx --format='{{.State.ExitCode}}'
```

## 实用命令

### 查看运行时间

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### 监控容器状态

```bash
# 实时监控
watch -n 2 'docker ps'

# 查看容器事件
docker events --filter container=my-nginx
```

### 健康检查

```bash
# Dockerfile 中定义
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' my-nginx
```

## 最佳实践

1. **使用重启策略**: 生产环境推荐使用 `--restart=unless-stopped`
2. **优雅停止**: 确保应用能正确处理 SIGTERM 信号
3. **监控健康**: 配置健康检查，及时发现问题
4. **日志管理**: 定期清理日志，避免磁盘占满
5. **及时清理**: 删除不需要的容器和镜像

## 下一步

- [Docker 命令详解](/basics/commands/)
- [容器网络](/practice/networking/)
- [数据持久化](/practice/volumes/)

---

:::note[延伸阅读]
- [Docker 容器管理最佳实践](https://docs.docker.com/config/containers/)
- [容器运行时规范](https://github.com/opencontainers/runtime-spec)
:::
