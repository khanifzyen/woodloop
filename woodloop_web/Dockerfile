# ============================================================
# WoodLoop Web — Dockerfile (Multi-stage production build)
# ============================================================
# Build:
#   docker build -t woodloop-web .
#
# Run:
#   docker run -p 3000:3000 -e PORT=3000 woodloop-web
#
# Push ke GitHub Container Registry:
#   docker tag woodloop-web ghcr.io/<username>/woodloop-web:latest
#   docker push ghcr.io/<username>/woodloop-web:latest
# ============================================================

# ---------------------------------
# Stage 1: Install dependencies
# ---------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy dependency files first (cache layer)
COPY package.json package-lock.json ./

# Install all dependencies (devDependencies also needed for build)
RUN npm ci

# ---------------------------------
# Stage 2: Build application
# ---------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Pass NEXT_PUBLIC_* vars at build time (required: baked into JS bundle)
ARG NEXT_PUBLIC_PB_URL=https://pb-woodloop.pasarjepara.com
ENV NEXT_PUBLIC_PB_URL=$NEXT_PUBLIC_PB_URL

# Build Next.js (output: standalone)
RUN npm run build

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
# server.js, node_modules, package.json, .next/server, .env.production
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./

# ── Copy static assets (separate from standalone) ──
# Next.js standalone doesn't include .next/static/ — it expects it at ../static
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# ── Copy public assets ──
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

CMD ["node", "server.js"]
