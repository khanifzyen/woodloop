---
title: "Bab 4 — Treasure Map & Bidding"
---

# Bab 4: Treasure Map & Bidding

---

**Treasure Map** adalah fitur unggulan Aggregator — peta interaktif yang menampilkan lokasi limbah yang tersedia untuk dijemput. Dari peta ini Anda dapat melihat detail limbah dan langsung mengajukan bidding atau membuat pickup.

![Treasure Map](../screenshots/15-aggregator-treasure-map.png)
*Gambar 4.1 — Treasure Map dengan pin lokasi limbah*

---

## 4.1 Mengakses Treasure Map

| Metode | Cara |
|--------|------|
| **Sidebar** | Klik menu **"Peta Harta Karun"** (🗺️) di sidebar navigasi |
| **Dashboard** | Klik tombol **"Lihat Peta Harta Karun"** pada dashboard |

---

## 4.2 Pin Lokasi & Urgensi Limbah

Setiap titik di peta adalah **pin lokasi** limbah yang tersedia. Warna pin menunjukkan **tingkat urgensi** berdasarkan usia pemasangan:

| Warna Pin | Usia | Label Urgensi |
|-----------|------|---------------|
| 🟢 **Hijau** | Baru dipasang (< 24 jam) | **Baru** |
| 🟡 **Kuning** | 24 — 48 jam | **> 24 jam** |
| 🔴 **Merah** | Lebih dari 48 jam | **Urgent** |

> **💡 Tips:** Prioritaskan pin merah (urgent) karena limbah sudah lama tersedia dan Generator mungkin lebih fleksibel dengan harga.

### Lokasi Pengguna

Peta juga menampilkan **titik lokasi Anda** (biru) yang terdeteksi otomatis dari GPS perangkat. Peta akan otomatis memusatkan pandangan ke lokasi Anda.

---

## 4.3 Filter Peta

Panel filter dapat dibuka dengan tombol filter (🔽) di pojok kanan atas peta:

| Filter | Fungsi |
|--------|--------|
| **Jenis Kayu** | Tampilkan hanya jenis kayu tertentu (Jati, Mahoni, Trembesi, dll) |
| **Bentuk** | Filter berdasarkan bentuk limbah (Offcut, Shaving, Sawdust, dll) |
| **Harga Maksimal** | Batasi harga estimasi maksimal |
| **Reset Filter** | Kembalikan semua filter ke default |

### Interaksi dengan Pin

1. Klik pin pada peta → muncul **popup** dengan info singkat
2. Klik pin untuk membuka **bottom sheet detail** yang berisi:
   - Foto limbah
   - Jenis kayu & bentuk
   - Volume & harga estimasi
   - Nama Generator
   - Label urgensi (Baru / > 24 jam / Urgent)
   - **"Ambil Langsung"** — langsung membuat pickup tanpa bidding
   - **"Ajukan Bid"** — membuka form bidding

---

## 4.4 Bidding (Lelang)

Sistem **bidding** memungkinkan Anda mengajukan harga untuk limbah yang tersedia. Halaman Lelang (`/aggregator/bidding`) memiliki dua tab.

### Tab 1: Lelang Tersedia

Menampilkan seluruh limbah yang bisa dibid dalam bentuk kartu:

| Info pada Kartu | Keterangan |
|-----------------|------------|
| **Jenis Kayu** | Nama kayu dan bentuk |
| **Volume** | Jumlah dengan satuan |
| **Estimasi Harga** | Harga yang diharapkan Generator (badge) |
| **Nama Generator** | Pemilik limbah |
| **Tombol "Ajukan Bid"** | Membuka dialog bidding |

### Cara Mengajukan Bid

1. Dari Treasure Map: klik pin → klik **"Ajukan Bid"**
2. Atau dari halaman Lelang (tab "Lelang Tersedia"): klik **"Ajukan Bid"** pada kartu limbah
3. Dialog bidding akan terbuka dengan informasi:

| Field | Keterangan |
|-------|------------|
| **Harga Bid** | Jumlah tawaran Anda — **minimal sama dengan estimasi** |
| **Pesan (opsional)** | Pesan untuk Generator |

4. Klik **"Kirim Bid"**

> ⚠️ **Aturan:** Harga bid **tidak boleh kurang** dari harga estimasi yang ditentukan Generator.

### Tab 2: Bid Saya

Menampilkan seluruh bid yang sudah Anda ajukan:

| Kolom | Keterangan |
|-------|------------|
| **Jenis Kayu** | Kayu yang ditawar |
| **Jumlah Bid** | Harga yang Anda tawarkan |
| **Status** | pending / accepted / rejected |
| **Tanggal** | Tanggal pengajuan |

---

## 4.5 Status Bid & Real-time Notifikasi

| Status | Arti |
|--------|------|
| ⏳ **Pending** | Generator belum merespon |
| ✅ **Accepted** | Generator menyetujui bid Anda — pickup otomatis dibuat |
| ❌ **Rejected** | Generator menolak bid Anda |

### Real-time Notification

Sistem menggunakan **real-time subscription** — Anda akan mendapat notifikasi langsung tanpa perlu refresh halaman:

- **Bid Diterima** → muncul toast sukses dengan tombol "Lihat Pickup" yang langsung membawa ke halaman Penjemputan
- **Bid Ditolak** → muncul toast informasi, Anda bisa mencari limbah lain

> **💡 Tips:** Saat bid Anda diterima, pickup otomatis dibuat oleh sistem. Segera cek halaman **Penjemputan** untuk mulai proses penjemputan.

---

## 4.6 Ambil Langsung (Direct Pickup)

Selain bidding, Treasure Map juga menyediakan opsi **"Ambil Langsung"** untuk limbah tertentu. Fitur ini langsung membuat pickup tanpa perlu proses bidding — cocok untuk situasi di mana Anda dan Generator sudah sepakat di luar sistem.

1. Klik pin pada Treasure Map
2. Klik **"Ambil Langsung"** pada bottom sheet
3. Pickup langsung dibuat dengan status **pending**
4. Cek halaman **Penjemputan** untuk mulai proses

---
➡️ **Lanjut ke [Bab 5: Penjemputan (Pickups)](./05-bab-5-pickups.md)**
