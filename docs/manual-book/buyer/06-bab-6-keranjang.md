---
title: "Bab 6 — Keranjang Belanja"
---

# Bab 6: Keranjang Belanja

---

Halaman **Keranjang Belanja** menampilkan semua produk yang telah Anda tambahkan untuk dibeli. Keranjang disimpan secara otomatis di browser (localStorage) dan disinkronkan ke akun Anda, sehingga tidak akan hilang meskipun Anda menutup browser.

![\1](../screenshots/\2)
*Gambar 6.1 — Halaman keranjang belanja*

---

## 6.1 Melihat Keranjang

**Cara membuka keranjang:**
1. Klik ikon **🛒 Keranjang** di halaman Marketplace
2. Atau buka langsung: `/buyer/cart`

Halaman keranjang menampilkan:
- **Judul** — "Keranjang" dengan jumlah item
- **Daftar Item** — Setiap item dalam kartu terpisah
- **Total Keseluruhan** — Di bagian bawah

Setiap item dalam keranjang menampilkan:

| Elemen | Keterangan |
|--------|------------|
| **Foto** | Thumbnail produk (64x64 px) |
| **Nama Produk** | Nama produk (truncate jika panjang) |
| **Harga Satuan** | Harga per item |
| **Jumlah (Quantity)** | Jumlah yang akan dibeli (dengan tombol +/-) |
| **Subtotal** | Harga × jumlah |
| **Tombol Hapus** | 🗑️ Hapus item dari keranjang |

---

## 6.2 Mengubah Jumlah Item

Anda dapat mengubah jumlah item langsung di halaman keranjang:

```
[➖] [  2  ] [➕]     Rp 60.000
```

- Klik **➖ (Minus)** — mengurangi jumlah (minimal 1)
- Klik **➕ (Plus)** — menambah jumlah
- Jumlah dan subtotal akan berubah secara real-time

---

## 6.3 Menghapus Item

Untuk menghapus item dari keranjang:
1. Klik ikon **🗑️ (Tempat Sampah)** pada item yang ingin dihapus
2. Item akan langsung terhapus tanpa konfirmasi
3. Total dan jumlah item akan diperbarui otomatis

---

## 6.4 Total Belanja

Di bagian bawah halaman, terdapat ringkasan total belanja:

```
Total (3 item)
Rp 150.000

        [Checkout]
```

- **Total (N item)** — Jumlah seluruh item dalam keranjang
- **Total Harga** — Jumlah seluruh subtotal item
- **Tombol Checkout** — Lanjut ke halaman pembayaran

> Tombol **Checkout** hanya aktif jika keranjang tidak kosong.

---

## 6.5 Kondisi Keranjang Kosong

Jika keranjang masih kosong, halaman akan menampilkan:

```
🛒
Keranjang masih kosong
Jelajahi marketplace untuk menemukan produk

        [Lihat Marketplace]
```

Klik tombol **"Lihat Marketplace"** untuk kembali berbelanja.

---
➡️ **Lanjut ke [Bab 7: Checkout & Pembayaran](./07-bab-7-checkout.md)**
