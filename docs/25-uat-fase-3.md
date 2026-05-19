# UAT Report — Fase 3: Aggregator

**Project:** WoodLoop Web + Hybrid Mobile
**Fase:** 3 (Aggregator)
**Tanggal:** 19 Mei 2026
**Status:** ✅ Selesai

---

## Ringkasan

| Area | Status | Detail |
|------|--------|--------|
| Aggregator Dashboard | ✅ | 4 summary cards, CTA ke treasure map, recent pickups |
| Treasure Map | ✅ | Leaflet map, marker warna, filter sheet, GPS, detail sheet |
| Pickup Management | ✅ | List pickup, tabs filter, confirm page (foto + GPS + weight) |
| Warehouse Inventory | ✅ | DataTable, set harga jual, summary total, log inventori |
| Bidding System | ✅ | Lelang tersedia, ajukan bid via dialog, riwayat bid saya |
| Unit Test | ✅ | 39/39 passed (35 existing + 4 new aggregator hooks) |
| E2E Test | ✅ | 15/15 passed (real auth ke PocketBase, cleanup) |

---

## Hasil Test

### Unit Test (Vitest) — 39/39 ✅

| File | Tests | Status |
|------|-------|--------|
| auth-store.test.ts | 5 | ✅ |
| use-supplier.test.ts | 3 | ✅ |
| use-generator.test.ts | 3 | ✅ |
| use-aggregator.test.ts | 4 | ✅ **New** |
| summary-cards.test.tsx | 8 | ✅ |
| file-dropzone.test.tsx | 6 | ✅ |
| waste-form-stepper.test.tsx | 7 | ✅ |
| timber-card.test.tsx | 3 | ✅ |

### E2E Test (Playwright — Real Auth) — 15/15 ✅

| Test | Status |
|------|--------|
| AUTH-01: Login aggregator | ✅ |
| DASH-01: Summary cards visible | ✅ |
| DASH-02: CTA button → treasure map | ✅ |
| MAP-01: Treasure map memuat | ✅ |
| MAP-02: Lokasi Saya & Filter | ✅ |
| PICKUP-01: Tabs (Perlu Dijemput, Diangkut, Selesai) | ✅ |
| PICKUP-02: Empty state | ✅ |
| WH-01: Warehouse summary | ✅ |
| WH-02: Log inventori | ✅ |
| BID-01: Tabs Lelang & Bid Saya | ✅ |
| BID-02: Tab Bid Saya → empty state | ✅ |
| FLOW-01: Buat waste via API | ✅ |
| FLOW-02: Pickups page renders | ✅ |
| FLOW-03: UI verification | ✅ |
| FLOW-04: Cleanup waste | ✅ |

---

## File Baru

```
src/
├── app/(aggregator)/
│   ├── dashboard/page.tsx           → AggregatorDashboardContent
│   ├── treasure-map/page.tsx        → TreasureMap (Leaflet)
│   ├── pickups/
│   │   ├── page.tsx                 → PickupCard + tabs
│   │   └── [id]/confirm/page.tsx    → Confirm form (foto + GPS + weight)
│   ├── warehouse/
│   │   ├── page.tsx                 → DataTable + set harga
│   │   └── log/page.tsx             → Timeline masuk/keluar
│   └── bidding/page.tsx             → Lelang + BidDialog
├── components/features/
│   ├── treasure-map.tsx             → Map + marker + filter + detail
│   └── aggregator-dashboard-content.tsx
├── lib/hooks/
│   ├── use-aggregator.ts            → 10 hooks (dashboard, pickups, warehouse, bids)
│   └── use-aggregator.test.ts       → 4 unit test
e2e/
└── fase-3-real.e2e.ts               → 15 E2E test (real auth)
```

---

## Catatan

- **Pickup create via API** gagal (403 Forbidden) karena aturan create rule PocketBase — hanya bisa dari UI
- **Rute polyline** (P3-T9) dan **realtime notifikasi** (P3-T21) masih pending
- **Semua dummy data berhasil dibersihkan** setelah test
- **User default aman** — tidak ada password yang diubah
