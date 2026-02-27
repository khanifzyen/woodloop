# Implementation Plan — WoodLoop MVP 1

**Tanggal:** 26 Februari 2026
**Target:** MVP 1 — UI/UX Complete + Backend Integration

---

## Fase 0: Perbaikan Arsitektur UI (Minggu 1)
*Target: Memperbaiki fondasi navigasi dan registrasi sebelum menambah halaman baru.*

### 🔧 Minggu 1 — Refactoring Navigasi & Registrasi

| # | Task | Detail |
| :--- | :--- | :--- |
| 1 | **[x] Unified Registration Page** | Gabungkan 5 halaman registrasi (`supplier`, `generator`, `aggregator`, `converter`, `buyer`) menjadi 1 halaman dinamis. Field muncul berdasarkan `role` dari `RoleSelectionPage`. |
| 2 | **[x] Bottom Navigation Bar** per Role | Implementasi `StatefulShellRoute` di `go_router` untuk setiap role dashboard |
| 3 | **[x] Cleanup** | Hapus 5 file registrasi lama, perbarui routing di `app_router.dart` |

**Deliverable:** Navigasi lancar antar tab, registrasi 1 halaman, 0 linting errors.

---

## Fase 1: Halaman Baru — Missing Flows (Minggu 2)
*Target: Menutup gap flow yang teridentifikasi di `10-need-attention.md`.*

### 🆕 Minggu 2 — New Pages (UI/UX Only, Mock Data)

| # | Task | Detail |
| :--- | :--- | :--- |
| 1 | **[x] A1: Raw Timber Marketplace di Generator** | Tambahkan akses ke halaman Raw Timber Marketplace dari Generator Dashboard agar Generator bisa membeli bahan baku dari Supplier. |
| 2 | **[x] A2: Waste Material Detail + Checkout (Converter)** | Buat `waste_material_detail_page.dart` and `waste_checkout_page.dart`. Flow: Marketplace → Detail (foto, jenis, stok, harga, penjual) → Checkout (kuantitas, total, bayar). |
| 3 | **[x] A4: Waste History (Generator)** | Tambahkan tab "Riwayat Setor" di `generator_order_management_page.dart` yang menampilkan status setiap limbah yang disetor (Available → Booked → Collected → Sold). |
| 4 | **[x] A5: Product Detail (Buyer)** | Buat `product_detail_page.dart`: galeri foto, deskripsi, harga, tombol "Tambah ke Keranjang", tombol "Lihat Perjalanan Kayu 🌱" (link ke traceability). |
| 5 | **[x] B2: Bidding Page** | Buat `waste_bidding_page.dart` di fitur Aggregator. Menampilkan listing limbah yang bisa ditawar, form input harga bid, status bid (menunggu, diterima, ditolak). |

**Deliverable:** 4 halaman baru + 1 modifikasi, semua navigable, mock data, 0 linting errors.

---

## Fase 2: Backend Setup — PocketBase (Minggu 3)
*Target: Membuat fondasi backend dengan PocketBase.*

### 🗄️ Minggu 3 — Database & API

| # | Task | Detail |
| :--- | :--- | :--- |
| 1 | **[x] Setup PocketBase** | Instalasi, konfigurasi, deploy lokal/VPS |
| 2 | **[x] Buat Collections** | Implementasi 15+ koleksi sesuai `07-skema.md` (users, wood_types, waste_listings, pickups, warehouse_inventory, marketplace_transactions, products, orders, cart_items, wallet_transactions, impact_metrics, chats, notifications, design_recipes, bids, generator_products, raw_timber_listings) |
| 3 | **[x] API Rules** | Setup RBAC per koleksi sesuai `07-skema.md` |
| 4 | **[x] Seed Data** | Data awal: wood_types (Jati, Mahoni, dll), demo users per role, sample waste_listings |
| 5 | **[x] PocketBase Hooks** | Hook di `pb_hooks/main.pb.js` untuk: auto-create warehouse_inventory saat pickup completed, auto-calculate impact_metrics, auto-create notification |

**Deliverable:** PocketBase berjalan dengan data seed, API rules, hooks aktif.

---

## Fase 3: State Management & Integrasi API (Minggu 4-5)
*Target: Menghubungkan Flutter dengan PocketBase.*

### 🔗 Minggu 4 — Auth & Core BLoCs

| # | Task | Detail |
| :--- | :--- | :--- |
| 1 | **[x] PocketBase SDK Integration** | Tambahkan `pocketbase_dart` package, setup connection, auth service |
| 2 | **[x] AuthBloc** | Login, register, session management, auto-redirect per role |
| 3 | **[x] UserProfileBloc** | CRUD profil pengguna |
| 4 | **[x] Repository Pattern** | Implementasi data layer (datasource → repository → usecase) per fitur |

### 🔗 Minggu 5 — Feature BLoCs

| # | Task | Detail |
| :--- | :--- | :--- |
| 1 | **[x] WasteListingBloc** | CRUD waste listings (Generator) |
| 2 | **[x] PickupBloc** | Buat & kelola penjemputan (Aggregator) |
| 3 | **[x] WarehouseBloc** | Stok gudang (Aggregator) |
| 4 | **[x] MarketplaceBloc** | Browse & beli bahan (Converter) |
| 5 | **[x] ProductBloc** | CRUD produk upcycled (Converter) |
| 6 | **[x] CartBloc & OrderBloc** | Keranjang & pesanan (Buyer) |
| 7 | **[x] WalletBloc** | Riwayat transaksi wallet |

**Deliverable:** Semua halaman terhubung ke PocketBase, data real-time.

---

## Fase 4: Fitur Spesifik (Minggu 6-7)
*Target: Implementasi fitur kunci yang membedakan WoodLoop.*

### ⚙️ Minggu 6 — Traceability & QR Code

| # | Task | Detail |
| :--- | :--- | :--- |
| 1 | **QR Code Generation** | Gunakan `qr_flutter`, auto-generate saat produk dibuat converter |
| 2 | **Traceability Page** | Halaman publik (WebView) yang menampilkan jejak kayu: Supplier → Generator → Aggregator → Converter |
| 3 | **Impact Metrics Auto-calculate** | Hook PocketBase: hitung CO2 saved saat pickup completed |

### ⚙️ Minggu 7 — Maps & Realtime

| # | Task | Detail |
| :--- | :--- | :--- |
| 1 | **Peta Interaktif (Aggregator)** | Integrasi `flutter_map` + OpenStreetMap. Pin = waste_listings berdasarkan GPS |
| 2 | **Chat Realtime** | PocketBase Realtime Subscriptions pada koleksi `chats` |
| 3 | **Notifikasi Realtime** | Subscribe ke `notifications` collection |

**Deliverable:** QR Code functional, peta live, chat & notifikasi realtime.

---

## Fase 5: Polish & Testing (Minggu 8)
*Target: User testing, bug fixing, optimisasi.*

### 🧪 Minggu 8 — QA & Deployment

| # | Task | Detail |
| :--- | :--- | :--- |
| 1 | **UI Review** | Cek responsivitas, warna, tipografi, animasi di berbagai device |
| 2 | **Flow Testing** | Test end-to-end per role: register → dashboard → action → result |
| 3 | **Edge Cases** | Validasi form, handling error (no internet, 404, unauthorized) |
| 4 | **Performance** | Lazy loading, image optimization, pagination |
| 5 | **Deployment** | PocketBase ke VPS, Flutter build APK/Web |

**Deliverable:** MVP 1 siap demo, APK/Web deployable.

---

## Rangkuman Timeline

| Minggu | Fase | Fokus |
| :--- | :--- | :--- |
| **1** | Fase 0 | Refactoring navigasi (BottomNav) + Registrasi dinamis |
| **2** | Fase 1 | Halaman baru (5 pages: detail, checkout, bidding, history) |
| **3** | Fase 2 | PocketBase setup, collections, API rules, hooks, seed |
| **4-5** | Fase 3 | State management (BLoC) + integrasi API per fitur |
| **6-7** | Fase 4 | QR Code, peta interaktif, chat & notifikasi realtime |
| **8** | Fase 5 | QA, testing end-to-end, deployment |

---

## Catatan Penting

> [!IMPORTANT]
> **Saat ini (Minggu 1-2) fokus di UI/UX saja.** Semua halaman menggunakan mock data. Backend integration dimulai di Minggu 3.

> [!NOTE]
> **MVP 2 (pasca minggu 8):** Payment Gateway (Midtrans/Xendit), AI Camera, Route Optimization, Enabler Advanced (verifikasi UKM, sertifikat), Offline Mode.
