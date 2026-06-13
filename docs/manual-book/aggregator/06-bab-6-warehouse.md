---
title: "Bab 6 — Gudang (Warehouse)"
---

# Bab 6: Gudang (Warehouse)

---

Setelah pickup selesai dikonfirmasi, limbah otomatis masuk ke **Gudang** (Warehouse Inventory). Di sini Anda mengelola stok, menentukan harga jual, dan melihat detail setiap item.

![Halaman Gudang](../screenshots/17-aggregator-warehouse.png)
*Gambar 6.1 — Halaman inventaris gudang Aggregator*

---

## 6.1 Ringkasan Gudang

Halaman utama Gudang (`/aggregator/warehouse`) menampilkan:

### Kartu Ringkasan

| Kartu | Menampilkan |
|-------|-------------|
| **Total Berat** | Total berat seluruh limbah di gudang (kg) |
| **Total Nilai** | Estimasi total nilai stok (harga/kg × berat) |

### Filter Status

Gunakan dropdown filter untuk menampilkan item berdasarkan status:

| Filter | Status | Keterangan |
|--------|--------|------------|
| **Semua Status** | Semua | Seluruh item di gudang |
| **Dalam Stok** | `in_stock` | Item yang tersedia untuk dijual |
| **Dipesan** | `reserved` | Item yang sudah dipesan Converter |
| **Terjual** | `sold` | Item yang sudah terjual |

### Tabel Inventaris

| Kolom | Keterangan |
|-------|------------|
| **Jenis Kayu** | Nama kayu — klik untuk detail item |
| **Bentuk** | Bentuk limbah (Offcut Besar, Offcut Kecil, Serutan, dll) |
| **Berat (kg)** | Berat aktual dari hasil pickup |
| **Harga/kg (Rp)** | Input inline — edit langsung harga jual per kg |
| **Status** | Badge warna: Dalam Stok, Dipesan, Terjual |
| **Total Nilai** | Berat × Harga/kg |

---

## 6.2 Mengatur Harga Jual

Harga jual bisa diatur langsung dari **tabel Gudang** atau dari **halaman detail item**.

### Dari Tabel Gudang

1. Cari kolom **"Harga/kg (Rp)"** pada baris item yang ingin diatur
2. Ketik harga baru di input field
3. Klik di luar field (onBlur) — harga otomatis tersimpan
4. Notifikasi "Harga diperbarui" akan muncul

### Dari Halaman Detail Item

1. Klik **nama kayu** pada tabel → masuk ke halaman detail
2. Pada bagian **"Set Harga Jual"**, masukkan harga per kg
3. Klik **"Simpan"**
4. Harga akan tersimpan dan total nilai otomatis diperbarui

> **💡 Tips:** Pantau harga pasar secara berkala dan sesuaikan harga jual agar kompetitif di mata Converter.

---

## 6.3 Status Inventaris

| Status | Arti |
|--------|------|
| ✅ **Dalam Stok** (`in_stock`) | Item siap dijual, harga bisa diubah, tampil di Pasar Bahan Converter |
| ⏳ **Dipesan** (`reserved`) | Ada Converter yang sudah memesan, menunggu pembayaran |
| ❌ **Terjual** (`sold`) | Item sudah dibeli, transaksi selesai |

---

## 6.4 Detail Item Gudang

Halaman detail (`/aggregator/warehouse/[id]`) menampilkan informasi lengkap satu item:

### Galeri Foto

Foto limbah yang diambil saat pickup ditampilkan di bagian atas halaman detail.

### Info Item

| Informasi | Keterangan |
|-----------|------------|
| **Jenis Kayu** | Nama kayu dari pickup |
| **Bentuk** | Offcut, Serutan, Serbuk, dll |
| **Berat** | Berat aktual tercatat (kg) |
| **Total Nilai** | Berat × Harga/kg saat ini |
| **Status** | Badge status saat ini |

### Asal Pickup

Bagian ini menampilkan informasi asal-usul item:

| Informasi | Sumber |
|-----------|--------|
| **Generator** | Nama Generator yang menjual limbah |
| **Bentuk Asli** | Bentuk limbah saat pickup |
| **Volume Asli** | Volume limbah yang dijemput |
| **Tanggal Pickup** | Tanggal pickup dilakukan |
| **Status Pickup** | Status pickup (completed) |

### Edit Harga

Sama seperti di tabel, Anda bisa mengubah harga jual per kg dari halaman detail.

---
➡️ **Lanjut ke [Bab 7: Log Inventori & Riwayat](./07-bab-7-log-inventori.md)**
