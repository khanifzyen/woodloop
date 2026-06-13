---
title: "Bab 3 — Dashboard Aggregator"
---

# Bab 3: Dashboard Aggregator

---

Dashboard Aggregator adalah halaman utama yang muncul setelah login. Di sini Anda dapat melihat ringkasan bisnis secara sekilas.

![Dashboard Aggregator](../screenshots/14-aggregator-dashboard.png)
*Gambar 3.1 — Dashboard Aggregator*

---

## 3.1 Ringkasan Kartu (Summary Cards)

| Kartu | Ikon | Menampilkan |
|-------|------|-------------|
| **Penjemputan Hari Ini** | 🚚 | Jumlah pickup yang perlu dijadwalkan |
| **Stok Gudang** | 🏗️ | Total volume limbah di gudang (kg) |
| **Nilai Stok** | 💰 | Estimasi nilai total stok gudang |
| **Bid Aktif** | 📨 | Jumlah bidding yang sedang berjalan |

Data pada kartu ini diperbarui secara otomatis setiap kali halaman dimuat.

---

## 3.2 Aktivitas Terbaru

Di bagian bawah dashboard, terdapat daftar **aktivitas terbaru** yang menampilkan riwayat transaksi dan kejadian penting, seperti:

- 🗺️ **Limbah baru** — "Limbah Jati tersedia di Kecamatan Tahunan"
- 📨 **Bid diterima** — "Bid Anda untuk limbah Mahoni diterima Generator"
- 🚚 **Pickup selesai** — "Pickup limbah Jati berhasil dikonfirmasi"
- 🏗️ **Stok bertambah** — "Stok gudang bertambah 200 kg limbah Jati"
- 💰 **Stok terjual** — "Stok Jati — Offcut Besar dibeli oleh Converter"

---

## 3.3 Menu Cepat (Quick Actions)

Tombol aksi cepat untuk memulai aktivitas utama:

| Tombol | Fungsi | Tujuan |
|--------|--------|--------|
| 🗺️ **Treasure Map** | Membuka peta interaktif limbah | `/aggregator/treasure-map` |
| 🚚 **Pickups** | Melihat jadwal pickup | `/aggregator/pickups` |
| 🏗️ **Warehouse** | Mengelola stok gudang | `/aggregator/warehouse` |

> ⚡ **Catatan:** Gunakan menu cepat untuk akses langsung ke fitur yang paling sering digunakan.

---
➡️ **Lanjut ke [Bab 4: Treasure Map & Bidding](./04-bab-4-treasure-map.md)**
