---
title: "Bab 4 — Artikel Sirkular"
---

# Bab 4: Artikel Sirkular

---

Halaman **Artikel Sirkular** adalah pusat untuk menulis dan mengelola artikel edukasi tentang prinsip desain sirkular. Artikel bersifat **publik** — bisa dibaca oleh siapa saja, termasuk Buyer, Generator, dan Converter.

![Artikel Sirkular](02-desainer-articles.png)
*Gambar 4.1 — Halaman daftar artikel sirkular*

---

## 4.1 Melihat Daftar Artikel

Setiap artikel ditampilkan dalam bentuk kartu berisi informasi:

| Informasi | Keterangan |
|-----------|------------|
| **Kategori** | Badge kategori artikel (Dematerialisasi, dll) |
| **Status** | 📢 Terbit (hijau) atau 📝 Draf (abu-abu) |
| **Judul** | Nama artikel |
| **Excerpt** | Ringkasan singkat artikel (jika ada) |

**Tombol Aksi pada Setiap Artikel:**

| Tombol | Fungsi |
|--------|--------|
| 👁️ / 👁️‍🗨️ | Toggle publikasi (terbit/tarik) |
| ✏️ | Edit artikel |
| 🗑️ | Hapus artikel (merah) |

---

## 4.2 Membuat Artikel Baru

Klik tombol **"Artikel Baru"** di pojok kanan atas halaman untuk membuka form artikel baru di `/designer/articles/new`.

### Form Artikel Baru

| Field | Wajib | Deskripsi |
|-------|:-----:|-----------|
| **Judul** | ✅ | Judul artikel yang menarik dan informatif |
| **Konten** | ✅ | Isi artikel — gunakan editor teks kaya |
| **Kategori** | ✅ | Pilih salah satu kategori artikel |
| **Excerpt** | ❌ | Ringkasan singkat (tampil di daftar) |
| **Gambar Sampul** | ❌ | Gambar sampul artikel |
| **Tags** | ❌ | Tag dipisah koma untuk pencarian |

### Menyimpan Artikel

| Tombol | Fungsi |
|--------|--------|
| **"Simpan sebagai Draf"** | Menyimpan tanpa publikasi |
| **"Terbitkan"** | Langsung publikasikan artikel |

> **📝 Catatan:** Artikel yang disimpan sebagai draf hanya bisa dilihat oleh Anda. Publikasikan setelah siap dibaca publik.

---

## 4.3 Kategori Artikel

| Kategori | Label Indonesia | Deskripsi |
|----------|----------------|-----------|
| `dematerialization` | Dematerialisasi | Mengurangi penggunaan material dalam desain |
| `design_for_disassembly` | Desain untuk Dibongkar | Produk yang mudah dibongkar untuk didaur ulang |
| `product_longevity` | Ketahanan Produk | Prinsip keawetan dan ketahanan produk |
| `upcycling` | Upcycling | Mengolah limbah menjadi produk bernilai lebih |
| `general` | Umum | Artikel umum tentang desain sirkular |

---

## 4.4 Mempublikasikan & Menarik Artikel

### Mempublikasikan (Draf → Terbit)

1. Cari artikel dengan status **Draf**
2. Klik tombol 👁️ (publikasikan)
3. Status berubah menjadi **Terbit** dengan badge hijau
4. Artikel kini bisa dibaca publik

### Menarik Artikel (Terbit → Draf)

1. Cari artikel dengan status **Terbit**
2. Klik tombol 👁️‍🗨️ (tarik dari publikasi)
3. Status berubah menjadi **Draf**
4. Artikel tidak lagi tampil untuk publik

> **⚠️ Perhatian:** Menarik artikel tidak menghapus data. Artikel tetap tersimpan sebagai draf dan bisa dipublikasikan kembali kapan saja.

---

## 4.5 Edit Artikel

1. Klik tombol ✏️ pada kartu artikel yang ingin diedit
2. Anda akan diarahkan ke halaman edit: `/designer/articles/[id]/edit`
3. Form edit menampilkan data artikel yang sudah ada
4. Ubah field yang diinginkan (judul, konten, kategori, dll)
5. Klik **"Simpan"** untuk menyimpan perubahan
6. Notifikasi **"Artikel berhasil diperbarui"** akan muncul

---

## 4.6 Hapus Artikel

1. Klik ikon 🗑️ (merah) pada kartu artikel
2. Konfirmasi penghapusan (tidak ada dialog konfirmasi terpisah)
3. Notifikasi **"Artikel berhasil dihapus"** akan muncul
4. Artikel langsung terhapus dari daftar

> **⚠️ Perhatian:** Penghapusan artikel bersifat permanen dan tidak dapat dibatalkan.

---
➡️ **Lanjut ke [Bab 5: Catatan Desain](./05-bab-5-catatan-desain.md)**
