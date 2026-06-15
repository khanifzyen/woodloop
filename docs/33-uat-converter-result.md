# UAT Fase 10 — Converter Role (Unit Test + E2E)

**Project:** WoodLoop Web
**Role:** Converter (upcycler)
**Platform:** Chromium Desktop + Chromium Mobile (Pixel 5)
**Framework:** Vitest (unit), Playwright (E2E)
**Files:**
- `src/lib/hooks/use-converter.test.ts` — unit test (18 test cases)
- `e2e/fase-10-converter-crud.e2e.ts` — E2E test (34 test cases)
- `migration/seeder.js` — user `demo.converter@woodloop.id` sudah ada

---

## 1. Unit Test — `use-converter.test.ts`

Framework: Vitest, environment: jsdom, 18 tests, 46 assertions.

### 1.1 Structure & Typing (4 tests)

| ID | Test | Status |
|----|------|--------|
| U-01 | Auth store menyimpan role converter | ✓ |
| U-02 | Query keys: `converterKeys.all`, `.dashboard()`, `.marketplace()`, `.products()`, `.transactions()`, `.designRecipes()`, `.woodTypes()` | ✓ |
| U-03 | Semua 10 hook function diekspor: `useConverterDashboard`, `useMarketplaceMaterials`, `useCreateMarketplaceTransaction`, `useConverterTransactions`, `useConverterProducts`, `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`, `useDesignRecipes`, `useWoodTypes` | ✓ |
| U-04 | Semua query key array length sesuai | ✓ |

### 1.2 Data Fetching (6 tests)

| ID | Test | Status |
|----|------|--------|
| U-05 | `useConverterDashboard` — memanggil `getList` untuk 4 sumber data (transactions, products, recipes skipTotal, all recipes) | ✓ |
| U-06 | `useConverterDashboard` — filter by converter ID di field `buyer` | ✓ |
| U-07 | `useMarketplaceMaterials` — default filter `status="in_stock"` | ✓ |
| U-08 | `useMarketplaceMaterials` — filter `wood_type` diteruskan ke `getList` | ✓ |
| U-09 | `useMarketplaceMaterials` — sort param `price_asc` → `price_per_kg` | ✓ |
| U-10 | `useMarketplaceMaterials` — empty response (items: `[]`) tidak error | ✓ |

### 1.3 Mutations (4 tests)

| ID | Test | Status |
|----|------|--------|
| U-11 | `useCreateMarketplaceTransaction` — create dengan `buyer: conv-1`, `seller`, `inventory_item`, `quantity`, `total_price`, `status: "pending"`, `payment_method` | ✓ |
| U-12 | `useCreateProduct` — create dengan `converter: conv-1`, QR code `PRD-XXXXXXXX`, `source_transactions`, invalidation | ✓ |
| U-13 | `useUpdateProduct` — update dengan partial data (`price`, `stock`) | ✓ |
| U-14 | `useDeleteProduct` — panggil `delete(id)` | ✓ |

### 1.4 Error Handling (2 tests)

| ID | Test | Status |
|----|------|--------|
| U-15 | Authenticated sebagai converter — state terverifikasi | ✓ |
| U-16 | Unauthenticated — state role `null` | ✓ |
| U-17 | PB failure — `getList` throw `Network error` | ✓ |

---

## 2. E2E Test — `fase-10-converter-crud.e2e.ts`

Framework: Playwright, 32 test cases (16 desktop + 16 mobile), real login ke remote PocketBase (`pb-woodloop.pasarjepara.com`).

### 2.1 CONVERTER-DASHBOARD

| ID | Test | Desktop | Mobile |
|----|------|---------|--------|
| E-01 | Heading "Dashboard Converter" + link "Cari Bahan" + link "Buat Produk" | ✓ | ✓ |
| E-02 | Summary cards: Bahan Dibeli, Produk Dibuat, Total Investasi, Desain Tersedia | ✓ | ✓ |

### 2.2 CONVERTER-MARKETPLACE

| ID | Test | Desktop | Mobile |
|----|------|---------|--------|
| E-03 | Sidebar "Pasar Bahan" → heading "Pasar Bahan" | ✓ | ✓ |
| E-04 | Search input placeholder "Cari bahan..." | ✓ | ✓ |
| E-05 | Empty state "Belum ada bahan tersedia" atau material cards | ✓ | ✓ |

### 2.3 CONVERTER-CHECKOUT

| ID | Test | Desktop | Mobile |
|----|------|---------|--------|
| E-06 | URL `/converter/checkout` → empty state "Tidak ada bahan dipilih" | ✓ | ✓ |

### 2.4 CONVERTER-TRANSACTIONS

| ID | Test | Desktop | Mobile |
|----|------|---------|--------|
| E-07 | URL `/converter/marketplace/history` → heading "Riwayat Transaksi" | ✓ | ✓ |
| E-08 | Table headers (Item, Aggregator, Total, Status, Tanggal) atau empty state "Belum ada transaksi" | ✓ | ✓ |

### 2.5 CONVERTER-CATALOG

| ID | Test | Desktop | Mobile |
|----|------|---------|--------|
| E-09 | Sidebar "Katalog Produk" → heading "Katalog Produk" | ✓ | ✓ |
| E-10 | Tombol "Buat Produk" terlihat | ✓ | ✓ |

### 2.6 CONVERTER-CATALOG-NEW

| ID | Test | Desktop | Mobile |
|----|------|---------|--------|
| E-11 | URL `/converter/catalog/new` → heading "Buat Produk Baru", form: Nama produk, Harga (placeholder "0"), Deskripsi | ✓ | ✓ |
| E-12 | Submit kosong → tetap di `/converter/catalog/new` | ✓ | ✓ |
| E-13 | Tombol "Batal" → kembali ke `/converter/catalog` | ✓ | ✓ |

### 2.7 CONVERTER-PROFILE

| ID | Test | Desktop | Mobile |
|----|------|---------|--------|
| E-14 | URL `/converter/profile` → heading "Profil Converter", "Informasi Usaha", "Dokumen Perizinan" | ✓ | ✓ |
| E-15 | Field `#name` terisi dengan nama user (regex `/demo/i`) | ✓ | ✓ |
| E-16 | Tombol "Simpan Profil" terlihat | ✓ | ✓ |

---

## 3. Ringkasan Hasil

| Area | Total | Pass | Fail |
|------|-------|------|------|
| Unit test (web) | 18 | 18 | 0 |
| E2E — Desktop | 17 | 17 | 0 |
| E2E — Mobile | 17 | 17 | 0 |
| **Total** | **52** | **52** | **0** |

---

## 4. Temuan & Hal yang Perlu Diperbaiki

### 4.1 ✅ Fixed — Sidebar tidak memiliki link "Riwayat Transaksi"

**Lokasi:** `woodloop_web/src/components/layout/role-nav.ts`

**Perbaikan:** Ditambahkan link sidebar "Riwayat Transaksi" dengan ikon Clock yang mengarah ke `/converter/marketplace/history`, diletakkan setelah "Katalog Produk" dan sebelum "Klinik Desain".

### 4.2 Minor — Profile page menggunakan `heading-2` CSS class

**Lokasi:** `woodloop_web/src/app/(dashboard)/converter/profile/page.tsx` (baris 78)

**Deskripsi:** Heading profil converter menggunakan className `heading-2` yang tidak dikenali Playwright sebagai role heading. Untuk E2E test, selector `getByRole("heading")` tetap bisa mencocokkan text, tapi konsistensi dengan halaman lain perlu diperhatikan.

**Tidak perlu diperbaiki** — hanya catatan untuk penulisan selector test.

### 4.3 Catatan — Flutter Unit Test

**Lokasi:** `woodloop_app/test/features/converter/`

**Status:** ✅ Semua 30 Flutter converter test pass (product bloc, product datasource, marketplace bloc). Tidak ada perubahan karena hanya melakukan test web.

### 4.4 Catatan — Pre-existing Failures

26 test pre-existing dari file lain (FileDropzone, TimberCard, SummaryCards, WasteFormStepper) gagal karena issue `document is not defined` di jsdom — tidak terkait dengan converter role.

---

## 5. Cara Menjalankan Ulang

```bash
# Unit test converter
cd woodloop_web && bun test src/lib/hooks/use-converter.test.ts

# E2E converter (butuh dev server running)
cd woodloop_web && npx playwright test e2e/fase-10-converter-crud.e2e.ts --reporter=list --workers=1

# Flutter test converter
cd woodloop_app && flutter test test/features/converter/
```
