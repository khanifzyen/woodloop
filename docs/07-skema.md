# Skema Database WoodLoop (PocketBase)

Dokumen ini merinci rancangan koleksi (tables) dan relasi database untuk platform **WoodLoop**. Skema ini dirancang untuk mendukung sistem multi-peran, pelacakan (traceability), dan ekonomi sirkular.

---

## 1. Koleksi: `users` (System)
Ekstensi dari koleksi bawaan PocketBase untuk mengelola berbagai peran pengguna.

| Field Name | Type | Options / Validation | Description |
| :--- | :--- | :--- | :--- |
| `username` | text | unique | ID unik pengguna |
| `email` | email | unique, required | Email login |
| `password` | password | required | Password login |
| `name` | text | required | Nama lengkap atau nama pemilik |
| `avatar` | file | image | Foto profil |
| `role` | select | `supplier`, `generator`, `aggregator`, `converter`, `enabler`, `buyer` | Peran utama pengguna |
| `workshop_name` | text | - | Nama bengkel/perusahaan/toko |
| `address` | text | - | Alamat lengkap fisik |
| `location_lat` | number | - | Koordinat Lintang (untuk peta) |
| `location_lng` | number | - | Koordinat Bujur (untuk peta) |
| `phone` | text | - | Nomor WhatsApp/Telepon |
| `is_verified` | bool | default: `false` | Status verifikasi legalitas (SVLK/FSC) |
| `bio` | text | - | Deskripsi singkat profil |

---

## 2. Koleksi: `wood_types` (Master Data)
Referensi jenis kayu untuk standarisasi data di seluruh platform.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `name` | text | Contoh: Jati, Mahoni, Trembesi, Mindi, Akasia |
| `carbon_factor` | number | Faktor konversi untuk perhitungan dampak CO2 |

---

## 3. Koleksi: `waste_listings` (Hulu - Generator)
Data limbah yang diunggah oleh pengrajin (Generator) untuk dijual atau dijemput.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `generator` | relation | `users.id` | Pemilik limbah |
| `wood_type` | relation | `wood_types.id` | Jenis kayu limbah |
| `form` | select | `offcut`, `shaving`, `sawdust`, `logs_end` | Bentuk (potongan, serutan, serbuk, dll) |
| `volume` | number | required | Jumlah kuantitas |
| `unit` | select | `kg`, `m3`, `sack`, `pickup` | Satuan jumlah |
| `photo` | file | image (multiple) | Foto tumpukan limbah |
| `price_estimate` | number | - | Perkiraan harga (bisa 0 jika gratis) |
| `status` | select | `available`, `booked`, `collected`, `sold` | Status ketersediaan limbah |
| `description` | text | - | Catatan tambahan (misal: "kondisi kering") |

---

## 4. Koleksi: `pickups` (Logistik - Aggregator)
Data transaksi penjemputan limbah dari Generator ke Aggregator.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `aggregator` | relation | `users.id` | Pengepul yang menjemput |
| `waste_listing` | relation | `waste_listings.id` | Referensi limbah yang diambil |
| `scheduled_date` | date | - | Tanggal rencana penjemputan |
| `actual_date` | date | - | Tanggal aktual penjemputan |
| `status` | select | `pending`, `on_the_way`, `completed`, `cancelled` | Status proses logistik |
| `weight_verified` | number | - | Berat/volume hasil timbangan aggregator |
| `pickup_photo` | file | image | Bukti foto saat serah terima |

---

## 5. Koleksi: `products` (Hilir - Converter)
Produk jadi yang dibuat dari bahan daur ulang oleh Converter.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `converter` | relation | `users.id` | Pengrajin pembuat produk |
| `name` | text | required | Nama produk jadi |
| `description` | text | - | Cerita/deskripsi produk |
| `price` | number | required | Harga jual |
| `stock` | number | - | Jumlah stok tersedia |
| `photos` | file | image (multiple) | Galeri foto produk |
| `source_pickups` | relation | `pickups.id` (multiple) | Relasi ke sumber bahan (untuk Traceability) |
| `qr_code_id` | text | unique | ID unik untuk akses halaman traceability publik |

---

## 6. Koleksi: `orders` (Transaksi - Buyer)
Pembelian produk jadi oleh konsumen akhir.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `buyer` | relation | `users.id` | Pembeli |
| `product` | relation | `products.id` | Produk yang dibeli |
| `quantity` | number | - | Jumlah beli |
| `total_price` | number | - | Total harga |
| `status` | select | `payment_pending`, `processing`, `shipped`, `received` | Status pesanan |
| `shipping_address` | text | - | Alamat pengiriman |

---

## 7. Koleksi: `impact_metrics` (Data Enabler)
Pencatatan statistik dampak lingkungan secara berkala atau per kejadian.

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `related_listing` | relation | `waste_listings.id` | Sumber data dampak |
| `co2_saved` | number | - | Kg CO2 yang berhasil dikurangi |
| `waste_diverted` | number | - | Kg/M3 limbah yang tidak jadi dibuang |
| `economic_value` | number | - | Nilai rupiah yang tercipta dari limbah |

---

## 8. Koleksi: `chats` (Fitur Komunikasi)
Pesan instan antar peran (misal: Aggregator bertanya lokasi ke Generator).

| Field Name | Type | Options / Relation | Description |
| :--- | :--- | :--- | :--- |
| `sender` | relation | `users.id` | Pengirim |
| `receiver` | relation | `users.id` | Penerima |
| `message` | text | - | Isi pesan |
| `is_read` | bool | default: `false` | Status baca |

---

## Logika Relasi Traceability (Jejak Kayu)

Sistem Traceability bekerja dengan menelusuri relasi balik (*reverse relation*):
1. **QR Code Scan** pada Produk -> Mengambil data `products`.
2. Dari `products` -> Melihat `source_pickups`.
3. Dari `pickups` -> Melihat `waste_listings`.
4. Dari `waste_listings` -> Melihat `generator` (pengrajin asal) dan `wood_type`.
5. Hasil akhirnya adalah laporan: *"Produk ini dibuat oleh [Converter] menggunakan [Jenis Kayu] seberat [Volume] yang berasal dari sisa produksi [Generator] dan dikumpulkan oleh [Aggregator]"*.
