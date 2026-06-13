# ============================================================
# WoodLoop Web — Dockerfile (Multi-stage production build)
# Uses Bun for fast install & build.
# ============================================================

# ---------------------------------
# Stage 1: Install dependencies
# ---------------------------------
FROM oven/bun:1 AS deps

WORKDIR /app

# Copy dependency files first (cache layer)
COPY package.json bun.lock ./

# Install all dependencies
RUN bun install --frozen-lockfile

# ---------------------------------
# Stage 2: Build application
# ---------------------------------
FROM oven/bun:1 AS build

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Pass NEXT_PUBLIC_* vars at build time (baked into JS bundle)
ARG NEXT_PUBLIC_PB_URL=https://pb-woodloop.pasarjepara.com
ENV NEXT_PUBLIC_PB_URL=$NEXT_PUBLIC_PB_URL

# Build Next.js (output: standalone)
RUN bun run build

# ---------------------------------
# Stage 3: Production runtime
# ---------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# ── Copy standalone server ──
# server.js, node_modules (.prod), package.json, .next/server
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./

# ── Copy static assets ──
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# ── Copy public assets ──
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/ || exit 1

CMD ["node", "server.js"]
