---
title: "Bab 6 — Pesanan & Penjualan"
---

# Bab 6: Pesanan & Penjualan

---

## 6.1 Pesanan Masuk

Halaman **Pesanan Masuk** menampilkan semua pesanan (*order*) yang dibuat oleh Generator untuk membeli kayu Anda.

![Pesanan Masuk](04-supplier-orders.png)
*Gambar 6.1 — Halaman pesanan masuk*

Setiap baris pesanan menampilkan:

| Kolom | Keterangan |
|-------|------------|
| **ID Pesanan** | Nomor unik pesanan |
| **Pembeli** | Nama Generator yang memesan |
| **Produk** | Jenis kayu yang dipesan |
| **Jumlah** | Volume yang dipesan |
| **Total** | Total harga pesanan |
| **Status** | Status terkini pesanan |

---

## 6.2 Status Pesanan

| Status | Badge | Arti | Aksi Supplier |
|--------|-------|------|---------------|
| ⏳ **Menunggu Pembayaran** | Kuning | Generator sudah pesan, menunggu pembayaran | Tunggu konfirmasi pembayaran |
| ✅ **Dibayar** | Hijau | Pembayaran sudah dikonfirmasi | Siapkan kayu untuk dikirim |
| 🚚 **Dikirim** | Biru | Kayu sedang dikirim ke Generator | — |
| 📦 **Diterima** | Hijau | Generator sudah menerima kayu | Transaksi selesai |
| ❌ **Dibatalkan** | Merah | Pesanan dibatalkan | — |

**Alur status pesanan:**

```
Generator pesan → Menunggu Bayar → Dibayar → Dikirim → Diterima
                                                      ↓
                                               Transaksi Selesai
```

---

## 6.3 Riwayat Penjualan

Halaman **Riwayat Penjualan** menampilkan seluruh transaksi yang telah selesai beserta ringkasan pendapatan.

![Riwayat Penjualan](05-supplier-sales.png)
*Gambar 6.2 — Halaman riwayat penjualan*

### Ringkasan Kartu

| Kartu | Menampilkan |
|-------|-------------|
| 💰 **Total Pendapatan** | Jumlah rupiah dari semua penjualan yang selesai |
| ✅ **Pesanan Selesai** | Jumlah transaksi dengan status `received` |
| 🔄 **Total Transaksi** | Total semua transaksi (termasuk pending) |

### Daftar Transaksi

Tabel riwayat transaksi menampilkan:

| Kolom | Keterangan |
|-------|------------|
| **Tanggal** | Waktu transaksi dibuat |
| **Pembeli** | Nama Generator |
| **Produk** | Jenis kayu yang dibeli |
| **Volume** | Volume kayu |
| **Total** | Jumlah pembayaran |
| **Status** | Status transaksi |

> **Jika belum ada penjualan:** Halaman akan menampilkan teks **"Belum ada data penjualan"** dan grafik akan kosong.

---

## 6.4 Grafik Penjualan

Di bagian atas halaman Riwayat Penjualan, terdapat **Grafik Penjualan per Bulan** yang menampilkan tren penjualan dalam bentuk diagram batang (*bar chart*).

**Fitur grafik:**
- **Sumbu X:** Bulan (Januari, Februari, ...)
- **Sumbu Y:** Jumlah penjualan dalam Rupiah
- **Bar:** Setiap batang mewakili total penjualan di bulan tersebut

Grafik akan otomatis terisi seiring bertambahnya transaksi yang selesai.

---
➡️ **Lanjut ke [Bab 7: Profil Supplier](./07-bab-7-profil.md)**
