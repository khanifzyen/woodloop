# Workflow Diagram — WoodLoop Circular Economy

## 6 Role & Alur Utama

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                     WOODLOOP PLATFORM                       │
                    │            Jepara Circular Hub — Ekonomi Sirkular           │
                    └─────────────────────────────────────────────────────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         │                              │                              │
         ▼                              ▼                              ▼
   ┌──────────┐                  ┌────────────┐               ┌────────────┐
   │ SUPPLIER │                  │ GENERATOR  │               │  BUYER     │
   │ (Kayu    │                  │ (Pengrajin)│               │(Konsumen)  │
   │ Mentah)  │                  │            │               │            │
   └────┬─────┘                  └─────┬──────┘               └──────┬─────┘
        │                              │                             │
        │  ① Jual Kayu Mentah          │                             │
        │─────────────────────────────>│                             │
        │                              │                             │
        │                              │  ⑤ Jual Produk Jadi        │
        │                              │─────────────────────────────│
        │                              │                             │
        │                              │  ② Setor Limbah Kayu       │
        │                              │─────┐                       │
        │                              │     │                       │
        │                              │     ▼                       │
        │                              │  ┌────────────┐            │
        │                              │  │AGGREGATOR  │            │
        │                              │  │(Pengepul)  │            │
        │                              │  └─────┬──────┘            │
        │                              │        │                   │
        │                              │        │  ③ Kumpulkan &    │
        │                              │        │     Sortir Limbah │
        │                              │        ▼                   │
        │                              │  ┌────────────┐            │
        │                              │  │ Gudang     │            │
        │                              │  │ (Warehouse)│            │
        │                              │  └─────┬──────┘            │
        │                              │        │                   │
        │                              │        │  ④ Jual Bahan     │
        │                              │        │     Daur Ulang    │
        │                              │        ▼                   │
        │                              │  ┌────────────┐            │
        │                              │  │ CONVERTER  │            │
        │                              │  │ (Produsen) │            │
        │                              │  └─────┬──────┘            │
        │                              │        │                   │
        │                              │        │  ⑤ Jual Produk   │
        │                              │        │     Jadi          │
        │                              │        │───────────────────│
        │                              │        │                   │
        │                              │        │                   │
        │                              ▼        ▼                   │
        │                       ┌──────────────┐                    │
        │                       │   ENABLER    │                    │
        │                       │  (Pemerintah │                    │
        │                       │  / Pengawas) │                    │
        │                       └──────────────┘                    │
        │                                              ▲           │
        │                                              │           │
        │                       ⑥ Beli Produk         │           │
        │                       <──────────────────────┘           │
        └──────────────────────────────────────────────────────────┘
```

---

## Flow Details (Mermaid)

```mermaid
%%{init: {'theme': 'neutral', 'themeVariables': { 'primaryColor': '#2D6A4F', 'primaryTextColor': '#fff', 'primaryBorderColor': '#1B4332', 'lineColor': '#F1642E', 'secondaryColor': '#F0FFF4', 'tertiaryColor': '#fff'}}}%%
graph TD
    subgraph "🌲 SUPPLIER — Penyedia Kayu Mentah"
        S1[Daftar/Login] --> S2[Dashboard Supplier]
        S2 --> S3[Listing Kayu Mentah]
        S3 --> S4[Terima Pesanan dari Generator]
        S4 --> S5[Kirim Kayu]
    end

    subgraph "🏭 GENERATOR — Pengrajin Kayu"
        G1[Daftar/Login] --> G2[Dashboard Generator]
        G2 --> G3[Beli Kayu dari Supplier]
        G2 --> G4[Setor Limbah Kayu]
        G4 --> G5{Limbah Masuk Pool}
        G5 -->|Ada Bid| G6[Evaluasi Bid Aggregator]
        G6 -->|Terima| G7[Pickup oleh Aggregator]
        G7 --> G8[Buat Produk dari Kayu Baru]
        G2 --> G9[Jual Produk ke Marketplace]
    end

    subgraph "🚚 AGGREGATOR — Pengepul Logistik"
        A1[Daftar/Login] --> A2[Dashboard Aggregator]
        A2 --> A3[Treasure Map - Lihat Limbah]
        A3 --> A4[Filter & Pilih Limbah Terdekat]
        A4 --> A5{Pickup Langsung?}
        A5 -->|Ya| A6[Ambil Langsung]
        A5 -->|Tidak| A7[Bid via Lelang]
        A7 -->|Bid Diterima| A6
        A6 --> A8[Konfirmasi Pickup]
        A8 --> A9[Simpan di Gudang]
        A9 --> A10[Set Harga Jual]
        A10 --> A11[Jual ke Converter]
    end

    subgraph "🎨 CONVERTER — Produsen Daur Ulang"
        C1[Daftar/Login] --> C2[Dashboard Converter]
        C2 --> C3[Beli Bahan dari Aggregator]
        C3 --> C4[Produk Daur Ulang + QR Code]
        C4 --> C5[Jual ke Marketplace]
        C5 --> C6[Traceability - Lacak Produk]
    end

    subgraph "🛍️ BUYER — Konsumen"
        B1[Daftar/Login] --> B2[Dashboard Buyer]
        B2 --> B3[Marketplace - Lihat Produk]
        B3 --> B4[Filter & Cari Produk]
        B4 --> B5[Tambah ke Keranjang]
        B5 --> B6[Checkout & Bayar]
        B6 --> B7[Lacak Pesanan]
        B2 --> B8[Scan QR Code]
        B8 --> B9[Traceability Produk]
    end

    subgraph "📊 ENABLER — Pemerintah/Pengawas"
        E1[Daftar/Login] --> E2[Dashboard Enabler]
        E2 --> E3[Lihat Dampak Lingkungan]
        E3 --> E4[CO2 Tersimpan]
        E3 --> E5[Limbah Terpakai]
        E3 --> E6[Nilai Ekonomi]
        E2 --> E7[Manajemen User]
    end

    %% Cross-role connections
    S5 -->|Kayu Mentah| G3
    G5 -->|Limbah| A3
    A11 -->|Bahan Olahan| C3
    C5 -->|Produk Jadi| B3
    G9 -->|Produk Manual| B3
    B9 -->|Data Lingkungan| E3
    E7 -->|Verifikasi| S1
    E7 -->|Verifikasi| G1
    E7 -->|Verifikasi| A1
    E7 -->|Verifikasi| C1
    E7 -->|Verifikasi| B1
```

---

## Alur Sirkular — End-to-End

```
STEP 1 ─── SUPPLIER ───────────────────────────────────────────────
  Supplier mendaftarkan kayu mentah (jenis, diameter, volume, harga)
  → Kayu masuk pool "available"
  
STEP 2 ─── GENERATOR ──────────────────────────────────────────────
  Generator beli kayu dari Supplier
  → Generator olah kayu jadi produk
  → Sisa potongan (limbah) disetor ke platform
  
STEP 3 ─── AGGREGATOR ─────────────────────────────────────────────
  Aggregator lihat peta limbah di sekitar
  → Ambil langsung atau bid via lelang
  → Konfirmasi pickup (foto + GPS + timbangan)
  → Limbah masuk gudang Aggregator
  → Set harga jual per kg
  
STEP 4 ─── CONVERTER ──────────────────────────────────────────────
  Converter beli bahan dari gudang Aggregator
  → Olah jadi produk baru (daur ulang)
  → Generate QR code untuk traceability
  → Jual ke Marketplace
  
STEP 5 ─── BUYER ──────────────────────────────────────────────────
  Buyer browsing Marketplace
  → Lihat produk + dampak lingkungan
  → Beli via cart/checkout
  → Scan QR untuk lihat traceability (asal bahan)
  
STEP 6 ─── ENABLER ────────────────────────────────────────────────
  Enabler lihat dashboard dampak
  → CO₂ tersimpan, limbah teralihkan, nilai ekonomi
  → Verifikasi & manajemen user
```

---

## Hubungan Antar Role (Matriks)

| Role | Supplier | Generator | Aggregator | Converter | Buyer | Enabler |
|------|----------|-----------|------------|-----------|-------|---------|
| **Supplier** | — | Jual kayu | — | — | — | — |
| **Generator** | Beli kayu | — | Setor limbah | — | Jual produk | — |
| **Aggregator** | — | Ambil limbah | — | Jual bahan | — | — |
| **Converter** | — | — | Beli bahan | — | Jual produk | — |
| **Buyer** | — | — | — | Beli produk | — | — |
| **Enabler** | Verifikasi | Verifikasi | Verifikasi | Verifikasi | Verifikasi | — |

---

## Teknologi per Role

| Role | Halaman Utama | Fitur Kunci |
|------|---------------|-------------|
| **Supplier** | Dashboard, Inventaris, Pesanan, Penjualan | CRUD kayu, manajemen stok |
| **Generator** | Dashboard, Setor Limbah, Beli Kayu, Produk | Waste form stepper, bidding |
| **Aggregator** | Dashboard, Treasure Map, Pickup, Gudang, Lelang | Leaflet map, GPS, polyline routing |
| **Converter** | Dashboard, Pasar Bahan, Katalog, Klinik Desain | QR code, design clinic |
| **Buyer** | Marketplace, Pesanan, Cart, Checkout, Scan QR | SSR/ISR, checkout flow |
| **Enabler** | Dashboard, Manajemen User | Charts, impact metrics |
