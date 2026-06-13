---
title: "Bab 5 — Penjemputan (Pickups)"
---

# Bab 5: Penjemputan (Pickups)

---

Setelah bid Anda diterima Generator, langkah selanjutnya adalah **menjemput limbah** ke lokasi Generator. Halaman Penjemputan mengelola seluruh siklus pickup dari awal hingga selesai.

![Halaman Penjemputan](../screenshots/16-aggregator-pickups.png)
*Gambar 5.1 — Halaman daftar penjemputan*

---

## 5.1 Daftar Pickup

Halaman pickups menggunakan sistem **tab** untuk mengelompokkan pickup berdasarkan status:

| Tab | Status | Isi |
|-----|--------|-----|
| **Perlu Dijemput** | `pending` | Pickup yang sudah dijadwalkan, menunggu Anda berangkat |
| **Sedang Diangkut** | `on_the_way` | Pickup yang sedang dalam perjalanan |
| **Selesai** | `completed` | Riwayat pickup yang sudah selesai |
| **Semua** | Semua status | Seluruh pickup tanpa filter |

### Kartu Pickup

Setiap pickup ditampilkan sebagai kartu yang berisi:

| Elemen | Keterangan |
|--------|------------|
| **Nama Kayu & Bentuk** | Jenis kayu dan bentuk limbah (dari waste_listing) |
| **Badge Status** | Label status dengan warna berbeda |
| **Volume** | Jumlah volume limbah |
| **Tanggal Terjadwal** | Tanggal pickup (jika ada) |
| **Progress Bar** | Indikator visual progres: 25% (pending) → 60% (on_the_way) → 100% (completed) |
| **Tombol Aksi** | Tombol sesuai status pickup |

### Progress Bar

```
Perlu Dijemput  [█████░░░░░░░░░]  25%
Sedang Diangkut [████████████░░]  60%
Selesai         [████████████████] 100%
```

---

## 5.2 Proses Pickup

Proses pickup terdiri dari 3 tahap:

### Tahap 1: Menjemput (Pending → On The Way)

Pada kartu pickup dengan status **Perlu Dijemput**:

1. Klik tombol **"Jemput"** — status berubah menjadi "Sedang Diangkut"
2. Atau langsung klik **"Selesai"** jika Anda sudah di lokasi dan siap konfirmasi

### Tahap 2: Konfirmasi Pickup (On The Way → Completed)

Pada kartu pickup dengan status **Sedang Diangkut**, klik **"Konfirmasi"** untuk membuka halaman konfirmasi. Atau dari tahap 1, klik langsung **"Selesai"**.

### Tahap 3: Halaman Konfirmasi

![Halaman Konfirmasi Pickup](../screenshots/16-aggregator-pickups.png)
*Gambar 5.2 — Halaman konfirmasi pickup dengan foto, GPS, dan berat*

Halaman konfirmasi memiliki **3 bagian wajib**:

#### A. Foto Bukti

Ambil foto limbah sebagai bukti serah terima:

| Ketentuan | Detail |
|-----------|--------|
| **Cara** | Klik area upload → kamera mobile atau file dialog desktop |
| **Format** | JPG, PNG |
| **Ukuran** | Otomatis di-resize |
| **Fungsi** | Bukti visual bahwa pickup benar-benar terjadi |

#### B. Lokasi Pickup (GPS)

Rekam koordinat GPS lokasi pickup sebagai validasi geografis:

1. Klik tombol **"Rekam Lokasi Saat Ini"**
2. Browser akan meminta izin akses lokasi — klik **"Izinkan"**
3. Setelah berhasil, tampil koordinat Latitude & Longitude

> ⚠️ **Penting:** Pastikan GPS perangkat Anda aktif. Tanpa lokasi, sistem tidak bisa memvalidasi bahwa pickup dilakukan di lokasi yang benar.

#### C. Berat Aktual

Masukkan berat limbah yang sebenarnya:

| Field | Wajib | Contoh |
|-------|:-----:|--------|
| **Berat (kg)** | ✅ | 150.5 |
| **Catatan** | ❌ | "Limbah dalam kondisi kering, siap diolah" |

### Menyelesaikan Pickup

1. Pastikan **foto bukti** sudah diambil
2. Pastikan **GPS** sudah direkam
3. Isi **berat aktual** (wajib)
4. Tambahkan **catatan** (opsional)
5. Klik **"Konfirmasi & Selesaikan"**

Setelah dikonfirmasi:
- ✅ Status pickup → **completed**
- 🏗️ Stok otomatis masuk ke **Gudang** (warehouse_inventory)
- 💰 Dompet Generator otomatis **dikredit** sesuai harga
- 📊 Impact metrics otomatis **tercatat**
- 🔔 Generator mendapat notifikasi "Limbah Berhasil Dijemput!"

---

## 5.3 Membatalkan Pickup

Pickup dengan status **Perlu Dijemput** atau **Sedang Diangkut** bisa dibatalkan:

1. Klik ikon **X** (merah) pada kartu pickup
2. Status berubah menjadi **Dibatalkan** (`cancelled`)

> ⚠️ **Penting:** Pembatalan pickup akan mengembalikan status limbah menjadi **Tersedia** kembali, sehingga Aggregator lain bisa membidiknya.

---
➡️ **Lanjut ke [Bab 6: Gudang (Warehouse)](./06-bab-6-warehouse.md)**
