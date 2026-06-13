const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname);
const OUTPUT = path.join(__dirname, "Manual-Book-Buyer-WoodLoop.pdf");
const SCREENSHOTS_DIR = path.join(__dirname, "..", "screenshots");

const SCREENSHOTS = {
  "01-buyer-dashboard.png": path.join(SCREENSHOTS_DIR, "01-buyer-dashboard.png"),
  "02-buyer-marketplace.png": path.join(SCREENSHOTS_DIR, "02-buyer-marketplace.png"),
  "03-buyer-product-detail.png": path.join(SCREENSHOTS_DIR, "03-buyer-product-detail.png"),
  "04-buyer-cart.png": path.join(SCREENSHOTS_DIR, "04-buyer-cart.png"),
  "05-buyer-checkout.png": path.join(SCREENSHOTS_DIR, "05-buyer-checkout.png"),
  "06-buyer-orders.png": path.join(SCREENSHOTS_DIR, "06-buyer-orders.png"),
  "07-buyer-wishlist.png": path.join(SCREENSHOTS_DIR, "07-buyer-wishlist.png"),
  "08-buyer-scan.png": path.join(SCREENSHOTS_DIR, "08-buyer-scan.png"),
  "09-buyer-seller-store.png": path.join(SCREENSHOTS_DIR, "09-buyer-seller-store.png"),
  "10-buyer-traceability-publik.png": path.join(SCREENSHOTS_DIR, "10-buyer-traceability-publik.png"),
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
<title>Manual Book WoodLoop — Buyer</title>
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
  <h2>Manual Book — Buyer</h2>
  <p style="font-size:14pt;color:#666;">Panduan Lengkap Pembeli Produk Upcycled</p>
  <br/><br/>
  <p><strong>Versi 1.0 — Juni 2026</strong></p>
  <hr/>
  <p><em>"Mengubah Limbah Kayu Menjadi Berkah untuk Jepara"</em></p>
  <br/><br/><br/>
  <table style="width:auto;margin:0 auto;">
    <tr><td><strong>Peran</strong></td><td>Buyer (Pembeli)</td></tr>
    <tr><td><strong>Platform</strong></td><td>Web</td></tr>
    <tr><td><strong>Backend</strong></td><td>PocketBase</td></tr>
  </table>
  <br/>
  <p style="font-size:10pt;color:#999;">woodloop.pasarjepara.com</p>
</div>

<!-- ============ KATA PENGANTAR ============ -->
<div class="page-break"></div>
<h1>Kata Pengantar</h1>
<p>Puji syukur kehadirat Tuhan Yang Maha Esa atas terselesaikannya <strong>Manual Book WoodLoop — Panduan Khusus Buyer</strong>.</p>
<p>Manual book ini disusun khusus untuk pengguna dengan peran <strong>Buyer (Pembeli)</strong> dalam ekosistem WoodLoop. Sebagai konsumen akhir produk upcycled, Anda memegang peranan penting dalam rantai ekonomi sirkular — dengan membeli produk daur ulang, Anda ikut serta dalam mengurangi limbah kayu dan melestarikan lingkungan.</p>
<p>Buku ini membahas secara detail seluruh fitur yang tersedia untuk Buyer, mulai dari:</p>
<ul>
  <li><strong>Dashboard</strong> — halaman utama dengan ringkasan fitur</li>
  <li><strong>Marketplace</strong> — menjelajahi produk upcycled dari berbagai pengrajin</li>
  <li><strong>Detail Produk &amp; Traceability</strong> — melihat perjalanan produk dari hulu ke hilir</li>
  <li><strong>Dampak Lingkungan</strong> — statistik limbah teralihkan dan CO₂ tersimpan</li>
  <li><strong>Keranjang Belanja</strong> — kelola item sebelum checkout</li>
  <li><strong>Checkout &amp; Pembayaran</strong> — berbagai metode pembayaran termasuk Midtrans</li>
  <li><strong>Pesanan Saya</strong> — lacak status pesanan dengan timeline visual</li>
  <li><strong>Wishlist</strong> — simpan produk favorit</li>
  <li><strong>Scan QR</strong> — pindai QR code untuk melihat traceability</li>
  <li><strong>Toko Penjual</strong> — lihat profil dan produk Converter</li>
  <li><strong>Traceability Publik</strong> — halaman SEO untuk setiap produk</li>
</ul>
<p>Setiap fitur dijelaskan dengan langkah-langkah praktis yang dilengkapi tangkapan layar, sehingga Anda dapat langsung mempraktikkannya.</p>
<p>Kami berharap manual book ini membantu Anda memanfaatkan WoodLoop secara maksimal untuk berbelanja produk daur ulang yang berkualitas, transparan, dan ramah lingkungan.</p>
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
        <li>1.2 Peran Buyer dalam Ekosistem</li>
        <li>1.3 Alur Bisnis Buyer</li>
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
    <li><a href="#bab3">Bab 3: Dashboard Buyer</a>
      <ul>
        <li>3.1 Halaman Dashboard</li>
        <li>3.2 Menu Cepat</li>
      </ul>
    </li>
    <li><a href="#bab4">Bab 4: Marketplace</a>
      <ul>
        <li>4.1 Menjelajahi Produk</li>
        <li>4.2 Kategori Produk</li>
        <li>4.3 Pencarian &amp; Filter Harga</li>
        <li>4.4 Urutkan Produk</li>
        <li>4.5 Tambah ke Keranjang</li>
      </ul>
    </li>
    <li><a href="#bab5">Bab 5: Detail Produk &amp; Traceability</a>
      <ul>
        <li>5.1 Galeri Foto</li>
        <li>5.2 Informasi Produk</li>
        <li>5.3 Perjalanan Produk (Traceability)</li>
        <li>5.4 Dampak Lingkungan</li>
        <li>5.5 Ulasan Pembeli</li>
        <li>5.6 Wishlist</li>
      </ul>
    </li>
    <li><a href="#bab6">Bab 6: Keranjang Belanja</a>
      <ul>
        <li>6.1 Melihat Keranjang</li>
        <li>6.2 Mengubah Jumlah Item</li>
        <li>6.3 Menghapus Item</li>
        <li>6.4 Total Belanja</li>
        <li>6.5 Kondisi Keranjang Kosong</li>
      </ul>
    </li>
    <li><a href="#bab7">Bab 7: Checkout &amp; Pembayaran</a>
      <ul>
        <li>7.1 Ringkasan Pesanan</li>
        <li>7.2 Alamat Pengiriman</li>
        <li>7.3 Metode Pembayaran</li>
        <li>7.4 Melakukan Pembayaran</li>
        <li>7.5 Pembelian Langsung</li>
      </ul>
    </li>
    <li><a href="#bab8">Bab 8: Pesanan &amp; Pelacakan</a>
      <ul>
        <li>8.1 Daftar Pesanan Saya</li>
        <li>8.2 Filter Status Pesanan</li>
        <li>8.3 Detail Pesanan</li>
        <li>8.4 Timeline Status Pesanan</li>
        <li>8.5 Membatalkan Pesanan</li>
        <li>8.6 Konfirmasi Pesanan Diterima</li>
        <li>8.7 Hubungi Penjual</li>
      </ul>
    </li>
    <li><a href="#bab9">Bab 9: Wishlist</a>
      <ul>
        <li>9.1 Melihat Wishlist</li>
        <li>9.2 Menghapus dari Wishlist</li>
        <li>9.3 Kondisi Wishlist Kosong</li>
      </ul>
    </li>
    <li><a href="#bab10">Bab 10: Scan QR Code</a>
      <ul>
        <li>10.1 Halaman Scan</li>
        <li>10.2 Input Manual Kode QR</li>
      </ul>
    </li>
    <li><a href="#bab11">Bab 11: Toko Penjual</a>
      <ul>
        <li>11.1 Profil Penjual</li>
        <li>11.2 Produk Penjual</li>
      </ul>
    </li>
    <li><a href="#bab12">Bab 12: Traceability Publik (SEO)</a>
      <ul>
        <li>12.1 Halaman Publik Produk</li>
        <li>12.2 Informasi SEO</li>
        <li>12.3 Dampak Lingkungan</li>
        <li>12.4 Ajakan Beli</li>
      </ul>
    </li>
    <li><a href="#bab13">Bab 13: Troubleshooting</a>
      <ul>
        <li>13.1 Tidak Bisa Login</li>
        <li>13.2 Produk Tidak Muncul di Marketplace</li>
        <li>13.3 Gagal Checkout</li>
        <li>13.4 Pembayaran Midtrans Gagal</li>
        <li>13.5 QR Code Tidak Terbaca</li>
        <li>13.6 Kontak Bantuan</li>
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

<h2>1.2 Peran Buyer dalam Ekosistem</h2>
<p><strong>Buyer</strong> adalah konsumen akhir yang membeli produk upcycled (daur ulang) dari para Converter. Buyer menjadi <strong>mata rantai terakhir</strong> sekaligus <strong>penggerak permintaan</strong> dalam alur ekonomi sirkular.</p>
<p><strong>Contoh pengguna Buyer:</strong></p>
<ul>
  <li>Masyarakat umum yang ingin membeli furnitur/kriya kayu</li>
  <li>Kolektor produk daur ulang</li>
  <li>Desainer interior yang mencari material unik</li>
  <li>Konsumen peduli lingkungan yang ingin mendukung ekonomi sirkular</li>
</ul>
<p><strong>Alur peran Buyer dalam ekosistem WoodLoop:</strong></p>
<pre>Supplier &rarr; Generator &rarr; Aggregator &rarr; Converter &rarr; (produk upcycled) &rarr; Buyer</pre>

<h2>1.3 Alur Bisnis Buyer</h2>
<table>
  <tr><th>Langkah</th><th>Aktivitas</th><th>Halaman</th></tr>
  <tr><td>1</td><td>Login ke akun Buyer</td><td>/login</td></tr>
  <tr><td>2</td><td>Melihat Dashboard Buyer</td><td>/buyer/dashboard</td></tr>
  <tr><td>3</td><td>Menjelajahi produk di Marketplace</td><td>/buyer/marketplace</td></tr>
  <tr><td>4</td><td>Melihat detail produk &amp; traceability</td><td>/buyer/product/[id]</td></tr>
  <tr><td>5</td><td>Menambahkan produk ke keranjang</td><td>/buyer/cart</td></tr>
  <tr><td>6</td><td>Checkout &amp; melakukan pembayaran</td><td>/buyer/checkout</td></tr>
  <tr><td>7</td><td>Melacak status pesanan</td><td>/buyer/orders</td></tr>
  <tr><td>8</td><td>Menerima pesanan &amp; memberi ulasan</td><td>/buyer/orders/[id]</td></tr>
</table>

<h2>1.4 Istilah Penting</h2>
<table>
  <tr><th>Istilah</th><th>Arti</th></tr>
  <tr><td>Upcycled</td><td>Produk hasil daur ulang limbah kayu menjadi barang bernilai lebih tinggi</td></tr>
  <tr><td>Converter</td><td>Pengrajin yang mengolah limbah kayu menjadi produk upcycled</td></tr>
  <tr><td>Marketplace</td><td>Tempat jual-beli produk upcycled</td></tr>
  <tr><td>Traceability</td><td>Jejak asal-usul produk dari hulu ke hilir</td></tr>
  <tr><td>QR Code ID</td><td>Kode unik untuk melacak produk (format: PRD-XXXXXXXX)</td></tr>
  <tr><td>Midtrans</td><td>Payment gateway untuk pembayaran online (QRIS, VA, Bank Transfer)</td></tr>
  <tr><td>Dompet Digital</td><td>Saldo dalam ekosistem WoodLoop</td></tr>
  <tr><td>Wishlist</td><td>Daftar produk favorit yang disimpan</td></tr>
  <tr><td>Dampak Lingkungan</td><td>Statistik limbah teralihkan dan CO₂ tersimpan</td></tr>
</table>

<!-- ============ BAB 2 ============ -->
<div class="page-break"></div>
<h1 id="bab2">Bab 2: Memulai</h1>

<h2>2.1 Akses ke Aplikasi</h2>
<p>WoodLoop dapat diakses melalui browser web di alamat:</p>
<pre>https://woodloop.pasarjepara.com</pre>
<p><strong>Kebutuhan Sistem:</strong></p>
<ul>
  <li>Browser: Chrome, Firefox, Edge, atau Safari versi terbaru</li>
  <li>Koneksi internet stabil</li>
  <li>Akun Buyer yang sudah terdaftar</li>
</ul>

<h2>2.2 Login</h2>
${imgTag("01-buyer-dashboard.png", "Gambar 2.1 — Halaman login WoodLoop")}
<ol>
  <li>Buka halaman login di <code>https://woodloop.pasarjepara.com/login</code></li>
  <li>Masukkan <strong>email</strong> dan <strong>kata sandi</strong> yang sudah didaftarkan</li>
  <li>Klik tombol <strong>"Masuk"</strong></li>
  <li>Setelah berhasil, Anda akan diarahkan ke <strong>Dashboard Buyer</strong></li>
</ol>
<div class="note"><strong>Lupa Kata Sandi?</strong> Klik tautan "Lupa Kata Sandi?" di halaman login dan ikuti petunjuk reset.</div>

<h2>2.3 Navigasi Antarmuka</h2>
${imgTag("01-buyer-dashboard.png", "Gambar 2.2 — Dashboard Buyer")}
<p>Setelah login, Anda akan melihat <strong>sidebar navigasi</strong> di sebelah kiri dengan menu berikut:</p>
<table>
  <tr><th>Menu</th><th>Ikon</th><th>Halaman</th><th>Fungsi</th></tr>
  <tr><td>Dashboard</td><td>📊</td><td>/buyer/dashboard</td><td>Halaman utama Buyer</td></tr>
  <tr><td>Marketplace</td><td>🏪</td><td>/buyer/marketplace</td><td>Jelajahi produk upcycled</td></tr>
  <tr><td>Wishlist</td><td>❤️</td><td>/buyer/wishlist</td><td>Produk favorit</td></tr>
  <tr><td>Pesanan Saya</td><td>📋</td><td>/buyer/orders</td><td>Lacak pesanan</td></tr>
  <tr><td>Scan QR</td><td>📷</td><td>/buyer/scan</td><td>Pindai QR code produk</td></tr>
</table>

<h3>Navigasi Atas (Navbar)</h3>
<table>
  <tr><th>Elemen</th><th>Fungsi</th></tr>
  <tr><td>🌓 Mode Gelap</td><td>Tombol toggle gelap/terang</td></tr>
  <tr><td>🌐 Ganti Bahasa</td><td>Beralih EN/ID</td></tr>
  <tr><td>👛 Dompet</td><td>Saldo dompet digital</td></tr>
  <tr><td>🔔 Notifikasi</td><td>Notifikasi masuk</td></tr>
  <tr><td>💬 Chat</td><td>Pesan dengan penjual</td></tr>
  <tr><td>👤 Avatar</td><td>Dropdown: Profil | Dompet | Keluar</td></tr>
</table>

<h2>2.4 Mode Gelap &amp; Ganti Bahasa</h2>
<p>Klik tombol <strong>"Mode Gelap"</strong> di navbar untuk beralih antara tema terang dan gelap. Klik tombol <strong>"Ganti Bahasa"</strong> untuk beralih antara Bahasa Indonesia dan English. Pengaturan akan tersimpan secara otomatis untuk kunjungan berikutnya.</p>

<!-- ============ BAB 3 ============ -->
<div class="page-break"></div>
<h1 id="bab3">Bab 3: Dashboard Buyer</h1>
${imgTag("01-buyer-dashboard.png", "Gambar 3.1 — Dashboard Buyer")}

<h2>3.1 Halaman Dashboard</h2>
<p>Dashboard Buyer menampilkan pesan selamat datang khusus Buyer dan kartu fitur utama yang tersedia:</p>

<h3>Kartu Fitur</h3>
<table>
  <tr><th>Kartu</th><th>Ikon</th><th>Deskripsi</th></tr>
  <tr><td>Marketplace</td><td>🏪</td><td>Produk upcycled berkualitas dari pengrajin Jepara</td></tr>
  <tr><td>Pesanan Saya</td><td>📋</td><td>Lacak status pesanan Anda</td></tr>
</table>

<h2>3.2 Menu Cepat</h2>
<p>Setiap kartu dapat diklik untuk langsung menuju ke halaman terkait. Anda juga dapat mengakses halaman melalui sidebar navigasi di sebelah kiri.</p>

<!-- ============ BAB 4 ============ -->
<div class="page-break"></div>
<h1 id="bab4">Bab 4: Marketplace</h1>
<p>Halaman <strong>Marketplace</strong> adalah toko utama tempat Anda dapat menjelajahi semua produk upcycled yang tersedia dari para Converter.</p>
${imgTag("02-buyer-marketplace.png", "Gambar 4.1 — Halaman Marketplace Buyer")}

<h2>4.1 Menjelajahi Produk</h2>
<p>Produk ditampilkan dalam bentuk <strong>grid kartu</strong> yang responsif — 2 kolom di layar ponsel, 4 kolom di layar desktop.</p>
<table>
  <tr><th>Elemen Kartu</th><th>Keterangan</th></tr>
  <tr><td>Foto</td><td>Gambar utama produk (aspect ratio 4:3)</td></tr>
  <tr><td>Nama Produk</td><td>Nama produk upcycled</td></tr>
  <tr><td>Badge Kategori</td><td>Label kategori (Furniture, Decor, dll)</td></tr>
  <tr><td>Harga</td><td>Harga jual dalam Rupiah</td></tr>
  <tr><td>Nama Converter</td><td>Nama pengrajin pembuat produk</td></tr>
  <tr><td>Tombol + Keranjang</td><td>Tambah ke keranjang belanja</td></tr>
</table>

<h2>4.2 Kategori Produk</h2>
<p>Tab kategori untuk menyaring produk berdasarkan jenis:</p>
<table>
  <tr><th>Kategori</th><th>Contoh Produk</th></tr>
  <tr><td>Semua</td><td>Menampilkan seluruh produk</td></tr>
  <tr><td>Furniture</td><td>Meja, kursi, lemari, rak</td></tr>
  <tr><td>Decor</td><td>Vas, hiasan dinding, lampu</td></tr>
  <tr><td>Accessories</td><td>Jam tangan, gelang, tas</td></tr>
  <tr><td>Art</td><td>Patung, lukisan kayu, instalasi</td></tr>
  <tr><td>Lainnya</td><td>Produk yang tidak masuk kategori di atas</td></tr>
</table>

<h2>4.3 Pencarian &amp; Filter Harga</h2>
<p>Ketik kata kunci di kolom pencarian untuk mencari berdasarkan nama atau deskripsi produk. Klik ikon Sliders (🔀) untuk membuka panel filter rentang harga (minimum dan maksimum). Klik Reset untuk menghapus filter.</p>

<h2>4.4 Urutkan Produk</h2>
<table>
  <tr><th>Opsi</th><th>Urutan</th></tr>
  <tr><td>Terbaru</td><td>Produk paling baru di atas (default)</td></tr>
  <tr><td>Terlaris</td><td>Produk dengan penjualan terbanyak</td></tr>
  <tr><td>Termurah</td><td>Harga terendah ke tertinggi</td></tr>
  <tr><td>Termahal</td><td>Harga tertinggi ke terendah</td></tr>
</table>

<h2>4.5 Tambah ke Keranjang</h2>
<p>Klik tombol ikon Keranjang (+") pada kartu produk untuk menambahkan ke keranjang. Notifikasi akan muncul: <strong>"[Nama Produk] ditambahkan ke keranjang"</strong>. Klik ikon keranjang di panel atas untuk melihat isi keranjang.</p>

<!-- ============ BAB 5 ============ -->
<div class="page-break"></div>
<h1 id="bab5">Bab 5: Detail Produk &amp; Traceability</h1>
<p>Halaman <strong>Detail Produk</strong> menampilkan informasi lengkap produk upcycled, termasuk galeri foto, traceability, dampak lingkungan, dan ulasan.</p>
${imgTag("03-buyer-product-detail.png", "Gambar 5.1 — Halaman detail produk")}

<h2>5.1 Galeri Foto</h2>
<p>Di bagian kiri, terdapat Carousel galeri foto produk. Geser ke kiri/kanan untuk melihat foto lainnya. Klik tombol ◀️ ▶️ untuk navigasi.</p>

<h2>5.2 Informasi Produk</h2>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Nama Produk</td><td>Nama produk upcycled</td></tr>
  <tr><td>Badge Kategori</td><td>Label kategori produk</td></tr>
  <tr><td>Badge Stok</td><td>🟢 Stok tersedia / ⚪ Habis</td></tr>
  <tr><td>Harga</td><td>Harga jual dalam Rupiah</td></tr>
  <tr><td>Rating</td><td>⭐ Rata-rata rating pembeli</td></tr>
  <tr><td>Converter</td><td>Nama pengrajin (link ke Toko Penjual)</td></tr>
</table>

<p>Tombol aksi: <strong>"+ Keranjang"</strong> (tambah ke keranjang) dan <strong>"Beli Langsung"</strong> (langsung checkout). Ikon ❤️ di pojok untuk wishlist.</p>

<h2>5.3 Perjalanan Produk (Traceability)</h2>
<p>Timeline visual asal-usul produk dari bahan baku hingga produk jadi. Setiap langkah menampilkan nama bahan, sumber, jumlah (kg), dan tanggal. Jika belum ada data traceability, akan tampil pesan bahwa informasi belum tersedia.</p>

<h2>5.4 Dampak Lingkungan</h2>
<table>
  <tr><th>Metrik</th><th>Ikon</th><th>Keterangan</th></tr>
  <tr><td>Limbah Teralihkan</td><td>♻️</td><td>Total berat limbah yang dialihkan (kg)</td></tr>
  <tr><td>CO₂ Tersimpan</td><td>🌱</td><td>Estimasi karbon yang tersimpan (kg)</td></tr>
</table>

<h2>5.5 Ulasan Pembeli</h2>
<p>Menampilkan rating dan komentar dari pembeli. Klik <strong>"Beri Ulasan"</strong> untuk membuka dialog rating (1-5 bintang) dan komentar.</p>

<h2>5.6 Wishlist</h2>
<p>Klik ikon ❤️ untuk menambah/menghapus produk dari wishlist. Heart merah = sudah di-wishlist. Fitur hanya untuk Buyer yang sudah login.</p>

<!-- ============ BAB 6 ============ -->
<div class="page-break"></div>
<h1 id="bab6">Bab 6: Keranjang Belanja</h1>
<p>Halaman <strong>Keranjang Belanja</strong> menampilkan semua produk yang telah Anda tambahkan. Keranjang disimpan otomatis di browser (localStorage) dan disinkronkan ke akun Anda.</p>
${imgTag("04-buyer-cart.png", "Gambar 6.1 — Halaman keranjang belanja")}

<h2>6.1 Melihat Keranjang</h2>
<p>Buka melalui ikon 🛒 di marketplace atau langsung ke <code>/buyer/cart</code>. Setiap item menampilkan foto, nama, harga satuan, jumlah, subtotal, dan tombol hapus.</p>

<h2>6.2 Mengubah Jumlah Item</h2>
<p>Klik ➖ untuk mengurangi, ➕ untuk menambah jumlah. Jumlah dan subtotal berubah secara real-time.</p>

<h2>6.3 Menghapus Item</h2>
<p>Klik ikon 🗑️ untuk menghapus item. Item langsung terhapus tanpa konfirmasi.</p>

<h2>6.4 Total Belanja</h2>
<p>Di bagian bawah: total item dan total harga. Tombol <strong>"Checkout"</strong> untuk lanjut ke pembayaran.</p>

<h2>6.5 Kondisi Keranjang Kosong</h2>
<p>Tampilan: ikon keranjang, teks "Keranjang masih kosong", dan tombol <strong>"Lihat Marketplace"</strong>.</p>

<!-- ============ BAB 7 ============ -->
<div class="page-break"></div>
<h1 id="bab7">Bab 7: Checkout &amp; Pembayaran</h1>
<p>Halaman <strong>Checkout</strong> untuk menyelesaikan pembelian dengan mengisi alamat pengiriman dan memilih metode pembayaran.</p>
${imgTag("05-buyer-checkout.png", "Gambar 7.1 — Halaman checkout")}

<h2>7.1 Ringkasan Pesanan</h2>
<p>Menampilkan daftar item (nama × jumlah + subtotal) dan total keseluruhan.</p>

<h2>7.2 Alamat Pengiriman</h2>
<table>
  <tr><th>Field</th><th>Wajib</th><th>Keterangan</th></tr>
  <tr><td>Nama Penerima</td><td>✅</td><td>Nama penerima pesanan</td></tr>
  <tr><td>Telepon</td><td>❌</td><td>Nomor kontak</td></tr>
  <tr><td>Alamat Lengkap</td><td>✅</td><td>Jalan, kota, provinsi, kode pos</td></tr>
  <tr><td>Catatan</td><td>❌</td><td>Catatan untuk penjual</td></tr>
</table>

<h2>7.3 Metode Pembayaran</h2>
<table>
  <tr><th>Metode</th><th>Keterangan</th></tr>
  <tr><td>QRIS / VA / Bank Transfer</td><td>Pembayaran online via Midtrans</td></tr>
  <tr><td>Transfer Bank Manual</td><td>Transfer manual ke rekening WoodLoop</td></tr>
  <tr><td>COD</td><td>Bayar di tempat</td></tr>
</table>

<h2>7.4 Melakukan Pembayaran</h2>
<p>Klik <strong>"Bayar Rp [total]"</strong>. Jika memilih Midtrans, popup Snap akan terbuka untuk memilih metode (QRIS, VA, Bank Transfer). Setelah bayar sukses, diarahkan ke halaman Pesanan Saya.</p>

<h2>7.5 Pembelian Langsung</h2>
<p>Dari halaman detail produk, klik <strong>"Beli Langsung"</strong> untuk checkout dengan satu produk tanpa memengaruhi keranjang.</p>

<!-- ============ BAB 8 ============ -->
<div class="page-break"></div>
<h1 id="bab8">Bab 8: Pesanan &amp; Pelacakan</h1>
<p>Halaman <strong>Pesanan Saya</strong> menampilkan semua pesanan yang telah Anda buat.</p>
${imgTag("06-buyer-orders.png", "Gambar 8.1 — Halaman daftar pesanan")}

<h2>8.1 Daftar Pesanan Saya</h2>
<p>Setiap pesanan dalam kartu: foto produk, nama, jumlah &amp; harga, badge status, dan tanggal. Klik kartu untuk detail.</p>

<h2>8.2 Filter Status Pesanan</h2>
<table>
  <tr><th>Tab</th><th>Menampilkan</th></tr>
  <tr><td>Semua</td><td>Seluruh pesanan</td></tr>
  <tr><td>Diproses</td><td>Sedang diproses penjual</td></tr>
  <tr><td>Dikirim</td><td>Dalam perjalanan</td></tr>
  <tr><td>Selesai</td><td>Sudah diterima</td></tr>
</table>

<h2>8.3 Detail Pesanan</h2>
<p>Informasi lengkap: ID pesanan, nama produk, jumlah, total harga, status, dan alamat pengiriman.</p>

<h2>8.4 Timeline Status Pesanan</h2>
<p>Visual timeline: Menunggu Bayar → Dibayar → Diproses → Dikirim → Selesai. Lingkaran terisi untuk status yang sudah tercapai, lingkaran kosong untuk yang belum.</p>

<h2>8.5 Membatalkan Pesanan</h2>
<p>Pesanan dengan status Menunggu Bayar atau Dibayar dapat dibatalkan. Klik <strong>"Batalkan Pesanan"</strong>, isi alasan, konfirmasi.</p>

<h2>8.6 Konfirmasi Pesanan Diterima</h2>
<p>Saat status Dikirim, klik <strong>"Pesanan Diterima"</strong> untuk mengonfirmasi. Status berubah menjadi Selesai.</p>

<h2>8.7 Hubungi Penjual</h2>
<p>Klik <strong>"Hubungi Penjual"</strong> untuk chat dengan penjual melalui halaman Chat.</p>

<!-- ============ BAB 9 ============ -->
<div class="page-break"></div>
<h1 id="bab9">Bab 9: Wishlist</h1>
<p>Halaman <strong>Wishlist</strong> menampilkan produk favorit yang Anda simpan.</p>
${imgTag("07-buyer-wishlist.png", "Gambar 9.1 — Halaman wishlist")}

<h2>9.1 Melihat Wishlist</h2>
<p>Produk dalam grid kartu (2 kolom mobile, 4 kolom desktop). Setiap kartu: foto, nama produk (link ke detail), harga, dan tombol Hapus.</p>

<h2>9.2 Menghapus dari Wishlist</h2>
<p>Klik tombol <strong>"Hapus"</strong> pada kartu atau klik ikon ❤️ (merah) di halaman detail produk. Notifikasi akan muncul.</p>

<h2>9.3 Kondisi Wishlist Kosong</h2>
<p>Tampilan: ikon heart, teks "Wishlist masih kosong", dan tombol <strong>"Jelajahi Marketplace"</strong>.</p>

<!-- ============ BAB 10 ============ -->
<div class="page-break"></div>
<h1 id="bab10">Bab 10: Scan QR Code</h1>
<p>Halaman <strong>Scan QR</strong> untuk memindai QR Code produk yang tertera pada produk WoodLoop.</p>
${imgTag("08-buyer-scan.png", "Gambar 10.1 — Halaman scan QR")}

<h2>10.1 Halaman Scan</h2>
<p>Arahkan kamera ke QR Code produk. Sistem akan mendeteksi secara otomatis dan mengarahkan ke halaman traceability publik di <code>/p/[qr_code_id]</code>.</p>
<div class="warn"><strong>Penting:</strong> Fitur kamera memerlukan izin akses kamera pada browser.</div>

<h2>10.2 Input Manual Kode QR</h2>
<p>Jika kamera tidak tersedia, ketik kode QR di kolom input dan klik <strong>"Cari"</strong> untuk langsung menuju halaman traceability.</p>

<!-- ============ BAB 11 ============ -->
<div class="page-break"></div>
<h1 id="bab11">Bab 11: Toko Penjual</h1>
<p>Halaman <strong>Toko Penjual</strong> menampilkan profil Converter dan semua produk mereka.</p>
${imgTag("09-buyer-seller-store.png", "Gambar 11.1 — Halaman toko penjual")}

<h2>11.1 Profil Penjual</h2>
<table>
  <tr><th>Elemen</th><th>Keterangan</th></tr>
  <tr><td>Avatar</td><td>Inisial nama dalam lingkaran</td></tr>
  <tr><td>Nama</td><td>Nama lengkap Converter</td></tr>
  <tr><td>Badge Terverifikasi</td><td>✓ Biru untuk akun terverifikasi</td></tr>
  <tr><td>Workshop</td><td>Nama workshop/toko</td></tr>
  <tr><td>Alamat &amp; Telepon</td><td>Kontak penjual</td></tr>
  <tr><td>Bio</td><td>Deskripsi profil</td></tr>
  <tr><td>Tombol Hubungi</td><td>Buka chat dengan penjual</td></tr>
</table>

<h2>11.2 Produk Penjual</h2>
<p>Grid produk milik penjual (foto, nama, harga, badge kategori). Klik produk untuk detail. Jika belum ada produk, tampilkan "Belum ada produk tersedia".</p>

<!-- ============ BAB 12 ============ -->
<div class="page-break"></div>
<h1 id="bab12">Bab 12: Traceability Publik (SEO)</h1>
<p>Halaman <strong>Traceability Publik</strong> bisa diakses tanpa login melalui <code>/p/[qr_code_id]</code>. Dioptimalkan untuk SEO dan social sharing.</p>
${imgTag("10-buyer-traceability-publik.png", "Gambar 12.1 — Halaman traceability publik")}

<h2>12.1 Halaman Publik Produk</h2>
<p>Menampilkan: logo WoodLoop, foto produk, nama, harga, deskripsi, badge dampak lingkungan, dan tombol "Lihat Detail Produk".</p>

<h2>12.2 Informasi SEO</h2>
<ul>
  <li><strong>Judul Halaman</strong>: "[Nama Produk] — WoodLoop Traceability"</li>
  <li><strong>Deskripsi</strong>: Cuplikan untuk Google</li>
  <li><strong>Open Graph</strong>: Metadata untuk social sharing</li>
  <li><strong>JSON-LD</strong>: Data terstruktur untuk Google Rich Snippets</li>
</ul>

<h2>12.3 Dampak Lingkungan</h2>
<table>
  <tr><th>Badge</th><th>Ikon</th><th>Arti</th></tr>
  <tr><td>Produk Daur Ulang</td><td>♻️</td><td>Dibuat dari bahan daur ulang</td></tr>
  <tr><td>Ramah Lingkungan</td><td>🌱</td><td>Berkontribusi pada lingkungan</td></tr>
</table>

<h2>12.4 Ajakan Beli</h2>
<p>Tombol <strong>"Lihat Detail Produk"</strong> mengarah ke halaman detail produk. Bagikan URL: <code>woodloop.pasarjepara.com/p/[qr_code_id]</code> ke media sosial.</p>

<!-- ============ BAB 13 ============ -->
<div class="page-break"></div>
<h1 id="bab13">Bab 13: Troubleshooting</h1>

<h2>13.1 Tidak Bisa Login</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Lupa password</td><td>Klik "Lupa Kata Sandi?" di halaman login</td></tr>
  <tr><td>Email salah</td><td>Periksa tidak ada spasi di depan/belakang</td></tr>
  <tr><td>Password salah</td><td>Password bersifat case-sensitive</td></tr>
  <tr><td>Koneksi internet</td><td>Periksa koneksi, coba refresh</td></tr>
</table>

<h2>13.2 Produk Tidak Muncul di Marketplace</h2>
<table>
  <tr><th>Kemungkinan</th><th>Saran</th></tr>
  <tr><td>Filter terlalu ketat</td><td>Reset filter harga dan kategori</td></tr>
  <tr><td>Pencarian sempit</td><td>Gunakan kata kunci yang lebih umum</td></tr>
  <tr><td>Belum ada produk</td><td>Refresh halaman, mungkin belum ada Converter mendaftarkan produk</td></tr>
</table>

<h2>13.3 Gagal Checkout</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Field wajib kosong</td><td>Isi nama penerima dan alamat lengkap</td></tr>
  <tr><td>Keranjang kosong</td><td>Tambahkan produk ke keranjang terlebih dahulu</td></tr>
  <tr><td>Koneksi terputus</td><td>Refresh halaman dan ulangi checkout</td></tr>
</table>

<h2>13.4 Pembayaran Midtrans Gagal</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Popup terblokir</td><td>Izinkan popup di browser</td></tr>
  <tr><td>Metode gagal</td><td>Coba metode lain (QRIS, VA, atau Bank Transfer)</td></tr>
  <tr><td>Ad-blocker</td><td>Nonaktifkan sementara</td></tr>
  <tr><td>Saldo tidak cukup</td><td>Periksa saldo dompet digital atau limit kartu</td></tr>
</table>

<h2>13.5 QR Code Tidak Terbaca</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Izin kamera ditolak</td><td>Izinkan akses kamera di browser</td></tr>
  <tr><td>Pencahayaan kurang</td><td>Pastikan pencahayaan cukup, hindari silau</td></tr>
  <tr><td>Kamera goyang</td><td>Pegang kamera stabil</td></tr>
  <tr><td>QR rusak</td><td>Gunakan input manual kode QR</td></tr>
</table>

<h2>13.6 Kontak Bantuan</h2>
<table>
  <tr><th>Saluran</th><th>Detail</th></tr>
  <tr><td>Email</td><td>woodloop.app@gmail.com</td></tr>
  <tr><td>Website</td><td>woodloop.pasarjepara.com</td></tr>
</table>
<p>Sertakan saat melapor: email akun, peran (Buyer), deskripsi masalah (screenshot jika perlu), dan langkah yang sudah dilakukan.</p>

</body>
</html>`;

const htmlPath = path.join(DIR, "manual-book-buyer.html");
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
