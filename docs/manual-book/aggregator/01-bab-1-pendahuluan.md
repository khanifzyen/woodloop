---
title: "Bab 1 — Pendahuluan"
---

# Bab 1: Pendahuluan

---

## 1.1 Apa Itu WoodLoop?

**WoodLoop** adalah platform digital ekonomi sirkular untuk industri kayu dan furnitur di Jepara, Jawa Tengah. Platform ini menghubungkan seluruh aktor dalam rantai nilai kayu — dari pemasok kayu gelondongan, pengrajin yang menghasilkan limbah, pengepul, pengrajin upcycle, pembeli, hingga pemerintah — dalam satu ekosistem terpadu.

Tujuan utama WoodLoop adalah **mengubah limbah kayu menjadi sumber daya bernilai ekonomi** sekaligus melacak dampak lingkungannya.

---

## 1.2 Peran Aggregator dalam Ekosistem

**Aggregator** adalah pihak yang **menjemput limbah kayu** dari para Generator, menyortirnya, menyimpannya di gudang, dan menjualnya ke Converter sebagai bahan baku produksi. Aggregator menjadi **jembatan logistik** dalam ekonomi sirkular WoodLoop.

**Contoh pengguna Aggregator:**
- Pengepul kayu di Jepara
- Jasa angkutan / logistik kayu
- Pemilik gudang sortir kayu
- Pedagang perantara kayu

**Alur peran Aggregator dalam ekosistem WoodLoop:**

```
Supplier → (kayu gelondongan) → Generator → (limbah) → Aggregator → (bahan baku) → Converter → (produk jadi) → Buyer
                                                           ↓
                                                    (sortir & gudang)
```

**Aggregator memiliki tiga aktivitas utama:**
1. **Menemukan limbah** — Melalui Treasure Map, mencari limbah yang tersedia
2. **Menjemput limbah** — Mengajukan bid, menjadwalkan pickup, dan mengangkut limbah
3. **Menjual ke Converter** — Menyimpan di gudang dan menjual ke pasar bahan

---

## 1.3 Alur Bisnis Aggregator

| Langkah | Aktivitas | Halaman |
|---------|-----------|---------|
| 1 | Login ke akun Aggregator | `/login` |
| 2 | Melihat ringkasan bisnis | `/aggregator/dashboard` |
| 3 | Menemukan limbah via Treasure Map | `/aggregator/treasure-map` |
| 4 | Mengajukan bidding ke Generator | `/aggregator/bidding` |
| 5 | Menjadwalkan pickup | `/aggregator/pickups` |
| 6 | Konfirmasi pickup & bukti serah terima | `/aggregator/pickups` |
| 7 | Menambahkan stok ke gudang | `/aggregator/warehouse` |
| 8 | Menjual stok ke Converter | (otomatis via pasar bahan) |
| 9 | Mengelola profil | `/aggregator/profile` |

---

## 1.4 Istilah Penting

| Istilah | Arti |
|---------|------|
| **Treasure Map** | Peta interaktif lokasi limbah tersedia |
| **Bid / Bidding** | Penawaran harga dari Aggregator ke Generator |
| **Pickup** | Proses penjemputan limbah di lokasi Generator |
| **Warehouse** | Gudang penyimpanan limbah Aggregator |
| **Sortir** | Proses memilah limbah berdasarkan jenis/kualitas |
| **Stok Gudang** | Limbah yang sudah dijemput dan siap dijual |
| **Pasar Bahan** | Marketplace untuk Converter membeli stok |
| **Konfirmasi GPS** | Validasi lokasi saat pickup menggunakan GPS |
| **Limbah Tersedia** | Limbah yang siap ditawar oleh Aggregator |
| **Booking** | Status limbah yang sudah diterima biddingnya |

---
➡️ **Lanjut ke [Bab 2: Memulai](./02-bab-2-memulai.md)**
