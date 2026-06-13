---
title: "Bab 3 — Navigasi Umum"
---

# Bab 3: Navigasi Umum

---

## 3.1 Struktur Halaman

Setelah login, setiap halaman WoodLoop memiliki struktur yang sama:

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────┐  HEADER                               │
│  │              │  ☰ Menu  │  🔔 Notif  │ 💰 Wallet  │ 👤 |
│  │   SIDEBAR    ├──────────────────────────────────────┤
│  │   (Navigasi) │  BREADCRUMB                           │
│  │              ├──────────────────────────────────────┤
│  │  • Dashboard │                                      │
│  │  • Fitur 1   │          KONTEN UTAMA                 │
│  │  • Fitur 2   │        (Card, Table, Form,           │
│  │  • Fitur 3   │         Chart, dll.)                  │
│  │  • ...       │                                      │
│  │              │                                      │
│  │  • Profil    │                                      │
│  │  • Logout    │                                      │
│  └──────────────┴──────────────────────────────────────┘
```

| Area | Letak | Fungsi |
|------|-------|--------|
| **Header** | Pojok kanan atas | Notifikasi, wallet, avatar, dark mode, bahasa |
| **Sidebar** | Kiri (desktop) / Sheet (mobile) | Navigasi menu sesuai peran |
| **Breadcrumb** | Atas konten | Menunjukkan posisi halaman saat ini |
| **Konten Utama** | Tengah | Isi halaman (dashboard, form, tabel, dll) |

---

## 3.2 Sidebar per Peran

Setiap peran memiliki menu sidebar yang berbeda. Berikut perbandingannya:

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

### Pada Perangkat Mobile (≤ 768px)

Di layar kecil, sidebar berubah menjadi **Sheet** yang muncul dari kiri:

1. Ketuk ikon **☰ (hamburger menu)** di pojok kiri atas
2. Sidebar akan muncul sebagai panel dari kiri
3. Ketuk menu yang diinginkan
4. Panel akan tertutup otomatis setelah memilih menu

---

## 3.3 Breadcrumb

Breadcrumb menunjukkan posisi Anda dalam hirarki halaman. Contoh:

```
Supplier  ›  Inventaris Kayu  ›  Tambah Kayu Baru
```

Breadcrumb membantu Anda:
- Mengetahui halaman sedang aktif
- Kembali ke halaman sebelumnya dengan mengklik tautan di breadcrumb
- Memahami struktur navigasi aplikasi

---

## 3.4 Mode Gelap / Terang

WoodLoop mendukung **Dark Mode** dan **Light Mode**.

**Cara mengganti mode:**
1. Klik ikon **🌙 / ☀️** di pojok kanan header
2. Mode akan berubah otomatis

**Pilihan mode:**
| Mode | Tampilan | Cocok untuk |
|------|----------|-------------|
| ☀️ **Terang (Light)** | Latar putih, teks hitam | Penggunaan di siang hari / ruangan terang |
| 🌙 **Gelap (Dark)** | Latar gelap, teks terang | Penggunaan malam hari / ruangan redup |
| 🔄 **Ikuti Sistem** | Otomatis mengikuti pengaturan perangkat | Pengguna yang sering berpindah lingkungan |

> Pengaturan mode tersimpan di browser dan akan diingat saat下次 login.

---

## 3.5 Ganti Bahasa (EN/ID)

WoodLoop mendukung **dua bahasa**:

| Bahasa | Kode | Tombol |
|--------|------|--------|
| 🇮🇩 **Bahasa Indonesia** | id | Tampilkan "ID" |
| 🇬🇧 **English** | en | Tampilkan "EN" |

**Cara mengganti bahasa:**
1. Klik tombol **"ID"** atau **"EN"** di pojok kanan header
2. Bahasa akan berubah seketika
3. Semua teks di aplikasi akan mengikuti bahasa yang dipilih

> **Catatan:** Bahasa yang dipilih akan tersimpan di pengaturan akun Anda.

---

### Ringkasan Bab 3

| Fitur | Shortcut / Letak | Fungsi |
|-------|-----------------|--------|
| Sidebar | Kiri (desktop) / ☰ (mobile) | Navigasi menu per peran |
| Breadcrumb | Atas konten utama | Menunjukkan posisi halaman |
| Dark Mode | 🌙 / ☀️ di header | Mengubah tema tampilan |
| Ganti Bahasa | ID / EN di header | Mengubah bahasa aplikasi |
| Notifikasi | 🔔 di header | Melihat notifikasi masuk |
| Wallet | 💰 di header | Cek saldo dompet |
| Profil | 👤 di header | Edit profil & logout |

---
➡️ **Lanjut ke [Bab 4: Panduan Supplier](./04-bab-4-supplier.md)**
