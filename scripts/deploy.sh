#!/bin/bash
# 日知 — 一键部署脚本
# 用法：./scripts/deploy.sh

set -e

echo "=== 日知 部署 ==="

# 检查 .env
if [ ! -f .env ]; then
    echo "Error: .env 文件不存在，请先创建（参考 .env.example）"
    exit 1
fi

# 检查 docker
if ! command -v docker &> /dev/null; then
    echo "Error: docker 未安装"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: docker-compose 未安装"
    exit 1
fi

# Git pull 最新代码
echo "[1/4] 拉取最新代码..."
git pull origin main

# 构建
echo "[2/4] 构建 Docker 镜像..."
docker compose build --no-cache

# 停止旧容器
echo "[3/4] 停止旧容器..."
docker compose down

# 启动
echo "[4/4] 启动新容器..."
docker compose up -d

echo ""
echo "=== 部署完成 ==="
echo "博客地址: http://localhost:3000"
echo "查看日志: docker compose logs -f"
echo "手动触发生成: docker compose exec blog node scripts/generate-daily.mjs"
