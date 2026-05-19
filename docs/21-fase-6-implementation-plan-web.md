# Implementation Plan — Fase 6: Enabler & Shared Features

**Project:** WoodLoop Web + Hybrid Mobile
**Durasi:** Hari 31–35
**Fokus:** Enabler dashboard (impact analytics), user management, wallet digital, chat system, notifications, profile management

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

Fase ini membangun fitur untuk **Enabler** (pemerintah/asosiasi) — dashboard impact analytics dan user management — plus fitur **shared** yang bisa dipakai semua role: wallet digital, chat, notifikasi, dan profil.

### Teknologi Baru

| Teknologi | Untuk |
|-----------|-------|
| shadcn Chart (recharts) | Grafik impact analytics |
| @capacitor/push-notifications | Push notification native |

---

## 2. Prerequisites

- [ ] Fase 5 complete (Buyer flow)
- [ ] Ada data `impact_metrics` di PocketBase (auto-calculated via hooks)
- [ ] FCM/APNS credentials untuk push notification
- [ ] `bun add recharts`

---

## 3. Task Breakdown

### Day 31: Enabler Dashboard — Impact Analytics

- [ ] **P6-T1** Buat hooks untuk Enabler:
  - `src/lib/hooks/use-enabler.ts`
  - `useImpactMetrics(period?)` — aggregasi data impact
  - `useAllUsers(filters?)` — list semua user (admin)
  - `useUpdateUserVerification(userId, status)` — mutation
- [ ] **P6-T2** Halaman Dashboard Enabler: `src/app/(enabler)/dashboard/page.tsx`
  - **Hero section**: 3 big number cards:
    - 🌳 Pohon Terselamatkan (konversi dari waste volume)
    - ♻️ Limbah Terpakai (kg)
    - 💨 CO2 Terselamatkan (kg)
    - 💰 Nilai Ekonomi Tercipta (Rp)
  - **Chart section** (shadcn Chart / recharts):
    - Bar chart: limbah terkelola per bulan (12 bulan)
    - Line chart: tren CO2 saved (cumulative)
    - Pie chart: distribusi peran user
    - Area chart: nilai ekonomi tercipta
  - **Map section**: peta sebaran user + aktivitas (Leaflet)
  - **Filter period**: 1 bulan, 3 bulan, 1 tahun, semua
  - Export data: download CSV

### Day 32: User Management (Enabler)

- [ ] **P6-T3** Halaman Manajemen User: `src/app/(enabler)/users/page.tsx`
  - DataTable: semua user dari PocketBase (auth collection)
  - Columns: avatar, name, email, role, workshop, is_verified, created, actions
  - Filter: role (Select multi), verifikasi status, date range
  - Search: name / email / workshop
  - Bulk actions: verifikasi selected users
- [ ] **P6-T4** Halaman Detail User: `src/app/(enabler)/users/[id]/page.tsx`
  - Profil lengkap user
  - Dokumen legalitas (SVLK/FSC) — view + approve/reject
  - Aktivitas user: listing, orders, transactions
  - Verifikasi toggle
  - Suspend/aktifkan akun
- [ ] **P6-T5** Buat komponen `UserDataTable`:
  - `src/components/features/user-data-table.tsx`
  - Wrapper shadcn DataTable dengan custom columns
  - Row click → detail
  - Bulk select + action toolbar
- [ ] **P6-T6** Buat komponen `DocumentManager`:
  - `src/components/features/document-manager.tsx`
  - View dokumen (PDF/image)
  - Approve/reject dengan alasan
  - Status badge: pending, verified, rejected

### Day 33: Wallet Digital (Shared)

- [ ] **P6-T7** Buat hooks wallet:
  - `src/lib/hooks/use-wallet.ts`
  - `useWalletBalance()` — saldo saat ini
  - `useWalletTransactions(filters?)` — riwayat transaksi
  - `useTopUp()` — mutation (top-up saldo)
- [ ] **P6-T8** Buat Zustand wallet store: `src/lib/stores/wallet-store.ts`
  - `balance: number`
  - `updateBalance(amount)`
  - Sync dengan PocketBase
- [ ] **P6-T9** Halaman Dompet Digital: `src/app/(shared)/wallet/page.tsx`
  - Balance card (besar, prominent): saldo + icon
  - Quick actions: Top Up, Tarik Tunai
  - Riwayat transaksi (DataTable):
    - Columns: tanggal, tipe (credit/debit), amount, description, balance after
    - Filter: tipe, date range
  - Chart: saldo per bulan
- [ ] **P6-T10** Buat komponen `WalletBalanceCard`:
  - `src/components/features/wallet-balance-card.tsx`
  - Animated counter (animate number)
  - Hide/show balance toggle
  - Currency formatting (Rp)

### Day 34: Chat System (Shared)

- [ ] **P6-T11** Buat hooks chat:
  - `src/lib/hooks/use-chat.ts`
  - `useConversations()` — list percakapan (group by partner)
  - `useMessages(partnerId)` — messages dengan user tertentu
  - `useSendMessage()` — mutation
  - `useMarkAsRead()` — mutation
  - **Realtime**: PocketBase subscription `chats` collection
- [ ] **P6-T12** Halaman Chat: `src/app/(shared)/chat/page.tsx`
  - Split layout:
    - Left: Daftar percakapan (User list)
    - Right: Chat area
  - **Left panel**:
    - Search user by name
    - List: avatar + name + last message + time + unread badge
    - Active conversation highlight
  - **Right panel**:
    - Chat header: avatar + name + role
    - Message list (scroll to bottom on new)
    - Chat bubble: avatar + name + message + time
    - Input area: textarea + send button + attachment
  - Mobile: single column, toggle antara list & chat
- [ ] **P6-T13** Buat komponen `ChatBubble`:
  - `src/components/features/chat-bubble.tsx`
  - Props: message, isOwn, sender, timestamp
  - Styling: bubble berbeda untuk own vs other
  - Avatar + name
  - Time stamp
  - Read receipt (double check)
- [ ] **P6-T14** Setup realtime subscription chat:
  - Subscribe ke `chats` collection
  - Filter: receiver = current user
  - Auto-scroll ke bottom
  - Notifikasi suara (opsional)
  - Update unread badge di navbar

### Day 35: Notifications + Profile + Polish

- [ ] **P6-T15** Buat hooks notifikasi:
  - `src/lib/hooks/use-notifications.ts`
  - `useNotifications()` — list notifikasi
  - `useMarkNotifAsRead(id)` — mutation
  - `useMarkAllAsRead()` — mutation
  - **Realtime**: subscribe `notifications` collection
- [ ] **P6-T16** Halaman Notifikasi: `src/app/(shared)/notifications/page.tsx`
  - List: icon (type), title, body, time, read/unread
  - Mark all as read button
  - Click → redirect ke halaman terkait (order, pickup, dll)
  - Empty: "Belum ada notifikasi"
- [ ] **P6-T17** Buat komponen `NotificationBadge`:
  - `src/components/features/notification-badge.tsx`
  - Show di navbar
  - Unread count
  - Real-time update
- [ ] **P6-T18** Setup Push Notification (Capacitor):
  - Register FCM token
  - Subscribe ke topic per user
  - Handle notification click → redirect
  - Web fallback: in-app notification
- [ ] **P6-T19** Halaman Profil: `src/app/(shared)/profile/page.tsx`
  - Avatar (upload)
  - Edit profil: name, workshop, phone, address, bio
  - Lokasi GPS (map picker)
  - Dokumen legalitas (upload + view)
  - Change password
  - Logout button
- [ ] **P6-T20** Buat komponen `MapPicker`:
  - `src/components/features/map-picker.tsx`
  - Leaflet map + draggable marker
  - Search location by name
  - Return lat/lng
- [ ] **P6-T21** Loading states: Skeleton wallet, skeleton chat list
- [ ] **P6-T22** Empty: "Belum ada transaksi" / "Belum ada chat" / "Belum ada notifikasi"
- [ ] **P6-T23** i18n: semua string Enabler + Shared features
- [ ] **P6-T24** Responsive: Chat split layout di desktop, single column di mobile

---

## 4. File Structure (Output Fase 6)

```
src/
├── app/
│   ├── (enabler)/
│   │   ├── dashboard/page.tsx
│   │   └── users/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── (shared)/
│   │   ├── wallet/page.tsx
│   │   ├── chat/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── profile/page.tsx
│   └── layout.tsx                # Update: tambah navbar wallet/notif global
├── components/
│   └── features/
│       ├── user-data-table.tsx
│       ├── document-manager.tsx
│       ├── wallet-balance-card.tsx
│       ├── chat-bubble.tsx
│       ├── notification-badge.tsx
│       └── map-picker.tsx
├── lib/
│   ├── hooks/
│   │   ├── use-enabler.ts
│   │   ├── use-wallet.ts
│   │   ├── use-chat.ts
│   │   └── use-notifications.ts
│   └── stores/
│       └── wallet-store.ts
```

---

## 5. Unit Test Checklist

### Hooks — useEnabler

- [ ] **T-P6-1** `useImpactMetrics` return aggregated data
- [ ] **T-P6-2** `useImpactMetrics` filter by period
- [ ] **T-P6-3** `useAllUsers` return paginated list
- [ ] **T-P6-4** `useAllUsers` filter by role
- [ ] **T-P6-5** `useUpdateUserVerification` mutation

### Hooks — useWallet

- [ ] **T-P6-6** `useWalletBalance` return number
- [ ] **T-P6-7** `useWalletTransactions` return list
- [ ] **T-P6-8** `useWalletTransactions` filter by type

### Hooks — useChat

- [ ] **T-P6-9** `useConversations` return grouped list
- [ ] **T-P6-10** `useConversations` sorted by latest message
- [ ] **T-P6-11** `useMessages` return array
- [ ] **T-P6-12** `useMessages` realtime update
- [ ] **T-P6-13** `useSendMessage` mutation sukses
- [ ] **T-P6-14** `useMarkAsRead` update status

### Store — WalletStore

- [ ] **T-P6-15** Initial balance 0
- [ ] **T-P6-16** `updateBalance` adds/subtracts
- [ ] **T-P6-17** Persist balance

### Halaman — Enabler Dashboard

- [ ] **T-P6-18** 4 impact cards render
- [ ] **T-P6-19** Bar chart render
- [ ] **T-P6-20** Period filter works
- [ ] **T-P6-21** Export CSV

### Halaman — User Management

- [ ] **T-P6-22** DataTable render users
- [ ] **T-P6-23** Filter by role
- [ ] **T-P6-24** Search by name/email
- [ ] **T-P6-25** Bulk verification

### Halaman — Wallet

- [ ] **T-P6-26** Balance card render
- [ ] **T-P6-27** Transaction list render
- [ ] **T-P6-28** Top-up flow

### Halaman — Chat

- [ ] **T-P6-29** Conversation list render
- [ ] **T-P6-30** Click conversation → load messages
- [ ] **T-P6-31** Send message → appear in chat
- [ ] **T-P6-32** Real-time: new message appears
- [ ] **T-P6-33** Unread badge update
- [ ] **T-P6-34** Mobile: toggle list/chat

### Halaman — Notifications

- [ ] **T-P6-35** List notifications
- [ ] **T-P6-36** Mark as read
- [ ] **T-P6-37** Mark all as read
- [ ] **T-P6-38** Click → redirect

### Halaman — Profile

- [ ] **T-P6-39** Edit profile form
- [ ] **T-P6-40** Upload avatar
- [ ] **T-P6-41** Change password
- [ ] **T-P6-42** Upload dokumen

---

## 6. Acceptance Criteria

- [ ] **AC-1** Enabler dashboard menampilkan 4 metrik impact + chart
- [ ] **AC-2** Filter period (1 bln, 3 bln, 1 thn) mengubah data chart
- [ ] **AC-3** Enabler bisa export data impact ke CSV
- [ ] **AC-4** Enabler bisa melihat & verifikasi user
- [ ] **AC-5** Dokumen legalitas bisa di-approve/reject
- [ ] **AC-6** Wallet balance tampil di semua halaman (navbar)
- [ ] **AC-7** Riwayat transaksi wallet bisa difilter
- [ ] **AC-8** Chat realtime — pesan baru muncul tanpa refresh
- [ ] **AC-9** Unread badge notifikasi realtime
- [ ] **AC-10** Push notification (Capacitor) berfungsi
- [ ] **AC-11** Profil bisa diedit, avatar diupload
- [ ] **AC-12** Map picker untuk lokasi
- [ ] **AC-13** Semua halaman responsive
- [ ] **AC-14** `bun test` lulus minimal 80%
