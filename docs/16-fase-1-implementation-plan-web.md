# Implementation Plan — Fase 1: Foundation

**Project:** WoodLoop Web + Hybrid Mobile
**Durasi:** Hari 1–5
**Fokus:** Setup project, arsitektur dasar, auth, layout, i18n, Capacitor init

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

Fase ini membangun fondasi seluruh aplikasi. Target akhir: user bisa login, register, pilih role, dan masuk ke dashboard kosong sesuai rolenya. Semua komponen UI dasar sudah terinstall dari shadcn/ui.

### Tech Stack di Fase Ini

| Tool | Command |
|------|---------|
| Bun | `bun create next-app` |
| Tailwind CSS v4 | Built-in Next.js |
| shadcn/ui | `npx shadcn@latest init` |
| next-intl | `bun add next-intl` |
| PocketBase JS SDK | `bun add pocketbase` |
| TanStack Query | `bun add @tanstack/react-query` |
| Zustand | `bun add zustand` |
| Zod | `bun add zod` + `@hookform/resolvers` |
| Capacitor | `bun add @capacitor/core @capacitor/cli` |

---

## 2. Prerequisites

- [ ] Bun terinstall (`bun --version` ≥ 1.2)
- [ ] PocketBase server running (lokal atau production)
- [ ] Migration PocketBase sudah dijalankan (17 collections)
- [ ] Git repository sudah diinit
- [ ] `.env.local` sudah berisi `NEXT_PUBLIC_PB_URL`

---

## 3. Task Breakdown

### Day 1: Setup Project

- [ ] **P1-T1** Init Next.js dengan Bun
  ```bash
  bun create next-app woodloop --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] **P1-T2** Install dependencies inti
  ```bash
  bun add pocketbase @tanstack/react-query zustand zod @hookform/resolvers
  bun add next-intl
  bun add -d @types/node
  ```
- [ ] **P1-T3** Setup Tailwind CSS v4 — pastikan `tailwind.config.ts` bisa extend theme
- [ ] **P1-T4** Setup `globals.css` dengan CSS variables design tokens (warna, font)
- [ ] **P1-T5** Setup folder structure:
  ```
  src/
  ├── app/
  ├── components/
  │   ├── ui/           # shadcn/ui nanti
  │   └── layout/       # Layout components
  ├── lib/
  │   ├── pocketbase/   # PB client
  │   ├── hooks/        # TanStack Query hooks
  │   ├── stores/       # Zustand stores
  │   ├── utils/        # Helpers
  │   └── validations/  # Zod schemas
  ├── i18n/             # next-intl
  └── middleware.ts
  ```
- [ ] **P1-T6** Setup Git + initial commit

### Day 2: shadcn/ui + Design System

- [ ] **P1-T7** Init shadcn/ui
  ```bash
  npx shadcn@latest init
  ```
  - Style: `New York`
  - Base color: `Custom` (isi dengan design tokens WoodLoop)
  - CSS variables: `Yes`
  - React Server Components: `Yes`
- [ ] **P1-T8** Install semua komponen yang diperlukan:
  ```bash
  npx shadcn@latest add button card input label form select textarea
  npx shadcn@latest add table dialog sheet dropdown-menu avatar badge
  npx shadcn@latest add tabs toast separator skeleton progress alert
  npx shadcn@latest add tooltip breadcrumb command popover carousel
  npx shadcn@latest add chart data-table
  ```
- [ ] **P1-T9** Setup design tokens di `tailwind.config.ts`:
  - Warna: primary (hijau kayu #2D6A4F), secondary (coklat #7D5A38), accent (emas #F59E0B)
  - Font: Space Grotesk (heading), Inter (body)
  - Spacing, border radius, shadow sesuai SKILL.md
- [ ] **P1-T10** Update `globals.css` dengan CSS custom properties untuk dark mode
- [ ] **P1-T11** Buat icon utility: `src/components/ui/icon.tsx` (export ulang dari lucide-react)
- [ ] **P1-T12** Verifikasi semua komponen shadcn/ui bisa dirender

### Day 3: PocketBase Integration + Auth

- [ ] **P1-T13** Buat PocketBase client singleton `src/lib/pocketbase/client.ts`:
  ```typescript
  import PocketBase from 'pocketbase';
  
  let pb: PocketBase | null = null;
  
  export function getPB(): PocketBase {
    if (!pb) {
      pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL!);
    }
    return pb;
  }
  ```
- [ ] **P1-T14** Buat tipe TypeScript dari schema: `src/lib/pocketbase/types.ts`:
  - `User`, `WoodType`, `RawTimberListing`, `WasteListing`, `Pickup`
  - `WarehouseInventory`, `MarketplaceTransaction`, `Product`, `Order`
  - `CartItem`, `WalletTransaction`, `ImpactMetric`, `Chat`, `Notification`
  - `DesignRecipe`, `Bid`, `GeneratorProduct`, `UserDocument`
- [ ] **P1-T15** Setup TanStack Query provider: `src/lib/hooks/query-provider.tsx`
- [ ] **P1-T16** Setup Zustand store untuk auth: `src/lib/stores/auth-store.ts`
  - `user`, `token`, `isAuthenticated`, `role`
  - `login()`, `logout()`, `setUser()`
- [ ] **P1-T17** Buat auth hooks:
  - `useLogin()` — mutation TanStack Query
  - `useRegister()` — mutation
  - `useLogout()` — mutation
  - `useAuthUser()` — query (ambil user dari PocketBase)
- [ ] **P1-T18** Buat validasi Zod untuk form auth: `src/lib/validations/auth.ts`
  - `loginSchema` (email, password)
  - `registerSchema` (email, password, name, role)
- [ ] **P1-T19** Setup middleware: `src/middleware.ts`
  - Baca cookie `pb_auth`
  - Redirect `/login` jika unauthenticated
  - Redirect ke dashboard sesuai role
  - Protect route groups (supplier, generator, etc.)

### Day 4: Auth Pages + Role Selection

- [ ] **P1-T20** Halaman Login: `src/app/(auth)/login/page.tsx`
  - Form email + password (shadcn Form)
  - Submit → PocketBase auth → redirect ke dashboard sesuai role
  - Link ke "Lupa Password" + "Register"
  - Loading state (Button disabled + spinner)
  - Error state (Alert destructive)
- [ ] **P1-T21** Halaman Register: `src/app/(auth)/register/page.tsx`
  - Multi-step form (profil → detail role)
  - Step 1: Email, password, name, phone
  - Step 2: Role selection (card grid, 6 role)
  - Step 3: Field spesifik per role (workshop_name, location, dll)
  - Submit → PocketBase create user + set role
- [ ] **P1-T22** Halaman Role Selection: `src/app/(auth)/role-selection/page.tsx`
  - Grid 2x3 cards untuk 6 role
  - Masing-masing card: icon + nama + deskripsi singkat
  - Highlight on hover + selected state
  - Tombol "Konfirmasi" setelah pilih
- [ ] **P1-T23** Halaman Onboarding: `src/app/(auth)/onboarding/page.tsx`
  - 3 slides (masalah → solusi → manfaat)
  - Carousel (shadcn Carousel)
  - Tombol "Skip" + "Next" + "Mulai"
- [ ] **P1-T24** Halaman Forgot Password: `src/app/(auth)/forgot-password/page.tsx`
  - Form email → PocketBase `requestPasswordReset()`
  - Success toast + redirect ke login

### Day 5: Layout System + i18n + Capacitor Init

- [ ] **P1-T25** Setup next-intl:
  ```bash
  bun add next-intl
  ```
  - `src/i18n/en.json` — semua string English
  - `src/i18n/id.json` — semua string Bahasa Indonesia
  - Provider di layout root
  - Language switcher di halaman auth
- [ ] **P1-T26** Buat layout components:
  - `src/components/layout/sidebar.tsx` — Base sidebar (shadcn Sheet untuk mobile)
  - `src/components/layout/navbar.tsx` — Top navbar (breadcrumb + notif + avatar)
  - `src/components/layout/sidebar-supplier.tsx` — Nav items spesifik Supplier
  - `src/components/layout/sidebar-generator.tsx`
  - `src/components/layout/sidebar-aggregator.tsx`
  - `src/components/layout/sidebar-converter.tsx`
  - `src/components/layout/sidebar-enabler.tsx`
  - `src/components/layout/navbar-buyer.tsx` — Navbar berbeda untuk Buyer
- [ ] **P1-T27** Buat route groups + layout per role:
  - `src/app/(supplier)/layout.tsx` — SidebarSupplier + outlet
  - `src/app/(generator)/layout.tsx` — SidebarGenerator + outlet
  - `src/app/(aggregator)/layout.tsx` — SidebarAggregator + outlet
  - `src/app/(converter)/layout.tsx` — SidebarConverter + outlet
  - `src/app/(enabler)/layout.tsx` — SidebarEnabler + outlet
  - `src/app/(buyer)/layout.tsx` — NavbarBuyer + outlet
- [ ] **P1-T28** Buat halaman dashboard placeholder per role:
  - Masing-masing: "Selamat datang, {name}! Dashboard akan segera hadir."
  - Sudah pakai layout masing-masing
- [ ] **P1-T29** Init Capacitor:
  ```bash
  bunx cap init WoodLoop com.woodloop.app
  bunx cap add android
  ```
  - `capacitor.config.ts` sesuai PRD
- [ ] **P1-T30** Testing end-to-end flow auth:
  - Register → pilih role → login → redirect ke dashboard → logout

---

## 4. File Structure (Output Fase 1)

```
woodloop/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── role-selection/page.tsx
│   │   │   ├── onboarding/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (supplier)/
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── (generator)/
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── (aggregator)/
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── (converter)/
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── (enabler)/
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── (buyer)/
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── layout.tsx              # Root layout (providers)
│   │   └── page.tsx                # Redirect ke /login
│   ├── components/
│   │   ├── ui/                     # shadcn/ui generated
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── ...
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── sidebar-supplier.tsx
│   │   │   ├── sidebar-generator.tsx
│   │   │   ├── sidebar-aggregator.tsx
│   │   │   ├── sidebar-converter.tsx
│   │   │   ├── sidebar-enabler.tsx
│   │   │   └── navbar-buyer.tsx
│   │   └── icon.tsx
│   ├── lib/
│   │   ├── pocketbase/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── hooks/
│   │   │   ├── query-provider.tsx
│   │   │   └── use-auth.ts
│   │   ├── stores/
│   │   │   └── auth-store.ts
│   │   ├── utils/
│   │   │   └── cn.ts
│   │   └── validations/
│   │       └── auth.ts
│   ├── middleware.ts
│   ├── i18n/
│   │   ├── en.json
│   │   └── id.json
│   └── styles/
│       └── globals.css
├── capacitor.config.ts
├── next.config.ts
├── tailwind.config.ts
├── .env.local
├── package.json
└── bun.lock
```

---

## 5. Unit Test Checklist

### Setup Testing

- [ ] **T-P1-1** Install testing libraries:
  ```bash
  bun add -d vitest @testing-library/react @testing-library/jest-dom
  bun add -d @testing-library/user-event msw
  ```
- [ ] **T-P1-2** Setup `vitest.config.ts`
- [ ] **T-P1-3** Setup `src/test/setup.ts` (global test config)

### Unit Tests — Auth Store (Zustand)

- [ ] **T-P1-4** `auth-store.test.ts` — test initial state
- [ ] **T-P1-5** `auth-store.test.ts` — test login() sets user + token
- [ ] **T-P1-6** `auth-store.test.ts` — test logout() clears state
- [ ] **T-P1-7** `auth-store.test.ts` — test setUser() updates role
- [ ] **T-P1-8** `auth-store.test.ts` — test persist/restore dari localStorage

### Unit Tests — Validasi Zod

- [ ] **T-P1-9** `auth.test.ts` — loginSchema valid email + password
- [ ] **T-P1-10** `auth.test.ts` — loginSchema invalid email
- [ ] **T-P1-11** `auth.test.ts` — loginSchema password too short
- [ ] **T-P1-12** `auth.test.ts` — registerSchema valid data
- [ ] **T-P1-13** `auth.test.ts` — registerSchema missing name
- [ ] **T-P1-14** `auth.test.ts` — registerSchema invalid role

### Unit Tests — Auth Hooks (TanStack Query)

- [ ] **T-P1-15** `use-auth.test.tsx` — useLogin sukses return user
- [ ] **T-P1-16** `use-auth.test.tsx` — useLogin gagal return error
- [ ] **T-P1-17** `use-auth.test.tsx` — useRegister sukses
- [ ] **T-P1-18** `use-auth.test.tsx` — useLogout clear state
- [ ] **T-P1-19** `use-auth.test.tsx` — useAuthUser fetch data

### Unit Tests — PocketBase Client

- [ ] **T-P1-20** `client.test.ts` — getPB() returns singleton
- [ ] **T-P1-21** `client.test.ts` — getPB() throws jika URL kosong
- [ ] **T-P1-22** `client.test.ts` — authWithPassword works

### Unit Tests — Components

- [ ] **T-P1-23** `sidebar.test.tsx` — render menu items
- [ ] **T-P1-24** `sidebar.test.tsx` — highlight active item
- [ ] **T-P1-25** `sidebar.test.tsx` — collapse/expand
- [ ] **T-P1-26** `navbar.test.tsx` — render breadcrumb
- [ ] **T-P1-27** `navbar.test.tsx` — notification badge count
- [ ] **T-P1-28** `navbar.test.tsx` — avatar dropdown menu
- [ ] **T-P1-29** `login-page.test.tsx` — render form fields
- [ ] **T-P1-30** `login-page.test.tsx` — submit valid credentials
- [ ] **T-P1-31** `login-page.test.tsx` — show error on invalid
- [ ] **T-P1-32** `login-page.test.tsx` — redirect ke dashboard setelah login
- [ ] **T-P1-33** `register-page.test.tsx` — multi-step navigation
- [ ] **T-P1-34** `register-page.test.tsx` — step 1 fields required
- [ ] **T-P1-35** `register-page.test.tsx** — step 2 role selection
- [ ] **T-P1-36** `register-page.test.tsx` — step 3 dynamic fields per role
- [ ] **T-P1-37** `register-page.test.tsx` — submit creates user
- [ ] **T-P1-38** `role-selection.test.tsx` — render 6 role cards
- [ ] **T-P1-39** `role-selection.test.tsx` — select role highlights card
- [ ] **T-P1-40** `role-selection.test.tsx** — confirm button disabled jika belum pilih
- [ ] **T-P1-41** `onboarding.test.tsx** — carousel 3 slides
- [ ] **T-P1-42** `onboarding.test.tsx` — skip button goes to role selection
- [ ] **T-P1-43** `onboarding.test.tsx` — next/prev navigation
- [ ] **T-P1-44** `forgot-password.test.tsx` — email validation
- [ ] **T-P1-45** `forgot-password.test.tsx** — submit calls PocketBase
- [ ] **T-P1-46** `forgot-password.test.tsx` — success message

### Integration Tests

- [ ] **T-P1-47** Auth flow: register → login → dashboard redirect
- [ ] **T-P1-48** Middleware: unauthenticated → redirect /login
- [ ] **T-P1-49** Middleware: authenticated wrong role → redirect dashboard sendiri
- [ ] **T-P1-50** Layout per role: sidebar berbeda untuk tiap role
- [ ] **T-P1-51** i18n: switch EN ↔ ID, semua string berubah
- [ ] **T-P1-52** Dark mode: toggle class di <html>

---

## 6. Acceptance Criteria

Fase 1 selesai jika:

- [ ] **AC-1** `bun run dev` jalan tanpa error
- [ ] **AC-2** `bun run build` success (Next.js build)
- [ ] **AC-3** Halaman login tampil di `/login`
- [ ] **AC-4** User bisa register dengan email valid + pilih role
- [ ] **AC-5** Setelah login, redirect ke dashboard sesuai role
- [ ] **AC-6** Masing-masing role punya layout/sidebar berbeda
- [ ] **AC-7** Sidebar collapse di mobile (Sheet drawer)
- [ ] **AC-8** Language switcher EN/ID berfungsi
- [ ] **AC-9** Dark mode toggle berfungsi (class strategy)
- [ ] **AC-10** Middleware block akses ke route yang bukan rolenya
- [ ] **AC-11** All 25+ shadcn/ui components terinstall dan bisa dipakai
- [ ] **AC-12** `bun test` lulus minimal 80% test
- [ ] **AC-13** `bunx cap sync` success (Capacitor init)
- [ ] **AC-14** Lighthouse score ≥ 80 (performance + accessibility)

---

**Dokumen ini adalah breakdown detail Fase 1 dari PRD WoodLoop Web.**
**Gunakan bersama `/skill:woodloop-design-system` di Pi agent.**
