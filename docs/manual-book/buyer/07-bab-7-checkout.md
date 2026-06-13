---
title: "Bab 7 — Checkout & Pembayaran"
---

# Bab 7: Checkout & Pembayaran

---

Halaman **Checkout** adalah tempat Anda menyelesaikan pembelian. Di sini Anda mengisi alamat pengiriman, memilih metode pembayaran, dan melakukan pembayaran.

![\1](../screenshots/\2)
*Gambar 7.1 — Halaman checkout*

---

## 7.1 Ringkasan Pesanan

Di bagian atas halaman checkout, Anda akan melihat ringkasan pesanan:

```
┌──────────────────────────────────────────────┐
│ Ringkasan Pesanan                             │
│                                               │
│ Vas Bunga Jati   × 1          Rp 50.000       │
│ Meja Kayu Mahoni × 1          Rp 200.000      │
│ ────────────────────────────────────────────  │
│ Total                           Rp 250.000    │
└──────────────────────────────────────────────┘
```

Setiap item menampilkan:
- **Nama Produk** — Nama produk yang dibeli
- **Jumlah (× N)** — Quantity item
- **Subtotal** — Harga × jumlah

---

## 7.2 Alamat Pengiriman

Form alamat pengiriman terdiri dari beberapa field:

| Field | Wajib | Contoh |
|-------|:-----:|--------|
| **Nama Penerima** | ✅ | "Budi Santoso" |
| **Telepon** | ❌ | "08123456789" |
| **Alamat Lengkap** | ✅ | "Jl. Sudirman No. 123, Jepara, Jawa Tengah 59431" |
| **Catatan** | ❌ | "Tolong dibungkus rapih" |

> Field yang wajib diisi ditandai dengan tanda bintang merah (*). Jika tidak diisi, akan muncul pesan error.

---

## 7.3 Metode Pembayaran

Pilih metode pembayaran dari dropdown:

| Metode | Keterangan |
|--------|------------|
| **QRIS / Virtual Account / Bank Transfer** | Pembayaran online melalui Midtrans — menerima QRIS, Virtual Account (BCA, Mandiri, BNI, BRI), dan Bank Transfer |
| **Transfer Bank Manual** | Pembayaran melalui transfer bank manual ke rekening WoodLoop |
| **COD** | Bayar di tempat (Cash on Delivery) |

---

## 7.4 Melakukan Pembayaran

Setelah semua field terisi:

1. Periksa kembali **ringkasan pesanan** dan **total harga**
2. Klik tombol **"Bayar Rp [total]"** di bagian bawah halaman
3. Tunggu proses (tombol akan berubah menjadi **"Memproses..."**)

### Jika Memilih Midtrans (QRIS / VA / Bank Transfer):

Setelah klik bayar:
1. Sistem akan membuat pesanan dan mendapatkan token pembayaran
2. Popup Midtrans Snap akan terbuka secara otomatis
3. Pilih metode pembayaran di popup Midtrans:
   - **QRIS** — Scan QR code dengan aplikasi pembayaran (GoPay, OVO, ShopeePay, dll)
   - **Virtual Account** — Transfer ke nomor VA yang ditampilkan
   - **Bank Transfer** — Transfer ke rekening bank
4. Lakukan pembayaran sesuai instruksi di popup
5. Setelah berhasil, Anda akan diarahkan ke halaman **Pesanan Saya**

### Jika Memilih Transfer Manual atau COD:

Setelah klik bayar:
1. Pesanan akan langsung dibuat
2. Notifikasi **"Pesanan berhasil dibuat!"**
3. Anda akan diarahkan ke halaman **Pesanan Saya**
4. Untuk transfer manual, lakukan transfer ke rekening yang ditentukan dan konfirmasi ke penjual

---

## 7.5 Pembelian Langsung

Selain dari keranjang, Anda juga bisa melakukan pembelian langsung dari halaman detail produk:

1. Buka halaman detail produk
2. Klik tombol **"Beli Langsung"**
3. Anda akan diarahkan ke halaman checkout dengan produk tersebut sebagai satu-satunya item
4. Isi alamat dan pilih metode pembayaran
5. Klik **"Bayar Rp [total]"**

> Pada pembelian langsung, keranjang tidak akan terpengaruh — item di keranjang tetap ada.

---
➡️ **Lanjut ke [Bab 8: Pesanan & Pelacakan](./08-bab-8-pesanan.md)**
