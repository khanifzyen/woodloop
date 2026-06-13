---
title: "Bab 10 — Scan QR Code"
---

# Bab 10: Scan QR Code

---

Halaman **Scan QR** memungkinkan Anda memindai QR Code yang tertera pada produk WoodLoop untuk melihat halaman traceability publik produk tersebut.

![\1](../screenshots/\2)
*Gambar 10.1 — Halaman scan QR*

---

## 10.1 Halaman Scan

Halaman scan menampilkan area kamera untuk memindai QR Code:

```
┌──────────────────────────────────────┐
│                                      │
│        ┌──────────────────┐          │
│        │                  │          │
│        │    📷 Area       │          │
│        │    Kamera        │          │
│        │                  │          │
│        └──────────────────┘          │
│                                      │
│   Arahkan kamera ke QR code produk   │
│   Atau gunakan input manual di bawah │
│                                      │
└──────────────────────────────────────┘
```

**Cara scan:**
1. Buka halaman `/buyer/scan`
2. Arahkan kamera perangkat ke QR Code produk
3. Sistem akan mendeteksi QR Code secara otomatis
4. Anda akan diarahkan ke halaman traceability publik: `/p/[qr_code_id]`

> **Catatan:** Fitur kamera memerlukan izin akses kamera pada browser. Pastikan Anda mengizinkan akses saat diminta.

---

## 10.2 Input Manual Kode QR

Jika kamera tidak tersedia atau QR Code sulit terbaca, Anda dapat memasukkan kode QR secara manual:

1. Ketik kode QR (contoh: `PRD-XXXXXXXX`) di kolom input
2. Klik tombol **"Cari"**
3. Anda akan diarahkan ke halaman traceability publik

---
➡️ **Lanjut ke [Bab 11: Toko Penjual](./11-bab-11-toko-penjual.md)**
