# Implementation Plan — Fase 7: Native & Polish

**Project:** WoodLoop Web + Hybrid Mobile
**Durasi:** Hari 36–42
**Fokus:** Capacitor native testing, PWA setup, SEO optimization, performance, bug fixing, final testing

---

## 📋 Daftar Isi

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Task Breakdown](#3-task-breakdown)
4. [Capacitor Native Testing Matrix](#4-capacitor-native-testing-matrix)
5. [Unit Test Checklist](#5-unit-test-checklist)
6. [Performance Targets](#6-performance-targets)
7. [Acceptance Criteria](#7-acceptance-criteria)

---

## 1. Overview

Fase terakhir! Fokus pada **native testing** (Capacitor di device sungguhan), **PWA** (offline capability, installable), **SEO** (supaya produk muncul di Google), **performance** (Lighthouse), dan **bug fixing** menyeluruh.

### Target Akhir

| Metrik | Target |
|--------|--------|
| Lighthouse Performance | ≥ 80 |
| Lighthouse Accessibility | ≥ 90 |
| Lighthouse SEO | ≥ 95 |
| Lighthouse Best Practices | ≥ 90 |
| Bundle Size (initial JS) | ≤ 150 KB |
| Time to Interactive | ≤ 3 detik |
| Test Coverage | ≥ 80% |
| Android APK size | ≤ 15 MB |

---

## Status Pengerjaan

| Day | Progress | Status |
|-----|----------|--------|
| Day 36 — Capacitor Native Testing | 1/5 | ✅ **Native abstraction layer selesai** |
| Day 37 — Push & QR | 1/5 | 🟡 **Stub code + fallback siap, butuh device fisik** |
| Day 38 — PWA | 2/2 | ✅ **Selesai** |
| Day 39 — SEO & Performance | 0/4 | ⏳ Belum dikerjakan |
| Day 40 — Bug Fixing & Final | 0/5 | ⏳ Belum dikerjakan |
| Day 41 — Build Release APK | 0/3 | ⏳ Belum dikerjakan |
| Day 42 — Dokumentasi | 0/2 | ⏳ Belum dikerjakan |

> **Update (June 2026):** FASE 7 dilaksanakan setelah gap closing. Zod validation schemas untuk semua 7 role + native abstraction layer (5 file) sudah selesai. 227 total unit tests.

---

## 2. Prerequisites

- [ ] Semua Fase 1–6 complete
- [ ] Semua fitur sudah berfungsi di browser (development)
- [ ] Device Android/iOS fisik untuk testing
- [ ] Akun Google Play Developer (opsional, untuk publish)
- [ ] Akun Apple Developer (opsional, untuk publish)
- [ ] Domain: woodloop.app (atau sementara Vercel domain)

---

## 3. Task Breakdown

### Day 36: Capacitor Native Testing — Camera & GPS

- [ ] **P7-T1** Build Android APK pertama:
  ```bash
  bun run build           # Next.js build + export
  bunx cap sync android   # Sync ke Capacitor
  cd android && ./gradlew assembleDebug  # Build APK
  ```
- [ ] **P7-T2** Sideload APK ke device Android fisik
- [ ] **P7-T3** Test Camera:
  - 📸 **Generator**: foto limbah → upload → preview
  - 📸 **Supplier**: foto kayu → upload
  - 📸 **Pickup**: foto bukti serah terima
  - 📸 **Profile**: upload avatar
  - Test: quality, orientation, file size, multiple photos
- [ ] **P7-T4** Test GPS:
  - 📍 **Treasure Map**: lokasi Aggregator di peta
  - 📍 **Register**: auto-fill lokasi saat registrasi
  - 📍 **Pickup**: capture koordinat saat konfirmasi
  - Test: accuracy, timeout, permission denied
- [ ] **P7-T5** Fix issues yang ditemukan saat testing

### Day 37: Capacitor Native Testing — Push & QR

- [ ] **P7-T6** Setup Push Notification:
  - Firebase Cloud Messaging (FCM) untuk Android
  - APNS untuk iOS (jika ada)
  - Test: notif masuk saat app open, background, killed
  - Test: click notif → redirect ke halaman terkait
- [ ] **P7-T7** Test QR Scanner:
  - 📷 **Buyer**: scan QR produk → redirect ke `/p/[id]`
  - Test: berbagai kondisi cahaya, QR kecil, QR rusak
  - Fallback: upload foto QR (web)
- [ ] **P7-T8** Test Deep Linking:
  - 🔗 Click link `https://woodloop.app/p/xxx` → buka app
  - 🔗 QR scan → buka app (bukan browser)
  - Setup: `capacitor.config.ts` + AndroidManifest.xml
- [ ] **P7-T9** Test Biometric (opsional):
  - 🔐 Wallet: akses pake fingerprint/faceid
  - Fallback: PIN jika biometric tidak tersedia

### Day 38: PWA Setup

- [x] **P7-T10** Setup PWA manifest:
  - `src/app/manifest.ts` atau `public/manifest.json`
  - Name: WoodLoop
  - Short name: WoodLoop
  - Icons: 192x192, 512x512 (buat icon kayu)
  - Theme color: #2D6A4F (hijau)
  - Display: standalone
  - Start URL: /
- [x] **P7-T11** Setup Service Worker:
  - Strategi: Network first, cache fallback
  - Cache: pages, API responses, static assets
  - Offline page: "Kamu sedang offline" with retry button
  - Update: prompt user saat SW baru tersedia (skipWaiting)
  - Implementasi: `public/sw.js` enhanced, `src/app/offline/page.tsx` dibuat
- [x] **P7-T12** Setup `next.config.ts` untuk PWA:
  - Remote patterns untuk PocketBase images (next/image support)
- [ ] **P7-T13** Test install prompt:
  - Browser: tampilkan "Install WoodLoop" banner
  - After install: buka sebagai standalone app
  - Test: semua fitur jalan di standalone mode
- [ ] **P7-T14** Test offline:
  - Matikan internet
  - Buka halaman yang sudah dikunjungi → muncul dari cache
  - Coba submit form → tampilkan "kamu offline"
  - Online balik → sync data

### Day 39: SEO Optimization

- [x] **P7-T15** Setup `src/app/sitemap.ts`:
  - URLs: semua halaman publik
    - `/p/[id]` — semua produk (dynamic)
    - `/buyer/marketplace` + kategori
    - `/buyer/product/[id]`
  - Prioritas: produk = 1.0, kategori = 0.8, lainnya = 0.5
  - Change frequency: produk = daily, lainnya = weekly
  - Tambahan: `/buyer/product/[id]` URLs, `/buyer/scan`
- [x] **P7-T16** Setup `src/app/robots.ts`:
  - Allow: semua path publik
  - Disallow: semua path yang butuh auth (`/(supplier)/`, `/(generator)/`, dll)
  - Sitemap: https://woodloop.app/sitemap.xml
- [x] **P7-T17** Setup Open Graph tags untuk semua halaman publik:
  - `og:title` — nama produk
  - `og:description` — cerita traceability
  - `og:image` — foto produk (icon-512.png sebagai fallback)
  - `og:url` — canonical URL
  - `og:type` — product
  - Implementasi: `metadataBase`, `alternates.canonical`, `openGraph.images` di root layout
- [x] **P7-T18** Setup JSON-LD Structured Data:
  - Product schema: name, description, image, price, brand (Converter)
  - BreadcrumbList schema (marketplace + product detail + traceability)
  - Organization schema (WoodLoop)
  - WebSite schema with SearchAction
  - Helper: `src/lib/seo.ts` with `buildProductJsonLd`, `buildBreadcrumbJsonLd`, `buildOrganizationJsonLd`, `buildWebSiteJsonLd`
  - Implementasi: root layout (Organization + WebSite), marketplace page (BreadcrumbList), product detail (Product + BreadcrumbList), traceability SSR (Product + BreadcrumbList)
- [x] **P7-T19** Setup `next-seo` atau `generateMetadata`:
  - Setiap halaman SSR harus punya metadata dinamis
  - Fallback metadata untuk halaman error
  - Root layout + traceability page sudah punya dynamic `generateMetadata`
- [ ] **P7-T20** Test dengan Google Rich Results Test:
  - URL produk → harus valid structured data
  - URL traceability → harus valid

### Day 40: Performance Optimization

- [ ] **P7-T21** Bundle analysis:
  ```bash
  bun add -d @next/bundle-analyzer
  ANALYZE=true bun run build
  ```
  - Identifikasi large dependencies
  - Code split: dynamic import untuk komponen berat (map, chart)
- [ ] **P7-T22** Optimasi gambar:
  - Gunakan `next/image` untuk semua gambar (webp, lazy load)
  - Konversi foto upload ke webp (client-side compression)
  - Ukuran maksimal upload: 2MB
  - Placeholder blur untuk loading
- [ ] **P7-T23** Optimasi bundle:
  - Dynamic import untuk Leaflet: `dynamic(() => import('leaflet'), { ssr: false })`
  - Dynamic import untuk recharts
  - Dynamic import untuk html5-qrcode
  - Tree shake: import spesifik dari lucide-react
- [ ] **P7-T24** Optimasi PocketBase queries:
  - Gunakan `fields` parameter: ambil field yang diperlukan saja
  - Gunakan `perPage` + pagination
  - Cache TanStack Query dengan `staleTime` yang tepat
  - Prefetch data yang sering diakses
- [ ] **P7-T25** Optimasi rendering:
  - Gunakan React.memo untuk list item
  - Virtual scroll untuk chat messages (jika > 100)
  - Debounce search input
  - Gunakan `useMemo` + `useCallback` secara bijak

### Day 41: Bug Fixing & Final Testing

- [x] **P7-T26** Regression test semua flow (ceklist lengkap):
  - [x] Auth flow: register → login → logout
  - [x] Supplier: CRUD kayu → order masuk
  - [x] Generator: setor limbah → beli kayu → produk
  - [x] Aggregator: treasure map → pickup → warehouse → bid
  - [x] Converter: beli bahan → buat produk → QR
  - [x] Buyer: marketplace → cart → checkout → payment → tracking
  - [x] Enabler: dashboard → user management
  - [x] Shared: wallet, chat, notifikasi, profil
- [x] **P7-T27** Test di berbagai browser:
  - Chrome (desktop + mobile)
  - Firefox (desktop)
  - Safari (iOS)
  - Samsung Internet (Android)
- [x] **P7-T28** Test di berbagai ukuran layar:
  - 375px (iPhone SE)
  - 414px (iPhone Plus)
  - 768px (iPad)
  - 1024px (iPad landscape)
  - 1440px (desktop)
- [x] **P7-T29** Test error scenarios:
  - Network error → retry button
  - Server error (500) → fallback page
  - 404 → custom 404 page
  - Rate limit → cooldown message
  - Empty data → empty state
- [x] **P7-T30** Test auth scenarios:
  - Token expired → redirect login
  - Wrong role → redirect dashboard sendiri
  - Multiple tabs → sync state
- [x] **P7-T31** Fix semua bug yang ditemukan
- [ ] **P7-T32** Code cleanup:
  - Hapus console.log
  - Hapus komentar yang tidak perlu
  - Hapus file yang tidak dipakai
  - Format semua kode: `bun run format`

### Day 42: Final Build + Documentation

- [ ] **P7-T33** Final build:
  ```bash
  bun run build              # Next.js production build
  bun run test               # All tests
  bun run lint               # ESLint
  ```
- [ ] **P7-T34** Deploy ke Vercel:
  ```bash
  bunx vercel --prod
  ```
  - Domain: woodloop.app
  - Environment variables: semua di Vercel dashboard
- [ ] **P7-T35** Setup CI/CD (GitHub Actions):
  - `.github/workflows/deploy.yml`
  - Trigger: push ke main
  - Steps: bun install → bun run lint → bun run test → bun run build → deploy Vercel
- [ ] **P7-T36** Update README.md:
  - Deskripsi proyek
  - Tech stack
  - Cara install & run
  - Link ke dokumentasi
  - Screenshots
- [ ] **P7-T37** Final Android APK:
  ```bash
  cd android && ./gradlew assembleRelease
  ```
  - Sign APK dengan keystore
  - Test APK di device fisik
- [ ] **P7-T38** Final documentation update:
  - Pastikan semua docs terupdate
  - Buat CHANGELOG.md
  - Buat CONTRIBUTING.md (jika open source)

---

## 4. Capacitor Native Testing Matrix

| Fitur | Device | OS | Hasil | Bug |
|-------|--------|----|-------|-----|
| Camera: foto limbah | Xiaomi Redmi | Android 13 | ⬜ | |
| Camera: foto kayu | Samsung A54 | Android 14 | ⬜ | |
| Camera: foto bukti pickup | Google Pixel | Android 14 | ⬜ | |
| Camera: avatar | iPhone 15 | iOS 17 | ⬜ | |
| GPS: Treasure Map | Xiaomi Redmi | Android 13 | ⬜ | |
| GPS: Register auto-fill | Samsung A54 | Android 14 | ⬜ | |
| GPS: Pickup coordinate | Google Pixel | Android 14 | ⬜ | |
| Push Notification: foreground | Xiaomi Redmi | Android 13 | ⬜ | |
| Push Notification: background | Samsung A54 | Android 14 | ⬜ | |
| Push Notification: killed | Google Pixel | Android 14 | ⬜ | |
| Push Notification: iOS | iPhone 15 | iOS 17 | ⬜ | |
| QR Scanner: scan produk | Xiaomi Redmi | Android 13 | ⬜ | |
| QR Scanner: low light | Samsung A54 | Android 14 | ⬜ | |
| QR Scanner: upload foto | Web | Chrome | ⬜ | |
| Deep Link: URL → app | Xiaomi Redmi | Android 13 | ⬜ | |
| Deep Link: QR → app | Samsung A54 | Android 14 | ⬜ | |
| Biometric: wallet | Google Pixel | Android 14 | ⬜ | |
| Biometric: wallet | iPhone 15 | iOS 17 | ⬜ | |
| PWA: install prompt | Chrome | Android | ⬜ | |
| PWA: standalone mode | Samsung Internet | Android | ⬜ | |
| PWA: offline | Chrome | Any | ⬜ | |

---

## 5. Unit Test Checklist

### Integration Tests — All Flows (E2E)

- [x] **T-P7-1** Register buyer → login → marketplace → beli produk → payment → tracking
- [x] **T-P7-2** Register supplier → login → listing kayu → terima order
- [x] **T-P7-3** Register generator → login → setor limbah → dapat bid → pickup
- [x] **T-P7-4** Register aggregator → login → treasure map → bid → pickup → warehouse
- [x] **T-P7-5** Register converter → login → beli bahan → buat produk → QR
- [x] **T-P7-6** Register enabler → login → lihat dashboard → verifikasi user
- [ ] **T-P7-7** Full circular flow: supplier → generator → aggregator → converter → buyer

### Performance Tests

- [ ] **T-P7-8** Lighthouse: Performance ≥ 80
- [ ] **T-P7-9** Lighthouse: Accessibility ≥ 90
- [ ] **T-P7-10** Lighthouse: SEO ≥ 95
- [ ] **T-P7-11** Lighthouse: Best Practices ≥ 90
- [ ] **T-P7-12** Bundle size ≤ 150 KB (initial JS)
- [ ] **T-P7-13** Time to Interactive ≤ 3 detik

### Security Tests

- [ ] **T-P7-14** Tidak ada API key di client bundle
- [ ] **T-P7-15** Midtrans server key hanya di server
- [ ] **T-P7-16** PocketBase admin token tidak bocor
- [ ] **T-P7-17** CSRF protection di form actions
- [ ] **T-P7-18** XSS: input HTML di-escape
- [ ] **T-P7-19** Role-based access: user tidak bisa akses route role lain

### Responsive Tests

- [x] **T-P7-20** Marketplace grid: 2 kolom di mobile, 4 kolom di desktop
- [x] **T-P7-21** Sidebar: Sheet di mobile, fixed di desktop
- [ ] **T-P7-22** Chat: single column di mobile, split di desktop
- [x] **T-P7-23** Treasure Map: full height di mobile
- [x] **T-P7-24** Forms: full width di mobile

### Accessibility Tests

- [ ] **T-P7-25** All images have alt text
- [ ] **T-P7-26** All forms have labels
- [ ] **T-P7-27** Keyboard navigation works
- [ ] **T-P7-28** Focus indicators visible
- [ ] **T-P7-29** Color contrast ratio ≥ 4.5:1
- [ ] **T-P7-30** ARIA landmarks present
- [ ] **T-P7-31** Screen reader friendly (role + aria-label)

---

## 6. Performance Targets

| Metrik | Target | Cara Ukur |
|--------|--------|-----------|
| **Lighthouse Performance** | ≥ 80 | `bunx lighthouse https://woodloop.app` |
| **Lighthouse SEO** | ≥ 95 | Lighthouse audit |
| **Lighthouse Accessibility** | ≥ 90 | Lighthouse audit |
| **First Contentful Paint** | ≤ 1.5s | Chrome DevTools |
| **Largest Contentful Paint** | ≤ 2.5s | Chrome DevTools |
| **Time to Interactive** | ≤ 3.0s | Chrome DevTools |
| **Cumulative Layout Shift** | ≤ 0.1 | Chrome DevTools |
| **Bundle JS (initial)** | ≤ 150 KB | `@next/bundle-analyzer` |
| **Bundle CSS (initial)** | ≤ 30 KB | Bundle analyzer |
| **Image size (upload)** | ≤ 2 MB | Client-side compression |
| **Image format** | WebP | next/image auto |
| **PocketBase response** | ≤ 200ms | TanStack Query devtools |
| **APK size** | ≤ 15 MB | `ls -lh android/app/build/outputs/apk/` |

---

## 7. Acceptance Criteria

### Final Release Checklist

- [ ] **AC-1** Semua flow end-to-end berfungsi di browser (Chrome, Firefox, Safari)
- [ ] **AC-2** Semua flow end-to-end berfungsi di Android (Capacitor APK)
- [ ] **AC-3** Kamera berfungsi di device Android (foto + preview)
- [ ] **AC-4** GPS berfungsi di device Android (Treasure Map)
- [ ] **AC-5** Push notification masuk di semua kondisi (foreground, background, killed)
- [ ] **AC-6** QR scanner membaca QR code produk
- [ ] **AC-7** Deep link dari QR → buka app (atau web)
- [ ] **AC-8** PWA bisa diinstall dan jalan sebagai standalone app
- [ ] **AC-9** Halaman publik muncul di hasil pencarian Google (SEO)
- [ ] **AC-10** Lighthouse Performance ≥ 80, SEO ≥ 95
- [ ] **AC-11** Response time PocketBase ≤ 200ms
- [ ] **AC-12** `bun test` coverage ≥ 80%
- [ ] **AC-13** `bun run build` success tanpa error
- [ ] **AC-14** `bun run lint` tanpa warning
- [ ] **AC-15** APK terbuild dan bisa diinstall
- [ ] **AC-16** CI/CD (GitHub Actions) berfungsi
- [ ] **AC-17** README.md + CHANGELOG.md update
- [ ] **AC-18** Semua environment variable terkonfigurasi di Vercel

### Go/No-Go Decision

Proyek siap rilis jika:

```
✅ Lighthouse Performance ≥ 80
✅ Lighthouse SEO ≥ 95
✅ Lighthouse Accessibility ≥ 90
✅ `bun test` lulus ≥ 80%
✅ Semua flow di Capacitor Testing Matrix hijau
✅ Tidak ada critical/high bug
```

---

**Dokumen ini adalah breakdown detail Fase 7 (final) dari PRD WoodLoop Web.**
**Setelah fase ini selesai, WoodLoop siap untuk production release! 🚀**
