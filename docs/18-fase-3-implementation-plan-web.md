# Implementation Plan — Fase 3: Aggregator

**Project:** WoodLoop Web + Hybrid Mobile
**Durasi:** Hari 13–19
**Fokus:** Aggregator dashboard, treasure map (peta interaktif), pickup management, warehouse inventory, bidding system

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

Fase ini membangun fitur untuk **Aggregator** (pengepul/logistik). Ini adalah core loop kedua: Aggregator melihat limbah di peta → menjemput → menyimpan di gudang → menjual ke Converter. Juga termasuk sistem bidding untuk waste listing tertentu.

### Teknologi Baru

| Teknologi | Untuk |
|-----------|-------|
| Leaflet | Peta Treasure Map |
| @capacitor/geolocation | GPS realtime |
| react-leaflet | React wrapper Leaflet |

---

## 2. Prerequisites

- [x] Fase 2 complete (Supplier + Generator flow)
- [x] Ada data waste_listings dari Generator (untuk test map)
- [x] Leaflet installed: `bun add leaflet react-leaflet @types/leaflet`
- [x] Capacitor geolocation: `bun add @capacitor/geolocation`

---

## 3. Task Breakdown

### Day 13: Aggregator Dashboard

- [x] **P3-T1** Buat TanStack Query hooks untuk Aggregator:
  - `src/lib/hooks/use-aggregator.ts`
  - `useAggregatorDashboard()` — total pickups, warehouse stock, active bids
  - `usePickups(filters?)` — list pickup dengan filter status
  - `useCreatePickup(wasteListingId)` — mutation
  - `useUpdatePickupStatus(id, status)` — mutation
  - `useWarehouseInventory()` — list stok gudang
  - `useBids()` — list bid yang diajukan
- [x] **P3-T2** Halaman Dashboard Aggregator: `src/app/(aggregator)/dashboard/page.tsx`
  - 4 summary cards:
    - Penjemputan Hari Ini (🚚)
    - Stok Gudang (🏭)
    - Bid Aktif (🏷️)
    - Pendapatan (💰)
  - Map preview kecil (peta dengan pin area sekitar)
  - Recent pickups list
  - Quick Action: "Lihat Peta Harta Karun" (CTA prominent)

### Day 14: Treasure Map — Setup Map

- [x] **P3-T3** Buat komponen Treasure Map:
  - `src/components/features/treasure-map.tsx`
  - Full height: `h-[calc(100vh-4rem)]`
  - Integrasi Leaflet dengan `react-leaflet`
  - Tile layer: OpenStreetMap (gratis) atau Google Maps (jika ada API key)
  - Center: Jepara (-6.58, 110.67), zoom 13
- [x] **P3-T4** Query waste listings dengan status `available` + koordinat GPS
- [x] **P3-T5** Tampilkan marker untuk setiap waste listing:
  - Warna marker beda: 🟢 available (< 24 jam), 🟡 available (> 24 jam), 🔴 urgent (> 48 jam)
  - Custom icon (bisa pakai Leaflet divIcon dengan Tailwind classes)
  - Cluster marker jika terlalu rapat (Leaflet.markercluster)
- [x] **P3-T6** Click marker → Sheet bottom (shadcn Sheet):
  - Foto limbah (Carousel)
  - Informasi: jenis kayu, bentuk, volume, harga
  - Nama Generator + jarak
  - Tombol: "Ajukan Bid" / "Ambil Langsung"

### Day 15: Treasure Map — Interaksi & GPS

- [x] **P3-T7** Fitur GPS:
  - Tombol "Lokasi Saya" → center map ke posisi user
  - Gunakan `@capacitor/geolocation` (native) atau browser Geolocation API (web)
  - Tampilkan marker posisi Aggregator
- [x] **P3-T8** Fitur Filter Map:
  - Sheet filter: jenis kayu, bentuk limbah, jarak maksimal, harga maksimal
  - Badge: jumlah hasil filter
  - Real-time update marker
- [ ] **P3-T9** Fitur Routing: (pending — polyline rute)
  - Tombol "Rute Terdekat" → sortir marker berdasarkan jarak
  - Line/polyline rute ke 3 waste listing terdekat
  - Total estimasi jarak tempuh
- [x] **P3-T10** Halaman Treasure Map: `src/app/(aggregator)/treasure-map/page.tsx`

### Day 16: Pickup Management

- [x] **P3-T11** Halaman Penjemputan: `src/app/(aggregator)/pickups/page.tsx`
  - DataTable: waste listing, generator, status, jadwal, action
  - Filter: status (pending, on_the_way, completed, cancelled)
  - Tabs: "Perlu Dijemput" | "Sedang Diangkut" | "Selesai"
- [x] **P3-T12** Buat komponen `PickupCard`:
  - (inline di pickups/page.tsx)
  - Foto + info limbah
  - Status progress (shadcn Progress)
  - Tombol: "Konfirmasi Jemput", "Selesai"
- [x] **P3-T13** Halaman Konfirmasi Pickup: `src/app/(aggregator)/pickups/[id]/confirm/page.tsx`
  - Kamera: foto bukti serah terima (Capacitor camera)
  - GPS: catat koordinat pickup
  - Input: weight_verified (timbangan aktual)
  - Notes: textarea
  - Submit → update status + create warehouse_inventory record
- [x] **P3-T14** Buat komponen `PickupConfirmForm`:
  - (inline di confirm/page.tsx)
  - Camera + GPS + weight input
  - Loading + error state

### Day 17: Warehouse Inventory

- [x] **P3-T15** Halaman Gudang: `src/app/(aggregator)/warehouse/page.tsx`
  - DataTable: wood_type, form, weight, price_per_kg, status
  - Filter: status (in_stock, reserved, sold)
  - Group by: wood_type atau form
  - Total: total weight, total value
- [ ] **P3-T16** Halaman Detail Stok: (pending — set harga via inline di table)
  - Detail item: foto, asal pickup, wood_type, form, weight
  - Set harga jual: Input number price_per_kg
  - Update → PocketBase
- [x] **P3-T17** Halaman Log Inventori: `src/app/(aggregator)/warehouse/log/page.tsx`
  - Riwayat: barang masuk (dari pickup) + barang keluar (terjual)
  - DataTable + date filter
  - Timeline view

### Day 18: Bidding System

- [x] **P3-T18** Buat hooks bidding:
  - `useAvailableWasteForBid()` — waste listing yang bisa dibid (status available, ada price_estimate > 0)
  - `useCreateBid(wasteListingId, amount)` — mutation
  - `useMyBids()` — list bid yang diajukan Aggregator
  - `useUpdateBidStatus(bidId, status)` — mutation (accept/reject)
- [x] **P3-T19** Halaman Bidding: `src/app/(aggregator)/bidding/page.tsx`
  - Tabs: "Lelang Tersedia" | "Bid Saya" | "Riwayat"
  - **Lelang Tersedia**: Grid waste listing yang bisa dibid (price_estimate > 0)
  - Card: foto, info limbah, harga estimasi, jumlah bid saat ini
  - Tombol: "Ajukan Bid" → Dialog input amount
- [x] **P3-T20** Buat komponen `BidDialog`:
  - (inline di bidding/page.tsx)
  - Input: bid amount (min: price_estimate)
  - Optional: message ke Generator
  - Submit → PocketBase create bid
  - Success toast
- [ ] **P3-T21** Notifikasi: (pending — realtime subscription)
  - PocketBase realtime subscription `bids` collection
  - Toast notification
  - Redirect ke pickups page

### Day 19: Polish + Testing Aggregator Flow

- [x] **P3-T22** Loading: Skeleton map, Skeleton table
- [x] **P3-T23** Empty: "Belum ada limbah di sekitar" (map), "Belum ada pickup"
- [x] **P3-T24** Error: Map gagal load → fallback ke list view
- [x] **P3-T25** i18n: semua string Aggregator (EN/ID via translation keys)
- [x] **P3-T26** Responsive: map full height di mobile, sidebar filter di desktop
- [x] **P3-T27** E2E: Aggregator lihat peta → filter → bid → pickup → warehouse

---

## 4. File Structure (Output Fase 3)

```
src/
├── app/(aggregator)/
│   ├── dashboard/page.tsx
│   ├── treasure-map/page.tsx
│   ├── pickups/
│   │   ├── page.tsx
│   │   └── [id]/confirm/page.tsx
│   ├── warehouse/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── log/page.tsx
│   └── bidding/page.tsx
├── components/
│   └── features/
│       ├── treasure-map.tsx
│       ├── pickup-card.tsx
│       ├── pickup-confirm-form.tsx
│       └── bid-dialog.tsx
├── lib/
│   ├── hooks/
│   │   └── use-aggregator.ts
│   └── native/
│       └── geolocation.ts     # GPS abstraction
```

---

## 5. Unit Test Checklist

### Hooks — useAggregator

- [x] **T-P3-1** `useAggregatorDashboard` return correct shape
- [x] **T-P3-2** `usePickups` filter by status
- [x] **T-P3-3** `useCreatePickup` mutation sukses
- [x] **T-P3-4** `useUpdatePickupStatus` update + invalidate
- [x] **T-P3-5** `useWarehouseInventory` return grouped data
- [x] **T-P3-6** `useBids` return list bids

### Components — Treasure Map

- [x] **T-P3-7** Map renders with center coordinates (via leaflet-container)
- [x] **T-P3-8** Markers appear untuk setiap waste listing
- [x] **T-P3-9** Marker color sesuai status (available/urgent)
- [x] **T-P3-10** Click marker → Sheet detail
- [x] **T-P3-11** Filter updates markers
- [x] **T-P3-12** GPS button centers map
- [x] **T-P3-13** Empty state: "Tidak ada limbah"
- [x] **T-P3-14** Loading state: Skeleton map
- [x] **T-P3-15** Error state: fallback list view

### Components — BidDialog

- [x] **T-P3-16** Dialog opens dengan info waste listing
- [x] **T-P3-17** Input amount validation (min price_estimate)
- [x] **T-P3-18** Success toast setelah submit
- [x] **T-P3-19** Error handling (bid terlalu rendah)

### Components — PickupConfirmForm

- [x] **T-P3-20** Camera button works (native fallback)
- [x] **T-P3-21** GPS coordinate capture
- [x] **T-P3-22** Weight input validation
- [x] **T-P3-23** Submit → update status + create warehouse

### Halaman — Pickups

- [x] **T-P3-24** PickupCard render tiap pickup
- [x] **T-P3-25** Tabs filter by status
- [x] **T-P3-26** Click row → Sheet detail
- [x] **T-P3-27** Confirm button → navigasi ke confirm page

### Halaman — Warehouse

- [x] **T-P3-28** DataTable render grouped inventory
- [x] **T-P3-29** Set price_per_kg update
- [x] **T-P3-30** Total weight & value summary

---

## 6. Acceptance Criteria

- [x] **AC-1** Aggregator bisa login & lihat dashboard dengan data real
- [x] **AC-2** Treasure Map menampilkan pin limbah dari database
- [x] **AC-3** Marker beda warna berdasarkan urgensi
- [x] **AC-4** Click marker → Sheet detail limbah
- [x] **AC-5** GPS bisa mendeteksi lokasi Aggregator
- [x] **AC-6** Filter map (jenis kayu, harga) berfungsi
- [ ] **AC-7** Aggregator bisa ajukan bid lewat dialog (via UI)
- [x] **AC-8** Pickup bisa dikonfirmasi (foto + GPS + weight) — halaman siap
- [ ] **AC-9** Setelah pickup → otomatis masuk warehouse inventory (tergantung hook server)
- [x] **AC-10** Warehouse inventory bisa di-set harga jual
- [ ] **AC-11** Real-time notifikasi saat bid di-accept (pending)
- [x] **AC-12** Semua halaman responsive (map full height di mobile)
- [x] **AC-13** `bun test` lulus 39/39 (100%)
- [ ] **AC-14** Lighthouse audit (belum dijalankan)
