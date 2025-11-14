---
title: Python 应用容器化
description: Python Flask 应用 Docker 化实战
---

将 Python Flask 应用容器化的完整示例。

## 创建应用

### app.py

```python
from flask import Flask, jsonify
import psycopg2
import os

app = Flask(__name__)

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

@app.route('/')
def hello():
    return jsonify({'message': 'Hello from Docker!'})

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### requirements.txt

```
Flask==3.0.0
psycopg2-binary==2.9.9
gunicorn==21.2.0
```

## Dockerfile

```dockerfile
FROM python:3.11-slim AS builder

WORKDIR /app

# 安装系统依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

# 安装 Python 依赖
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# 运行阶段
FROM python:3.11-slim

# 创建非 root 用户
RUN useradd -m -u 1001 appuser

WORKDIR /app

# 从构建阶段复制依赖
COPY --from=builder /root/.local /home/appuser/.local

# 复制应用代码
COPY --chown=appuser:appuser app.py .

USER appuser

ENV PATH=/home/appuser/.local/bin:$PATH

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

## docker-compose.yml

```yaml
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

详见 [Node.js 应用容器化](/projects/nodejs/) 了解更多模式和最佳实践。
