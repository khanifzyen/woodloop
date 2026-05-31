# Notifikasi — Implementation Plan

## 1. Add Notification Creation to pb_hooks (`woodloop.pb.js`)

### 1a. After Order Created (`onRecordAfterCreateSuccess` for "orders")
- Saat Generator beli kayu → status = `payment_pending`
- Expand `product` → dapat `raw_timber_listings` → dapat `supplier` ID
- Notif untuk supplier: *"Pesanan baru dari [generator name]"*

### 1b. After Order Status Updated (tambah ke Hook 5 yang sudah ada)
- `paid` → `processing` → notif untuk Generator: *"Pesanan #... sedang diproses"*
- `processing` → `shipped` → notif untuk Generator: *"Pesanan #... telah dikirim"*

### 1c. After Pickup Completed (tambah ke Hook 2)
- Notif untuk Generator: *"Limbah Anda [weight]kg berhasil dijemput"*
- Code udah ada di `main.pb.js`, port ke `woodloop.pb.js`

### 1d. After Bid Accepted (tambah ke Hook 4)
- Notif untuk Aggregator: *"Tawaran diterima! Cek jadwal penjemputan."*

> `createRule: null` gak masalah — pb_hooks bypass rules.

## 2. Frontend — Realtime Subscription Global

**File:** `src/app/(dashboard)/layout.tsx`
- Panggil `useRealtimeNotifications()` agar badge notif update realtime di semua halaman

## 3. Frontend — Mark All Read

**File:** `src/lib/hooks/use-notifications.ts`
- Tambah `useMarkAllAsRead()` — batch update semua `is_read=true` untuk current user

**File:** `src/app/(shared)/notifications/page.tsx`
- Panggil `useMarkAllAsRead` di onClick tombol "Tandai Semua Dibaca"

## 4. Deploy

- Upload `woodloop.pb.js` ke server → restart PocketBase
