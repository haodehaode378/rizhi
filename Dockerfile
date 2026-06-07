# ── Stage 1: Install deps ────────────────────────────────────────
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/blog/package.json packages/blog/
COPY packages/remotion/package.json packages/remotion/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile

# ── Stage 2: Build blog ─────────────────────────────────────────
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/blog/node_modules packages/blog/node_modules
COPY --from=deps /app/packages/shared/node_modules packages/shared/node_modules
COPY . .
RUN pnpm --filter blog build

# ── Stage 3: Runtime ────────────────────────────────────────────
FROM node:20-alpine AS runtime
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN apk add --no-cache dcron

WORKDIR /app

# Copy built blog
COPY --from=builder /app/packages/blog/.next packages/blog/.next
COPY --from=builder /app/packages/blog/public packages/blog/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/blog/node_modules packages/blog/node_modules
COPY --from=builder /app/packages/blog/package.json packages/blog/
COPY --from=builder /app/packages/blog/next.config.mjs packages/blog/
COPY --from=builder /app/packages/shared packages/shared
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/scripts scripts

# Cron: daily book generation at 00:30
RUN echo "30 0 * * * cd /app && node scripts/generate-daily.mjs >> /var/log/generate.log 2>&1" > /etc/crontabs/root

# Startup script
COPY scripts/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000
ENV NODE_ENV=production
CMD ["/docker-entrypoint.sh"]
