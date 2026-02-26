# Need Attention — Temuan, Saran, dan Flow yang Hilang

Dokumen ini mencatat hasil analisis mendalam terhadap codebase `woodloop_app`, business flow per role, dan skema database PocketBase. Berisi **flow yang belum ada**, **area yang perlu konfirmasi**, dan **saran perbaikan**.

---

## 🔴 A. Flow Kritis yang Belum Ada (Missing Flows)

### A1. Supplier: Tidak Ada Koneksi ke Generator

**Masalah:** Supplier menjual kayu mentah via `raw_timber_marketplace`, tapi **tidak ada halaman bagi Generator untuk membeli dari Supplier**. Generator Dashboard tidak punya akses ke "Raw Timber Marketplace" — halaman tersebut hanya terdaftar di folder Supplier.

**Dampak:** Putus alur data Supplier → Generator.

**Saran:**
- Tambahkan akses ke "Raw Timber Marketplace" dari Generator Dashboard (atau buat tab khusus "Beli Bahan Baku" di Generator).
- Atau buat collection `raw_timber_orders` untuk mencatat transaksi kayu mentah antara Supplier dan Generator.

---

### A2. Aggregator → Converter: Tidak Ada Flow Pembelian yang Jelas

**Masalah:** Converter memiliki `waste_materials_marketplace_page.dart`, tapi **tidak ada halaman detail/checkout** untuk membeli bahan dari Aggregator. Flow berhenti di "lihat katalog", tanpa cart, checkout, atau konfirmasi pembelian.

**Dampak:** Flow inti (Aggregator → Converter) tidak tuntas.

**Saran:**
- Tambahkan halaman detail produk limbah di marketplace Converter (dengan tombol "Beli" atau "Tawar").
- Gunakan koleksi `marketplace_transactions` di skema database.
- Implementasikan flow: Browse → Detail → Checkout → Payment → Konfirmasi.

---

### A3. Enabler: Hanya 1 Halaman, Fitur Sangat Minim

**Masalah:** Enabler hanya punya 1 halaman (`impact_analytics_dashboard_page.dart`) yang bersifat read-only. Fitur yang disebut di PRD belum ada:
- ❌ **Verifikasi UKM Hijau** — tidak ada halaman untuk approve/reject UKM
- ❌ **Terbitkan Sertifikat** — tidak ada halaman sertifikasi
- ❌ **Daftar Pengguna** — tidak ada halaman untuk melihat dan memverifikasi user

**Saran:**
- Minimal tambahkan: `user_verification_page.dart` (list UKM + toggle verifikasi)
- Pertimbangkan: `certificate_page.dart` untuk sertifikat digital

---

### A4. Generator: Tidak Ada Halaman "Riwayat Setor Limbah"

**Masalah:** PRD menyebutkan "Riwayat Setor" dengan pelacakan status (Menunggu → Diangkut → Terjual), tapi Generator hanya punya `generator_order_management_page.dart` yang mengelola "pesanan masuk", bukan riwayat limbah yang sudah disetor.

**Saran:**
- Tambahkan `waste_history_page.dart` atau integrasikan view riwayat ke `generator_order_management_page.dart`.

---

### A5. Buyer: Tidak Ada Halaman "Detail Produk"

**Masalah:** Buyer punya marketplace (`upcycled_products_marketplace_page.dart`), tapi **tidak ada halaman detail produk** sebelum menambahkan ke keranjang. User langsung dari list ke cart.

**Saran:**
- Tambahkan `product_detail_page.dart` di fitur Buyer, berisi: foto gallery, deskripsi, harga, tombol "Beli", dan tombol "Lihat Perjalanan Kayu" (traceability).

---

## 🟡 B. Area yang Perlu Konfirmasi

### B1. Dompet Digital (Wallet): Internal atau Payment Gateway?

**Pertanyaan:** Apakah "Saldo Sampah" adalah:
1. **Saldo internal** (seperti e-money in-app) yang bisa di-top-up dan di-withdraw? → Butuh integrasi Payment Gateway (Midtrans/Xendit).
2. **Catatan transaksi saja** (hanya menampilkan riwayat tanpa uang sungguhan)? → Cukup koleksi `wallet_transactions`.

**Dampak:** Jika opsi 1, perlu koleksi `wallet_balances`, integrasi bank, dan flow KYC.

---

### B2. Bidding / Lelang: Diterapkan atau Tidak?

**Pertanyaan:** PRD dan desain menyebutkan "Bursa Lelang" dan tombol "Tawar (Bid)", tapi **tidak ada halaman bidding di Flutter app**.

**Saran:** Jika ingin diterapkan:
- Tambahkan koleksi `bids` (user, waste_listing, bid_amount, status)
- Tambahkan halaman bidding di Aggregator flow

---

### B3. AI Camera / Computer Vision: Sejauh Mana?

**Pertanyaan:** `report_wood_waste_form_page.dart` ada di app, tapi tidak jelas apakah AI recognition akan diimplementasikan atau hanya form manual dengan upload foto.

**Saran:** Di fase MVP, gunakan form manual. AI bisa ditambahkan di iterasi berikutnya via API terpisah.

---

### B4. Route Planner / GPS Tracking: Implementasi Real?

**Pertanyaan:** `aggregator_treasure_map_page.dart` ada, tapi apakah peta interaktif benar-benar akan menampilkan data real-time dari `waste_listings`?

**Saran:** Di fase MVP, gunakan mock data dulu. Integrasi Google Maps / Leaflet membutuhkan API key dan data koordinat yang valid.

---

### B5. Halaman `add_generator_product_page.dart`: Apa Fungsinya?

**Pertanyaan:** Generator punya halaman "Add Generator Product" yang tidak ada di PRD. Apakah ini untuk:
1. Generator yang juga menjual produk jadi (mebel)?
2. Generator mendaftarkan produk turunan sendiri?

**Saran:** Klarifikasi apakah Generator juga bisa berperan sebagai "mini-Converter". Jika ya, hubungkan ke `products` collection. Jika tidak, pertimbangkan menghapus halaman ini.

---

## 🟢 C. Saran Perbaikan & Enhancement

### C1. Registrasi: Perlu Halaman Per-Role atau Form Dinamis?

**Status saat ini:** Ada 5 halaman registrasi terpisah (`supplier_registration_page.dart`, `generator_registration_page.dart`, dll).

**Saran:** Pertimbangkan menggabungkan menjadi 1 halaman registrasi dengan field dinamis berdasarkan role yang dipilih. Ini mengurangi duplikasi kode dan memudahkan maintenance.

---

### C2. Navigasi: Tidak Ada Bottom Navigation Bar

**Masalah:** Semua halaman menggunakan navigasi flat (push/go), tanpa `BottomNavigationBar` atau `NavigationBar`. Pengguna harus menekan tombol "Back" terus-menerus.

**Saran:** Implementasikan `StatefulShellRoute` di `go_router` untuk setiap role dashboard, dengan tab:
- **Generator:** Home | Setor | Dompet | Profil
- **Aggregator:** Peta | Pesanan | Gudang | Profil
- **Converter:** Katalog | Desain | Produk Saya | Profil
- **Buyer:** Belanja | Keranjang | Pesanan | Profil
- **Supplier:** Dashboard | Input | Riwayat | Profil

---

### C3. State Management: Belum Ada BLoC/Cubit untuk Bisnis Logic

**Status:** Hanya ada `LanguageCubit` untuk i18n. Semua halaman menggunakan hardcoded/mock data.

**Saran prioritas BLoC:**
1. `AuthBloc` — login, register, session management
2. `WasteListingBloc` — CRUD limbah (Generator)
3. `PickupBloc` — proses penjemputan (Aggregator)
4. `CartBloc` — keranjang belanja (Buyer)
5. `WalletBloc` — saldo dan transaksi

---

### C4. Traceability: QR Code Generation Belum Terintegrasi

**Status:** Halaman `product_story_traceability_page.dart` dan `select_wood_source_history_page.dart` ada, tapi tidak ada logic untuk generate QR Code dan menghubungkannya ke `products.qr_code_id`.

**Saran:**
- Gunakan package `qr_flutter` untuk generate QR di Flutter
- QR Code berisi URL publik: `https://woodloop.app/trace/{qr_code_id}`
- Halaman traceability harus bisa diakses tanpa login (web view publik)

---

### C5. Skema Database: Field yang Belum Ada di `users`

Berdasarkan form registrasi di PRD, field berikut belum ada di skema `users`:
- `production_capacity` — kapasitas produksi (Generator)
- `machine_type` — jenis mesin (Generator)
- `fleet_type` — jenis armada truk (Aggregator)
- `warehouse_capacity` — kapasitas gudang (Aggregator)
- `certification_status` — status sertifikasi SVLK/FSC

> Sudah ditambahkan di `07-skema.md` yang diperbarui.

---

### C6. Realtime: PocketBase Subscriptions untuk Fitur Live

**Saran fitur yang membutuhkan realtime subscriptions:**
- Chat (`chats`) — pesan masuk instan
- Notifikasi (`notifications`) — push notification
- Status Pickup (`pickups`) — tracking real-time untuk Generator
- Treasure Map (`waste_listings`) — pin baru muncul otomatis di peta

---

### C7. Keamanan: API Rules Belum Diterapkan

**Masalah:** Tanpa API Rules yang ketat, setiap user bisa mengakses/memodifikasi data milik user lain.

**Saran:** Implementasikan API Rules seperti yang sudah dirinci di `07-skema.md`. Khusus untuk:
- `wallet_transactions` → **Create hanya via Hook** (bukan langsung dari client)
- `impact_metrics` → **Create hanya via Hook**
- `notifications` → **Create hanya via Hook**

---

### C8. B2B Profile Page: Tidak Jelas Konteksnya

**Status:** Ada `b2b_profile_page.dart` di folder `shared/`, tapi tidak disebutkan di PRD dan tidak terhubung ke flow manapun secara eksplisit.

**Saran:** Klarifikasi apakah ini:
1. Profil publik untuk Aggregator/Converter agar bisa dilihat mitra bisnis?
2. Halaman yang sama dengan `designer_consultant_profile_page.dart`?

---

## 📋 D. Ringkasan Prioritas

| Prioritas | Item | Kategori |
| :--- | :--- | :--- |
| 🔴 **P0** | A2: Flow checkout Converter (Aggregator → Converter) | Missing Flow |
| 🔴 **P0** | C2: Bottom Navigation Bar per role | UX |
| 🔴 **P0** | C3: State Management (AuthBloc minimal) | Architecture |
| 🟡 **P1** | A1: Koneksi Supplier → Generator | Missing Flow |
| 🟡 **P1** | A5: Halaman detail produk Buyer | Missing Flow |
| 🟡 **P1** | A4: Riwayat setor limbah Generator | Missing Flow |
| 🟡 **P1** | B1: Keputusan model Wallet | Konfirmasi |
| 🟡 **P1** | C7: API Rules keamanan | Security |
| 🟢 **P2** | A3: Halaman tambahan Enabler | Enhancement |
| 🟢 **P2** | B2: Bidding/Lelang | Konfirmasi |
| 🟢 **P2** | C1: Registrasi dinamis | Refactor |
| 🟢 **P2** | C4: QR Code integration | Feature |
| 🟢 **P2** | C6: Realtime subscriptions | Feature |
| ⚪ **P3** | B3: AI Camera | Future |
| ⚪ **P3** | B4: Route Planner real | Future |
