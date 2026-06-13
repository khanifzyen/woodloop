---
title: "Bab 3 — Dashboard Converter"
---

# Bab 3: Dashboard Converter

---

Halaman Dashboard Converter adalah halaman utama yang muncul setelah login. Dashboard menampilkan ringkasan bisnis kreatif Anda dalam bentuk kartu statistik dan daftar transaksi terbaru.

![Dashboard Converter](../screenshots/18-converter-dashboard.png)
*Gambar 3.1 — Dashboard Converter*

---

## 3.1 Ringkasan Kartu (Summary Cards)

Empat kartu statistik menampilkan data ringkas bisnis Anda:

| Kartu | Ikon | Menampilkan |
|-------|------|-------------|
| **Bahan Dibeli** | 🛒 | Total bahan limbah yang sudah dibeli |
| **Produk Dibuat** | 🎨 | Jumlah produk upcycled yang sudah dibuat |
| **Total Investasi** | 💰 | Total dana yang diinvestasikan untuk bahan baku (Rp) |
| **Desain Tersedia** | 📖 | Jumlah desain/resep yang tersedia di Klinik Desain |

---

## 3.2 Transaksi Terbaru

Di bawah ringkasan kartu, terdapat daftar **Transaksi Terbaru** yang menampilkan riwayat pembelian bahan terakhir Anda.

Setiap item transaksi menampilkan:
- **Ikon** 🛒 — Menandakan transaksi pembelian
- **Total Harga** — Jumlah dalam Rupiah
- **Status & Tanggal** — Status transaksi dan tanggal kejadian

```
🛒 Rp 150.000 — paid — 12 Juni 2026
🛒 Rp 75.000  — pending — 10 Juni 2026
```

Jika belum ada transaksi, akan tampil pesan:
> *"Belum ada transaksi"*

---

## 3.3 Menu Cepat (Quick Actions)

Dashboard menyediakan tombol aksi cepat untuk navigasi ke halaman-halaman utama:

| Tombol | Tujuan | Fungsi |
|--------|--------|--------|
| **Cari Bahan** | `/converter/marketplace/materials` | Membuka Pasar Bahan |
| **Buat Produk** | `/converter/catalog/new` | Membuka form produk baru |

---
➡️ **Lanjut ke [Bab 4: Pasar Bahan (Marketplace)](./04-bab-4-pasar-bahan.md)**
