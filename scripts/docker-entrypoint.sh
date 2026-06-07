#!/bin/sh
set -e

echo "[rizhi] Starting cron daemon..."
crond -b -l 2

echo "[rizhi] Starting blog server on :3000..."
cd /app/packages/blog
exec node_modules/.bin/next start -p 3000
