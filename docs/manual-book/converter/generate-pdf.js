const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname);
const OUTPUT = path.join(__dirname, "Manual-Book-Converter-WoodLoop.pdf");
const SCREENSHOTS_DIR = path.join(__dirname, "..", "screenshots");

const SCREENSHOTS = {
  "18-converter-dashboard.png": path.join(SCREENSHOTS_DIR, "18-converter-dashboard.png"),
  "19-converter-marketplace-materials.png": path.join(SCREENSHOTS_DIR, "19-converter-marketplace-materials.png"),
  "20-converter-catalog.png": path.join(SCREENSHOTS_DIR, "20-converter-catalog.png"),
  "21-converter-design-clinic.png": path.join(SCREENSHOTS_DIR, "21-converter-design-clinic.png"),
};

function imgTag(filename, caption) {
  const p = SCREENSHOTS[filename];
  if (!p || !fs.existsSync(p)) return `<p style="color:#999;font-style:italic">[Screenshot: ${caption}]</p>`;
  return `<figure>
    <img src="file://${p}" style="max-width:100%;border:1px solid #ddd;border-radius:4px;" />
    <figcaption style="text-align:center;font-size:12px;color:#666;margin-top:4px;">${caption}</figcaption>
  </figure>`;
}

const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Manual Book WoodLoop — Converter</title>
<style>
  @page { margin: 2cm 2.5cm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.6; color: #222; max-width: 720px; margin: 0 auto; padding: 20px; }
  h1 { font-size: 22pt; color: #1a5c2a; border-bottom: 2px solid #1a5c2a; padding-bottom: 6px; margin-top: 30px; }
  h2 { font-size: 16pt; color: #2d7d41; margin-top: 24px; }
  h3 { font-size: 13pt; color: #333; margin-top: 18px; }
  h4 { font-size: 11pt; color: #555; margin-top: 14px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11pt; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
  th { background: #e8f5e9; }
  figure { margin: 16px 0; text-align: center; }
  pre, code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; font-size: 10pt; }
  pre { padding: 10px; overflow-x: auto; }
  blockquote { border-left: 4px solid #1a5c2a; margin: 12px 0; padding: 8px 16px; background: #f9fdf9; }
  .page-break { page-break-before: always; }
  .cover { text-align: center; padding-top: 120px; }
  .cover h1 { font-size: 28pt; border: none; }
  .cover h2 { font-size: 18pt; color: #555; }
  .cover hr { width: 50%; margin: 20px auto; }
  .toc a { color: #1a5c2a; text-decoration: none; }
  .toc ul { list-style: none; padding-left: 0; }
  .toc ul ul { padding-left: 20px; }
  .toc li { margin: 4px 0; }
  .note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 8px 14px; margin: 10px 0; font-size: 11pt; }
  .warn { background: #f8d7da; border-left: 4px solid #dc3545; padding: 8px 14px; margin: 10px 0; font-size: 11pt; }
  .tip { background: #d4edda; border-left: 4px solid #28a745; padding: 8px 14px; margin: 10px 0; font-size: 11pt; }
  .ascii-box { font-family: 'Courier New', monospace; font-size: 10pt; line-height: 1.3; background: #f4f4f4; padding: 8px; border-radius: 4px; }
</style>
</head>
<body>

<!-- ============ COVER ============ -->
<div class="cover" style="page-break-after: always;">
  <h1>🌳 WoodLoop</h1>
  <h2>Manual Book — Converter</h2>
  <p style="font-size:14pt;color:#666;">Panduan Lengkap Pengrajin Kreatif & Produk Upcycled</p>
  <br/><br/>
  <p><strong>Versi 1.0 — Juni 2026</strong></p>
  <hr/>
  <p><em>"Mengubah Limbah Kayu Menjadi Berkah untuk Jepara"</em></p>
  <br/><br/><br/>
  <table style="width:auto;margin:0 auto;">
    <tr><td><strong>Peran</strong></td><td>Converter (Pengrajin Kreatif)</td></tr>
    <tr><td><strong>Platform</strong></td><td>Web</td></tr>
    <tr><td><strong>Backend</strong></td><td>PocketBase</td></tr>
  </table>
  <br/>
  <p style="font-size:10pt;color:#999;">woodloop.pasarjepara.com</p>
</div>

<!-- ============ KATA PENGANTAR ============ -->
<div class="page-break"></div>
<h1>Kata Pengantar</h1>
<p>Puji syukur kehadirat Tuhan Yang Maha Esa atas terselesaikannya <strong>Manual Book WoodLoop — Panduan Khusus Converter</strong>.</p>
<p>Manual book ini disusun khusus untuk pengguna dengan peran <strong>Converter (Pengrajin Kreatif)</strong> dalam ekosistem WoodLoop. Sebagai inti kreatif dari ekonomi sirkular industri kayu Jepara, Converter memegang peranan vital — membeli bahan limbah dari Aggregator, mengolahnya menjadi produk upcycled bernilai jual tinggi, dan menjualnya ke Buyer melalui platform.</p>
<p>Buku ini membahas secara detail seluruh fitur yang tersedia untuk Converter, mulai dari:</p>
<ul>
  <li><strong>Dashboard</strong> — ringkasan bisnis kreatif Anda</li>
  <li><strong>Pasar Bahan</strong> — marketplace bahan limbah dari Aggregator</li>
  <li><strong>Checkout &amp; Pembelian</strong> — proses membeli bahan baku</li>
  <li><strong>Riwayat Transaksi</strong> — lacak semua pembelian</li>
  <li><strong>Katalog Produk</strong> — kelola produk upcycled &amp; QR Code</li>
  <li><strong>Buat Produk Upcycled</strong> — daftarkan produk baru dengan traceability</li>
  <li><strong>Klinik Desain</strong> — inspirasi dan resep desain produk</li>
</ul>
<p>Setiap fitur dijelaskan dengan langkah-langkah praktis yang dilengkapi tangkapan layar, sehingga Anda dapat langsung mempraktikkannya.</p>
<p>Kami berharap manual book ini membantu Anda memanfaatkan WoodLoop secara maksimal untuk mengembangkan bisnis upcycling yang lebih transparan, efisien, dan berkelanjutan.</p>
<br/>
<p><strong>Jepara, Juni 2026</strong></p>
<p><strong>Tim WoodLoop</strong></p>

<!-- ============ DAFTAR ISI ============ -->
<div class="page-break"></div>
<h1>Daftar Isi</h1>
<div class="toc">
  <ul>
    <li><a href="#bab1">Bab 1: Pendahuluan</a>
      <ul>
        <li>1.1 Apa Itu WoodLoop?</li>
        <li>1.2 Peran Converter dalam Ekosistem</li>
        <li>1.3 Alur Bisnis Converter</li>
        <li>1.4 Istilah Penting</li>
      </ul>
    </li>
    <li><a href="#bab2">Bab 2: Memulai</a>
      <ul>
        <li>2.1 Akses ke Aplikasi</li>
        <li>2.2 Login</li>
        <li>2.3 Navigasi Antarmuka</li>
        <li>2.4 Mode Gelap &amp; Ganti Bahasa</li>
      </ul>
    </li>
    <li><a href="#bab3">Bab 3: Dashboard Converter</a>
      <ul>
        <li>3.1 Ringkasan Kartu</li>
        <li>3.2 Transaksi Terbaru</li>
        <li>3.3 Menu Cepat</li>
      </ul>
    </li>
    <li><a href="#bab4">Bab 4: Pasar Bahan (Marketplace)</a>
      <ul>
        <li>4.1 Melihat Pasar Bahan</li>
        <li>4.2 Filter &amp; Pencarian</li>
        <li>4.3 Detail Bahan</li>
      </ul>
    </li>
    <li><a href="#bab5">Bab 5: Checkout &amp; Pembelian</a>
      <ul>
        <li>5.1 Memulai Checkout</li>
        <li>5.2 Ringkasan Pesanan</li>
        <li>5.3 Metode Pembayaran</li>
        <li>5.4 Konfirmasi Pembelian</li>
      </ul>
    </li>
    <li><a href="#bab6">Bab 6: Riwayat Transaksi</a>
      <ul>
        <li>6.1 Daftar Transaksi</li>
        <li>6.2 Status Transaksi</li>
      </ul>
    </li>
    <li><a href="#bab7">Bab 7: Katalog Produk &amp; QR Code</a>
      <ul>
        <li>7.1 Katalog Produk</li>
        <li>7.2 Status Produk</li>
        <li>7.3 QR Code Produk</li>
        <li>7.4 Hapus Produk</li>
      </ul>
    </li>
    <li><a href="#bab8">Bab 8: Membuat Produk Upcycled</a>
      <ul>
        <li>8.1 Form Produk Baru</li>
        <li>8.2 Source Materials untuk Traceability</li>
        <li>8.3 Kategori Produk</li>
        <li>8.4 Edit Produk</li>
      </ul>
    </li>
    <li><a href="#bab9">Bab 9: Klinik Desain</a>
      <ul>
        <li>9.1 Inspirasi Desain</li>
        <li>9.2 Filter Resep Desain</li>
      </ul>
    </li>
    <li><a href="#bab10">Bab 10: Troubleshooting</a>
      <ul>
        <li>10.1 Tidak Bisa Login</li>
        <li>10.2 Bahan Tidak Muncul di Pasar</li>
        <li>10.3 Checkout Gagal</li>
        <li>10.4 QR Code Tidak Muncul</li>
        <li>10.5 Kontak Bantuan</li>
      </ul>
    </li>
  </ul>
</div>

<!-- ============ BAB 1 ============ -->
<div class="page-break"></div>
<h1 id="bab1">Bab 1: Pendahuluan</h1>

<h2>1.1 Apa Itu WoodLoop?</h2>
<p><strong>WoodLoop</strong> adalah platform digital ekonomi sirkular untuk industri kayu dan furnitur di Jepara, Jawa Tengah. Platform ini menghubungkan seluruh aktor dalam rantai nilai kayu — dari pemasok kayu gelondongan, pengrajin yang menghasilkan limbah, pengepul, pengrajin upcycle, pembeli, hingga pemerintah — dalam satu ekosistem terpadu.</p>
<p>Tujuan utama WoodLoop adalah <strong>mengubah limbah kayu menjadi sumber daya bernilai ekonomi</strong> sekaligus melacak dampak lingkungannya.</p>

<h2>1.2 Peran Converter dalam Ekosistem</h2>
<p><strong>Converter</strong> adalah pihak yang <strong>mengolah limbah kayu</strong> menjadi produk baru yang bernilai jual (<em>upcycling</em>). Converter menjadi <strong>inti kreatif</strong> dari ekonomi sirkular WoodLoop.</p>
<p><strong>Contoh pengguna Converter:</strong></p>
<ul>
  <li>Pengrajin kreatif di Jepara</li>
  <li>Startup daur ulang kayu</li>
  <li>Desainer produk</li>
  <li>Workshop inovatif</li>
</ul>
<p><strong>Alur peran Converter dalam ekosistem WoodLoop:</strong></p>
<pre>Supplier → Generator → Aggregator → (bahan limbah) → Converter → (produk upcycled) → Buyer
                                                           ↓
                                                    (traceability & QR)</pre>

<p><strong>Converter memiliki tiga aktivitas utama:</strong></p>
<ol>
  <li><strong>Membeli bahan limbah</strong> — Dari Aggregator melalui Pasar Bahan</li>
  <li><strong>Membuat produk upcycled</strong> — Mengolah limbah menjadi produk bernilai</li>
  <li><strong>Menjual ke Buyer</strong> — Produk dilengkapi QR Code traceability</li>
</ol>

<h2>1.3 Alur Bisnis Converter</h2>
<table>
  <tr><th>Langkah</th><th>Aktivitas</th><th>Halaman</th></tr>
  <tr><td>1</td><td>Login ke akun Converter</td><td>/login</td></tr>
  <tr><td>2</td><td>Melihat ringkasan bisnis</td><td>/converter/dashboard</td></tr>
  <tr><td>3</td><td>Mencari bahan limbah di Pasar Bahan</td><td>/converter/marketplace/materials</td></tr>
  <tr><td>4</td><td>Checkout &amp; membeli bahan</td><td>/converter/checkout</td></tr>
  <tr><td>5</td><td>Melihat riwayat transaksi</td><td>/converter/marketplace/history</td></tr>
  <tr><td>6</td><td>Membuat produk upcycled baru</td><td>/converter/catalog/new</td></tr>
  <tr><td>7</td><td>Mengelola katalog produk &amp; QR Code</td><td>/converter/catalog</td></tr>
  <tr><td>8</td><td>Mendapatkan inspirasi desain</td><td>/designer/design-clinic</td></tr>
</table>

<h2>1.4 Istilah Penting</h2>
<table>
  <tr><th>Istilah</th><th>Arti</th></tr>
  <tr><td>Upcycling</td><td>Mengolah limbah menjadi produk bernilai lebih tinggi</td></tr>
  <tr><td>Bahan Limbah</td><td>Material sisa produksi yang dibeli dari Aggregator</td></tr>
  <tr><td>Pasar Bahan</td><td>Marketplace bahan limbah dari Aggregator</td></tr>
  <tr><td>Marketplace Transaction</td><td>Transaksi pembelian bahan antara Converter dan Aggregator</td></tr>
  <tr><td>QR Code ID</td><td>Kode unik untuk traceability produk (format: PRD-XXXXXXXX)</td></tr>
  <tr><td>Traceability</td><td>Jejak asal-usul produk dari hulu ke hilir</td></tr>
  <tr><td>Source Materials</td><td>Transaksi bahan baku yang dihubungkan ke produk</td></tr>
  <tr><td>Design Recipe</td><td>Resep dan panduan desain produk dari limbah</td></tr>
  <tr><td>Klinik Desain</td><td>Pusat inspirasi dan resep desain untuk Converter</td></tr>
  <tr><td>Warehouse Inventory</td><td>Stok bahan limbah di gudang Aggregator yang siap dijual</td></tr>
</table>

<!-- ============ BAB 2 ============ -->
<div class="page-break"></div>
<h1 id="bab2">Bab 2: Memulai</h1>

<h2>2.1 Akses ke Aplikasi</h2>
<p>WoodLoop dapat diakses melalui browser web di alamat:</p>
<pre>https://woodloop.pasarjepara.com</pre>
<p><strong>Persyaratan sistem:</strong></p>
<ul>
  <li>Browser modern (Chrome, Firefox, Edge, Safari)</li>
  <li>Koneksi internet yang stabil</li>
  <li>Akun Converter yang sudah terdaftar</li>
</ul>

<h2>2.2 Login</h2>
<ol>
  <li>Buka halaman utama WoodLoop</li>
  <li>Klik tombol <strong>"Lanjut"</strong> pada layar onboarding</li>
  <li>Pilih peran <strong>"Converter"</strong> pada layar pemilihan peran</li>
  <li>Klik <strong>"Konfirmasi"</strong></li>
  <li>Pada halaman login, masukkan email dan kata sandi</li>
  <li>Klik tombol <strong>"Masuk"</strong></li>
</ol>
<div class="note"><strong>Lupa Kata Sandi?</strong> Klik tautan "Lupa Kata Sandi?" di halaman login dan ikuti petunjuk untuk mereset kata sandi melalui email.</div>

<h2>2.3 Navigasi Antarmuka</h2>
${imgTag("18-converter-dashboard.png", "Gambar 2.1 — Dashboard Converter setelah login")}
<p>Setelah login, Anda akan melihat <strong>sidebar navigasi</strong> di sebelah kiri dengan menu berikut:</p>
<table>
  <tr><th>Menu</th><th>Ikon</th><th>Halaman</th><th>Fungsi</th></tr>
  <tr><td>Dashboard</td><td>📊</td><td>/converter/dashboard</td><td>Ringkasan bisnis kreatif</td></tr>
  <tr><td>Pasar Bahan</td><td>🏪</td><td>/converter/marketplace/materials</td><td>Marketplace bahan limbah</td></tr>
  <tr><td>Katalog Produk</td><td>📦</td><td>/converter/catalog</td><td>Kelola produk upcycled &amp; QR</td></tr>
  <tr><td>Klinik Desain</td><td>📖</td><td>/designer/design-clinic</td><td>Inspirasi &amp; resep desain</td></tr>
</table>

<h3>Elemen Antarmuka Lainnya</h3>
<table>
  <tr><th>Elemen</th><th>Lokasi</th><th>Fungsi</th></tr>
  <tr><td>Breadcrumb</td><td>Atas halaman</td><td>Menunjukkan posisi halaman saat ini</td></tr>
  <tr><td>Notifikasi</td><td>Ikon lonceng</td><td>Pemberitahuan sistem</td></tr>
  <tr><td>Akun</td><td>Kanan atas (inisial)</td><td>Menu profil, logout</td></tr>
  <tr><td>Mode Gelap</td><td>Atas</td><td>Toggle tema terang/gelap</td></tr>
  <tr><td>Ganti Bahasa</td><td>Atas</td><td>Switch Indonesia/English</td></tr>
</table>
<div class="warn"><strong>Penting:</strong> Menu navigasi hanya menampilkan fitur yang relevan dengan peran Converter. Setiap peran memiliki menu yang berbeda.</div>

<h2>2.4 Mode Gelap &amp; Ganti Bahasa</h2>
<p>Klik tombol <strong>"Mode Gelap"</strong> di bagian atas halaman untuk beralih antara tema terang dan gelap. Klik tombol <strong>"Ganti Bahasa"</strong> untuk beralih antara Bahasa Indonesia dan English. Pengaturan akan tersimpan secara otomatis untuk kunjungan berikutnya.</p>

<!-- ============ BAB 3 ============ -->
<div class="page-break"></div>
<h1 id="bab3">Bab 3: Dashboard Converter</h1>
<p>Dashboard Converter adalah halaman utama yang muncul setelah login. Di sini Anda dapat melihat ringkasan bisnis kreatif secara sekilas.</p>
${imgTag("18-converter-dashboard.png", "Gambar 3.1 — Dashboard Converter")}

<h2>3.1 Ringkasan Kartu (Summary Cards)</h2>
<table>
  <tr><th>Kartu</th><th>Ikon</th><th>Menampilkan</th></tr>
  <tr><td>Bahan Dibeli</td><td>🛒</td><td>Total bahan limbah yang sudah dibeli</td></tr>
  <tr><td>Produk Dibuat</td><td>🎨</td><td>Jumlah produk upcycled yang sudah dibuat</td></tr>
  <tr><td>Total Investasi</td><td>💰</td><td>Total dana yang diinvestasikan untuk bahan baku (Rp)</td></tr>
  <tr><td>Desain Tersedia</td><td>📖</td><td>Jumlah desain/resep yang tersedia di Klinik Desain</td></tr>
</table>

<h2>3.2 Transaksi Terbaru</h2>
<p>Di bawah ringkasan kartu, terdapat daftar <strong>Transaksi Terbaru</strong> yang menampilkan riwayat pembelian bahan terakhir.</p>
<p>Setiap item transaksi menampilkan: jumlah total (Rp), status transaksi, dan tanggal. Jika belum ada transaksi, akan tampil pesan "Belum ada transaksi".</p>

<h2>3.3 Menu Cepat (Quick Actions)</h2>
<table>
  <tr><th>Tombol</th><th>Fungsi</th><th>Tujuan</th></tr>
  <tr><td>Cari Bahan</td><td>Membuka Pasar Bahan</td><td>/converter/marketplace/materials</td></tr>
  <tr><td>Buat Produk</td><td>Membuka form produk baru</td><td>/converter/catalog/new</td></tr>
</table>

<!-- ============ BAB 4 ============ -->
<div class="page-break"></div>
<h1 id="bab4">Bab 4: Pasar Bahan (Marketplace)</h1>
<p><strong>Pasar Bahan</strong> adalah marketplace tempat Converter membeli bahan limbah dari Aggregator. Bahan yang tersedia berasal dari inventory gudang Aggregator yang sudah di sortir dan siap dijual.</p>
${imgTag("19-converter-marketplace-materials.png", "Gambar 4.1 — Halaman Pasar Bahan")}

<h2>4.1 Melihat Pasar Bahan</h2>
<p>Setiap bahan ditampilkan dalam bentuk <strong>kartu</strong> berisi informasi lengkap:</p>
<table>
  <tr><th>Info pada Kartu</th><th>Keterangan</th></tr>
  <tr><td>Badge Bentuk</td><td>Bentuk limbah (Offcut Besar, Offcut Kecil, Serutan, Serbuk Gergaji)</td></tr>
  <tr><td>Badge Jenis Kayu</td><td>Nama jenis kayu (Jati, Mahoni, Trembesi, dll)</td></tr>
  <tr><td>Berat Tersedia</td><td>Jumlah stok dalam kg</td></tr>
  <tr><td>Harga/kg</td><td>Harga per kilogram</td></tr>
  <tr><td>Total Harga</td><td>Estimasi total (harga/kg × berat)</td></tr>
  <tr><td>Tombol Beli</td><td>Klik untuk melihat detail dan checkout</td></tr>
</table>
<p>Klik kartu untuk membuka halaman detail bahan.</p>

<h2>4.2 Filter &amp; Pencarian</h2>
<p>Tersedia panel filter yang dapat dibuka dari pojok kanan halaman:</p>
<table>
  <tr><th>Fitur</th><th>Fungsi</th></tr>
  <tr><td>🔍 Pencarian</td><td>Cari bahan berdasarkan jenis kayu atau bentuk</td></tr>
  <tr><td>Filter Jenis Kayu</td><td>Tampilkan hanya jenis kayu tertentu (Jati, Mahoni, dll)</td></tr>
  <tr><td>Filter Bentuk</td><td>Filter: Offcut Besar, Offcut Kecil, Serutan, Serbuk Gergaji</td></tr>
  <tr><td>Filter Harga Min</td><td>Harga minimum per kg</td></tr>
  <tr><td>Filter Harga Max</td><td>Harga maksimum per kg</td></tr>
  <tr><td>Urutkan</td><td>Terbaru, Termurah, Termahal</td></tr>
  <tr><td>Reset</td><td>Kembalikan semua filter ke default</td></tr>
</table>
<div class="tip">Gunakan pencarian dan filter untuk menemukan bahan yang sesuai dengan kebutuhan produksi Anda.</div>

<h2>4.3 Detail Bahan</h2>
<p>Halaman detail bahan (<code>/converter/marketplace/materials/[id]</code>) menampilkan informasi lengkap dalam dua kolom:</p>

<h3>Kolom Kiri: Detail Bahan</h3>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Jenis Kayu</td><td>Nama jenis kayu</td></tr>
  <tr><td>Bentuk</td><td>Bentuk limbah</td></tr>
  <tr><td>Berat</td><td>Berat tersedia dalam kg</td></tr>
  <tr><td>Harga/kg</td><td>Harga per kilogram dalam Rupiah</td></tr>
  <tr><td>Aggregator</td><td>Nama penjual</td></tr>
</table>

<h3>Kolom Kanan: Pembelian</h3>
<p>Menampilkan harga/kg, badge berat tersedia, dan tombol <strong>"Lanjut ke Checkout"</strong> yang mengarah ke halaman checkout.</p>

<!-- ============ BAB 5 ============ -->
<div class="page-break"></div>
<h1 id="bab5">Bab 5: Checkout &amp; Pembelian</h1>
<p>Setelah menemukan bahan yang diinginkan, langkah selanjutnya adalah melakukan checkout dan pembelian.</p>

<h2>5.1 Memulai Checkout</h2>
<p>Dari halaman detail bahan, klik tombol <strong>"Lanjut ke Checkout"</strong> untuk masuk ke halaman checkout: <code>/converter/checkout?material=[id]</code>.</p>

<h2>5.2 Ringkasan Pesanan</h2>
<p>Halaman checkout menampilkan dua kolom. Kolom kiri berisi ringkasan pesanan:</p>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Jenis Kayu</td><td>Nama jenis kayu yang dipilih</td></tr>
  <tr><td>Bentuk</td><td>Bentuk limbah</td></tr>
  <tr><td>Berat Tersedia</td><td>Maksimal berat yang bisa dibeli</td></tr>
  <tr><td>Harga/kg</td><td>Harga per kilogram</td></tr>
  <tr><td>Total</td><td>Harga/kg × quantity (berubah sesuai input)</td></tr>
</table>

<h2>5.3 Metode Pembayaran</h2>
<p>Kolom kanan berisi form pembelian:</p>
<table>
  <tr><th>Field</th><th>Wajib</th><th>Keterangan</th></tr>
  <tr><td>Quantity (kg)</td><td>✅</td><td>Jumlah yang ingin dibeli (min 1, max sesuai stok)</td></tr>
  <tr><td>Metode Pembayaran</td><td>✅</td><td>Pilih metode: Dompet Digital, Transfer Bank, atau COD</td></tr>
</table>

<h3>Metode yang Tersedia</h3>
<table>
  <tr><th>Metode</th><th>Keterangan</th></tr>
  <tr><td>Dompet Digital</td><td>Pembayaran menggunakan saldo dompet WoodLoop</td></tr>
  <tr><td>Transfer Bank</td><td>Pembayaran melalui transfer bank manual</td></tr>
  <tr><td>COD</td><td>Bayar di tempat saat bahan diterima</td></tr>
</table>

<h2>5.4 Konfirmasi Pembelian</h2>
<ol>
  <li>Masukkan <strong>jumlah</strong> (kg) yang ingin dibeli</li>
  <li>Pilih <strong>metode pembayaran</strong></li>
  <li>Periksa total harga yang ditampilkan</li>
  <li>Klik tombol <strong>"Bayar Rp [total]"</strong></li>
</ol>
<p>Setelah berhasil, Anda akan diarahkan ke halaman <strong>Riwayat Transaksi</strong> dengan notifikasi sukses.</p>
<div class="note"><strong>Validasi:</strong> Sistem akan memvalidasi bahwa quantity tidak melebihi stok tersedia. Harga total dihitung dari sisi server untuk mencegah manipulasi.</div>

<!-- ============ BAB 6 ============ -->
<div class="page-break"></div>
<h1 id="bab6">Bab 6: Riwayat Transaksi</h1>
<p>Halaman <strong>Riwayat Transaksi</strong> (<code>/converter/marketplace/history</code>) menampilkan semua pembelian bahan yang telah Anda lakukan.</p>

<h2>6.1 Daftar Transaksi</h2>
<table>
  <tr><th>Kolom</th><th>Keterangan</th></tr>
  <tr><td>Item</td><td>Nama jenis kayu yang dibeli</td></tr>
  <tr><td>Aggregator</td><td>Nama penjual</td></tr>
  <tr><td>Quantity</td><td>Jumlah dalam kg</td></tr>
  <tr><td>Total</td><td>Total harga pembelian</td></tr>
  <tr><td>Status</td><td>Status pemrosesan (badge berwarna)</td></tr>
  <tr><td>Tanggal</td><td>Tanggal transaksi</td></tr>
</table>

<h2>6.2 Status Transaksi</h2>
<table>
  <tr><th>Status</th><th>Label</th><th>Arti</th></tr>
  <tr><td>pending</td><td>Menunggu</td><td>Menunggu konfirmasi Aggregator</td></tr>
  <tr><td>paid</td><td>Dibayar</td><td>Pembayaran sudah dikonfirmasi</td></tr>
  <tr><td>shipped</td><td>Dikirim</td><td>Bahan sedang dikirim</td></tr>
  <tr><td>received</td><td>Diterima</td><td>Bahan sudah sampai — transaksi selesai</td></tr>
  <tr><td>cancelled</td><td>Dibatalkan</td><td>Transaksi dibatalkan</td></tr>
</table>
<pre>pending → paid → shipped → received → selesai
   ↓
cancelled</pre>

<!-- ============ BAB 7 ============ -->
<div class="page-break"></div>
<h1 id="bab7">Bab 7: Katalog Produk &amp; QR Code</h1>
<p>Halaman <strong>Katalog Produk</strong> menampilkan semua produk upcycled yang sudah Anda buat. Dari halaman ini Anda dapat melihat, menghapus, dan melihat QR Code setiap produk.</p>
${imgTag("20-converter-catalog.png", "Gambar 7.1 — Halaman Katalog Produk")}

<h2>7.1 Katalog Produk</h2>
<p>Produk ditampilkan dalam bentuk kartu grid:</p>
<table>
  <tr><th>Info pada Kartu</th><th>Keterangan</th></tr>
  <tr><td>Badge Status</td><td>Active (hijau) atau Sold Out (abu-abu)</td></tr>
  <tr><td>Nama Produk</td><td>Nama produk upcycled</td></tr>
  <tr><td>Kategori</td><td>Furniture, Decor, Accessories, Art, atau Lainnya</td></tr>
  <tr><td>Stok</td><td>Jumlah unit tersedia</td></tr>
  <tr><td>Harga</td><td>Harga jual produk</td></tr>
  <tr><td>Tombol Edit</td><td>Ubah data produk</td></tr>
  <tr><td>Tombol QR</td><td>Lihat QR Code traceability</td></tr>
  <tr><td>Ikon Hapus</td><td>Hapus produk (ikon sampah pojok kanan)</td></tr>
</table>

<h2>7.2 Status Produk</h2>
<table>
  <tr><th>Status</th><th>Kondisi</th><th>Arti</th></tr>
  <tr><td>Active</td><td>stok &gt; 0</td><td>Produk tampil di marketplace Buyer dan bisa dibeli</td></tr>
  <tr><td>Sold Out</td><td>stok = 0</td><td>Stok habis, produk masih tampil tapi tidak bisa dibeli</td></tr>
</table>

<h2>7.3 QR Code Produk</h2>
<p>Setiap produk otomatis mendapatkan <strong>QR Code unik</strong> saat dibuat. QR Code berisi ID unik format <code>PRD-XXXXXXXX</code> yang tertaut ke halaman traceability publik di <code>/p/[qr_code_id]</code>.</p>
<p><strong>Cara melihat QR Code:</strong></p>
<ol>
  <li>Buka halaman <strong>Katalog Produk</strong></li>
  <li>Klik tombol <strong>"QR"</strong> pada kartu produk yang diinginkan</li>
  <li>Dialog QR Code akan muncul — menampilkan QR Code dalam ukuran besar</li>
  <li>Dari dialog, Anda dapat mengunduh, menyimpan, atau membagikan QR Code</li>
</ol>
<div class="tip"><strong>Manfaat QR Code:</strong> Buyer dapat scan QR untuk melihat halaman traceability produk — termasuk asal-usul bahan baku dari Supplier, Generator, hingga Aggregator. Ini meningkatkan transparansi dan kepercayaan pembeli.</div>

<h2>7.4 Hapus Produk</h2>
<ol>
  <li>Klik ikon <strong>tong sampah</strong> (merah) di pojok kanan atas kartu produk</li>
  <li>Konfirmasi akan diproses langsung — notifikasi "Produk dihapus" akan muncul</li>
</ol>
<div class="warn">Penghapusan produk bersifat permanen dan tidak dapat dibatalkan.</div>

<!-- ============ BAB 8 ============ -->
<div class="page-break"></div>
<h1 id="bab8">Bab 8: Membuat Produk Upcycled</h1>
<p>Fitur utama Converter — mendaftarkan produk upcycled baru yang terhubung dengan bahan baku yang sudah dibeli.</p>

<h2>8.1 Form Produk Baru</h2>
<p>Klik tombol <strong>"Buat Produk"</strong> di halaman Katalog Produk atau Dashboard untuk membuka form: <code>/converter/catalog/new</code></p>

<h3>Informasi Produk</h3>
<table>
  <tr><th>Field</th><th>Wajib</th><th>Contoh</th></tr>
  <tr><td>Nama Produk</td><td>✅</td><td>"Vas Bunga dari Limbah Jati"</td></tr>
  <tr><td>Kategori</td><td>✅</td><td>Furniture, Decor, Accessories, Art, Lainnya</td></tr>
  <tr><td>Harga (Rp)</td><td>✅</td><td>Harga jual produk</td></tr>
  <tr><td>Stok</td><td>❌</td><td>Jumlah unit (default: 1)</td></tr>
  <tr><td>Deskripsi</td><td>❌</td><td>Cerita tentang produk &amp; bahan</td></tr>
</table>

<h2>8.2 Source Materials untuk Traceability</h2>
<p>Bagian <strong>Source Materials</strong> memungkinkan Anda menghubungkan produk dengan transaksi pembelian bahan yang sudah dilakukan. Ini penting untuk fitur <strong>traceability</strong> — Buyer bisa melihat asal-usul bahan produk Anda.</p>
<p>Cara menghubungkan:</p>
<ol>
  <li>Centang transaksi pembelian bahan yang relevan</li>
  <li>Hanya transaksi dengan status <strong>paid</strong> atau <strong>received</strong> yang ditampilkan</li>
  <li>Source materials bersifat opsional</li>
</ol>
<div class="tip">Semakin lengkap data source materials, semakin kuat cerita traceability produk Anda di mata Buyer.</div>

<h2>8.3 Kategori Produk</h2>
<table>
  <tr><th>Kategori</th><th>Contoh</th></tr>
  <tr><td>Furniture</td><td>Meja, kursi, lemari, rak</td></tr>
  <tr><td>Decor</td><td>Vas, hiasan dinding, lampu</td></tr>
  <tr><td>Accessories</td><td>Jam tangan, gelang, tas</td></tr>
  <tr><td>Art</td><td>Patung, lukisan kayu, instalasi</td></tr>
  <tr><td>Lainnya</td><td>Produk lain yang tidak masuk kategori di atas</td></tr>
</table>

<h2>8.4 Edit Produk</h2>
<p>Halaman edit produk (<code>/converter/catalog/[id]/edit</code>) memungkinkan Anda mengubah:</p>
<ul>
  <li><strong>Nama Produk</strong> — Ubah nama produk</li>
  <li><strong>Kategori</strong> — Ganti kategori produk</li>
  <li><strong>Harga</strong> — Sesuaikan harga jual</li>
  <li><strong>Stok</strong> — Update jumlah unit</li>
  <li><strong>Deskripsi</strong> — Edit cerita produk</li>
</ul>
<p>Cara mengakses edit: Klik tombol <strong>"Edit"</strong> pada kartu produk di Katalog Produk.</p>

<!-- ============ BAB 9 ============ -->
<div class="page-break"></div>
<h1 id="bab9">Bab 9: Klinik Desain</h1>
<p><strong>Klinik Desain</strong> adalah pusat inspirasi yang berisi resep desain (<em>design recipes</em>) untuk membantu Converter mendapatkan ide produk baru dari bahan limbah.</p>
${imgTag("21-converter-design-clinic.png", "Gambar 9.1 — Halaman Klinik Desain")}

<h2>9.1 Inspirasi Desain</h2>
<p>Klinik Desain menampilkan koleksi <strong>resep desain</strong> yang dibuat oleh Admin/Desainer. Setiap resep berisi:</p>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Judul</td><td>Nama resep desain</td></tr>
  <tr><td>Jenis Kayu yang Cocok</td><td>Rekomendasi jenis kayu untuk resep ini</td></tr>
  <tr><td>Tingkat Kesulitan</td><td>Mudah, Sedang, atau Sulit</td></tr>
  <tr><td>Deskripsi</td><td>Penjelasan dan panduan pembuatan</td></tr>
  <tr><td>Penulis</td><td>Admin atau Desainer yang membuat resep</td></tr>
</table>

<h2>9.2 Filter Resep Desain</h2>
<table>
  <tr><th>Fitur</th><th>Fungsi</th></tr>
  <tr><td>🔍 Pencarian</td><td>Cari resep berdasarkan judul atau deskripsi</td></tr>
  <tr><td>Filter Tingkat Kesulitan</td><td>Tampilkan resep berdasarkan tingkat kesulitan</td></tr>
  <tr><td>Filter Jenis Kayu</td><td>Filter berdasarkan jenis kayu yang cocok</td></tr>
</table>
<div class="note">Klinik Desain adalah fitur bersama antara Converter dan peran lainnya. Jika Anda memiliki ide desain yang ingin dibagikan, hubungi Admin WoodLoop.</div>

<!-- ============ BAB 10 ============ -->
<div class="page-break"></div>
<h1 id="bab10">Bab 10: Troubleshooting</h1>

<h2>10.1 Tidak Bisa Login</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Lupa password</td><td>Klik "Lupa Kata Sandi?" di halaman login, ikuti instruksi reset</td></tr>
  <tr><td>Email tidak terdaftar</td><td>Pastikan mendaftar dengan peran Converter terlebih dahulu</td></tr>
  <tr><td>Salah peran</td><td>Pastikan memilih Converter saat login, bukan peran lain</td></tr>
  <tr><td>Browser error</td><td>Coba browser berbeda atau mode incognito</td></tr>
</table>

<h2>10.2 Bahan Tidak Muncul di Pasar Bahan</h2>
<table>
  <tr><th>Kemungkinan</th><th>Saran</th></tr>
  <tr><td>Belum ada Aggregator yang menjual</td><td>Pasar Bahan hanya menampilkan inventory dari Aggregator yang sudah masuk</td></tr>
  <tr><td>Filter terlalu ketat</td><td>Reset filter untuk melihat semua bahan</td></tr>
  <tr><td>Koneksi internet</td><td>Pastikan koneksi stabil, refresh halaman</td></tr>
</table>

<h2>10.3 Checkout Gagal</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Quantity melebihi stok</td><td>Pastikan quantity tidak melebihi berat tersedia</td></tr>
  <tr><td>Koneksi terputus</td><td>Coba checkout ulang</td></tr>
  <tr><td>Bahan sudah dipesan orang lain</td><td>Bahan mungkin sudah dibeli Converter lain, cari bahan alternatif</td></tr>
</table>

<h2>10.4 QR Code Tidak Muncul</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Dialog tidak terbuka</td><td>Coba klik tombol QR beberapa kali</td></tr>
  <tr><td>QR Code kosong</td><td>Pastikan produk memiliki qr_code_id yang valid (format PRD-XXXXXXXX)</td></tr>
  <tr><td>Pop-up terblokir</td><td>Izinkan pop-up di browser untuk fitur download QR</td></tr>
</table>

<h2>10.5 Kontak Bantuan</h2>
<table>
  <tr><th>Saluran</th><th>Detail</th></tr>
  <tr><td>Email</td><td>woodloop.app@gmail.com</td></tr>
  <tr><td>Website</td><td>woodloop.pasarjepara.com</td></tr>
</table>
<p>Sertakan informasi berikut saat melapor: nama akun, peran (Converter), deskripsi masalah (jelaskan langkah yang sudah dilakukan), screenshot jika ada pesan error, dan waktu kejadian.</p>

</body>
</html>`;

const htmlPath = path.join(DIR, "manual-book-converter.html");
fs.writeFileSync(htmlPath, html);
console.log("HTML generated:", htmlPath);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("file://" + htmlPath, { waitUntil: "networkidle0" });
  await page.pdf({
    path: OUTPUT,
    format: "A4",
    margin: { top: "2cm", bottom: "2cm", left: "2.5cm", right: "2.5cm" },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-size:9px;text-align:center;width:100%;color:#999;">Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></div>',
  });
  await browser.close();
  console.log("PDF generated:", OUTPUT);
})();
