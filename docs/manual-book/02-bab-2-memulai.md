---
title: "Bab 2 — Memulai"
---

# Bab 2: Memulai

---

## 2.1 Cara Mengakses Aplikasi

### Web Browser (Desktop / Mobile)

Buka browser dan kunjungi:

```
https://woodloop.app
```

**Keunggulan akses web:**
- Langsung bisa digunakan tanpa instalasi
- Halaman traceability produk bisa diakses siapa saja tanpa login
- Produk muncul di hasil pencarian Google (SEO)

### Install Sebagai PWA

PWA memungkinkan website WoodLoop diinstall seperti aplikasi native.

| Langkah | Desktop | Android |
|---------|---------|---------|
| 1 | Buka `woodloop.app` di Chrome | Buka `woodloop.app` di Chrome |
| 2 | Klik ikon **install** di address bar | Ketuk menu (⋮) → **Install WoodLoop** |
| 3 | Klik **Install** | Ketuk **Install** |

**Keunggulan PWA:** Tampil standalone tanpa address bar, bisa diakses offline, ukuran sangat kecil.

### Install APK Android

Untuk pengalaman paling optimal terutama role lapangan (Generator, Aggregator, Supplier).

**Persyaratan:** Android 8.0+, RAM minimal 3 GB, izin kamera, GPS, notifikasi, penyimpanan.

**Cara install:**
1. Download file `WoodLoop-v1.0.apk` dari `woodloop.app/download`
2. Buka file APK yang sudah di-download
3. Jika muncul peringatan keamanan, pilih **Tetap Install**

> **Catatan:** Pada perangkat Xiaomi, Oppo, atau Vivo, izinkan "Install dari sumber tidak dikenal" di Pengaturan → Keamanan.

---

## 2.2 Registrasi Akun

### Langkah 1: Buka Halaman Registrasi

1. Buka `https://woodloop.app`
2. Klik tombol **"Daftar"**
3. Atau buka langsung: `https://woodloop.app/register`

![Halaman Registrasi](screenshots/03-register.png)
*Gambar 2.1 — Halaman registrasi akun WoodLoop*

### Langkah 2: Isi Data Diri

| Field | Keterangan | Contoh |
|-------|------------|--------|
| **Nama Lengkap** | Nama sesuai identitas | "Budi Santoso" |
| **Email** | Email aktif untuk konfirmasi | "budi@email.com" |
| **Nomor Telepon** | Nomor WhatsApp aktif | "081234567890" |
| **Kata Sandi** | Minimal 8 karakter | "********" |
| **Konfirmasi Sandi** | Ketik ulang kata sandi | "********" |

### Langkah 3: Pilih Peran

Setelah mengisi data diri, Anda akan diminta memilih **peran**. Lihat [Bab 1.2](./01-bab-1-pendahuluan.md#12-siapa-saja-penggunanya) jika bingung memilih peran.

> **Penting:** Peran **tidak bisa diubah** setelah registrasi. Pastikan Anda memilih peran yang tepat.

### Langkah 4: Isi Data Tambahan

| Peran | Field Tambahan |
|-------|----------------|
| **Supplier** | Nama workshop, alamat, kapasitas produksi |
| **Generator** | Nama workshop, jenis mesin, kapasitas produksi |
| **Aggregator** | Jenis armada, kapasitas gudang, wilayah operasi |
| **Converter** | Nama workshop, spesialisasi, kapasitas produksi |
| **Buyer** | Alamat pengiriman |
| **Enabler** | Nama instansi, jabatan |

### Langkah 5: Konfirmasi & Selesai

1. Periksa kembali data yang diisi
2. Klik **"Daftar"**
3. Anda akan diarahkan ke dashboard sesuai peran

---

## 2.3 Login & Logout

### Login

1. Buka `https://woodloop.app/login`
2. Masukkan **Email** dan **Kata Sandi**
3. Klik **"Masuk"**

![Halaman Login](screenshots/02-login.png)
*Gambar 2.2 — Halaman login WoodLoop*

> **Tips:** Pastikan koneksi internet stabil. Kata sandi bersifat **case-sensitive**.

### Lupa Kata Sandi

1. Di halaman login, klik **"Lupa Kata Sandi?"**
2. Masukkan email yang terdaftar
3. Cek email — tautan reset akan dikirim (berlaku **1 jam**)
4. Klik tautan dan buat kata sandi baru

### Logout

1. Klik **avatar / inisial** di pojok kanan atas
2. Pilih **"Keluar"**

### Masalah Login Umum

| Masalah | Solusi |
|---------|--------|
| **Email tidak terdaftar** | Periksa kembali email, atau daftar akun baru |
| **Kata sandi salah** | Gunakan fitur "Lupa Kata Sandi" |
| **Akun diblokir** | Hubungi admin Enabler melalui email support |
| **Tetap di halaman login** | Hapus cache browser, atau gunakan mode incognito |

---

## 2.4 Profil & Verifikasi Akun

### Mengakses & Mengedit Profil

1. Klik **avatar / inisial** di pojok kanan atas
2. Pilih **"Profil"**
3. Klik ikon **pensil (✏️)** pada field yang ingin diubah
4. Klik **"Simpan"**

| Field | Keterangan |
|-------|------------|
| **Foto Profil** | Upload foto atau ambil dari kamera |
| **Nama** | Nama lengkap |
| **Bio** | Deskripsi singkat tentang Anda / usaha |
| **Nomor Telepon** | Kontak yang bisa dihubungi |
| **Alamat** | Lokasi workshop / rumah |
| **Media Sosial** | Link Instagram, website, dll |

### Verifikasi Akun

Akun **terverifikasi** mendapatkan badge centang biru (✓) yang menandakan identitas Anda sudah dikonfirmasi oleh admin WoodLoop.

**Keuntungan:**
- Prioritas di pencarian untuk Supplier, Generator, Aggregator, Converter
- Limit transaksi lebih tinggi
- Akses bidding premium

**Cara verifikasi:**
1. Buka halaman **Profil**
2. Klik **"Ajukan Verifikasi"**
3. Upload dokumen pendukung (KTP, SIUP/NIB, SVLK, dll sesuai peran)
4. Admin akan memproses dalam **1×24 jam**
5. Anda akan mendapat notifikasi saat verifikasi selesai

### Dokumen Legalitas yang Didukung

| Dokumen | Format | Ukuran Maks |
|---------|--------|-------------|
| KTP | JPG, PNG | 2 MB |
| SIUP / NIB | PDF, JPG, PNG | 5 MB |
| SVLK / FSC Certificate | PDF | 5 MB |
| NPWP | PDF, JPG | 2 MB |

---
➡️ **Lanjut ke [Bab 3: Navigasi Umum](./03-bab-3-navigasi-umum.md)**
