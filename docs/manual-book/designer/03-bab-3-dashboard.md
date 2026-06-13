---
title: "Bab 3 — Dashboard Desainer"
---

# Bab 3: Dashboard Desainer

---

Halaman Dashboard Desainer adalah halaman utama yang muncul setelah login. Dashboard menampilkan ringkasan aktivitas desain Anda dalam bentuk kartu statistik dan artikel terbaru.

![Dashboard Desainer](01-desainer-dashboard.png)
*Gambar 3.1 — Dashboard Desainer*

---

## 3.1 Ringkasan Kartu (Summary Cards)

Empat kartu statistik menampilkan data ringkas aktivitas Anda:

| Kartu | Ikon | Menampilkan |
|-------|------|-------------|
| **Total Artikel** | 📄 | Jumlah seluruh artikel sirkular yang dibuat |
| **Artikel Terbit** | 👁️ | Artikel yang sudah dipublikasikan |
| **Catatan Desain** | 💬 | Jumlah catatan/saran desain yang diberikan |
| **Konsultasi Terbuka** | 🏪 | Jumlah permintaan konsultasi yang masih terbuka |

---

## 3.2 Artikel Terbaru

Di bawah ringkasan kartu, panel **Artikel Terbaru** menampilkan artikel yang baru saja Anda tulis atau edit:

```
┌────────────────────────────────────────────────────────────┐
│ Artikel Terbaru                                [Lihat Semua] │
│ ────────────────────────────────────────────────────────── │
│ 📢 Prinsip Dematerialisasi pada Produk Furnitur           │
│    📢 Terbit · 15 Jun 2026      [dematerialization]       │
│ ────────────────────────────────────────────────────────── │
│ 📝 Panduan Memilih Material Ramah Lingkungan               │
│    📝 Draf · 10 Jun 2026        [general]                 │
└────────────────────────────────────────────────────────────┘
```

Setiap artikel menampilkan:
- **Judul** — Nama artikel yang ditulis
- **Status** — 📢 Terbit (jika sudah dipublikasikan) atau 📝 Draf (masih konsep)
- **Tanggal** — Waktu pembuatan atau edit terakhir
- **Kategori** — Badge kategori artikel

> **Tips:** Dari panel ini Anda bisa langsung klik **"Lihat Semua"** untuk membuka halaman daftar artikel lengkap.

---

## 3.3 Menu Cepat (Quick Actions)

Dashboard menyediakan tombol aksi cepat untuk navigasi ke halaman-halaman utama:

| Tombol | Tujuan | Fungsi |
|--------|--------|--------|
| **Tulis Artikel Baru** | `/designer/articles` | Buka halaman artikel untuk menulis baru |
| **Catatan Desain** | `/designer/design-notes` | Beri saran desain pada produk |
| **Klinik Desain** | `/designer/design-clinic` | Lihat marketplace konsultasi |

---
➡️ **Lanjut ke [Bab 4: Artikel Sirkular](./04-bab-4-artikel-sirkular.md)**
