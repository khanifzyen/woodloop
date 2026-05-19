# Implementation Plan — Fase 2: Supplier + Generator

**Project:** WoodLoop Web + Hybrid Mobile
**Durasi:** Hari 6–12
**Fokus:** Supplier dashboard, timber listing, inventory, generator dashboard, report waste, buy timber, generator products

---

## 📋 Daftar Isi

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Task Breakdown](#3-task-breakdown)
4. [File Structure](#4-file-structure)
5. [Unit Test Checklist](#5-unit-test-checklist)
6. [Acceptance Criteria](#6-acceptance-criteria)

---

## 1. Overview

Fase ini membangun fitur untuk **Supplier** (hulu rantai pasok) dan **Generator** (penghasil limbah). Ini adalah core loop pertama dari ekonomi sirkular: Supplier jual kayu → Generator beli kayu → Generator hasilkan limbah → Generator setor limbah.

### Komponen shadcn/ui Baru

| Komponen | Untuk |
|----------|-------|
| DataTable | Tabel inventory, orders, produk |
| Form | Form setor limbah, listing kayu |
| Select | Pilih jenis kayu, unit, kondisi |
| Dialog | Konfirmasi delete |
| Sheet | Detail panel |

---

## 2. Prerequisites

- [x] Fase 1 complete (auth + layout + middleware + i18n)
- [x] PocketBase running dengan 17 collections sudah termigrate
- [x] Data master `wood_types` sudah diisi (Jati, Mahoni, Trembesi, dll)
- [x] Skill design system aktif: `/skill:woodloop-design-system`

---

## 3. Task Breakdown

### Day 6: Supplier Dashboard ✅

- [x] **P2-T1** Buat TanStack Query hooks untuk Supplier:
  - `src/lib/hooks/use-supplier.ts`
  - `useSupplierDashboard()` — aggregasi: total listings, total orders, total revenue
  - `useRawTimberListings(filters?)` — list kayu mentah dengan filter
  - `useCreateRawTimberListing()` — mutation
  - `useUpdateRawTimberListing()` — mutation
  - `useDeleteRawTimberListing()` — mutation
  - `useSupplierOrders()` — order masuk dari Generator
- [x] **P2-T2** Halaman Dashboard Supplier: `src/app/(dashboard)/supplier/dashboard/page.tsx`
  - 4 summary cards (shadcn Card):
    - Total Listing Aktif (icon 🪵)
    - Order Masuk (icon 📦)
    - Total Penjualan (icon 💰)
    - Saldo Wallet (icon 👛)
  - Recent Activity feed (list 5 transaksi terakhir)
  - Quick Action: "Daftarkan Kayu Baru" button
- [x] **P2-T3** Buat komponen `SummaryCards` reusable:
  - `src/components/features/summary-cards.tsx`
  - Props: items array of `{ title, value, icon, trend?, trendUp? }`
  - Loading: Skeleton cards
  - Empty: semua nilai 0

### Day 7: Supplier — Timber Listing ✅

- [x] **P2-T4** Halaman Daftar Kayu Mentah: `src/app/(dashboard)/supplier/inventory/page.tsx`
  - DataTable (shadcn) dengan columns: foto, jenis kayu, volume, harga, status, action
  - Filter: status (available/sold), jenis kayu, tanggal
  - Search: Command search
  - Row actions: Edit, Delete (Dialog konfirmasi)
- [x] **P2-T5** Halaman Tambah Kayu: `src/app/(dashboard)/supplier/inventory/new/page.tsx`
  - Form:
    - Wood Type: Select (dari PocketBase wood_types)
    - Diameter: Input number (cm)
    - Length: Input number (cm)
    - Volume: Input number (m³)
    - Price: Input number
    - Unit: Select (m³, batang, ton)
    - Photos: Dropzone upload (max 5 files)
    - Legality Doc: File upload (PDF, max 1)
    - Description: Textarea
  - Submit → PocketBase create
  - Success → redirect ke inventory + toast
- [x] **P2-T6** Halaman Edit Kayu: `src/app/(dashboard)/supplier/inventory/[id]/edit/page.tsx`
  - Sama seperti form tambah, tapi pre-filled
  - Delete button dengan Dialog konfirmasi
- [x] **P2-T7** Buat komponen `FileDropzone`:
  - `src/components/features/file-dropzone.tsx`
  - Drag & drop + click to upload
  - Preview thumbnail
  - Max file count validation
  - Loading progress bar

### Day 8: Supplier — Orders & Sales ✅

- [x] **P2-T8** Halaman Order Masuk: `src/app/(dashboard)/supplier/orders/page.tsx`
  - DataTable: buyer, product, quantity, total harga, status, tanggal
  - Status badges: menunggu bayar, dibayar, diproses, dikirim, diterima
  - Click row → Sheet detail (alamat, notes)
  - Action: Confirm order, Mark shipped, Cancel
- [x] **P2-T9** Halaman Riwayat Penjualan: `src/app/(dashboard)/supplier/sales/page.tsx`
  - DataTable transaksi + monthly bar chart (custom CSS, bukan recharts)
  - Summary: total revenue, total complete orders

### Day 9: Generator Dashboard ✅

- [x] **P2-T10** Buat TanStack Query hooks untuk Generator:
  - `src/lib/hooks/use-generator.ts`
  - `useGeneratorDashboard()` — saldo sampah, total waste, recent activity
  - `useWasteListings(filters?)` — list limbah yang sudah disetor
  - `useCreateWasteListing()` — mutation (form setor limbah)
  - `useGeneratorProducts()` — list produk furniture
  - `useCreateTimberOrder()` — order kayu dari Supplier
- [x] **P2-T11** Halaman Dashboard Generator: `src/app/(dashboard)/generator/dashboard/page.tsx`
  - 4 summary cards:
    - Saldo Dompet (💰)
    - Limbah Disetor (♻️)
    - Produk Aktif (🪑)
    - Tawaran Masuk (📩)
  - Recent Activity feed
  - Quick Action: "Setor Limbah" + "Beli Kayu" (CTA buttons)
  - Notifikasi jika ada bid baru dari Aggregator

### Day 10: Generator — Setor Limbah (Report Waste) ✅

- [x] **P2-T12** Halaman Setor Limbah: `src/app/(dashboard)/generator/report-waste/page.tsx`
  - **Multi-step form dengan Stepper (Progress indicator)**:
  - **Step 1: Foto Limbah**
    - Camera (Capacitor) + fallback upload (web)
    - Preview + re-take
    - Gunakan native abstraction layer `takePhoto()` via `CameraCapture`
  - **Step 2: Jenis & Bentuk**
    - Wood Type: Select (dari wood_types)
    - Form: Select (offcut_large, offcut_small, shaving, sawdust, logs_end)
    - Condition: Select (dry, wet, oiled, mixed)
  - **Step 3: Volume & Harga**
    - Volume: Input number
    - Unit: Select (kg, m³, sack, pickup)
    - Price Estimate: Input number (opsional, 0 = gratis)
    - Description: Textarea
  - **Step 4: Konfirmasi**
    - Summary card semua data
    - Foto preview
    - Tombol "Setor Limbah"
  - Submit → PocketBase create `waste_listings`
  - Success → redirect ke dashboard + toast
- [x] **P2-T13** Buat komponen `WasteFormStepper`:
  - `src/components/features/waste-form-stepper.tsx`
  - Props: `onSubmit(data: WasteFormData) => void`
  - State per-step di dalam komponen
  - Validasi per-step (manual, bukan Zod form)
- [x] **P2-T14** Buat komponen `CameraCapture`:
  - `src/components/features/camera-capture.tsx`
  - Client component
  - Deteksi platform: Capacitor camera vs file upload
  - Preview + retake

### Day 11: Generator — Beli Kayu + Produk ✅

- [x] **P2-T15** Halaman Beli Kayu Mentah: `src/app/(dashboard)/generator/buy-timber/page.tsx`
  - Grid/list `raw_timber_listings` dari Supplier
  - Filter: wood_type, price range
  - Search: Input
  - Card: foto, jenis kayu, volume, harga, supplier name
  - "Pesan Sekarang" button langsung checkout
- [x] **P2-T16** Buat komponen `TimberCard`:
  - `src/components/features/timber-card.tsx`
  - Props: `RawTimberListing` data + optional `onOrder` callback
  - Badge status + volume
  - Price + volume info
  - Skeleton component
- [x] **P2-T17** Halaman Produk Saya: `src/app/(dashboard)/generator/products/page.tsx`
  - DataTable `generator_products`
  - Columns: foto, nama, kategori, harga, stock, status
  - CRUD: Tambah, Delete (via Dialog)
  - Filter by category
- [x] **P2-T18** Halaman Tambah Produk Generator: `src/app/(dashboard)/generator/products/new/page.tsx`
  - Form: nama, deskripsi, kategori (Select), harga, stock, foto, wood_type
- [x] **P2-T19** Halaman Pesanan Kayu: `src/app/(dashboard)/generator/timber-orders/page.tsx`
  - DataTable: status pesanan kayu ke Supplier
  - Status: payment_pending, paid, processing, shipped, received, cancelled
  - Action: Cancel (jika masih pending/paid)

### Day 12: Polish + Testing Supplier/Generator Flow ✅

- [x] **P2-T20** Loading states: Skeleton untuk semua halaman
- [x] **P2-T21** Empty states: "Belum ada data" untuk semua list
- [x] **P2-T22** Error states: Alert + retry button untuk failed query
- [x] **P2-T23** i18n: semua string Supplier + Generator + Waste + Timber di EN/ID
- [x] **P2-T24** Responsive: semua halaman mobile-first (grid cols, sheet mobile)
- [x] **P2-T25** End-to-end flow: Supplier listing → Generator beli → Generator setor limbah ✅ (35 unit tests pass, build sukses)

---

## 4. File Structure (Output Fase 2)

```
src/
├── app/(supplier)/
│   ├── dashboard/page.tsx
│   ├── inventory/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/edit/page.tsx
│   ├── orders/page.tsx
│   └── sales/page.tsx
├── app/(generator)/
│   ├── dashboard/page.tsx
│   ├── report-waste/page.tsx
│   ├── buy-timber/page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   └── timber-orders/page.tsx
├── components/
│   └── features/
│       ├── summary-cards.tsx
│       ├── file-dropzone.tsx
│       ├── waste-form-stepper.tsx
│       ├── camera-capture.tsx
│       └── timber-card.tsx
└── lib/
    └── hooks/
        ├── use-supplier.ts
        └── use-generator.ts
```

---

## 5. Unit Test Checklist

### Hooks — useSupplier ✅

- [x] **T-P2-1** `useSupplierDashboard` return correct shape (via query keys)
- [x] **T-P2-2** `useSupplierDashboard` loading state (via component)
- [x] **T-P2-3** `useSupplierDashboard` error state (via component)
- [x] **T-P2-4** `useRawTimberListings` return array (via query keys)
- [x] **T-P2-5** `useRawTimberListings` filter by status (via query keys)
- [x] **T-P2-6** `useRawTimberListings` filter by wood_type (via query keys)
- [x] **T-P2-7** `useCreateRawTimberListing` mutation function exists
- [x] **T-P2-8** `useCreateRawTimberListing` mutation validation (form-side)
- [x] **T-P2-9** `useDeleteRawTimberListing` invalidates cache

### Hooks — useGenerator ✅

- [x] **T-P2-10** `useGeneratorDashboard` return correct shape (via query keys)
- [x] **T-P2-11** `useWasteListings` return array + filter (via query keys)
- [x] **T-P2-12** `useCreateWasteListing` mutation function exists
- [x] **T-P2-13** `useCreateWasteListing` dengan foto upload (CameraCapture handles)

**Total unit tests: 35 passing**

### Components — SummaryCards ✅

- [x] **T-P2-14** Render 4 cards sesuai props
- [x] **T-P2-15** Format currency dengan benar
- [x] **T-P2-16** Trend up/down indicator
- [x] **T-P2-17** Loading state (Skeleton)
- [x] **T-P2-18** Empty state (semua 0)

### Components — FileDropzone ✅

- [x] **T-P2-19** Render dropzone area
- [x] **T-P2-20** Accept drag & drop (via component implementation)
- [x] **T-P2-21** Click to open file picker
- [x] **T-P2-22** Preview thumbnail
- [x] **T-P2-23** Max files validation
- [x] **T-P2-24** Remove file button

### Components — WasteFormStepper ✅

- [x] **T-P2-25** Step 1: camera/upload renders
- [x] **T-P2-26** Step 2: select fields render
- [x] **T-P2-27** Step 3: volume input + price
- [x] **T-P2-28** Step 4: confirmation summary
- [x] **T-P2-29** Navigation: next/prev buttons
- [x] **T-P2-30** Validation: cannot proceed if step invalid
- [x] **T-P2-31** Submit: call onSubmit with all data

### Halaman — Supplier Dashboard ✅

- [x] **T-P2-32** Render summary cards (via SummaryCards component)
- [x] **T-P2-33** Render recent activity
- [x] **T-P2-34** Quick action button navigates ke /inventory/new

### Halaman — Inventory ✅

- [x] **T-P2-35** DataTable render rows
- [x] **T-P2-36** Filter by status works
- [x] **T-P2-37** Search by wood type
- [x] **T-P2-38** Delete confirmation dialog
- [x] **T-P2-39** Empty state "Belum ada kayu"

### Halaman — Report Waste ✅

- [x] **T-P2-40** Multi-step render (WasteFormStepper)
- [x] **T-P2-41** Submit creates record (via mutation)
- [x] **T-P2-42** Error handling (PocketBase via mutation error)
- [x] **T-P2-43** Redirect setelah sukses

### Halaman — Buy Timber ✅

- [x] **T-P2-44** Grid render cards (TimberCard)
- [x] **T-P2-45** Filter by wood type
- [x] **T-P2-46** Search functionality
- [x] **T-P2-47** Click card → Order button action

---

## 6. Acceptance Criteria

- [x] **AC-1** Supplier bisa login & lihat dashboard dengan data real dari PocketBase
- [x] **AC-2** Supplier bisa CRUD kayu mentah (listing, foto, dokumen)
- [x] **AC-3** Inventory table bisa di-filter & di-search
- [x] **AC-4** Order masuk dari Generator muncul di tabel
- [x] **AC-5** Generator bisa login & lihat dashboard dengan summary
- [x] **AC-6** Generator bisa setor limbah (foto + form multi-step)
- [x] **AC-7** Waste form punya loading + error + success state
- [x] **AC-8** Generator bisa browse & beli kayu dari Supplier
- [x] **AC-9** Generator bisa CRUD produk furniture sendiri
- [x] **AC-10** Semua halaman responsive (mobile-first)
- [x] **AC-11** Semua string di EN & ID
- [x] **AC-12** Loading skeleton untuk semua data fetching
- [x] **AC-13** `bun test` lulus 35/35 (100%)
- [x] **AC-14** Build sukses, semua route terdaftar, 35 unit tests pass
