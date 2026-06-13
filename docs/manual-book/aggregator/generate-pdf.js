const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname);
const OUTPUT = path.join(__dirname, "Manual-Book-Aggregator-WoodLoop.pdf");
const SCREENSHOTS_DIR = path.join(__dirname, "..", "screenshots");

const SCREENSHOTS = {
  "14-aggregator-dashboard.png": path.join(SCREENSHOTS_DIR, "14-aggregator-dashboard.png"),
  "15-aggregator-treasure-map.png": path.join(SCREENSHOTS_DIR, "15-aggregator-treasure-map.png"),
  "16-aggregator-pickups.png": path.join(SCREENSHOTS_DIR, "16-aggregator-pickups.png"),
  "17-aggregator-warehouse.png": path.join(SCREENSHOTS_DIR, "17-aggregator-warehouse.png"),
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
<title>Manual Book WoodLoop — Aggregator</title>
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
  <h2>Manual Book — Aggregator</h2>
  <p style="font-size:14pt;color:#666;">Panduan Lengkap Pengepul & Logistik Kayu</p>
  <br/><br/>
  <p><strong>Versi 1.0 — Juni 2026</strong></p>
  <hr/>
  <p><em>"Menjemput Limbah, Menghubungkan Rantai Nilai"</em></p>
  <br/><br/><br/>
  <table style="width:auto;margin:0 auto;">
    <tr><td><strong>Peran</strong></td><td>Aggregator (Pengepul & Logistik)</td></tr>
    <tr><td><strong>Platform</strong></td><td>Web</td></tr>
    <tr><td><strong>Backend</strong></td><td>PocketBase</td></tr>
  </table>
  <br/>
  <p style="font-size:10pt;color:#999;">woodloop.pasarjepara.com</p>
</div>

<!-- ============ KATA PENGANTAR ============ -->
<div class="page-break"></div>
<h1>Kata Pengantar</h1>
<p>Puji syukur kehadirat Tuhan Yang Maha Esa atas terselesaikannya <strong>Manual Book WoodLoop — Panduan Khusus Aggregator</strong>.</p>
<p>Manual book ini disusun khusus untuk pengguna dengan peran <strong>Aggregator (Pengepul & Logistik)</strong> dalam ekosistem WoodLoop. Sebagai jembatan penting dalam alur ekonomi sirkular industri kayu Jepara, Aggregator memegang peranan vital — menjemput limbah kayu dari para Generator, menyortir dan menyimpannya di gudang, lalu menjualnya ke Converter sebagai bahan baku produksi.</p>
<p>Buku ini membahas secara detail seluruh fitur yang tersedia untuk Aggregator, mulai dari:</p>
<ul>
  <li><strong>Dashboard</strong> — ringkasan pickup dan stok gudang Anda</li>
  <li><strong>Treasure Map</strong> — peta interaktif untuk menemukan limbah tersedia</li>
  <li><strong>Bidding</strong> — mengajukan harga ke Generator</li>
  <li><strong>Penjemputan (Pickups)</strong> — mengelola pickup dan bukti serah terima</li>
  <li><strong>Gudang (Warehouse)</strong> — mengelola stok limbah, atur harga jual</li>
  <li><strong>Log Inventori</strong> — riwayat barang masuk dan keluar gudang</li>
  <li><strong>Profil Aggregator</strong> — informasi kontak</li>
</ul>
<p>Setiap fitur dijelaskan dengan langkah-langkah praktis yang dilengkapi tangkapan layar, sehingga Anda dapat langsung mempraktikkannya.</p>
<p>Kami berharap manual book ini membantu Anda memanfaatkan WoodLoop secara maksimal untuk mengembangkan bisnis pengepulan kayu yang lebih transparan, efisien, dan berkelanjutan.</p>
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
        <li>1.2 Peran Aggregator dalam Ekosistem</li>
        <li>1.3 Alur Bisnis Aggregator</li>
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
    <li><a href="#bab3">Bab 3: Dashboard Aggregator</a>
      <ul>
        <li>3.1 Ringkasan Kartu</li>
        <li>3.2 Penjemputan Terbaru</li>
        <li>3.3 Menu Cepat</li>
      </ul>
    </li>
    <li><a href="#bab4">Bab 4: Treasure Map &amp; Bidding</a>
      <ul>
        <li>4.1 Mengakses Treasure Map</li>
        <li>4.2 Pin Lokasi &amp; Urgensi Limbah</li>
        <li>4.3 Filter Peta</li>
        <li>4.4 Bidding (Lelang)</li>
        <li>4.5 Status Bid &amp; Real-time Notifikasi</li>
        <li>4.6 Ambil Langsung</li>
      </ul>
    </li>
    <li><a href="#bab5">Bab 5: Penjemputan (Pickups)</a>
      <ul>
        <li>5.1 Daftar Pickup</li>
        <li>5.2 Proses Pickup</li>
        <li>5.3 Membatalkan Pickup</li>
      </ul>
    </li>
    <li><a href="#bab6">Bab 6: Gudang (Warehouse)</a>
      <ul>
        <li>6.1 Ringkasan Gudang</li>
        <li>6.2 Mengatur Harga Jual</li>
        <li>6.3 Status Inventaris</li>
        <li>6.4 Detail Item Gudang</li>
      </ul>
    </li>
    <li><a href="#bab7">Bab 7: Log Inventori</a>
      <ul>
        <li>7.1 Barang Masuk</li>
        <li>7.2 Barang Keluar</li>
        <li>7.3 Riwayat Transaksi</li>
      </ul>
    </li>
    <li><a href="#bab8">Bab 8: Profil Aggregator</a>
      <ul>
        <li>8.1 Informasi Profil</li>
        <li>8.2 Edit Profil</li>
      </ul>
    </li>
    <li><a href="#bab9">Bab 9: Troubleshooting</a>
      <ul>
        <li>9.1 Tidak Bisa Login</li>
        <li>9.2 Treasure Map Tidak Memuat</li>
        <li>9.3 Bid Gagal Dikirim</li>
        <li>9.4 Pickup Tidak Bisa Dikonfirmasi</li>
        <li>9.5 Kontak Bantuan</li>
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

<h2>1.2 Peran Aggregator dalam Ekosistem</h2>
<p><strong>Aggregator</strong> adalah pihak yang <strong>menjemput limbah kayu</strong> dari para Generator, menyortirnya, menyimpannya di gudang, dan menjualnya ke Converter sebagai bahan baku produksi. Aggregator menjadi <strong>jembatan logistik</strong> dalam ekonomi sirkular WoodLoop.</p>
<p><strong>Contoh pengguna Aggregator:</strong></p>
<ul>
  <li>Pengepul kayu di Jepara</li>
  <li>Jasa angkutan / logistik kayu</li>
  <li>Pemilik gudang sortir kayu</li>
  <li>Pedagang perantara kayu</li>
</ul>
<p><strong>Alur peran Aggregator dalam ekosistem WoodLoop:</strong></p>
<pre>Supplier → (kayu gelondongan) → Generator → (limbah) → Aggregator → (bahan baku) → Converter → (produk jadi) → Buyer
                                                           ↓
                                                    (sortir & gudang)</pre>

<p><strong>Aggregator memiliki tiga aktivitas utama:</strong></p>
<ol>
  <li><strong>Menemukan limbah</strong> — Melalui Treasure Map, mencari limbah yang tersedia</li>
  <li><strong>Menjemput limbah</strong> — Mengajukan bid, menjadwalkan pickup, dan mengangkut limbah</li>
  <li><strong>Menjual ke Converter</strong> — Menyimpan di gudang dan menjual ke pasar bahan</li>
</ol>

<h2>1.3 Alur Bisnis Aggregator</h2>
<table>
  <tr><th>Langkah</th><th>Aktivitas</th><th>Halaman</th></tr>
  <tr><td>1</td><td>Login ke akun Aggregator</td><td>/login</td></tr>
  <tr><td>2</td><td>Melihat ringkasan bisnis</td><td>/aggregator/dashboard</td></tr>
  <tr><td>3</td><td>Menemukan limbah via Treasure Map</td><td>/aggregator/treasure-map</td></tr>
  <tr><td>4</td><td>Mengajukan bidding ke Generator</td><td>/aggregator/bidding</td></tr>
  <tr><td>5</td><td>Menjemput limbah</td><td>/aggregator/pickups</td></tr>
  <tr><td>6</td><td>Konfirmasi pickup &amp; bukti serah terima</td><td>/aggregator/pickups/[id]/confirm</td></tr>
  <tr><td>7</td><td>Mengelola stok gudang</td><td>/aggregator/warehouse</td></tr>
  <tr><td>8</td><td>Mengatur harga jual</td><td>/aggregator/warehouse/[id]</td></tr>
  <tr><td>9</td><td>Melihat log inventori</td><td>/aggregator/warehouse/log</td></tr>
  <tr><td>10</td><td>Mengelola profil</td><td>/aggregator/profile</td></tr>
</table>

<h2>1.4 Istilah Penting</h2>
<table>
  <tr><th>Istilah</th><th>Arti</th></tr>
  <tr><td>Treasure Map</td><td>Peta interaktif lokasi limbah tersedia</td></tr>
  <tr><td>Bid / Bidding</td><td>Penawaran harga dari Aggregator ke Generator</td></tr>
  <tr><td>Pickup</td><td>Proses penjemputan limbah di lokasi Generator</td></tr>
  <tr><td>Warehouse</td><td>Gudang penyimpanan limbah Aggregator</td></tr>
  <tr><td>Log Inventori</td><td>Riwayat barang masuk dan keluar gudang</td></tr>
  <tr><td>Sortir</td><td>Proses memilah limbah berdasarkan jenis/kualitas</td></tr>
  <tr><td>Konfirmasi GPS</td><td>Validasi lokasi saat pickup menggunakan GPS</td></tr>
  <tr><td>Berat Aktual</td><td>Berat limbah yang diverifikasi saat pickup</td></tr>
  <tr><td>Booking</td><td>Status limbah yang sudah diterima biddingnya</td></tr>
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
  <li>Akun Aggregator yang sudah terdaftar</li>
</ul>

<h2>2.2 Login</h2>
<ol>
  <li>Buka halaman utama WoodLoop</li>
  <li>Klik tombol <strong>"Lanjut"</strong> atau <strong>"Mulai"</strong> pada layar onboarding</li>
  <li>Pilih peran <strong>"Aggregator"</strong> pada layar pemilihan peran</li>
  <li>Klik <strong>"Konfirmasi"</strong></li>
  <li>Pada halaman login, masukkan email dan kata sandi</li>
  <li>Klik tombol <strong>"Masuk"</strong></li>
</ol>
${imgTag("14-aggregator-dashboard.png", "Gambar 2.1 — Dashboard Aggregator setelah login")}
<div class="note"><strong>Lupa Kata Sandi?</strong> Klik tautan "Lupa Kata Sandi?" di halaman login dan ikuti petunjuk untuk mereset kata sandi melalui email.</div>

<h2>2.3 Navigasi Antarmuka</h2>
<p>Setelah login, Anda akan melihat <strong>sidebar navigasi</strong> di sebelah kiri dengan menu berikut:</p>
<table>
  <tr><th>Menu</th><th>Ikon</th><th>Halaman</th><th>Fungsi</th></tr>
  <tr><td>Dashboard</td><td>📊</td><td>/aggregator/dashboard</td><td>Ringkasan pickup &amp; stok</td></tr>
  <tr><td>Peta Harta Karun</td><td>🗺️</td><td>/aggregator/treasure-map</td><td>Peta interaktif limbah</td></tr>
  <tr><td>Penjemputan</td><td>🚚</td><td>/aggregator/pickups</td><td>Jadwal penjemputan</td></tr>
  <tr><td>Gudang</td><td>🏗️</td><td>/aggregator/warehouse</td><td>Stok gudang Anda</td></tr>
  <tr><td>Lelang</td><td>🔨</td><td>/aggregator/bidding</td><td>Bidding limbah tersedia</td></tr>
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
<div class="warn"><strong>Penting:</strong> Menu navigasi hanya menampilkan fitur yang relevan dengan peran Aggregator. Setiap peran memiliki menu yang berbeda.</div>

<h2>2.4 Mode Gelap &amp; Ganti Bahasa</h2>
<p>Klik tombol <strong>"Mode Gelap"</strong> di bagian atas halaman untuk beralih antara tema terang dan gelap. Klik tombol <strong>"Ganti Bahasa"</strong> untuk beralih antara Bahasa Indonesia dan English. Pengaturan akan tersimpan secara otomatis untuk kunjungan berikutnya.</p>

<!-- ============ BAB 3 ============ -->
<div class="page-break"></div>
<h1 id="bab3">Bab 3: Dashboard Aggregator</h1>
<p>Dashboard Aggregator adalah halaman utama yang muncul setelah login. Di sini Anda dapat melihat ringkasan bisnis secara sekilas.</p>
${imgTag("14-aggregator-dashboard.png", "Gambar 3.1 — Dashboard Aggregator")}

<h2>3.1 Ringkasan Kartu (Summary Cards)</h2>
<table>
  <tr><th>Kartu</th><th>Ikon</th><th>Menampilkan</th></tr>
  <tr><td>Penjemputan Hari Ini</td><td>🚚</td><td>Jumlah pickup yang perlu dijadwalkan</td></tr>
  <tr><td>Stok Gudang</td><td>🏗️</td><td>Total volume limbah di gudang (kg)</td></tr>
  <tr><td>Bid Aktif</td><td>🔨</td><td>Jumlah bidding yang sedang berjalan</td></tr>
  <tr><td>Pendapatan</td><td>💰</td><td>Total pendapatan dari stok terjual</td></tr>
</table>

<h2>3.2 Penjemputan Terbaru</h2>
<p>Di bagian bawah dashboard, terdapat daftar <strong>penjemputan terbaru</strong> yang menampilkan pickup terkini Anda:</p>
<ul>
  <li>🚚 <strong>ID Pickup</strong> — Kode pickup dengan status dan tanggal</li>
  <li>Status bisa: pending (Perlu Dijemput), on_the_way (Sedang Diangkut), completed (Selesai)</li>
</ul>

<p>Jika belum ada pickup, akan tampil pesan: <em>"Belum ada penjemputan. Mulai dengan melihat peta!"</em></p>

<h2>3.3 Menu Cepat (Quick Actions)</h2>
<table>
  <tr><th>Tombol</th><th>Fungsi</th><th>Tujuan</th></tr>
  <tr><td>🗺️ Lihat Peta Harta Karun</td><td>Membuka Treasure Map</td><td>/aggregator/treasure-map</td></tr>
</table>

<!-- ============ BAB 4 ============ -->
<div class="page-break"></div>
<h1 id="bab4">Bab 4: Treasure Map &amp; Bidding</h1>
<p><strong>Treasure Map</strong> adalah fitur unggulan Aggregator — peta interaktif yang menampilkan lokasi limbah yang tersedia untuk dijemput. Dari peta ini Anda dapat melihat detail limbah dan langsung mengajukan bidding atau membuat pickup.</p>
${imgTag("15-aggregator-treasure-map.png", "Gambar 4.1 — Treasure Map dengan pin lokasi limbah")}

<h2>4.1 Mengakses Treasure Map</h2>
<table>
  <tr><th>Metode</th><th>Cara</th></tr>
  <tr><td>Sidebar</td><td>Klik menu <strong>"Peta Harta Karun"</strong> (🗺️) di sidebar navigasi</td></tr>
  <tr><td>Dashboard</td><td>Klik tombol <strong>"Lihat Peta Harta Karun"</strong> pada dashboard</td></tr>
</table>

<h2>4.2 Pin Lokasi &amp; Urgensi Limbah</h2>
<p>Setiap titik di peta adalah <strong>pin lokasi</strong> limbah yang tersedia. Warna pin menunjukkan <strong>tingkat urgensi</strong> berdasarkan usia pemasangan:</p>
<table>
  <tr><th>Warna Pin</th><th>Usia</th><th>Label Urgensi</th></tr>
  <tr><td>🟢 Hijau</td><td>Baru dipasang (&lt; 24 jam)</td><td>Baru</td></tr>
  <tr><td>🟡 Kuning</td><td>24 — 48 jam</td><td>&gt; 24 jam</td></tr>
  <tr><td>🔴 Merah</td><td>Lebih dari 48 jam</td><td>Urgent</td></tr>
</table>
<div class="tip">Prioritaskan pin merah (urgent) karena limbah sudah lama tersedia dan Generator mungkin lebih fleksibel negosiasi harga.</div>

<h3>Lokasi Pengguna</h3>
<p>Peta juga menampilkan <strong>titik lokasi Anda</strong> (biru) yang terdeteksi otomatis dari GPS perangkat.</p>

<h3>Interaksi dengan Pin</h3>
<ol>
  <li>Klik pin pada peta → muncul <strong>popup</strong> dengan info singkat</li>
  <li>Klik pin untuk membuka <strong>bottom sheet detail</strong> berisi: foto, jenis kayu, bentuk, volume, harga estimasi, nama Generator, label urgensi</li>
  <li>Tombol aksi: <strong>"Ambil Langsung"</strong> (direct pickup) dan <strong>"Ajukan Bid"</strong></li>
</ol>

<h2>4.3 Filter Peta</h2>
<p>Panel filter dapat dibuka dari pojok kanan peta:</p>
<table>
  <tr><th>Filter</th><th>Fungsi</th></tr>
  <tr><td>Jenis Kayu</td><td>Tampilkan hanya jenis kayu tertentu (Jati, Mahoni, Trembesi, dll)</td></tr>
  <tr><td>Bentuk</td><td>Filter berdasarkan bentuk limbah</td></tr>
  <tr><td>Harga Maksimal</td><td>Batasi harga estimasi maksimal</td></tr>
  <tr><td>Reset Filter</td><td>Kembalikan semua filter ke default</td></tr>
</table>

<h2>4.4 Bidding (Lelang)</h2>
<p>Halaman Lelang (<code>/aggregator/bidding</code>) memiliki dua tab.</p>

<h3>Tab 1: Lelang Tersedia</h3>
<p>Menampilkan seluruh limbah yang bisa dibid dalam bentuk kartu:</p>
<table>
  <tr><th>Info pada Kartu</th><th>Keterangan</th></tr>
  <tr><td>Jenis Kayu</td><td>Nama kayu dan bentuk</td></tr>
  <tr><td>Volume</td><td>Jumlah dengan satuan</td></tr>
  <tr><td>Estimasi Harga</td><td>Harga yang diharapkan Generator</td></tr>
  <tr><td>Nama Generator</td><td>Pemilik limbah</td></tr>
  <tr><td>Tombol</td><td>"Ajukan Bid" — membuka dialog bidding</td></tr>
</table>

<h3>Mengajukan Bid</h3>
<ol>
  <li>Dari Treasure Map: klik pin → klik <strong>"Ajukan Bid"</strong></li>
  <li>Atau dari halaman Lelang: klik <strong>"Ajukan Bid"</strong> pada kartu</li>
  <li>Dialog bidding:</li>
</ol>
<table>
  <tr><th>Field</th><th>Keterangan</th></tr>
  <tr><td>Harga Bid</td><td>Jumlah tawaran — minimal sama dengan estimasi</td></tr>
  <tr><td>Pesan (opsional)</td><td>Pesan untuk Generator</td></tr>
</table>
<div class="warn">Harga bid tidak boleh kurang dari harga estimasi yang ditentukan Generator.</div>

<h3>Tab 2: Bid Saya</h3>
<p>Menampilkan seluruh bid yang sudah Anda ajukan:</p>
<table>
  <tr><th>Kolom</th><th>Keterangan</th></tr>
  <tr><td>Jenis Kayu</td><td>Kayu yang ditawar</td></tr>
  <tr><td>Jumlah Bid</td><td>Harga yang Anda tawarkan</td></tr>
  <tr><td>Status</td><td>pending / accepted / rejected</td></tr>
</table>

<h2>4.5 Status Bid &amp; Real-time Notifikasi</h2>
<table>
  <tr><th>Status</th><th>Arti</th></tr>
  <tr><td>⏳ Pending</td><td>Generator belum merespon</td></tr>
  <tr><td>✅ Accepted</td><td>Generator menyetujui bid — pickup otomatis dibuat</td></tr>
  <tr><td>❌ Rejected</td><td>Generator menolak bid Anda</td></tr>
</table>
<p><strong>Real-time notification:</strong> Sistem menggunakan real-time subscription. Saat bid diterima, muncul toast sukses dengan tombol "Lihat Pickup" yang langsung membawa ke halaman Penjemputan. Saat bid ditolak, muncul toast informasi.</p>

<h2>4.6 Ambil Langsung (Direct Pickup)</h2>
<p>Opsi <strong>"Ambil Langsung"</strong> pada Treasure Map langsung membuat pickup tanpa proses bidding — cocok jika Anda dan Generator sudah sepakat di luar sistem. Pickup langsung dibuat dengan status <strong>pending</strong>.</p>

<!-- ============ BAB 5 ============ -->
<div class="page-break"></div>
<h1 id="bab5">Bab 5: Penjemputan (Pickups)</h1>
<p>Setelah bid diterima, langkah selanjutnya adalah <strong>menjemput limbah</strong> ke lokasi Generator.</p>
${imgTag("16-aggregator-pickups.png", "Gambar 5.1 — Halaman daftar penjemputan")}

<h2>5.1 Daftar Pickup</h2>
<p>Halaman pickups menggunakan sistem <strong>tab</strong>:</p>
<table>
  <tr><th>Tab</th><th>Status</th><th>Isi</th></tr>
  <tr><td>Perlu Dijemput</td><td>pending</td><td>Pickup yang menunggu Anda berangkat</td></tr>
  <tr><td>Sedang Diangkut</td><td>on_the_way</td><td>Pickup dalam perjalanan</td></tr>
  <tr><td>Selesai</td><td>completed</td><td>Riwayat pickup selesai</td></tr>
  <tr><td>Semua</td><td>Semua status</td><td>Seluruh pickup tanpa filter</td></tr>
</table>

<h3>Kartu Pickup</h3>
<table>
  <tr><th>Elemen</th><th>Keterangan</th></tr>
  <tr><td>Nama Kayu &amp; Bentuk</td><td>Dari waste_listing terkait</td></tr>
  <tr><td>Badge Status</td><td>Label status dengan warna</td></tr>
  <tr><td>Volume</td><td>Jumlah volume limbah</td></tr>
  <tr><td>Tanggal Terjadwal</td><td>Tanggal pickup (jika ada)</td></tr>
  <tr><td>Progress Bar</td><td>25% (pending) → 60% (on_the_way) → 100% (completed)</td></tr>
</table>

<h2>5.2 Proses Pickup</h2>

<h3>Tahap 1: Menjemput (Pending → On The Way)</h3>
<ul>
  <li>Klik <strong>"Jemput"</strong> — status berubah menjadi "Sedang Diangkut"</li>
  <li>Atau langsung klik <strong>"Selesai"</strong> jika sudah di lokasi</li>
</ul>

<h3>Tahap 2: Konfirmasi (On The Way → Completed)</h3>
<p>Klik <strong>"Konfirmasi"</strong> atau <strong>"Selesai"</strong> untuk membuka halaman konfirmasi dengan 3 bagian:</p>

<p><strong>A. Foto Bukti</strong></p>
<ul>
  <li>Klik area upload → kamera mobile atau file dialog</li>
  <li>Format JPG/PNG, otomatis di-resize</li>
</ul>

<p><strong>B. Lokasi Pickup (GPS)</strong></p>
<ul>
  <li>Klik <strong>"Rekam Lokasi Saat Ini"</strong></li>
  <li>Browser meminta izin lokasi — klik "Izinkan"</li>
  <li>Koordinat Latitude &amp; Longitude terekam</li>
</ul>
<div class="warn">Pastikan GPS perangkat aktif. Tanpa lokasi, pickup tidak bisa divalidasi.</div>

<p><strong>C. Berat Aktual</strong></p>
<table>
  <tr><th>Field</th><th>Wajib</th><th>Contoh</th></tr>
  <tr><td>Berat (kg)</td><td>✅</td><td>150.5</td></tr>
  <tr><td>Catatan</td><td>❌</td><td>"Limbah dalam kondisi kering"</td></tr>
</table>

<p><strong>Menyelesaikan:</strong> Klik <strong>"Konfirmasi &amp; Selesaikan"</strong>. Sistem otomatis: membuat stok gudang, mengkredit dompet Generator, mencatat impact metrics, dan mengirim notifikasi.</p>

<h2>5.3 Membatalkan Pickup</h2>
<p>Klik ikon <strong>X</strong> (merah) pada kartu pickup dengan status pending atau on_the_way. Status limbah akan kembali menjadi Tersedia.</p>

<!-- ============ BAB 6 ============ -->
<div class="page-break"></div>
<h1 id="bab6">Bab 6: Gudang (Warehouse)</h1>
<p>Setelah pickup selesai, limbah otomatis masuk ke <strong>Gudang</strong>. Di sini Anda mengelola stok dan menentukan harga jual.</p>
${imgTag("17-aggregator-warehouse.png", "Gambar 6.1 — Halaman inventaris gudang")}

<h2>6.1 Ringkasan Gudang</h2>
<table>
  <tr><th>Kartu</th><th>Menampilkan</th></tr>
  <tr><td>Total Berat</td><td>Total berat seluruh limbah (kg)</td></tr>
  <tr><td>Total Nilai</td><td>Estimasi total nilai stok</td></tr>
</table>

<h3>Filter Status</h3>
<table>
  <tr><th>Filter</th><th>Status</th><th>Keterangan</th></tr>
  <tr><td>Semua Status</td><td>Semua</td><td>Seluruh item</td></tr>
  <tr><td>Dalam Stok</td><td>in_stock</td><td>Tersedia untuk dijual</td></tr>
  <tr><td>Dipesan</td><td>reserved</td><td>Sudah dipesan Converter</td></tr>
  <tr><td>Terjual</td><td>sold</td><td>Sudah terjual</td></tr>
</table>

<h3>Tabel Inventaris</h3>
<table>
  <tr><th>Kolom</th><th>Keterangan</th></tr>
  <tr><td>Jenis Kayu</td><td>Nama kayu — klik untuk detail</td></tr>
  <tr><td>Bentuk</td><td>Bentuk limbah</td></tr>
  <tr><td>Berat (kg)</td><td>Berat aktual</td></tr>
  <tr><td>Harga/kg (Rp)</td><td>Input inline — edit langsung</td></tr>
  <tr><td>Status</td><td>Badge warna</td></tr>
  <tr><td>Total Nilai</td><td>Berat × Harga/kg</td></tr>
</table>

<h2>6.2 Mengatur Harga Jual</h2>
<p><strong>Dari tabel:</strong> Ketik harga di kolom "Harga/kg", klik di luar field (onBlur) → otomatis tersimpan.</p>
<p><strong>Dari halaman detail:</strong> Klik nama kayu → masuk detail → bagian "Set Harga Jual" → input harga → klik "Simpan".</p>
<div class="tip">Pantau harga pasar secara berkala dan sesuaikan harga jual agar kompetitif.</div>

<h2>6.3 Status Inventaris</h2>
<table>
  <tr><th>Status</th><th>Arti</th></tr>
  <tr><td>Dalam Stok (in_stock)</td><td>Siap dijual, harga bisa diubah, tampil di Pasar Bahan</td></tr>
  <tr><td>Dipesan (reserved)</td><td>Sudah dipesan Converter, menunggu pembayaran</td></tr>
  <tr><td>Terjual (sold)</td><td>Sudah dibeli, transaksi selesai</td></tr>
</table>

<h2>6.4 Detail Item Gudang</h2>
<p>Halaman detail (<code>/aggregator/warehouse/[id]</code>) menampilkan:</p>
<ul>
  <li><strong>Foto</strong> — Gambar limbah dari pickup</li>
  <li><strong>Info item</strong> — Jenis kayu, bentuk, berat, total nilai, status</li>
  <li><strong>Set Harga Jual</strong> — Input harga per kg dengan tombol simpan</li>
  <li><strong>Asal Pickup</strong> — Generator, bentuk asli, volume, tanggal pickup</li>
</ul>

<!-- ============ BAB 7 ============ -->
<div class="page-break"></div>
<h1 id="bab7">Bab 7: Log Inventori</h1>
<p>Halaman <strong>Log Inventori</strong> (<code>/aggregator/warehouse/log</code>) menampilkan riwayat barang masuk dan keluar dalam tampilan dua kolom.</p>

<h2>7.1 Barang Masuk</h2>
<p>Item dengan status <strong>Dalam Stok</strong> (<code>in_stock</code>):</p>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Nama Kayu &amp; Bentuk</td><td>Jenis kayu dan bentuk limbah</td></tr>
  <tr><td>Berat</td><td>Berat dalam kg</td></tr>
  <tr><td>Harga/kg</td><td>Jika sudah diatur</td></tr>
  <tr><td>Tanggal Masuk</td><td>Tanggal item masuk gudang</td></tr>
</table>

<h2>7.2 Barang Keluar</h2>
<p>Item dengan status <strong>Terjual</strong> (<code>sold</code>):</p>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Nama Kayu &amp; Bentuk</td><td>Jenis kayu dan bentuk limbah</td></tr>
  <tr><td>Berat</td><td>Berat dalam kg</td></tr>
  <tr><td>Tanggal Keluar</td><td>Tanggal item terjual</td></tr>
</table>

<div class="tip">Gunakan Log Inventori secara berkala untuk memantau perputaran stok. Item yang terlalu lama di stok sebaiknya diturunkan harga jualnya.</div>

<!-- ============ BAB 8 ============ -->
<div class="page-break"></div>
<h1 id="bab8">Bab 8: Profil Aggregator</h1>
<p>Halaman profil menampilkan informasi pribadi akun Aggregator dan dapat diedit sesuai kebutuhan.</p>

<h2>8.1 Informasi Profil</h2>
<table>
  <tr><th>Field</th><th>Keterangan</th></tr>
  <tr><td>Nama</td><td>Nama lengkap atau nama usaha</td></tr>
  <tr><td>Email</td><td>Alamat email terdaftar (tidak bisa diubah)</td></tr>
  <tr><td>No. Telepon</td><td>Nomor kontak yang bisa dihubungi</td></tr>
  <tr><td>Alamat</td><td>Alamat gudang atau tempat usaha</td></tr>
</table>

<h2>8.2 Edit Profil</h2>
<ol>
  <li>Klik tombol <strong>"Edit Profil"</strong></li>
  <li>Ubah field: Nama (wajib), No. Telepon (opsional), Alamat (opsional)</li>
  <li>Klik <strong>"Simpan"</strong></li>
</ol>
<div class="tip">Pastikan nomor telepon dan alamat selalu terbaru agar Generator bisa menghubungi Anda.</div>

<p>Profil dapat diakses melalui dropdown avatar pojok kanan atas atau URL <code>/aggregator/profile</code>.</p>

<!-- ============ BAB 9 ============ -->
<div class="page-break"></div>
<h1 id="bab9">Bab 9: Troubleshooting</h1>

<h2>9.1 Tidak Bisa Login</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Lupa password</td><td>Klik "Lupa Kata Sandi?" di halaman login, ikuti instruksi reset</td></tr>
  <tr><td>Email tidak terdaftar</td><td>Pastikan mendaftar dengan peran Aggregator terlebih dahulu</td></tr>
  <tr><td>Salah peran</td><td>Pastikan memilih Aggregator saat login</td></tr>
  <tr><td>Browser error</td><td>Coba browser berbeda atau mode incognito</td></tr>
</table>

<h2>9.2 Treasure Map Tidak Memuat</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Peta kosong</td><td>Mungkin belum ada limbah tersedia, perluas filter jarak</td></tr>
  <tr><td>Peta tidak muncul</td><td>Pastikan koneksi internet stabil (Leaflet tile map eksternal)</td></tr>
  <tr><td>Izin lokasi ditolak</td><td>Peta tetap bisa digunakan, hanya routing terbatas</td></tr>
</table>

<h2>9.3 Bid Gagal Dikirim</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Bid di bawah estimasi</td><td>Sistem mewajibkan bid minimal sesuai estimasi Generator</td></tr>
  <tr><td>Koneksi terputus</td><td>Coba kirim ulang</td></tr>
  <tr><td>Limbah berubah status</td><td>Mungkin sudah dibooking Aggregator lain</td></tr>
</table>

<h2>9.4 Pickup Tidak Bisa Dikonfirmasi</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>GPS tidak terdeteksi</td><td>Aktifkan GPS, coba di luar ruangan</td></tr>
  <tr><td>Foto gagal upload</td><td>Periksa ukuran file, gunakan JPG/PNG</td></tr>
  <tr><td>Berat tidak terisi</td><td>Field berat aktual wajib diisi</td></tr>
  <tr><td>Tombol non-aktif</td><td>Pastikan foto, GPS, dan berat sudah diisi</td></tr>
</table>

<h2>9.5 Kontak Bantuan</h2>
<table>
  <tr><th>Saluran</th><th>Detail</th></tr>
  <tr><td>Email</td><td>woodloop.app@gmail.com</td></tr>
  <tr><td>Website</td><td>woodloop.pasarjepara.com</td></tr>
</table>
<p>Sertakan: nama akun, deskripsi masalah, screenshot error, dan waktu kejadian.</p>

</body>
</html>`;

const htmlPath = path.join(DIR, "manual-book-aggregator.html");
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
