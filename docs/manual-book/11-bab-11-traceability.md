---
title: "Bab 11 — Traceability & QR Code"
---

# Bab 11: Traceability & QR Code

---

**Traceability** (ketertelusuran) adalah fitur unggulan WoodLoop yang memungkinkan setiap produk upcycled **dilacak asal-usulnya** — dari bahan baku hingga produk jadi — melalui QR Code unik.

---

## 11.1 Apa Itu QR Traceability?

### Konsep

Setiap produk yang dibuat oleh Converter akan mendapatkan **QR Code unik** yang menyimpan seluruh **cerita perjalanan produk**:

```
🌲 Supplier              🏭 Generator              🚛 Aggregator
(Kayu Gelondongan)   →   (Limbah Produksi)    →   (Sortir & Simpan)
                                                      ↓
🛒 Buyer                  ♻️ Converter
(Konsumen)           ←   (Produk Upcycled)    ←   (Jual Bahan)
```

Ketika QR Code di-scan, Buyer bisa melihat:

| Informasi | Detail |
|-----------|--------|
| 🪵 **Jenis Kayu Asli** | Jati, Mahoni, Sono Keling, dll |
| 🌲 **Supplier Asal** | Nama & lokasi pemasok kayu |
| 🏭 **Generator** | Pengrajin yang menghasilkan limbah |
| 🚛 **Aggregator** | Pengepul yang menyortir & menyimpan |
| ♻️ **Converter** | Pengrajin yang membuat produk |
| 🌍 **Dampak Lingkungan** | CO₂ tersimpan, limbah teralihkan |
| 📅 **Timeline** | Tanggal setiap tahap perjalanan |

### Manfaat Traceability

| Untuk Siapa | Manfaat |
|-------------|---------|
| 🛒 **Buyer** | Yakin produk asli, ramah lingkungan, dan legal |
| ♻️ **Converter** | Nilai jual produk lebih tinggi, branding cerita unik |
| 📊 **Enabler** | Data dampak lingkungan & ekonomi terverifikasi |
| 🌍 **Lingkungan** | Transparansi rantai pasok mengurangi illegal logging |

---

## 11.2 Cara Scan QR Code

Ada **tiga cara** untuk memindai QR Code produk WoodLoop:

### Metode 1: Scan dengan Kamera HP (Paling Mudah)

1. Buka **kamera bawaan** HP
2. Arahkan ke **QR Code** yang tertera di produk atau kemasan
3. Tap **notifikasi link** yang muncul di layar
4. Halaman traceability terbuka di browser

> ✅ **Tidak perlu install aplikasi apapun.** Kamera HP modern sudah bisa membaca QR Code secara native.

### Metode 2: Scan dengan Aplikasi WoodLoop (Android)

1. Buka aplikasi **WoodLoop** di HP Android
2. Tap ikon **QR Scanner** (📷) di halaman utama
3. Izinkan akses kamera
4. Arahkan kamera ke QR Code
5. Halaman traceability terbuka di dalam aplikasi

### Metode 3: Upload Foto QR Code (Web)

Jika tidak punya kamera (di komputer):

1. Buka `https://woodloop.app`
2. Klik ikon **QR Scanner**
3. Klik **"Upload Foto QR"**
4. Pilih foto QR Code dari komputer
5. Sistem akan membaca QR Code dari foto

### Format QR Code

| Elemen | Spesifikasi |
|--------|-------------|
| **Ukuran minimal** | 2×2 cm (cetak) |
| **Warna** | Hitam di atas putih (kontras tinggi) |
| **Link** | `https://woodloop.app/p/[qr_code_id]` |
| **Dapat dicetak** | ✅ Ya, pada label/kemasan produk |

---

## 11.3 Halaman Traceability Publik

Halaman traceability adalah halaman **publik** yang bisa diakses siapa saja **tanpa login**.

![Halaman Traceability Publik](screenshots/31-traceability.png)
*Gambar 11.3 — Halaman traceability publik (SSR)*

### Tampilan Halaman

| Bagian | Konten |
|--------|--------|
| 🖼️ **Foto Produk** | Gambar utama produk |
| 📝 **Nama & Deskripsi** | Informasi dasar produk |
| 🌍 **Dampak Lingkungan** | Badge: CO₂ saved, waste diverted |
| 🕐 **Timeline** | Perjalanan produk dari Supplier → Buyer |
| 👤 **Profil Pengrajin** | Informasi Converter pembuat |
| 🔗 **Link Marketplace** | CTA: "Beli Produk Ini" |

### Timeline Produk

Timeline menampilkan **setiap tahap** perjalanan produk secara visual:

```
🌲 KAYU MENTAH
   Supplier: CV. Kayu Jati Abadi
   Lokasi: Kecamatan Jepara
   Tanggal: 1 Mei 2026
       ↓
🏭 LIMBAH PRODUKSI
   Generator: Ukiran Jati Makmur
   Bentuk: Offcut besar
   Tanggal: 5 Mei 2026
       ↓
🚛 DISORTIR & DISIMPAN
   Aggregator: Logistik Hijau Jepara
   Lokasi: Gudang Pecangaan
   Tanggal: 8 Mei 2026
       ↓
♻️ PRODUK UPCYCLED
   Converter: Kreasi Limbah Nusantara
   Produk: Vas Bunga Minimalis
   Tanggal: 15 Mei 2026
       ↓
🛒 DIBELI OLEH
   (Informasi Buyer disembunyikan untuk privasi)
```

### SEO & Google

Halaman traceability adalah **Server-Side Rendered (SSR)** — artinya:

- ✅ Muncul di hasil pencarian Google
- ✅ Bisa diindex oleh search engine
- ✅ Tidak perlu JavaScript untuk melihat konten
- ✅ Muat cepat karena di-render di server

> **Tips SEO untuk Converter:** Pastikan nama produk dan deskripsi mengandung kata kunci yang relevan agar produk muncul di pencarian Google.

---

## 11.4 Dampak Lingkungan

Setiap produk menampilkan **metrik dampak lingkungan** yang dihitung berdasarkan data rantai pasok:

### Metrik Utama

| Metrik | Satuan | Arti |
|--------|--------|------|
| 🌿 **Limbah Teralihkan** | kg | Jumlah limbah yang tidak dibakar/dibuang |
| 🌍 **CO₂ Tersimpan** | kg CO₂ | Emisi karbon yang terhindarkan |
| 🔋 **Energi Terhemat** | kWh | Energi yang tidak terpakai (dibanding produksi baru) |
| 💧 **Air Terhemat** | liter | Air yang tidak terpakai |

### Cara Perhitungan

| Faktor | Perhitungan |
|--------|-------------|
| **CO₂ per kg kayu** | ~1.5 kg CO₂ per kg kayu (estimasi) |
| **Limbah teralihkan** | Berat produk × faktor konversi |
| **Pohon terselamatkan** | 1 pohon dewasa = ~100 kg kayu |

### Badge Dampak

Produk yang memiliki dampak positif akan mendapatkan badge khusus:

```
┌──────────────────────────────┐
│  🌍 Dampak Produk Ini        │
│                              │
│  🟢 Limbah Teralihkan: 2 kg  │
│  🟢 CO₂ Tersimpan: 3 kg      │
│  🟢 Pohon Terselamatkan: 0.02│
└──────────────────────────────┘
```

---

### Ringkasan Bab 11

| Fitur | Fungsi |
|-------|--------|
| 📱 **QR Code Unik** | Setiap produk punya QR sendiri |
| 📖 **Traceability** | Lihat perjalanan produk dari awal |
| 🌍 **Dampak Lingkungan** | CO₂, limbah, energi, air |
| 🔍 **SEO Friendly** | Halaman publik muncul di Google |
| 📸 **3 Cara Scan** | Kamera HP, Aplikasi, Upload foto |

---
➡️ **Lanjut ke [Bab 12: Troubleshooting & FAQ](./12-bab-12-troubleshooting.md)**
