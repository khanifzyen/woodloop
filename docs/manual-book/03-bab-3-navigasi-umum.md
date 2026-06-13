---
title: "Bab 3 — Navigasi Umum"
---

# Bab 3: Navigasi Umum

---

## 3.1 Struktur Halaman

Setelah login, setiap halaman WoodLoop memiliki struktur yang sama:

| Area | Letak | Fungsi |
|------|-------|--------|
| **Header** | Pojok kanan atas | Notifikasi, wallet, avatar, dark mode, bahasa |
| **Sidebar** | Kiri (desktop) / Sheet (mobile) | Navigasi menu sesuai peran |
| **Breadcrumb** | Atas konten | Menunjukkan posisi halaman saat ini |
| **Konten Utama** | Tengah | Isi halaman (dashboard, form, tabel, dll) |

---

## 3.2 Sidebar per Peran

### Supplier
```
🌲 Supplier
├── 📊 Dashboard
├── 📦 Inventaris Kayu
├── 📋 Pesanan Masuk
└── 💰 Riwayat Penjualan
```

### Generator
```
🏭 Generator
├── 📊 Dashboard
├── 🗑️ Setor Limbah
├── 🪵 Beli Kayu
├── 📦 Produk Saya
└── 📋 Pesanan Kayu
```

### Aggregator
```
🚛 Aggregator
├── 📊 Dashboard
├── 🗺️ Peta (Treasure Map)
├── 🚚 Penjemputan
├── 🏗️ Gudang
└── 💰 Bidding
```

### Converter
```
♻️ Converter
├── 📊 Dashboard
├── 🏪 Pasar Bahan
├── 📦 Checkout
├── 📋 Katalog Produk
└── 🎨 Klinik Desain
```

### Desainer
```
✏️ Desainer
├── 📊 Dashboard
├── 📝 Artikel Sirkular
├── 🎨 Catatan Desain
└── 🏪 Klinik Desain
```

### Buyer
```
🛒 Buyer
├── 🏪 Marketplace
├── 🛒 Keranjang
├── 📋 Pesanan Saya
└── ❤️ Favorit
```

### Enabler
```
📊 Enabler
├── 📈 Dashboard
└── 👥 Manajemen User
```

Pada perangkat mobile (≤ 768px), sidebar berubah menjadi **Sheet** yang muncul dari kiri dengan mengetuk ikon **☰ (hamburger menu)**.

---

## 3.3 Breadcrumb

Breadcrumb menunjukkan posisi Anda dalam hirarki halaman. Contoh:

```
Supplier  ›  Inventaris Kayu  ›  Tambah Kayu Baru
```

Klik tautan di breadcrumb untuk kembali ke halaman sebelumnya.

---

## 3.4 Mode Gelap & Ganti Bahasa

### Mode Gelap / Terang

Klik ikon **🌙 / ☀️** di pojok kanan header untuk mengganti mode:

| Mode | Tampilan |
|------|----------|
| **Terang (Light)** | Latar putih, teks hitam |
| **Gelap (Dark)** | Latar gelap, teks terang |
| **Ikuti Sistem** | Otomatis mengikuti pengaturan perangkat |

### Ganti Bahasa

Klik tombol **"ID"** atau **"EN"** di pojok kanan header untuk mengganti bahasa.

| Bahasa | Tombol |
|--------|--------|
| **Bahasa Indonesia** | ID |
| **English** | EN |

> Pengaturan mode dan bahasa tersimpan di akun Anda.

---
➡️ **Lanjut ke [Bab 4: Panduan Supplier](./04-bab-4-supplier.md)**
