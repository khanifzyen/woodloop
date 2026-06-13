---
title: "Bab 10 — Fitur Global"
---

# Bab 11: Fitur Global (Semua Peran)

---

Fitur global adalah fitur yang bisa diakses oleh **semua peran** pengguna WoodLoop, baik Supplier, Generator, Aggregator, Converter, Buyer, maupun Enabler.

---

## 10.1 Dompet Digital (Wallet)

Setiap pengguna WoodLoop memiliki **dompet digital** untuk transaksi keuangan di dalam platform.

![Dompet Digital](screenshots/28-wallet.png)
*Gambar 10.1 — Halaman dompet digital*

### Informasi Dompet

| Informasi | Keterangan |
|-----------|------------|
| 💰 **Saldo** | Jumlah saldo saat ini |
| 📈 **Total Pemasukan** | Total uang yang masuk |
| 📉 **Total Pengeluaran** | Total uang yang keluar |
| 🔄 **Riwayat** | Daftar transaksi (filterable) |

### Cara Mendapatkan Saldo

| Peran | Cara Mendapatkan Saldo |
|-------|----------------------|
| 🌲 **Supplier** | Kayu terjual ke Generator |
| 🏭 **Generator** | Limbah dibeli Aggregator |
| 🚛 **Aggregator** | Stok gudang dibeli Converter |
| ♻️ **Converter** | Produk terjual ke Buyer |
| 🛒 **Buyer** | Top-up saldo (via transfer) |
| 📊 **Enabler** | — (monitoring saja) |

### Riwayat Transaksi

Tabel riwayat menampilkan:

| Kolom | Keterangan |
|-------|------------|
| 📅 **Tanggal** | Waktu transaksi |
| 📝 **Deskripsi** | Jenis transaksi |
| ➕ **Masuk** | Jumlah pemasukan |
| ➖ **Keluar** | Jumlah pengeluaran |
| 📊 **Saldo Akhir** | Saldo setelah transaksi |

> **Tips:** Gunakan dompet untuk transaksi lebih cepat tanpa perlu transfer bank setiap kali.

---

## 10.2 Pusat Notifikasi

**Pusat Notifikasi** mengumpulkan semua pemberitahuan dari aktivitas di WoodLoop.

![Pusat Notifikasi](screenshots/29-notifications.png)
*Gambar 10.2 — Halaman pusat notifikasi*

### Jenis Notifikasi

| Peran | Notifikasi yang Diterima |
|-------|-------------------------|
| 🌲 **Supplier** | Order masuk, pembayaran dikonfirmasi, produk dilihat |
| 🏭 **Generator** | Bid masuk, bid diterima, pickup dijadwalkan |
| 🚛 **Aggregator** | Limbah baru, bid diterima, pickup dikonfirmasi |
| ♻️ **Converter** | Bahan tersedia, pembayaran masuk, produk dilihat |
| 🛒 **Buyer** | Pesanan diproses, dikirim, sampai |
| 📊 **Enabler** | Permintaan verifikasi, laporan siap |

### Fitur Notifikasi

| Fitur | Fungsi |
|-------|--------|
| 🔔 **Ikon Notif** | Angka merah di header → jumlah notif belum dibaca |
| 📋 **Daftar** | Semua notifikasi terurut (terbaru di atas) |
| 👁️ **Baca** | Klik notifikasi → mark as read + redirect ke halaman terkait |
| ✅ **Tandai Semua Dibaca** | Satu klik untuk semua notifikasi |
| 🗑️ **Hapus** | Hapus notifikasi yang tidak diperlukan |

### Push Notification (Android)

Di aplikasi Android, notifikasi juga muncul sebagai **push notification**:

| Kondisi | Perilaku |
|---------|----------|
| 📱 **Aplikasi terbuka** | Notifikasi muncul di dalam app (toast) |
| 📱 **Aplikasi di background** | Notifikasi muncul di status bar HP |
| 📱 **Aplikasi ditutup** | Notifikasi muncul di lock screen |
| 👆 **Tap notifikasi** | Membuka halaman terkait di aplikasi |

---

## 10.3 Pesan & Chat

**Fitur Chat** memungkinkan pengguna berkomunikasi secara realtime.

![Halaman Chat](screenshots/30-chat.png)
*Gambar 11.3 — Halaman chat*

### Siapa Bisa Chat dengan Siapa?

| Pengirim | Penerima | Keperluan |
|----------|----------|-----------|
| Generator | Aggregator | Negosiasi harga & jadwal pickup |
| Aggregator | Generator | Konfirmasi pickup, tanya lokasi |
| Converter | Aggregator | Tanya spesifikasi bahan |
| Buyer | Converter | Tanya produk, negosiasi |
| Supplier | Generator | Konfirmasi pengiriman kayu |
| Semua | Semua | Tanya jawab umum |

### Fitur Chat

| Fitur | Fungsi |
|-------|--------|
| 📋 **Daftar Chat** | Semua percakapan terurut (terbaru di atas) |
| 💬 **Pesan Real-time** | Pesan terkirim & diterima langsung (WebSocket) |
| 🖼️ **Kirim Gambar** | Upload foto (contoh: foto kondisi kayu) |
| ✅ **Centang Biru** | Pesan sudah dibaca |
| 🕐 **Timestamp** | Waktu pengiriman pesan |
| 🔍 **Search Chat** | Cari pesan tertentu |

### Etika Chat

| Aturan | Penjelasan |
|--------|------------|
| 🤝 **Sopan** | Gunakan bahasa yang baik |
| 📞 **Jam Kerja** | Chat di jam kerja (08.00 - 17.00) |
| 📸 **Foto Jelas** | Jika mengirim foto kondisi barang |
| ✅ **Konfirmasi** | Jika sepakat, segera konfirmasi di sistem |

---

## 10.4 Manajemen Dokumen Legalitas

Setiap pengguna bisa mengupload dokumen legalitas untuk **verifikasi akun** atau keperluan bisnis.

### Dokumen yang Didukung

| Dokumen | Format | Maks Ukuran |
|---------|--------|-------------|
| **KTP** | JPG, PNG | 2 MB |
| **SIUP / NIB** | PDF, JPG, PNG | 5 MB |
| **SVLK** | PDF | 5 MB |
| **FSC Certificate** | PDF | 5 MB |
| **NPWP** | PDF, JPG | 2 MB |
| **Akta Perusahaan** | PDF | 5 MB |

### Cara Upload

1. Buka halaman **Profil**
2. Scroll ke bagian **"Dokumen Legalitas"**
3. Klik **"Tambah Dokumen"**
4. Pilih **jenis dokumen** dari dropdown
5. Upload file
6. Klik **"Simpan"**

> Dokumen yang sudah diupload hanya bisa dilihat oleh pengguna yang bersangkutan dan admin Enabler. Dokumen **tidak** bisa dilihat oleh pengguna lain.

---

## 10.5 Profil B2B

Setiap pengguna (kecuali Buyer biasa) memiliki **profil bisnis** yang bisa dilihat publik.

### Informasi di Profil B2B

| Informasi | Supplier | Generator | Aggregator | Converter | Enabler |
|-----------|:--------:|:---------:|:----------:|:---------:|:-------:|
| Nama Usaha | ✅ | ✅ | ✅ | ✅ | ✅ |
| Alamat | ✅ | ✅ | ✅ | ✅ | ✅ |
| Nomor Telepon | ✅ | ✅ | ✅ | ✅ | ✅ |
| Website | ✅ | ✅ | ✅ | ✅ | — |
| Kapasitas Produksi | ✅ | ✅ | ✅ | ✅ | — |
| Sertifikasi | ✅ | ✅ | — | ✅ | — |
| Rating | ✅ | ✅ | ✅ | ✅ | — |

### Mengakses Profil B2B

1. Klik **nama pengguna** di kartu produk/pesanan
2. Atau cari di halaman pencarian pengguna
3. Profil B2B menampilkan informasi bisnis yang bisa dihubungi

---

### Ringkasan Bab 10

| Fitur | Halaman | Akses |
|-------|---------|-------|
| 💰 Dompet Digital | `/wallet` | Semua role |
| 🔔 Notifikasi | `/notifications` | Semua role |
| 💬 Chat | `/chat` | Semua role |
| 📄 Dokumen Legalitas | `/profile` → Dokumen | Semua role |
| 👤 Profil B2B | `/profile` | Semua role |

---
➡️ **Lanjut ke [Bab 11: Traceability & QR Code](./11-bab-11-traceability.md)**
