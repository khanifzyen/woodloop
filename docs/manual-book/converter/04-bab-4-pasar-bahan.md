---
title: "Bab 4 — Pasar Bahan (Marketplace)"
---

# Bab 4: Pasar Bahan (Marketplace)

---

**Pasar Bahan** adalah marketplace tempat Converter membeli bahan limbah dari Aggregator. Bahan yang tersedia berasal dari inventory gudang Aggregator yang sudah di sortir dan siap dijual.

![Pasar Bahan](../screenshots/19-converter-marketplace-materials.png)
*Gambar 4.1 — Halaman Pasar Bahan*

---

## 4.1 Melihat Pasar Bahan

Setiap bahan ditampilkan dalam bentuk **kartu** berisi informasi lengkap:

| Info pada Kartu | Keterangan |
|-----------------|------------|
| **Badge Bentuk** | Bentuk limbah (Offcut Besar, Offcut Kecil, Serutan, Serbuk Gergaji) |
| **Badge Jenis Kayu** | Nama jenis kayu (Jati, Mahoni, Trembesi, dll) |
| **Berat Tersedia** | Jumlah stok dalam kg |
| **Harga/kg** | Harga per kilogram |
| **Total Harga** | Estimasi total (harga/kg × berat) |
| **Tombol Beli** | Klik untuk melihat detail dan checkout |

Klik kartu untuk membuka halaman detail bahan. Tombol **Beli** langsung mengarah ke halaman checkout.

---

## 4.2 Filter & Pencarian

Tersedia panel filter yang dapat dibuka dari pojok kanan halaman (ikon 🔧):

| Fitur | Fungsi |
|-------|--------|
| 🔍 **Pencarian** | Cari bahan berdasarkan jenis kayu atau bentuk |
| **Filter Jenis Kayu** | Tampilkan hanya jenis kayu tertentu (Jati, Mahoni, dll) |
| **Filter Bentuk** | Filter: Offcut Besar, Offcut Kecil, Serutan, Serbuk Gergaji |
| **Filter Harga Min** | Harga minimum per kg |
| **Filter Harga Max** | Harga maksimum per kg |
| **Urutkan** | Terbaru, Termurah, Termahal |
| **Reset** | Kembalikan semua filter ke default |

> **💡 Tips:** Gunakan pencarian dan filter untuk menemukan bahan yang sesuai dengan kebutuhan produksi Anda.

---

## 4.3 Detail Bahan

Halaman detail bahan (`/converter/marketplace/materials/[id]`) menampilkan informasi lengkap dalam dua kolom:

### Kolom Kiri: Detail Bahan

| Informasi | Keterangan |
|-----------|------------|
| **Jenis Kayu** | Nama jenis kayu |
| **Bentuk** | Bentuk limbah |
| **Berat** | Berat tersedia dalam kg |
| **Harga/kg** | Harga per kilogram dalam Rupiah |
| **Aggregator** | Nama penjual |

### Kolom Kanan: Pembelian

Menampilkan:
- **Harga/kg** — Dalam Rupiah
- **Berat tersedia** — Badge informasi stok
- **Tombol "Lanjut ke Checkout"** — Mengarah ke halaman checkout dengan parameter material yang dipilih

---
➡️ **Lanjut ke [Bab 5: Checkout & Pembelian](./05-bab-5-checkout.md)**
