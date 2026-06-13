# Dokumentasi vs Realisasi Kode — 28 Mei 2026

## ✅ Sudah lengkap (sesuai dokumen)

| Area | Detail |
|---|---|
| **Auth + Onboarding** | Login, register 7 role (termasuk desainer), forgot password, role selection, onboarding carousel |
| **Supplier** | Dashboard, inventory CRUD, orders, sales history + SummaryCards |
| **Generator** | Dashboard + saldo, report waste (4-step stepper), buy timber, products CRUD, timber orders |
| **Aggregator** | Dashboard, treasure map (Leaflet + marker + routing), pickups, warehouse, bidding |
| **Converter** | Dashboard, waste materials marketplace + detail + checkout, catalog CRUD, design clinic, transaction history |
| **Buyer** | Marketplace (grid + search), product detail, cart (Zustand), checkout, order tracking, QR scan |
| **Enabler** | Impact dashboard + chart + role distribution, user management |
| **Shared** | Profile, wallet, chat, notifications, PWA (manifest + SW + offline), SEO (sitemap + JSON-LD) |
| **Public** | Traceability page `/p/[qr_code_id]` (SSR + OG + structured data) |
| **Testing** | 11 unit test files (Vitest), 9 E2E files (Playwright), Fase 1-7 regression |
| **PocketBase** | 17 collections, hooks (pickup/transaction/bid/order automations), user_code + tracking_id auto-gen |

**Total: 39 halaman dashboard + 5 auth + 2 shared + 1 public + 1 offline = 48 halaman**

---

## ⚠️ Ada di kode tapi belum penuh (partial)

| Fitur | Status | Gap |
|---|---|---|
| **Checkout Buyer** | Halaman ada, order terbuat | Tidak ada integrasi Midtrans — cuma simpan order `payment_pending`, gak bisa bayar beneran |
| **Chat** | UI + daftar percakapan + kirim pesan ada | Pakai polling query biasa, **bukan** PocketBase realtime subscription (gak live) |
| **Buyer Dashboard** | Halaman ada | Cuma welcome page sederhana, belum *personal impact dashboard* seperti di spesifikasi |
| **Waste Checkout Converter** | Inline di halaman detail material | Gak ada halaman checkout terpisah dengan slider kuantitas + detail ongkos kirim seperti di dokumen Flutter |

---

## ❌ Belum ada di kode (ada di dokumentasi)

| Fitur | Lokasi di Dokumen | Keterangan |
|---|---|---|
| **Midtrans Payment Gateway** | Fase 5 + spesifikasi | Field `snap_token`/`snap_redirect_url` ada di types.ts tapi gak ada kode integrasi Midtrans Snap |
| **AI Waste Scanner (Computer Vision)** | Core feature #2 | Spesifikasi sebut deteksi otomatis jenis kayu dari foto. Di kode cuma form manual. Dokumen sendiri bilang "simulated, manual form in MVP" |
| **E-Certificate Generator** | Core feature #10 | Spesifikasi sebut penerbitan sertifikat "Green UKM". Zero referensi di kode. Dokumen bilang "planned, pending for future" |
| **Converter Raw Timber Marketplace** | Screen #27 | Dokumen sebut halaman marketplace kayu mentah dari Supplier untuk Converter. Route `/converter/marketplace/timber` gak ada |
| **Generator Order Management** | Screen #15 | Dokumen sebut halaman dengan tab Orders + Waste History (status: Available → Booked → Collected → Sold). Route `/generator/orders` gak ada di web |
| **Push Notification (Native)** | Fase 7 + Capacitor | Plugin Capacitor push belum di-wire untuk notifikasi native |
| **Realtime Chat** | Spesifikasi | Chat gak pakai PocketBase `subscribe()`, cuma polling — jadi gak realtime |

---

## Ringkasan

**Fase 1-7 secara struktural semua sudah ada** — 48 halaman, semua role ter-cover, semua collection PocketBase + hooks jalan. Testing 66/66 UAT passed.

**Gap utama ada 3:**
1. **Midtrans** — checkout bisa bikin order tapi gak bisa bayar
2. **AI Scanner** — spesifikasi menyebut computer vision tapi memang direncanakan sebagai MVP manual
3. **E-Certificate** — spesifikasi menyebut, tapi di-*defer* ke masa depan

Sisanya gap kecil: halaman Raw Timber Marketplace Converter, Generator Order Management, dan realtime chat subscription.
