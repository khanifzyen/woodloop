---
title: "Bab 5 — Detail Produk & Traceability"
---

# Bab 5: Detail Produk & Traceability

---

Halaman **Detail Produk** menampilkan informasi lengkap tentang suatu produk upcycled, termasuk galeri foto, traceability perjalanan produk, dampak lingkungan, dan ulasan pembeli.

![\1](../screenshots/\2)
*Gambar 5.1 — Halaman detail produk*

---

## 5.1 Galeri Foto

Di bagian kiri atas halaman, terdapat **Carousel Galeri Foto** yang menampilkan foto-foto produk:

- Geser ke kiri/kanan untuk melihat foto lainnya
- Klik tombol ◀️ ▶️ untuk navigasi
- Jika hanya ada 1 foto, tombol navigasi tidak akan muncul
- Jika produk tidak memiliki foto, akan tampil placeholder **"Tidak ada foto"**

---

## 5.2 Informasi Produk

Di bagian kanan, Anda akan menemukan informasi detail produk:

| Informasi | Keterangan |
|-----------|------------|
| **Nama Produk** | Nama produk upcycled |
| **Badge Kategori** | Kategori produk (Furniture, Decor, dll) |
| **Badge Stok** | 🟢 Stok tersedia / ⚪ Habis |
| **Harga** | Harga jual dalam Rupiah (format besar) |
| **Rating** | ⭐ Rata-rata rating dari ulasan pembeli |
| **Nama Converter** | Nama pengrajin (link ke Toko Penjual) |
| **Deskripsi** | Cerita dan detail produk |

### Kartu Converter (Penjual)

Di bawah harga, terdapat kartu info Converter:

```
┌──────────────────────────────────────────────┐
│ [Avatar] Nama Converter                       │
│          Converter                            │
│                [Lihat Toko]                   │
└──────────────────────────────────────────────┘
```

Klik **"Lihat Toko"** untuk melihat profil lengkap Converter dan produk lainnya.

### Tombol Aksi

| Tombol | Fungsi |
|--------|--------|
| **+ Keranjang** | Tambah produk ke keranjang belanja |
| **Beli Langsung** | Langsung ke halaman checkout |

### Tombol Wishlist (❤️)

Klik ikon heart di pojok kanan atas untuk menambah/menghapus produk dari wishlist:
- Heart kosong → produk belum di-wishlist
- Heart merah terisi → produk sudah di-wishlist

---

## 5.3 Perjalanan Produk (Traceability)

Bagian **Perjalanan Produk** menampilkan timeline visual asal-usul produk:

```
🌱 Bahan Baku
│  Kayu Jati dari Supplier A
│  50 kg • 15 Januari 2026
│
├── 2 Material
│   Offcut Besar dari Generator B
│   30 kg • 20 Januari 2026
│
└── 3 Produk Jadi
    Produk ini dibuat dari bahan pilihan
```

Setiap langkah menampilkan:
- **Ikon** — 🌱 untuk bahan baku awal, angka untuk material berikutnya
- **Nama Bahan** — Jenis kayu atau bentuk limbah
- **Sumber** — Nama Supplier/Generator/Aggregator asal
- **Jumlah** — Berat dalam kg
- **Tanggal** — Waktu transaksi

> Jika belum ada data traceability, akan tampil pesan: **"Informasi traceability belum tersedia untuk produk ini."**

---

## 5.4 Dampak Lingkungan

Bagian **Dampak Lingkungan** menampilkan dua metrik penting:

| Metrik | Ikon | Warna | Keterangan |
|--------|------|-------|------------|
| **Limbah Teralihkan** | ♻️ | Hijau | Total berat limbah yang berhasil dialihkan dari tempat pembuangan (kg) |
| **CO₂ Tersimpan** | 🌱 | Biru | Estimasi karbon yang berhasil disimpan dari proses daur ulang (kg) |

Nilai dihitung berdasarkan total berat bahan baku yang digunakan dalam produk.

---

## 5.5 Ulasan Pembeli

Bagian **Ulasan Pembeli** menampilkan review dari pembeli yang sudah membeli produk:

```
⭐ Ulasan Pembeli (4.5 ★ • 12 ulasan)              [Beri Ulasan]
```

### Melihat Ulasan

Setiap ulasan menampilkan:
- **Avatar** — Inisial pembeli (huruf pertama nama)
- **Nama** — Nama pembeli
- **Rating** — Bintang (1-5) berwarna kuning
- **Tanggal** — Tanggal ulasan dibuat
- **Komentar** — Teks ulasan

### Memberi Ulasan (Khusus Buyer yang Login)

1. Klik tombol **"Beri Ulasan"**
2. Dialog ulasan akan muncul:

   ```
   ┌──────────────────────────────────────┐
   │ Beri Ulasan                           │
   │                                       │
   │ Rating                                │
   │ [  5 ★ — Sangat Baik  ▼  ]           │
   │                                       │
   │ Komentar                              │
   │ [Bagikan pengalamanmu...          ]   │
   │ [                                  ]   │
   │                                       │
   │      [Batal]    [Kirim Ulasan]        │
   └──────────────────────────────────────┘
   ```

3. Pilih **rating** (1-5 bintang)
4. Tulis **komentar** (opsional)
5. Klik **"Kirim Ulasan"**
6. Notifikasi **"Ulasan berhasil dikirim!"** akan muncul

> ⭐ **Keterangan Rating:** 5 = Sangat Baik, 4 = Baik, 3 = Cukup, 2 = Kurang, 1 = Buruk

---

## 5.6 Wishlist

Fitur wishlist memungkinkan Anda menyimpan produk favorit:

- **Menambah ke Wishlist:** Klik ikon ❤️ di pojok kanan atas halaman detail produk
- **Menghapus dari Wishlist:** Klik ikon ❤️ (merah) yang sama
- **Melihat Wishlist:** Buka halaman Wishlist dari sidebar

> Fitur wishlist hanya tersedia untuk Buyer yang sudah login. Jika belum login, ikon heart tidak akan muncul.

---
➡️ **Lanjut ke [Bab 6: Keranjang Belanja](./06-bab-6-keranjang.md)**
