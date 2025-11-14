---
title: 构建第一个镜像
description: 从零开始构建你的第一个 Docker 镜像
---

通过实际操作，学习如何从头构建一个 Docker 镜像。

## 创建一个简单的 Web 应用

### 1. 创建项目目录

```bash
mkdir my-first-docker-app
cd my-first-docker-app
```

### 2. 创建应用代码

创建 `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Docker App</title>
</head>
<body>
    <h1>Hello from Docker! 🐳</h1>
    <p>This is my first containerized application.</p>
</body>
</html>
```

### 3. 创建 Dockerfile

```dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4. 构建镜像

```bash
docker build -t my-first-app .
```

### 5. 运行容器

```bash
docker run -d -p 8080:80 --name my-app my-first-app
```

### 6. 访问应用

在浏览器中打开 `http://localhost:8080`

## Node.js 应用示例

### 创建 package.json

```json
{
  "name": "docker-node-app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

### 创建 server.js

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Node.js in Docker!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 创建 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### 构建和运行

```bash
docker build -t node-docker-app .
docker run -d -p 3000:3000 node-docker-app
```

## 最佳实践

1. ✅ 使用轻量级基础镜像（alpine）
2. ✅ 合理排序 Dockerfile 指令
3. ✅ 利用构建缓存
4. ✅ 使用 .dockerignore 排除不需要的文件
5. ✅ 为镜像打上有意义的标签

## 下一步

- [Dockerfile 基础](/basics/dockerfile-basics/) - 深入学习 Dockerfile
- [镜像优化](/advanced/image-optimization/) - 优化镜像大小
- [多阶段构建](/advanced/multi-stage-builds/) - 高级构建技巧
