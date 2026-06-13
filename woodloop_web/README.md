# 🪵 WoodLoop Web — Jepara Circular Hub

Platform ekonomi sirkular untuk industri kayu dan furnitur di Jepara, Jawa Tengah. Menghubungkan **7 peran pengguna** — Supplier, Generator, Aggregator, Converter, Desainer, Buyer, dan Enabler — dalam satu ekosistem untuk mengelola limbah kayu menjadi produk bernilai tambah.

## Fitur Utama

- **Dashboard peran** — Setiap role memiliki halaman dan alur kerja spesifik
- **Marketplace** — Jual-beli limbah kayu dan produk upcycle
- **Pickup & Logistik** — Pengelolaan penjemputan limbah oleh Aggregator
- **Traceability** — Lacak jejak produk dari limbah hingga barang jadi via QR code
- **Dompet Digital** — Transaksi internal antar pengguna
- **Chat Real-time** — Komunikasi antar role
- **Notifikasi** — Update status pickup, transaksi, dan bidding

## Tech Stack

| Stack | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router, SSR) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | Zustand + TanStack React Query |
| Backend | PocketBase (SQLite, Auth, File Storage) |
| Maps | Leaflet / react-leaflet |
| Charts | Recharts |
| Form | react-hook-form + Zod |
| i18n | next-intl (EN/ID) |
| Mobile | Capacitor (Android Hybrid) |
| Testing | Vitest + Playwright |
| Deploy | Docker → ghcr.io → VPS |

## Memulai

```bash
# Install dependencies
pnpm install

# Jalankan development server
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Env Variables

Salin `.env.example` ke `.env` lalu isi:

```
NEXT_PUBLIC_PB_URL=
NEXT_PUBLIC_APP_URL=
```

## Deployment

Build dan deploy menggunakan Docker:

```bash
docker build -t woodloop-web .
docker run -p 3000:3000 woodloop-web
```

Atau lihat [panduan deploy VPS](../docs/30-panduan-deploy-vps.md).
