# Implementation Plan — Fase 1: Foundation

**Project:** WoodLoop Web + Hybrid Mobile
**Durasi:** Hari 1–5
**Fokus:** Setup project, arsitektur dasar, auth, layout, i18n, Capacitor init

---

## Status Pengerjaan

| Day | Progress | Status |
|-----|----------|--------|
| Day 1 — Setup Project | 6/6 | ✅ **Selesai** |
| Day 2 — shadcn/ui + Design System | 5/5 | ✅ **Selesai** |
| Day 3 — PocketBase + Auth | 7/7 | ✅ **Selesai** |
| Day 4 — Auth Pages | 5/5 | ✅ **Selesai** |
| Day 5 — Layout + i18n + Capacitor | 6/6 | ✅ **Selesai** |
| **Total** | **29/29 tasks** | 🎉 **FASE 1 SELESAI** |

---

## Task Breakdown

### Day 1: Setup Project ✅

- [x] **P1-T1** Init Next.js 16.2.6 + Bun ✅
- [x] **P1-T2** Install dependencies inti ✅
- [x] **P1-T3** Setup Tailwind CSS v4 ✅
- [x] **P1-T4** Setup globals.css dengan design tokens ✅
- [x] **P1-T5** Setup folder structure ✅
- [x] **P1-T6** Setup Git + initial commit ✅

### Day 2: shadcn/ui + Design System ✅

- [x] **P1-T7** Init shadcn/ui (Nova preset) ✅
- [x] **P1-T8** Install 23 komponen shadcn ✅
- [x] **P1-T9** Setup design tokens (warna, font, shadow) ✅
- [x] **P1-T10** Dark mode CSS variables ✅
- [x] **P1-T11** Icon utility (lucide-react) ✅
- [x] **P1-T12** Verifikasi semua komponen ✅

### Day 3: PocketBase Integration + Auth ✅

- [x] **P1-T13** PocketBase client singleton ✅
- [x] **P1-T14** TypeScript types (17 collections) ✅ **Baru**
- [x] **P1-T15** TanStack Query provider ✅
- [x] **P1-T16** Zustand auth store + 5 unit tests ✅
- [x] **P1-T17** Auth hooks: useLogin, useRegister, useForgotPassword ✅
- [x] **P1-T18** Zod validation schemas ✅
- [x] **P1-T19** Proxy middleware (Next.js 16) ✅

### Day 4: Auth Pages ✅

- [x] **P1-T20** Halaman Login ✅
- [x] **P1-T21** Halaman Register (2-step, role from URL) ✅
- [x] **P1-T22** Halaman Role Selection (6 cards) ✅
- [x] **P1-T23** Halaman Onboarding (3 slides + localStorage) ✅
- [x] **P1-T24** Halaman Forgot Password ✅

### Day 5: Layout System + i18n + Capacitor ✅

- [x] **P1-T25** i18n EN/ID + LanguageSwitcher component ✅ **Baru**
- [x] **P1-T26** Layout components: Sidebar, Navbar, DashboardLayout ✅
- [x] **P1-T27** Route groups (dashboard) + layout per role ✅
- [x] **P1-T28** Dashboard placeholder (7 role — tambah Desainer) ✅
- [x] **P1-T29** Init Capacitor + Android platform ✅
- [x] **P1-T30** E2E testing (50 tests pass) ✅

### Bonus

- [x] **Dark Mode Toggle** — ThemeToggle component di navbar ✅ **Baru**
- [x] **Auth Cookie Sync** — pb_auth + pb_role cookie ✅
- [x] **Hydration Gate** — Zustand _hydrated flag ✅

---

## Acceptance Criteria

- [x] **AC-1** `bun run dev` jalan tanpa error
- [x] **AC-2** `bun run build` success (zero warning)
- [x] **AC-3** Halaman login tampil di `/login`
- [x] **AC-4** User bisa register + pilih role
- [x] **AC-5** Setelah login, redirect ke dashboard sesuai role
- [x] **AC-6** Masing-masing role punya layout/sidebar berbeda
- [x] **AC-7** Sidebar collapse di mobile (Sheet drawer)
- [x] **AC-8** Language switcher EN/ID di navbar
- [x] **AC-9** Dark mode toggle di navbar
- [x] **AC-10** Middleware block akses yang bukan rolenya
- [x] **AC-11** 23 shadcn components terinstall
- [x] **AC-12** `bun test` lulus (5 unit + 50 E2E)
- [x] **AC-13** Capacitor init + Android platform
