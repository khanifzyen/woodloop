---
title: "Bab 7 — Katalog Produk & QR Code"
---

# Bab 7: Katalog Produk & QR Code

---

Halaman **Katalog Produk** menampilkan semua produk upcycled yang sudah Anda buat. Dari halaman ini Anda dapat melihat, menghapus, dan melihat QR Code setiap produk.

![Katalog Produk](../screenshots/20-converter-catalog.png)
*Gambar 7.1 — Halaman Katalog Produk*

---

## 7.1 Katalog Produk

Produk ditampilkan dalam bentuk kartu grid (3 kolom). Setiap kartu menampilkan:

| Info pada Kartu | Keterangan |
|-----------------|------------|
| **Badge Status** | Active (hijau) atau Sold Out (abu-abu) |
| **Nama Produk** | Nama produk upcycled |
| **Kategori** | Furniture, Decor, Accessories, Art, atau Lainnya |
| **Stok** | Jumlah unit tersedia |
| **Harga** | Harga jual produk dalam Rupiah |
| **Tombol Edit** | ✏️ Ubah data produk |
| **Tombol QR** | 📱 Lihat QR Code traceability |
| **Ikon Hapus** | 🗑️ Hapus produk (pojok kanan) |

### Jika Belum Ada Produk

Halaman akan menampilkan pesan ajakan untuk membuat produk pertama:

```
┌──────────────────────────────────────────────┐
│                                              │
│                    📦                         │
│             Belum ada produk                  │
│      Buat produk upcycled pertama Anda        │
│                                              │
│              [Buat Produk]                    │
└──────────────────────────────────────────────┘
```

---

## 7.2 Status Produk

| Status | Badge | Kondisi | Arti |
|--------|-------|---------|------|
| **Active** | 🟢 Hijau | stok > 0 | Produk tampil di marketplace Buyer dan bisa dibeli |
| **Sold Out** | ⚪ Abu-abu | stok = 0 | Stok habis, produk masih tampil tapi tidak bisa dibeli |

---

## 7.3 QR Code Produk

Setiap produk otomatis mendapatkan **QR Code unik** saat dibuat. QR Code berisi ID unik dengan format `PRD-XXXXXXXX` yang tertaut ke halaman traceability publik di `/p/[qr_code_id]`.

**Cara melihat QR Code:**

1. Buka halaman **Katalog Produk**
2. Cari produk yang ingin dilihat QR Code-nya
3. Klik tombol **"QR"** pada kartu produk tersebut
4. Dialog QR Code akan muncul — menampilkan QR Code dalam ukuran besar
5. Dari dialog, Anda dapat:
   - **Melihat** QR Code dalam ukuran penuh
   - **Mengunduh** gambar QR Code
   - **Membagikan** tautan traceability

> **💡 Manfaat QR Code:**
> - **Transparansi** — Buyer dapat scan QR untuk melihat asal-usul bahan baku produk Anda (dari Supplier → Generator → Aggregator → Converter)
> - **Kepercayaan** — Produk dengan traceability lebih dipercaya pembeli
> - **SEO** — Halaman traceability muncul di hasil pencarian Google

---

## 7.4 Hapus Produk

1. Klik ikon **🗑️ (tong sampah)** di pojok kanan atas kartu produk
2. Konfirmasi akan diproses langsung
3. Notifikasi **"Produk dihapus"** akan muncul
4. Produk akan hilang dari katalog

> ⚠️ **Peringatan:** Penghapusan produk bersifat permanen dan tidak dapat dibatalkan.

---
➡️ **Lanjut ke [Bab 8: Membuat Produk Upcycled](./08-bab-8-membuat-produk.md)**
