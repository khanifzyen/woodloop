---
title: "Bab 6 — Riwayat Transaksi"
---

# Bab 6: Riwayat Transaksi

---

Halaman **Riwayat Transaksi** (`/converter/marketplace/history`) menampilkan semua pembelian bahan yang telah Anda lakukan.

---

## 6.1 Daftar Transaksi

Setiap baris dalam tabel menampilkan informasi berikut:

| Kolom | Keterangan |
|-------|------------|
| **Item** | Nama jenis kayu yang dibeli |
| **Aggregator** | Nama penjual |
| **Quantity** | Jumlah dalam kg |
| **Total** | Total harga pembelian dalam Rupiah |
| **Status** | Status pemrosesan (badge berwarna) |
| **Tanggal** | Tanggal transaksi |

---

## 6.2 Status Transaksi

Setiap transaksi memiliki status yang menunjukkan progres pemrosesan:

| Status | Badge | Arti |
|--------|-------|------|
| **Menunggu** | 🟡 Kuning | Menunggu konfirmasi Aggregator |
| **Dibayar** | 🟢 Hijau | Pembayaran sudah dikonfirmasi |
| **Dikirim** | 🟢 Hijau | Bahan sedang dikirim |
| **Diterima** | ⚪ Abu-abu | Bahan sudah sampai — transaksi selesai |
| **Dibatalkan** | 🔴 Merah | Transaksi dibatalkan |

**Alur status transaksi:**

```
pending → paid → shipped → received → selesai
   ↓
cancelled
```

### Jika Belum Ada Transaksi

Jika belum ada transaksi, halaman akan menampilkan:

```
┌──────────────────────────────────────────────┐
│                                              │
│                    🕐                         │
│           Belum ada transaksi                 │
│    Beli bahan di Pasar Bahan untuk memulai    │
│                                              │
└──────────────────────────────────────────────┘
```

---
➡️ **Lanjut ke [Bab 7: Katalog Produk & QR Code](./07-bab-7-katalog-produk.md)**
