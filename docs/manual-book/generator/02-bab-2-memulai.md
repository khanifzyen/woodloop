---
title: "Bab 2 — Memulai"
---

# Bab 2: Memulai

---

## 2.1 Akses ke Aplikasi

WoodLoop dapat diakses melalui browser web di alamat:

```
https://woodloop.pasarjepara.com
```

Untuk pengembangan dan pengujian lokal, akses melalui:

```
http://localhost:3001
```

**Persyaratan sistem:**
- Browser modern (Chrome, Firefox, Edge, Safari)
- Koneksi internet yang stabil
- Akun Generator yang sudah terdaftar

---

## 2.2 Login

### Langkah-langkah Login:

1. Buka halaman utama WoodLoop
2. Klik tombol **"Lanjut"** atau **"Mulai"** pada layar onboarding
3. Pilih peran **"Generator"** pada layar pemilihan peran
4. Klik **"Konfirmasi"**
5. Pada halaman login, masukkan:

| Field | Contoh |
|-------|--------|
| **Email** | `nama@email.com` |
| **Kata Sandi** | `•••••••••••` |

6. Klik tombol **"Masuk"**

![Dashboard Generator](01-generator-dashboard.png)
*Gambar 2.1 — Dashboard Generator setelah login*

> **🔑 Lupa Kata Sandi?** Klik tautan **"Lupa Kata Sandi?"** di halaman login dan ikuti petunjuk untuk mereset kata sandi melalui email.

---

## 2.3 Navigasi Antarmuka

Setelah login, Anda akan melihat **sidebar navigasi** di sebelah kiri dengan menu berikut:

| Menu | Ikon | Halaman | Fungsi |
|------|------|---------|--------|
| **Dashboard** | 📊 | `/generator/dashboard` | Ringkasan bisnis |
| **Setor Limbah** | 🗑️ | `/generator/report-waste` | Mendaftarkan limbah baru |
| **Daftar Limbah** | 📋 | `/generator/waste` | Mengelola limbah yang sudah disetor |
| **Beli Kayu** | 🪵 | `/generator/buy-timber` | Marketplace kayu dari Supplier |
| **Produk Saya** | 📦 | `/generator/products` | Mengelola produk furnitur |
| **Pesanan Kayu** | 📑 | `/generator/timber-orders` | Melacak pembelian kayu |

### Elemen Antarmuka Lainnya:

| Elemen | Lokasi | Fungsi |
|--------|--------|--------|
| **Breadcrumb** | Atas halaman | Menunjukkan posisi halaman saat ini |
| **Notifikasi** | Ikon lonceng (🔔) | Pemberitahuan sistem |
| **Akun** | Kanan atas (inisial) | Menu profil, logout |
| **Mode Gelap** | Atas | Toggle tema terang/gelap |
| **Ganti Bahasa** | Atas | Switch Indonesia/English |

> ⚠️ **Penting:** Menu navigasi hanya menampilkan fitur yang relevan dengan peran Generator. Setiap peran (Supplier, Aggregator, dll) memiliki menu yang berbeda.

---

## 2.4 Mode Gelap & Ganti Bahasa

WoodLoop mendukung **tema gelap** dan **dua bahasa**:

- **Mode Gelap:** Klik tombol **"Mode Gelap"** di bagian atas halaman untuk beralih antara tema terang dan gelap
- **Ganti Bahasa:** Klik tombol **"Ganti Bahasa"** untuk beralih antara Bahasa Indonesia dan English
- Pengaturan akan tersimpan secara otomatis untuk kunjungan berikutnya

---
➡️ **Lanjut ke [Bab 3: Dashboard Generator](./03-bab-3-dashboard.md)**
