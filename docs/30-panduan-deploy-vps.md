# Panduan Deploy WoodLoop ke VPS (Ubuntu + Bun)

**Project:** WoodLoop Web + Hybrid Mobile
**Platform:** VPS Ubuntu 24.04
**Runtime:** Bun 1.3.14
**Web Server:** Nginx + Let's Encrypt SSL
**Backend:** PocketBase (existing, port 8090)
**Terakhir Diperbarui:** 19 Mei 2026

---

## Daftar Isi

1. [Arsitektur](#1-arsitektur)
2. [Prerequisites](#2-prerequisites)
3. [Pull Code & Install Dependencies](#3-pull-code--install-dependencies)
4. [Konfigurasi Next.js untuk Production](#4-konfigurasi-nextjs-untuk-production)
5. [Build](#5-build)
6. [Jalankan dengan Process Manager](#6-jalankan-dengan-process-manager)
7. [Setup Nginx Reverse Proxy](#7-setup-nginx-reverse-proxy)
8. [SSL Certificate (Let's Encrypt)](#8-ssl-certificate-lets-encrypt)
9. [Final Checklist](#9-final-checklist)
10. [Maintenance](#10-maintenance)

---

## 1. Arsitektur

```
                        Port 443 (HTTPS)
Browser ─────────────────────→┐
                               │
                          ┌────┴─────┐
                          │  Nginx   │ ← reverse proxy + SSL
                          └────┬─────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              Port 3000             Port 8090
          ┌───────┴───────┐     ┌───┴────┐
          │  Next.js      │     │PocketBase│
          │  (Bun start)  │     └────────┘
          └───────────────┘
```

| Komponen | Port | Role |
|----------|------|------|
| **Nginx** | 443 (HTTPS) / 80 (HTTP) | Reverse proxy, SSL termination, static cache |
| **Next.js** | 3000 | Web app (SSR, API routes, middleware) |
| **PocketBase** | 8090 | Backend database, auth, file storage |

---

## 2. Prerequisites

| Item | Status |
|------|--------|
| VPS Ubuntu 24.04 | ✅ |
| Bun 1.3.14+ | ✅ |
| Git | ✅ |
| Domain (misal: woodloop.app) | ⬜ Siapkan |
| DNS A record pointing ke IP VPS | ⬜ Siapkan |
| PocketBase sudah running di port 8090 | ✅ |
| Kode sudah di `/mnt/data1/www/woodloop` | ✅ |
| Environment variable `NEXT_PUBLIC_PB_URL` | ✅ `https://pb-woodloop.pasarjepara.com` |

---

## 3. Pull Code & Install Dependencies

```bash
# Masuk ke folder project
cd /mnt/data1/www/woodloop/woodloop_web

# Pull latest code dari GitHub
git pull origin master

# Install dependencies
bun install
```

---

## 4. Konfigurasi Next.js untuk Production

### 4.1 Update next.config.ts

Edit `woodloop_web/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pocketbase"],
};

export default nextConfig;
```

**Penjelasan:**
- `output: "standalone"` — menghasilkan folder `.next/standalone/` yang berisi file minimal untuk production (jauh lebih kecil dari `.next/` biasa)
- `serverExternalPackages: ["pocketbase"]` — memastikan PocketBase SDK dapat di-load di server

### 4.2 Buat .env.production

```bash
cat > /mnt/data1/www/woodloop/woodloop_web/.env.production << 'EOF'
NEXT_PUBLIC_PB_URL=https://pb-woodloop.pasarjepara.com
PORT=3000
EOF
```

---

## 5. Build

```bash
cd /mnt/data1/www/woodloop/woodloop_web

# Hentikan dev server jika masih berjalan
kill $(lsof -ti :3000) 2>/dev/null

# Build production
bun run build
```

Setelah build selesai, struktur folder:

```
.next/standalone/
├── server.js              ← Entry point production
├── package.json
└── woodloop_web/          ← Static files & pages
    ├── .next/
    │   ├── static/        ← Client-side JS chunks
    │   ├── server/        ← Server chunks
    │   └── ...
    └── public/            ← Public assets
```

> **Catatan:** Ukuran `.next/standalone/` sekitar ~150MB, jauh lebih kecil dari `.next/` yang bisa mencapai 2.3GB.

---

## 6. Jalankan dengan Process Manager

Pilih salah satu metode:

### Opsi A: PM2 (Recommended)

```bash
# Install PM2 global via Bun
bun add -g pm2

# Jalankan Next.js standalone
pm2 start .next/standalone/server.js \
  --name woodloop-web \
  --env PORT=3000 \
  --env NODE_ENV=production \
  --env NEXT_PUBLIC_PB_URL=https://pb-woodloop.pasarjepara.com

# Simpan daftar process (biar auto-restart)
pm2 save

# Buat startup script (systemd)
pm2 startup
```

**Perintah PM2 yang berguna:**

| Perintah | Fungsi |
|----------|--------|
| `pm2 status` | Lihat status semua process |
| `pm2 logs woodloop-web` | Lihat log realtime |
| `pm2 restart woodloop-web` | Restart app |
| `pm2 stop woodloop-web` | Stop app |
| `pm2 delete woodloop-web` | Hapus dari PM2 |

### Opsi B: Systemd Service (Tanpa PM2)

```bash
# Buat service file
sudo tee /etc/systemd/system/woodloop-web.service << 'SERVICE'
[Unit]
Description=WoodLoop Next.js Web
After=network.target

[Service]
Type=simple
User=tifunisnu
WorkingDirectory=/mnt/data1/www/woodloop/woodloop_web
ExecStart=/usr/local/bin/bun run .next/standalone/server.js
Restart=always
RestartSec=5
Environment="NODE_ENV=production"
Environment="PORT=3000"
Environment="NEXT_PUBLIC_PB_URL=https://pb-woodloop.pasarjepara.com"

[Install]
WantedBy=multi-user.target
SERVICE

# Reload systemd
sudo systemctl daemon-reload

# Aktifkan auto-start saat boot
sudo systemctl enable woodloop-web

# Start service
sudo systemctl start woodloop-web

# Cek status
sudo systemctl status woodloop-web
```

**Perintah systemd yang berguna:**

| Perintah | Fungsi |
|----------|--------|
| `sudo systemctl status woodloop-web` | Lihat status |
| `sudo journalctl -u woodloop-web -f` | Lihat log realtime |
| `sudo systemctl restart woodloop-web` | Restart |
| `sudo systemctl stop woodloop-web` | Stop |

### Verifikasi

```bash
# Test akses lokal
curl http://localhost:3000

# Harusnya redirect ke /onboarding atau halaman login
# Jika dapat response HTML, app sudah jalan
```

---

## 7. Setup Nginx Reverse Proxy

### 7.1 Install Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 7.2 Buat Konfigurasi Virtual Host

```bash
sudo nano /etc/nginx/sites-available/woodloop
```

Isi dengan:

```nginx
# HTTP — redirect ke HTTPS
server {
    listen 80;
    server_name woodloop.app www.woodloop.app;

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS — reverse proxy ke Next.js
server {
    listen 443 ssl http2;
    server_name woodloop.app www.woodloop.app;

    # SSL (diisi certbot nanti, untuk sekarang komen dulu)
    # ssl_certificate /etc/letsencrypt/live/woodloop.app/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/woodloop.app/privkey.pem;

    # Logging
    access_log /var/log/nginx/woodloop-access.log;
    error_log  /var/log/nginx/woodloop-error.log;

    # Reverse proxy ke Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support (untuk chat realtime)
    location /_next/webpack-hmr {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Static files — cache lama
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /static {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 7.3 Aktifkan Konfigurasi

```bash
# Aktifkan site
sudo ln -s /etc/nginx/sites-available/woodloop /etc/nginx/sites-enabled/

# Hapus default site
sudo rm /etc/nginx/sites-enabled/default

# Test konfigurasi
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 8. SSL Certificate (Let's Encrypt)

### 8.1 Install Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

### 8.2 Dapatkan Sertifikat

**Prasyarat:** Domain (`woodloop.app` dan `www.woodloop.app`) sudah pointing ke IP VPS dan Nginx sudah jalan di port 80.

```bash
sudo certbot --nginx -d woodloop.app -d www.woodloop.app
```

Certbot akan:
1. Memverifikasi kepemilikan domain
2. Mendapatkan sertifikat SSL
3. Otomatis meng-update konfigurasi Nginx (isi `ssl_certificate` dan `ssl_certificate_key`)
4. Mengatur auto-renewal via systemd timer

### 8.3 Verifikasi Sertifikat

```bash
# Cek jadwal renewal
sudo systemctl status certbot.timer

# Test renewal (dry-run)
sudo certbot renew --dry-run

# Cek cert info
sudo certbot certificates
```

---

## 9. Final Checklist

| # | Item | Cara Cek |
|---|------|----------|
| 1 | ✅ Build sukses | `cd woodloop_web && bun run build` — exit code 0 |
| 2 | ✅ App jalan di port 3000 | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` → 200/302 |
| 3 | ⬜ PM2/systemd running | `pm2 status` atau `sudo systemctl status woodloop-web` → running |
| 4 | ⬜ Nginx berjalan | `sudo systemctl status nginx` → active (running) |
| 5 | ⬜ Domain pointing ke VPS | `dig +short woodloop.app` → IP VPS |
| 6 | ⬜ SSL aktif | `curl -sI https://woodloop.app` → 200 OK |
| 7 | ⬜ Test login 7 role (Supplier, Generator, Aggregator, Converter, Desainer, Enabler, Buyer) | Buka web, login sebagai supplier/generator/aggregator/converter/enabler/buyer |
| 8 | ⬜ Sitemap valid | Buka `https://woodloop.app/sitemap.xml` → XML valid |
| 9 | ⬜ Robots.txt valid | Buka `https://woodloop.app/robots.txt` → ada isi |
| 10 | ⬜ Manifest valid | Buka `https://woodloop.app/manifest.webmanifest` → JSON valid |
| 11 | ⬜ Midtrans payment | Test flow checkout → halaman pembayaran muncul |
| 12 | ⬜ Lighthouse test | Skor Performance ≥ 80, SEO ≥ 95 |

---

## 10. Maintenance

### Update Aplikasi

```bash
cd /mnt/data1/www/woodloop/woodloop_web

# Pull code terbaru
git pull origin master

# Install dependencies baru (jika ada)
bun install

# Rebuild
bun run build

# Restart
pm2 restart woodloop-web
# atau
sudo systemctl restart woodloop-web
```

### Log Monitoring

```bash
# PM2
pm2 logs woodloop-web

# Systemd
sudo journalctl -u woodloop-web -f

# Nginx
tail -f /var/log/nginx/woodloop-access.log
tail -f /var/log/nginx/woodloop-error.log
```

### Backup

```bash
# Backup .env (berisi konfigurasi sensitif)
cp /mnt/data1/www/woodloop/woodloop_web/.env.production ~/backup/env.production.bak

# Backup konfigurasi Nginx
sudo cp /etc/nginx/sites-available/woodloop ~/backup/nginx-woodloop.bak
```

### Troubleshooting Cepat

| Masalah | Solusi |
|---------|--------|
| **App tidak bisa diakses** | `pm2 status` / `systemctl status woodloop-web` → restart jika down |
| **502 Bad Gateway** | Nginx tidak bisa connect ke port 3000 → cek apakah Next.js running |
| **SSL expired** | `sudo certbot renew` — atau cek timer: `sudo systemctl status certbot.timer` |
| **PocketBase error** | Cek `curl https://pb-woodloop.pasarjepara.com/api/health` |
| **Disk penuh** | `df -h` → hapus `.next/` lama atau log Nginx: `sudo truncate -s 0 /var/log/nginx/*.log` |

---

**© 2026 WoodLoop — Panduan Deploy VPS**
