---
title: "Bab 9 — Panduan Desainer"
---

# Bab 9: Panduan Desainer (Konsultan Desain Sirkular)

---

**Desainer** adalah konsultan desain sirkular — pihak yang memberikan saran desain, menulis artikel tentang prinsip sirkular, dan menyediakan jasa konsultasi desain berbayar kepada Generator dan Converter.

**Contoh pengguna Desainer:** Konsultan desain produk, akademisi desain, praktisi ekonomi sirkular, desainer furnitur.

---

## 9.1 Dashboard Desainer

Dashboard Desainer menampilkan ringkasan aktivitas desain Anda — total artikel, artikel yang terbit, catatan desain, dan konsultasi yang terbuka.

![Dashboard Desainer](screenshots/27-designer-dashboard.png)
*Gambar 9.1 — Dashboard Desainer*

**Ringkasan Kartu:**
| Kartu | Menampilkan |
|---|---|
| Total Artikel | Jumlah seluruh artikel sirkular yang dibuat |
| Artikel Terbit | Artikel yang sudah dipublikasikan |
| Catatan Desain | Jumlah catatan/saran desain yang diberikan |
| Konsultasi Terbuka | Jumlah permintaan konsultasi yang masih terbuka |

**Menu Cepat:**
| Tombol | Tujuan | Fungsi |
|---|---|---|
| Tulis Artikel Baru | `/designer/articles` | Buat artikel baru |
| Artikel Sirkular | `/designer/articles` | Kelola artikel |
| Catatan Desain | `/designer/design-notes` | Beri saran desain |
| Klinik Desain | `/designer/design-clinic` | Marketplace konsultasi |

---

## 9.2 Artikel Sirkular

Halaman **Artikel Sirkular** digunakan untuk menulis dan mengelola artikel edukasi tentang prinsip desain sirkular. Artikel bersifat publik — dapat dibaca oleh semua pengguna WoodLoop.

### 9.2.1 Membuat Artikel Baru

Klik tombol **"Artikel Baru"** untuk membuka form pembuatan artikel.

**Field yang tersedia:**
| Field | Wajib | Deskripsi |
|---|---|---|
| Judul | Ya | Judul artikel |
| Slug | Ya | URL slug (otomatis atau manual) |
| Konten | Ya | Isi artikel (teks kaya / markdown) |
| Ekscerpt | Tidak | Ringkasan singkat artikel |
| Kategori | Ya | Kategori prinsip sirkular (lihat tabel di bawah) |
| Sampul | Tidak | Gambar sampul artikel (maks 1 file) |
| Tags | Tidak | Tag dipisah koma |
| Terbitkan | Tidak | Toggle publikasi (default: draf) |

**Kategori Artikel Sirkular:**
| Kategori | Arti |
|---|---|
| `dematerialization` | Dematerialisasi — mengurangi jumlah material |
| `design_for_disassembly` | Desain untuk dibongkar |
| `product_longevity` | Ketahanan produk |
| `upcycling` | Daur ulang kreatif (upcycling) |
| `general` | Umum |

### 9.2.2 Mengelola Artikel

Daftar artikel menampilkan: judul, kategori, status (Terbit/Draf), dan tombol aksi:

| Tombol | Fungsi |
|---|---|
| 👁️ / 👁️‍🗨️ | Toggle publikasi (terbit/tarik) |
| ✏️ Edit | Buka form edit artikel |
| 🗑️ Hapus | Hapus artikel (dengan konfirmasi) |

<div class="warning-box">
  <strong>Penting:</strong> Artikel yang sudah terbit akan langsung terlihat oleh semua pengguna. Pastikan konten sudah final sebelum menerbitkan.
</div>

---

## 9.3 Catatan Desain

Halaman **Catatan Desain** digunakan untuk memberikan saran desain pada produk milik Generator atau Converter. Catatan bisa bersifat publik (terlihat di profil) atau privat.

### 9.3.1 Membuat Catatan Baru

Klik tombol **"Catatan Baru"** untuk membuka form.

**Field yang tersedia:**
| Field | Wajib | Deskripsi |
|---|---|---|
| Target | Ya | Pilih tipe target: Produk Generator atau Produk Converter |
| ID Produk | Ya | ID produk target |
| Konten | Ya | Catatan desain / saran |
| Sketsa | Tidak | Gambar sketsa pendukung (maks 3 file) |
| Publik | Tidak | Toggle visibilitas publik (default: publik) |

### 9.3.2 Daftar Catatan

Setiap catatan menampilkan: tipe target, konten (ringkasan), status publik/privat, tanggal, dan jumlah sketsa.

---

## 9.4 Klinik Desain

Halaman **Klinik Desain** adalah marketplace jasa konsultasi desain sirkular. Desainer dapat menerima permintaan dari Generator/Converter (client_request) atau membuat penawaran jasa (designer_offer).

### 9.4.1 Status Konsultasi

| Status | Arti |
|---|---|
| Terbuka | Permintaan/penawaran baru, belum ada kesepakatan |
| Negosiasi | Sedang dalam proses negosiasi harga |
| Berjalan | Konsultasi sedang berlangsung |
| Selesai | Konsultasi telah selesai |
| Dibatalkan | Konsultasi dibatalkan |

### 9.4.2 Tipe Konsultasi

| Tipe | Deskripsi |
|---|---|
| Permintaan Klien | Generator/Converter mengajukan permintaan desain |
| Penawaran Desainer | Desainer memasang tarif jasa konsultasi |

### 9.4.3 Resep Desain (Design Recipes)

Selain konsultasi, Desainer juga dapat menulis **Resep Desain** — inspirasi dan panduan untuk mengubah limbah kayu menjadi produk bernilai. Resep ini dibagikan melalui menu **"Resep Desain"** di halaman Klinik Desain.

Resep Desain mencakup:
- Judul dan deskripsi
- Jenis kayu yang cocok
- Bentuk limbah yang sesuai
- Foto hasil jadi
- Tingkat kesulitan (Mudah/Sedang/Sulit)

> **Catatan:** Converter dan Enabler juga dapat menulis Resep Desain. Menu Klinik Desain di role Converter otomatis mengarahkan ke halaman ini di role Desainer.

---

## 9.5 Ringkasan Bab

| Fitur | Halaman | Deskripsi |
|---|---|---|
| Dashboard | `/designer/dashboard` | Ringkasan artikel & catatan |
| Artikel Sirkular | `/designer/articles` | CRUD artikel prinsip sirkular |
| Catatan Desain | `/designer/design-notes` | Saran desain pada produk |
| Klinik Desain | `/designer/design-clinic` | Marketplace konsultasi desain |
| Resep Desain | `/designer/design-clinic/recipes` | Inspirasi produk daur ulang |

---
➡️ **Lanjut ke [Bab 10: Panduan Enabler](./10-bab-10-enabler.md)**
