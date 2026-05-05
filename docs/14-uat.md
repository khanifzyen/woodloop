# WoodLoop — User Acceptance Test (UAT)

Panduan test manual untuk memvalidasi seluruh alur bisnis WoodLoop.
Test dilakukan di app Flutter yang terhubung ke PocketBase production/staging.

**Tanggal UAT:** ___________  
**Tester:** ___________  
**Versi App:** ___________  

---

## 0. Prasyarat

### Akun Test

| Role | Email | Password | User ID |
|------|-------|----------|---------|
| Supplier | demo.supplier@woodloop.id | (dari PocketBase) | wf0nbkomdb... |
| Generator | demo.generator@woodloop.id | (dari PocketBase) | 1dglt2b5ca... |
| Aggregator | demo.aggregator@woodloop.id | (dari PocketBase) | h3drfhnz39... |
| Converter | demo.converter@woodloop.id | (dari PocketBase) | 7e4jolmtfu... |
| Enabler | demo.enabler@woodloop.id | (dari PocketBase) | 3kpv5tblo6... |
| Buyer | demo.buyer@woodloop.id | (dari PocketBase) | ovw9jlgzll... |

> **Catatan:** Reset password via PocketBase Admin UI jika lupa.  
> **Admin PB:** https://pb-woodloop.pasarjepara.com/_/

### Sebelum Mulai

- [ ] Pastikan PocketBase server running (`curl pb-woodloop.pasarjepara.com/api/health`)
- [ ] Pastikan 6 akun test sudah terverifikasi admin (`is_verified = true`)
- [ ] Hapus semua data test sebelumnya (opsional, via Admin UI)

---

## UAT-01: Registrasi & Login

### UAT-01.1: Registrasi User Baru
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka app → Splash Screen | Logo WoodLoop 2-3 detik | |
| 2 | Lanjut ke Onboarding | 3 slide (Masalah → Solusi → Aksi) | |
| 3 | Pilih Role: Generator | Card Generator ter-highlight | |
| 4 | Isi form registrasi lengkap | Semua field sesuai role Generator | |
| 5 | Upload foto profil | Foto muncul di preview | |
| 6 | Submit registrasi | Redirect ke Registration Status | |
| 7 | Cek email verifikasi | Email dari PocketBase diterima | |
| 8 | Klik link verifikasi | Status verified = true | |

### UAT-01.2: Login
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Login dengan email & password valid | Redirect ke dashboard sesuai role | |
| 2 | Login dengan password salah | Error message muncul | |
| 3 | Forgot Password → request reset | Email reset password terkirim | |

---

## UAT-02: Generator Flow (Hulu)

> **Login sebagai:** `demo.generator@woodloop.id`

### UAT-02.1: Lihat Dashboard
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Dashboard Generator muncul | Saldo, tombol Setor, recent activity | |
| 2 | Bottom nav: Home, Setor, Produk, Profil | 4 tab terlihat | |

### UAT-02.2: Setor Limbah Kayu (Create Waste Listing)
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Tap tombol "+" (FAB) | Form input limbah terbuka | |
| 2 | Pilih bentuk: "offcut_large" | Dropdown berfungsi | |
| 3 | Pilih kondisi: "dry" | Dropdown berfungsi | |
| 4 | Pilih jenis kayu: "Jati" | List wood_types dari PB | |
| 5 | Isi volume: 50 | Input angka berfungsi | |
| 6 | Pilih unit: "kg" | Dropdown unit | |
| 7 | Isi harga estimasi: 500000 | Input harga | |
| 8 | Upload foto limbah (1-3 foto) | Preview foto muncul | |
| 9 | Submit form | Sukses → kembali ke dashboard | |
| 10 | Cek di tab "Produk" (Order Mgmt) | Listing baru muncul dengan status "available" | |
| 11 | Verifikasi di PB Admin (`waste_listings`) | Record baru ada dengan status "available" | |

### UAT-02.3: Lihat Riwayat Setor
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka Generator Order Management | Semua waste listing milik generator terlihat | |
| 2 | Filter berdasarkan status | List ter-filter | |

### UAT-02.4: Edit / Hapus Waste Listing
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Tap salah satu listing | Detail listing terbuka | |
| 2 | Edit deskripsi | Update sukses | |
| 3 | Hapus listing (yang masih available) | Listing hilang dari list | |

---

## UAT-03: Aggregator Flow (Logistik)

> **Login sebagai:** `demo.aggregator@woodloop.id`

### UAT-03.1: Treasure Map (Peta Limbah)
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka tab "Peta" | Google Maps muncul | |
| 2 | Pin merah muncul di peta | Menampilkan waste_listing dari Generator | |
| 3 | Tap salah satu pin | Popup detail (jenis, volume, harga) | |
| 4 | Tap tombol "Bid" di popup | Halaman bidding terbuka | |

### UAT-03.2: Bidding (Tawar)
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Isi nominal bid: 450000 | Input angka | |
| 2 | Isi pesan: "Siap jemput besok" | Input teks | |
| 3 | Submit bid | Bid tersimpan, status "pending" | |
| 4 | Verifikasi di PB (`bids`) | Record bid baru ada | |

### UAT-03.3: Buat Pickup
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Dari Treasure Map, pilih waste listing | Detail + tombol "Pickup" | |
| 2 | Tap "Pickup" / konfirmasi | Pickup terbuat, status "pending" | |
| 3 | Verifikasi waste_listing.status | Berubah jadi **"booked"** (PB Hook 1) | |
| 4 | Cek di PB (`pickups`) | Record pickup baru ada | |

### UAT-03.4: Konfirmasi Penjemputan (Complete Pickup)
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka halaman Confirm Pickup | Detail pickup terbuka | |
| 2 | Isi berat terverifikasi: 48 kg | Input berat riil | |
| 3 | Upload foto bukti serah terima | Foto ter-upload | |
| 4 | Update status → "completed" | **CASCADE TRIGGER** (PB Hook 2): | |
| 4a | ... | waste_listing.status → **"collected"** | |
| 4b | ... | warehouse_inventory record terbuat | |
| 4c | ... | impact_metrics record terbuat | |
| 4d | ... | wallet_transactions: credit ke Generator | |
| 5 | Verifikasi di PB Admin | 4 record baru di 4 koleksi berbeda | |

### UAT-03.5: Warehouse Inventory
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka tab "Gudang" | List stok gudang aggreator | |
| 2 | Item dari pickup completed muncul | Status "in_stock", berat sesuai | |
| 3 | Set harga per kg | Harga ter-update | |
| 4 | Update status ke "reserved" (opsional) | Status berubah | |

---

## UAT-04: Converter Flow (Hilir)

> **Login sebagai:** `demo.converter@woodloop.id`

### UAT-04.1: Marketplace Bahan Baku
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka tab "Market" | Katalog bahan dari warehouse Aggregator | |
| 2 | Filter berdasarkan jenis kayu | List ter-filter | |
| 3 | Tap salah satu item | Detail bahan (jenis, berat, harga, foto) | |
| 4 | Tap "Beli" | Halaman checkout terbuka | |

### UAT-04.2: Checkout & Pembelian
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Isi quantity: 30 kg | Input jumlah | |
| 2 | Total harga terhitung otomatis | qty × price_per_kg | |
| 3 | Pilih metode bayar: "wallet" | Dropdown payment method | |
| 4 | Konfirmasi pembelian | Marketplace transaction terbuat, status "pending" | |
| 5 | Update status ke "paid" (via Admin PB) | **CASCADE TRIGGER** (PB Hook 3): | |
| 5a | ... | warehouse_inventory.status → **"sold"** | |
| 5b | ... | wallet_tx: debit Converter | |
| 5c | ... | wallet_tx: credit Aggregator | |
| 6 | Verifikasi di PB | 3 record baru/update | |

### UAT-04.3: Design Clinic (Resep Desain)
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka Design Clinic dari dashboard | List resep desain | |
| 2 | Tap salah satu resep | Detail + foto + langkah-langkah | |
| 3 | Filter berdasarkan difficulty | List ter-filter | |

### UAT-04.4: Buat Upcycled Product
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka tab "Produk" → My Catalog | List produk converter | |
| 2 | Tap "Tambah Produk" | Form create product | |
| 3 | Isi nama: "Vas Trembesi" | Input teks | |
| 4 | Pilih kategori: "decor" | Dropdown | |
| 5 | Isi harga: 250000 | Input harga | |
| 6 | Pilih source_transactions (dari pembelian) | Link ke marketplace_tx | |
| 7 | Upload foto produk | Preview foto | |
| 8 | Submit | Produk tersimpan, muncul di catalog | |
| 9 | Generate QR Code | QR code muncul, scan-able | |

---

## UAT-05: Buyer Flow (Konsumen)

> **Login sebagai:** `demo.buyer@woodloop.id`

### UAT-05.1: Marketplace Produk Jadi
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka tab "Belanja" | Katalog produk upcycled | |
| 2 | Filter / search produk | Filter berfungsi | |
| 3 | Tap produk | Detail: foto, deskripsi, harga, stok | |

### UAT-05.2: Keranjang & Checkout
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Tap "Tambah ke Keranjang" | Item masuk cart | |
| 2 | Buka tab "Keranjang" | List item + total harga | |
| 3 | Update quantity | Jumlah dan subtotal update | |
| 4 | Tap "Checkout" | Halaman checkout | |
| 5 | Isi alamat pengiriman | Input teks | |
| 6 | Pilih metode bayar | Dropdown | |
| 7 | Konfirmasi pesanan | Order terbuat, status "payment_pending" | |

### UAT-05.3: Pembayaran & Tracking
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Update order ke "paid" (via Admin PB) | **CASCADE** (PB Hook 5): | |
| 1a | ... | product.stock berkurang | |
| 1b | ... | wallet_tx: debit Buyer | |
| 2 | Buka Order Tracking | Status order ter-update | |
| 3 | Tracking step-by-step | paid → processing → shipped → received | |

---

## UAT-06: Traceability (QR Code)

> **Tanpa login** (halaman publik)

### UAT-06.1: Scan QR Code
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Scan QR code dari produk Converter | Redirect ke halaman traceability | |
| 2 | Timeline perjalanan kayu muncul | 3-4 step: Generator → Aggregator → Converter | |
| 3 | Statistik dampak muncul | CO2 saved, waste diverted | |
| 4 | Nama entitas di setiap step | Nama Generator, Aggregator, Converter | |

### UAT-06.2: Akses via Link
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka link traceability di browser | Halaman publik terbuka (tanpa login) | |
| 2 | Semua data traceability muncul | Sama seperti scan QR | |

---

## UAT-07: Wallet & Transaksi

### UAT-07.1: Cek Saldo
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Login sebagai Generator | Dashboard dengan saldo | |
| 2 | Saldo bertambah setelah pickup completed | Balance sesuai credit dari Aggregator | |
| 3 | Login sebagai Aggregator | Saldo bertambah setelah marketplace sale | |
| 4 | Login sebagai Converter | Saldo berkurang setelah marketplace purchase | |
| 5 | Login sebagai Buyer | Saldo berkurang setelah order paid | |

### UAT-07.2: Riwayat Transaksi
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka Digital Wallet | List transaksi (credit/debit) | |
| 2 | Verifikasi tipe transaksi sesuai | credit/debit sesuai flow | |
| 3 | Verifikasi reference_type | pickup / marketplace_transaction / order | |
| 4 | Verifikasi balance_after konsisten | Saldo akhir = saldo awal ± amount | |

---

## UAT-08: Supplier Flow

> **Login sebagai:** `demo.supplier@woodloop.id`

### UAT-08.1: Input Kayu Mentah
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Dashboard Supplier muncul | Statistik: revenue, stok, listing aktif | |
| 2 | Tap FAB "+" | Form input kayu mentah | |
| 3 | Isi: jenis kayu, dimensi, volume, harga | Semua field berfungsi | |
| 4 | Upload foto kayu | Preview foto | |
| 5 | Submit | Listing muncul di Inventaris | |

### UAT-08.2: Marketplace & Inventaris
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka tab "Katalog" | Raw Timber Marketplace | |
| 2 | Listing supplier sendiri muncul | Bisa dilihat user lain | |
| 3 | Buka "Inventaris" | Filter by status (available/sold) | |
| 4 | Buka "Riwayat Penjualan" | List item yang sudah terjual | |

---

## UAT-09: Enabler Dashboard

> **Login sebagai:** `demo.enabler@woodloop.id`

### UAT-09.1: Impact Analytics
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Dashboard Enabler muncul | Statistik aggregate | |
| 2 | Total limbah terselamatkan (kg) | Akumulasi dari impact_metrics | |
| 3 | Total CO2 dicegah (kg) | Akumulasi co2_saved | |
| 4 | Grafik tren bulanan | Chart.js / grafik Flutter | |

---

## UAT-10: Chat & Notifikasi

### UAT-10.1: Chat
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Generator → Chat ke Aggregator | Pesan terkirim | |
| 2 | Aggregator terima notifikasi chat | Muncul di conversation list | |
| 3 | Balas pesan | Percakapan dua arah | |
| 4 | Cek unread count | Counter muncul | |

### UAT-10.2: Notifikasi
| Langkah | Aksi | Hasil yang Diharapkan | ✅/❌ |
|---------|------|----------------------|------|
| 1 | Buka Notification Center | List notifikasi | |
| 2 | Notifikasi muncul saat status berubah | "Pickup completed", "Order paid" | |
| 3 | Tap notifikasi → mark as read | Status berubah, counter berkurang | |

---

## UAT-11: End-to-End Full Flow (Skenario Lengkap)

Lakukan skenario ini dari awal sampai akhir **tanpa reset data**:

```
1. [SUPPLIER]   Input kayu Jati 2m³, harga Rp 2.000.000
2. [GENERATOR]  Setor limbah offcut Jati 50kg, estimasi Rp 500.000
3. [AGGREGATOR] Buka Treasure Map → lihat pin Generator
4. [AGGREGATOR] Bid Rp 450.000 → diterima Generator (via Admin PB)
5. [AGGREGATOR] Buat Pickup → status "pending"
6. [AGGREGATOR] Konfirmasi selesai → isi berat 48kg → complete
      ↳ PB Hook: waste → collected, warehouse created, wallet credited
7. [CONVERTER]  Buka Marketplace → lihat stok Jati 48kg
8. [CONVERTER]  Beli 30kg → checkout → bayar
      ↳ PB Hook: warehouse → sold, wallet debited/credited
9. [CONVERTER]  Buat produk "Vas Jati" → link source transaction
10.[CONVERTER]  Generate QR Code → tempel di produk
11.[BUYER]      Buka Marketplace → lihat "Vas Jati"
12.[BUYER]      Tambah ke keranjang → checkout → bayar
      ↳ PB Hook: stock berkurang, wallet debited
13.[PUBLIC]     Scan QR Code → lihat perjalanan kayu
14.[ENABLER]    Buka dashboard → lihat impact metrics ter-update
```

### Verifikasi Final End-to-End

| # | Verifikasi | ✅/❌ |
|---|-----------|------|
| 1 | waste_listing Generator: status = "collected" | |
| 2 | pickup Aggregator: status = "completed" | |
| 3 | warehouse_inventory: 1 record created, lalu 1 sold | |
| 4 | impact_metrics: CO2 saved = 48 × 1.5 = 72 kg | |
| 5 | marketplace_transactions: status = "paid" | |
| 6 | products (Converter): "Vas Jati", source_transactions linked | |
| 7 | orders (Buyer): status progression | |
| 8 | wallet_transactions Generator: +Rp 500.000 (credit) | |
| 9 | wallet_transactions Aggregator: +Rp 300.000 (credit dari marketplace) | |
| 10 | wallet_transactions Converter: -Rp 300.000 (debit) + nanti credit dari Buyer | |
| 11 | wallet_transactions Buyer: -Rp 250.000 (debit) | |
| 12 | Traceability page: 3 steps (Generator → Aggregator → Converter) | |
| 13 | Enabler dashboard: total limbah + CO2 ter-update | |

---

## Ringkasan Hasil UAT

| Section | Total Tests | Passed | Failed | Notes |
|---------|------------|--------|--------|-------|
| UAT-01: Registrasi & Login | ___ | ___ | ___ | |
| UAT-02: Generator | ___ | ___ | ___ | |
| UAT-03: Aggregator | ___ | ___ | ___ | |
| UAT-04: Converter | ___ | ___ | ___ | |
| UAT-05: Buyer | ___ | ___ | ___ | |
| UAT-06: Traceability | ___ | ___ | ___ | |
| UAT-07: Wallet | ___ | ___ | ___ | |
| UAT-08: Supplier | ___ | ___ | ___ | |
| UAT-09: Enabler | ___ | ___ | ___ | |
| UAT-10: Chat & Notifikasi | ___ | ___ | ___ | |
| UAT-11: End-to-End | ___ | ___ | ___ | |
| **TOTAL** | ___ | ___ | ___ | |

### Catatan / Bug Ditemukan

```
1. 
2. 
3. 
```

### Tanda Tangan

| Role | Nama | Tanggal | TTD |
|------|------|---------|-----|
| Tester | ___________ | ___________ | |
| Reviewer | ___________ | ___________ | |
