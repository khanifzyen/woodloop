# Implementation Plan — Fase 5: Buyer

**Project:** WoodLoop Web + Hybrid Mobile
**Durasi:** Hari 26–30
**Fokus:** Marketplace produk upcycled, product detail + traceability, cart, checkout + payment, order tracking, QR scan

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

Fase ini membangun fitur untuk **Buyer** (konsumen akhir). Buyer bisa browsing produk upcycled, melihat cerita traceability, checkout dengan Midtrans payment, dan scan QR code.

### Teknologi Baru

| Teknologi | Untuk |
|-----------|-------|
| Midtrans Snap | Payment gateway |
| qrcode.react | Generate QR code |
| html5-qrcode | Scan QR code (web fallback) |
| @capacitor/barcode-scanner | Scan QR (native) |

**Penting:** Halaman marketplace Buyer menggunakan **SSR/ISR** (Server-Side Rendering) untuk SEO. Produk akan muncul di Google.

---

## 2. Prerequisites

- [ ] Fase 4 complete (Converter flow)
- [ ] Ada data `products` dari Converter (dengan source_transactions)
- [ ] Midtrans account + server key + client key
- [ ] `bun add @midtrans/client snap` (server-side)
- [ ] `bun add qrcode.react html5-qrcode`

---

## 3. Task Breakdown

### Day 26: Marketplace Produk (SSR/ISR)

- [ ] **P5-T1** Buat hooks untuk Buyer:
  - `src/lib/hooks/use-buyer.ts`
  - `useProducts(filters?)` — list products (public, SSR-compatible)
  - `useProductDetail(id)` — single product dengan traceability
  - `useCart()` — Zustand store + PocketBase sync
  - `useCreateOrder()` — mutation
  - `useBuyerOrders()` — list orders
- [ ] **P5-T2** Halaman Marketplace: `src/app/(buyer)/marketplace/page.tsx`
  - **SSR/ISR**: `revalidate = 60` (cache 1 menit)
  - Grid produk upcycled dari semua Converter
  - Filter: kategori (Tabs), price range, wood type
  - Search: Command (cmdk)
  - Sort: Terbaru, Termurah, Termahal, Terlaris
  - SEO meta tags: title, description, og:image
- [ ] **P5-T3** Halaman Kategori: `src/app/(buyer)/marketplace/category/[slug]/page.tsx`
  - SSR produk per kategori (furniture, decor, accessories, art, other)
  - Breadcrumb navigation
- [ ] **P5-T4** Buat komponen `ProductCard`:
  - `src/components/features/product-card.tsx`
  - Foto (aspect-ratio 4/3)
  - Nama, kategori badge, harga
  - Nama Converter
  - Hover: scale + shadow
  - Click → product detail

### Day 27: Product Detail + Traceability

- [ ] **P5-T5** Halaman Detail Produk: `src/app/(buyer)/product/[id]/page.tsx`
  - **SSR** dengan `generateStaticParams` untuk produk populer
  - Galeri foto (Carousel full-width)
  - Nama + deskripsi + harga + stock
  - Kategori badge + wood type badge
  - Nama Converter (link ke profil)
  - **Traceability Section**:
    - Timeline visual: Supplier → Generator → Aggregator → Converter
    - Setiap step: nama pelaku, tanggal, foto, lokasi
    - Impact badges: CO2 saved, waste diverted
  - "Tambah ke Keranjang" button + quantity selector
  - "Beli Langsung" button
  - Structured data (JSON-LD) untuk Google Rich Snippets
- [ ] **P5-T6** Buat komponen `ProductTimeline`:
  - `src/components/features/product-timeline.tsx`
  - Stepper visual
  - Setiap step: avatar + nama + role + tanggal + foto
  - Animated: scroll reveal
- [ ] **P5-T7** Buat komponen `ImpactBadges`:
  - `src/components/features/impact-badges.tsx`
  - CO2 saved (kg)
  - Waste diverted (kg)
  - Pohon terselamatkan (estimated)
  - Icon + animasi counter
- [ ] **P5-T8** Buat komponen `SellerInfo`:
  - `src/components/features/seller-info.tsx`
  - Avatar + nama Converter
  - Rating (jika ada)
  - Location
  - "Lihat Produk Lain" link

### Day 28: Cart + Checkout

- [ ] **P5-T9** Setup Zustand cart store: `src/lib/stores/cart-store.ts`
  - `items: CartItem[]`
  - `addItem(product, quantity)`
  - `removeItem(productId)`
  - `updateQuantity(productId, qty)`
  - `clearCart()`
  - `total: number` (computed)
  - `itemCount: number` (computed)
  - **Persist** ke localStorage (Zustand persist middleware)
  - **Sync** ke PocketBase `cart_items` (saat user login)
- [ ] **P5-T10** Halaman Keranjang: `src/app/(buyer)/cart/page.tsx`
  - List item: foto, nama, harga, quantity (increment/decrement)
  - Subtotal per item + total keseluruhan
  - Empty state: "Keranjang masih kosong" + link ke marketplace
  - "Checkout" button (disabled jika kosong)
  - Loading state: Skeleton list
- [ ] **P5-T11** Halaman Checkout: `src/app/(buyer)/checkout/page.tsx`
  - Ringkasan pesanan (list item + total)
  - Alamat pengiriman: Form (nama, telepon, alamat lengkap)
  - Metode pembayaran: QRIS, Virtual Account, Bank Transfer, COD
  - Catatan (textarea)
  - Tombol: "Bayar Sekarang"
  - Submit → Server Action → Midtrans Snap token
- [ ] **P5-T12** Setup Midtrans integration:
  - `src/app/api/midtrans/route.ts` — API route untuk generate Snap token
  - Server: `Midtrans.Snap.createTransaction()` dengan order details
  - Client: Midtrans Snap popup setelah token didapat
  - Handle callback: update `orders.status` → `paid`

### Day 29: Order Tracking + QR Scan

- [ ] **P5-T13** Halaman Pesanan Saya: `src/app/(buyer)/orders/page.tsx`
  - List orders: foto produk, nama, status, total, tanggal
  - Tabs: Semua | Diproses | Dikirim | Selesai
  - Status badges + progress bar
  - Click → detail order
- [ ] **P5-T14** Halaman Detail Order: `src/app/(buyer)/orders/[id]/page.tsx`
  - Timeline: payment → processing → shipped → received
  - Tracking number (jika ada)
  - Link ke product detail
  - "Terima Pesanan" button (jika status shipped)
  - "Hubungi Penjual" button (redirect ke chat)
- [ ] **P5-T15** Halaman QR Scan: `src/app/(buyer)/scan/page.tsx`
  - Kamera view (native Capacitor) atau upload (web)
  - Gunakan `html5-qrcode` library
  - Deteksi QR → extract `qr_code_id`
  - Redirect ke `/p/[qr_code_id]`
- [ ] **P5-T16** Buat komponen `OrderTimeline`:
  - `src/components/features/order-timeline.tsx`
  - Stepper dengan status: payment_pending → paid → processing → shipped → received
  - Tiap step: icon + label + tanggal

### Day 30: Public Traceability (SSR) + Polish

- [ ] **P5-T17** Halaman Traceability Publik: `src/app/p/[qr_code_id]/page.tsx`
  - **Full RSC (React Server Component)** — zero JavaScript
  - Fetch product data dari PocketBase di server
  - Tampilkan: foto produk, nama, harga
  - Timeline traceability (SSR version — without interactivity)
  - Impact badges (static)
  - CTA: "Beli Produk Ini" → link ke `/buyer/product/[id]`
  - SEO meta tags: title = product name, description = cerita traceability
  - Open Graph: image, title, description (buat sharing ke WhatsApp/medsos)
- [ ] **P5-T18** Update sitemap: `src/app/sitemap.ts`
  - Tambahkan semua produk path `/p/[qr_code_id]`
  - Tambahkan semua kategori `/buyer/marketplace/category/[slug]`
  - Tambahkan semua produk detail `/buyer/product/[id]`
- [ ] **P5-T19** Loading states: Skeleton untuk marketplace, product detail
- [ ] **P5-T20** Empty: "Tidak ada produk" / "Keranjang kosong" / "Belum ada pesanan"
- [ ] **P5-T21** Error: Alert + retry
- [ ] **P5-T22** i18n: semua string Buyer
- [ ] **P5-T23** Responsive: grid marketplace 2 kolom mobile, 4 kolom desktop
- [ ] **P5-T24** E2E: Buyer browse → lihat traceability → add to cart → checkout → bayar → tracking

---

## 4. File Structure (Output Fase 5)

```
src/
├── app/
│   ├── (buyer)/
│   │   ├── marketplace/
│   │   │   ├── page.tsx                 # SSR/ISR
│   │   │   └── category/[slug]/page.tsx # SSR
│   │   ├── product/[id]/page.tsx         # SSR
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── scan/page.tsx
│   ├── p/
│   │   └── [qr_code_id]/page.tsx        # RSC (zero JS)
│   ├── api/
│   │   └── midtrans/route.ts
│   └── sitemap.ts
├── components/
│   └── features/
│       ├── product-card.tsx
│       ├── product-timeline.tsx
│       ├── impact-badges.tsx
│       ├── seller-info.tsx
│       └── order-timeline.tsx
├── lib/
│   ├── hooks/
│   │   └── use-buyer.ts
│   └── stores/
│       └── cart-store.ts
```

---

## 5. Unit Test Checklist

### Hooks — useBuyer

- [ ] **T-P5-1** `useProducts` return array + pagination
- [ ] **T-P5-2** `useProducts` filter by kategori
- [ ] **T-P5-3** `useProducts` sort by price
- [ ] **T-P5-4** `useProductDetail` return product + traceability
- [ ] **T-P5-5** `useCreateOrder` mutation sukses
- [ ] **T-P5-6** `useBuyerOrders` filter by status

### Store — CartStore

- [ ] **T-P5-7** `addItem` adds unique product
- [ ] **T-P5-8** `addItem` increments quantity jika sudah ada
- [ ] **T-P5-9** `removeItem` removes from list
- [ ] **T-P5-10** `updateQuantity` changes quantity
- [ ] **T-P5-11** `clearCart` empties list
- [ ] **T-P5-12** `total` computed correctly
- [ ] **T-P5-13** `itemCount` computed correctly
- [ ] **T-P5-14** Persist ke localStorage (reload masih ada)
- [ ] **T-P5-15** Sync ke PocketBase saat login

### Components — ProductCard

- [ ] **T-P5-16** Render foto + nama + harga
- [ ] **T-P5-17** Kategori badge
- [ ] **T-P5-18** Click → navigate ke detail
- [ ] **T-P5-19** Hover effect

### Components — ProductTimeline

- [ ] **T-P5-20** Render 4 steps (Supplier → Generator → Aggregator → Converter)
- [ ] **T-P5-21** Setiap step punya avatar + nama + date
- [ ] **T-P5-22** Highlight step aktif

### Components — ImpactBadges

- [ ] **T-P5-23** Render CO2 saved
- [ ] **T-P5-24** Render waste diverted
- [ ] **T-P5-25** Format angka dengan benar

### Halaman — Marketplace (SSR)

- [ ] **T-P5-26** SSR: render produk dari server
- [ ] **T-P5-27** ISR: revalidate setelah 60 detik
- [ ] **T-P5-28** SEO meta tags ada di HTML
- [ ] **T-P5-29** Structured data JSON-LD

### Halaman — Cart

- [ ] **T-P5-30** List items render
- [ ] **T-P5-31** Quantity increment/decrement
- [ ] **T-P5-32** Total price update
- [ ] **T-P5-33** Empty state
- [ ] **T-P5-34** Checkout button disabled jika kosong

### Halaman — Checkout

- [ ] **T-P5-35** Order summary render
- [ ] **T-P5-36** Address form validation (Zod)
- [ ] **T-P5-37** Payment method selection
- [ ] **T-P5-38** Submit → API call Midtrans
- [ ] **T-P5-39** Error handling (Midtrans gagal)

### Halaman — Traceability (/p/[id])

- [ ] **T-P5-40** RSC render tanpa JavaScript
- [ ] **T-P5-41** Fetch product dari PocketBase
- [ ] **T-P5-42** SEO meta tags
- [ ] **T-P5-43** Open Graph tags
- [ ] **T-P5-44** 404 jika qr_code_id tidak valid

---

## 6. Acceptance Criteria

- [ ] **AC-1** Marketplace Buyer menampilkan produk dari semua Converter (SSR)
- [ ] **AC-2** Halaman produk muncul di Google (SEO meta tags + JSON-LD)
- [ ] **AC-3** Traceability timeline menampilkan perjalanan produk
- [ ] **AC-4** QR code scan → redirect ke `/p/[qr_code_id]`
- [ ] **AC-5** Halaman `/p/[qr_code_id]` adalah pure RSC (zero JS)
- [ ] **AC-6** Cart persist di localStorage + sync ke PocketBase
- [ ] **AC-7** Checkout + Midtrans payment flow berfungsi
- [ ] **AC-8** Order tracking dengan timeline visual
- [ ] **AC-9** Sitemap mencakup semua produk + kategori
- [ ] **AC-10** Lighthouse: Performance ≥ 80 (ISR cache), SEO ≥ 95, Accessibility ≥ 85
- [ ] **AC-11** Semua halaman responsive
- [ ] **AC-12** `bun test` lulus minimal 80%
