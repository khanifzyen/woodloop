const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname);
const OUTPUT = path.join(__dirname, "Manual-Book-Designer-WoodLoop.pdf");
const SCREENSHOTS_DIR = path.join(__dirname, "..", "screenshots");

const SCREENSHOTS = {
  "01-desainer-dashboard.png": path.join(SCREENSHOTS_DIR, "01-desainer-dashboard.png"),
  "02-desainer-articles.png": path.join(SCREENSHOTS_DIR, "02-desainer-articles.png"),
  "03-desainer-design-notes.png": path.join(SCREENSHOTS_DIR, "03-desainer-design-notes.png"),
  "04-desainer-design-clinic.png": path.join(SCREENSHOTS_DIR, "04-desainer-design-clinic.png"),
  "05-desainer-recipes.png": path.join(SCREENSHOTS_DIR, "05-desainer-recipes.png"),
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
<title>Manual Book WoodLoop — Desainer</title>
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
  <h2>Manual Book — Desainer</h2>
  <p style="font-size:14pt;color:#666;">Panduan Lengkap Konsultan Desain Sirkular</p>
  <br/><br/>
  <p><strong>Versi 1.0 — Juni 2026</strong></p>
  <hr/>
  <p><em>"Mengubah Limbah Kayu Menjadi Berkah untuk Jepara"</em></p>
  <br/><br/><br/>
  <table style="width:auto;margin:0 auto;">
    <tr><td><strong>Peran</strong></td><td>Desainer (Konsultan Desain Sirkular)</td></tr>
    <tr><td><strong>Platform</strong></td><td>Web</td></tr>
    <tr><td><strong>Backend</strong></td><td>PocketBase</td></tr>
  </table>
  <br/>
  <p style="font-size:10pt;color:#999;">woodloop.pasarjepara.com</p>
</div>

<!-- ============ KATA PENGANTAR ============ -->
<div class="page-break"></div>
<h1>Kata Pengantar</h1>
<p>Puji syukur kehadirat Tuhan Yang Maha Esa atas terselesaikannya <strong>Manual Book WoodLoop — Panduan Khusus Desainer</strong>.</p>
<p>Manual book ini disusun khusus untuk pengguna dengan peran <strong>Desainer (Konsultan Desain Sirkular)</strong> dalam ekosistem WoodLoop. Sebagai pionir pemikiran sirkular, Desainer memegang peranan penting — memberikan wawasan desain berkelanjutan melalui artikel edukatif, menulis catatan desain yang memperkaya produk Generator dan Converter, serta membuka klinik konsultasi berbayar.</p>
<p>Buku ini membahas secara detail seluruh fitur yang tersedia untuk Desainer, mulai dari:</p>
<ul>
  <li><strong>Dashboard</strong> — ringkasan aktivitas desain Anda</li>
  <li><strong>Artikel Sirkular</strong> — menulis dan mengelola artikel prinsip desain sirkular</li>
  <li><strong>Catatan Desain</strong> — memberikan saran desain pada produk Generator dan Converter</li>
  <li><strong>Klinik Desain</strong> — marketplace jasa konsultasi desain sirkular</li>
</ul>
<p>Setiap fitur dijelaskan dengan langkah-langkah praktis yang dilengkapi tangkapan layar, sehingga Anda dapat langsung mempraktikkannya.</p>
<p>Kami berharap manual book ini membantu Anda memanfaatkan WoodLoop secara maksimal untuk berkontribusi dalam ekosistem ekonomi sirkular Jepara yang lebih transparan, efisien, dan berkelanjutan.</p>
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
        <li>1.2 Peran Desainer dalam Ekosistem</li>
        <li>1.3 Alur Bisnis Desainer</li>
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
    <li><a href="#bab3">Bab 3: Dashboard Desainer</a>
      <ul>
        <li>3.1 Ringkasan Kartu</li>
        <li>3.2 Artikel Terbaru</li>
        <li>3.3 Menu Cepat</li>
      </ul>
    </li>
    <li><a href="#bab4">Bab 4: Artikel Sirkular</a>
      <ul>
        <li>4.1 Melihat Daftar Artikel</li>
        <li>4.2 Membuat Artikel Baru</li>
        <li>4.3 Kategori Artikel</li>
        <li>4.4 Mempublikasikan &amp; Menarik Artikel</li>
        <li>4.5 Edit Artikel</li>
        <li>4.6 Hapus Artikel</li>
      </ul>
    </li>
    <li><a href="#bab5">Bab 5: Catatan Desain</a>
      <ul>
        <li>5.1 Melihat Catatan Desain</li>
        <li>5.2 Membuat Catatan Desain Baru</li>
        <li>5.3 Visibilitas Catatan</li>
      </ul>
    </li>
    <li><a href="#bab6">Bab 6: Klinik Desain</a>
      <ul>
        <li>6.1 Ringkasan Statistik</li>
        <li>6.2 Daftar Konsultasi</li>
        <li>6.3 Status Konsultasi</li>
        <li>6.4 Tipe Konsultasi</li>
        <li>6.5 Resep Desain</li>
      </ul>
    </li>
    <li><a href="#bab7">Bab 7: Troubleshooting</a>
      <ul>
        <li>7.1 Tidak Bisa Login</li>
        <li>7.2 Artikel Gagal Publikasi</li>
        <li>7.3 Data Tidak Muncul</li>
        <li>7.4 Gambar Tidak Bisa Upload</li>
        <li>7.5 Kontak Bantuan</li>
      </ul>
    </li>
  </ul>
</div>

<!-- ============ BAB 1 ============ -->
<div class="page-break"></div>
<h1 id="bab1">Bab 1: Pendahuluan</h1>

<h2>1.1 Apa Itu WoodLoop?</h2>
<p><strong>WoodLoop</strong> adalah platform digital ekonomi sirkular untuk industri kayu dan furnitur di Jepara, Jawa Tengah. Platform ini menghubungkan seluruh aktor dalam rantai nilai kayu — dari pemasok kayu gelondongan, pengrajin yang menghasilkan limbah, pengepul, pengrajin upcycle, pembeli, konsultan desain, hingga pemerintah — dalam satu ekosistem terpadu.</p>
<p>Tujuan utama WoodLoop adalah <strong>mengubah limbah kayu menjadi sumber daya bernilai ekonomi</strong> sekaligus melacak dampak lingkungannya.</p>

<h2>1.2 Peran Desainer dalam Ekosistem</h2>
<p><strong>Desainer</strong> adalah konsultan desain sirkular — pihak yang memberikan saran desain, menulis artikel tentang prinsip sirkular, dan menyediakan jasa konsultasi desain berbayar kepada Generator dan Converter.</p>
<p><strong>Contoh pengguna Desainer:</strong></p>
<ul>
  <li>Konsultan desain produk</li>
  <li>Akademisi desain</li>
  <li>Praktisi ekonomi sirkular</li>
  <li>Desainer furnitur</li>
</ul>
<p><strong>Alur peran Desainer dalam ekosistem WoodLoop:</strong></p>
<pre>Supplier → Generator → (limbah) → Aggregator → Converter → Buyer
                                          ↑
                                    Desainer
                              (saran desain, artikel,
                               klinik konsultasi)</pre>

<h2>1.3 Alur Bisnis Desainer</h2>
<table>
  <tr><th>Langkah</th><th>Aktivitas</th><th>Halaman</th></tr>
  <tr><td>1</td><td>Login ke akun Desainer</td><td>/login</td></tr>
  <tr><td>2</td><td>Melihat ringkasan aktivitas</td><td>/designer/dashboard</td></tr>
  <tr><td>3</td><td>Menulis artikel sirkular baru</td><td>/designer/articles/new</td></tr>
  <tr><td>4</td><td>Mengelola artikel yang sudah ditulis</td><td>/designer/articles</td></tr>
  <tr><td>5</td><td>Memberi catatan desain pada produk</td><td>/designer/design-notes/new</td></tr>
  <tr><td>6</td><td>Membuka atau merespon konsultasi</td><td>/designer/design-clinic</td></tr>
</table>

<h2>1.4 Istilah Penting</h2>
<table>
  <tr><th>Istilah</th><th>Arti</th></tr>
  <tr><td>Artikel Sirkular</td><td>Artikel edukasi tentang prinsip desain sirkular</td></tr>
  <tr><td>Catatan Desain</td><td>Saran desain pada produk Generator atau Converter</td></tr>
  <tr><td>Klinik Desain</td><td>Marketplace jasa konsultasi desain sirkular</td></tr>
  <tr><td>Resep Desain</td><td>Panduan mengubah limbah kayu menjadi produk bernilai</td></tr>
  <tr><td>Dematerialisasi</td><td>Prinsip desain mengurangi penggunaan material</td></tr>
  <tr><td>Design for Disassembly</td><td>Desain yang mudah dibongkar untuk didaur ulang</td></tr>
  <tr><td>Product Longevity</td><td>Prinsip ketahanan dan keawetan produk</td></tr>
  <tr><td>Upcycling</td><td>Mengolah limbah menjadi produk bernilai lebih tinggi</td></tr>
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
  <li>Akun Desainer yang sudah terdaftar</li>
</ul>

<h2>2.2 Login</h2>
<ol>
  <li>Buka halaman utama WoodLoop</li>
  <li>Klik tombol <strong>"Lanjut"</strong> pada layar onboarding</li>
  <li>Pilih peran <strong>"Desainer"</strong> pada layar pemilihan peran</li>
  <li>Klik <strong>"Konfirmasi"</strong></li>
  <li>Pada halaman login, masukkan email dan kata sandi</li>
  <li>Klik tombol <strong>"Masuk"</strong></li>
</ol>
<div class="note"><strong>Lupa Kata Sandi?</strong> Klik tautan "Lupa Kata Sandi?" di halaman login dan ikuti petunjuk untuk mereset kata sandi melalui email.</div>

<h2>2.3 Navigasi Antarmuka</h2>
${imgTag("01-desainer-dashboard.png", "Gambar 2.1 — Dashboard Desainer setelah login")}
<p>Setelah login, Anda akan melihat <strong>sidebar navigasi</strong> di sebelah kiri dengan menu berikut:</p>
<table>
  <tr><th>Menu</th><th>Ikon</th><th>Halaman</th><th>Fungsi</th></tr>
  <tr><td>Dashboard</td><td>📊</td><td>/designer/dashboard</td><td>Ringkasan aktivitas desain</td></tr>
  <tr><td>Artikel Sirkular</td><td>📖</td><td>/designer/articles</td><td>Kelola artikel desain sirkular</td></tr>
  <tr><td>Catatan Desain</td><td>🎨</td><td>/designer/design-notes</td><td>Beri saran desain pada produk</td></tr>
  <tr><td>Klinik Desain</td><td>🏪</td><td>/designer/design-clinic</td><td>Marketplace konsultasi desain</td></tr>
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
<div class="warn"><strong>Penting:</strong> Menu navigasi hanya menampilkan fitur yang relevan dengan peran Desainer. Setiap peran memiliki menu yang berbeda.</div>

<h2>2.4 Mode Gelap &amp; Ganti Bahasa</h2>
<p>Klik tombol <strong>"Mode Gelap"</strong> di bagian atas halaman untuk beralih antara tema terang dan gelap. Klik tombol <strong>"Ganti Bahasa"</strong> untuk beralih antara Bahasa Indonesia dan English. Pengaturan akan tersimpan secara otomatis untuk kunjungan berikutnya.</p>

<!-- ============ BAB 3 ============ -->
<div class="page-break"></div>
<h1 id="bab3">Bab 3: Dashboard Desainer</h1>
<p>Dashboard Desainer adalah halaman utama yang muncul setelah login. Di sini Anda dapat melihat ringkasan aktivitas desain secara sekilas.</p>
${imgTag("01-desainer-dashboard.png", "Gambar 3.1 — Dashboard Desainer")}

<h2>3.1 Ringkasan Kartu (Summary Cards)</h2>
<table>
  <tr><th>Kartu</th><th>Ikon</th><th>Menampilkan</th></tr>
  <tr><td>Total Artikel</td><td>📄</td><td>Jumlah seluruh artikel sirkular yang dibuat</td></tr>
  <tr><td>Artikel Terbit</td><td>👁️</td><td>Artikel yang sudah dipublikasikan</td></tr>
  <tr><td>Catatan Desain</td><td>💬</td><td>Jumlah catatan/saran desain yang diberikan</td></tr>
  <tr><td>Konsultasi Terbuka</td><td>🏪</td><td>Jumlah permintaan konsultasi yang masih terbuka</td></tr>
</table>

<h2>3.2 Artikel Terbaru</h2>
<p>Di bawah ringkasan kartu, terdapat panel <strong>Artikel Terbaru</strong> yang menampilkan artikel yang baru saja Anda tulis atau edit.</p>
<p>Setiap artikel menampilkan: judul, status (📢 Terbit atau 📝 Draf), tanggal, dan kategori. Jika belum ada artikel, akan tampil pesan "Belum ada artikel. Mulai dengan menulis artikel sirkular!".</p>

<h2>3.3 Menu Cepat (Quick Actions)</h2>
<table>
  <tr><th>Tombol</th><th>Fungsi</th><th>Tujuan</th></tr>
  <tr><td>Tulis Artikel Baru</td><td>Membuka halaman artikel</td><td>/designer/articles</td></tr>
  <tr><td>Catatan Desain</td><td>Membuka halaman catatan desain</td><td>/designer/design-notes</td></tr>
  <tr><td>Klinik Desain</td><td>Membuka marketplace konsultasi</td><td>/designer/design-clinic</td></tr>
</table>

<!-- ============ BAB 4 ============ -->
<div class="page-break"></div>
<h1 id="bab4">Bab 4: Artikel Sirkular</h1>
<p>Halaman <strong>Artikel Sirkular</strong> adalah pusat untuk menulis dan mengelola artikel edukasi tentang prinsip desain sirkular. Artikel bersifat <strong>publik</strong> — bisa dibaca oleh siapa saja.</p>
${imgTag("02-desainer-articles.png", "Gambar 4.1 — Halaman daftar artikel sirkular")}

<h2>4.1 Melihat Daftar Artikel</h2>
<p>Setiap artikel ditampilkan dalam bentuk kartu:</p>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Kategori</td><td>Badge kategori artikel (Dematerialisasi, dll)</td></tr>
  <tr><td>Status</td><td>Terbit (hijau) atau Draf (abu-abu)</td></tr>
  <tr><td>Judul</td><td>Nama artikel</td></tr>
  <tr><td>Excerpt</td><td>Ringkasan singkat artikel (jika ada)</td></tr>
</table>

<p><strong>Tombol Aksi:</strong></p>
<table>
  <tr><th>Tombol</th><th>Fungsi</th></tr>
  <tr><td>👁️ / 👁️‍🗨️</td><td>Toggle publikasi (terbit/tarik)</td></tr>
  <tr><td>✏️</td><td>Edit artikel</td></tr>
  <tr><td>🗑️</td><td>Hapus artikel (merah)</td></tr>
</table>

<h2>4.2 Membuat Artikel Baru</h2>
<p>Klik tombol <strong>"Artikel Baru"</strong> di pojok kanan atas halaman untuk membuka form artikel baru di <code>/designer/articles/new</code>.</p>

<h3>Form Artikel Baru</h3>
<table>
  <tr><th>Field</th><th>Wajib</th><th>Deskripsi</th></tr>
  <tr><td>Judul</td><td>✅</td><td>Judul artikel yang menarik dan informatif</td></tr>
  <tr><td>Konten</td><td>✅</td><td>Isi artikel — gunakan editor teks kaya</td></tr>
  <tr><td>Kategori</td><td>✅</td><td>Pilih salah satu kategori artikel</td></tr>
  <tr><td>Excerpt</td><td>❌</td><td>Ringkasan singkat (tampil di daftar)</td></tr>
  <tr><td>Gambar Sampul</td><td>❌</td><td>Gambar sampul artikel</td></tr>
  <tr><td>Tags</td><td>❌</td><td>Tag dipisah koma untuk pencarian</td></tr>
</table>

<h3>Menyimpan Artikel</h3>
<table>
  <tr><th>Tombol</th><th>Fungsi</th></tr>
  <tr><td>Simpan sebagai Draf</td><td>Menyimpan tanpa publikasi</td></tr>
  <tr><td>Terbitkan</td><td>Langsung publikasikan artikel</td></tr>
</table>
<div class="note">Artikel yang disimpan sebagai draf hanya bisa dilihat oleh Anda. Publikasikan setelah siap dibaca publik.</div>

<h2>4.3 Kategori Artikel</h2>
<table>
  <tr><th>Kategori</th><th>Label Indonesia</th><th>Deskripsi</th></tr>
  <tr><td>dematerialization</td><td>Dematerialisasi</td><td>Mengurangi penggunaan material dalam desain</td></tr>
  <tr><td>design_for_disassembly</td><td>Desain untuk Dibongkar</td><td>Produk yang mudah dibongkar untuk didaur ulang</td></tr>
  <tr><td>product_longevity</td><td>Ketahanan Produk</td><td>Prinsip keawetan dan ketahanan produk</td></tr>
  <tr><td>upcycling</td><td>Upcycling</td><td>Mengolah limbah menjadi produk bernilai lebih</td></tr>
  <tr><td>general</td><td>Umum</td><td>Artikel umum tentang desain sirkular</td></tr>
</table>

<h2>4.4 Mempublikasikan &amp; Menarik Artikel</h2>
<h3>Mempublikasikan (Draf → Terbit)</h3>
<ol>
  <li>Cari artikel dengan status <strong>Draf</strong></li>
  <li>Klik tombol 👁️ (publikasikan)</li>
  <li>Status berubah menjadi <strong>Terbit</strong> dengan badge hijau</li>
  <li>Artikel kini bisa dibaca publik</li>
</ol>

<h3>Menarik Artikel (Terbit → Draf)</h3>
<ol>
  <li>Cari artikel dengan status <strong>Terbit</strong></li>
  <li>Klik tombol 👁️‍🗨️ (tarik dari publikasi)</li>
  <li>Status berubah menjadi <strong>Draf</strong></li>
  <li>Artikel tidak lagi tampil untuk publik</li>
</ol>
<div class="warn">Menarik artikel tidak menghapus data. Artikel tetap tersimpan sebagai draf dan bisa dipublikasikan kembali kapan saja.</div>

<h2>4.5 Edit Artikel</h2>
<ol>
  <li>Klik tombol ✏️ pada kartu artikel yang ingin diedit</li>
  <li>Anda akan diarahkan ke halaman edit: <code>/designer/articles/[id]/edit</code></li>
  <li>Form edit menampilkan data artikel yang sudah ada</li>
  <li>Ubah field yang diinginkan (judul, konten, kategori, dll)</li>
  <li>Klik <strong>"Simpan"</strong> untuk menyimpan perubahan</li>
</ol>

<h2>4.6 Hapus Artikel</h2>
<ol>
  <li>Klik ikon 🗑️ (merah) pada kartu artikel</li>
  <li>Konfirmasi penghapusan akan diproses langsung</li>
  <li>Notifikasi "Artikel berhasil dihapus" akan muncul</li>
</ol>
<div class="warn">Penghapusan artikel bersifat permanen dan tidak dapat dibatalkan.</div>

<!-- ============ BAB 5 ============ -->
<div class="page-break"></div>
<h1 id="bab5">Bab 5: Catatan Desain</h1>
<p>Halaman <strong>Catatan Desain</strong> adalah tempat untuk memberikan saran desain pada produk yang dibuat oleh Generator atau Converter.</p>
${imgTag("03-desainer-design-notes.png", "Gambar 5.1 — Halaman catatan desain")}

<h2>5.1 Melihat Catatan Desain</h2>
<p>Catatan desain ditampilkan dalam bentuk <strong>grid kartu</strong> (2 kolom):</p>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Target</td><td>Badge jenis target: "Produk Generator" atau "Produk Converter"</td></tr>
  <tr><td>Visibilitas</td><td>Publik (hijau) atau Privat (abu-abu)</td></tr>
  <tr><td>Konten</td><td>Isi catatan desain / saran (maks 3 baris)</td></tr>
  <tr><td>Tanggal</td><td>Tanggal pembuatan catatan</td></tr>
  <tr><td>Sketsa</td><td>Jumlah file sketsa (jika ada)</td></tr>
</table>

<h2>5.2 Membuat Catatan Desain Baru</h2>
<p>Klik tombol <strong>"Catatan Baru"</strong> di pojok kanan atas halaman untuk membuka form catatan baru di <code>/designer/design-notes/new</code>.</p>

<h3>Form Catatan Baru</h3>
<table>
  <tr><th>Field</th><th>Wajib</th><th>Deskripsi</th></tr>
  <tr><td>Target</td><td>✅</td><td>Pilih: "Produk Generator" atau "Produk Converter"</td></tr>
  <tr><td>ID Produk</td><td>✅</td><td>Masukkan ID produk target</td></tr>
  <tr><td>Konten</td><td>✅</td><td>Isi catatan desain atau saran perbaikan</td></tr>
  <tr><td>Sketsa</td><td>❌</td><td>Upload gambar sketsa pendukung (maks 3 file)</td></tr>
  <tr><td>Visibilitas</td><td>❌</td><td>Centang untuk publik (default: publik)</td></tr>
</table>

<h3>Menyimpan Catatan</h3>
<ol>
  <li>Isi semua field yang diperlukan</li>
  <li>Klik tombol <strong>"Simpan"</strong></li>
  <li>Notifikasi sukses akan muncul</li>
  <li>Catatan baru akan tampil di halaman daftar</li>
</ol>
<div class="tip">Sertakan sketsa pendukung untuk memperjelas saran desain Anda. Gunakan format JPG, PNG, atau WebP.</div>

<h2>5.3 Visibilitas Catatan</h2>
<table>
  <tr><th>Visibilitas</th><th>Deskripsi</th></tr>
  <tr><td>Publik</td><td>Dapat dilihat oleh semua pengguna — berguna untuk berbagi pengetahuan desain secara luas</td></tr>
  <tr><td>Privat</td><td>Hanya bisa dilihat oleh Anda dan pemilik produk target — cocok untuk saran internal</td></tr>
</table>

<!-- ============ BAB 6 ============ -->
<div class="page-break"></div>
<h1 id="bab6">Bab 6: Klinik Desain</h1>
<p><strong>Klinik Desain</strong> adalah marketplace jasa konsultasi desain sirkular. Di halaman ini, Desainer dapat melihat permintaan konsultasi dari Generator/Converter, serta membuat penawaran jasa desain.</p>
${imgTag("04-desainer-design-clinic.png", "Gambar 6.1 — Halaman Klinik Desain")}

<h2>6.1 Ringkasan Statistik</h2>
<table>
  <tr><th>Kartu</th><th>Ikon</th><th>Menampilkan</th></tr>
  <tr><td>Total</td><td>💬</td><td>Jumlah seluruh konsultasi</td></tr>
  <tr><td>Terbuka</td><td>🕐</td><td>Konsultasi dengan status open</td></tr>
  <tr><td>Berjalan</td><td>💰</td><td>Konsultasi yang sedang berlangsung</td></tr>
  <tr><td>Selesai</td><td>🏪</td><td>Konsultasi yang sudah selesai</td></tr>
</table>

<h2>6.2 Daftar Konsultasi</h2>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Status</td><td>Badge status berwarna</td></tr>
  <tr><td>Tipe</td><td>"Permintaan Klien" atau "Penawaran Desainer"</td></tr>
  <tr><td>Judul</td><td>Judul permintaan atau penawaran</td></tr>
  <tr><td>Deskripsi</td><td>Penjelasan kebutuhan desain</td></tr>
  <tr><td>Budget</td><td>Anggaran/tarif dalam Rupiah</td></tr>
  <tr><td>Tanggal</td><td>Tanggal pembuatan konsultasi</td></tr>
  <tr><td>Klien</td><td>Nama klien yang mengajukan</td></tr>
</table>

<h2>6.3 Status Konsultasi</h2>
<table>
  <tr><th>Status</th><th>Label</th><th>Arti</th></tr>
  <tr><td>open</td><td>Terbuka</td><td>Permintaan/penawaran baru, belum ada kesepakatan</td></tr>
  <tr><td>negotiation</td><td>Negosiasi</td><td>Sedang dalam proses negosiasi harga</td></tr>
  <tr><td>in_progress</td><td>Berjalan</td><td>Konsultasi sedang berlangsung</td></tr>
  <tr><td>completed</td><td>Selesai</td><td>Konsultasi telah selesai</td></tr>
  <tr><td>cancelled</td><td>Dibatalkan</td><td>Konsultasi dibatalkan</td></tr>
</table>
<pre>Terbuka (open)
   └─→ Negosiasi (negotiation)
         └─→ Berjalan (in_progress)
               ├─→ Selesai (completed)
               └─→ Dibatalkan (cancelled)</pre>

<h2>6.4 Tipe Konsultasi</h2>
<table>
  <tr><th>Tipe</th><th>Penjelasan</th></tr>
  <tr><td>Permintaan Klien</td><td>Generator/Converter mengajukan permintaan desain dengan anggaran tertentu</td></tr>
  <tr><td>Penawaran Desainer</td><td>Desainer memasang tarif jasa konsultasi yang ditawarkan</td></tr>
</table>

<h2>6.5 Resep Desain</h2>
<p>Klinik Desain juga menyediakan akses ke <strong>Resep Desain</strong> melalui tombol di pojok kanan atas halaman. Resep Desain adalah kumpulan panduan dan ide kreatif untuk mengubah limbah kayu menjadi produk bernilai.</p>
${imgTag("05-desainer-recipes.png", "Gambar 6.2 — Halaman Resep Desain")}

<h3>Informasi pada Setiap Resep</h3>
<table>
  <tr><th>Informasi</th><th>Keterangan</th></tr>
  <tr><td>Judul</td><td>Nama resep desain</td></tr>
  <tr><td>Jenis Kayu yang Cocok</td><td>Rekomendasi jenis kayu (Jati, Mahoni, dll)</td></tr>
  <tr><td>Bentuk Kayu yang Cocok</td><td>Bentuk limbah yang sesuai (Offcut, Serutan, dll)</td></tr>
  <tr><td>Tingkat Kesulitan</td><td>Mudah, Sedang, atau Sulit</td></tr>
  <tr><td>Deskripsi</td><td>Penjelasan dan panduan pembuatan</td></tr>
  <tr><td>Foto</td><td>Gambar hasil jadi produk</td></tr>
</table>

<h3>Filter Resep</h3>
<table>
  <tr><th>Fitur</th><th>Fungsi</th></tr>
  <tr><td>🔍 Pencarian</td><td>Cari resep berdasarkan judul atau deskripsi</td></tr>
  <tr><td>Filter Tingkat Kesulitan</td><td>Tampilkan resep berdasarkan tingkat kesulitan</td></tr>
  <tr><td>Filter Jenis Kayu</td><td>Filter berdasarkan jenis kayu yang cocok</td></tr>
</table>
<div class="note">Resep Desain bisa dibuat oleh Converter, Desainer, atau Enabler. Jika Anda memiliki ide resep yang ingin dibagikan, silakan buat resep baru dari halaman ini.</div>

<!-- ============ BAB 7 ============ -->
<div class="page-break"></div>
<h1 id="bab7">Bab 7: Troubleshooting</h1>

<h2>7.1 Tidak Bisa Login</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Lupa password</td><td>Klik "Lupa Kata Sandi?" di halaman login, ikuti instruksi reset</td></tr>
  <tr><td>Email tidak terdaftar</td><td>Pastikan mendaftar dengan peran Desainer terlebih dahulu</td></tr>
  <tr><td>Salah peran</td><td>Pastikan memilih Desainer saat login, bukan peran lain</td></tr>
  <tr><td>Browser error</td><td>Coba browser berbeda atau mode incognito</td></tr>
</table>

<h2>7.2 Artikel Gagal Publikasi</h2>
<table>
  <tr><th>Kemungkinan</th><th>Saran</th></tr>
  <tr><td>Tombol tidak merespon</td><td>Refresh halaman dan coba klik publikasi sekali lagi</td></tr>
  <tr><td>Koneksi tidak stabil</td><td>Pastikan koneksi internet stabil</td></tr>
  <tr><td>Masih tetap draf</td><td>Coba simpan sebagai draf lalu publikasikan lagi</td></tr>
</table>

<h2>7.3 Data Tidak Muncul</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Artikel/catatan baru tidak tampil</td><td>Tunggu beberapa detik, refresh halaman</td></tr>
  <tr><td>Data lama masih terlihat</td><td>Clear cache browser atau buka di tab baru</td></tr>
</table>

<h2>7.4 Gambar Tidak Bisa Upload</h2>
<table>
  <tr><th>Masalah</th><th>Solusi</th></tr>
  <tr><td>Format tidak didukung</td><td>Gunakan JPG, PNG, atau WebP</td></tr>
  <tr><td>Ukuran terlalu besar</td><td>Maks 5 MB per file</td></tr>
  <tr><td>Terlalu banyak file</td><td>Maksimal 3 file sketsa per catatan desain</td></tr>
</table>

<h2>7.5 Kontak Bantuan</h2>
<table>
  <tr><th>Saluran</th><th>Detail</th></tr>
  <tr><td>Email</td><td>woodloop.app@gmail.com</td></tr>
  <tr><td>Website</td><td>woodloop.pasarjepara.com</td></tr>
</table>
<p>Sertakan informasi berikut saat melapor: nama akun, peran (Desainer), deskripsi masalah (jelaskan langkah yang sudah dilakukan), screenshot jika ada pesan error, dan waktu kejadian.</p>

</body>
</html>`;

const htmlPath = path.join(DIR, "manual-book-designer.html");
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
