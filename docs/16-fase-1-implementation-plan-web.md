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

### Status Pengerjaan

| Day | Progress |
|-----|----------|
| Day 1 | ✅ **5/6 selesai** |
| Day 2 | ✅ **5/5 selesai** |
| Day 3 | ✅ **6/7 selesai** (kurang types.ts) |
| Day 4 | ✅ **5/5 selesai** |
| Day 5 | ⬜ **0/6** (belum dikerjakan) |
| **Total** | **21/29 tasks selesai (72%)** |

---

## 2. Prerequisites

- [x] Bun terinstall (`bun --version` ≥ 1.2) — v1.3.14
- [ ] PocketBase server running (lokal atau production) — **perlu dijalankan**
- [ ] Migration PocketBase sudah dijalankan (17 collections)
- [ ] Git repository sudah diinit — **root project already has git**
- [x] `.env.local` sudah berisi `NEXT_PUBLIC_PB_URL`

---

## 3. Task Breakdown

### Day 1: Setup Project ✅

- [x] **P1-T1** Init Next.js dengan Bun
  ```bash
  bun create next-app woodloop_web --typescript --tailwind --eslint --app --src-dir
  ```
  ✅ Next.js 16.2.6 + React 19 + Tailwind v4

- [x] **P1-T2** Install dependencies inti
  ```bash
  bun add pocketbase @tanstack/react-query zustand zod @hookform/resolvers next-intl lucide-react clsx
  bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
  ```
  ✅ Semua dependencies terinstall

- [x] **P1-T3** Setup Tailwind CSS v4
  ✅ Tailwind v4 built-in via `@tailwindcss/postcss`. Konfigurasi via `@theme` di CSS (Tailwind v4 tidak pakai `tailwind.config.ts`)

- [x] **P1-T4** Setup `globals.css` dengan CSS variables design tokens
  ✅ File: `src/app/globals.css` + `src/styles/theme.css` → digabung jadi satu `globals.css` setelah shadcn init

- [x] **P1-T5** Setup folder structure:
  ```
  src/
  ├── app/
  │   ├── (auth)/login/
  │   ├── (auth)/register/
  │   ├── (auth)/role-selection/
  │   ├── (auth)/onboarding/
  │   ├── (auth)/forgot-password/
  │   └── p/[qr_code_id]/
  ├── components/
  │   ├── ui/              # 23 komponen shadcn
  │   └── layout/          # (akan diisi Day 5)
  ├── lib/
  │   ├── pocketbase/
  │   ├── hooks/
  │   ├── stores/
  │   ├── utils/
  │   └── validations/
  ├── styles/
  ├── i18n/
  ├── e2e/
  └── test/
  ```
  ✅ Semua folder siap

- [ ] **P1-T6** Setup Git + initial commit
  ❌ Belum — project masih belum di-commit. Root repo sudah ada, tinggal `git add woodloop_web/ && git commit`

### Day 2: shadcn/ui + Design System ✅

- [x] **P1-T7** Init shadcn/ui
  ```bash
  npx shadcn@latest init --template next --base radix --css-variables --yes
  ```
  ✅ Nova preset + CSS variables

- [x] **P1-T8** Install semua komponen yang diperlukan:
  ```bash
  npx shadcn@latest add button card input label form select textarea
  npx shadcn@latest add table dialog sheet dropdown-menu avatar badge
  npx shadcn@latest add tabs separator skeleton progress alert
  npx shadcn@latest add tooltip breadcrumb command popover carousel
  npx shadcn@latest add chart sonner
  ```
  ✅ **23 komponen** terinstall (form dibuat manual karena shadcn v4, toast diganti sonner)

- [x] **P1-T9** Setup design tokens
  ✅ Warna WoodLoop (hijau #2D6A4F, coklat #7D5A38, emas #F59E0B) + font (Space Grotesk, Inter) di CSS variables

- [x] **P1-T10** Update `globals.css` dengan dark mode
  ✅ `.dark` class dengan semua CSS variables untuk dark mode

- [x] **P1-T11** Buat icon utility
  ✅ lucide-react tersedia, shadcn sudah handle via komponennya

- [x] **P1-T12** Verifikasi semua komponen shadcn/ui bisa dirender
  ✅ Build sukses + E2E test pass

### Day 3: PocketBase Integration + Auth ✅

- [x] **P1-T13** Buat PocketBase client singleton `src/lib/pocketbase/client.ts`
  ✅ Singleton dengan SSR compatibility

- [ ] **P1-T14** Buat tipe TypeScript dari schema: `src/lib/pocketbase/types.ts`
  ❌ Belum dibuat — masih perlu dibuat dari 17 collections

- [x] **P1-T15** Setup TanStack Query provider: `src/lib/hooks/query-provider.tsx`
  ✅ Dengan default staleTime 30 detik

- [x] **P1-T16** Setup Zustand store untuk auth: `src/lib/stores/auth-store.ts`
  ✅ `setAuth()`, `setUser()`, `logout()` + persist ke localStorage + 5 unit tests

- [x] **P1-T17** Buat auth hooks: `src/lib/hooks/use-auth.ts`
  ✅ `useLogin()`, `useRegister()`, `useForgotPassword()` — semuanya mutation TanStack Query

- [x] **P1-T18** Buat validasi Zod untuk form auth: `src/lib/validations/auth.ts`
  ✅ `loginSchema` + `registerSchema` dengan validasi email, password min 6, role enum

- [x] **P1-T19** Setup middleware: `src/proxy.ts`
  ✅ Migrasi ke Next.js 16 `proxy` convention. Melindungi route groups + public routes. `proxy.ts` (bukan `middleware.ts`)

### Day 4: Auth Pages + Role Selection ✅

- [x] **P1-T20** Halaman Login: `src/app/(auth)/login/page.tsx`
  ✅ Form email + password (shadcn Form + Zod), link ke register & forgot-password, loading state, error state

- [x] **P1-T21** Halaman Register: `src/app/(auth)/register/page.tsx`
  ✅ Multi-step 3 step (data diri → pilih role → detail peran), progress bar, 6 role cards, navigasi next/prev

- [x] **P1-T22** Halaman Role Selection: `src/app/(auth)/role-selection/page.tsx`
  ✅ Grid 2x3 cards dengan icon + nama + deskripsi, highlight on click, confirm button disabled until select

- [x] **P1-T23** Halaman Onboarding: `src/app/(auth)/onboarding/page.tsx`
  ✅ 3 slides (Masalah → Solusi → Manfaat), dot indicator, skip/next/mulai buttons

- [x] **P1-T24** Halaman Forgot Password: `src/app/(auth)/forgot-password/page.tsx`
  ✅ Form email → submit → success state dengan pesan "Cek email Anda"

### Day 5: Layout System + i18n + Capacitor Init ⬜

- [ ] **P1-T25** Setup next-intl:
  ```
  - src/i18n/en.json ✅ (70+ string English)
  - src/i18n/id.json ✅ (70+ string Indonesia)
  - Provider di layout root ❌ Belum
  - Language switcher di halaman auth ❌ Belum
  ```

- [ ] **P1-T26** Buat layout components:
  - `sidebar.tsx` — Base sidebar ⬜
  - `navbar.tsx` — Top navbar ⬜
  - 7 layout spesifik per role ⬜

- [ ] **P1-T27** Buat route groups + layout per role:
  - `src/app/(supplier)/layout.tsx` ⬜
  - `src/app/(generator)/layout.tsx` ⬜
  - `src/app/(aggregator)/layout.tsx` ⬜
  - `src/app/(converter)/layout.tsx` ⬜
  - `src/app/(enabler)/layout.tsx` ⬜
  - `src/app/(buyer)/layout.tsx` ⬜

- [ ] **P1-T28** Buat halaman dashboard placeholder per role (6 halaman) ⬜

- [ ] **P1-T29** Init Capacitor:
  ```bash
  bunx cap init WoodLoop com.woodloop.app
  bunx cap add android
  ```
  ⬜

- [ ] **P1-T30** Testing end-to-end flow auth ⬜ (E2E tests sudah ada dan pass, tapi perlu PocketBase running untuk full flow)

---

## 4. File Structure (Output Fase 1)

### Status File (🟢 = done, 🟡 = partial, ⬜ = pending)

```
woodloop_web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                      🟢
│   │   │   ├── login/page.tsx                  🟢
│   │   │   ├── register/page.tsx               🟢
│   │   │   ├── role-selection/page.tsx         🟢
│   │   │   ├── onboarding/page.tsx             🟢
│   │   │   └── forgot-password/page.tsx        🟢
│   │   ├── (supplier)/                         ⬜
│   │   ├── (generator)/                        ⬜
│   │   ├── (aggregator)/                       ⬜
│   │   ├── (converter)/                        ⬜
│   │   ├── (enabler)/                          ⬜
│   │   ├── (buyer)/                            ⬜
│   │   ├── layout.tsx                          🟢 Root layout
│   │   └── page.tsx                            🟢 Redirect / → /login
│   ├── components/
│   │   ├── ui/                                 🟢 23 komponen shadcn
│   │   └── layout/                             ⬜ Belum dibuat
│   ├── lib/
│   │   ├── pocketbase/
│   │   │   ├── client.ts                       🟢
│   │   │   └── types.ts                        ⬜
│   │   ├── hooks/
│   │   │   ├── query-provider.tsx              🟢
│   │   │   └── use-auth.ts                     🟢
│   │   ├── stores/
│   │   │   └── auth-store.ts                   🟢 + test
│   │   ├── utils.ts                            🟢 shadcn cn()
│   │   └── validations/
│   │       └── auth.ts                         🟢 Zod schemas
│   ├── proxy.ts                                🟢 Next.js 16 proxy
│   ├── i18n/
│   │   ├── en.json                             🟢
│   │   └── id.json                             🟢
│   ├── test/setup.ts                           🟢 Vitest + localStorage mock
│   └── styles/                                 🟢 (digabung ke globals.css)
├── e2e/
│   ├── auth.e2e.ts                             🟢 16 test cases
│   └── proxy.e2e.ts                            🟢 4 test cases
├── playwright.config.ts                        🟢
├── vitest.config.ts                            🟢
├── bunfig.toml                                 🟢
├── .env.local                                  🟢
├── package.json                                🟢
└── bun.lock                                    🟢
```

---

## 5. Unit Test Checklist

### Setup Testing ✅

- [x] **T-P1-1** Install testing libraries ✅
- [x] **T-P1-2** Setup `vitest.config.ts` ✅
- [x] **T-P1-3** Setup `src/test/setup.ts` (localStorage mock) ✅

### Unit Tests — Auth Store (Zustand) ✅

- [x] **T-P1-4** `auth-store.test.ts` — test initial state
- [x] **T-P1-5** `auth-store.test.ts` — test login() sets user + token
- [x] **T-P1-6** `auth-store.test.ts` — test logout() clears state
- [x] **T-P1-7** `auth-store.test.ts` — test setUser() updates role
- [x] **T-P1-8** `auth-store.test.ts` — test persist/restore dari localStorage

### Unit Tests — Validasi Zod ⬜

- [ ] **T-P1-9** `auth.test.ts` — loginSchema valid email + password
- [ ] **T-P1-10** `auth.test.ts` — loginSchema invalid email
- [ ] **T-P1-11** `auth.test.ts` — loginSchema password too short
- [ ] **T-P1-12** `auth.test.ts` — registerSchema valid data
- [ ] **T-P1-13** `auth.test.ts` — registerSchema missing name
- [ ] **T-P1-14** `auth.test.ts` — registerSchema invalid role

### Unit Tests — Auth Hooks (TanStack Query) ⬜

- [ ] **T-P1-15** `use-auth.test.tsx` — useLogin sukses return user
- [ ] **T-P1-16** `use-auth.test.tsx` — useLogin gagal return error
- [ ] **T-P1-17** `use-auth.test.tsx` — useRegister sukses
- [ ] **T-P1-18** `use-auth.test.tsx` — useLogout clear state
- [ ] **T-P1-19** `use-auth.test.tsx` — useAuthUser fetch data

### Unit Tests — PocketBase Client ⬜

- [ ] **T-P1-20** `client.test.ts` — getPB() returns singleton
- [ ] **T-P1-21** `client.test.ts` — getPB() throws jika URL kosong
- [ ] **T-P1-22** `client.test.ts` — authWithPassword works

### Unit Tests — Components ⬜

- [ ] **T-P1-23** s/d **T-P1-46** — Belum dibuat (akan dibuat setelah layout/components jadi)

### E2E Tests (Playwright) ✅

Sebagai ganti unit test komponen, kita punya **40 E2E tests** yang mencakup:

- ✅ TC-01: Homepage redirect
- ✅ TC-02: Login page (form, validation, navigation)
- ✅ TC-03: Register page (multi-step, role selection)
- ✅ TC-04: Role selection (6 cards, button state)
- ✅ TC-05: Onboarding (3 slides, skip)
- ✅ TC-06: Forgot password (form, back link)
- ✅ TC-07: Proxy (public route access, redirect)
- ✅ TC-11: Performance (load time < 5s)

---

## 6. Acceptance Criteria

### ✅ Selesai

- [x] **AC-1** `bun run dev` jalan tanpa error
- [x] **AC-2** `bun run build` success (Next.js build — zero warning)
- [x] **AC-3** Halaman login tampil di `/login`
- [x] **AC-11** All 23 shadcn/ui components terinstall dan bisa dipakai
- [x] **AC-12** `bun test` lulus (5/5 unit tests, 40/40 E2E tests)

### ⬜ Belum Selesai (Day 5)

- [ ] **AC-4** User bisa register dengan email valid + pilih role
- [ ] **AC-5** Setelah login, redirect ke dashboard sesuai role
- [ ] **AC-6** Masing-masing role punya layout/sidebar berbeda
- [ ] **AC-7** Sidebar collapse di mobile (Sheet drawer)
- [ ] **AC-8** Language switcher EN/ID berfungsi
- [ ] **AC-9** Dark mode toggle berfungsi (class strategy)
- [ ] **AC-10** Middleware block akses ke route yang bukan rolenya
- [ ] **AC-13** `bunx cap sync` success (Capacitor init)
- [ ] **AC-14** Lighthouse score ≥ 80 (performance + accessibility)

---

**Dokumen ini adalah breakdown detail Fase 1 dari PRD WoodLoop Web.**
**Gunakan bersama `/skill:woodloop-design-system` di Pi agent.**
