# Dokumen Kebutuhan Produk (Product Requirement Document - PRD)

**Nama Proyek:** WoodLoop: Jepara Circular Hub
**Versi:** 1.0
**Status:** Prototipe Selesai / Alpha
**Terakhir Diperbarui:** 09 Februari 2026

---

## 1. Pendahuluan

### 1.1 Tujuan
WoodLoop adalah **Platform Orkestrasi Rantai Nilai (Value Chain Orchestration Platform)** yang dirancang untuk memfasilitasi ekosistem ekonomi sirkular bagi industri kayu di Jepara, Indonesia. Platform ini menghubungkan pemangku kepentingan yang terfragmentasi untuk mengubah limbah kayu menjadi sumber daya bernilai, memastikan pertumbuhan ekonomi sekaligus mengurangi dampak lingkungan.

### 1.2 Masalah yang Dihadapi
- **Penumpukan Limbah:** Limbah kayu dalam jumlah besar dari produksi furnitur seringkali dibakar atau dibuang begitu saja.
- **Rantai Pasok Terfragmentasi:** Kurangnya koordinasi antara penghasil limbah (Generator) dan pengguna potensial (Converter).
- **Peluang Ekonomi Terlewatkan:** Limbah dipandang sebagai sampah, bukan sebagai sumber daya.
- **Kurangnya Ketertelusuran (Traceability):** Tidak ada transparansi mengenai asal-usul atau keberlanjutan produk kayu.

### 1.3 Sasaran (Goal)
Menciptakan platform digital terpadu yang mampu:
1.  Mendigitalisasi inventaris limbah kayu.
2.  Mengoptimalkan logistik untuk pengumpulan limbah.
3.  Memfasilitasi perdagangan bahan baku kayu daur ulang.
4.  Menyediakan ketertelusuran hulu-ke-hilir untuk produk jadi.
5.  Memvisualisasikan data dampak lingkungan.

---

## 2. Peran Pengguna & Persona

Platform ini melayani enam peran pengguna yang berbeda, masing-masing dengan alur kerja spesifik:

| Peran | Deskripsi | Kebutuhan Utama |
| :--- | :--- | :--- |
| **Supplier** | Penyedia kayu gelondongan (Sawmill). | Pencatatan digital, koneksi ke generator. |
| **Generator** | Pengrajin mebel (UKM) penghasil limbah. | Kemudahan menjual limbah, pembayaran cepat, pengangkutan limbah. |
| **Aggregator** | Logistik/Pengepul. | Perencanaan rute efisien, manajemen gudang, pencocokan permintaan. |
| **Converter** | Industri kreatif/Pengolah limbah. | Akses ke bahan daur ulang berkualitas, inspirasi desain, ketertelusuran bahan. |
| **Enabler** | Pemerintah (Dinas LH) / Asosiasi. | Pemantauan dampak lingkungan, data untuk pembuatan kebijakan. |
| **Buyer** | Masyarakat umum (Konsumen akhir). | Membeli produk berkelanjutan, memverifikasi asal produk (storytelling). |

---

## 3. Spesifikasi Fungsional

### 3.1 Autentikasi & Onboarding
- **Layar Pembuka (Splash Screen):** Pengenalan branding aplikasi.
- **Onboarding:** Tutorial 3 slide yang menjelaskan masalah, solusi, dan manfaat aplikasi.
- **Pemilihan Peran:** Pengguna wajib memilih satu dari 6 peran saat pertama kali masuk.
- **Registrasi:** Formulir spesifik per peran (contoh: lokasi GPS untuk Generator).
- **Login:** Autentikasi berbasis Nomor HP/Email (Prototipe menggunakan mock localStorage).
- **Manajemen Profil:** Mengelola alamat/lokasi, melihat lencana (badge), edit profil, dan logout.

### 3.2 Alur Kerja Generator (Sisi Hulu/Supply)
- **Dashboard:**
    - Melihat "Saldo Sampah" (Dompet Digital).
    - Akses cepat ke "Jual Limbah" (Setor Limbah).
    - Umpan Aktivitas Terkini (Recent Activity Feed).
    - Tombol akses cepat ke Chat dan Notifikasi.
- **Input Limbah (Setor Limbah):**
    - **Unggah Foto:** Mengambil gambar tumpukan limbah (Simulasi deteksi AI).
    - **Formulir:** Memilih jenis kayu (Jati, Mahoni, dll), estimasi berat, dan harga.
    - **Lokasi:** Penandaan koordinat GPS otomatis.
- **Riwayat:** Daftar limbah yang disetor dengan pelacakan status (Menunggu -> Diangkut -> Terjual).

### 3.3 Alur Kerja Aggregator (Sisi Logistik)
- **Peta Langsung (Live Map):** Integrasi Leaflet.js yang menampilkan titik jemput limbah.
    - **Pin (Penanda):** Kode warna (Merah = Baru, Hijau = Siap Angkut).
    - **Popup:** Detail limbah (Jenis, Berat, Harga) + Aksi "Angkut".
    - **Tombol Melayang (Floating Actions):** Akses cepat ke Chat, Notifikasi, dan Gudang (Inventory).
- **Inventaris (Gudang):**
    - Daftar limbah yang telah dikumpulkan dan disimpan di gudang.
    - Manajemen status (Siap Jual ke Converter).

### 3.4 Alur Kerja Converter (Sisi Permintaan/Demand)
- **Marketplace:**
    - Katalog bahan baku kayu daur ulang yang tersedia.
    - Filter berdasarkan jenis kayu (Jati, Mahoni, dll).
    - Fitur pencarian (Search).
    - **Pembelian:** Membeli bahan menggunakan saldo digital.
- **Klinik Desain (Design Clinic):**
    - Pustaka "Resep" (ide) untuk mengolah jenis limbah tertentu menjadi produk.
- **Produk Saya (My Products):**
    - Daftar produk jadi hasil olahan (upcycle).
    - **Pembuatan Kode QR:** Membuat kode QR unik untuk setiap produk yang terhubung ke halaman ketertelusuran (traceability).

### 3.5 Alur Kerja Buyer (Konsumen)
- **Etalase Toko (Storefront):**
    - Galeri produk furnitur berkelanjutan yang siap beli.
    - **Tampilan Ketertelusuran:** Tombol "Lihat Perjalanan" (Ikon 🌱) pada kartu produk.
- **Halaman Ketertelusuran (Traceability Page):**
    - Halaman publik (dapat diakses via scan QR/Link, tanpa login).
    - **Timeline:** Menampilkan perjalanan kayu dari Hutan Rakyat -> Generator -> Aggregator -> Converter.
    - **Statistik Dampak:** Jumlah CO2 yang dihemat dan Limbah yang dialihkan untuk item spesifik tersebut.

### 3.6 Alur Kerja Enabler (Pemantau)
- **Dashboard Eksekutif:**
    - Statistik Agregat: Total Limbah Terselamatkan (Kg), CO2 Dicegah (Kg), Nilai Ekonomi Tercipta (Rp).
    - Grafik: Tren bulanan penyelamatan limbah.
    - Akses ke Laporan dan Verifikasi Pengguna (UKM Hijau).

### 3.7 Fitur Pendukung
- **Dompet Digital (Wallet):**
    - Saldo terpusat untuk semua peran transaksi.
    - Riwayat transaksi (Kredit/Debit).
    - Dapat diakses langsung dari kartu saldo di Dashboard.
- **Pusat Notifikasi:**
    - Pemberitahuan untuk update pesanan, penjemputan, pembayaran, dan promo.
    - Terintegrasi di header Dashboard.
- **Sistem Chat:**
    - Antarmuka pesan untuk komunikasi antar peran (misal: Aggregator menghubungi Generator untuk konfirmasi jemput).
    - Terintegrasi di header Dashboard.

---

## 4. Spesifikasi Teknis

### 4.1 Arsitektur Frontend
- **Tech Stack:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Sistem Desain:** Mobile-First, Google Fonts (Inter), Variabel CSS untuk theming konsisten.
- **Pustaka (Libraries):**
    - `Leaflet.js`: Peta Interaktif.
    - `Chart.js`: Visualisasi Data Grafik.
    - `qrcode.js`: Pembuatan Kode QR klient-side.

### 4.2 Manajemen Data (Fase Prototipe)
- **Penyimpanan:** Browser `localStorage` (Persisten di sisi klien).
- **Koleksi Data:**
    - `users`: Profil pengguna dan peran.
    - `wasteList`: Inventaris item limbah (terhubung ke Generator & Aggregator).
    - `transactions`: Riwayat dompet/keuangan.
    - `products`: Barang jadi (terhubung ke Converter & Buyer).
    - `notifications`: Notifikasi pengguna.
    - `chats`: Riwayat pesan.

### 4.3 Algoritma Kunci
- **Role-Based Routing:** Fungsi `handleLogin()` mengarahkan pengguna ke dashboard spesifik berdasarkan peran yang dipilih.
- **Logika Status Limbah:** State machine untuk item limbah: `Menunggu Penjemputan` -> `Diangkut` -> `Di Gudang` -> `Terjual`.
- **Kalkulasi Dampak:** Rumus: `Total Berat (Kg) * 1.5` = CO2 Dicegah (Kg).

---

## 5. Kebutuhan Non-Fungsional

- **Usability (Kegunaan):** Antarmuka harus cukup sederhana untuk pengguna non-teknis (misal: tukang kayu, sopir truk). Tombol besar, ikonografi jelas, teks bahasa Indonesia.
- **Performa:** Frontend ringan, waktu muat cepat bahkan di jaringan 3G.
- **Responsivitas:** Desain responsif penuh, dioptimalkan untuk viewport seluler (lebar 360px - 414px).
- **Keandalan:** (Masa Depan) Kemampuan offline-first untuk area dengan sinyal buruk.

---

## 6. Peta Jalan Masa Depan (Pasca-Prototipe)

### Fase 2: Integrasi Backend
- Mengganti `localStorage` dengan backend yang kuat (misal: Firebase, Supabase, atau Node.js/PostgreSQL).
- Mengimplementasikan Autentikasi JWT yang aman.
- Database real-time untuk pembaruan peta langsung (live tracking).

### Fase 3: AI & Fitur Cerdas
- **API Computer Vision:** Integrasi Google Cloud Vision atau model kustom untuk pengenalan jenis kayu dan estimasi volume otomatis via kamera.
- **Optimasi Rute:** Integrasi Google Maps API Directions Service untuk perutean multi-stop yang efisien bagi Aggregator.

### Fase 4: Ekosistem Keuangan
- **Payment Gateway:** Integrasi Midtrans/Xendit untuk top-up uang sungguhan dan penarikan dana ke rekening bank.
- **Layanan Escrow (Rekber):** Mengamankan dana selama transaksi berlangsung untuk mencegah penipuan.

---

**Disiapkan oleh:** Akhmad Khanif Zyen
**Untuk:** Tim Proyek WoodLoop
