---
title: "Bab 6 — Klinik Desain"
---

# Bab 6: Klinik Desain

---

**Klinik Desain** adalah marketplace jasa konsultasi desain sirkular. Di halaman ini, Desainer dapat melihat permintaan konsultasi dari Generator/Converter, serta membuat penawaran jasa desain. Generator dan Converter juga dapat mengakses Klinik Desain melalui menu mereka masing-masing untuk mencari dan menghubungi Desainer.

![Klinik Desain](04-desainer-design-clinic.png)
*Gambar 6.1 — Halaman Klinik Desain*

---

## 6.1 Ringkasan Statistik

Empat kartu statistik di bagian atas halaman:

| Kartu | Ikon | Menampilkan |
|-------|------|-------------|
| **Total** | 💬 | Jumlah seluruh konsultasi |
| **Terbuka** | 🕐 | Konsultasi dengan status open (hijau) |
| **Berjalan** | 💰 | Konsultasi yang sedang berlangsung (kuning) |
| **Selesai** | 🏪 | Konsultasi yang sudah selesai (biru) |

---

## 6.2 Daftar Konsultasi

Setiap konsultasi ditampilkan dalam bentuk kartu:

| Informasi | Keterangan |
|-----------|------------|
| **Status** | Badge status berwarna (Terbuka, Negosiasi, Berjalan, Selesai, Dibatalkan) |
| **Tipe** | "Permintaan Klien" atau "Penawaran Desainer" |
| **Judul** | Judul permintaan atau penawaran |
| **Deskripsi** | Penjelasan kebutuhan desain (maks 2 baris) |
| **Budget** | Anggaran/tarif dalam Rupiah (jika ada) |
| **Tanggal** | Tanggal pembuatan konsultasi |
| **Klien** | Nama klien (Generator/Converter) yang mengajukan |

---

## 6.3 Status Konsultasi

Setiap konsultasi memiliki status yang menunjukkan tahapannya:

| Status | Label | Arti |
|--------|-------|------|
| `open` | Terbuka | Permintaan/penawaran baru, belum ada kesepakatan |
| `negotiation` | Negosiasi | Sedang dalam proses negosiasi harga dan ruang lingkup |
| `in_progress` | Berjalan | Konsultasi sedang berlangsung |
| `completed` | Selesai | Konsultasi telah selesai |
| `cancelled` | Dibatalkan | Konsultasi dibatalkan |

**Alur status konsultasi:**

```
Terbuka (open)
   └─→ Negosiasi (negotiation)
         └─→ Berjalan (in_progress)
               ├─→ Selesai (completed)
               └─→ Dibatalkan (cancelled)
```

---

## 6.4 Tipe Konsultasi

| Tipe | Label | Penjelasan |
|------|-------|------------|
| `client_request` | Permintaan Klien | Generator/Converter mengajukan permintaan desain dengan anggaran tertentu |
| `designer_offer` | Penawaran Desainer | Desainer memasang tarif jasa konsultasi yang ditawarkan |

**Permintaan Klien:**
- Diajukan oleh Generator atau Converter yang membutuhkan saran desain
- Klien menentukan judul, deskripsi, dan budget
- Desainer dapat menerima atau menegosiasikan

**Penawaran Desainer:**
- Dibuat oleh Desainer untuk menawarkan jasa konsultasi
- Desainer menentukan tarif dan deskripsi layanan
- Generator/Converter dapat merespon penawaran

---

## 6.5 Resep Desain

Klinik Desain juga menyediakan akses ke **Resep Desain** melalui tombol di pojok kanan atas halaman. Resep Desain adalah kumpulan panduan dan ide kreatif untuk mengubah limbah kayu menjadi produk bernilai.

![Resep Desain](05-designer-recipes.png)
*Gambar 6.2 — Halaman Resep Desain*

**Informasi pada setiap resep:**

| Informasi | Keterangan |
|-----------|------------|
| **Judul** | Nama resep desain |
| **Jenis Kayu yang Cocok** | Rekomendasi jenis kayu (Jati, Mahoni, dll) |
| **Bentuk Kayu yang Cocok** | Bentuk limbah yang sesuai (Offcut, Serutan, dll) |
| **Tingkat Kesulitan** | Mudah, Sedang, atau Sulit |
| **Deskripsi** | Penjelasan dan panduan pembuatan |
| **Foto** | Gambar hasil jadi produk |

**Filter Resep:**
- 🔍 Pencarian berdasarkan judul
- Filter tingkat kesulitan
- Filter jenis kayu

> **📝 Catatan:** Resep Desain bisa dibuat oleh Converter, Desainer, atau Enabler. Jika Anda memiliki ide resep yang ingin dibagikan, silakan buat resep baru dari halaman ini.

---
➡️ **Lanjut ke [Bab 7: Troubleshooting](./07-bab-7-troubleshooting.md)**
