# User Acceptance Test (UAT) — Fase 1: Foundation

**Project:** WoodLoop Web
**Tanggal:** {{tanggal}}
**Penguji:** {{nama}}
**Browser:** {{chrome/firefox/safari}}
**Resolusi:** {{desktop/mobile}}

---

## Cara Penggunaan

1. Jalankan dev server: `bun run dev` di `woodloop_web/`
2. Buka `http://localhost:3000`
3. Ikuti skenario di bawah dan centang hasilnya

---

## TC-01: Halaman Utama Redirect

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Buka `http://localhost:3000` | Redirect ke `/login` | ⬜ |
| URL berubah jadi `/login` | ✅ | ⬜ |

**Catatan:** _________________________

---

## TC-02: Halaman Login

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Buka `/login` | Form login tampil | ⬜ |
| Ada field Email | Input type="email" | ⬜ |
| Ada field Password | Input type="password" | ⬜ |
| Ada tombol "Masuk" | Button dengan text "Masuk" | ⬜ |
| Ada link "Daftar" | Navigasi ke `/register` | ⬜ |
| Ada link "Lupa Password?" | Navigasi ke `/forgot-password` | ⬜ |
| Klik "Masuk" tanpa isi | Error validasi muncul | ⬜ |
| Isi email invalid | Error "Email tidak valid" | ⬜ |
| Isi password < 6 char | Error "Password minimal 6 karakter" | ⬜ |
| Dark mode toggle | Class `.dark` di `<html>` | ⬜ |
| Language switcher EN/ID | Semua string berubah | ⬜ |

**Catatan:** _________________________

---

## TC-03: Halaman Register

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Buka `/register` | Form multi-step tampil | ⬜ |
| Step 1: isi email, password, nama | Field tersedia | ⬜ |
| Step 1: klik "Lanjut" tanpa isi | Error validasi | ⬜ |
| Step 2: pilih role | 6 card role muncul | ⬜ |
| Step 2: klik salah satu card | Card ter-highlight | ⬜ |
| Step 2: klik "Lanjut" tanpa pilih | Error/disabled | ⬜ |
| Step 3: field spesifik sesuai role | Berubah dinamis | ⬜ |
| Klik "Selesai" | Submit ke PocketBase | ⬜ |

**Catatan:** _________________________

---

## TC-04: Role Selection

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Buka `/role-selection` | 6 card grid (2x3) | ⬜ |
| Masing-masing card punya icon + nama + deskripsi | ✅ | ⬜ |
| Hover card | Efek visual (scale/shadow) | ⬜ |
| Klik card | Ter-highlight | ⬜ |
| Tombol "Konfirmasi" disabled sebelum pilih | ✅ | ⬜ |
| Setelah pilih → klik "Konfirmasi" | Redirect/lanjut | ⬜ |

**Catatan:** _________________________

---

## TC-05: Onboarding

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Buka `/onboarding` | Carousel 3 slides | ⬜ |
| Slide 1: masalah (penumpukan limbah) | Teks + ilustrasi | ⬜ |
| Slide 2: solusi (WoodLoop) | Teks + ilustrasi | ⬜ |
| Slide 3: manfaat (ekonomi sirkular) | Teks + ilustrasi | ⬜ |
| Tombol "Skip" | Langsung ke role-selection | ⬜ |
| Tombol "Next" | Pindah slide | ⬜ |
| Tombol "Mulai" di slide 3 | Ke role-selection | ⬜ |

**Catatan:** _________________________

---

## TC-06: Forgot Password

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Buka `/forgot-password` | Form email | ⬜ |
| Isi email valid + submit | "Cek email Anda" | ⬜ |
| Isi email invalid | Error validasi | ⬜ |
| Link "Kembali ke Login" | Navigasi ke `/login` | ⬜ |

**Catatan:** _________________________

---

## TC-07: Proxy (Middleware) — Route Protection

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Buka `/(supplier)/dashboard` tanpa login | Redirect ke `/login` | ⬜ |
| Buka `/(generator)/dashboard` tanpa login | Redirect ke `/login` | ⬜ |
| Buka `/(aggregator)/dashboard` tanpa login | Redirect ke `/login` | ⬜ |
| Buka `/(converter)/dashboard` tanpa login | Redirect ke `/login` | ⬜ |
| Buka `/(enabler)/dashboard` tanpa login | Redirect ke `/login` | ⬜ |
| Buka `/(buyer)/dashboard` tanpa login | Redirect ke `/login` | ⬜ |
| Setelah login sebagai Supplier, buka `/(generator)/dashboard` | Redirect ke dashboard Supplier | ⬜ |
| Setelah login sebagai Buyer, buka `/(enabler)/dashboard` | Redirect ke dashboard Buyer | ⬜ |
| Buka `/p/[random_id]` tanpa login | Bisa akses (public) | ⬜ |
| Buka `/login` saat sudah login | Tetap di /login (no redirect loop) | ⬜ |

**Catatan:** _________________________

---

## TC-08: Layout & Responsive

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Login sebagai Supplier | Sidebar Supplier muncul | ⬜ |
| Login sebagai Generator | Sidebar Generator muncul | ⬜ |
| Login sebagai Aggregator | Sidebar Aggregator muncul | ⬜ |
| Login sebagai Converter | Sidebar Converter muncul | ⬜ |
| Login sebagai Enabler | Sidebar Enabler muncul | ⬜ |
| Login sebagai Buyer | Navbar Buyer muncul (bukan sidebar) | ⬜ |
| Resize ke 375px (mobile) | Sidebar jadi Sheet (drawer) | ⬜ |
| Resize ke 1440px (desktop) | Sidebar fixed di kiri | ⬜ |
| Breadcrumb di header | Menampilkan navigasi | ⬜ |
| Avatar dropdown menu | Profile + Logout | ⬜ |

**Catatan:** _________________________

---

## TC-09: Dark Mode

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Toggle dark mode | Background jadi gelap | ⬜ |
| Semua teks terbaca | Contrast ratio ≥ 4.5:1 | ⬜ |
| Semua komponen shadcn berubah warna | ✅ | ⬜ |
| Refresh page — dark mode persist | Class `.dark` masih ada | ⬜ |

**Catatan:** _________________________

---

## TC-10: i18n EN/ID

| Langkah | Hasil Diharapkan | Status |
|---------|------------------|--------|
| Switch ke English | Semua string jadi English | ⬜ |
| Switch ke Indonesia | Semua string jadi Bahasa | ⬜ |
| Navigasi ke halaman lain — language persist | Masih sesuai pilihan | ⬜ |
| Refresh page — language persist | ✅ | ⬜ |

**Catatan:** _________________________

---

## TC-11: Performance (Lighthouse)

| Metrik | Target | Hasil | Status |
|--------|--------|-------|--------|
| Performance | ≥ 80 | _____ | ⬜ |
| Accessibility | ≥ 90 | _____ | ⬜ |
| SEO | ≥ 95 | _____ | ⬜ |
| Best Practices | ≥ 90 | _____ | ⬜ |

**Catatan:** _________________________

---

## Ringkasan

| Total Test Cases | Pass | Fail | Blocked |
|-----------------|------|------|---------|
| _____ | _____ | _____ | _____ |

**Catatan Tambahan:**
_________________________
_________________________

**Tanda Tangan Penguji:**
_________________________
