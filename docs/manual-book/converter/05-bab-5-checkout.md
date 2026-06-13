---
title: "Bab 5 — Checkout & Pembelian"
---

# Bab 5: Checkout & Pembelian

---

Setelah menemukan bahan yang diinginkan, langkah selanjutnya adalah melakukan checkout dan pembelian.

---

## 5.1 Memulai Checkout

Dari halaman detail bahan, klik tombol **"Lanjut ke Checkout"** untuk masuk ke halaman checkout:

```
/converter/checkout?material=[id_bahan]
```

Halaman checkout terbagi menjadi dua kolom: **Ringkasan Pesanan** (kiri) dan **Detail Pembelian** (kanan).

---

## 5.2 Ringkasan Pesanan

Kolom kiri menampilkan ringkasan pesanan bahan yang akan dibeli:

| Informasi | Keterangan |
|-----------|------------|
| **Jenis Kayu** | Nama jenis kayu yang dipilih (badge) |
| **Bentuk** | Bentuk limbah |
| **Berat Tersedia** | Maksimal berat yang bisa dibeli |
| **Harga/kg** | Harga per kilogram |
| **Total** | Harga/kg × quantity (berubah sesuai input) |

---

## 5.3 Metode Pembayaran

Kolom kanan berisi form pembelian dengan field berikut:

| Field | Wajib | Keterangan |
|-------|:-----:|------------|
| **Quantity (kg)** | ✅ | Jumlah yang ingin dibeli (min 1, max sesuai stok) |
| **Metode Pembayaran** | ✅ | Pilih salah satu metode |

Tersedia tiga metode pembayaran:

| Metode | Keterangan |
|--------|------------|
| **Dompet Digital** | Pembayaran menggunakan saldo dompet WoodLoop |
| **Transfer Bank** | Pembayaran melalui transfer bank manual |
| **COD** | Bayar di tempat saat bahan diterima |

---

## 5.4 Konfirmasi Pembelian

Proses checkout dilakukan dengan langkah berikut:

1. Masukkan **jumlah** (kg) yang ingin dibeli — pastikan tidak melebihi stok
2. Pilih **metode pembayaran** yang diinginkan
3. Periksa **total harga** yang ditampilkan di kolom kiri
4. Klik tombol **"Bayar Rp [total]"**

Setelah berhasil:
- Notifikasi **"Transaksi berhasil dibuat!"** akan muncul
- Anda akan diarahkan ke halaman **Riwayat Transaksi**
- Transaksi baru akan muncul dengan status **Menunggu**

> **✅ Validasi:** Sistem akan memvalidasi bahwa quantity tidak melebihi stok tersedia. Harga total dihitung dari sisi server untuk mencegah manipulasi.

---
➡️ **Lanjut ke [Bab 6: Riwayat Transaksi](./06-bab-6-riwayat-transaksi.md)**
