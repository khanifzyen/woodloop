---
title: "Bab 4 — Panduan Supplier"
---

# Bab 4: Panduan Supplier (Pemasok Kayu)

---

**Supplier** adalah pihak yang memasok kayu gelondongan (*raw timber*) ke dalam ekosistem WoodLoop. Supplier menjadi **mata rantai pertama** dalam alur ekonomi sirkular.

**Contoh pengguna Supplier:** Pedagang kayu di Jepara, pemilik sawmill, pemilik hutan rakyat.

---

## 4.1 Dashboard Supplier

Setelah login sebagai Supplier, halaman pertama adalah **Dashboard Supplier**.

![Dashboard Supplier](screenshots/05-supplier-dashboard.png)
*Gambar 4.1 — Dashboard Supplier*

| Kartu | Menampilkan |
|-------|-------------|
| **Listing Aktif** | Jumlah kayu yang sedang dijual |
| **Order Masuk** | Jumlah pesanan dari Generator (pending) |
| **Total Penjualan** | Total pendapatan dari semua transaksi |
| **Saldo Dompet** | Saldo dompet digital WoodLoop |

**Menu Cepat:**

| Tombol | Fungsi | Navigasi |
|--------|--------|----------|
| **Daftarkan Kayu Baru** | Tambah listing kayu baru | `/supplier/inventory/new` |
| **Lihat Inventaris** | Lihat semua stok kayu | `/supplier/inventory` |
| **Lihat Pesanan** | Cek pesanan masuk | `/supplier/orders` |

---

## 4.2 Mendaftarkan Kayu Baru

### Buka Form Tambah Kayu

1. Dari dashboard, klik **"Daftarkan Kayu Baru"**
2. Atau buka menu sidebar **"Inventaris Kayu"** → klik tombol **"Daftarkan Kayu Baru"**
3. Atau langsung: `/supplier/inventory/new`

![Form Tambah Kayu](screenshots/07-supplier-add-timber.png)
*Gambar 4.2 — Form pendaftaran kayu baru*

### Isi Detail Kayu

| Field | Tipe Input | Wajib | Contoh |
|-------|-----------|:-----:|--------|
| **Jenis Kayu** | Dropdown | ✅ | Jati, Mahoni, Sono Keling |
| **Diameter (cm)** | Angka | ✅ | 30 |
| **Panjang (cm)** | Angka | ✅ | 200 |
| **Volume (m³)** | Angka | ✅ | 0.5 |
| **Harga** | Angka (Rp) | ✅ | 500000 |
| **Satuan** | Dropdown | ✅ | m³, batang, ton |
| **Kondisi** | Dropdown | ✅ | Kering, Basah, Olahan |

### Upload Foto

| Ketentuan | Detail |
|-----------|--------|
| Minimal | **1 foto** |
| Maksimal | **5 foto** |
| Format | JPG, PNG, WebP |
| Ukuran maks | **2 MB per foto** |

**Cara upload:** Seret foto ke area dropzone, atau klik area dropzone untuk memilih file.

### Simpan

1. Pastikan semua field wajib terisi
2. Klik **"Simpan Kayu"**
3. Notifikasi **"Kayu berhasil didaftarkan!"** akan muncul
4. Kayu muncul di Inventaris dengan status **Tersedia**

---

## 4.3 Mengelola Inventaris Kayu

Halaman **Inventaris Kayu** menampilkan semua kayu yang telah Anda daftarkan.

![Inventaris Kayu](screenshots/06-supplier-inventory.png)
*Gambar 4.3 — Halaman inventaris kayu*

| Fitur | Fungsi |
|-------|--------|
| **Pencarian** | Cari berdasarkan jenis kayu |
| **Filter Status** | Filter: Semua, Tersedia, Terjual, Dipesan |
| **Reset Filter** | Kembalikan filter ke default |

### Status Kayu

| Status | Arti | Warna Badge |
|--------|------|-------------|
| **Tersedia** | Kayu siap dijual | Hijau |
| **Dipesan** | Sedang dalam proses pemesanan | Kuning |
| **Terjual** | Sudah dibeli Generator | Merah |

### Edit atau Hapus Kayu

- **Edit** — Klik ikon pensil (✏️) → ubah field → **"Simpan"**
- **Hapus** — Klik ikon tong sampah (🗑️) → konfirmasi dialog

> Kayu yang sudah memiliki pesanan aktif **tidak bisa dihapus**.

---

## 4.4 Melihat & Memproses Pesanan Masuk

Halaman **Pesanan Masuk** menampilkan semua order dari Generator.

![Pesanan Masuk](screenshots/08-supplier-orders.png)
*Gambar 4.4 — Halaman pesanan masuk*

| Status | Arti | Aksi Supplier |
|--------|------|---------------|
| **Menunggu Bayar** | Generator sudah pesan, belum bayar | Tunggu pembayaran |
| **Dibayar** | Pembayaran sudah dikonfirmasi | Siapkan pengiriman |
| **Dikirim** | Kayu sedang dalam perjalanan | — |
| **Diterima** | Generator sudah terima | Transaksi selesai |
| **Dibatalkan** | Pesanan dibatalkan | — |

---

## 4.5 Riwayat Penjualan & Grafik

Halaman **Riwayat Penjualan** menampilkan data penjualan dalam bentuk grafik dan tabel.

![Riwayat Penjualan](screenshots/09-supplier-sales.png)
*Gambar 4.5 — Halaman riwayat penjualan*

| Kartu | Menampilkan |
|-------|-------------|
| **Total Pendapatan** | Jumlah rupiah dari semua penjualan |
| **Pesanan Selesai** | Jumlah transaksi yang selesai |
| **Total Transaksi** | Total semua transaksi (termasuk pending) |

Grafik batang menampilkan tren penjualan bulanan.

---
➡️ **Lanjut ke [Bab 5: Panduan Generator](./05-bab-5-generator.md)**
