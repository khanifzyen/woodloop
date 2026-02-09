Berikut adalah **Roadmap Pengembangan (Development Sequence)** untuk aplikasi *WoodLoop*.

Membangun aplikasi dengan 5 aktor berbeda sekaligus adalah pekerjaan besar. Kesalahan pemula adalah mencoba mengerjakan semuanya berbarengan. Strategi terbaik adalah menggunakan pendekatan **"Flow of Data"** (Alur Data). Kita harus membangun halaman di mana data *dibuat* terlebih dahulu, baru halaman di mana data *dikonsumsi*.

Berikut adalah urutan pengerjaan halaman yang paling logis, efisien, dan minim *bug*:

---

### **FASE 1: Fondasi & Identitas (The Skeleton)**
*Tujuan: Memastikan user bisa masuk ke dalam sistem dan database mengenali siapa mereka.*

Urutan pengerjaan:
1.  **Splash Screen:** Logo WoodLoop muncul 2-3 detik. (Penting untuk branding awal).
2.  **Onboarding Screens (3 Halaman):** Slide edukasi (Masalah Limbah -> Solusi Sirkular -> Ajakan Bertindak).
3.  **Role Selection (Pilih Peran):** Halaman krusial berisi 5 kartu (Supplier, Generator, dll). Ini menentukan flow berikutnya.
4.  **Register & Login (Authentication):**
    *   Form Register (Input standar + Lokasi GPS).
    *   Form Login.
    *   *Lupa Password (bisa ditunda, tapi sebaiknya ada).*
5.  **User Profile Setup:** Halaman edit profil sederhana (Nama, Alamat Gudang, No WA).

> **Kenapa ini duluan?** Karena tanpa login dan role, Anda tidak bisa mengetes halaman dashboard yang berbeda-beda nanti.

---

### **FASE 2: Hulu - Penciptaan Data (The Supply Side)**
*Tujuan: Memastikan ada "barang" (limbah) yang masuk ke sistem. Fokus pada aktor **GENERATOR** (UKM).*

Urutan pengerjaan:
6.  **Generator Dashboard:** Tampilan awal Generator. Masih kosong, tapi kerangka UI (Saldo, Tombol Besar "+") sudah ada.
7.  **Form Input Limbah ("Setor Limbah"):**
    *   *Versi 1 (MVP):* Upload foto manual, pilih jenis kayu (dropdown), isi estimasi berat manual.
    *   *Versi 2 (Advanced):* Integrasi AI Camera untuk deteksi otomatis (kerjakan ini belakangan).
8.  **Success Page (Konfirmasi Setor):** "Limbah berhasil diupload! Menunggu penjemputan."
9.  **Riwayat Setor:** List status limbah (Menunggu -> Diangkut -> Terjual).

> **Kenapa ini duluan?** Aplikasi ini "mati" jika tidak ada data limbah. Generator adalah *trigger* utama seluruh sistem.

---

### **FASE 3: Logistik - Perpindahan Data (The Bridge)**
*Tujuan: Mengambil data limbah dari Generator dan memindahkannya ke Aggregator. Fokus pada aktor **AGGREGATOR** (Pengepul).*

Urutan pengerjaan:
10. **Aggregator Dashboard (Map View):**
    *   Integrasi Google Maps SDK.
    *   Menampilkan data inputan dari Fase 2 sebagai "Pin Merah" di peta.
11. **Order Detail (Popup di Peta):** Saat pin diklik, muncul detail (Foto, Jenis Kayu, Lokasi).
12. **Route Planner / "Ambil Order":** Halaman list order yang dipilih untuk dijemput hari ini.
13. **Konfirmasi Penjemputan:** Halaman untuk Aggregator memvalidasi berat riil saat sampai di lokasi Generator. (Ini akan mengupdate status di Fase 2 menjadi "Diangkut").
14. **Gudang Aggregator (Inventory):** Halaman stok milik Aggregator setelah barang diangkut.

---

### **FASE 4: Hilir - Konsumsi Data (The Demand Side)**
*Tujuan: Menjual limbah ke pengrajin kreatif. Fokus pada aktor **CONVERTER & DESAINER**.*

Urutan pengerjaan:
15. **Marketplace (Katalog Bahan):** Menampilkan data dari gudang Aggregator (Fase 3).
    *   Filter: Jenis Kayu, Bentuk, Lokasi.
16. **Product Detail:** Halaman detail limbah dengan tombol "Beli" atau "Tawar".
17. **Checkout / Transaksi:** Flow pembelian sederhana (bisa integrasi Payment Gateway atau COD dulu).
18. **Klinik Desain / Resep:** Halaman statis berisi upload PDF/Gambar sketsa desain (bisa dikerjakan paralel karena tidak terlalu bergantung data *live*).

---

### **FASE 5: Validasi & Dampak (The Value Add)**
*Tujuan: Memberikan nilai tambah (Traceability & Laporan) untuk **ENABLER** dan **BUYER**.*

Urutan pengerjaan:
19. **QR Code Generator:** Logic di backend untuk membuat ID unik setiap transaksi selesai.
20. **Public Traceability Page (Webview):** Halaman yang muncul saat QR Code discan (Storytelling perjalanan kayu).
21. **Enabler Dashboard:** Grafik statistik. Ini dikerjakan paling akhir karena hanya *membaca* (read-only) data rekapitulasi dari Fase 2, 3, dan 4.

---

### **FASE 6: Fitur Pendukung & Poles (Polishing)**
*Tujuan: Menyempurnakan pengalaman pengguna.*

Urutan pengerjaan:
22. **Notification Center:** Halaman notifikasi (misal: "Truk sedang menuju lokasi Anda").
23. **Dompet Digital (Saldo Sampah):** UI riwayat transaksi keuangan.
24. **Chat System:** Fitur chat antara Converter dan Desainer (opsional, bisa pakai tombol WA dulu untuk awal).

---

### **Rangkuman Flow Pengerjaan (Summary)**

Jika Anda memiliki tim developer, berikut pembagian kerjanya:

*   **Sprint 1 (Minggu 1-2):** Auth, Database Setup, Profile, Generator Input (Manual).
*   **Sprint 2 (Minggu 3-4):** Aggregator Map, Logic Status Perubahan (New -> Picked up -> Inventory).
*   **Sprint 3 (Minggu 5-6):** Marketplace UI, Transaksi Beli, Logic Saldo.
*   **Sprint 4 (Minggu 7-8):** QR Code, Public Page, Dashboard Pemerintah, AI Integration (mulai riset).

**Tips Pro:**
Jangan buat Dashboard Pemerintah (Enabler) di awal. Itu hanya "pemanis". Fokuslah pada fitur **Jual (Generator) -> Angkut (Aggregator) -> Beli (Converter)**. Jika siklus ini macet, dashboard pemerintah tidak akan ada isinya.