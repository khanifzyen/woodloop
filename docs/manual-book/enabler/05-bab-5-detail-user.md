---
title: "Bab 5 — Detail User"
---

# Bab 5: Detail User

---

Halaman **Detail User** menampilkan informasi lengkap seorang pengguna beserta dokumen dan aktivitasnya. Halaman ini diakses dengan mengklik baris pengguna di tabel Manajemen User.

---

## 5.1 Profil Pengguna

Bagian **Profil** menampilkan informasi utama pengguna:

| Field | Keterangan |
|-------|------------|
| **Nama** | Nama lengkap pengguna |
| **Role** | Badge peran (berwarna sesuai peran) |
| **Verifikasi** | Badge Terverifikasi (hijau) / Belum (abu-abu) |
| **Email** | Email terdaftar |
| **Telepon** | Nomor telepon (jika diisi) |
| **Workshop** | Nama workshop/usaha (jika diisi) |
| **Alamat** | Alamat lengkap (jika diisi) |
| **Kode User** | Kode unik pengguna (jika ada) |
| **Kapasitas Produksi** | Untuk peran Converter (jika diisi) |
| **Jenis Mesin** | Untuk peran Converter (jika diisi) |
| **Armada** | Untuk peran Aggregator (jika diisi) |
| **Kapasitas Gudang** | Untuk peran Aggregator (jika diisi) |
| **Lokasi GPS** | Koordinat latitude & longitude (jika diisi) |

Field yang tidak diisi akan disembunyikan. Tampilan menyesuaikan dengan data yang tersedia untuk setiap pengguna.

---

## 5.2 Statistik Aktivitas

Kartu **Aktivitas** menampilkan ringkasan aktivitas pengguna di platform:

| Metrik | Keterangan |
|--------|------------|
| **Listing Limbah** | Jumlah listing limbah yang dibuat (Generator) |
| **Listing Kayu** | Jumlah kayu yang didaftarkan (Supplier) |
| **Pesanan** | Jumlah pesanan (sebagai pembeli atau penjual) |
| **Penjemputan** | Jumlah penjemputan (Aggregator) |
| **Dokumen Legalitas** | Jumlah dokumen yang diupload |

Statistik ini membantu Enabler menilai tingkat keaktifan pengguna. Data diambil dari seluruh koleksi terkait di PocketBase.

> **💡 Catatan:** Metrik yang tidak relevan dengan peran pengguna akan bernilai 0. Misalnya, Supplier tidak memiliki data Listing Limbah.

---

## 5.3 Review Dokumen Legalitas

Bagian **Dokumen Legalitas** menampilkan semua dokumen yang telah diupload oleh pengguna, termasuk:

- NIB (Nomor Induk Berusaha)
- SVLK (Sertifikat Verifikasi Legalitas Kayu)
- SK Pengesahan
- Izin Usaha
- Sertifikat lainnya

Setiap dokumen dilengkapi dengan:
- **Nama dokumen**
- **Jenis dokumen** (badge)
- **Status review** (Ditinjau / Belum ditinjau)
- **Tombol buka PDF** — melihat dokumen langsung di browser

### Menyetujui atau Menolak Dokumen

1. Buka halaman Detail User
2. Scroll ke bagian **Dokumen Legalitas**
3. Untuk setiap dokumen, Anda dapat:
   - **Setujui** — ubah status dokumen menjadi "Terverifikasi"
   - **Tolak** — sertakan catatan alasan penolakan
4. Setelah semua dokumen ditinjau, verifikasi akun pengguna melalui tombol **Verifikasi** / **Batalkan** di bagian Profil

### Tombol Verifikasi Akun

Di bagian bawah kartu Profil, terdapat tombol untuk verifikasi akun secara keseluruhan:

| Tombol | Fungsi |
|--------|--------|
| **🛡️ Verifikasi** | Menyetujui akun pengguna (muncul jika belum terverifikasi) |
| **❌ Batalkan** | Mencabut status verifikasi (muncul jika sudah terverifikasi, warna merah) |

> **⚠️ Penting:** Pastikan semua dokumen legalitas sudah Anda tinjau sebelum memverifikasi akun pengguna. Verifikasi adalah langkah penting untuk menjaga kepercayaan ekosistem WoodLoop.

---
➡️ **Lanjut ke [Bab 6: Profil Enabler](./06-bab-6-profil.md)**
