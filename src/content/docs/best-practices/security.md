---
title: 安全最佳实践
description: Docker 容器安全配置指南
---

安全是生产环境中最重要的考虑因素之一。本文介绍 Docker 安全最佳实践。

## 基本原则

### 1. 不使用 root 用户运行

```dockerfile
# 创建非 root 用户
FROM node:18-alpine

RUN addgroup -g 1001 nodejs && \
    adduser -D -u 1001 -G nodejs nodejs

USER nodejs

WORKDIR /app
COPY --chown=nodejs:nodejs . .

CMD ["node", "server.js"]
```

### 2. 使用官方镜像

```dockerfile
# ✅ 好：使用官方镜像
FROM node:18-alpine

# ❌ 不好：使用未知来源
FROM random-user/node
```

### 3. 固定镜像版本

```dockerfile
# ✅ 好：指定具体版本
FROM node:18.17-alpine3.18

# ❌ 不好：使用 latest
FROM node:latest
```

## Dockerfile 安全

### 最小权限原则

```dockerfile
FROM alpine:3.18

# 只安装必要软件
RUN apk add --no-cache python3

# 使用非 root 用户
RUN adduser -D appuser
USER appuser

# 只读文件系统
COPY --chown=appuser:appuser app.py .

CMD ["python3", "app.py"]
```

### 敏感信息管理

```dockerfile
# ❌ 不好：硬编码密码
ENV DB_PASSWORD=secret123

# ✅ 好：使用 secrets
# docker run --env-file .env myapp
```

使用 `.env` 文件：

```env
DB_PASSWORD=secret123
API_KEY=xyz789
```

```bash
docker run --env-file .env myapp
```

### 多阶段构建

```dockerfile
# 构建阶段
FROM golang:1.21 AS builder
WORKDIR /build
COPY . .
RUN go build -o app

# 运行阶段（最小化攻击面）
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /build/app .
USER nobody
CMD ["./app"]
```

## 运行时安全

### 只读根文件系统

```bash
docker run --read-only nginx
```

### 限制容器权限

```bash
# 移除所有权限
docker run --cap-drop ALL nginx

# 只添加必要权限
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx
```

### 使用 AppArmor/SELinux

```bash
# 使用安全配置
docker run --security-opt apparmor=docker-default nginx
```

## Docker Compose 安全

```yaml
services:
  web:
    image: myapp:1.0
    user: "1000:1000"
    read_only: true
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    environment:
      - DB_PASSWORD=${DB_PASSWORD}
```

## 网络安全

### 隔离敏感服务

```yaml
services:
  frontend:
    networks:
      - public

  backend:
    networks:
      - public
      - private

  database:
    networks:
      - private  # 数据库只在内部网络

networks:
  public:
  private:
    internal: true
```

### 限制端口暴露

```bash
# ❌ 不好：暴露到所有接口
docker run -p 5432:5432 postgres

# ✅ 好：只绑定到 localhost
docker run -p 127.0.0.1:5432:5432 postgres
```

## 镜像扫描

### 使用 Docker Scout

```bash
# 扫描镜像漏洞
docker scout cves myapp:latest

# 查看推荐修复
docker scout recommendations myapp:latest
```

### 使用 Trivy

```bash
# 安装 Trivy
brew install aquasecurity/trivy/trivy

# 扫描镜像
trivy image myapp:latest

# 只显示高危和严重漏洞
trivy image --severity HIGH,CRITICAL myapp:latest
```

## Secrets 管理

### Docker Secrets（Swarm）

```bash
# 创建 secret
echo "my-secret-password" | docker secret create db_password -

# 使用 secret
docker service create \
  --name db \
  --secret db_password \
  postgres
```

### 环境变量文件

```yaml
services:
  web:
    env_file:
      - .env.production
```

### 使用外部工具

- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault

## 安全检查清单

- [ ] 使用官方基础镜像
- [ ] 固定镜像版本标签
- [ ] 不使用 root 用户运行
- [ ] 扫描镜像漏洞
- [ ] 使用多阶段构建
- [ ] 不在镜像中存储敏感信息
- [ ] 限制容器权限
- [ ] 配置资源限制
- [ ] 使用健康检查
- [ ] 启用日志审计
- [ ] 定期更新镜像
- [ ] 使用私有镜像仓库

## 合规性

### CIS Docker Benchmark

使用 Docker Bench 检查安全配置：

```bash
docker run --rm -it \
  --net host \
  --pid host \
  --cap-add audit_control \
  -v /var/lib:/var/lib \
  -v /var/run/docker.sock:/var/run/docker.sock \
  docker/docker-bench-security
```

## 下一步

- [镜像优化](/advanced/image-optimization/)
- [生产环境部署](/best-practices/production/)
- [性能优化](/best-practices/performance/)

---

:::caution[安全提醒]
安全是一个持续的过程，定期审查和更新安全配置非常重要。
:::
