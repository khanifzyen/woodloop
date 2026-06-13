/**
 * Generate Manual Book PDF — Global
 * Uses marked for markdown parsing, same styling as supplier manual.
 *
 * Usage: node scripts/generate-manual-book-pdf.js
 */

const fs = require("fs");
const path = require("path");
const WEB_DIR = path.resolve(__dirname, "../woodloop_web");
const BOOK_DIR = path.resolve(__dirname, "../docs/manual-book");
const OUTPUT_DIR = BOOK_DIR;
const { chromium } = require(path.join(WEB_DIR, "node_modules/playwright"));
const { marked } = require(path.join(WEB_DIR, "node_modules/marked"));

// --------------- helpers ---------------

function imgTag(filename, caption) {
  const p = path.join(BOOK_DIR, "screenshots", filename);
  if (!fs.existsSync(p))
    return `<p style="color:#999;font-style:italic">[Screenshot: ${caption}]</p>`;
  return `<figure>
    <img src="file://${p}" style="max-width:100%;border:1px solid #ddd;border-radius:4px;" />
    <figcaption style="text-align:center;font-size:10pt;color:#666;margin-top:4px;">${caption}</figcaption>
  </figure>`;
}

function processImages(markdown) {
  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
    const fullPath = path.join(BOOK_DIR, imgPath);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).toLowerCase().replace(".", "");
      const mime = ext === "svg" ? "svg+xml" : ext === "jpg" ? "jpeg" : ext;
      const data = fs.readFileSync(fullPath);
      const b64 = data.toString("base64");
      const caption = alt
        ? `<figcaption style="text-align:center;font-size:10pt;color:#666;margin-top:4px;">${alt}</figcaption>`
        : "";
      return `<figure>\n  <img src="data:image/${mime};base64,${b64}" alt="${alt}" style="max-width:100%;border:1px solid #ddd;border-radius:4px;" />\n  ${caption}\n</figure>`;
    }
    return match;
  });
}

function readAndProcess(filepath) {
  if (!fs.existsSync(filepath)) return null;
  let content = fs.readFileSync(filepath, "utf-8");
  // Remove YAML front matter
  content = content.replace(/^---[\s\S]*?---\n*/, "");
  // Remove nav line
  content = content.replace(/\n➡️.*\n*$/, "");
  // Process images
  content = processImages(content);
  return content;
}

// --------------- CSS (same as supplier) ---------------

const CSS = `
  @page { margin: 2cm 2.5cm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.6; color: #222; max-width: 720px; margin: 0 auto; padding: 20px; }
  h1 { font-size: 22pt; color: #1a5c2a; border-bottom: 2px solid #1a5c2a; padding-bottom: 6px; margin-top: 30px; page-break-before: always; }
  h1:first-of-type { page-break-before: avoid; }
  h2 { font-size: 16pt; color: #2d7d41; margin-top: 24px; }
  h3 { font-size: 13pt; color: #333; margin-top: 18px; }
  h4 { font-size: 11pt; color: #555; margin-top: 14px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11pt; page-break-inside: avoid; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
  th { background: #e8f5e9; }
  figure { margin: 16px 0; text-align: center; page-break-inside: avoid; }
  pre, code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; font-size: 10pt; }
  pre { padding: 10px; overflow-x: auto; }
  blockquote { border-left: 4px solid #1a5c2a; margin: 12px 0; padding: 8px 16px; background: #f9fdf9; }
  .page-break { page-break-before: always; }
  .cover { text-align: center; padding-top: 100px; page-break-after: always; }
  .cover h1 { font-size: 28pt; border: none; color: #1a5c2a; margin: 0; }
  .cover h2 { font-size: 18pt; color: #555; border: none; margin: 6px 0; }
  .cover-sub { font-size: 14pt; color: #666; }
  .cover hr { width: 50%; margin: 20px auto; border: none; border-top: 1px solid #1a5c2a; }
  .cover-tagline { font-size: 13pt; color: #1a5c2a; }
  .cover-version { font-size: 12pt; color: #666; }
  .cover-info { width: auto; margin: 0 auto; border: none; }
  .cover-info td { border: none; padding: 3px 12px; }
  .cover-url, .cover-email { font-size: 10pt; color: #999; margin: 2px 0; }
  .toc a { color: #1a5c2a; text-decoration: none; }
  .toc ul { list-style: none; padding-left: 0; }
  .toc ul ul { padding-left: 20px; }
  .toc li { margin: 4px 0; }
  .note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 8px 14px; margin: 10px 0; font-size: 11pt; }
  .warn { background: #f8d7da; border-left: 4px solid #dc3545; padding: 8px 14px; margin: 10px 0; font-size: 11pt; }
  .tip { background: #d4edda; border-left: 4px solid #28a745; padding: 8px 14px; margin: 10px 0; font-size: 11pt; }
`;

// --------------- build HTML ---------------

async function buildHtml() {
  // Cover
  const cover = `<div class="cover">
  <h1>🌳 WoodLoop</h1>
  <h2>Manual Book</h2>
  <p class="cover-sub">Platform Ekonomi Sirkular Industri Kayu Jepara</p>
  <br/><br/>
  <p class="cover-version"><strong>Versi 1.0 — Mei 2026</strong></p>
  <hr/>
  <p class="cover-tagline"><em>"Mengubah Limbah Kayu Menjadi Berkah untuk Jepara"</em></p>
  <br/><br/><br/>
  <table class="cover-info">
    <tr><td><strong>Platform</strong></td><td>Web</td></tr>
    <tr><td><strong>Pengguna</strong></td><td>7 Peran (Supplier, Generator, Aggregator, Converter, Desainer, Enabler, Buyer)</td></tr>
  </table>
  <br/>
  <p class="cover-url">woodloop.pasarjepara.com</p>
  <p class="cover-email">woodloop.app@gmail.com</p>
</div>`;

  // Build Table of Contents (single column, like supplier)
  const tocItems = [
    { label: "Kata Pengantar", href: "#kata-pengantar" },
    { label: "Mengenal WoodLoop", children: [
      "1.1 Apa Itu WoodLoop?",
      "1.2 Siapa Saja Penggunanya?",
      "1.3 Platform yang Didukung",
      "1.4 Istilah Penting (Glossary)",
    ]},
    { label: "Bab 2: Memulai", children: [
      "2.1 Cara Mengakses Aplikasi",
      "2.2 Registrasi Akun",
      "2.3 Login & Logout",
      "2.4 Onboarding & Pemilihan Peran",
      "2.5 Profil & Verifikasi Akun",
    ]},
    { label: "Bab 3: Navigasi Umum", children: [
      "3.1 Struktur Halaman",
      "3.2 Sidebar per Peran",
      "3.3 Breadcrumb",
      "3.4 Mode Gelap / Terang",
      "3.5 Ganti Bahasa (EN/ID)",
    ]},
    { label: "Bab 4: Panduan Supplier", children: [
      "4.1 Dashboard Supplier",
      "4.2 Mendaftarkan Kayu Baru",
      "4.3 Mengelola Inventaris Kayu",
      "4.4 Melihat & Memproses Pesanan Masuk",
      "4.5 Riwayat Penjualan & Grafik",
    ]},
    { label: "Bab 5: Panduan Generator", children: [
      "5.1 Dashboard Generator",
      "5.2 Setor Limbah (Report Waste)",
      "5.3 Jenis & Bentuk Limbah",
      "5.4 Beli Kayu Mentah",
      "5.5 Mengelola Pesanan Kayu",
      "5.6 Produk Saya",
    ]},
    { label: "Bab 6: Panduan Aggregator", children: [
      "6.1 Dashboard Aggregator",
      "6.2 Treasure Map (Peta Interaktif)",
      "6.3 Mengajukan Bidding (Lelang)",
      "6.4 Penjemputan (Pickups)",
      "6.5 Gudang (Warehouse)",
      "6.6 Menjual Stok ke Converter",
    ]},
    { label: "Bab 7: Panduan Converter", children: [
      "7.1 Dashboard Converter",
      "7.2 Pasar Bahan Limbah",
      "7.3 Checkout & Pembelian Bahan",
      "7.4 Klinik Desain (redirect ke Desainer)",
      "7.5 Membuat Produk Upcycled",
      "7.6 Katalog Produk Saya",
      "7.7 QR Code Produk",
    ]},
    { label: "Bab 8: Panduan Buyer", children: [
      "8.1 Marketplace Produk",
      "8.2 Detail Produk & Traceability",
      "8.3 Keranjang Belanja (Cart)",
      "8.4 Checkout & Pembayaran",
      "8.5 Tracking Pesanan",
      "8.6 Scan QR Code Produk",
    ]},
    { label: "Bab 9: Panduan Desainer", children: [
      "9.1 Dashboard Desainer",
      "9.2 Artikel Sirkular",
      "9.3 Catatan Desain",
      "9.4 Klinik Desain",
    ]},
    { label: "Bab 10: Panduan Enabler", children: [
      "10.1 Dashboard Impact Analytics",
      "10.2 Manajemen Pengguna",
    ]},
    { label: "Bab 11: Fitur Global", children: [
      "11.1 Dompet Digital (Wallet)",
      "11.2 Pusat Notifikasi",
      "11.3 Pesan & Chat",
      "11.4 Manajemen Dokumen Legalitas",
      "11.5 Profil B2B",
    ]},
    { label: "Bab 12: Traceability & QR Code", children: [
      "12.1 Apa Itu QR Traceability?",
      "12.2 Cara Scan QR Code",
      "12.3 Halaman Traceability Publik",
      "12.4 Dampak Lingkungan",
    ]},
    { label: "Bab 13: Troubleshooting & FAQ", children: [
      "13.1 Masalah Login",
      "13.2 Masalah Upload Foto",
      "13.3 Masalah Pembayaran",
      "13.4 Masalah GPS & Lokasi",
      "13.5 Masalah Notifikasi",
      "13.6 Kontak Bantuan",
    ]},
  ];

  let tocHtml = '<div class="toc"><ul>\n';
  for (const item of tocItems) {
    if (item.children) {
      tocHtml += `  <li>${item.label}\n    <ul>\n`;
      for (const child of item.children) {
        tocHtml += `      <li>${child}</li>\n`;
      }
      tocHtml += `    </ul>\n  </li>\n`;
    } else {
      tocHtml += `  <li><a href="${item.href}">${item.label}</a></li>\n`;
    }
  }
  tocHtml += '</ul></div>';

  // Process all bab files
  const files = [
    { id: "kata-pengantar", file: "00-kata-pengantar.md" },
    { id: "pendahuluan", file: "01-bab-1-pendahuluan.md" },
    { id: "memulai", file: "02-bab-2-memulai.md" },
    { id: "navigasi", file: "03-bab-3-navigasi-umum.md" },
    { id: "supplier", file: "04-bab-4-supplier.md" },
    { id: "generator", file: "05-bab-5-generator.md" },
    { id: "aggregator", file: "06-bab-6-aggregator.md" },
    { id: "converter", file: "07-bab-7-converter.md" },
    { id: "buyer", file: "08-bab-8-buyer.md" },
    { id: "desainer", file: "09-bab-9-desainer.md" },
    { id: "enabler", file: "10-bab-10-enabler.md" },
    { id: "fitur-global", file: "11-bab-11-fitur-global.md" },
    { id: "traceability", file: "12-bab-12-traceability.md" },
    { id: "troubleshooting", file: "13-bab-13-troubleshooting.md" },
  ];

  let body = cover;

  // Kata Pengantar
  body += '<div class="page-break"></div>\n';
  body += '<h1 id="kata-pengantar">Kata Pengantar</h1>\n';
  let kataPengantar = readAndProcess(path.join(BOOK_DIR, "00-kata-pengantar.md"));
  if (kataPengantar) {
    body += await marked.parse(kataPengantar, { breaks: true, gfm: true });
  }

  // Daftar Isi
  body += '<div class="page-break"></div>\n';
  body += '<h1>Daftar Isi</h1>\n';
  body += tocHtml;

  // Each chapter
  for (const f of files) {
    const raw = readAndProcess(path.join(BOOK_DIR, f.file));
    if (!raw) continue;
    let html = await marked.parse(raw, { breaks: true, gfm: true });
    // Post-process: convert blockquotes with labels to styled divs
    html = html.replace(
      /<blockquote>\s*<p><strong>(Penting|Catatan|Tips):<\/strong>/g,
      (match, label) => {
        const cls = label === 'Penting' ? 'warn' : label === 'Catatan' ? 'note' : 'tip';
        return `<div class="${cls}"><strong>${label}:</strong>`;
      }
    );
    html = html.replace(/<\/blockquote>/g, '</div>');
    body += '<div class="page-break"></div>\n';
    body += html;
  }

  body += `
<div style="margin-top:40px;padding-top:16px;border-top:1px solid #ccc;font-size:8pt;color:#888;text-align:center;">
  <p>© 2026 WoodLoop — Platform Ekonomi Sirkular Industri Kayu Jepara</p>
  <p>woodloop.pasarjepara.com | woodloop.app@gmail.com</p>
</div>`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Manual Book WoodLoop</title>
<style>${CSS}</style>
</head>
<body>
${body}
</body>
</html>`;
}

async function main() {
  console.log("📖 Generating Manual Book PDF...\n");
  console.log("📝 Building HTML...");
  const html = await buildHtml();
  const htmlPath = path.join(OUTPUT_DIR, "manual-book.html");
  fs.writeFileSync(htmlPath, html, "utf-8");
  console.log(`  ✅ HTML saved: ${htmlPath}`);

  console.log("📄 Generating PDF with Playwright...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.waitForTimeout(2000);

  const pdfPath = path.join(OUTPUT_DIR, "Manual-Book-WoodLoop.pdf");
  await page.pdf({
    path: pdfPath,
    format: "A4",
    margin: { top: "2cm", bottom: "2cm", left: "2.5cm", right: "2.5cm" },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="font-size:9pt;text-align:center;width:100%;color:#888;padding:4px 0;border-top:1px solid #ddd;">WoodLoop — Manual Book v1.0 &nbsp;|&nbsp; Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></div>',
  });

  await browser.close();
  const stats = fs.statSync(pdfPath);
  console.log(`  ✅ PDF generated: ${pdfPath}`);
  console.log(`  📦 Size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
  console.log("\n🎉 Selesai!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
