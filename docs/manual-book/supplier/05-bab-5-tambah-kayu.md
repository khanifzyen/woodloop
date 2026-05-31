---
title: "Bab 5 — Tambah Kayu Baru"
---

# Bab 5: Tambah Kayu Baru

---

Ini adalah fitur utama Supplier — mendaftarkan kayu gelondongan yang ingin dijual ke Generator. Form pendaftaran terdiri dari dua kolom: **Informasi Kayu** (kiri) dan **Foto & Dokumen** (kanan).

![Form Tambah Kayu](03-supplier-add-timber.png)
*Gambar 5.1 — Form pendaftaran kayu baru*

---

## 5.1 Membuka Form Tambah Kayu

Ada tiga cara untuk membuka form tambah kayu baru:

**Cara 1 — Dari Dashboard:**
1. Klik tombol **"Daftarkan Kayu Baru"** di bagian menu cepat

**Cara 2 — Dari Sidebar:**
1. Klik **"Inventaris Kayu"** di sidebar kiri
2. Klik tombol **"Daftarkan Kayu Baru"** di halaman inventaris

**Cara 3 — Langsung:**
1. Buka URL: `/supplier/inventory/new`

---

## 5.2 Memilih Jenis Kayu

1. Klik dropdown **"Jenis Kayu"**
2. Pilih jenis kayu dari daftar yang tersedia. Contoh jenis kayu yang umum:
   - **Jati** — Kayu jati kualitas tinggi
   - **Mahoni** — Kayu mahoni kering
   - **Sono Keling** — Kayu sono keling
   - **Akasia** — Kayu akasia
   - **Trembesi** — Kayu trembesi
   - *(dan lainnya sesuai data master)*

> ⚠️ Field ini wajib diisi. Jika tidak dipilih, akan muncul error **"Pilih jenis kayu"**.

---

## 5.3 Memilih Bentuk Kayu

WoodLoop mendukung 4 bentuk kayu yang masing-masing memiliki input dimensi berbeda:

| Bentuk | Nilai | Input Dimensi | Ilustrasi |
|--------|-------|---------------|-----------|
| **Log (Gelondongan)** | `log` | Diameter + Panjang | 🔵 Silinder penuh |
| **Square (Persegi)** | `square` | Lebar/Sisi + Panjang | ⬛ Potongan persegi |
| **Balok** | `balok` | Panjang + Lebar + Tinggi | 📦 Balok |
| **Papan** | `papan` | Panjang + Lebar + Tinggi | 📋 Papan |

**Cara memilih:**
1. Klik dropdown **"Bentuk Kayu"**
2. Pilih salah satu dari 4 opsi
3. Input dimensi akan menyesuaikan secara otomatis

> 💡 **Tips:** Pilih bentuk yang paling mendekati bentuk fisik kayu Anda. Bentuk memengaruhi cara perhitungan volume otomatis.

---

## 5.4 Memilih Grade Kayu

Grade menunjukkan kualitas atau sumber kayu:

| Grade | Keterangan |
|-------|------------|
| **Perhutani** | Kayu dari Perum Perhutani (legal, bersertifikat) |
| **Hutan Rakyat** | Kayu dari hutan rakyat / milik masyarakat |
| **Lainnya** | Sumber lainnya |

> Field grade bersifat **opsional**. Tidak wajib diisi.

---

## 5.5 Mengisi Dimensi

Input dimensi berubah secara dinamis sesuai bentuk kayu yang dipilih:

### Log (Gelondongan)
```
┌──────────────┬──────────────┐
│ Diameter (cm)│ Panjang (cm) │
│     [  30  ] │    [ 200  ]  │
└──────────────┴──────────────┘
```

### Square (Persegi)
```
┌──────────────┬──────────────┐
│ Lebar/Sisi   │ Panjang (cm) │
│ (cm)         │              │
│     [ 20  ]  │    [ 200  ]  │
└──────────────┴──────────────┘
```

### Balok atau Papan
```
┌──────────────┬──────────────┬──────────────┐
│ Panjang (cm) │ Lebar (cm)   │ Tinggi (cm)  │
│    [ 200  ]  │    [ 20  ]   │     [ 5  ]   │
└──────────────┴──────────────┴──────────────┘
```

---

## 5.6 Volume & Harga

### Volume (m³)

Volume dapat diisi secara **manual** atau **dihitung otomatis**.

**Perhitungan volume otomatis**:
Saat Anda mengklik field volume (jika masih kosong), sistem akan menghitung berdasarkan dimensi:

| Bentuk | Rumus |
|--------|-------|
| **Log** | `π × (diameter/200)² × (panjang/100)` |
| **Square** | `(lebar/100) × (lebar/100) × (panjang/100)` |
| **Balok / Papan** | `(panjang/100) × (lebar/100) × (tinggi/100)` |



Masukkan harga jual kayu. Input harga menggunakan **pemisah ribuan** otomatis:

```
Contoh: 1.500.000 (untuk 1,5 juta rupiah)
```

> ⚠️ Harga dan volume wajib diisi. Nilai harus lebih dari 0.

---

## 5.7 Upload Foto

Foto kayu adalah **syarat wajib** untuk mendaftarkan kayu. Kayu dengan foto yang jelas lebih cepat laku.

| Ketentuan | Detail |
|-----------|--------|
| Minimal | **1 foto** |
| Maksimal | **5 foto** |
| Format | JPG, PNG, WebP |
| Resolusi | Otomatis di-resize ke maks 1024px |

**Cara upload:**
1. **Drag & drop** — Seret foto dari komputer ke area dropzone
2. **Klik** — Klik area dropzone untuk memilih file
3. **Kamera** — Klik "Ambil Foto dari Kamera" (jika tersedia)

![Upload Foto](03-supplier-add-timber.png)
*Gambar 5.2 — Area upload foto dengan preview*

Setelah di-upload, foto akan tampil sebagai thumbnail preview.

---

## 5.8 Upload Dokumen Legalitas

Anda dapat melampirkan dokumen legalitas kayu secara opsional:

| Dokumen | Format | Maks Ukuran |
|---------|--------|-------------|
| SVLK Certificate | PDF | 10 MB |
| FSC Certificate | PDF | 10 MB |
| SK Pengesahan | PDF | 10 MB |
| Izin Usaha (NIB) | PDF | 10 MB |

**Cara upload:**
1. Klik area dropzone **"Dokumen Legalitas"**
2. Pilih file PDF dari komputer
3. Nama file akan tampil sebagai link yang bisa diklik

---

## 5.9 Menyimpan Kayu Baru

Setelah semua field terisi:

1. Periksa kembali data yang dimasukkan
2. Klik tombol **"Simpan Kayu"** di bagian bawah halaman
3. Tunggu proses penyimpanan (tombol akan berubah menjadi **"Menyimpan..."**)
4. Jika berhasil:
   - Notifikasi **"Kayu berhasil didaftarkan!"**
   - Anda akan diarahkan kembali ke halaman **Inventaris Kayu**
   - Kayu baru akan muncul di daftar inventaris dengan status **🟢 Tersedia**

5. Jika gagal:
   - Notifikasi error akan muncul dengan keterangan penyebab
   - Periksa field yang bermasalah dan coba lagi

---
➡️ **Lanjut ke [Bab 6: Pesanan & Penjualan](./06-bab-6-pesanan-penjualan.md)**
embali data yang dimasukkan
2. Klik tombol **"Simpan Kayu"** di bagian bawah halaman
3. Tunggu proses penyimpanan (tombol akan berubah menjadi **"Menyimpan..."**)
4. Jika berhasil:
   - Notifikasi **"Kayu berhasil didaftarkan!"**
   - Anda akan diarahkan kembali ke halaman **Inventaris Kayu**
   - Kayu baru akan muncul di daftar inventaris dengan status **🟢 Tersedia**

5. Jika gagal:
   - Notifikasi error akan muncul dengan keterangan penyebab
   - Periksa field yang bermasalah dan coba lagi

---
➡️ **Lanjut ke [Bab 6: Pesanan & Penjualan](./06-bab-6-pesanan-penjualan.md)**
