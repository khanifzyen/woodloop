# UAT Fase 7 — Native & Polish (Final Regression)

**Project:** WoodLoop Web + Hybrid Mobile
**Fase:** 7 (Native & Polish — Final Regression)
**Platform:** Chromium Desktop + Chromium Mobile (Pixel 5)
**Framework:** Playwright
**File:** `e2e/fase-7-regression.e2e.ts`

---

## Daftar Isi

1. [Test Cases — Auth Flow](#1-test-cases--auth-flow)
2. [Test Cases — Public Pages](#2-test-cases--public-pages)
3. [Test Cases — Supplier Flow](#3-test-cases--supplier-flow)
4. [Test Cases — Generator Flow](#4-test-cases--generator-flow)
5. [Test Cases — Aggregator Flow](#5-test-cases--aggregator-flow)
6. [Test Cases — Converter Flow](#6-test-cases--converter-flow)
7. [Test Cases — Buyer Flow](#7-test-cases--buyer-flow)
8. [Test Cases — Enabler & Shared](#8-test-cases--enabler--shared)
9. [Test Cases — Responsive & SEO](#9-test-cases--responsive--seo)
10. [Jalankan Test](#10-jalankan-test)

---

## 1. Test Cases — Auth Flow

### TC-REG-01: Auth Flow

| ID | Skenario | Langkah | Expected Result | Desktop | Mobile |
|----|----------|---------|-----------------|---------|--------|
| **R01-01** | Login all 7 roles sequentially | 1. Login sebagai supplier<br>2. Login sebagai generator<br>3. Login sebagai aggregator<br>4. Login sebagai converter<br>5. Login sebagai enabler<br>6. Login sebagai buyer | Semua login berhasil, redirect ke dashboard masing-masing | ✓ | ✓ |
| **R01-02** | Wrong password | 1. Masukkan email valid<br>2. Masukkan password salah<br>3. Klik Masuk | Tetap di halaman `/login`, tidak redirect | ✓ | ✓ |
| **R01-03** | Protected route tanpa auth | 1. Buka `/supplier/dashboard` tanpa login | Redirect ke `/login` | ✓ | ✓ |

---

## 2. Test Cases — Public Pages

### TC-REG-02: Public Pages

| ID | Skenario | Langkah | Expected Result | Desktop | Mobile |
|----|----------|---------|-----------------|---------|--------|
| **R02-01** | Homepage redirect ke onboarding | 1. Buka `/` | Redirect ke `/onboarding` | ✓ | ✓ |
| **R02-02** | Traceability SSR page | 1. Buka `/p/PRD-TEST` | Halaman traceability tampil, URL contains `/p/` | ✓ | ✓ |
| **R02-03** | Sitemap XML tersedia | 1. GET `/sitemap.xml` | Status 200, response contains `urlset` | ✓ | ✓ |
| **R02-04** | Robots.txt tersedia | 1. GET `/robots.txt` | Status 200 | ✓ | ✓ |
| **R02-05** | Manifest JSON tersedia | 1. GET `/manifest.webmanifest` | Status 200, JSON valid dengan `name` mengandung "WoodLoop" | ✓ | ✓ |

---

## 3. Test Cases — Supplier Flow

### TC-REG-03: Supplier Flow

| ID | Skenario | Langkah | Expected Result | Desktop | Mobile |
|----|----------|---------|-----------------|---------|--------|
| **R03-01** | Dashboard renders | 1. Login sebagai supplier<br>2. Buka `/supplier/dashboard` | Heading "Dashboard Supplier" + "Listing Aktif" + "Order Masuk" visible | ✓ | ✓ |
| **R03-02** | Inventory page accessible | 1. Klik sidebar "Inventaris Kayu" | Heading "Inventaris Kayu" visible | ✓ | ✓ |
| **R03-03** | Orders page accessible | 1. Klik sidebar "Pesanan Masuk" | Heading "Pesanan Masuk" visible | ✓ | ✓ |
| **R03-04** | Sales page with chart | 1. Klik sidebar "Riwayat Penjualan" | Heading "Riwayat Penjualan" visible | ✓ | ✓ |

---

## 4. Test Cases — Generator Flow

### TC-REG-04: Generator Flow

| ID | Skenario | Langkah | Expected Result | Desktop | Mobile |
|----|----------|---------|-----------------|---------|--------|
| **R04-01** | Dashboard renders | 1. Login sebagai generator | "Limbah Disetor" visible | ✓ | ✓ |
| **R04-02** | Report waste page | 1. Klik sidebar "Setor Limbah" | "Langkah 1 dari 4" visible | ✓ | ✓ |
| **R04-03** | Buy timber page | 1. Klik sidebar "Beli Kayu" | "Beli Kayu Mentah" visible | ✓ | ✓ |
| **R04-04** | Products page | 1. Klik sidebar "Produk Saya" | Heading "Produk Saya" visible | ✓ | ✓ |

---

## 5. Test Cases — Aggregator Flow

### TC-REG-05: Aggregator Flow

| ID | Skenario | Langkah | Expected Result | Desktop | Mobile |
|----|----------|---------|-----------------|---------|--------|
| **R05-01** | Dashboard with summary cards | 1. Login sebagai aggregator | "Penjemputan Hari Ini" visible | ✓ | ✓ |
| **R05-02** | Treasure Map renders Leaflet | 1. Klik sidebar "Peta" | Leaflet container (`.leaflet-container`) visible | ✓ | ✓ |
| **R05-03** | Pickups page with tabs | 1. Klik sidebar "Penjemputan" | "Perlu Dijemput" visible | ✓ | ✓ |
| **R05-04** | Warehouse page | 1. Klik sidebar "Gudang" | "Total Berat" visible | ✓ | ✓ |

---

## 6. Test Cases — Converter Flow

### TC-REG-06: Converter Flow

| ID | Skenario | Langkah | Expected Result | Desktop | Mobile |
|----|----------|---------|-----------------|---------|--------|
| **R06-01** | Dashboard summary | 1. Login sebagai converter | "Bahan Dibeli" visible | ✓ | ✓ |
| **R06-02** | Marketplace materials | 1. Klik sidebar "Pasar Bahan" | Search input dengan placeholder "Cari bahan..." visible | ✓ | ✓ |
| **R06-03** | Catalog page | 1. Klik sidebar "Katalog Produk" | Heading "Katalog Produk" visible | ✓ | ✓ |
| **R06-04** | Design Clinic | 1. Klik sidebar "Klinik Desain" | Search input dengan placeholder "Cari desain..." visible | ✓ | ✓ |

---

## 7. Test Cases — Buyer Flow

### TC-REG-07: Buyer Flow

| ID | Skenario | Langkah | Expected Result | Desktop | Mobile |
|----|----------|---------|-----------------|---------|--------|
| **R07-01** | Marketplace loads | 1. Login sebagai buyer<br>2. Buka `/buyer/marketplace` | URL contains "marketplace" | ✓ | ✓ |
| **R07-02** | Cart page | 1. Buka `/buyer/cart` | URL contains "cart" | ✓ | ✓ |
| **R07-03** | Orders page | 1. Buka `/buyer/orders` | URL contains "orders" | ✓ | ✓ |

---

## 8. Test Cases — Enabler & Shared

### TC-REG-08: Enabler & Shared

| ID | Skenario | Langkah | Expected Result | Desktop | Mobile |
|----|----------|---------|-----------------|---------|--------|
| **R08-01** | Enabler dashboard impact cards | 1. Login sebagai enabler | "Limbah Terpakai" + "CO₂ Tersimpan" visible | ✓ | ✓ |
| **R08-02** | User management | 1. Klik sidebar "Manajemen User" | Heading "Manajemen User" visible | ✓ | ✓ |
| **R08-03** | Wallet page | 1. Buka `/wallet` | URL contains "wallet" | ✓ | ✓ |
| **R08-04** | Notifications page | 1. Buka `/notifications` | URL contains "notifications" | ✓ | ✓ |

---

## 9. Test Cases — Responsive & SEO

### TC-REG-09: Responsive & SEO

| ID | Skenario | Langkah | Expected Result | Desktop | Mobile |
|----|----------|---------|-----------------|---------|--------|
| **R09-01** | Sitemap contains product URLs | 1. GET `/sitemap.xml` | Response valid XML contains "woodloop.app" + "sitemap" | ✓ | ✓ |
| **R09-02** | Manifest valid JSON | 1. GET `/manifest.webmanifest` | JSON valid dengan `display: "standalone"` + `theme_color` terisi | ✓ | ✓ |
| **R09-03** | Offline page renders | 1. Buka `/offline` | Heading "Kamu Sedang Offline" + tombol "Coba Lagi" visible | ✓ | ✓ |
| **R09-04** | JSON-LD Organization di root layout | 1. Buka halaman manapun, inspect `<head>` | `<script type="application/ld+json">` dengan `@type: "Organization"` ada | ✓ | ✓ |
| **R09-05** | JSON-LD WebSite di root layout | 1. Inspect `<head>` | `@type: "WebSite"` dengan SearchAction ada | ✓ | ✓ |
| **R09-06** | JSON-LD BreadcrumbList di marketplace | 1. Buka `/buyer/marketplace` | `@type: "BreadcrumbList"` dengan items Beranda + Marketplace | ✓ | ✓ |
| **R09-07** | JSON-LD Product + Breadcrumb di traceability | 1. Buka `/p/PRD-TEST` | `@type: "Product"` + `@type: "BreadcrumbList"` ada di halaman | ✓ | ✓ |
| **R09-08** | Service worker terdaftar | 1. Buka halaman manapun, cek Application > SW | Service worker `sw.js` terdaftar | ✓ | ✓ |
| **R09-09** | PWA icons tersedia | 1. GET `/icon-192.png` | Status 200, PNG valid | ✓ | ✓ |
| **R09-10** | PWA icons tersedia 512px | 1. GET `/icon-512.png` | Status 200, PNG valid | ✓ | ✓ |
| **R09-11** | Sitemap contains buyer product URLs | 1. GET `/sitemap.xml` | Response mengandung `/buyer/product/` entries | ✓ | ✓ |
| **R09-12** | Sitemap contains /scan | 1. GET `/sitemap.xml` | Response mengandung `/buyer/scan` | ✓ | ✓ |
| **R09-13** | metadataBase terdefinisi | 1. Cek layout metadata | `metadataBase` = `https://woodloop.app` | ✓ | ✓ |
| **R09-14** | Viewport dengan themeColor | 1. Cek viewport export | `themeColor: "#2D6A4F"`, `colorScheme: "light"` | ✓ | ✓ |
| **R09-15** | Open Graph default image | 1. Cek root layout metadata | `openGraph.images` mengarah ke `/icon-512.png` | ✓ | ✓ |
| **R09-16** | Canonical URL | 1. Cek root layout metadata | `alternates.canonical = "https://woodloop.app"` | ✓ | ✓ |

---

## 10. Jalankan Test

```bash
# Install Playwright browsers (pertama kali saja)
cd woodloop_web
bunx playwright install chromium

# Jalankan semua test Fase 7 — Chromium Desktop
bun run e2e -- --grep "REGRESSION" --project=chromium-desktop

# Jalankan semua test Fase 7 — Chromium Mobile
bun run e2e -- --grep "REGRESSION" --project=chromium-mobile

# Jalankan dengan UI mode
bun run e2e:ui

# Lihat report HTML
bun run e2e:report
```

### Test Matrix

| Browser | Viewport | Test Coverage |
|---------|----------|---------------|
| Chromium Desktop | 1280×720 | TC-REG-01 – TC-REG-09 |
| Chromium Mobile (Pixel 5) | 393×851 | TC-REG-01 – TC-REG-09 |

---

## Hasil Test (19 Mei 2026)

```
Platform            Tests    Passed    Failed
──────────────────────────────────────────────
Chromium Desktop      33        33        0
Chromium Mobile       33        33        0
──────────────────────────────────────────────
TOTAL                 66        66        0
```

**Status: ✅ ALL TESTS PASSED**
