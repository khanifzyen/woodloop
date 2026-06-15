---
title: "Bab 14 — Marketplace Furniture"
---

# Bab 14: Marketplace Furniture

---

Halaman **Furniture** adalah marketplace khusus untuk produk furniture yang dibuat langsung oleh Generator (pengrajin kayu). Berbeda dengan Marketplace Utama yang menampilkan produk upcycled dari Converter.

![Marketplace Furniture](../screenshots/22-buyer-marketplace.png)
*Gambar 14.1 — Halaman Marketplace Furniture*

---

## 14.1 Menjelajahi Produk Furniture

Produk furniture ditampilkan dalam bentuk grid kartu (2 kolom mobile, 4 kolom desktop):

| Elemen | Keterangan |
|--------|------------|
| **Foto** | Gambar utama produk (aspect ratio 4:3) |
| **Badge Kategori** | Label kategori (Furniture, Custom Order, dll) |
| **Nama Produk** | Nama produk furniture |
| **Harga** | Harga jual dalam Rupiah |
| **Nama Generator** | Nama pengrajin (klik untuk ke toko) |
| **Sold Count** | Jumlah terjual (ikon trending) |
| **Tombol + Keranjang** | Tambah ke keranjang furniture |

---

## 14.2 Kategori Produk

Tab kategori untuk menyaring produk berdasarkan jenis:

| Kategori | Deskripsi |
|----------|-----------|
| **Semua** | Menampilkan seluruh furniture |
| **Furniture** | Meja, kursi, lemari, tempat tidur, dll |
| **Custom Order** | Produk pesanan khusus |
| **Bahan Baku** | Material kayu mentah |
| **Lainnya** | Produk lainnya |

---

## 14.3 Pencarian & Filter

### Pencarian Teks
Ketik nama produk di kolom pencarian untuk mencari berdasarkan nama atau deskripsi.

### Filter Harga
Klik ikon Sliders untuk menyaring berdasarkan rentang harga.

### Urutkan
Dropdown sort mendukung: Terbaru, Terlaris (by sold_count), Termurah, Termahal.

---

## 14.4 Detail Produk Furniture

Klik pada produk untuk melihat detail lengkap:

- **Galeri Foto** — Foto produk dengan thumbnail
- **Harga & Stok** — Harga besar, jumlah stok, jumlah terjual
- **Jenis Kayu** — Informasi wood type (Jati, Mahoni, dll)
- **Deskripsi** — Cerita di balik produk
- **Kartu Generator** — Info penjual dengan link ke toko
- **Tombol + Keranjang** — Tambah ke furniture cart
- **Tombol Beli Langsung** — Langsung ke checkout

---

## 14.5 Toko Generator

Klik nama Generator (atau "Lihat Toko" di halaman detail) untuk melihat:

- **Profil Generator** — Nama, lokasi, kontak, status verifikasi
- **Semua produk** — Grid produk dari Generator tersebut
- **Tombol Hubungi** — Buka chat dengan Generator

---

## 14.6 Keranjang & Checkout Furniture

Furniture memiliki keranjang terpisah dari marketplace upcycled:

1. **Keranjang** (`/buyer/furniture/cart`) — Ubah jumlah, hapus item, lihat total
2. **Checkout** — Isi nama, telepon, alamat, pilih metode pembayaran
3. **Bayar** — Proses via Midtrans (QRIS/VA/Bank Transfer) atau Transfer Manual atau COD

Pembelian langsung (Beli Langsung) bypasses keranjang dan langsung ke checkout.

---

## 14.7 Pesanan Furniture

Halaman Pesanan Furniture (`/buyer/furniture/orders`) menampilkan:

- **Tab Filter** — Semua / Diproses / Dikirim / Selesai
- **Kartu Pesanan** — Foto, nama produk, jumlah × harga, status, tanggal
- **Detail Pesanan** — Timeline (Menunggu Bayar → Dibayar → Diproses → Dikirim → Selesai)
- **Batalkan** — Ketika status masih payment_pending / paid
- **Konfirmasi Diterima** — Ketika status shipped

---

➡️ **Lanjut ke [Bab 10: Scan QR Code](./10-bab-10-scan.md)**
