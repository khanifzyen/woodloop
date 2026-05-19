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

- [ ] Fase 1 complete (auth + layout + middleware + i18n)
- [ ] PocketBase running dengan 17 collections sudah termigrate
- [ ] Data master `wood_types` sudah diisi (Jati, Mahoni, Trembesi, dll)
- [ ] Skill design system aktif: `/skill:woodloop-design-system`

---

## 3. Task Breakdown

### Day 6: Supplier Dashboard

- [ ] **P2-T1** Buat TanStack Query hooks untuk Supplier:
  - `src/lib/hooks/use-supplier.ts`
  - `useSupplierDashboard()` — aggregasi: total listings, total orders, total revenue
  - `useRawTimberListings(filters?)` — list kayu mentah dengan filter
  - `useCreateRawTimberListing()` — mutation
  - `useUpdateRawTimberListing()` — mutation
  - `useDeleteRawTimberListing()` — mutation
  - `useSupplierOrders()` — order masuk dari Generator
- [ ] **P2-T2** Halaman Dashboard Supplier: `src/app/(supplier)/dashboard/page.tsx`
  - 4 summary cards (shadcn Card):
    - Total Listing Aktif (icon 🪵)
    - Order Masuk (icon 📦)
    - Total Penjualan (icon 💰)
    - Saldo Wallet (icon 👛)
  - Recent Activity feed (list 5 transaksi terakhir)
  - Quick Action: "Daftarkan Kayu Baru" button
- [ ] **P2-T3** Buat komponen `SummaryCards` reusable:
  - `src/components/features/summary-cards.tsx`
  - Props: items array of `{ title, value, icon, trend?, trendUp? }`
  - Loading: Skeleton cards
  - Empty: semua nilai 0

### Day 7: Supplier — Timber Listing

- [ ] **P2-T4** Halaman Daftar Kayu Mentah: `src/app/(supplier)/inventory/page.tsx`
  - DataTable (shadcn) dengan columns: foto, jenis kayu, volume, harga, status, action
  - Filter: status (available/sold), jenis kayu, tanggal
  - Search: Command search (cmdk)
  - Row actions: Edit, Delete (Dialog konfirmasi)
- [ ] **P2-T5** Halaman Tambah Kayu: `src/app/(supplier)/inventory/new/page.tsx`
  - Form (shadcn Form + zod):
    - Wood Type: Select (dari PocketBase wood_types)
    - Diameter: Input number (cm)
    - Length: Input number (cm)
    - Volume: Input number (m³) — auto-calculate dari diameter + length
    - Price: Input number
    - Unit: Select (m³, batang, ton)
    - Photos: Dropzone upload (max 5 files)
    - Legality Doc: File upload (PDF, max 1)
    - Description: Textarea
  - Submit → PocketBase create
  - Success → redirect ke inventory + toast
- [ ] **P2-T6** Halaman Edit Kayu: `src/app/(supplier)/inventory/[id]/edit/page.tsx`
  - Sama seperti form tambah, tapi pre-filled
  - Delete button dengan Dialog konfirmasi
- [ ] **P2-T7** Buat komponen `FileDropzone`:
  - `src/components/features/file-dropzone.tsx`
  - Drag & drop + click to upload
  - Preview thumbnail
  - Max file count validation
  - Loading progress bar

### Day 8: Supplier — Orders & Sales

- [ ] **P2-T8** Halaman Order Masuk: `src/app/(supplier)/orders/page.tsx`
  - DataTable: generator name, kayu, volume, total harga, status, tanggal
  - Status badges: pending (yellow), confirmed (blue), shipped (purple), completed (green)
  - Click row → Sheet detail (alamat generator, notes)
  - Action: Confirm order, Mark shipped
- [ ] **P2-T9** Halaman Riwayat Penjualan: `src/app/(supplier)/sales/page.tsx`
  - DataTable + chart (shadcn Chart recharts)
  - Chart: penjualan per bulan (bar chart)
  - Summary: total revenue, total volume terjual

### Day 9: Generator Dashboard

- [ ] **P2-T10** Buat TanStack Query hooks untuk Generator:
  - `src/lib/hooks/use-generator.ts`
  - `useGeneratorDashboard()` — saldo sampah, total waste, recent activity
  - `useWasteListings(filters?)` — list limbah yang sudah disetor
  - `useCreateWasteListing()` — mutation (form setor limbah)
  - `useGeneratorProducts()` — list produk furniture
  - `useRawTimberOrders()` — order kayu dari Supplier
- [ ] **P2-T11** Halaman Dashboard Generator: `src/app/(generator)/dashboard/page.tsx`
  - 4 summary cards:
    - Saldo Sampah (💰)
    - Total Limbah Disetor (♻️)
    - Produk Aktif (🪑)
    - Order Kayu (📦)
  - Recent Activity feed
  - Quick Action: "Setor Limbah" (CTA button prominent)
  - Notifikasi jika ada bid baru dari Aggregator

### Day 10: Generator — Setor Limbah (Report Waste)

- [ ] **P2-T12** Halaman Setor Limbah: `src/app/(generator)/report-waste/page.tsx`
  - **Multi-step form dengan Stepper (Progress indicator)**:
  - **Step 1: Foto Limbah**
    - Camera (Capacitor) + fallback upload (web)
    - Preview + re-take
    - Gunakan native abstraction layer `takePhoto()`
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
  - Success → redirect ke dashboard + toast + notifikasi ke Aggregator
- [ ] **P2-T13** Buat komponen `WasteFormStepper`:
  - `src/components/features/waste-form-stepper.tsx`
  - Props: `onSubmit(data: WasteFormData) => void`
  - State per-step di dalam komponen
  - Validasi per-step (Zod)
- [ ] **P2-T14** Buat komponen `CameraCapture`:
  - `src/components/features/camera-capture.tsx`
  - Client component
  - Deteksi platform: Capacitor camera vs file upload
  - Preview + retake

### Day 11: Generator — Beli Kayu + Produk

- [ ] **P2-T15** Halaman Beli Kayu Mentah: `src/app/(generator)/buy-timber/page.tsx`
  - Grid/list `raw_timber_listings` dari Supplier
  - Filter: wood_type, price range, volume
  - Search: Command
  - Card: foto, jenis kayu, volume, harga, supplier name
  - Click → Sheet detail + "Pesan" button
- [ ] **P2-T16** Buat komponen `TimberCard`:
  - `src/components/features/timber-card.tsx`
  - Props: `RawTimberListing` data
  - Image gallery (Carousel shadcn)
  - Badge status
  - Price + volume info
- [ ] **P2-T17** Halaman Produk Saya: `src/app/(generator)/products/page.tsx`
  - Grid/list `generator_products`
  - Card: foto, nama, kategori, harga, stock, status
  - CRUD: Tambah, Edit, Delete
  - Filter: kategori (furniture, custom_order, raw_material, other)
- [ ] **P2-T18** Halaman Tambah Produk Generator: `src/app/(generator)/products/new/page.tsx`
  - Form: nama, deskripsi, kategori (Select), harga, stock, foto, wood_type
- [ ] **P2-T19** Halaman Pesanan Kayu: `src/app/(generator)/timber-orders/page.tsx`
  - DataTable: status pesanan kayu ke Supplier
  - Status: pending, confirmed, shipped, completed, cancelled
  - Action: Cancel (jika masih pending)

### Day 12: Polish + Testing Supplier/Generator Flow

- [ ] **P2-T20** Loading states: Skeleton untuk semua halaman
- [ ] **P2-T21** Empty states: "Belum ada data" untuk semua list
- [ ] **P2-T22** Error states: Alert + retry button untuk failed query
- [ ] **P2-T23** i18n: semua string Supplier + Generator di EN/ID
- [ ] **P2-T24** Responsive: test semua halaman di 375px, 768px, 1440px
- [ ] **P2-T25** End-to-end flow: Supplier listing → Generator beli → Generator setor limbah

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

### Hooks — useSupplier

- [ ] **T-P2-1** `useSupplierDashboard` return correct shape
- [ ] **T-P2-2** `useSupplierDashboard` loading state
- [ ] **T-P2-3** `useSupplierDashboard` error state
- [ ] **T-P2-4** `useRawTimberListings` return array
- [ ] **T-P2-5** `useRawTimberListings` filter by status
- [ ] **T-P2-6** `useRawTimberListings` filter by wood_type
- [ ] **T-P2-7** `useCreateRawTimberListing` mutation sukses
- [ ] **T-P2-8** `useCreateRawTimberListing` mutation gagal (validasi)
- [ ] **T-P2-9** `useDeleteRawTimberListing` invalidate cache

### Hooks — useGenerator

- [ ] **T-P2-10** `useGeneratorDashboard` return correct shape
- [ ] **T-P2-11** `useWasteListings` return array + filter
- [ ] **T-P2-12** `useCreateWasteListing` mutation sukses
- [ ] **T-P2-13** `useCreateWasteListing` dengan foto upload

### Components — SummaryCards

- [ ] **T-P2-14** Render 4 cards sesuai props
- [ ] **T-P2-15** Format currency dengan benar
- [ ] **T-P2-16** Trend up/down indicator
- [ ] **T-P2-17** Loading state (Skeleton)
- [ ] **T-P2-18** Empty state (semua 0)

### Components — FileDropzone

- [ ] **T-P2-19** Render dropzone area
- [ ] **T-P2-20** Accept drag & drop
- [ ] **T-P2-21** Click to open file picker
- [ ] **T-P2-22** Preview thumbnail
- [ ] **T-P2-23** Max files validation
- [ ] **T-P2-24** Remove file button

### Components — WasteFormStepper

- [ ] **T-P2-25** Step 1: camera/upload renders
- [ ] **T-P2-26** Step 2: select fields render
- [ ] **T-P2-27** Step 3: volume input + price
- [ ] **T-P2-28** Step 4: confirmation summary
- [ ] **T-P2-29** Navigation: next/prev buttons
- [ ] **T-P2-30** Validation: cannot proceed if step invalid
- [ ] **T-P2-31** Submit: call onSubmit with all data

### Halaman — Supplier Dashboard

- [ ] **T-P2-32** Render summary cards
- [ ] **T-P2-33** Render recent activity
- [ ] **T-P2-34** Quick action button navigates ke /inventory/new

### Halaman — Inventory

- [ ] **T-P2-35** DataTable render rows
- [ ] **T-P2-36** Filter by status works
- [ ] **T-P2-37** Search by wood type
- [ ] **T-P2-38** Delete confirmation dialog
- [ ] **T-P2-39** Empty state "Belum ada kayu"

### Halaman — Report Waste

- [ ] **T-P2-40** Multi-step render
- [ ] **T-P2-41** Submit creates record
- [ ] **T-P2-42** Error handling (PocketBase)
- [ ] **T-P2-43** Redirect setelah sukses

### Halaman — Buy Timber

- [ ] **T-P2-44** Grid render cards
- [ ] **T-P2-45** Filter by wood type
- [ ] **T-P2-46** Search functionality
- [ ] **T-P2-47** Click card → Sheet detail

---

## 6. Acceptance Criteria

- [ ] **AC-1** Supplier bisa login & lihat dashboard dengan data real dari PocketBase
- [ ] **AC-2** Supplier bisa CRUD kayu mentah (listing, foto, dokumen)
- [ ] **AC-3** Inventory table bisa di-filter & di-search
- [ ] **AC-4** Order masuk dari Generator muncul di tabel
- [ ] **AC-5** Generator bisa login & lihat dashboard dengan summary
- [ ] **AC-6** Generator bisa setor limbah (foto + form multi-step)
- [ ] **AC-7** Waste form punya loading + error + success state
- [ ] **AC-8** Generator bisa browse & beli kayu dari Supplier
- [ ] **AC-9** Generator bisa CRUD produk furniture sendiri
- [ ] **AC-10** Semua halaman responsive (mobile-first)
- [ ] **AC-11** Semua string di EN & ID
- [ ] **AC-12** Loading skeleton untuk semua data fetching
- [ ] **AC-13** `bun test` lulus minimal 80%
- [ ] **AC-14** E2E flow: Supplier listing → Generator beli → Generator setor limbah → data masuk PocketBase
