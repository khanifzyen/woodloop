# Aturan Tracking ID (Traceability) - Sistem WoodLoop

Dokumen ini merinci standar penamaan dan pembuatan **Tracking ID** (Kode Lacak) unik untuk setiap item fisik yang beredar di dalam ekosistem WoodLoop. Tracking ID ini akan digunakan untuk meng-generate QR Code guna keperluan *Supply Chain Traceability*.

## 1. Pendekatan: Semi-Semantik + Timestamp

Untuk mencegah bentrok data (collision) tanpa membebani database dengan sistem antrean/urutan (sequence), WoodLoop menggunakan pendekatan **Semi-Semantik + Timestamp**.

**Format Dasar:**
`[KATEGORI]-[ID_PENGGUNA]-[YYMMDD]-[ACAK]`

### Rincian Komponen
1. **[KATEGORI]** (3-4 Karakter)
   Penanda jenis item fisik.
   - `LOG`: Kayu Gelondongan (Raw Timber - Log)
   - `SWN`: Kayu Gergajian (Raw Timber - Sawn)
   - *(Akan ditambahkan nanti: Mebel, Produk Upcycle, Limbah, dll)*

2. **[ID_PENGGUNA]** (Unik)
   Singkatan unik milik aktor yang mendaftarkan item tersebut ke dalam sistem.
   - Contoh: `JEP01` (Supplier "Jepara Supplier")
   - *Kode ini di-generate secara otomatis 1x saat user mendaftar akun.*

3. **[YYMMDD]** (6 Digit)
   Tanggal saat item direkam ke dalam database berdasarkan jam server (UTC).
   - Format: Tahun (2 digit), Bulan (2 digit), Tanggal (2 digit).
   - Contoh: `260310` (10 Maret 2026).

4. **[ACAK]** (3 Karakter Alfanumerik)
   Tiga karakter acak (Kombinasi huruf kapital A-Z dan angka 2-9, hindari karakter mirip seperti O/0/1/I untuk mencegah kebingungan visual pengguna).
   - Contoh: `A7X`
   - *Berfungsi memastikan tidak ada kode kembar meskipun 1 supplier yang sama mengunggah ratusan kayu/item di hari yang sama.*

### Contoh Hasil Akhir
- **LOG-JEP01-260310-A7X** (Item berwujud Kayu Gelondongan dari Supplier JEP01, didata pada 10 Mar 2026)
- **SWN-JEP01-260310-B9K** (Item berwujud Kayu Gergajian dari Supplier JEP01, didata pada 10 Mar 2026)

---

## 2. Perubahan Skema Database Pendukung

Agar sistem pelacakan ini dapat berjalan otomatis dan terpusat di *backend/server* PocketBase, berikut adalah rancangan perubahan skema (*schema*) database yang akan diimplementasikan berikutnya:

### A. Collection: `users`
Penambahan 1 field baru untuk menampung singkatan permanen/unik tiap *user*.
- **Nama Field:** `user_code` 
- **Tipe:** `Text`
- **Aturan Tambahan:** 
  - `Unique` (Tidak boleh ada 2 pengguna dengan kode yang sama).
  - Wajib digenerate dan dikunci/diisi saat proses pendaftaran (registrasi) akun pertama kali berhasil.

### B. Collection: `raw_timber_listings`
Penambahan 1 field baru untuk memegang Tracking ID/QR Code final dari masing-masing kayu.
- **Nama Field:** `tracking_id`
- **Tipe:** `Text`
- **Aturan Tambahan:**
  - `Unique` (Tidak boleh ada 2 listing/kayu dengan tracking ID yang kembar).
  - Bertindak sebagai kunci unik yang bisa di-scan/difilter oleh aplikasi.

---

## 3. Alur Kerja (Workflow) Pembuatan Kode

Keamanan: Pembuatan logika Tracking ID **JANGAN** pernah dilakukan di sisi *Frontend* (Aplikasi Flutter) untuk mencegah perbedaan zona waktu perangkat pengguna, potensi *race condition*, maupun manipulasi kode secara disengaja.

Semua Tracking ID wajib digenerate murni melalui siklus **PocketBase Hooks (JavaScript backend)**.

**Alur Teknis Pendaftaran Raw Timber:**
1. Supplier menekan tombol **"Simpan Draft"** atau **"Publish"** di formulir aplikasi Flutter.
2. Flutter API call mengirim *payload* data (dimensi, status, harga, spesies, bentuk, dll) KE PocketBase.
3. Di dalam server PocketBase, berkas *Hook* `onRecordBeforeCreateRequest` (pada folder `pb_hooks`) di-trigger **sebelum** data tertulis ke database:
   - Hook mengecek isi field input `shape` pada payload (misal isinya "log") ➡ Menetapkan Prefix `LOG`.
   - Hook mencari profil `users` berdasarkan ID pengunggah ➡ Mengambil nilai `user_code` miliknya (misal `JEP01`).
   - Hook mengambil tanggal/waktu server saat itu ➡ Memformat ke `YYMMDD` (misal `260310`).
   - Hook secara acak men-generate 3 karakter tambahan ➡ Misal `A7X`.
   - Hook merangkainya menjadi satu string utuh: `LOG-JEP01-260310-A7X`.
   - Hook menyuntikkan (inject) string tersebut secara paksa ke field `tracking_id` dari *record payload* yang baru masuk tersebut.
4. Data listing disimpan secara permanen di database PocketBase lengkap dengan field `tracking_id`-nya, siap diunduh kembali oleh Flutter dan di-render sebagai QR Code.

*(Catatan: Aturan prefix/kategori untuk limbah, produk mebel, dan kreasi upcycle akan diperbarui di versi dokumen masa mendatang seiring terselesaikannya fitur-fitur tersebut).*
