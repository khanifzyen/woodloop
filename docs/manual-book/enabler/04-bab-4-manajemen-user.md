---
title: "Bab 4 — Manajemen User"
---

# Bab 4: Manajemen User

---

Halaman **Manajemen User** menampilkan seluruh pengguna yang terdaftar di WoodLoop. Dari halaman ini Anda dapat melihat, mencari, menyaring, dan memverifikasi akun pengguna.

![Manajemen User](../screenshots/27-enabler-users.png)
*Gambar 4.1 — Halaman manajemen pengguna*

---

## 4.1 Melihat Daftar Pengguna

Setiap baris dalam tabel pengguna menampilkan:

| Kolom | Keterangan |
|-------|------------|
| **Nama** | Nama lengkap pengguna |
| **Email** | Email terdaftar |
| **Role** | Peran: Supplier, Generator, Aggregator, Converter, Buyer, Enabler, Designer |
| **Workshop** | Nama workshop/usaha (jika diisi) |
| **Verifikasi** | Badge hijau "Terverifikasi" atau abu-abu "Belum" |
| **Aksi** | Tombol Detail & Verifikasi (muncul saat hover) |

---

## 4.2 Filter & Pencarian

Halaman manajemen user menyediakan tiga filter untuk memudahkan pencarian:

### Pencarian Teks

Ketik kata kunci di kolom **"Cari nama/email..."** untuk mencari berdasarkan:
- Nama lengkap
- Email
- Nama workshop

### Filter Peran

Dropdown **"Semua Role"** memungkinkan Anda menyaring berdasarkan peran:

| Opsi |
|------|
| Semua Role |
| Supplier |
| Generator |
| Aggregator |
| Converter |
| Buyer |
| Enabler |
| Designer |

### Filter Status Verifikasi

Dropdown **"Semua Status"** menyaring berdasarkan status verifikasi:

| Opsi | Menampilkan |
|------|-------------|
| **Semua Status** | Seluruh pengguna |
| **Terverifikasi** | Hanya yang sudah diverifikasi |
| **Belum Verifikasi** | Hanya yang belum diverifikasi |

Filter dapat dikombinasikan. Contoh: tampilkan semua **Generator** yang **Belum Verifikasi**.

---

## 4.3 Verifikasi Akun

### Toggle Verifikasi Cepat

Dari halaman daftar pengguna, Anda dapat langsung mengubah status verifikasi:

1. Arahkan kursor ke baris pengguna yang ingin diverifikasi
2. Klik tombol **🛡️ (Verifikasi)**
3. Status berubah otomatis:
   - Jika sebelumnya "Belum", berubah menjadi **"Terverifikasi"** (badge hijau)
   - Jika sebelumnya "Terverifikasi", berubah menjadi **"Belum"** (badge abu-abu)

> **⚠️ Perhatian:** Membatalkan verifikasi akan mencabut status terverifikasi pengguna. Lakukan hanya jika ada pelanggaran atau dokumen tidak valid.

### Proses Verifikasi Lengkap (via Detail User)

Untuk verifikasi yang lebih teliti (meninjau dokumen), gunakan halaman Detail User:

1. Klik baris pengguna untuk masuk ke **halaman Detail User**
2. Lihat bagian **Dokumen Legalitas** — semua dokumen yang diupload pengguna
3. Buka dan tinjau setiap dokumen
4. Klik **"Verifikasi"** untuk menyetujui, atau **"Batalkan"** untuk menolak

Lihat [Bab 5: Detail User](./05-bab-5-detail-user.md#53-review-dokumen-legalitas) untuk panduan lengkap.

> **🔑 Tips:** Verifikasi pengguna yang memiliki dokumen legalitas lengkap (NIB, SVLK, dll). Pengguna yang belum upload dokumen sebaiknya diverifikasi setelah dokumen tersedia.

---
➡️ **Lanjut ke [Bab 5: Detail User](./05-bab-5-detail-user.md)**
