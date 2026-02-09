Aplikasi ini adalah sebuah **Platform Orkestrasi Rantai Nilai (Value Chain Orchestration Platform)** untuk **Ekosistem Ekonomi Sirkular** (khususnya industri kayu di Jepara).

Secara sederhana, ini adalah aplikasi **Supply Chain Management (SCM) yang digabungkan dengan Marketplace**, di mana fokus utamanya adalah mengelola **limbah kayu** agar tidak dibuang/dibakar, melainkan diolah kembali menjadi produk bernilai.

Berikut adalah rincian mendalam mengenai spesifikasi aplikasi tersebut:

---

### 1. Konsep Utama Aplikasi
Nama Proyek: **JEPARA CIRCULAR HUB**
Tujuan: Menghubungkan aktor-aktor industri kayu yang terfragmentasi (terpisah-pisah) untuk mengubah limbah menjadi sumber daya baru, mencatat jejak karbon (lingkungan), dan efisiensi logistik.

### 2. Aktor (Pengguna) & Peran Mereka
Aplikasi ini memiliki **Satu Back-end** (pusat data) tetapi **5 Tampilan Front-end (UI)** yang berbeda tergantung siapa yang login:

| Aktor | Peran Nyata | Fungsi di Aplikasi |
| :--- | :--- | :--- |
| **Supplier** | Pedagang Kayu Gelondongan | Memasukkan data kayu mentah (awal rantai pasok). |
| **Generator** | Pengrajin Mebel / Sawmill (UKM) | Penghasil limbah. Mereka memfoto tumpukan sisa kayu dan menjualnya via aplikasi. |
| **Aggregator** | Pengepul / Logistik | "Uber"-nya sampah. Melihat peta lokasi limbah, menjemput, dan menyortir. |
| **Converter & Desainer** | Pengrajin Souvenir / Energi | Pembeli limbah. Mereka membeli sampah kayu untuk diubah jadi produk baru (misal: tatakan gelas, wall panel). |
| **Enabler** | Pemerintah (Dinas LH) / Asosiasi | Pemantau. Melihat dashboard statistik (berapa pohon terselamatkan, emisi CO2 berkurang). |
| **Buyer (Publik)** | Pembeli Produk Jadi | Konsumen akhir yang men-scan QR Code untuk melihat cerita asal-usul produk. |

---

### 3. Workflow (Alur Kerja Sistem)
Sistem ini bekerja dalam siklus tertutup (circular):

1.  **Input Hulu (Supplier):** Supplier memotret log kayu, upload surat legalitas, jenis, dan volume. Tercipta data digital awal.
2.  **Creation of Waste (Generator):** Pengrajin mebel memproduksi mebel, tersisa limbah (potongan kecil/serbuk).
3.  **Digitalisasi Limbah:** Generator membuka fitur "Setor Limbah", memfoto tumpukan, AI mendeteksi jenis kayu, dan sistem memberi estimasi harga.
4.  **Penjemputan (Aggregator):** Pengepul mendapat notifikasi. Melihat peta ("Peta Harta Karun"), membuat rute jemput paling efisien ke beberapa UKM sekaligus.
5.  **Transaksi & Transformasi (Converter):** Pengrajin kreatif melihat "Katalog Bahan" (seperti Tokopedia tapi isinya limbah), membeli bahan dari pengepul, dan melihat "Resep Desain" untuk cara mengolahnya.
6.  **Output & Traceability:** Produk jadi ditempel QR Code. Jika di-scan pembeli, muncul riwayat: *"Kayu ini sisa dari Pak Budi, diangkut Mas Joko, dibuat ulang oleh Ibu Sari"*.

---

### 4. Data yang Dicatat (Database Schema)
Berdasarkan "Form Identifikasi Limbah" (PDF 2) dan fitur UI (PDF 1), berikut data vital yang harus ada:

#### A. Data Profil (User & Company)
*   **Identitas:** Nama Perusahaan, Pemilik, Kontak, Alamat & Koordinat GPS (Penting untuk peta).
*   **Skala & Legalitas:** Tahun berdiri, Jumlah pekerja, Sertifikasi (SVLK/FSC).
*   **Operasional:** Jenis produk utama, Sumber bahan baku (Perhutani/Hutan Rakyat).

#### B. Data Inventori & Limbah (Sangat Detail)
Aplikasi harus bisa membedakan jenis limbah secara spesifik:
*   **Jenis Kayu:** Jati, Mahoni, Trembesi, Mindi, Sungkai, Akasia, dll.
*   **Bentuk Limbah:**
    *   *Offcut Besar/Kecil* (Potongan sisa).
    *   *Shaving* (Pasahan/serutan).
    *   *Serbuk Gergaji* (Sawdust).
    *   *Kepelan* (Ujung kayu tak beraturan).
*   **Kondisi:** Kering, Basah, Kena Oli, Tercampur.
*   **Satuan:** M3, Kg, Karung, Pickup, Gudang.
*   **Metrik:** Yield (persentase kayu jadi), Defect rate.

#### C. Data Transaksi & Logistik
*   Harga beli/jual limbah.
*   Status penjemputan (Menunggu, Diangkut, Di Gudang Pengepul).
*   Saldo Dompet Digital ("Saldo Sampah").

#### D. Data Dampak (Impact)
*   Volume limbah terselamatkan (Ton).
*   Emisi CO2 yang dicegah (konversi rumus dari volume limbah).
*   Nilai ekonomi yang tercipta.

---

### 5. Fitur-Fitur Kunci (Tech Specs)

Jika Anda ingin membangun ini, berikut adalah fitur teknis yang perlu dikembangkan:

1.  **AI Recognition (Computer Vision):**
    *   Fitur di mana kamera HP bisa mengenali *"Ini kayu Jati, bentuk potongan kecil"* secara otomatis saat Generator memfoto limbah.
2.  **Live Map & Routing (GIS):**
    *   Integrasi Google Maps untuk Aggregator. Menampilkan pin merah (limbah baru <24 jam) dan pin hijau (siap angkut). Algoritma untuk mengurutkan rute terdekat.
3.  **E-Commerce & Bidding System:**
    *   Marketplace untuk jual beli limbah.
    *   Fitur "Bursa Lelang" agar pengepul bisa menawar tumpukan limbah sebelum menjemput.
4.  **Traceability (Blockchain/QR Code):**
    *   Setiap perpindahan barang menghasilkan ID unik (Hash). Saat produk jadi, ID ini dicetak jadi QR Code untuk *storytelling* ke pembeli.
5.  **Dashboard Analytics:**
    *   Visualisasi grafik untuk pemerintah (Dinas LH) memantau target pengurangan sampah.