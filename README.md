# WoodLoop: Jepara Circular Hub

**WoodLoop** adalah platform digital yang menghubungkan ekosistem industri kayu di Jepara untuk mengubah limbah menjadi sumber daya bernilai ekonomi tinggi. Aplikasi ini memfasilitasi pencatatan, perdagangan, dan pelacakan (traceability) limbah kayu dari hulu ke hilir.

## 🌟 Fitur Utama

- **Multi-Role System**: Mendukung 7 peran pengguna (Supplier, Generator, Aggregator, Converter, Desainer, Enabler, Buyer).
- **Generator Dashboard**: Generator (pengrajin) dapat memoto dan menjual limbah kayu dengan mudah.
- **Aggregator Map**: Peta interaktif untuk penjemputan limbah yang efisien.
- **Marketplace Bahan Baku**: Katalog bahan daur ulang untuk industri kreatif.
- **Traceability System**: Pelacakan riwayat kayu dari hutan hingga produk jadi via QR Code.
- **Impact Dashboard**: Visualisasi dampak lingkungan (CO2 dicegah & limbah terselamatkan).

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla).
- **Peta**: Leaflet.js & OpenStreetMap.
- **Grafik**: Chart.js.
- **Database (Prototipe)**: LocalStorage (Browser).

## 📂 Struktur Proyek

```
woodloop/
├── docs/                   # Dokumentasi Proyek (Konsep, Desain, PRD, RAB)
├── style.css               # Global Stylesheet
├── script.js               # Global Logic (Auth, Mock Data, Routing)
├── index.html              # Splash Screen
├── onboarding.html         # Pengenalan Aplikasi
├── role-selection.html     # Pilihan Peran
├── register.html           # Pendaftaran
├── login.html              # Masuk
├── generator-*.html        # Halaman Generator (Hulu)
├── aggregator-*.html       # Halaman Aggregator (Logistik)
├── marketplace.html        # Marketplace Bahan (Hilir)
├── store.html              # Toko Produk Jadi (Buyer)
├── traceability.html       # Halaman Publik Jejak Kayu
├── enabler-dashboard.html  # Halaman Pemerintah/Dinas
└── ... (file pendukung lainnya)
```

## 🚀 Cara Menjalankan

Karena ini adalah prototipe berbasis web statis, Anda bisa menjalankannya dengan mudah:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/khanifzyen/woodloop.git
    cd woodloop
    ```

2.  **Buka di Browser**
    Buka file `index.html` menggunakan browser modern (Chrome, Firefox, Edge).
    Atau gunakan ekstensi "Live Server" di VS Code untuk pengalaman terbaik.

## 📚 Dokumentasi Lengkap

Dokumentasi detail mengenai proyek ini dapat ditemukan di folder `docs/`:
- [01-konsep.md](docs/01-konsep.md): Latar belakang dan ide dasar.
- [02-spesifikasi-design.md](docs/02-spesifikasi-design.md): Panduan desain UI/UX.
- [03-roadmap-implementasi.md](docs/03-roadmap-implementasi.md): Rencana pengembangan.
- [04-prd.md](docs/04-prd.md): Spesifikasi Kebutuhan Produk (PRD).
- [05-rab.md](docs/05-rab.md): Rencana Anggaran Biaya (RAB).

## 👥 Tim Pengembang

Dibuat oleh **Akhmad Khanif Zyen** untuk inisiatif ekonomi sirkular Jepara.

---
*© 2026 WoodLoop Project.*
