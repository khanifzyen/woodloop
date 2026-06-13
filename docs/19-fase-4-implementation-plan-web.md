# Implementation Plan — Fase 4: Converter

**Project:** WoodLoop Web + Hybrid Mobile
**Durasi:** Hari 20–25
**Fokus:** Converter dashboard, marketplace bahan limbah, checkout, catalog produk upcycled, design clinic

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

Fase ini membangun fitur untuk **Converter** (pengrajin kreatif). Ini adalah core loop ketiga: Converter membeli bahan limbah dari Aggregator → membuat produk upcycled → mendapatkan inspirasi dari Design Clinic.

### Komponen shadcn/ui Baru

| Komponen | Untuk |
|----------|-------|
| Carousel | Galeri foto produk & bahan |
| Command | Search marketplace |
| Popover | Filter harga |

---

## 2. Prerequisites

- [x] Fase 3 complete (Aggregator flow)
- [x] Ada data warehouse_inventory dari Aggregator (bahan limbah siap jual)
- [x] Ada data design_recipes di PocketBase (untuk Design Clinic)

---

## 3. Task Breakdown

### Day 20: Converter Dashboard

- [x] **P4-T1** Buat TanStack Query hooks untuk Converter:
  - `src/lib/hooks/use-converter.ts`
  - `useConverterDashboard()` — total pembelian, produk dibuat, bahan dibeli
  - `useMarketplaceMaterials(filters?)` — list `warehouse_inventory` yang available
  - `useCreateMarketplaceTransaction()` — mutation (beli bahan)
  - `useConverterProducts()` — list `products` (upcycled)
  - `useCreateProduct()` — mutation
  - `useDesignRecipes(filters?)` — list design recipes
- [x] **P4-T2** Halaman Dashboard Converter: `src/app/(converter)/dashboard/page.tsx`
  - 4 summary cards:
    - Bahan Dibeli (🛒)
    - Produk Dibuat (🎨)
    - Total Investasi (💰)
    - Desain Tersedia (📐)
  - Recent purchases list
  - Quick actions: "Cari Bahan" + "Buat Produk" + "Klinik Desain (redirect ke /designer/design-clinic)"

### Day 21: Marketplace Bahan Limbah

- [x] **P4-T3** Halaman Pasar Bahan: `src/app/(converter)/marketplace/materials/page.tsx`
  - Grid: `warehouse_inventory` yang statusnya `in_stock`
  - Filter panel (Sheet di mobile, sidebar di desktop):
    - Wood type (Select multi)
    - Form (Select): offcut, shaving, sawdust
    - Price range (Range slider / Input min-max)
    - Location (jarak dari user)
  - Search: Command (cmdk) dengan keyboard shortcut `cmd+k`
  - Sort: Termurah, Termahal, Terbaru, Terdekat
- [x] **P4-T4** Buat komponen `MaterialCard`:
  - `src/components/features/material-card.tsx`
  - Foto (Carousel jika multiple)
  - Wood type badge, form badge
  - Price per kg + total weight
  - Nama Aggregator + lokasi
  - "Beli" button
  - Stock indicator (Progress bar)
- [x] **P4-T5** Halaman Detail Bahan: `src/app/(converter)/marketplace/materials/[id]/page.tsx`
  - Galeri foto (Carousel full width)
  - Semua detail: wood type, form, condition, weight
  - Harga: price_per_kg x quantity
  - Input: quantity (kg) — dengan min/max validation
  - Tombol: "Tambah ke Keranjang" + "Beli Langsung"
  - Informasi Aggregator (Card dengan avatar + nama + rating)
  - Traceability: dari pickup mana asalnya

### Day 22: Checkout & Transaksi

- [x] **P4-T6** Halaman Checkout: `src/app/(converter)/checkout/page.tsx`
  - List item yang akan dibeli
  - Total price kalkulasi
  - Payment method: Select (wallet, bank_transfer, COD)
  - Alamat pengiriman (pre-filled dari profil)
  - Tombol: "Konfirmasi Pembayaran"
  - Submit → PocketBase create `marketplace_transactions`
- [x] **P4-T7** Halaman Riwayat Transaksi: `src/app/(converter)/marketplace/history/page.tsx`
  - DataTable: item, aggregator, quantity, total_price, status, tanggal
  - Status badges: pending → paid → shipped → received → cancelled
  - Filter: status, date range
- [x] **P4-T8** Buat komponen `TransactionStatus`:
  - `src/components/features/transaction-status.tsx`
  - Timeline/stepper: visual status transaksi
  - Step icons + labels

### Day 23: Produk Upcycled

- [x] **P4-T9** Halaman Katalog Produk Saya: `src/app/(converter)/catalog/page.tsx`
  - Grid: `products` milik Converter
  - Card: foto, nama, kategori, harga, stock, qr_code_id
  - Status: active (green), sold_out (red), draft (gray)
  - Action: Edit, Delete, Lihat QR, Share
- [x] **P4-T10** Halaman Buat Produk: `src/app/(converter)/catalog/new/page.tsx`
  - Form:
    - Name: Input
    - Description: Textarea (cerita produk)
    - Category: Select (furniture, decor, accessories, art, other)
    - Price: Input number
    - Stock: Input number
    - Photos: FileUpload (max 5)
    - Source Materials: Select multi `marketplace_transactions` (untuk traceability)
    - Auto-generate `qr_code_id` (UUID)
  - Submit → PocketBase create `products`
- [x] **P4-T11** Halaman Edit Produk: `src/app/(converter)/catalog/[id]/edit/page.tsx`
  - Pre-filled form
  - Update stock, price, photos
- [x] **P4-T12** Buat komponen `QRCodeDisplay`:
  - `src/components/features/qr-code-display.tsx`
  - Generate QR dari `qr_code_id`
  - URL: `https://woodloop.app/p/{qr_code_id}`
  - Download QR sebagai PNG
  - Share button (native share via Capacitor)

### Day 24: Design Clinic

- [x] **P4-T13** Halaman Klinik Desain: `src/app/(converter)/design-clinic/page.tsx`
  - Grid: `design_recipes`
  - Card: foto hasil, judul, difficulty badge, wood types
  - Filter: difficulty (easy, medium, hard), wood type, form
  - Search by title / description
- [x] **P4-T14** Halaman Detail Resep: `src/app/(converter)/design-clinic/[id]/page.tsx`
  - Galeri foto
  - Judul + deskripsi (langkah-langkah)
  - Wood types yang cocok (badge chips)
  - Forms yang cocok (badge chips)
  - Difficulty level (Progress / stars)
  - Author info (Converter/Desainer pembuat)
  - Tombol: "Gunakan Resep Ini" → redirect ke /catalog/new dengan pre-filled
- [x] **P4-T15** Buat komponen `DesignRecipeCard`:
  - `src/components/features/design-recipe-card.tsx`
  - Foto hasil, judul, difficulty badge
  - Wood type chips, form chips
  - Hover: scale up + shadow

### Day 25: Polish + Testing Converter Flow

- [x] **P4-T16** Loading: Skeleton grid untuk marketplace & catalog
- [x] **P4-T17** Empty: "Belum ada bahan" / "Belum ada produk"
- [x] **P4-T18** Error: Alert + retry untuk failed query
- [x] **P4-T19** i18n: semua string Converter
- [x] **P4-T20** Responsive: grid 2 kolom mobile, 4 kolom desktop
- [x] **P4-T21** E2E: Converter browse → beli bahan → buat produk → generate QR

---

## 4. File Structure (Output Fase 4)

```
src/
├── app/(converter)/
│   ├── dashboard/page.tsx
│   ├── marketplace/
│   │   ├── materials/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── history/page.tsx
│   ├── checkout/page.tsx
│   ├── catalog/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/edit/page.tsx
│   └── design-clinic/
│       ├── page.tsx
│       └── [id]/page.tsx
├── components/
│   └── features/
│       ├── material-card.tsx
│       ├── transaction-status.tsx
│       ├── qr-code-display.tsx
│       └── design-recipe-card.tsx
└── lib/
    └── hooks/
        └── use-converter.ts
```

---

## 5. Unit Test Checklist

### Hooks — useConverter

- [x] **T-P4-1** `useConverterDashboard` return correct shape
- [x] **T-P4-2** `useMarketplaceMaterials` filter by wood_type
- [x] **T-P4-3** `useMarketplaceMaterials` filter by price range
- [x] **T-P4-4** `useMarketplaceMaterials` sort by price
- [x] **T-P4-5** `useCreateMarketplaceTransaction` mutation sukses
- [x] **T-P4-6** `useConverterProducts` return array
- [x] **T-P4-7** `useCreateProduct` dengan source_transactions
- [x] **T-P4-8** `useDesignRecipes` filter by difficulty

### Components — MaterialCard

- [x] **T-P4-9** Render foto + info
- [x] **T-P4-10** Badge wood type + form
- [x] **T-P4-11** Price formatting
- [x] **T-P4-12** Click → navigate ke detail
- [x] **T-P4-13** Stock indicator (Progress)

### Components — QRCodeDisplay

- [x] **T-P4-14** Generate QR dari qr_code_id
- [x] **T-P4-15** URL format benar
- [x] **T-P4-16** Download QR as PNG
- [x] **T-P4-17** Share button (native)

### Halaman — Marketplace Materials

- [x] **T-P4-18** Grid render cards
- [x] **T-P4-19** Filter panel works
- [x] **T-P4-20** Search by wood type
- [x] **T-P4-21** Sort by price
- [x] **T-P4-22** Pagination
- [x] **T-P4-23** Empty state

### Halaman — Checkout

- [x] **T-P4-24** List items + total price
- [x] **T-P4-25** Payment method selection
- [x] **T-P4-26** Submit creates transaction
- [x] **T-P4-27** Error handling (saldo tidak cukup)

### Halaman — Catalog / Create Product

- [x] **T-P4-28** Form validation
- [x] **T-P4-29** Source materials select
- [x] **T-P4-30** Auto-generate QR code ID
- [x] **T-P4-31** Submit creates product + QR

### Halaman — Design Clinic

- [x] **T-P4-32** Grid render recipes
- [x] **T-P4-33** Filter by difficulty
- [x] **T-P4-34** Search by title
- [x] **T-P4-35** Click → detail page

---

## 6. Acceptance Criteria

- [x] **AC-1** Converter bisa login & lihat dashboard dengan data real
- [x] **AC-2** Marketplace bahan limbah menampilkan inventory dari Aggregator
- [x] **AC-3** Filter & search marketplace berfungsi penuh
- [x] **AC-4** Converter bisa beli bahan limbah (checkout flow)
- [x] **AC-5** Transaksi tercatat di `marketplace_transactions`
- [x] **AC-6** Converter bisa CRUD produk upcycled
- [x] **AC-7** Setiap produk punya QR code yang bisa didownload
- [x] **AC-8** Source materials terhubung ke transaksi untuk traceability
- [x] **AC-9** Design Clinic menampilkan resep desain
- [x] **AC-10** Filter & search design clinic
- [x] **AC-11** Semua halaman responsive (mobile-first)
- [x] **AC-12** `bun test` lulus minimal 80%
