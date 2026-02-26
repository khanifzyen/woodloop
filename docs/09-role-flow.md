# Business Flow per Role — WoodLoop

Dokumen ini merinci **alur bisnis (business workflow)** untuk setiap peran pengguna berdasarkan analisis seluruh halaman di `woodloop_app/lib/features/` dan dokumentasi PRD.

---

## 1. 🔑 Flow Umum (Semua Role): Autentikasi & Onboarding

Semua pengguna melewati alur yang sama sebelum masuk ke dashboard masing-masing.

```
Splash Screen
  └─→ Onboarding (3 slide: Problem → Solution → Action)
        └─→ Role Selection (pilih 1 dari 6 peran)
              ├─→ Register (form spesifik per role)
              │     └─→ Dashboard sesuai role
              └─→ Login
                    ├─→ Dashboard sesuai role
                    └─→ Forgot Password
                          └─→ Login
```

**Halaman terkait:**
- `splash_page.dart`
- `onboarding_page.dart`
- `role_selection_page.dart`
- `login_page.dart`
- `forgot_password_page.dart`

---

## 2. 🌲 Supplier — Pemasok Kayu Gelondongan

**Peran:** Memasukkan data kayu mentah ke dalam sistem (awal rantai pasok).

### A. Flow Utama: Input & Jual Kayu Mentah

```
Supplier Dashboard
  ├─→ List Raw Timber Form (input data kayu mentah: jenis, volume, harga, foto, legalitas)
  │     └─→ Kayu tersedia di Raw Timber Marketplace
  ├─→ Raw Timber Marketplace (lihat katalog kayu mentah yang dijual)
  │     └─→ Detail & status pesanan
  └─→ Supplier Sales History (riwayat penjualan kayu)
```

### B. Flow Pendukung

```
Supplier Dashboard
  ├─→ Notification Center (notifikasi pesanan masuk, pembayaran, dll)
  ├─→ Messages List → Direct Message (chat dengan Generator/pembeli)
  └─→ WoodLoop Digital Wallet (saldo & riwayat transaksi)
```

**Halaman terkait:**
- `supplier_registration_page.dart`
- `supplier_dashboard_page.dart`
- `list_raw_timber_form_page.dart`
- `supplier_sales_history_page.dart`
- `raw_timber_marketplace_page.dart`

---

## 3. 🪚 Generator — Pengrajin / Penghasil Limbah

**Peran:** Menghasilkan limbah kayu dari proses produksi, lalu menjualnya via platform.

### A. Flow Utama: Setor & Jual Limbah

```
Generator Dashboard (lihat Saldo Sampah, Aktivitas Terkini)
  ├─→ Report Wood Waste Form (foto limbah, pilih jenis kayu, estimasi berat & harga)
  │     └─→ Waste Listing tersedia (status: available → booked → collected → sold)
  ├─→ Generator Order Management (kelola pesanan limbah dari Aggregator)
  │     └─→ Konfirmasi serah terima limbah
  └─→ Add Generator Product (tambah produk kayu/mebel yang dijual sendiri)
```

### B. Flow Pendukung

```
Generator Dashboard
  ├─→ Notification Center
  ├─→ Messages List → Direct Message (chat dengan Aggregator untuk jadwal jemput)
  └─→ WoodLoop Digital Wallet (saldo dari penjualan limbah)
```

**Halaman terkait:**
- `generator_registration_page.dart`
- `generator_dashboard_page.dart`
- `report_wood_waste_form_page.dart`
- `generator_order_management_page.dart`
- `add_generator_product_page.dart`

---

## 4. 🚚 Aggregator — Pengepul / Logistik

**Peran:** Menjemput limbah dari Generator, menyortir, menyimpan di gudang, dan menjual ke Converter.

### A. Flow Utama: Jemput & Kelola Stok

```
Aggregator Dashboard (overview statistik: total pickup, berat, revenue)
  ├─→ Aggregator Treasure Map (peta interaktif titik limbah)
  │     └─→ Pilih titik → lihat detail → "Angkut"
  ├─→ Confirm Pickup Collection (validasi berat riil & bukti foto saat jemput)
  │     └─→ Status waste_listing berubah: available → collected
  │     └─→ Item masuk ke Warehouse Inventory
  └─→ Warehouse Inventory Log (stok gudang: berat, jenis, status siap jual)
        └─→ Limbah tersedia di Waste Materials Marketplace (Converter)
```

### B. Flow Pendukung

```
Aggregator Dashboard
  ├─→ Notification Center (notifikasi limbah baru, permintaan jemput)
  ├─→ Messages List → Direct Message (chat dengan Generator)
  └─→ WoodLoop Digital Wallet
```

**Halaman terkait:**
- `aggregator_registration_page.dart`
- `aggregator_dashboard_page.dart`
- `aggregator_treasure_map_page.dart`
- `confirm_pickup_collection_page.dart`
- `warehouse_inventory_log_page.dart`

---

## 5. ♻️ Converter — Pengolah / Pengrajin Kreatif

**Peran:** Membeli bahan limbah, mengolahnya menjadi produk baru (upcycle), dan menjualnya di marketplace.

### A. Flow Utama: Beli Bahan → Buat Produk → Jual

```
Converter Studio Dashboard (overview: produk, penjualan, stok bahan)
  ├─→ Waste Materials Marketplace (katalog bahan daur ulang dari Aggregator)
  │     └─→ Detail → Beli / Tawar → Checkout
  ├─→ Design Clinic & Inspiration (pustaka "resep" desain produk dari limbah)
  ├─→ My Upcycled Catalog (daftar produk jadi hasil upcycle)
  │     └─→ Generate QR Code → Traceability Page
  └─→ Create Upcycled Product Form (buat produk baru: nama, foto, harga, sumber bahan)
        └─→ Produk tampil di Upcycled Products Marketplace (Buyer)
```

### B. Flow Pendukung

```
Converter Studio Dashboard
  ├─→ Notification Center
  ├─→ Messages List → Direct Message (chat dengan Aggregator/Buyer)
  ├─→ WoodLoop Digital Wallet
  └─→ B2B Profile Page (profil bisnis untuk interaksi antar pelaku usaha)
```

**Halaman terkait:**
- `converter_registration_page.dart`
- `converter_studio_dashboard_page.dart`
- `waste_materials_marketplace_page.dart`
- `design_clinic_inspiration_page.dart`
- `my_upcycled_catalog_page.dart`
- `create_upcycled_product_form_page.dart`

---

## 6. 🛒 Buyer — Konsumen Akhir

**Peran:** Membeli produk jadi dari Converter dan melacak asal-usul kayu via QR Code.

### A. Flow Utama: Belanja & Lacak

```
Buyer Profile & Impact Dashboard (statistik dampak lingkungan pribadi)
  ├─→ Upcycled Products Marketplace (galeri produk jadi berkelanjutan)
  │     ├─→ Detail Produk → "Beli"
  │     └─→ "Lihat Perjalanan" 🌱 → Product Story & Traceability Page
  ├─→ Marketplace Category Hub (filter: kategori, jenis kayu, harga)
  ├─→ Your Shopping Cart (keranjang belanja)
  │     └─→ Secure Checkout & Payment (pembayaran: QRIS/VA/dll)
  └─→ Order Tracking & Journey (lacak status pesanan: processing → shipped → received)
```

### B. Flow Pendukung

```
Buyer Dashboard
  ├─→ Notification Center (notifikasi pesanan, pengiriman)
  ├─→ Messages List → Direct Message (chat dengan Converter)
  └─→ WoodLoop Digital Wallet
```

**Halaman terkait:**
- `buyer_registration_page.dart`
- `buyer_profile_impact_dashboard_page.dart`
- `upcycled_products_marketplace_page.dart`
- `marketplace_category_hub_page.dart`
- `your_shopping_cart_page.dart`
- `secure_checkout_payment_page.dart`
- `order_tracking_journey_page.dart`

---

## 7. 📊 Enabler — Pemerintah / Dinas / Asosiasi

**Peran:** Memantau dampak lingkungan dan ekonomi, serta memverifikasi pelaku usaha.

### A. Flow Utama: Monitor & Verifikasi

```
Impact Analytics Dashboard (read-only)
  ├─→ KPI Cards (Limbah Terselamatkan, CO2 Dicegah, Nilai Ekonomi)
  ├─→ Grafik tren bulanan partisipasi UKM
  ├─→ Top Contributors (peringkat Generator/Aggregator paling aktif)
  └─→ (Belum ada di app) Verifikasi UKM Hijau / Sertifikasi
```

### B. Flow Pendukung

```
Impact Analytics Dashboard
  ├─→ Notification Center
  ├─→ Messages List → Direct Message
  └─→ (Tidak butuh Wallet karena bukan aktor transaksi)
```

**Halaman terkait:**
- `impact_analytics_dashboard_page.dart`

---

## 8. 🌐 Fitur Lintas-Peran (Shared / Cross-Role)

Fitur-fitur berikut dapat diakses oleh semua peran:

| Fitur | Halaman | Deskripsi |
| :--- | :--- | :--- |
| **Chat** | `messages_list_page.dart`, `direct_message_conversation_page.dart` | Komunikasi antar aktor (misal: Aggregator ↔ Generator) |
| **Notifikasi** | `notification_center_page.dart` | Update pesanan, penjemputan, pembayaran |
| **Dompet Digital** | `woodloop_digital_wallet_page.dart` | Saldo, top-up, riwayat transaksi |
| **Traceability** | `select_wood_source_history_page.dart`, `product_story_traceability_page.dart` | Jejak kayu dari hutan → produk jadi (QR Code) |
| **Profil** | `designer_consultant_profile_page.dart`, `b2b_profile_page.dart` | Profil publik / B2B |

---

## 9. Diagram Alur Data Keseluruhan (End-to-End)

```
┌──────────┐    Kayu Mentah     ┌───────────┐    Limbah Produksi    ┌────────────┐
│ SUPPLIER │ ──────────────────→│ GENERATOR │ ─────────────────────→│ AGGREGATOR │
│ (Input)  │    Raw Timber      │  (Waste)  │   Report Wood Waste   │ (Logistik) │
└──────────┘    Marketplace     └───────────┘                       └─────┬──────┘
                                                                          │
                                                                    Pickup & Sorting
                                                                          │
                                                                          ▼
┌──────────┐    Beli Produk     ┌───────────┐    Beli Bahan Limbah  ┌────────────┐
│  BUYER   │ ←──────────────────│ CONVERTER │ ←─────────────────────│  Warehouse │
│(Konsumen)│    Marketplace     │ (Upcycle) │   Waste Marketplace   │ (Gudang)   │
└────┬─────┘                    └─────┬─────┘                       └────────────┘
     │                                │
     │  Scan QR Code                  │  Generate QR Code
     ▼                                ▼
┌──────────────────────────────────────────────┐
│          TRACEABILITY PAGE (Public)          │
│   "Kayu ini dari Pak Budi → diangkut Mas    │
│    Joko → diolah Ibu Sari → dibeli Anda"    │
└──────────────────────────────────────────────┘
                      ▲
                      │  Monitor Dampak
               ┌──────┴──────┐
               │   ENABLER   │
               │ (Dashboard) │
               └─────────────┘
```
