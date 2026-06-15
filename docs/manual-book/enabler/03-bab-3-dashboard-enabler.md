---
title: "Bab 3 — Dashboard Enabler"
---

# Bab 3: Dashboard Enabler

---

Halaman Dashboard Enabler adalah halaman utama yang muncul setelah login. Dashboard menampilkan **analitik dampak lingkungan dan ekonomi** dari seluruh aktivitas di platform WoodLoop.

![Dashboard Enabler](../screenshots/26-enabler-dashboard.png)
*Gambar 3.1 — Dashboard Enabler*

---

## 3.1 Ringkasan Kartu (Summary Cards)

Empat kartu statistik di bagian atas dashboard menampilkan data ringkas dampak ekosistem:

| Kartu | Ikon | Menampilkan | Satuan |
|-------|------|-------------|--------|
| **Limbah Terpakai** | ♻️ | Total limbah yang berhasil dialihkan dari TPA | kg |
| **CO₂ Tersimpan** | 🌬️ | Estimasi emisi karbon yang terhindarkan | kg CO₂ |
| **Nilai Ekonomi** | 💰 | Total nilai transaksi di ekosistem | Rp |
| **Total Pengguna** | 🌿 | Jumlah pengguna yang terdaftar | orang |

Setiap nilai ditampilkan dalam format yang mudah dibaca:
- Limbah: `15.000 kg`
- CO₂: `2.500 kg CO₂`
- Nilai Ekonomi: `Rp 125.000.000`
- Pengguna: `250`

---

## 3.2 Grafik Analitik

Dashboard menyediakan tiga grafik yang ditampilkan secara otomatis dari data aktivitas platform:

### 3.2.1 Grafik Limbah per Bulan (Bar Chart)

Grafik batang menampilkan **tren limbah kayu yang berhasil dikelola** setiap bulan.

| Elemen | Keterangan |
|--------|------------|
| **Sumbu X** | Bulan (format YYYY-MM) |
| **Sumbu Y** | Total limbah dalam kg |
| **Warna** | Hijau (#16a34a) |
| **Tooltip** | Menampilkan nilai saat hover: "12.500 kg" |

Grafik ini membantu Anda melihat apakah pengelolaan limbah meningkat dari waktu ke waktu.

### 3.2.2 Tren CO₂ Tersimpan (Line Chart)

Grafik garis menampilkan **estimasi CO₂ yang terhindarkan** setiap bulan.

| Elemen | Keterangan |
|--------|------------|
| **Sumbu X** | Bulan |
| **Sumbu Y** | CO₂ dalam kg |
| **Warna** | Biru (#2563eb) |
| **Tooltip** | Menampilkan nilai saat hover: "2.100 kg" |

Semakin tinggi garis, semakin besar dampak lingkungan positif dari ekosistem WoodLoop.

### 3.2.3 Nilai Ekonomi per Bulan (Area Chart)

Grafik area menampilkan **nilai transaksi ekonomi sirkular** setiap bulan.

| Elemen | Keterangan |
|--------|------------|
| **Sumbu X** | Bulan |
| **Sumbu Y** | Nilai dalam Rupiah (skala ribuan) |
| **Warna** | Kuning/emas (#eab308) dengan transparansi 15% |
| **Tooltip** | Menampilkan nilai saat hover: "Rp 15.000.000" |

Grafik ini menunjukkan kontribusi ekonomi dari ekonomi sirkular kayu di Jepara.

> **💡 Catatan:** Jika data belum tersedia, grafik akan menampilkan pesan "Belum ada data". Data akan terisi otomatis seiring aktivitas platform.

---

## 3.3 Distribusi Peran

Di bagian kanan bawah dashboard, terdapat diagram batang horizontal yang menampilkan **distribusi jumlah pengguna per peran**:

| Peran | Deskripsi |
|-------|-----------|
| **Supplier** | Pemasok kayu gelondongan |
| **Generator** | Pengrajin penghasil limbah |
| **Aggregator** | Pengepul limbah |
| **Converter** | Pengrajin upcycle |
| **Buyer** | Pembeli produk |
| **Enabler** | Pemantau (Anda sendiri) |
| **Designer** | Desainer furnitur sirkular |

Setiap batang menampilkan jumlah pengguna dan panjang batang proporsional terhadap peran dengan pengguna terbanyak.

---

## 3.4 Filter Periode & Ekspor Data

### Filter Periode

Dropdown **"Semua Waktu"** di pojok kanan atas dashboard memungkinkan Anda menyaring data berdasarkan periode:

| Opsi | Menampilkan Data |
|------|------------------|
| **Semua Waktu** | Seluruh data sejak awal |
| **1 Bulan** | 30 hari terakhir |
| **3 Bulan** | 90 hari terakhir |
| **1 Tahun** | 365 hari terakhir |

Saat periode diubah, seluruh kartu KPI dan grafik akan diperbarui otomatis.

### Ekspor Data (CSV)

Klik tombol **"Export CSV"** di pojok kanan atas untuk mengunduh data dampak dalam format CSV. File yang diunduh berisi:

| Kolom | Keterangan |
|-------|------------|
| **Periode** | Bulan (YYYY-MM) |
| **Limbah (kg)** | Total limbah terpakai bulan tersebut |
| **CO₂ (kg)** | Total CO₂ tersimpan bulan tersebut |
| **Nilai Ekonomi (Rp)** | Total nilai transaksi bulan tersebut |
| **Total Pengguna** | Jumlah pengguna terdaftar |

Baris terakhir berisi **TOTAL** agregat seluruh periode. File dinamai otomatis: `woodloop-impact-data-YYYY-MM-DD.csv`.

> **💡 Tips:** Gunakan data CSV ini untuk membuat laporan keberlanjutan atau presentasi ke pemangku kepentingan.

---
➡️ **Lanjut ke [Bab 4: Manajemen User](./04-bab-4-manajemen-user.md)**
