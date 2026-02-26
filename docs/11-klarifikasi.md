# Klarifikasi — Jawaban atas Need Attention

Dokumen ini mencatat keputusan yang telah dikonfirmasi berdasarkan `docs/10-need-attention.md`.

**Tanggal:** 26 Februari 2026

---

## A. Flow Kritis yang Hilang

| # | Item | Keputusan |
| :--- | :--- | :--- |
| **A1** | Supplier → Generator: tidak ada koneksi | ✅ **Dieksekusi** — Tambahkan akses Raw Timber Marketplace dari Generator Dashboard |
| **A2** | Aggregator → Converter: tidak ada checkout | ✅ **Dieksekusi** — Buat halaman detail + checkout bahan limbah di Converter |
| **A3** | Enabler: hanya 1 halaman | ⏸️ **Dipending** — Akan dikerjakan di fase berikutnya |
| **A4** | Generator: tidak ada riwayat setor limbah | ✅ **Dieksekusi** — Integrasikan riwayat ke Order Management page |
| **A5** | Buyer: tidak ada detail produk | ✅ **Dieksekusi** — Buat halaman Product Detail untuk Buyer |

---

## B. Area yang Perlu Konfirmasi

| # | Item | Keputusan |
| :--- | :--- | :--- |
| **B1** | Wallet: internal atau catatan saja? | 📝 **Catatan transaksi saja** — Payment gateway masuk MVP 2 |
| **B2** | Bidding / Lelang | ✅ **Dieksekusi** — Buat halaman bidding (UI dulu) |
| **B3** | AI Camera / Computer Vision | 📝 **Form manual saja** — AI di iterasi berikutnya |
| **B4** | Route Planner / GPS Tracking | 📝 **Planning / UI dulu** — Belum implementasi fitur GPS real |
| **B5** | `add_generator_product_page.dart` | 📝 **Generator menjual produk jadi/furniture** — Bukan mini-converter, ini untuk mebel/furniture yang diproduksi Generator |

---

## C. Saran Perbaikan

| # | Item | Keputusan |
| :--- | :--- | :--- |
| **C1** | Registrasi per-role atau dinamis? | ✅ **Dinamis** — Gabungkan 5 halaman jadi 1 dengan field berdasarkan role |
| **C2** | Bottom Navigation Bar | ✅ **Dieksekusi** — Tambahkan BottomNavigationBar di semua dashboard per role |
| **C3** | State Management (BLoC) | ⏸️ **Planning dulu** — Akan dijalankan di MVP ini |
| **C4** | QR Code integration | ⏸️ **Planning dulu** — Akan dijalankan di MVP ini |
| **C5** | Field tambahan di `users` | ✅ **Sudah ditambahkan** di `07-skema.md` |
| **C6** | Realtime subscriptions | ⏸️ **Planning dulu** — Akan dijalankan di MVP ini |
| **C7** | API Rules keamanan | ⏸️ **Planning dulu** — Akan dijalankan di MVP ini |
| **C8** | B2B Profile Page | 📝 **Profil publik untuk Aggregator/Converter** — Agar bisa dilihat mitra bisnis |

---

## Dampak Terhadap Skema Database

Berdasarkan keputusan di atas, perubahan pada `docs/07-skema.md`:
- **`bids` collection** ditambahkan (untuk fitur Bidding/Lelang)
- **`generator_products` collection** ditambahkan (untuk produk furniture Generator, terpisah dari `products` milik Converter)
- **B2B Profile** diperjelas sebagai profil publik Aggregator/Converter di `users`
