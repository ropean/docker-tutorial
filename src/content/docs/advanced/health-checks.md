---
title: 健康检查
description: 配置容器健康检查以提高可靠性
---

健康检查可以自动检测容器是否正常运行，在出现问题时及时重启。

## Dockerfile 中配置

```dockerfile
FROM nginx:alpine

HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=5s \
            --retries=3 \
            CMD curl -f http://localhost/ || exit 1
```

## 参数说明

- `--interval=30s`: 每 30 秒检查一次
- `--timeout=3s`: 检查超时时间 3 秒
- `--start-period=5s`: 容器启动后 5 秒开始检查
- `--retries=3`: 连续失败 3 次才标记为不健康

## 运行时配置

```bash
docker run -d \
  --name web \
  --health-cmd "curl -f http://localhost/ || exit 1" \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  nginx
```

## Docker Compose 配置

```yaml
services:
  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

## 查看健康状态

```bash
# 查看容器健康状态
docker ps

# 查看详细健康信息
docker inspect --format='{{json .State.Health}}' container_name | jq
```

## 不同应用的健康检查

### Web 应用

```dockerfile
HEALTHCHECK CMD curl -f http://localhost:8080/health || exit 1
```

### 数据库

```dockerfile
# PostgreSQL
HEALTHCHECK CMD pg_isready -U postgres || exit 1

# MySQL
HEALTHCHECK CMD mysqladmin ping -h localhost || exit 1

# Redis
HEALTHCHECK CMD redis-cli ping || exit 1
```

### Node.js 应用

```dockerfile
HEALTHCHECK CMD node healthcheck.js || exit 1
```

`healthcheck.js`:

```javascript
const http = require('http');

const options = {
  host: 'localhost',
  port: 3000,
  path: '/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on('error', () => process.exit(1));
request.end();
```

## 最佳实践

1. ✅ 检查应用实际功能，不只是进程存在
2. ✅ 设置合理的超时时间
3. ✅ 避免健康检查影响性能
4. ✅ 记录健康检查失败原因
5. ✅ 在 start-period 内不计入失败次数

## 下一步

- [资源限制](/advanced/resource-limits/)
- [日志管理](/advanced/logging/)
- [生产环境部署](/best-practices/production/)
