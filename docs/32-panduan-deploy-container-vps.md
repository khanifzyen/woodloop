# Panduan Upgrade Container WoodLoop Web di VPS

## Arsitektur

```
Development Machine              VPS Production
─────────────────                ──────────────
  docker build -t woodloop-web
  docker push ghcr.io/.../woodloop-web:v0.0.2
                                  docker pull ghcr.io/.../woodloop-web:v0.0.2
                                  docker stop woodloop-web
                                  docker rm woodloop-web
                                  docker run ... woodloop-web:v0.0.2
```

## Prerequisites (sekali saja)

### 1. Login Docker ke ghcr.io

Jalankan sekali di VPS:

```bash
echo <GITHUB_TOKEN> | docker login ghcr.io -u khanifzyen --password-stdin
```

> Token GitHub perlu scope **write:packages** (atau minimal `read:packages` untuk pull).

### 2. Container pertama kali

```bash
docker pull ghcr.io/khanifzyen/woodloop-web:latest

docker run -d \
  --name woodloop-web \
  -p 127.0.0.1:3000:3000 \
  -e PORT=3000 \
  --restart unless-stopped \
  ghcr.io/khanifzyen/woodloop-web:latest
```

> `127.0.0.1:3000` — container hanya bisa diakses dari localhost VPS.
> Nginx reverse proxy yang handle publik + SSL.

---

## Langkah Upgrade ke Versi Baru

### Cara 1: One-liner (recommended)

```bash
docker pull ghcr.io/khanifzyen/woodloop-web:v0.0.2 && \
docker stop woodloop-web 2>/dev/null; docker rm woodloop-web 2>/dev/null; \
docker run -d \
  --name woodloop-web \
  -p 127.0.0.1:3000:3000 \
  -e PORT=3000 \
  --restart unless-stopped \
  ghcr.io/khanifzyen/woodloop-web:v0.0.2
```

### Cara 2: Step-by-step

```bash
# 1. Tarik image terbaru
docker pull ghcr.io/khanifzyen/woodloop-web:v0.0.2

# 2. Hentikan container lama
docker stop woodloop-web

# 3. Hapus container lama
docker rm woodloop-web

# 4. Jalankan container baru
docker run -d \
  --name woodloop-web \
  -p 127.0.0.1:3000:3000 \
  -e PORT=3000 \
  --restart unless-stopped \
  ghcr.io/khanifzyen/woodloop-web:v0.0.2

# 5. Cek apakah berjalan
docker ps --filter name=woodloop-web

# 6. Cek log (optional)
docker logs -f --tail 50 woodloop-web
```

### Cara 3: Menggunakan tag `latest` (otomatis)

Jika ingin selalu menggunakan tag `latest` tanpa perlu ganti versi:

```bash
docker pull ghcr.io/khanifzyen/woodloop-web:latest && \
docker stop woodloop-web 2>/dev/null; docker rm woodloop-web 2>/dev/null; \
docker run -d \
  --name woodloop-web \
  -p 127.0.0.1:3000:3000 \
  -e PORT=3000 \
  --restart unless-stopped \
  ghcr.io/khanifzyen/woodloop-web:latest
```

---

## Verifikasi

```bash
# Cek container berjalan
docker ps --filter name=woodloop-web

# Test HTTP response
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
# Output: 200

# Cek log untuk memastikan tidak ada error
docker logs woodloop-web --tail 20
```

---

## Rollback

Jika versi baru bermasalah, rollback ke versi sebelumnya:

```bash
# Cari tag versi lama
# Lihat di https://github.com/khanifzyen/woodloop/pkgs/container/woodloop-web

docker pull ghcr.io/khanifzyen/woodloop-web:v0.0.1

docker stop woodloop-web && docker rm woodloop-web

docker run -d \
  --name woodloop-web \
  -p 127.0.0.1:3000:3000 \
  -e PORT=3000 \
  --restart unless-stopped \
  ghcr.io/khanifzyen/woodloop-web:v0.0.1
```

---

## Troubleshooting

**Container exit langsung (crash):**
```bash
docker logs woodloop-web
```
Lihat error di log. Biasanya karena port sudah dipakai atau env variable kurang.

**Port 3000 sudah terpakai:**
```bash
# Cek siapa yang pakai
ss -tlnp "sport = :3000"

# Ganti port eksternal, misal 3001
docker run -d --name woodloop-web -p 127.0.0.1:3001:3000 ...
```
Jangan lupa update konfigurasi Nginx juga.

**Image pull gagal (authentication required):**
```bash
# Login ulang
echo <GITHUB_TOKEN> | docker login ghcr.io -u khanifzyen --password-stdin

# Coba pull lagi
docker pull ghcr.io/khanifzyen/woodloop-web:v0.0.2
```

**Container berjalan tapi HTTP error:**
```bash
# Cek dari dalam VPS
curl -v http://localhost:3000/

# Cek log real-time
docker logs -f woodloop-web
```
