---
title: "Bab 5 — Panduan Generator"
---

# Bab 5: Panduan Generator (Penghasil Limbah)

---

**Generator** adalah pihak yang **menghasilkan limbah kayu** dari proses produksi mebel atau penggergajian. Generator adalah **sumber utama limbah** yang bisa diolah kembali.

**Contoh pengguna Generator:** Pengrajin mebel, pemilik sawmill, workshop kayu.

---

## 5.1 Dashboard Generator

![Dashboard Generator](screenshots/10-generator-dashboard.png)
*Gambar 5.1 — Dashboard Generator*

| Kartu | Menampilkan |
|-------|-------------|
| **Saldo Dompet** | Saldo dari penjualan limbah |
| **Limbah Disetor** | Total limbah yang sudah disetor |
| **Produk Aktif** | Jumlah produk generator aktif |
| **Tawaran Masuk** | Jumlah bidding dari Aggregator |

**Menu Cepat:**

| Tombol | Fungsi | Navigasi |
|--------|--------|----------|
| **Setor Limbah** | Mulai proses setor limbah | `/generator/report-waste` |
| **Beli Kayu** | Cari dan beli kayu dari Supplier | `/generator/buy-timber` |

---

## 5.2 Setor Limbah

Fitur utama Generator — melaporkan limbah kayu yang ingin dijual. Proses **4 langkah**:

### Langkah 1: Foto Limbah

Ambil foto limbah dari beberapa sudut. Minimal 1 foto, maksimal 5 foto.

### Langkah 2: Jenis & Bentuk Limbah

| Field | Contoh |
|-------|--------|
| **Jenis Kayu** | Jati, Mahoni, Sono Keling |
| **Bentuk Limbah** | Offcut besar/kecil, Shaving, Sawdust, Logs end |
| **Kondisi** | Kering, Basah, Berminyak, Campuran |

### Langkah 3: Volume & Harga

| Field | Contoh |
|-------|--------|
| **Volume** | 50 |
| **Satuan** | kg, m³, karung, pickup |
| **Estimasi Harga** | Rp 50.000 |
| **Deskripsi** | Limbah potongan kursi, ukuran 10-20cm |

### Langkah 4: Konfirmasi & Kirim

Periksa ringkasan data, lalu klik **"Setor Limbah"**. Limbah akan muncul di daftar yang bisa dilihat oleh Aggregator.

---

## 5.3 Beli Kayu Mentah

Generator bisa **membeli kayu mentah** dari Supplier untuk bahan baku produksi.

![Beli Kayu](screenshots/12-generator-buy-timber.png)
*Gambar 5.2 — Halaman beli kayu mentah*

**Fitur halaman:**
- **Pencarian** — cari berdasarkan jenis atau kata kunci
- **Filter Jenis Kayu** — tampilkan jenis kayu tertentu
- **Filter Harga** — range harga min - maks

**Proses pemesanan:**
1. Cari kayu yang diinginkan
2. Klik **"Pesan Sekarang"**
3. Sistem membuat pesanan dengan status **Menunggu Pembayaran**
4. Lakukan pembayaran ke Supplier
5. Supplier memproses pengiriman

---

## 5.4 Mengelola Pesanan Kayu

| Status | Arti |
|--------|------|
| **Menunggu Bayar** | Pesanan dibuat, belum dibayar |
| **Dibayar** | Pembayaran dikonfirmasi |
| **Dikirim** | Kayu sedang dikirim Supplier |
| **Diterima** | Kayu sudah sampai |
| **Dibatalkan** | Pesanan dibatalkan |

Pesanan dengan status **"Menunggu Bayar"** bisa dibatalkan sendiri. Pesanan yang sudah dibayar — hubungi Supplier via Chat.

---

## 5.5 Produk Saya

Generator juga bisa mendaftarkan **produk kayu/mebel** yang dijual sendiri.

### Menambahkan Produk Baru

| Field | Wajib | Keterangan |
|-------|:-----:|------------|
| Nama Produk | ✅ | "Meja Jati Minimalis" |
| Kategori | ✅ | Meja, Kursi, Dekorasi, dll |
| Jenis Kayu | ✅ | Jati, Mahoni, dll |
| Harga | ✅ | Dalam Rupiah |
| Stok | ✅ | Jumlah unit tersedia |
| Deskripsi | ❌ | Cerita tentang produk |
| Foto | ✅ | Minimal 1 foto |

Klik **"Simpan"** setelah semua field terisi.

---
➡️ **Lanjut ke [Bab 6: Panduan Aggregator](./06-bab-6-aggregator.md)**
