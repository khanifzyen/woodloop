---
title: "Bab 8 — Membuat Produk Upcycled"
---

# Bab 8: Membuat Produk Upcycled

---

Fitur utama Converter — mendaftarkan produk upcycled baru yang terhubung dengan bahan baku yang sudah dibeli untuk keperluan traceability.

---

## 8.1 Form Produk Baru

Klik tombol **"Buat Produk"** di halaman Katalog Produk atau Dashboard untuk membuka form di `/converter/catalog/new`.

Form terdiri dari dua bagian: **Informasi Produk** dan **Source Materials**.

### Informasi Produk

| Field | Tipe | Wajib | Contoh |
|-------|------|:-----:|--------|
| **Nama Produk** | Text | ✅ | "Vas Bunga dari Limbah Jati" |
| **Kategori** | Dropdown | ✅ | Furniture, Decor, Accessories, Art, Lainnya |
| **Harga (Rp)** | Angka | ✅ | 150000 |
| **Stok** | Angka | ❌ | 10 (default: 1) |
| **Deskripsi** | Textarea | ❌ | Cerita tentang produk & bahan |

---

## 8.2 Source Materials untuk Traceability

Bagian **Source Materials** memungkinkan Anda menghubungkan produk dengan transaksi pembelian bahan yang sudah dilakukan. Ini penting untuk fitur **traceability** — Buyer bisa melihat asal-usul bahan produk Anda dari hulu ke hilir.

**Cara menghubungkan:**
1. Centang ✅ transaksi pembelian bahan yang relevan dengan produk ini
2. Hanya transaksi dengan status **paid** atau **received** yang ditampilkan
3. Anda dapat memilih lebih dari satu transaksi
4. Source materials bersifat **opsional** — jika belum ada transaksi, bagian ini akan menampilkan pesan "Belum ada transaksi"

Setiap transaksi yang bisa dipilih menampilkan:
- **Total harga** — Jumlah pembelian
- **Tanggal** — Tanggal transaksi

> **💡 Tips:** Semakin lengkap data source materials, semakin kuat cerita traceability produk Anda di mata Buyer. Hubungkan setiap produk dengan transaksi bahan yang relevan.

---

## 8.3 Kategori Produk

Kategori membantu Buyer menemukan produk Anda dengan mudah:

| Kategori | Contoh Produk |
|----------|--------------|
| **Furniture** | Meja, kursi, lemari, rak buku |
| **Decor** | Vas, hiasan dinding, lampu hias |
| **Accessories** | Jam tangan, gelang, tas, dompet |
| **Art** | Patung, lukisan kayu, instalasi seni |
| **Lainnya** | Produk lain yang tidak masuk kategori di atas |

---

## 8.4 Edit Produk

Untuk mengubah data produk yang sudah ada, buka halaman edit di `/converter/catalog/[id]/edit`.

**Cara mengakses:**
1. Buka halaman **Katalog Produk**
2. Klik tombol **"Edit"** pada kartu produk yang ingin diubah
3. Anda akan diarahkan ke halaman edit

**Field yang bisa diubah:**
- **Nama Produk** — Ubah nama produk
- **Kategori** — Ganti kategori produk
- **Harga** — Sesuaikan harga jual
- **Stok** — Update jumlah unit
- **Deskripsi** — Edit cerita produk

**Langkah edit:**
1. Ubah field yang diperlukan
2. Klik **"Simpan Perubahan"**
3. Notifikasi **"Produk berhasil diperbarui!"** akan muncul
4. Anda akan diarahkan kembali ke Katalog Produk

---
➡️ **Lanjut ke [Bab 9: Klinik Desain](./09-bab-9-klinik-desain.md)**
