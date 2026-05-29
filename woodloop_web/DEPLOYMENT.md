# WoodLoop Web — Deployment Guide

## Arsitektur Deployment

```
┌─────────────────────────────────────┐
│           GitHub Container Registry │
│     ghcr.io/tifunisnu/woodloop-web  │
└──────────┬──────────────────────────┘
           │ docker pull
           ▼
┌─────────────────────────────────────┐
│           VPS / Server              │
│  ┌─────────────────────────────┐    │
│  │  Docker Container           │    │
│  │  woodloop-web (port 3000)   │    │
│  └──────────┬──────────────────┘    │
│             │ proxy (Nginx)         │
│             ▼                       │
│  https://woodloop.pasarjepara.com   │
└─────────────────────────────────────┘
           ▲
           │ fetch data
┌─────────────────────────────────────┐
│     PocketBase Server               │
│  https://pb-woodloop.pasarjepara.com│
└─────────────────────────────────────┘
```

## Kenapa Docker + GitHub Container Registry?

| Opsi | Private | Gratis | Catatan |
|---|---|---|---|
| **ghcr.io** ✅ | ✅ Ya | ✅ Ya | Terintegrasi GitHub |
| Docker Hub | 1 repo | Terbatas | Cuma 1 private gratis |
| VPS langsung | - | - | Ribet update tiap kali |
| Vercel | ✅ | ✅ | Tapi Next.js standalone tidak optimal |

Dengan Docker + ghcr.io:
- Image private gratis, unlimited
- Deploy ke VPS mana pun tinggal `docker pull` + `docker run`
- Update tinggal rebuild + push, di VPS `docker pull` + `docker restart`
- Bisa rollback kapan saja ke tag sebelumnya

## Prerequisites

Di laptop/development machine:
- Docker (```docker --version```)
- GitHub token dengan **write:packages** scope

Di VPS / server production:
- Docker (`docker --version`)
- Nginx (optional, untuk reverse proxy + SSL)
- Domain (optional, tapi recommended)

## Setup GitHub Container Registry

### 1. Buat GitHub Personal Access Token

1. Buka https://github.com/settings/tokens
2. Klik **Generate new token** → **Fine-grained token**
3. Nama: `woodloop-docker`
4. Expiration: `No expiration` (atau setahun)
5. Repository access: `Public repositories only` (cukup)
6. Permissions → **write:packages** ✅
7. Generate → copy token

### 2. Login Docker ke ghcr.io

```bash
echo <TOKEN> | docker login ghcr.io -u tifunisnu --password-stdin
```

Test:
```bash
docker pull ghcr.io/tifunisnu/woodloop-web:latest  # mungkin error pertama kali, ok
```

## Build & Push

### Cara 1: Via script (recommended)

```bash
# Build + push dengan tag latest
./scripts/deploy.sh

# Build + push dengan version tag
./scripts/deploy.sh v1.0.0

# Build only (tanpa push, untuk testing lokal)
./scripts/deploy.sh --no-push
```

### Cara 2: Manual step-by-step

```bash
# 1. Build image
docker build \
  -t woodloop-web:latest \
  -t ghcr.io/tifunisnu/woodloop-web:latest \
  --build-arg NEXT_PUBLIC_PB_URL=https://pb-woodloop.pasarjepara.com \
  -f Dockerfile .

# 2. Test lokal
docker run -d -p 3000:3000 woodloop-web:latest
curl http://localhost:3000/

# 3. Push ke registry
docker push ghcr.io/tifunisnu/woodloop-web:latest

# 4. (Optional) Tag + push versi
docker tag woodloop-web:latest ghcr.io/tifunisnu/woodloop-web:v1.0.0
docker push ghcr.io/tifunisnu/woodloop-web:v1.0.0
```

### Cara 3: Via docker compose (local testing)

```bash
docker compose up -d      # build + run
docker compose logs -f    # lihat log
docker compose down       # stop
docker compose build      # rebuild setelah perubahan kode
```

## Deploy ke VPS

### 1. Setup di VPS

```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Logout & login ulang, atau: newgrp docker

# Login ke ghcr.io
echo <GITHUB_TOKEN> | docker login ghcr.io -u tifunisnu --password-stdin
```

### 2. Pull & Run (first time)

```bash
docker pull ghcr.io/tifunisnu/woodloop-web:latest

docker run -d \
  --name woodloop-web \
  -p 127.0.0.1:3000:3000 \
  -e PORT=3000 \
  --restart unless-stopped \
  ghcr.io/tifunisnu/woodloop-web:latest
```

> ⚠ Gunakan `127.0.0.1:3000` (bukan `0.0.0.0:3000`) supaya tidak terbuka ke publik langsung.  
> Biar Nginx yang handle publik + SSL.

### 3. Update ke versi baru

```bash
# Di VPS:
docker pull ghcr.io/tifunisnu/woodloop-web:latest
docker stop woodloop-web && docker rm woodloop-web

docker run -d \
  --name woodloop-web \
  -p 127.0.0.1:3000:3000 \
  -e PORT=3000 \
  --restart unless-stopped \
  ghcr.io/tifunisnu/woodloop-web:latest
```

Atau pakai one-liner:

```bash
docker pull ghcr.io/tifunisnu/woodloop-web:latest && \
docker stop woodloop-web 2>/dev/null; docker rm woodloop-web 2>/dev/null; \
docker run -d --name woodloop-web -p 127.0.0.1:3000:3000 -e PORT=3000 \
  --restart unless-stopped ghcr.io/tifunisnu/woodloop-web:latest
```

### 4. Rollback ke versi sebelumnya

```bash
docker run -d --name woodloop-web -p 127.0.0.1:3000:3000 \
  --restart unless-stopped ghcr.io/tifunisnu/woodloop-web:v0.9.0
```

## Nginx Reverse Proxy (Recommended)

Biar bisa akses via domain + HTTPS:

```nginx
# /etc/nginx/sites-available/woodloop.pasarjepara.com
server {
    listen 80;
    server_name woodloop.pasarjepara.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/woodloop.pasarjepara.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL (Certbot)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d woodloop.pasarjepara.com
```

## Monitoring & Logs

```bash
# Log container
docker logs woodloop-web
docker logs -f --tail 50 woodloop-web

# Status container
docker ps --filter name=woodloop
docker stats woodloop-web

# Restart
docker restart woodloop-web

# Akses shell dalam container
docker exec -it woodloop-web sh
```

## Troubleshooting

**Container exit/Gagal jalan:**
```bash
docker logs woodloop-web  # lihat error
docker run -it --rm ghcr.io/tifunisnu/woodloop-web:latest sh
# Di dalam container: node server.js  # lihat langsung errornya
```

**Connection refused ke PocketBase:**
Pastikan VPS bisa reach `pb-woodloop.pasarjepara.com`. Cek dengan:
```bash
docker exec woodloop-web wget -qO- https://pb-woodloop.pasarjepara.com/api/health
```

**Image terlalu besar:**
Image standalone Next.js biasanya ~300-500MB. Ini normal karena includes Node.js runtime + dependencies.
