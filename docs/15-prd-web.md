# Product Requirement Document (PRD) — WoodLoop Web + Hybrid Mobile

**Nama Proyek:** WoodLoop: Jepara Circular Hub
**Versi:** 2.0 (Rewrite Web)
**Platform:** Web (Next.js) + Hybrid Mobile (Capacitor)
**Status:** Perencanaan
**Terakhir Diperbarui:** 19 Mei 2026

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Keputusan Teknologi](#2-keputusan-teknologi)
3. [Arsitektur Aplikasi](#3-arsitektur-aplikasi)
4. [Peran Pengguna & Hak Akses](#4-peran-pengguna--hak-akses)
5. [Fitur Native & Capacitor Plugins](#5-fitur-native--capacitor-plugins)
6. [Struktur Rute (Routes)](#6-struktur-rute-routes)
7. [Spesifikasi Fungsional per Role](#7-spesifikasi-fungsional-per-role)
8. [Database Schema (PocketBase)](#8-database-schema-pocketbase)
9. [Strategi Hybrid: Web + Mobile](#9-strategi-hybrid-web--mobile)
10. [Roadmap Implementasi](#10-roadmap-implementasi)
11. [Estimasi Biaya](#11-estimasi-biaya)
12. [Design System & Component Library (shadcn/ui)](#12-design-system--component-library-shadcnui)
13. [Integrasi Pi Agent — Design System Skill](#13-integrasi-pi-agent--design-system-skill)

---

## 1. Pendahuluan

### 1.1 Latar Belakang

WoodLoop saat ini merupakan aplikasi **Flutter** (mobile-first) dengan arsitektur Clean Architecture + BLoC, backend **PocketBase**, dan 17 koleksi database. Aplikasi ini melayani ekosistem ekonomi sirkular industri kayu di Jepara dengan 7 peran pengguna.

**Dokumen ini mendefinisikan ulang (rewrite) WoodLoop dari Flutter menjadi aplikasi web + hybrid mobile** menggunakan stack teknologi modern yang lebih sesuai untuk kebutuhan platform ini.

### 1.2 Alasan Rewrite

| Alasan | Detail |
|--------|--------|
| **SEO & Marketplace** | Buyer (konsumen akhir) perlu menemukan produk via Google. Flutter buruk untuk SEO. |
| **QR Traceability** | Setiap produk punya QR code → scan → landing page web (SSR). Tidak perlu install app. |
| **Aksesibilitas** | Enabler (pemerintah) cukup buka browser di laptop. Konsumen cukup klik link. |
| **Maintenance** | Satu codebase TypeScript untuk Web + Android + iOS. Ekosistem React/Next.js lebih besar. |
| **Developer Hiring** | Jauh lebih mudah cari developer React/Next.js dibanding Flutter. |

### 1.3 Tujuan

1. Membangun ulang WoodLoop sebagai **PWA + Hybrid Mobile App** dengan satu codebase.
2. Mempertahankan **semua fitur dan 7 role** yang sudah ada di versi Flutter.
3. Menggunakan **PocketBase yang sama** (migration, schema, hooks) — tidak perlu rewrite backend.
4. Memberikan **pengalaman native** (kamera, GPS, push notif) untuk role yang bertugas di lapangan.
5. Memberikan **akses web cepat** (tanpa install) untuk Buyer dan Enabler.

### 1.4 Masalah yang Dihadapi (Sama)

- **Penumpukan Limbah:** Limbah kayu dibakar/dibuang begitu saja.
- **Rantai Pasok Terfragmentasi:** Tidak ada koordinasi antara penghasil limbah (Generator) dan pengguna potensial (Converter).
- **Peluang Ekonomi Terlewatkan:** Limbah dipandang sebagai sampah.
- **Kurangnya Ketertelusuran:** Tidak ada transparansi asal-usul produk kayu.

---

## 2. Keputusan Teknologi

### 2.1 Stack Utama

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| **Runtime** | **Bun** | Package manager & runner. 10x lebih cepat dari Node.js, native ESM, compatible dengan Next.js & Capacitor. |
| **Framework Web** | **Next.js (latest / 15+)** | App Router, React Server Components (RSC), SSR/ISR untuk SEO, Server Actions untuk form. |
| **Styling** | **Tailwind CSS v4+** | Utility-first, build size kecil, easy to maintain. |
| **State Management** | **TanStack Query** | Server state (data PocketBase). Caching, refetch, optimistic updates. |
| | **Zustand** | Client state (UI state, cart, wallet balance). |
| **Native Runtime** | **Capacitor** | Wrapper dari Ionic untuk akses native (kamera, GPS, push) dari codebase web yang sama. |
| **Backend** | **PocketBase (existing)** | Tidak berubah. Migration, hooks, API rules tetap sama. |
| **Maps** | **Leaflet** (free) atau **Google Maps JS API** | Peta Treasure Map untuk Aggregator. |
| **i18n** | **next-intl** | Internasionalisasi EN/ID. |
| **UI Components** | **shadcn/ui** | Components Tailwind-based, reusable, accessible. Install via `npx shadcn@latest add`. Semua komponen menggunakan shadcn/ui primitives — tidak boleh custom <div>. |
| **QR Code** | **qrcode.react** (generate) + **html5-qrcode** / **capacitor-barcode-scanner** (scan) | Generate QR untuk produk. Scan untuk traceability. |
| **Chart** | **recharts** | Dashboard analytics untuk Enabler. |

### 2.2 Struktur Folder

```
woodloop/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 #   Login, Register, Onboarding
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── onboarding/
│   │   │   └── role-selection/
│   │   ├── (supplier)/             #   Supplier routes (layout khusus)
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── orders/
│   │   │   └── sales/
│   │   ├── (generator)/            #   Generator routes
│   │   │   ├── dashboard/
│   │   │   ├── report-waste/
│   │   │   ├── buy-timber/
│   │   │   └── products/
│   │   ├── (aggregator)/           #   Aggregator routes
│   │   │   ├── dashboard/
│   │   │   ├── treasure-map/
│   │   │   ├── pickups/
│   │   │   ├── warehouse/
│   │   │   └── bidding/
│   │   ├── (converter)/            #   Converter routes
│   │   │   ├── dashboard/
│   │   │   ├── marketplace/
│   │   │   ├── checkout/
│   │   │   ├── catalog/
│   │   │   └── design-clinic/
│   │   ├── (enabler)/              #   Enabler routes
│   │   │   ├── dashboard/
│   │   │   └── users/
│   │   ├── (buyer)/                #   Buyer routes
│   │   │   ├── marketplace/
│   │   │   ├── product/[id]/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── orders/
│   │   └── p/                      #   Public (no auth required)
│   │       └── [qr_code_id]/       #     → SSR traceability page
│   ├── components/                 # Shared UI components (shadcn/ui + custom)
│   │   ├── ui/                     #   shadcn/ui primitives
│   │   ├── layout/                 #   Sidebar, Navbar, Footer (per role)
│   │   └── features/               #   Feature-specific components
│   ├── lib/
│   │   ├── pocketbase/             # PocketBase client singleton
│   │   │   ├── client.ts
│   │   │   └── types.ts            #   Auto-generated types dari schema
│   │   ├── native/                 # ** Native Abstraction Layer **
│   │   │   ├── camera.ts           #   → Capacitor camera | web fallback
│   │   │   ├── geolocation.ts      #   → Capacitor GPS | browser geo
│   │   │   ├── notifications.ts    #   → FCM push | in-app fallback
│   │   │   ├── biometric.ts        #   → Biometric auth (native only)
│   │   │   └── qr-scanner.ts       #   → Cap. scanner | html5-qrcode
│   │   ├── hooks/                  # TanStack Query hooks (per collection)
│   │   ├── stores/                 # Zustand stores (cart, wallet, UI)
│   │   ├── utils/                  # Formatting, helpers
│   │   └── validations/            # Zod schemas (form validation)
│   ├── middleware.ts               # Auth + Role-based redirect
│   ├── i18n/                       # next-intl
│   │   ├── en.json
│   │   └── id.json
│   └── styles/                     # Global CSS
├── android/                        # Auto-generated by Capacitor
├── ios/                            # Auto-generated by Capacitor
├── pocketbase/                     # Migration scripts (existing, copy)
│   └── collections/
├── capacitor.config.ts
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── bun.lock
└── .env.local
```

---

## 3. Arsitektur Aplikasi

### 3.1 Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Web)                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js (App Router)                    │    │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────────────┐   │    │
│  │  │  RSC    │  │  Server  │  │   Client Page    │   │    │
│  │  │ (Public)│  │  Actions │  │  (Dashboard dkk) │   │    │
│  │  └─────────┘  └──────────┘  └────────┬─────────┘   │    │
│  │                                       │              │    │
│  │                              ┌────────▼────────┐    │    │
│  │                              │  TanStack Query  │    │    │
│  │                              │   (React Query)  │    │    │
│  │                              └────────┬────────┘    │    │
│  │                                       │              │    │
│  └───────────────────────────────────────┼──────────────┘    │
│                                          │                    │
│  ┌───────────────────────────────────────┼──────────────┐    │
│  │         Capacitor WebView             │              │    │
│  │  (Hanya untuk App Mobile)             │              │    │
│  │  ┌────────────────────────────────┐   │              │    │
│  │  │  Native Plugins (Camera, GPS)  │   │              │    │
│  │  └────────────────────────────────┘   │              │    │
│  └───────────────────────────────────────┼──────────────┘    │
└──────────────────────────────────────────┼───────────────────┘
                                           │
                                    ┌──────▼──────┐
                                    │  PocketBase  │
                                    │  (Backend)   │
                                    │              │
                                    │  - Auth      │
                                    │  - Database  │
                                    │  - Realtime  │
                                    │  - Hooks     │
                                    │  - File Store │
                                    └─────────────┘
```

### 3.2 Pola Data Flow

```
User Action (Form/Button)
       │
       ▼
Client Component ('use client')
       │
       ├── TanStack Query mutation → PocketBase SDK → Backend
       │       │
       │       └── Optimistic update + Invalidate cache
       │
       ├── Zustand store → Client state (UI, cart)
       │
       └── Server Action → Form submission (untuk non-realtime)
```

### 3.3 Native Abstraction Layer

Semua akses fitur native (kamera, GPS, notifikasi) melalui **satu layer** yang otomatis mendeteksi platform:

```typescript
// lib/native/camera.ts
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export async function takePhoto(): Promise<string | null> {
  if (Capacitor.isPluginAvailable('Camera')) {
    // 📱 Native Android/iOS
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 80,
    });
    return image.dataUrl ?? null;
  } else {
    // 🌐 Web browser
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }
}
```

Dengan pola ini, **semua komponen React cukup panggil `takePhoto()`** — tidak perlu peduli platform.

---

## 4. Peran Pengguna & Hak Akses

### 4.1 Enam Role Pengguna

| Role | Deskripsi | Platform Utama | Fitur Native Diperlukan |
|------|-----------|----------------|------------------------|
| **Supplier** | Pedagang kayu gelondongan | Mobile (Capacitor) | Kamera (foto kayu), File (dokumen legalitas) |
| **Generator** | Pengrajin mebel/Sawmill (penghasil limbah) | Mobile (Capacitor) | Kamera (foto limbah), GPS (lokasi) |
| **Aggregator** | Pengepul/Logistik | Mobile (Capacitor) | GPS (peta & rute), Kamera (bukti pickup) |
| **Converter** | Pengrajin kreatif/pengolah limbah | Web + Mobile | Kamera (foto produk) |
| **Enabler** | Pemerintah/Asosiasi | **Web (Desktop)** | Tidak ada (dashboard saja) |
| **Buyer** | Konsumen akhir | **Web (Browser HP)** | QR Scanner (traceability) |

### 4.2 Route Protection (Middleware)

```typescript
// middleware.ts
const roleRoutes: Record<string, string[]> = {
  supplier:   ['/(supplier)/*'],
  generator:  ['/(generator)/*'],
  aggregator: ['/(aggregator)/*'],
  converter:  ['/(converter)/*'],
  enabler:    ['/(enabler)/*'],
  buyer:      ['/(buyer)/*'],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('pb_auth');
  const role = getRoleFromToken(token);
  const path = request.nextUrl.pathname;

  // Route group → role matching
  // Redirect jika tidak sesuai
}
```

### 4.3 Halaman Publik (No Auth)

| Route | Deskripsi |
|-------|-----------|
| `/p/[qr_code_id]` | Halaman traceability produk (SSR) — bisa diakses siapa saja |
| `/login` | Login page |
| `/register` | Register page |
| `/onboarding` | Tutorial slides |
| `/role-selection` | Pilih role setelah register |

---

## 5. Fitur Native & Capacitor Plugins

### 5.1 Mapping Fitur Native

| Fitur | Plugin Capacitor | Web Fallback | Prioritas |
|-------|------------------|--------------|-----------|
| **📸 Kamera** (foto limbah, produk, profil) | `@capacitor/camera` | `<input type="file" capture>` | **High** |
| **📍 GPS** (Treasure Map, alamat registrasi) | `@capacitor/geolocation` | Browser Geolocation API | **High** |
| **🔔 Push Notifikasi** (bid baru, pickup, order) | `@capacitor/push-notifications` | In-app notification + Web Push (fallback) | **High** |
| **📱 Biometric** (keamanan wallet) | `@capacitor/biometric-auth` | Tidak ada (skip) | **Low** |
| **📷 QR Scanner** (traceability produk) | `capacitor-barcode-scanner` | `html5-qrcode` library | **Medium** |
| **💾 File System** (dokumen legalitas) | `@capacitor/filesystem` | Browser File API | **Medium** |
| **🔗 Deep Linking** (QR → halaman produk) | `@capacitor/app` | URL routing biasa | **Medium** |
| **🌐 Offline** (cache data lapangan) | Service Worker + IndexedDB | Sama (PWA) | **Low** |

### 5.2 Deteksi Platform (Runtime)

```typescript
// lib/native/platform.ts
import { Capacitor } from '@capacitor/core';

export const Platform = {
  isNative: Capacitor.isNativePlatform(),
  isWeb: !Capacitor.isNativePlatform(),
  isAndroid: Capacitor.getPlatform() === 'android',
  isIOS: Capacitor.getPlatform() === 'ios',
  os: Capacitor.getPlatform(), // 'web' | 'android' | 'ios'
};
```

---

## 6. Struktur Rute (Routes)

### 6.1 Route Groups

```
src/app/
├── (auth)/                     # Group: Tanpa sidebar/navbar
│   ├── page.tsx                #   Redirect ke /login atau dashboard
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── onboarding/page.tsx
│   └── role-selection/page.tsx
│
├── (supplier)/layout.tsx       # Layout: Sidebar Supplier
├── (supplier)/dashboard/page.tsx
├── (supplier)/inventory/
├── (supplier)/orders/
├── (supplier)/sales/
│
├── (generator)/layout.tsx      # Layout: Sidebar Generator
├── (generator)/dashboard/page.tsx
├── (generator)/report-waste/page.tsx
├── (generator)/buy-timber/page.tsx
├── (generator)/products/page.tsx
├── (generator)/timber-orders/page.tsx
│
├── (aggregator)/layout.tsx     # Layout: Sidebar Aggregator
├── (aggregator)/dashboard/page.tsx
├── (aggregator)/treasure-map/page.tsx
├── (aggregator)/pickups/
├── (aggregator)/warehouse/
├── (aggregator)/bidding/
│
├── (converter)/layout.tsx      # Layout: Sidebar Converter
├── (converter)/dashboard/page.tsx
├── (converter)/marketplace/
│   ├── materials/              #   Bahan limbah
│   └── products/               #   Produk upcycled sendiri
├── (converter)/checkout/page.tsx
├── (converter)/catalog/page.tsx
├── (converter)/design-clinic/
│
├── (enabler)/layout.tsx        # Layout: Sidebar Enabler
├── (enabler)/dashboard/page.tsx  # → Impact analytics
├── (enabler)/users/page.tsx      # → User management
│
├── (buyer)/layout.tsx          # Layout: Navbar Buyer
├── (buyer)/marketplace/page.tsx
├── (buyer)/product/[id]/page.tsx
├── (buyer)/cart/page.tsx
├── (buyer)/checkout/page.tsx
├── (buyer)/orders/page.tsx
│
├── p/                          # Public (no layout, SSR)
│   └── [qr_code_id]/page.tsx   #   → RSC, fetch PocketBase
│
├── api/                        # API Routes (jika perlu)
│   └── pocketbase/             #   Proxy atau helper
│
├── chat/                       # Global chat (bisa diakses semua role)
│   └── page.tsx
│
├── notifications/              # Global notifikasi
│   └── page.tsx
│
└── profile/                    # Global profil (shared)
    └── page.tsx
```

### 6.2 Layout per Role

Setiap role group punya layout sendiri:

| Role | Layout Component | Navigasi |
|------|-----------------|----------|
| Supplier | `SidebarSupplier` | Dashboard, Inventory, Orders, Sales, Profile |
| Generator | `SidebarGenerator` | Dashboard, Setor Limbah, Beli Kayu, Produk, Profile |
| Aggregator | `SidebarAggregator` | Dashboard, Peta, Penjemputan, Gudang, Lelang, Profile |
| Converter | `SidebarConverter` | Dashboard, Marketplace, Checkout, Katalog, Klinik Desain, Profile |
| Desainer | `SidebarDesainer` | Dashboard, Artikel Sirkular, Catatan Desain, Klinik Desain, Profile |
| Enabler | `SidebarEnabler` | Dashboard, Manajemen User, Profile |
| Buyer | `NavbarBuyer` | Marketplace, Cart, Orders, Profile |

---

## 7. Spesifikasi Fungsional per Role

> **Catatan:** Semua fitur di bawah ini **sama persis** dengan yang sudah diimplementasikan di versi Flutter.
> Yang berubah hanya **cara implementasi** di frontend (Dart → TSX + Tailwind).

### 7.1 Auth & Onboarding

| Fitur | Implementasi Web |
|-------|-----------------|
| **Splash Screen** | Tidak perlu di web. Kapasitor punya splash screen native. |
| **Onboarding (3 slides)** | Client component dengan `useState` + animasi Tailwind |
| **Role Selection** | Card grid pilihan peran (responsive grid) |
| **Registrasi** | Multi-step form (Zod validation) → PocketBase SDK |
| **Login** | Email/Password → PocketBase auth |
| **Manajemen Profil** | Form edit → PocketBase update user |
| **Lupa Password** | PocketBase requestPasswordReset() |

### 7.2 Supplier

| Fitur | Komponen/Halaman |
|-------|------------------|
| Dashboard Supplier | Cards: total listing, order masuk, saldo |
| Daftar Kayu Mentah | Form dengan foto + dokumen + pilih wood_type |
| Inventory Kayu Saya | Table/filter/sort data `raw_timber_listings` |
| Order Masuk | List order dari Generator |
| Riwayat Penjualan | Table + grafik penjualan |

### 7.3 Generator

| Fitur | Komponen/Halaman |
|-------|------------------|
| Dashboard Generator | Saldo sampah, aktivitas terbaru, setor limbah (CTA) |
| Setor Limbah (Report Waste) | Kamera (Capacitor) → AI detect → form detail limbah |
| Beli Kayu Mentah | Marketplace kayu dari Supplier |
| Produk Saya | CRUD `generator_products` |
| Pesanan Kayu | Status order `raw_timber_orders` |

### 7.4 Aggregator

| Fitur | Komponen/Halaman |
|-------|------------------|
| Dashboard Aggregator | Statistik pickup, stok gudang |
| **Treasure Map** | **Peta interaktif** (Leaflet/Google Maps) — pin limbah available |
| Penjemputan (Pickups) | List pickup + confirm pickup (kamera + GPS) |
| Gudang (Warehouse) | Inventory stok di gudang + set harga jual |
| **Bidding/Lelang** | **Sistem bidding** pada waste listing tertentu |

### 7.5 Converter

| Fitur | Komponen/Halaman |
|-------|------------------|
| Dashboard Converter | Aktivitas pembelian, produk yang dibuat |
| Pasar Bahan Limbah | Grid/katalog `warehouse_inventory` dari Aggregator |
| Checkout | Beli bahan limbah |
| Katalog Produk Saya | List `products` hasil upcycling |
| Klinik Desain | `design_recipes` — inspirasi produk dari limbah |
| Buat Produk | Form create product + relasi ke source_transactions |

### 7.6 Enabler

| Fitur | Komponen/Halaman |
|-------|------------------|
| Dashboard Impact | **Grafik & chart** (recharts) — CO2 saved, waste diverted |
| Manajemen User | Tabel list user + filter per role + status verifikasi |

### 7.7 Buyer

| Fitur | Komponen/Halaman |
|-------|------------------|
| Marketplace Produk | Grid produk upcycled (SSR/ISR — **SEO friendly**) |
| Detail Produk | Halaman per produk + cerita traceability |
| Keranjang (Cart) | Zustand store + sync ke PocketBase |
| Checkout | Address form + payment (Midtrans) |
| Tracking Pesanan | Status order (timeline UI) |
| **QR Scan** | **Scan QR code** → langsung ke `/p/[qr_code_id]` |

### 7.8 Fitur Global (Semua Role)

| Fitur | Deskripsi |
|-------|-----------|
| **Chat** | Pesan antar pengguna (PocketBase realtime subscription) |
| **Notifikasi** | Notifikasi in-app (dari PocketBase) + Push (Capacitor) |
| **Dompet Digital** | Wallet balance + riwayat transaksi |
| **Manajemen Dokumen** | Upload legalitas (SVLK/FSC) |
| **Profil B2B** | Profil perusahaan publik |

---

## 8. Database Schema (PocketBase)

### 8.1 Koleksi Tetap Sama

Database **tidak berubah** dari versi Flutter. Semua migration scripts di `pocketbase/collections/` tetap berlaku.

| # | Koleksi | Tipe | Aktor Utama | Notes untuk Web |
|---|---------|------|-------------|-----------------|
| 1 | `users` | Auth | Semua | Field `user_code` untuk QR traceability |
| 2 | `wood_types` | Base | Read-only | Master data jenis kayu |
| 3 | `raw_timber_listings` | Base | Supplier | — |
| 4 | `waste_listings` | Base | Generator | — |
| 5 | `pickups` | Base | Aggregator | — |
| 6 | `warehouse_inventory` | Base | Aggregator | — |
| 7 | `marketplace_transactions` | Base | Converter ↔ Aggregator | — |
| 8 | `products` | Base | Converter | **Field `qr_code_id`** → dipakai untuk SEO route `/p/[qr_code_id]` |
| 9 | `orders` | Base | Buyer ↔ Converter | Integrasi Midtrans Snap |
| 10 | `cart_items` | Base | Buyer | — |
| 11 | `wallet_transactions` | Base | Semua | — |
| 12 | `impact_metrics` | Base | Enabler (view) | Auto-calculated via Hook |
| 13 | `chats` | Base | Semua | **Realtime subscriptions** untuk chat |
| 14 | `notifications` | Base | Semua | **FCM Push** via Capacitor |
| 15 | `design_recipes` | Base | Converter / Enabler | — |
| 16 | `bids` | Base | Aggregator ↔ Generator | — |
| 17 | `generator_products` | Base | Generator | — |

### 8.2 TypeScript Types (Auto-generated)

Akan dibuat manual mapping dari skema di `docs/07-skema.md` ke TypeScript types:

```typescript
// lib/pocketbase/types.ts

// Users (extends PocketBase Auth)
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role: 'supplier' | 'generator' | 'aggregator' | 'converter' | 'enabler' | 'buyer';
  workshop_name?: string;
  address?: string;
  location_lat?: number;
  location_lng?: number;
  phone?: string;
  user_code?: string;
  is_verified?: boolean;
  bio?: string;
  production_capacity?: string;
  machine_type?: string;
  fleet_type?: string;
  warehouse_capacity?: string;
  created: string;
  updated: string;
}

export interface WasteListing {
  id: string;
  generator: string;          // relation → users
  expand?: { generator: User };
  wood_type: string;          // relation → wood_types
  expand?: { wood_type: WoodType };
  form: 'offcut_large' | 'offcut_small' | 'shaving' | 'sawdust' | 'logs_end';
  condition: 'dry' | 'wet' | 'oiled' | 'mixed';
  volume: number;
  unit: 'kg' | 'm3' | 'sack' | 'pickup';
  photos: string[];
  price_estimate: number;
  status: 'available' | 'booked' | 'collected' | 'sold';
  description?: string;
  created: string;
  updated: string;
}

// ... dan seterusnya untuk 17 collections
```

### 8.3 Optimasi untuk Web

| Perubahan | Detail |
|-----------|--------|
| **QR Code ID → SEO URL** | Setiap `products.qr_code_id` jadi path `/p/[qr_code_id]` dengan SSR |
| **Midtrans Payment** | Integrasi **Midtrans Snap** via Server Action (aman, token di server) |
| **File Upload** | Upload langsung ke PocketBase via SDK (gak perlu proxy) |
| **Realtime Chat** | PocketBase SDK `pb.collection('chats').subscribe('*', callback)` |

---

## 9. Strategi Hybrid: Web + Mobile

### 9.1 Deployment Model

```
┌───────────────────────────────────────────────────┐
│                  Satu Codebase                     │
│             Next.js + Tailwind + TS                │
└───────────────────┬───────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    next build             next build
    (output: export)       (output: export)
         │                     │
         ▼                     ▼
   Vercel / Netlify        Capacitor sync
   (woodloop.app)          (npx cap sync)
         │                     │
         ▼                     ▼
  🌐 Web                   📱 Mobile App
  - Buyer (konsumen)       - Generator (di lapangan)
  - Enabler (pemerintah)   - Aggregator (di lapangan)
  - QR Traceability        - Supplier (di sawmill)
  - Converter (web juga)   - Converter (opsional)
```

### 9.2 Kondisional Routing

Beberapa halaman **hanya untuk web** atau **hanya untuk mobile native**:

```typescript
// components/features/ReportWasteForm.tsx
'use client';

import { Platform } from '@/lib/native/platform';

export function ReportWasteForm() {
  if (Platform.isNative) {
    return <CameraCapture />;       // 📱 Native camera
  } else {
    return <FileUploadDropzone />;  // 🌐 Web upload
  }
}
```

### 9.3 Capacitor Configuration

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.woodloop.app',
  appName: 'WoodLoop',
  webDir: 'out',                  // Next.js static export output
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,              // Untuk development (PocketBase lokal)
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    // Hanya aktif di native, di web diabaikan otomatis
  },
};

export default config;
```

---

## 10. Roadmap Implementasi

### Fase 1: Foundation (Hari 1–5)

| Task | Detail |
|------|--------|
| Setup project | `bun create next-app`, Tailwind, shadcn/ui, ESLint, Prettier |
| PocketBase integration | SDK setup, types generation, Query hooks |
| Auth system | Login, Register, Role Selection, Middleware |
| Layout system | Layout per role group (sidebar/navbar) |
| i18n setup | next-intl, EN/ID translations |
| Capacitor init | `bunx cap init`, `bunx cap add android` |

### Fase 2: Supplier + Generator (Hari 6–12)

| Task | Detail |
|------|--------|
| Supplier Dashboard | Stat cards, recent activity |
| Timber Listing | Form + upload foto + PocketBase create |
| Inventory Page | Table + filter + edit/delete |
| Generator Dashboard | Saldo, activity feed |
| Report Waste Form | **Camera (Capacitor)** + form detail limbah |
| Buy Timber Page | Marketplace kayu dari supplier |
| Generator Products | CRUD produk furniture |

### Fase 3: Aggregator (Hari 13–19)

| Task | Detail |
|------|--------|
| Aggregator Dashboard | Statistik + notifikasi |
| Treasure Map | **Leaflet/Google Maps** + pin limbah + realtime update |
| Pickup Management | List pickup + confirm (kamera + GPS) |
| Warehouse Inventory | Stok gudang + set harga |
| Bidding System | Lihat waste listing, ajukan bid, accept/reject |

### Fase 4: Converter (Hari 20–25)

| Task | Detail |
|------|--------|
| Converter Dashboard | Aktivitas pembelian, produk |
| Waste Materials Marketplace | Grid katalog bahan limbah |
| Checkout Flow | Beli bahan dari aggregator |
| Upcycled Product Catalog | CRUD products |
| Design Clinic | List design recipes |

### Fase 5: Buyer (Hari 26–30)

| Task | Detail |
|------|--------|
| Marketplace Produk | **SSR/ISR** grid produk upcycled |
| Product Detail + Traceability | Halaman detail dengan cerita asal-usul |
| Cart | Zustand + PocketBase sync |
| Checkout + Payment | Midtrans Snap integration |
| Order Tracking | Timeline status pesanan |
| **QR Code** | Generate QR di produk, scan → `/p/[id]` |

### Fase 6: Enabler & Shared (Hari 31–35)

| Task | Detail |
|------|--------|
| Enabler Dashboard | **Chart analytics** (recharts) — CO2, waste, ekonomi |
| User Management | Tabel user + filter peran + verifikasi |
| Wallet Digital | Riwayat transaksi, top-up |
| Chat System | **Realtime subscription**, daftar chat, send message |
| Notifications | List notifikasi + **Push (Capacitor)** |
| Profile Management | Edit profil, upload dokumen legalitas |

### Fase 7: Native & Polish (Hari 36–42)

| Task | Detail |
|------|--------|
| Capacitor Native Testing | Kamera, GPS, Push, QR Scanner di device |
| PWA Setup | Service Worker, manifest, offline fallback |
| SEO Optimization | Meta tags, sitemap, structured data |
| Performance | Lighthouse audit, bundle optimization |
| Bug Fixing | Testing semua flow |

---

## 11. Estimasi Biaya

### 11.1 Biaya Development (Rewrite)

| Fase | Hari | Role | Estimasi Biaya (IDR) |
|------|------|------|---------------------|
| Foundation | 5 | Full-stack developer | Rp 2.500.000 |
| Supplier + Generator | 7 | Full-stack developer | Rp 3.500.000 |
| Aggregator | 7 | Full-stack developer | Rp 3.500.000 |
| Converter | 6 | Full-stack developer | Rp 3.000.000 |
| Buyer | 5 | Full-stack developer | Rp 2.500.000 |
| Enabler + Shared | 5 | Full-stack developer | Rp 2.500.000 |
| Native + Polish | 7 | Full-stack developer | Rp 3.500.000 |
| **Total** | **42 hari** | | **Rp 21.000.000** |

### 11.2 Biaya Operasional Bulanan

| Item | Biaya (IDR) |
|------|-------------|
| Vercel Pro (Web hosting) | Gratis (Hobby plan cukup) |
| PocketBase hosting (VPS mini) | Rp 100.000 |
| Google Maps API (jika pakai) | Rp 200.000 (usage-based) |
| Midtrans (payment gateway) | Rp 0 (flat fee per transaksi) |
| **Total** | **~Rp 300.000/bulan** |

---

## Lampiran

### A. Perbandingan Teknologi: Lama vs Baru

| Layer | Sebelum (Flutter) | Sesudah (Next.js + Cap) | Keterangan |
|-------|-------------------|------------------------|------------|
| Framework | Flutter 3.x | Next.js 15+ | — |
| Bahasa | Dart | TypeScript | — |
| Styling | Material Design / custom | Tailwind CSS | — |
| State Management | BLoC + Freezed | TanStack Query + Zustand | — |
| Routing | GoRouter | Next.js App Router | File-based |
| DI | get_it + injectable | React Context / DI manual | — |
| Backend SDK | pocketbase (Dart) | pocketbase (JS/TS) | Sama-sama resmi |
| Maps | google_maps_flutter | Leaflet / Google Maps JS | — |
| Camera | image_picker | @capacitor/camera | — |
| QR | qr_flutter | qrcode.react / html5-qrcode | — |
| Payment | — (baru rencana) | Midtrans Snap | Tambahan baru |
| Push Notif | FCM native | @capacitor/push-notifications | — |
| Localization | flutter_localizations | next-intl | — |

### B. Migration Checklist

- [ ] PocketBase migration scripts (sudah ada, tinggal jalanin)
- [ ] TypeScript types dari 17 collections
- [ ] Auth + Middleware
- [ ] Layout per role
- [ ] Komponen UI dasar (shadcn/ui)
- [ ] i18n EN/ID
- [ ] Integrasi Maps
- [ ] Integrasi Camera + Capacitor
- [ ] Integrasi Push Notification
- [ ] Integrasi Midtrans
- [ ] PWA
- [ ] Deploy ke Vercel
- [ ] Build Android APK via Capacitor

---

## 12. Design System & Component Library (shadcn/ui)

### 12.1 Prinsip Desain

1. **Mobile-first** — Semua halaman responsif (375px → 1440px).
2. **Accessible** — Semantic HTML, aria attributes, keyboard navigation.
3. **shadcn/ui primitives** — Jangan buat custom `<div>` kalau shadcn/ui sudah punya komponen.
4. **Design tokens** — Warna, spacing, font dari CSS variables. Jangan hardcode.
5. **Dark mode** — Support via `class` strategy (`dark:` prefix).

### 12.2 Daftar Komponen shadcn/ui yang Digunakan

| Komponen | Instalasi | Digunakan di |
|----------|-----------|--------------|
| **Button** | `npx shadcn@latest add button` | Semua halaman — CTA, submit form |
| **Card** | `npx shadcn@latest add card` | Dashboard summary cards, product cards |
| **Input** | `npx shadcn@latest add input` | Forms (registrasi, setor limbah, checkout) |
| **Form** | `npx shadcn@latest add form` | Semua form — react-hook-form + zod |
| **Select** | `npx shadcn@latest add select` | Pilih jenis kayu, unit, status |
| **Table** | `npx shadcn@latest add table` | Tabel inventori, orders, users |
| **DataTable** | `npx shadcn@latest add data-table` | Tabel interaktif (filter, sort, search) |
| **Dialog** | `npx shadcn@latest add dialog` | Konfirmasi delete, detail popup |
| **Sheet** | `npx shadcn@latest add sheet` | Drawer navigasi mobile, bottom sheet detail |
| **DropdownMenu** | `npx shadcn@latest add dropdown-menu` | Avatar dropdown, action menu |
| **Avatar** | `npx shadcn@latest add avatar` | Profil user, chat bubble |
| **Badge** | `npx shadcn@latest add badge` | Status (available, paid, shipped) |
| **Tabs** | `npx shadcn@latest add tabs` | Tab per kategori (marketplace) |
| **Toast** | `npx shadcn@latest add toast` | Notifikasi sukses/error |
| **Skeleton** | `npx shadcn@latest add skeleton` | Loading state semua halaman |
| **Progress** | `npx shadcn@latest add progress` | Progress bar (order tracking) |
| **Alert** | `npx shadcn@latest add alert` | Error banner, warning verifikasi |
| **Tooltip** | `npx shadcn@latest add tooltip` | Hint icon, deskripsi form |
| **Breadcrumb** | `npx shadcn@latest add breadcrumb` | Navigasi halaman |
| **Command** | `npx shadcn@latest add command` | Search bar marketplace |
| **Popover** | `npx shadcn@latest add popover` | Filter harga, info tambahan |
| **Carousel** | `npx shadcn@latest add carousel` | Galeri foto produk |
| **Chart** | `npx shadcn@latest add chart` | Dashboard Enabler (recharts) |
| **Separator** | `npx shadcn@latest add separator` | Pemisah section |

### 12.3 Mapping Komponen per Fitur

#### Dashboard (Semua Role)

```
┌──────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────┐  │
│ │  Sidebar │ │  Header (Breadcrumb)       │  │
│ │  (Sheet  │ ├────────────────────────────┤  │
│ │  mobile) │ │  ┌──────┐ ┌──────┐ ┌──────┐│  │
│ │          │ │  │ Card │ │ Card │ │ Card ││  │
│ │ shadcn   │ │  └──────┘ └──────┘ └──────┘│  │
│ │ Button   │ │  ┌──────────────────────┐  │  │
│ │ + icon   │ │  │ Table / Chart        │  │  │
│ └──────────┘ │  └──────────────────────┘  │  │
└──────────────┴────────────────────────────┘  │
```

- Sidebar: `Sheet` (mobile) + `aside` (desktop)
- Summary cards: `Card` + `CardHeader` + `CardContent`
- Tabel: `DataTable` dengan sorting & pagination

#### Marketplace (Buyer & Converter)

```
┌──────────────────────────────────────────────┐
│  TopNav: Command (search) | Cart | Avatar   │
├──────────────────────────────────────────────┤
│  Tabs: Semua | Furniture | Decor | Aksesoris │
├──────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│  │  Card  │ │  Card  │ │  Card  │ │  Card  ││
│  │ +Badge │ │ +Badge │ │ +Badge │ │ +Badge ││
│  └────────┘ └────────┘ └────────┘ └────────┘│
│  Pagination (Button variant="outline")      │
└──────────────────────────────────────────────┘
```

- Search: `Command` (cmdk) dengan keyboard shortcut `cmd+k`
- Filter: `Tabs` + `Sheet` (filter drawer mobile)
- Product card: `Card` + `aspect-[4/3]` foto + `Badge` harga
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`

#### Form Setor Limbah (Generator)

```
┌─────────────────────────────────────┐
│  Stepper: Foto → Jenis → Volume → OK│
├─────────────────────────────────────┤
│  Step 1: Camera (Capacitor)         │
│          atau File upload (web)      │
│  Step 2: Select (jenis kayu)        │
│          Select (bentuk limbah)       │
│  Step 3: Input (volume)              │
│          Select (unit, kondisi)      │
│  Step 4: Alert (summary)             │
│          Button (submit)             │
└─────────────────────────────────────┘
```

- Stepper: Custom component dengan `Progress` indicator
- Form tiap step: `Form` + `Input` + `Select` + zod validation
- Tombol: `Button` dengan `loading` state

#### Treasure Map (Aggregator)

```
┌──────────────────────────────────────┐
│  Full height Map (Leaflet)           │
│                                      │
│  Pin: Badge (warna status)           │
│                                      │
│  ┌──────────────┐ Sheet (bottom)    │
│  │ Card: Detail │                    │
│  │ Button: Ambil│                    │
│  └──────────────┘                    │
└──────────────────────────────────────┘
```

- Map: Leaflet dengan marker custom (warna sesuai status waste)
- Bottom sheet: `Sheet` dengan `side="bottom"`
- Detail: `Card` + foto + `Badge` + `Button` ambil pickup

#### Chat (Semua Role)

```tsx
// Chat bubble component
<div className="flex gap-3 mb-4">
  <Avatar>
    <AvatarImage src={sender.avatar} />
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
  <div>
    <p className="text-sm font-medium">{sender.name}</p>
    <Card className="px-3 py-2 rounded-xl">{message}</Card>
    <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
  </div>
</div>
```

#### Traceability Page (Public / QR)

**Full SSR** — React Server Component, zero JavaScript:

```tsx
// app/p/[qr_code_id]/page.tsx — RSC
import { ProductTimeline } from '@/components/features/product-timeline';
import { ImpactBadges } from '@/components/features/impact-badges';

export default async function TraceabilityPage({ params }) {
  const product = await pb.collection('products').getOne(params.qr_code_id, {
    expand: 'source_transactions'
  });

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="font-heading text-2xl">{product.name}</h1>
      <ProductTimeline transactions={product.expand?.source_transactions} />
      <ImpactBadges co2={2.5} wasteDiverted={5} />
    </div>
  );
}
```

### 12.4 Aturan Custom Components

Jika shadcn/ui tidak menyediakan komponen yang dibutuhkan, buat custom component dengan aturan:

1. Tempatkan di `src/components/features/<nama>.tsx`
2. Gunakan Tailwind CSS + shadcn/ui primitives sebagai base
3. Tambahkan loading state menggunakan `Skeleton`
4. Tambahkan empty state menggunakan komponen `EmptyState`
5. Export TypeScript interface untuk props

Contoh struktur:

```
src/components/
├── ui/                           # shadcn/ui generated
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── layout/                       # Layout components
│   ├── sidebar-supplier.tsx
│   ├── sidebar-generator.tsx
│   ├── navbar-buyer.tsx
│   └── ...
└── features/                     # Feature-specific
    ├── product-card.tsx           # Product card marketplace
    ├── waste-form-stepper.tsx     # Multi-step form limbah
    ├── treasure-map.tsx           # Leaflet map + pins
    ├── chat-bubble.tsx            # Chat message UI
    ├── product-timeline.tsx       # Traceability timeline
    ├── impact-badges.tsx          # CO2 / waste badges
    └── wallet-card.tsx            # Wallet balance card
```


## 13. Integrasi Pi Agent — Design System Skill

### 13.1 Tentang Pi Agent Skill

Project WoodLoop menggunakan **Pi agent** sebagai coding assistant. Pi punya fitur **Skills** — paket instruksi terstruktur yang bisa di-load on-demand untuk memberi konteks spesifik ke agent.

### 13.2 Skill: woodloop-design-system

File: `.pi/skills/woodloop-design-system/SKILL.md`

Skill ini memberikan instruksi ke Pi agent tentang:

| Aspek | Isi Skill |
|-------|-----------|
| **Design tokens** | Warna (CSS variables), tipografi, spacing, shadow |
| **Component library** | 25+ komponen shadcn/ui yang wajib diinstall |
| **Layout patterns** | Dashboard, Marketplace, Treasure Map, Form, Chat |
| **Feature components** | Component mapping per fitur (WasteForm, ProductCard, dll) |
| **Custom component rules** | Dimana letak file, bagaimana struktur props |
| **Aturan Pi** | Instal shadcn dulu, loading state, error state, accessibility |

### 13.3 Cara Menggunakan

```bash
# Load skill di sesi Pi baru
/skill:woodloop-design-system

# Atau langsung minta generate halaman
"Buat halaman dashboard Generator pakai woodloop-design-system"
```

Pi agent akan:
1. Load SKILL.md → tahu design tokens & komponen
2. Install shadcn/ui component yang diperlukan (via `npx shadcn@latest add`)
3. Generate TSX + Tailwind sesuai layout pattern
4. Integrasi dengan TanStack Query + PocketBase

### 13.4 Contoh Sesi Pi

```
👤 User: /skill:woodloop-design-system
          Buat halaman setor limbah untuk Generator

🤖 Pi: 
  1. Install shadcn components: form, input, select, button, card, progress
  2. Buat src/components/features/waste-form-stepper.tsx
  3. Integrasi dengan PocketBase waste_listings collection
  4. Tambahkan camera (Capacitor) + fallback upload (web)
  5. Loading skeleton, error handling, zod validation
```

### 13.5 Integrasi dengan PocketBase Types

Skill juga includes mapping dari database schema ke component props:

```typescript
// WasteListing type → Form field mapping
interface WasteFormData {
  generator: string;       // Auto dari auth user
  wood_type: string;       // Select (from wood_types collection)
  form: FormShape;         // Select: offcut, shaving, sawdust, dll
  condition: Condition;    // Select: dry, wet, oiled, mixed
  volume: number;          // Input number
  unit: Unit;              // Select: kg, m3, sack, pickup
  photos: File[];          // Camera / upload
  price_estimate: number;  // Input number (optional)
  description?: string;    // Textarea
}
```

### 13.6 Extension Pi untuk Design Sync (Opsional)

Extension tambahan untuk mengintegrasikan design tokens langsung ke Pi:

```typescript
// .pi/extensions/design-token-sync.ts
// Akan mengaktifkan perintah:
//   /design-tokens sync    → update tailwind.config.ts
//   /design-tokens colors  → tampilkan palet warna
```

### 13.7 Alur Kerja Design-to-Code

```
Desain (Spec / Mental Model)
       │
       ▼
  Prompt ke Pi:
  "Buat halaman dashboard Supplier dengan
   Cards summary + tabel order + pakai
   woodloop-design-system"
       │
       ▼
  Pi Agent (dengan skill aktif):
  1. Load design tokens dari skill
  2. Install shadcn/ui components
  3. Generate TSX file
  4. Integrasi TanStack Query + PocketBase
  5. Tambahkan loading + error + empty state
       │
       ▼
  Output: src/app/(supplier)/dashboard/page.tsx
          src/components/features/supplier-summary-cards.tsx
```

**Tanpa perlu Figma, tanpa perlu Penpot.**
shadcn/ui + Tailwind + Pi skill = Open design langsung jadi kode.


**Dokumen ini disusun untuk acuan pengembangan ulang (rewrite) WoodLoop**
**dari Flutter ke Next.js + Tailwind + shadcn/ui + Bun + Capacitor + PocketBase**
**dengan integrasi Pi Agent design system skill untuk mempercepat development.**
+ Bun + Capacitor + PocketBase**
**dengan integrasi Pi Agent design system skill untuk mempercepat development.**
