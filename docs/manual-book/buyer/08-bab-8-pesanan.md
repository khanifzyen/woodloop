---
title: "Bab 8 — Pesanan & Pelacakan"
---

# Bab 8: Pesanan & Pelacakan

---

Halaman **Pesanan Saya** menampilkan semua pesanan yang telah Anda buat. Dari sini Anda dapat melacak status pengiriman, membatalkan pesanan, dan mengonfirmasi penerimaan.

![\1](../screenshots/\2)
*Gambar 8.1 — Halaman daftar pesanan*

---

## 8.1 Daftar Pesanan Saya

Setiap pesanan ditampilkan dalam bentuk kartu:

| Elemen | Keterangan |
|--------|------------|
| **Foto Produk** | Thumbnail produk (56x56 px) |
| **Nama Produk** | Nama produk yang dibeli |
| **Jumlah & Harga** | Quantity × total harga |
| **Badge Status** | Status terkini pesanan dengan warna |
| **Tanggal** | Tanggal pesanan dibuat |

Kartu dapat diklik untuk membuka halaman detail pesanan.

---

## 8.2 Filter Status Pesanan

Tab filter memungkinkan Anda menyaring pesanan berdasarkan status:

| Tab | Menampilkan |
|-----|-------------|
| **Semua** | Seluruh pesanan Anda |
| **Diproses** | Pesanan yang sedang diproses penjual |
| **Dikirim** | Pesanan dalam perjalanan |
| **Selesai** | Pesanan yang sudah diterima |

---

## 8.3 Detail Pesanan

Halaman detail pesanan menampilkan informasi lengkap:

```
Detail Pesanan
#a1b2c3d4
```

Informasi yang ditampilkan:

| Informasi | Keterangan |
|-----------|------------|
| **ID Pesanan** | Kode unik (8 karakter pertama) |
| **Nama Produk** | Produk yang dibeli |
| **Jumlah** | Quantity item |
| **Total Harga** | Total pembayaran |
| **Status** | Status terkini (badge) |
| **Alamat Pengiriman** | Alamat yang diisi saat checkout |

---

## 8.4 Timeline Status Pesanan

Halaman detail menampilkan **timeline visual** status pesanan:

```
◉ Menunggu Bayar     (aktif jika status payment_pending)
│
◉ Dibayar            (aktif jika status paid)
│
◉ Diproses           (aktif jika status processing)
│
◉ Dikirim            (aktif jika status shipped)
│
◉ Selesai            (aktif jika status received)
```

- Lingkaran **terisi** (◉) = status sudah tercapai
- Lingkaran **kosong** (○) = status belum tercapai
- Garis **berwarna** = alur yang sudah dilalui
- Setiap langkah memiliki ikon yang sesuai (💳, ✅, 📦, 🚚, ✅)

### Status dan Artinya

| Status | Arti |
|--------|------|
| **Menunggu Bayar** | Pesanan dibuat, menunggu pembayaran |
| **Dibayar** | Pembayaran sudah dikonfirmasi |
| **Diproses** | Penjual sedang memproses pesanan |
| **Dikirim** | Pesanan sedang dalam perjalanan |
| **Selesai** | Pesanan sudah diterima ✅ |
| **Dibatalkan** | Pesanan dibatalkan |

### Status Dibatalkan

Jika pesanan dibatalkan, timeline tidak ditampilkan. Sebagai gantinya:

```
❌ Pesanan Dibatalkan
   Alasan: [alasan pembatalan]
```

---

## 8.5 Membatalkan Pesanan

Pesanan dapat dibatalkan jika status masih **Menunggu Bayar** atau **Dibayar**:

1. Buka halaman detail pesanan
2. Klik tombol **"Batalkan Pesanan"**
3. Dialog konfirmasi akan muncul:

   ```
   ┌──────────────────────────────────────┐
   │ Batalkan Pesanan?                     │
   │                                       │
   │ Pesanan yang dibatalkan tidak bisa    │
   │ dikembalikan.                         │
   │                                       │
   │ Alasan pembatalan                     │
   │ [                                  ]  │
   │ [                                  ]  │
   │                                       │
   │    [Tutup]    [Ya, Batalkan]          │
   └──────────────────────────────────────┘
   ```

4. Masukkan **alasan pembatalan** (opsional)
5. Klik **"Ya, Batalkan"**
6. Notifikasi **"Pesanan dibatalkan"** akan muncul

> **Catatan:** Pesanan dengan status **Diproses, Dikirim, Selesai, atau Dibatalkan** tidak bisa dibatalkan lagi.

---

## 8.6 Konfirmasi Pesanan Diterima

Jika pesanan sudah berstatus **Dikirim**, Anda dapat mengonfirmasi bahwa pesanan sudah diterima:

1. Buka halaman detail pesanan
2. Klik tombol **"Pesanan Diterima"**
3. Notifikasi **"Pesanan telah diterima"** akan muncul
4. Status pesanan berubah menjadi **Selesai**

> Setelah mengonfirmasi penerimaan, Anda dapat memberikan ulasan untuk produk tersebut dari halaman detail produk.

---

## 8.7 Hubungi Penjual

Jika ada pertanyaan atau masalah dengan pesanan, Anda dapat menghubungi penjual:

1. Buka halaman detail pesanan
2. Klik tombol **"Hubungi Penjual"**
3. Anda akan diarahkan ke halaman **Chat** dengan penjual tersebut

---
➡️ **Lanjut ke [Bab 9: Wishlist](./09-bab-9-wishlist.md)**
