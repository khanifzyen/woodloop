# deployment
- Use Docker-based deployment with images hosted on GHCR.io and deployed to a VPS. Confidence: 0.65
- When deploying the WoodLoop container on the VPS, map host port 3007 to container port 3000 (public 3007, internal 3000). Confidence: 0.65
- After deploying a new Docker image to the VPS, clear the Nginx proxy cache at `/www/server/nginx/proxy_cache_dir/` (delete all cached files with `find ... -delete`) and reload Nginx — the global `proxy_cache cache_one` setting caches old HTML even after container restart. Confidence: 0.70
- Use `bun run build` (not npm) to build the Next.js project before creating Docker images. Confidence: 0.50
- When tagging local Docker images, use both the version tag (e.g., `v0.0.4`) and `latest` tag. Confidence: 0.50
- Do a fresh/clean build before creating Docker images: remove previous build artifacts (`.next`, `node_modules`) or use `bun run build --no-cache` to avoid stale ISR/prerendered cache bleeding into the new image. Confidence: 0.70
