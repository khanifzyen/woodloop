# UAT Report — Fase 3: Aggregator

**Project:** WoodLoop Web + Hybrid Mobile
**Fase:** 3 (Aggregator)
**Tanggal:** 19 Mei 2026 (diperbarui 28 Mei 2026)
**Status:** ✅ Selesai (Semua task & pending items completed)

---

## Ringkasan

| Area | Status | Detail |
|------|--------|--------|
| Aggregator Dashboard | ✅ | 4 summary cards, CTA ke treasure map, recent pickups |
| Treasure Map | ✅ | Leaflet map, marker warna, filter sheet, GPS, detail sheet, **routing polyline** |
| Pickup Management | ✅ | List pickup, tabs filter, confirm page (foto + GPS + weight) |
| Warehouse Inventory | ✅ | DataTable, set harga jual, summary total, log inventori, **detail page** |
| Bidding System | ✅ | Lelang tersedia, ajukan bid via dialog, riwayat bid saya, **realtime notifikasi** |
| Notification System | ✅ | Notifikasi page, **realtime subscription**, **badge unread count**, **toast on bid events** |
| Unit Test | ✅ | 49/49 passed (4 aggregator + 5 notifications) |
| E2E Test | ✅ | 18/18 passed (15 existing + 3 new: routing, warehouse detail, notification badge) |

---

## Hasil Test

### Unit Test (Vitest) — 49/49 ✅

| File | Tests | Status |
|------|-------|--------|
| auth-store.test.ts | 5 | ✅ |
| use-supplier.test.ts | 3 | ✅ |
| use-generator.test.ts | 3 | ✅ |
| use-aggregator.test.ts | 4 | ✅ |
| use-notifications.test.ts | 5 | ✅ **New** |
| summary-cards.test.tsx | 8 | ✅ |
| file-dropzone.test.tsx | 6 | ✅ |
| waste-form-stepper.test.tsx | 7 | ✅ |
| timber-card.test.tsx | 3 | ✅ |
| use-buyer.test.ts | 3 | ✅ |
| use-converter.test.ts | 2 | ✅ |

### E2E Test (Playwright — Real Auth) — 18/18 ✅

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
| RUTE-01: Tombol Rute Terdekat visible | ✅ **New** |
| WH-03: Warehouse detail page loads | ✅ **New** |
| NOTIF-01: Notification badge visible | ✅ **New** |

---

## File Baru (Tambahan 28 Mei 2026)

```
src/
├── app/(aggregator)/
│   └── warehouse/[id]/page.tsx       → Detail page (foto, info pickup, set harga)
├── components/features/
│   └── notification-badge.tsx        → Real-time unread count badge
├── lib/hooks/
│   ├── use-realtime.ts               → Generic PocketBase subscription hook
│   ├── use-notifications.ts          → Notif hooks + realtime + unread count
│   └── use-notifications.test.ts     → 5 unit tests
├── .env.example                      → Environment variables documentation
e2e/
└── fase-3-real.e2e.ts               → 18 E2E test (+3 new)
```

## File Diubah (Tambahan 28 Mei 2026)

```
src/components/features/treasure-map.tsx    → +Haversine distance, +Polyline, +Rute Terdekat button
src/app/(aggregator)/bidding/page.tsx       → +useRealtimeSubscription for bid status changes
src/components/layout/navbar.tsx            → +NotificationBadge (replace hardcoded 3)
src/app/(shared)/notifications/page.tsx     → +useRealtimeNotifications auto-invalidate
src/lib/hooks/use-wallet.ts                → Re-export notif hooks from use-notifications.ts
src/lib/hooks/use-aggregator.test.ts        → +mock subscribe
src/app/(aggregator)/warehouse/page.tsx     → Link to detail page on wood name
```

---

## Catatan

- **Rute polyline (P3-T9)** — ✅ Selesai. Tombol "Rute Terdekat" toggle, Haversine distance, Polyline ke 3 marker terdekat, info overlay total jarak
- **Realtime notifikasi bid (P3-T21)** — ✅ Selesai. PocketBase subscribe `bids`, toast accepted/rejected, redirect ke pickups page
- **Warehouse detail page (P3-T16)** — ✅ Selesai. Detail item + inline price input + save button
- **Notification system (AC-11)** — ✅ Selesai. Badge unread count, realtime subscription, auto-invalidate
- **Pickup create via API** gagal (403 Forbidden) karena aturan create rule PocketBase — hanya bisa dari UI
- **Semua dummy data berhasil dibersihkan** setelah test
- **User default aman** — tidak ada password yang diubah
