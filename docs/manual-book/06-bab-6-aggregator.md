---
title: "Bab 6 — Panduan Aggregator"
---

# Bab 6: Panduan Aggregator (Pengepul & Logistik)

---

**Aggregator** adalah pihak yang **menjemput limbah** dari Generator, menyortirnya, menyimpannya di gudang, dan menjualnya ke Converter. Aggregator adalah **jembatan logistik** dalam ekosistem WoodLoop.

**Contoh pengguna Aggregator:** Pengepul kayu, jasa angkutan, pemilik gudang sortir.

---

## 6.1 Dashboard Aggregator

![Dashboard Aggregator](screenshots/14-aggregator-dashboard.png)
*Gambar 6.1 — Dashboard Aggregator*

| Kartu | Menampilkan |
|-------|-------------|
| **Penjemputan Hari Ini** | Jumlah pickup yang perlu dijadwalkan |
| **Stok Gudang** | Total volume limbah di gudang (ton) |
| **Nilai Stok** | Estimasi nilai total stok gudang |
| **Bid Aktif** | Jumlah bidding yang sedang berjalan |

---

## 6.2 Treasure Map

**Treasure Map** adalah peta interaktif yang menampilkan lokasi limbah yang tersedia untuk dijemput.

![Treasure Map](screenshots/15-aggregator-treasure-map.png)
*Gambar 6.2 — Treasure Map*

| Warna Pin | Status | Arti |
|-----------|--------|------|
| Hijau | **Tersedia** | Limbah siap dijemput |
| Kuning | **Dibidik** | Sudah ada Aggregator lain yang bid |
| Merah | **Terbooking** | Sudah dijadwalkan pickup |
| Abu-abu | **Terjual** | Sudah diambil |

**Filter peta:** Jenis kayu, bentuk limbah, jarak dari lokasi Anda.

Klik pin pada peta → muncul popup detail → klik **"Lihat Detail"** atau **"Ajukan Bid"**.

---

## 6.3 Bidding

### Cara Mengajukan Bid

1. Dari Treasure Map: klik pin → **"Ajukan Bid"**
2. Atau dari halaman Bidding: **"Bid Baru"**
3. Masukkan **harga tawaran**, **estimasi pickup**, dan **catatan**
4. Klik **"Kirim Bid"**

| Status Bid | Arti |
|------------|------|
| **Menunggu** | Generator belum merespon |
| **Diterima** | Generator menyetujui bid Anda |
| **Ditolak** | Generator menolak bid Anda |
| **Counter** | Generator mengajukan harga balik |

---

## 6.4 Penjemputan (Pickups)

### Proses Pickup

1. **Datang ke lokasi** Generator (gunakan Treasure Map untuk navigasi)
2. **Konfirmasi kedatangan** — klik **"Konfirmasi Pickup"**
3. **Ambil foto bukti** — foto limbah yang akan diambil
4. **Konfirmasi selesai**

Sistem akan merekam koordinat GPS, foto bukti, waktu, dan nama Generator.

> **Penting:** Foto dan GPS adalah **bukti sah** serah terima limbah.

---

## 6.5 Gudang & Penjualan Stok

### Ringkasan Gudang

| Kartu | Menampilkan |
|-------|-------------|
| **Total Berat** | Total seluruh limbah di gudang |
| **Jumlah Item** | Total item unik di gudang |
| **Nilai Stok** | Estimasi total nilai stok |

### Menambahkan Stok ke Gudang

1. Klik **"Tambah Stok"**
2. Pilih limbah dari hasil pickup
3. Tentukan **harga jual** untuk Converter
4. Klik **"Simpan"**

Setelah stok tersimpan dengan harga jual, secara otomatis muncul di **Pasar Bahan** yang bisa diakses Converter.

---
➡️ **Lanjut ke [Bab 7: Panduan Converter](./07-bab-7-converter.md)**
