# Skema Database WoodLoop (PocketBase)

Dokumen ini merinci rancangan koleksi (collections) dan relasi database untuk platform **WoodLoop**, dirancang khusus untuk **PocketBase** dengan memperhatikan fitur bawaan (auth collection, API rules, hooks) dan kebutuhan nyata dari seluruh halaman di `woodloop_app`.

---

## 1. Koleksi: `users` (Auth Collection — Bawaan PocketBase)

Menggunakan **Auth Collection** bawaan PocketBase untuk autentikasi. Field bawaan (`id`, `username`, `email`, `password`, `verified`, `created`, `updated`) sudah disediakan otomatis. Berikut field **tambahan** yang diperlukan:

| Field Name | Type | Options / Validation | Description |
| :--- | :--- | :--- | :--- |
| `name` | text | required | Nama lengkap / nama pemilik |
| `avatar` | file | image, max 1 file | Foto profil |
| `role` | select | `supplier`, `generator`, `aggregator`, `converter`, `enabler`, `buyer` — required | Peran utama pengguna |
| `workshop_name` | text | - | Nama bengkel / perusahaan / toko |
| `address` | text | - | Alamat lengkap fisik |
| `location_lat` | number | min: -90, max: 90 | Koordinat Lintang (untuk peta) |
| `location_lng` | number | min: -180, max: 180 | Koordinat Bujur (untuk peta) |
| `phone` | text | - | Nomor WhatsApp / Telepon |
| `is_verified` | bool | default: `false` | Status verifikasi legalitas (SVLK/FSC) |
| `bio` | text | - | Deskripsi singkat profil |
| `production_capacity` | text | - | Kapasitas produksi (khusus Generator) |
| `machine_type` | text | - | Jenis mesin (khusus Generator) |
| `fleet_type` | text | - | Jenis armada truk (khusus Aggregator) |
| `warehouse_capacity` | text | - | Kapasitas gudang (khusus Aggregator) |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id != ""` (harus login)
- **Create:** `""` (publik — saat registrasi)
- **Update/Delete:** `@request.auth.id = id` (hanya pemilik akun)

---

## 2. Koleksi: `wood_types` (Base Collection — Master Data)

Data referensi jenis kayu untuk standarisasi di seluruh platform.

| Field Name | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `name` | text | required, unique | Contoh: Jati, Mahoni, Trembesi, Mindi, Akasia |
| `carbon_factor` | number | default: 1.5 | Faktor konversi per Kg untuk perhitungan CO2 |

**PocketBase API Rules:**
- **List/View:** `""` (publik, read-only untuk semua)
- **Create/Update/Delete:** `@request.auth.role = "enabler"` (hanya Enabler/admin)

---

## 3. Koleksi: `raw_timber_listings` (Base Collection — Supplier)

Kayu mentah (gelondongan) yang didaftarkan oleh Supplier untuk dijual ke Generator.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `supplier` | relation | → `users` (single, required, cascadeDelete) | Pemilik listing kayu mentah |
| `wood_type` | relation | → `wood_types` (single, required) | Jenis kayu |
| `diameter` | number | - | Diameter log (cm) |
| `length` | number | - | Panjang log (cm) |
| `volume` | number | required | Volume (m³) |
| `price` | number | required | Harga per satuan |
| `unit` | select | `m3`, `batang`, `ton` | Satuan |
| `photos` | file | image, max 5 files | Foto kayu mentah |
| `legality_doc` | file | max 1 file | Surat legalitas (SVLK/FSC) |
| `status` | select | `available`, `sold` — default: `available` | Status ketersediaan |
| `description` | text | - | Catatan tambahan |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id != ""`
- **Create:** `@request.auth.role = "supplier"`
- **Update/Delete:** `@request.auth.id = supplier`

---

## 4. Koleksi: `waste_listings` (Base Collection — Generator)

Limbah kayu yang diunggah oleh Generator untuk dijemput/dibeli.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `generator` | relation | → `users` (single, required, cascadeDelete) | Pemilik limbah |
| `wood_type` | relation | → `wood_types` (single, required) | Jenis kayu limbah |
| `form` | select | `offcut_large`, `offcut_small`, `shaving`, `sawdust`, `logs_end` | Bentuk limbah |
| `condition` | select | `dry`, `wet`, `oiled`, `mixed` — default: `dry` | Kondisi limbah |
| `volume` | number | required | Jumlah kuantitas |
| `unit` | select | `kg`, `m3`, `sack`, `pickup` | Satuan |
| `photos` | file | image, max 5 files | Foto tumpukan limbah |
| `price_estimate` | number | default: 0 | Estimasi harga (0 = gratis) |
| `status` | select | `available`, `booked`, `collected`, `sold` — default: `available` | Status ketersediaan |
| `description` | text | - | Catatan tambahan (misal: "kondisi kering") |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id != ""`
- **Create:** `@request.auth.role = "generator"`
- **Update:** `@request.auth.id = generator || @request.auth.role = "aggregator"`
- **Delete:** `@request.auth.id = generator`

---

## 5. Koleksi: `pickups` (Base Collection — Aggregator)

Transaksi penjemputan limbah dari Generator ke Aggregator.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `aggregator` | relation | → `users` (single, required) | Pengepul yang menjemput |
| `waste_listing` | relation | → `waste_listings` (single, required) | Referensi limbah yang diambil |
| `scheduled_date` | date | - | Tanggal rencana penjemputan |
| `actual_date` | date | - | Tanggal aktual penjemputan |
| `status` | select | `pending`, `on_the_way`, `completed`, `cancelled` — default: `pending` | Status logistik |
| `weight_verified` | number | - | Berat/volume hasil timbangan di lokasi |
| `pickup_photo` | file | image, max 3 files | Bukti foto serah terima |
| `notes` | text | - | Catatan penjemputan |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id != ""`
- **Create:** `@request.auth.role = "aggregator"`
- **Update:** `@request.auth.id = aggregator`
- **Delete:** `@request.auth.id = aggregator && status = "pending"`

**PocketBase Hook (After Create):**
- Set `waste_listing.status` → `booked`

**PocketBase Hook (After Update, status = "completed"):**
- Set `waste_listing.status` → `collected`
- Buat record `warehouse_inventory` otomatis

---

## 6. Koleksi: `warehouse_inventory` (Base Collection — Aggregator)

Stok limbah di gudang Aggregator, siap dijual ke Converter.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `aggregator` | relation | → `users` (single, required) | Pemilik gudang |
| `pickup` | relation | → `pickups` (single, required) | Referensi asal pickup |
| `wood_type` | relation | → `wood_types` (single) | Jenis kayu |
| `form` | select | `offcut_large`, `offcut_small`, `shaving`, `sawdust`, `logs_end` | Bentuk limbah |
| `weight` | number | required | Berat (Kg) stok tersisa |
| `price_per_kg` | number | - | Harga jual per Kg |
| `status` | select | `in_stock`, `reserved`, `sold` — default: `in_stock` | Status stok |
| `photos` | file | image, max 3 files | Foto stok gudang |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id != ""`
- **Create/Update:** `@request.auth.id = aggregator`
- **Delete:** `@request.auth.id = aggregator && status = "in_stock"`

---

## 7. Koleksi: `marketplace_transactions` (Base Collection — Converter ↔ Aggregator)

Transaksi pembelian bahan limbah oleh Converter dari gudang Aggregator.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `buyer` | relation | → `users` (single, required) | Converter yang membeli |
| `seller` | relation | → `users` (single, required) | Aggregator penjual |
| `inventory_item` | relation | → `warehouse_inventory` (single, required) | Stok yang dibeli |
| `quantity` | number | required | Jumlah beli (Kg) |
| `total_price` | number | required | Total harga transaksi |
| `status` | select | `pending`, `paid`, `shipped`, `received`, `cancelled` — default: `pending` | Status transaksi |
| `payment_method` | select | `wallet`, `bank_transfer`, `cod` | Metode pembayaran |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id = buyer || @request.auth.id = seller`
- **Create:** `@request.auth.role = "converter"`
- **Update:** `@request.auth.id = buyer || @request.auth.id = seller`

**PocketBase Hook (After Update, status = "paid"):**
- Set `warehouse_inventory.status` → `sold`
- Update saldo wallet kedua pihak

---

## 8. Koleksi: `products` (Base Collection — Converter)

Produk jadi yang dibuat dari bahan daur ulang oleh Converter.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `converter` | relation | → `users` (single, required, cascadeDelete) | Pengrajin pembuat produk |
| `name` | text | required | Nama produk jadi |
| `description` | text | - | Cerita / deskripsi produk |
| `category` | select | `furniture`, `decor`, `accessories`, `art`, `other` | Kategori produk |
| `price` | number | required | Harga jual |
| `stock` | number | default: 0 | Jumlah stok tersedia |
| `photos` | file | image, max 5 files | Galeri foto produk |
| `source_transactions` | relation | → `marketplace_transactions` (multiple) | Relasi ke sumber bahan (untuk Traceability) |
| `qr_code_id` | text | unique | ID unik untuk akses halaman traceability publik |

**PocketBase API Rules:**
- **List/View:** `""` (publik, untuk Buyer dan halaman traceability)
- **Create/Update/Delete:** `@request.auth.id = converter`

---

## 9. Koleksi: `orders` (Base Collection — Buyer ↔ Converter)

Pembelian produk jadi oleh konsumen akhir (Buyer).

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `buyer` | relation | → `users` (single, required) | Pembeli |
| `product` | relation | → `products` (single, required) | Produk yang dibeli |
| `quantity` | number | required, min: 1 | Jumlah beli |
| `total_price` | number | required | Total harga |
| `status` | select | `payment_pending`, `paid`, `processing`, `shipped`, `received`, `cancelled` — default: `payment_pending` | Status pesanan |
| `shipping_address` | text | required | Alamat pengiriman |
| `snap_token` | text | - | Token Midtrans Snap (untuk pembayaran) |
| `snap_redirect_url` | url | - | URL redirect Midtrans |
| `payment_method` | select | `qris`, `virtual_account`, `bank_transfer`, `cod` | Metode pembayaran |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id = buyer || @request.auth.id = product.converter`
- **Create:** `@request.auth.role = "buyer"`
- **Update:** `@request.auth.id = buyer || @request.auth.id = product.converter`

**PocketBase Hook (Webhook Midtrans — After Payment):**
- Set `order.status` → `paid`
- Update `product.stock` (kurangi `quantity`)
- Kirim notifikasi ke Converter

---

## 10. Koleksi: `cart_items` (Base Collection — Buyer)

Item di keranjang belanja sebelum checkout.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `buyer` | relation | → `users` (single, required, cascadeDelete) | Pemilik keranjang |
| `product` | relation | → `products` (single, required) | Produk di keranjang |
| `quantity` | number | required, min: 1 | Jumlah |

**PocketBase API Rules:**
- **List/View/Create/Update/Delete:** `@request.auth.id = buyer`

---

## 11. Koleksi: `wallet_transactions` (Base Collection — Semua Role)

Riwayat transaksi dompet digital, menggantikan satu koleksi `wallets` tunggal.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `user` | relation | → `users` (single, required) | Pemilik transaksi |
| `type` | select | `credit`, `debit` | Jenis transaksi |
| `amount` | number | required, min: 0 | Jumlah (Rp) |
| `balance_after` | number | - | Saldo setelah transaksi |
| `description` | text | - | Deskripsi (misal: "Penjualan limbah Jati 50kg") |
| `reference_type` | select | `pickup`, `marketplace_transaction`, `order`, `topup`, `withdrawal` | Tipe referensi |
| `reference_id` | text | - | ID record terkait |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id = user`
- **Create:** hanya via PocketBase Hook (backend-only)
- **Update/Delete:** tidak diizinkan (immutable log)

---

## 12. Koleksi: `impact_metrics` (Base Collection — Auto-calculated)

Pencatatan dampak lingkungan, diisi otomatis via Hook.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `waste_listing` | relation | → `waste_listings` (single) | Sumber data |
| `pickup` | relation | → `pickups` (single) | Referensi penjemputan |
| `co2_saved` | number | - | Kg CO2 yang berhasil dikurangi |
| `waste_diverted` | number | - | Kg limbah yang tidak jadi dibuang |
| `economic_value` | number | - | Nilai rupiah yang tercipta dari limbah |
| `period` | text | - | Periode (misal: "2026-02") |

**PocketBase API Rules:**
- **List/View:** `""` (publik untuk dashboard Enabler)
- **Create/Update:** hanya via Hook (backend-only)

**PocketBase Hook (Auto-calculate):**
- Trigger: setelah `pickups.status` = `completed`
- Rumus: `co2_saved = weight_verified * wood_type.carbon_factor`

---

## 13. Koleksi: `chats` (Base Collection — Komunikasi)

Pesan instan antar pengguna.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `sender` | relation | → `users` (single, required) | Pengirim |
| `receiver` | relation | → `users` (single, required) | Penerima |
| `message` | text | required | Isi pesan |
| `is_read` | bool | default: `false` | Status baca |
| `attachment` | file | max 1 file | Lampiran (foto/dokumen) |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id = sender || @request.auth.id = receiver`
- **Create:** `@request.auth.id != ""`
- **Update:** `@request.auth.id = receiver` (hanya untuk toggle `is_read`)
- **Delete:** `@request.auth.id = sender`

**PocketBase Realtime:**
- Gunakan **Realtime Subscriptions** pada koleksi `chats` untuk notifikasi chat masuk.

---

## 14. Koleksi: `notifications` (Base Collection)

Notifikasi sistem ke pengguna.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `user` | relation | → `users` (single, required) | Penerima notifikasi |
| `title` | text | required | Judul notifikasi |
| `body` | text | required | Isi notifikasi |
| `type` | select | `order`, `pickup`, `payment`, `system`, `promo` | Kategori |
| `is_read` | bool | default: `false` | Status baca |
| `reference_type` | text | - | Collection name terkait |
| `reference_id` | text | - | Record ID terkait |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id = user`
- **Create:** hanya via Hook (backend-only)
- **Update:** `@request.auth.id = user` (toggle `is_read`)
- **Delete:** `@request.auth.id = user`

---

## 15. Koleksi: `design_recipes` (Base Collection — Klinik Desain)

Pustaka inspirasi/resep desain produk dari limbah.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `title` | text | required | Judul resep desain |
| `description` | text | - | Langkah-langkah pembuatan |
| `suitable_wood_types` | relation | → `wood_types` (multiple) | Jenis kayu yang cocok |
| `suitable_forms` | select (multiple) | `offcut_large`, `offcut_small`, `shaving`, `sawdust`, `logs_end` | Bentuk limbah yang cocok |
| `photos` | file | image, max 5 files | Foto contoh hasil |
| `author` | relation | → `users` (single) | Penulis (Converter/Desainer) |
| `difficulty` | select | `easy`, `medium`, `hard` | Tingkat kesulitan |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id != ""`
- **Create/Update/Delete:** `@request.auth.role = "converter" || @request.auth.role = "enabler"`

---

## 16. Koleksi: `bids` (Base Collection — Lelang/Bidding)

Penawaran harga oleh Aggregator terhadap listing limbah.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `bidder` | relation | → `users` (single, required) | Aggregator yang menawar |
| `waste_listing` | relation | → `waste_listings` (single, required) | Limbah yang ditawar |
| `bid_amount` | number | required, min: 0 | Jumlah tawaran (Rp) |
| `message` | text | - | Pesan/catatan dari bidder |
| `status` | select | `pending`, `accepted`, `rejected`, `expired` — default: `pending` | Status bid |

**PocketBase API Rules:**
- **List/View:** `@request.auth.id = bidder || @request.auth.id = waste_listing.generator`
- **Create:** `@request.auth.role = "aggregator"`
- **Update:** `@request.auth.id = waste_listing.generator` (accept/reject)
- **Delete:** `@request.auth.id = bidder && status = "pending"`

**PocketBase Hook (After Update, status = "accepted"):**
- Auto-create `pickups` record
- Set `waste_listing.status` → `booked`
- Reject semua bid lain pada listing yang sama

---

## 17. Koleksi: `generator_products` (Base Collection — Produk Furniture Generator)

Produk jadi (mebel/furniture) yang dijual langsung oleh Generator. Terpisah dari `products` milik Converter.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `generator` | relation | → `users` (single, required, cascadeDelete) | Pembuat/penjual produk |
| `name` | text | required | Nama produk (misal: "Lemari Jati 2 Pintu") |
| `description` | text | - | Deskripsi produk |
| `category` | select | `furniture`, `custom_order`, `raw_material`, `other` | Kategori |
| `price` | number | required | Harga jual |
| `stock` | number | default: 0 | Jumlah stok |
| `photos` | file | image, max 5 files | Galeri foto produk |
| `wood_type` | relation | → `wood_types` (single) | Jenis kayu utama |
| `status` | select | `active`, `sold_out`, `draft` — default: `active` | Status listing |

**PocketBase API Rules:**
- **List/View:** `""` (publik)
- **Create/Update/Delete:** `@request.auth.id = generator`

---

## Diagram Relasi Antar-Koleksi

```
                         ┌──────────────┐
                         │  wood_types   │
                         │ (Master Data) │
                         └──────┬───────┘
                     ┌──────────┼───────────┬──────────────┐
                     ▼          ▼           ▼              ▼
              ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌────────────────┐
              │raw_timber│ │  waste   │ │   design     │ │ generator      │
              │_listings │ │_listings │ │  _recipes    │ │ _products      │
              └────┬─────┘ └────┬─────┘ └──────────────┘ └────────────────┘
                   │            │
         users     │   users    │
        (supplier) │ (generator)│
                   │            │
                   │            ├──────────────┐
                   │            ▼              ▼
                   │     ┌──────────┐   ┌──────────┐
                   │     │ pickups  │   │   bids   │
                   │     │          │───(aggregator)
                   │     └────┬─────┘   └──────────┘
                   │          │
                   │          ▼
                   │  ┌───────────────┐
                   │  │  warehouse    │
                   │  │  _inventory   │
                   │  └───────┬───────┘
                   │          │
                   │          ▼
                   │  ┌───────────────────┐
                   │  │  marketplace      │
                   │  │  _transactions    │
                   │  └───────┬───────────┘
                   │          │
                   │          ▼
                   │  ┌──────────┐
                   │  │ products │───users (converter)
                   │  └────┬─────┘
                   │       │
                   │       ▼
                   │  ┌──────────┐
                   │  │  orders  │───users (buyer)
                   │  └──────────┘
                   │
            ┌──────┴──────┐  ┌──────────────────┐  ┌──────────────┐
            │ cart_items   │  │impact_metrics    │  │notifications │
            └─────────────┘  └──────────────────┘  └──────────────┘
            ┌─────────────┐  ┌──────────────────┐
            │   chats     │  │wallet_transactions│
            └─────────────┘  └──────────────────┘
```

---

## Rangkuman Koleksi (17 Total)

| # | Koleksi | Tipe PocketBase | Aktor Utama |
| :--- | :--- | :--- | :--- |
| 1 | `users` | Auth Collection | Semua |
| 2 | `wood_types` | Base Collection | Read-only |
| 3 | `raw_timber_listings` | Base Collection | Supplier |
| 4 | `waste_listings` | Base Collection | Generator |
| 5 | `pickups` | Base Collection | Aggregator |
| 6 | `warehouse_inventory` | Base Collection | Aggregator |
| 7 | `marketplace_transactions` | Base Collection | Converter ↔ Aggregator |
| 8 | `products` | Base Collection | Converter |
| 9 | `orders` | Base Collection | Buyer ↔ Converter |
| 10 | `cart_items` | Base Collection | Buyer |
| 11 | `wallet_transactions` | Base Collection | Semua |
| 12 | `impact_metrics` | Base Collection | Enabler (view) / Hook (create) |
| 13 | `chats` | Base Collection | Semua |
| 14 | `notifications` | Base Collection | Semua |
| 15 | `design_recipes` | Base Collection | Converter / Enabler |
| 16 | `bids` | Base Collection | Aggregator ↔ Generator |
| 17 | `generator_products` | Base Collection | Generator |
