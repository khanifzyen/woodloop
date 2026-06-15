const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "manual-book/enabler");
const OUTPUT = path.join(__dirname, "manual-book/enabler/Manual-Book-Enabler-WoodLoop.pdf");

const SCREENSHOTS = {
  "01-enabler-dashboard.png": path.join(DIR, "01-enabler-dashboard.png"),
  "02-enabler-users.png": path.join(DIR, "02-enabler-users.png"),
  "03-enabler-user-detail.png": path.join(DIR, "03-enabler-user-detail.png"),
  "04-enabler-profile.png": path.join(DIR, "04-enabler-profile.png"),
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
<title>Manual Book WoodLoop — Enabler</title>
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
  <h2>Manual Book — Enabler</h2>
  <p style="font-size:14pt;color:#666;">Panduan Lengkap Pemantau Ekosistem</p>
  <br/><br/>
  <p><strong>Versi 1.0 — Juni 2026</strong></p>
  <hr/>
  <p><em>"Memantau Dampak, Mendorong Keberlanjutan"</em></p>
  <br/><br/><br/>
  <table style="width:auto;margin:0 auto;">
    <tr><td><strong>Peran</strong></td><td>Enabler (Pemerintah &amp; Asosiasi)</td></tr>
    <tr><td><strong>Platform</strong></td><td>Web</td></tr>
    <tr><td><strong>Backend</strong></td><td>PocketBase</td></tr>
  </table>
  <br/>
  <p style="font-size:10pt;color:#999;">woodloop.pasarjepara.com</p>
</div>

<!-- ============ KATA PENGANTAR ============ -->
<div class="page-break"></div>
<h1>Kata Pengantar</h1>
<p>Puji syukur kehadirat Tuhan Yang Maha Esa atas terselesaikannya <strong>Manual Book WoodLoop — Panduan Khusus Enabler</strong>.</p>
<p>Manual book ini disusun khusus untuk pengguna dengan peran <strong>Enabler (Pemerintah &amp; Asosiasi)</strong> dalam ekosistem WoodLoop. Sebagai pemantau ekosistem, Enabler memegang peranan strategis — memantau dampak lingkungan dan ekonomi dari seluruh aktivitas ekonomi sirkular di WoodLoop, memverifikasi pengguna, dan memastikan platform berjalan sesuai regulasi.</p>
<p>Buku ini membahas secara detail seluruh fitur yang tersedia untuk Enabler, mulai dari:</p>
<ul>
  <li><strong>Dashboard</strong> — analitik dampak (limbah, CO₂, nilai ekonomi)</li>
  <li><strong>Manajemen User</strong> — lihat, saring, dan verifikasi seluruh pengguna platform</li>
  <li><strong>Detail User</strong> — tinjau dokumen legalitas dan data pengguna spesifik</li>
  <li><strong>Profil Enabler</strong> — kelola data diri</li>
  <li><strong>Ekspor Data</strong> — untuk keperluan pelaporan</li>
</ul>
<p>Kami berharap manual book ini membantu Anda memanfaatkan WoodLoop secara maksimal untuk memantau dan mendorong keberlanjutan industri kayu di Jepara.</p>
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
        <li>1.2 Peran Enabler dalam Ekosistem</li>
        <li>1.3 Alur Kerja Enabler</li>
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
    <li><a href="#bab3">Bab 3: Dashboard Enabler</a>
      <ul>
        <li>3.1 Ringkasan Kartu (Summary Cards)</li>
        <li>3.2 Grafik Analitik</li>
        <li>3.3 Distribusi Peran</li>
        <li>3.4 Filter Periode &amp; Ekspor Data</li>
      </ul>
    </li>
    <li><a href="#bab4">Bab 4: Manajemen User</a>
      <ul>
        <li>4.1 Melihat Daftar Pengguna</li>
        <li>4.2 Filter &amp; Pencarian</li>
        <li>4.3 Verifikasi Akun</li>
      </ul>
    </li>
    <li><a href="#bab5">Bab 5: Detail User</a>
      <ul>
        <li>5.1 Profil Pengguna</li>
        <li>5.2 Statistik Aktivitas</li>
        <li>5.3 Review Dokumen Legalitas</li>
      </ul>
    </li>
    <li><a href="#bab6">Bab 6: Profil Enabler</a>
      <ul>
        <li>6.1 Informasi Akun</li>
        <li>6.2 Menyimpan Perubahan</li>
      </ul>
    </li>
    <li><a href="#bab7">Bab 7: Troubleshooting</a>
      <ul>
        <li>7.1 Tidak Bisa Login</li>
        <li>7.2 Data Tidak Muncul</li>
        <li>7.3 Verifikasi Gagal</li>
        <li>7.4 Ekspor Data Tidak Terdownload</li>
        <li>7.5 Kontak Bantuan</li>
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

<h2>1.2 Peran Enabler dalam Ekosistem</h2>
<p><strong>Enabler</strong> adalah pihak yang memantau dampak lingkungan dan ekonomi dari kegiatan ekonomi sirkular di WoodLoop. Enabler bertindak sebagai <strong>pengawas dan pemangku kepentingan</strong> yang memastikan transparansi dan akuntabilitas ekosistem.</p>
<p><strong>Contoh pengguna Enabler:</strong></p>
<ul>
  <li>Dinas Lingkungan Hidup Jepara</li>
  <li>ASMINDO (Asosiasi Industri Permebelan dan Kerajinan Indonesia)</li>
  <li>Dinas Perindustrian dan Perdagangan</li>
  <li>Lembaga sertifikasi kayu (SVLK/FSC)</li>
  <li>Organisasi lingkungan</li>
</ul>
<p><strong>Alur peran Enabler dalam ekosistem WoodLoop:</strong></p>
<pre>Supplier → Generator → Aggregator → Converter → Buyer
    ↑_______________________________________________|
                    Enabler (monitoring)</pre>
<p>Enabler <strong>tidak bertransaksi</strong> di platform, melainkan mengawasi seluruh alur untuk:</p>
<ul>
  <li>Menghitung total limbah yang berhasil dialihkan dari TPA</li>
  <li>Mengestimasi emisi karbon (CO₂) yang terhindarkan</li>
  <li>Memantau nilai ekonomi sirkular</li>
  <li>Memverifikasi akun pengguna agar ekosistem tetap terpercaya</li>
</ul>

<h2>1.3 Alur Kerja Enabler</h2>
<table>
  <tr><th>Langkah</th><th>Aktivitas</th><th>Halaman</th></tr>
  <tr><td>1</td><td>Login ke akun Enabler</td><td>/login</td></tr>
  <tr><td>2</td><td>Melihat dashboard analitik dampak</td><td>/enabler/dashboard</td></tr>
  <tr><td>3</td><td>Mengekspor data dampak (CSV)</td><td>/enabler/dashboard</td></tr>
  <tr><td>4</td><td>Melihat daftar pengguna</td><td>/enabler/users</td></tr>
  <tr><td>5</td><td>Memverifikasi akun pengguna</td><td>/enabler/users</td></tr>
  <tr><td>6</td><td>Melihat detail &amp; dokumen pengguna</td><td>/enabler/users/[id]</td></tr>
  <tr><td>7</td><td>Mengelola profil sendiri</td><td>/enabler/profile</td></tr>
</table>

<h2>1.4 Istilah Penting</h2>
<table>
  <tr><th>Istilah</th><th>Arti</th></tr>
  <tr><td>Impact Metrics</td><td>Metrik dampak: limbah terpakai, CO₂ tersimpan, nilai ekonomi</td></tr>
  <tr><td>Limbah Terpakai</td><td>Total limbah kayu yang berhasil dialihkan dari TPA (kg)</td></tr>
  <tr><td>CO₂ Tersimpan</td><td>Estimasi emisi karbon yang terhindarkan (kg CO₂)</td></tr>
  <tr><td>Nilai Ekonomi</td><td>Total nilai transaksi di ekosistem WoodLoop (Rp)</td></tr>
  <tr><td>Verifikasi Akun</td><td>Proses menyetujui atau menolak akun pengguna</td></tr>
  <tr><td>User Documents</td><td>Dokumen legalitas yang diupload pengguna</td></tr>
  <tr><td>Supplier</td><td>Pemasok kayu gelondongan</td></tr>
  <tr><td>Generator</td><td>Pengrajin yang menghasilkan limbah kayu</td></tr>
  <tr><td>Aggregator</td><td>Pengepul limbah kayu</td></tr>
  <tr><td>Converter</td><td>Pengrajin upcycle (produk daur ulang)</td></tr>
  <tr><td>Buyer</td><td>Pembeli produk furnitur</td></tr>
  <tr><td>Designer</td><td>Desainer furnitur sirkular</td></tr>
</table>

<!-- ============ BAB 2 ============ -->
<div class="page-break"></div>
<h1 id="bab2">Bab 2: Memulai</h1>

<h2>2.1 Akses ke Aplikasi</h2>
<p>Akses WoodLoop melalui browser web di alamat:</p>
<pre>https://woodloop.pasarjepara.com</pre>
<p><strong>Kebutuhan Sistem:</strong></p>
<ul>
  <li>Browser: Chrome, Firefox, Edge, atau Safari versi terbaru</li>
  <li>Koneksi internet stabil</li>
</ul>

<h2>2.2 Login</h2>
<p>1. Buka halaman login di <code>https://woodloop.pasarjepara.com/login</code></p>
<p>2. Masukkan <strong>email</strong> dan <strong>kata sandi</strong> yang sudah didaftarkan</p>
<p>3. Klik tombol <strong>"Masuk"</strong></p>
<p>4. Setelah berhasil, Anda akan diarahkan ke <strong>Dashboard Enabler</strong></p>
<div class="note"><strong>Lupa Kata Sandi?</strong> Klik link "Lupa Kata Sandi?" di halaman login, masukkan email Anda, dan ikuti instruksi yang dikirim ke email.</div>
<div class="warn"><strong>Perhatian:</strong> Akun Enabler hanya dibuat oleh administrator — tidak bisa registrasi mandiri. Hubungi tim WoodLoop jika Anda belum memiliki akun.</div>

<h2>2.3 Navigasi Antarmuka</h2>

<h3>Sidebar Kiri</h3>
<table>
  <tr><th>Menu</th><th>Fungsi</th><th>Link</th></tr>
  <tr><td>Dashboard</td><td>Analitik dampak &amp; ekspor data</td><td>/enabler/dashboard</td></tr>
  <tr><td>Manajemen User</td><td>Kelola &amp; verifikasi pengguna</td><td>/enabler/users</td></tr>
</table>

<h3>Navigasi Atas (Navbar)</h3>
<table>
  <tr><th>Elemen</th><th>Fungsi</th></tr>
  <tr><td>Mode Gelap</td><td>Tombol toggle gelap/terang</td></tr>
  <tr><td>Ganti Bahasa</td><td>Beralih EN/ID</td></tr>
  <tr><td>Notifikasi</td><td>Notifikasi masuk</td></tr>
  <tr><td>Avatar</td><td>Dropdown: Profil | Keluar</td></tr>
</table>

<h3>Breadcrumb</h3>
<p>Di bawah navbar, terdapat breadcrumb yang menunjukkan posisi halaman. Contoh: <code>Enabler > Dashboard</code>.</p>

<h2>2.4 Mode Gelap &amp; Ganti Bahasa</h2>
<p>Klik tombol 🌓 di pojok kanan atas navbar untuk mengganti antara Mode Terang (default) dan Mode Gelap.</p>
<p>Klik tombol 🌐 di navbar untuk mengganti bahasa antarmuka: Bahasa Indonesia (default) atau English.</p>

<!-- ============ BAB 3 ============ -->
<div class="page-break"></div>
<h1 id="bab3">Bab 3: Dashboard Enabler</h1>
<p>Halaman Dashboard Enabler menampilkan <strong>analitik dampak lingkungan dan ekonomi</strong> dari seluruh aktivitas di platform WoodLoop.</p>
${imgTag("01-enabler-dashboard.png", "Gambar 3.1 — Dashboard Enabler")}

<h2>3.1 Ringkasan Kartu (Summary Cards)</h2>
<table>
  <tr><th>Kartu</th><th>Menampilkan</th><th>Satuan</th></tr>
  <tr><td>Limbah Terpakai</td><td>Total limbah yang berhasil dialihkan dari TPA</td><td>kg</td></tr>
  <tr><td>CO₂ Tersimpan</td><td>Estimasi emisi karbon yang terhindarkan</td><td>kg CO₂</td></tr>
  <tr><td>Nilai Ekonomi</td><td>Total nilai transaksi di ekosistem</td><td>Rp</td></tr>
  <tr><td>Total Pengguna</td><td>Jumlah pengguna yang terdaftar</td><td>orang</td></tr>
</table>
<p>Nilai ditampilkan dalam format yang mudah dibaca, misal: <code>15.000 kg</code>, <code>Rp 125.000.000</code>.</p>

<h2>3.2 Grafik Analitik</h2>
<h3>Limbah per Bulan (Bar Chart)</h3>
<p>Grafik batang hijau menampilkan tren limbah kayu yang berhasil dikelola setiap bulan. Sumbu X: bulan, Sumbu Y: total limbah (kg). Tooltip menampilkan nilai detail saat hover.</p>

<h3>Tren CO₂ Tersimpan (Line Chart)</h3>
<p>Grafik garis biru menampilkan estimasi CO₂ yang terhindarkan setiap bulan. Semakin tinggi garis, semakin besar dampak lingkungan positif dari ekosistem.</p>

<h3>Nilai Ekonomi per Bulan (Area Chart)</h3>
<p>Grafik area kuning/emas menampilkan nilai transaksi ekonomi sirkular setiap bulan. Menunjukkan kontribusi ekonomi dari ekonomi sirkular kayu di Jepara.</p>

<div class="tip"><strong>Catatan:</strong> Jika data belum tersedia, grafik menampilkan "Belum ada data". Data terisi otomatis seiring aktivitas platform.</div>

<h2>3.3 Distribusi Peran</h2>
<p>Diagram batang horizontal menampilkan jumlah pengguna per peran (Supplier, Generator, Aggregator, Converter, Buyer, Enabler, Designer). Setiap batang proporsional terhadap peran dengan pengguna terbanyak.</p>

<h2>3.4 Filter Periode &amp; Ekspor Data</h2>
<h3>Filter Periode</h3>
<table>
  <tr><th>Opsi</th><th>Menampilkan Data</th></tr>
  <tr><td>Semua Waktu</td><td>Seluruh data sejak awal</td></tr>
  <tr><td>1 Bulan</td><td>30 hari terakhir</td></tr>
  <tr><td>3 Bulan</td><td>90 hari terakhir</td></tr>
  <tr><td>1 Tahun</td><td>365 hari terakhir</td></tr>
</table>
<p>Saat periode diubah, seluruh kartu KPI dan grafik diperbarui otomatis.</p>

<h3>Ekspor Data (CSV)</h3>
<p>Klik tombol <strong>"Export CSV"</strong> untuk mengunduh data dampak. File berisi kolom: Periode, Limbah (kg), CO₂ (kg), Nilai Ekonomi (Rp), Total Pengguna — plus baris TOTAL di akhir. File dinamai <code>woodloop-impact-data-YYYY-MM-DD.csv</code>.</p>

<!-- ============ BAB 4 ============ -->
<div class="page-break"></div>
<h1 id="bab4">Bab 4: Manajemen User</h1>
<p>Halaman <strong>Manajemen User</strong> menampilkan seluruh pengguna yang terdaftar di WoodLoop. Dari halaman ini Anda dapat melihat, mencari, menyaring, dan memverifikasi akun pengguna.</p>
${imgTag("02-enabler-users.png", "Gambar 4.1 — Halaman manajemen pengguna")}

<h2>4.1 Melihat Daftar Pengguna</h2>
<table>
  <tr><th>Kolom</th><th>Keterangan</th></tr>
  <tr><td>Nama</td><td>Nama lengkap pengguna</td></tr>
  <tr><td>Email</td><td>Email terdaftar</td></tr>
  <tr><td>Role</td><td>Supplier, Generator, Aggregator, Converter, Buyer, Enabler, Designer</td></tr>
  <tr><td>Workshop</td><td>Nama workshop/usaha (jika diisi)</td></tr>
  <tr><td>Verifikasi</td><td>Badge hijau "Terverifikasi" atau abu-abu "Belum"</td></tr>
  <tr><td>Aksi</td><td>Tombol Detail &amp; Verifikasi (muncul saat hover)</td></tr>
</table>

<h2>4.2 Filter &amp; Pencarian</h2>
<h3>Pencarian Teks</h3>
<p>Ketik kata kunci di kolom "Cari nama/email..." untuk mencari berdasarkan nama lengkap, email, atau nama workshop.</p>

<h3>Filter Peran</h3>
<p>Dropdown "Semua Role" memungkinkan filter: Semua Role, Supplier, Generator, Aggregator, Converter, Buyer, Enabler, Designer.</p>

<h3>Filter Status Verifikasi</h3>
<table>
  <tr><th>Opsi</th><th>Menampilkan</th></tr>
  <tr><td>Semua Status</td><td>Seluruh pengguna</td></tr>
  <tr><td>Terverifikasi</td><td>Hanya yang sudah diverifikasi</td></tr>
  <tr><td>Belum Verifikasi</td><td>Hanya yang belum diverifikasi</td></tr>
</table>
<p>Filter dapat dikombinasikan. Contoh: tampilkan semua <strong>Generator</strong> yang <strong>Belum Verifikasi</strong>.</p>

<h2>4.3 Verifikasi Akun</h2>
<h3>Toggle Verifikasi Cepat</h3>
<p>1. Arahkan kursor ke baris pengguna</p>
<p>2. Klik tombol 🛡️ (Verifikasi)</p>
<p>3. Status berubah otomatis — "Belum" menjadi "Terverifikasi" dan sebaliknya</p>
<div class="warn"><strong>Perhatian:</strong> Membatalkan verifikasi akan mencabut status terverifikasi. Lakukan hanya jika ada pelanggaran.</div>

<h3>Verifikasi via Detail User</h3>
<p>Untuk verifikasi yang lebih teliti (meninjau dokumen), klik baris pengguna untuk masuk ke halaman Detail User dan tinjau dokumen legalitas sebelum memverifikasi.</p>
<p>Lihat <a href="#bab5">Bab 5: Detail User</a> untuk panduan lengkap.</p>

<!-- ============ BAB 5 ============ -->
<div class="page-break"></div>
<h1 id="bab5">Bab 5: Detail User</h1>
<p>Halaman <strong>Detail User</strong> menampilkan informasi lengkap seorang pengguna beserta dokumen dan aktivitasnya. Diakses dengan mengklik baris pengguna di tabel Manajemen User.</p>
${imgTag("03-enabler-user-detail.png", "Gambar 5.1 — Halaman detail pengguna")}

<h2>5.1 Profil Pengguna</h2>
<table>
  <tr><th>Field</th><th>Keterangan</th></tr>
  <tr><td>Nama</td><td>Nama lengkap pengguna</td></tr>
  <tr><td>Role</td><td>Badge peran (berwarna sesuai peran)</td></tr>
  <tr><td>Verifikasi</td><td>Badge Terverifikasi (hijau) / Belum (abu-abu)</td></tr>
  <tr><td>Email</td><td>Email terdaftar</td></tr>
  <tr><td>Telepon</td><td>Nomor telepon (jika diisi)</td></tr>
  <tr><td>Workshop</td><td>Nama workshop/usaha (jika diisi)</td></tr>
  <tr><td>Alamat</td><td>Alamat lengkap (jika diisi)</td></tr>
  <tr><td>Kode User</td><td>Kode unik pengguna (jika ada)</td></tr>
  <tr><td>Lokasi GPS</td><td>Koordinat latitude &amp; longitude (jika diisi)</td></tr>
</table>

<h2>5.2 Statistik Aktivitas</h2>
<p>Kartu <strong>Aktivitas</strong> menampilkan ringkasan aktivitas pengguna:</p>
<table>
  <tr><th>Metrik</th><th>Keterangan</th></tr>
  <tr><td>Listing Limbah</td><td>Jumlah listing limbah (Generator)</td></tr>
  <tr><td>Listing Kayu</td><td>Jumlah kayu didaftarkan (Supplier)</td></tr>
  <tr><td>Pesanan</td><td>Jumlah pesanan (sebagai pembeli/penjual)</td></tr>
  <tr><td>Penjemputan</td><td>Jumlah penjemputan (Aggregator)</td></tr>
  <tr><td>Dokumen Legalitas</td><td>Jumlah dokumen yang diupload</td></tr>
</table>
<div class="tip"><strong>Catatan:</strong> Metrik yang tidak relevan dengan peran pengguna akan bernilai 0.</div>

<h2>5.3 Review Dokumen Legalitas</h2>
<p>Bagian <strong>Dokumen Legalitas</strong> menampilkan semua dokumen yang diupload pengguna: NIB, SVLK, SK Pengesahan, Izin Usaha, Sertifikat lainnya. Setiap dokumen memiliki tombol buka PDF, status review, dan dapat disetujui atau ditolak dengan catatan.</p>

<h3>Tombol Verifikasi Akun</h3>
<table>
  <tr><th>Tombol</th><th>Fungsi</th></tr>
  <tr><td>🛡️ Verifikasi</td><td>Menyetujui akun (muncul jika belum terverifikasi)</td></tr>
  <tr><td>❌ Batalkan</td><td>Mencabut status verifikasi (merah, jika sudah terverifikasi)</td></tr>
</table>
<div class="warn"><strong>Penting:</strong> Pastikan semua dokumen legalitas sudah ditinjau sebelum memverifikasi akun.</div>

<!-- ============ BAB 6 ============ -->
<div class="page-break"></div>
<h1 id="bab6">Bab 6: Profil Enabler</h1>
<p>Halaman <strong>Profil</strong> untuk mengelola data diri Anda sebagai Enabler. Diakses melalui dropdown avatar pojok kanan atas → Profil.</p>
${imgTag("04-enabler-profile.png", "Gambar 6.1 — Halaman profil Enabler")}

<h2>6.1 Informasi Akun</h2>
<table>
  <tr><th>Field</th><th>Wajib</th><th>Keterangan</th></tr>
  <tr><td>Email</td><td>—</td><td>Email terdaftar (read-only, tidak bisa diubah)</td></tr>
  <tr><td>Nama</td><td>Ya</td><td>Nama lengkap atau nama instansi</td></tr>
  <tr><td>Telepon</td><td>Tidak</td><td>Nomor telepon yang bisa dihubungi</td></tr>
  <tr><td>Alamat</td><td>Tidak</td><td>Alamat instansi (textarea)</td></tr>
</table>
<div class="tip"><strong>Catatan:</strong> Akun Enabler dibuat oleh administrator. Email tidak bisa diubah sendiri. Hubungi tim WoodLoop jika perlu perubahan.</div>

<h2>6.2 Menyimpan Perubahan</h2>
<p>1. Ubah field yang diperlukan (Nama, Telepon, Alamat)</p>
<p>2. Klik tombol <strong>"Simpan Profil"</strong> di pojok kanan bawah</p>
<p>3. Jika berhasil, data tersimpan dan notifikasi sukses muncul</p>
<p>4. Klik <strong>"Batal"</strong> untuk kembali ke dashboard tanpa menyimpan</p>

<!-- ============ BAB 7 ============ -->
<div class="page-break"></div>
<h1 id="bab7">Bab 7: Troubleshooting</h1>

<h2>7.1 Tidak Bisa Login</h2>
<p><strong>Solusi:</strong> Pastikan email benar (tanpa spasi), password case-sensitive, cek koneksi internet. Jika lupa, klik "Lupa Kata Sandi?" untuk reset via email. Akun Enabler dibuat oleh administrator — tidak bisa registrasi mandiri.</p>

<h2>7.2 Data Tidak Muncul</h2>
<p><strong>Solusi:</strong> Cek filter periode — pilih "Semua Waktu". Refresh halaman (F5). Data dampak diperbarui secara berkala; jika platform baru digunakan, data mungkin belum tersedia.</p>

<h2>7.3 Verifikasi Gagal</h2>
<p><strong>Solusi:</strong> Refresh halaman lalu coba ulang. Periksa koneksi internet. Pastikan Anda login sebagai Enabler. Coba verifikasi melalui halaman Detail User untuk proses yang lebih lengkap.</p>

<h2>7.4 Ekspor Data Tidak Terdownload</h2>
<p><strong>Solusi:</strong> Cek pop-up blocker browser — izinkan download dari WoodLoop. Cek folder Downloads. Coba browser lain (Chrome/Firefox). Pastikan ada data — pilih "Semua Waktu" di filter periode.</p>

<h2>7.5 Kontak Bantuan</h2>
<table>
  <tr><th>Saluran</th><th>Detail</th></tr>
  <tr><td>Email</td><td>woodloop.app@gmail.com</td></tr>
  <tr><td>Website</td><td>woodloop.pasarjepara.com</td></tr>
</table>
<p>Siapkan: email akun, peran (Enabler), deskripsi masalah, dan langkah yang sudah dilakukan.</p>

</body>
</html>`;

const htmlPath = path.join(DIR, "manual-book-enabler.html");
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
