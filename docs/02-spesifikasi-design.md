Berikut adalah spesifikasi desain aplikasi **WoodLoop: Jepara Circular Hub**.

Pendekatan desain yang digunakanadalah **"Human-Centric & Role-Based"**. Mengingat penggunanya bervariasi dari tukang gergaji (lapangan) hingga pejabat dinas (kantoran), antarmuka (UI) tidak boleh "satu ukuran untuk semua".

Berikut adalah dokumen **Spesifikasi Desain UI/UX (Design Document)** secara komprehensif.

---

### **A. Filosofi Desain & Sistem Visual**
*   **Warna Utama:** *Deep Forest Green* (#2E7D32) untuk keberlanjutan, *Wood Brown* (#8D6E63) untuk material, dan *White/Off-White* untuk kebersihan antarmuka.
*   **Tipografi:** *Sans-serif* modern (misal: Inter atau Roboto) yang mudah dibaca di layar HP di bawah sinar matahari (untuk user lapangan).
*   **Navigasi:** *Bottom Navigation Bar* untuk user mobile (Generator, Supplier, Aggregator), dan *Sidebar Menu* untuk user desktop/tablet (Enabler, Designer).

---

### **B. Daftar Fitur Utama (Core Features)**
1.  **Multi-Role Authentication:** Sistem login cerdas yang mengarahkan user ke tampilan berbeda sesuai peran.
2.  **AI Waste Scanner:** Kamera pintar pendeteksi jenis & volume limbah (Computer Vision).
3.  **Smart Routing Map:** Peta interaktif dengan algoritma rute penjemputan terpendek.
4.  **Marketplace Limbah:** Katalog jual-beli material bekas terstandarisasi.
5.  **Digital Wallet (Saldo Sampah):** Pencatatan keuangan otomatis dari hasil penjualan limbah.
6.  **Design Recipe Library:** Pustaka desain produk turunan untuk inspirasi pengrajin.
7.  **Traceability Generator (QR Code):** Pembuat paspor digital produk (riwayat kayu).
8.  **Carbon Offset Tracker:** Kalkulator dampak lingkungan *real-time*.
9.  **Bidding System (Lelang):** Fitur tawar-menawar harga tumpukan limbah.
10. **E-Certificate Generator:** Penerbit sertifikat "Green UKM" otomatis.

---

### **C. Strategi Dashboard & Data Sharing**
**Pertanyaan:** *Apakah dashboard sama dan datanya terlihat semua?*
**Jawab:** **TIDAK.**
Sistem menggunakan konsep **"Satu Database, Lima Lensa"**. Semua data tersimpan di satu tempat, tapi aksesnya dibatasi (*Role-Based Access Control*).

*   **Generator** tidak boleh melihat data keuangan **Aggregator**.
*   **Supplier** tidak perlu melihat grafik kebijakan **Enabler**.
*   **Shared Data (Data yang bisa dilihat semua):**
    *   Harga pasar limbah saat ini.
    *   Total dampak lingkungan (Global Impact Counter) untuk motivasi bersama.

---

### **D. Rincian Halaman & Deskripsi Visual**

#### **1. ONBOARDING (Intro Aplikasi)**
*Target: User baru yang baru menginstall aplikasi.*

*   **Halaman 1: The Problem**
    *   **Visual:** Ilustrasi tumpukan kayu bekas yang terbakar dengan asap (sedikit suram namun estetik).
    *   **Copy:** "Jangan Bakar Uang Anda."
    *   **Sub-copy:** "Ubah limbah kayu menjadi pendapatan tambahan. Bersihkan lingkungan, tebalkan dompet."
*   **Halaman 2: The Solution**
    *   **Visual:** Animasi kayu bekas berubah menjadi ikon produk mebel cantik dengan panah berputar (sirkular).
    *   **Copy:** "Ekosistem Sirkular Jepara."
    *   **Sub-copy:** "Terhubung dengan ratusan pengrajin, pengepul, dan desainer dalam satu aplikasi WoodLoop."
*   **Halaman 3: The Action**
    *   **Visual:** Seseorang memegang HP, memotret kayu, dan muncul notifikasi "Saldo Masuk".
    *   **Copy:** "Foto, Jual, Cuan."
    *   **Sub-copy:** "Teknologi AI kami membantu Anda menilai harga limbah dalam hitungan detik."
    *   **Button:** "Mulai Sekarang" (Primary Color).

#### **2. AUTHENTICATION (Register & Login)**

*   **Halaman Pilih Peran (Role Selector) - *Sangat Krusial***
    *   **Visual:** 5 Kartu Besar dengan Ikon & Judul:
        1.  🌲 **Supplier** (Penyedia Kayu)
        2.  🪚 **Generator** (Penghasil Limbah/UKM)
        3.  🚚 **Aggregator** (Logistik/Pengepul)
        4.  🎨 **Converter/Desainer** (Pengolah & Kreatif)
        5.  🏛️ **Enabler** (Pemerintah/Asosiasi)
    *   **Interaksi:** Saat diklik, warna kartu berubah aktif, lalu muncul tombol "Lanjut Daftar".

*   **Halaman Register (Form Dinamis sesuai PDF Hal 1-2)**
    *   *Input Umum:* Nama, Email/No.HP, Password.
    *   *Jika Generator:* Tambahan field "Kapasitas Produksi", "Jenis Mesin", "Lokasi GPS".
    *   *Jika Aggregator:* Tambahan field "Jenis Armada Truk", "Kapasitas Gudang".
    *   **Visual:** Form bersih, *step-by-step* (Wizard) agar tidak membosankan.

*   **Halaman Login**
    *   Input: No. HP/Email & Password.
    *   Fitur: "Lupa Password" & "Login dengan Google".

---

#### **3. DASHBOARD APLIKASI (Per Role)**

Berikut adalah detail tampilan untuk 3 aktor utama (karena paling kompleks):

---

### **A. Tampilan GENERATOR (Penghasil Limbah)**
*Fokus UX: Kecepatan Input & Insentif Uang.*

**1. Home Dashboard**
*   **Header:** "Halo, Pak Slamet!" + Saldo Dompet Digital (Rp 500.000) - *Font Besar & Tebal*.
*   **Hero Button (FAB):** Tombol Kamera Bulat Besar di tengah bawah ikon "+" dengan label **"Jual Limbah"**.
*   **Recent Activity:** List riwayat setor (misal: "Setor Jati - Menunggu Jemputan").

**2. Halaman "Setor Limbah" (AI Camera Flow)**
*   **Viewfinder:** Tampilan kamera penuh.
*   **AI Overlay:** Saat kamera diarahkan ke tumpukan kayu, muncul kotak bounding box (seperti deteksi wajah) dengan label realtime: *"Terdeteksi: Potongan Jati (80%)"*.
*   **Confirmation Screen:**
    *   Foto hasil jepretan.
    *   Form Otomatis Terisi: Jenis (Jati), Estimasi Volume (1 Pickup), Estimasi Harga.
    *   User bisa edit jika AI salah.
    *   **Button:** "Posting ke Marketplace".

**3. Halaman "Saldo & Poin"**
*   Grafik pendapatan bulanan dari sampah.
*   Badge Level: "Pahlawan Lingkungan" (Gamification).

---

### **B. Tampilan AGGREGATOR (Pengepul)**
*Fokus UX: Peta & Efisiensi Rute.*

**1. Home Dashboard (Map View)**
*   **Tampilan Utama:** Google Maps layar penuh.
*   **Pin Drops:**
    *   🔴 **Pin Merah:** Limbah baru (<24 jam).
    *   🟢 **Pin Hijau:** Tumpukan besar/Siap angkut.
    *   🟡 **Pin Kuning:** Sedang dalam proses tawar/lelang.
*   **Filter:** "Area Jepara Utara", "Khusus Kayu Jati".

**2. Halaman "Route Planner"**
*   User memilih 3-5 titik Pin Hijau.
*   **Button:** "Buat Rute Jemput".
*   **Output:** Aplikasi menggambar garis rute paling hemat bensin di peta & estimasi total muatan (kg).

**3. Halaman Gudang (Inventory)**
*   List stok yang sudah dijemput: "Stok Gudang: Jati (2 Ton), Mahoni (500kg)".
*   Status: Siap Jual ke Converter.

---

### **C. Tampilan CONVERTER & DESAINER**
*Fokus UX: Eksplorasi & Belanja (E-Commerce style).*

**1. Home Dashboard (Marketplace)**
*   **Search Bar:** "Cari bahan... (ex: Potongan Sonokeling)".
*   **Categories:** Offcut Besar, Serbuk Gergaji, Kulit Kayu.
*   **Section:** "Resep Desain Populer" (Inspirasi produk apa yang bisa dibuat dari stok yang ada).

**2. Halaman Detail Produk Limbah**
*   Foto tumpukan (dari Generator).
*   Data Teknis: Kadar air (jika ada), Lokasi Gudang Aggregator.
*   **Button:** "Beli Sekarang" atau "Tawar (Bid)".

**3. Halaman "Klinik Desain"**
*   User mengupload sketsa PDF/JPG.
*   Menautkan sketsa dengan jenis limbah yang dibutuhkan.
*   Kolom Chat/Diskusi dengan Converter lain.

---

### **D. Tampilan ENABLER (Pemerintah/Dinas)**
*Fokus UX: Monitoring & Laporan.*

**1. Executive Dashboard**
*   **Big Numbers:**
    *   Total Limbah Terselamatkan (Ton).
    *   Total Transaksi Ekonomi (Rp).
    *   Emisi CO2 Dicegah (Kg).
*   **Grafik:** Tren bulanan partisipasi UKM.
*   **Action:** Tombol "Terbitkan Sertifikat Green UKM" (Approval list).

---

### **E. Tampilan BUYER (Masyarakat Umum)**
*Fokus UX: Storytelling.*

**1. Landing Page (Hasil Scan QR Code Produk)**
*   Halaman ini diakses tanpa login (Web View).
*   **Header:** Foto Produk Jadi.
*   **Timeline (Jejak Kayu):** Garis waktu vertikal animasi.
    *   🌱 *Origin:* Hutan Rakyat (Pak Alex).
    *   🪚 *Waste:* Sisa produksi Lemari (Pak Slamet).
    *   🚚 *Logistics:* Diangkut (Mas Yono).
    *   🎨 *Rebirth:* Dibuat ulang jadi Jam Tangan Kayu (Ibu Sari).
*   **Impact Card:** "Dengan membeli produk ini, Anda menyelamatkan 0.5kg kayu dari pembakaran."

---

### **Kesimpulan Struktur Navigasi**

Untuk memudahkan pengembang, berikut adalah sitemap sederhana:

1.  **Splash Screen** (Logo WoodLoop)
2.  **Onboarding**
3.  **Auth** (Role Selection -> Register/Login)
4.  **Main App** (Bercabang 5 sesuai role):
    *   **Generator:** Home (Dashboard) | Scan (Kamera) | Wallet | Profile
    *   **Aggregator:** Map (Peta) | Orders (Pesanan) | Inventory | Profile
    *   **Converter:** Shop (Katalog) | Designs (Resep) | My Products (QR Gen) | Profile
    *   **Enabler:** Dashboard (Stats) | Certification | Users List
    *   **Supplier:** Input Log | History
5.  **Public Page:** Traceability Story (Web view).

