#!/usr/bin/env node
/**
 * Build Manual Book: Markdown → HTML → PDF via wkhtmltopdf
 * 
 * Single column layout, proper page breaks, emoji support
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BOOK_DIR = path.resolve(__dirname, "../docs/manual-book");
const SCREENSHOTS_DIR = path.join(BOOK_DIR, "screenshots");
const WEB_DIR = path.resolve(__dirname, "../woodloop_web");
const { marked } = require(path.join(WEB_DIR, "node_modules/marked"));

const OUTPUT_HTML = path.join(BOOK_DIR, "manual-book.html");
const OUTPUT_PDF = path.join(BOOK_DIR, "Manual-Book-WoodLoop.pdf");

const FILES = [
  "00-kata-pengantar.md", "00-daftar-isi.md",
  "01-bab-1-pendahuluan.md", "02-bab-2-memulai.md",
  "03-bab-3-navigasi-umum.md", "04-bab-4-supplier.md",
  "05-bab-5-generator.md", "06-bab-6-aggregator.md",
  "07-bab-7-converter.md", "08-bab-8-desainer.md",
  "09-bab-9-buyer.md", "10-bab-10-enabler.md",
  "11-bab-11-fitur-global.md", "12-bab-12-traceability.md",
  "13-bab-13-troubleshooting.md",
];

// ─── CSS ─────────────────────────────────────────────────────
const CSS = `
  @page {
    size: A4;
    margin: 2cm 2.5cm 2cm 2.5cm;
  }

  * { box-sizing: border-box; }

  body {
    font-family: 'Segoe UI', 'DejaVu Sans', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    max-width: 100%;
  }

  /* ── Cover ── */
  .cover-page {
    page-break-after: always;
    /* kata-pengantar follows naturally (no page-break-before needed) */
    text-align: center;
    padding-top: 100px;
  }
  .cover-page h1 { font-size: 42pt; color: #2D6A4F; margin-bottom: 10px; }
  .cover-page .subtitle { font-size: 18pt; color: #555; }
  .cover-page .tagline {
    font-size: 14pt; font-style: italic; color: #2D6A4F;
    margin: 40px auto; padding: 20px 0; width: 70%;
    border-top: 2px solid #2D6A4F; border-bottom: 2px solid #2D6A4F;
  }
  .cover-page .info-table { margin: 40px auto; width: auto; }
  .cover-page .info-table td { padding: 4px 16px; border: none; }

  /* ── Headings ── */
  h1 {
    font-size: 22pt; color: #2D6A4F;
    border-bottom: 3px solid #2D6A4F; padding-bottom: 8px;
    margin-top: 40px;
  }
  /* Only chapter headings (bab) get page break */
  .bab h1 { page-break-before: always; }
  /* Cover already has page-break-after on its container */
  /* Kata pengantar starts right after cover (cover's page-break-after handles it) */
  .daftar-isi { page-break-before: always; }
  h2 { font-size: 16pt; color: #2D6A4F; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
  h3 { font-size: 13pt; color: #333; margin-top: 20px; }
  h4 { font-size: 11pt; color: #555; margin-top: 14px; }

  p { margin: 8px 0; }

  /* ── Tables ── */
  table {
    width: 100%; border-collapse: collapse; margin: 16px 0;
    font-size: 9.5pt; page-break-inside: avoid;
  }
  th { background: #2D6A4F; color: #fff; padding: 7px 10px; text-align: left; font-weight: 600; }
  td { padding: 5px 10px; border-bottom: 1px solid #ddd; }
  tr:nth-child(even) td { background: #f8f8f8; }

  /* ── Figures ── */
  figure { margin: 16px auto; text-align: center; page-break-inside: avoid; }
  figure img { max-width: 90%; max-height: 380px; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  figcaption { font-size: 9pt; color: #888; margin-top: 4px; font-style: italic; }

  /* ── Callouts ── */
  blockquote {
    border-left: 4px solid #2D6A4F; background: #f0f7f4;
    padding: 10px 18px; margin: 14px 0; border-radius: 0 6px 6px 0;
    page-break-inside: avoid;
  }
  blockquote.warning {
    border-left-color: #FF9800; background: #fff8e1;
  }
  blockquote.info {
    border-left-color: #2196F3; background: #e3f2fd;
  }

  /* ── Code ── */
  pre {
    background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px;
    padding: 10px 14px; font-size: 8.5pt; line-height: 1.3;
    overflow-x: auto; font-family: 'Consolas', 'DejaVu Sans Mono', monospace;
  }
  code {
    background: #f0f0f0; padding: 1px 5px; border-radius: 3px;
    font-size: 9pt; font-family: 'Consolas', monospace;
  }
  pre code { background: none; padding: 0; }

  /* ── Lists ── */
  ul, ol { padding-left: 22px; }
  li { margin: 3px 0; }

  /* ── Ascii art ── */
  .ascii-art {
    font-family: 'Consolas', 'DejaVu Sans Mono', monospace;
    font-size: 7.5pt; line-height: 1.15;
    white-space: pre; background: #fafafa;
    border: 1px solid #eee; border-radius: 4px;
    padding: 8px; overflow-x: auto;
  }

  /* ── Page break helpers ── */
  .page-break { page-break-before: always; }

  /* ── Navigation ── */
  .nav-footer {
    margin-top: 30px; padding: 12px; background: #f8f8f8;
    border-radius: 6px; text-align: center; font-size: 10pt;
  }
  .nav-footer a { color: #2D6A4F; font-weight: 600; text-decoration: none; }

  /* ── Footer ── */
  .doc-footer {
    margin-top: 50px; padding-top: 16px;
    border-top: 1px solid #ccc; font-size: 8pt; color: #888; text-align: center;
  }

  /* ── Daftar isi 2 kolom ── */
  .toc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 30px;
  }
  .toc-section { break-inside: avoid; margin-bottom: 8px; }
  .toc-section h3 { font-size: 11pt; color: #2D6A4F; margin: 5px 0 2px; }
  .toc-section ul { list-style: none; padding-left: 6px; margin: 0; }
  .toc-section li { font-size: 9.5pt; padding: 1px 0; }
  .toc-section a { color: #333; text-decoration: none; }
`;

// ─── Preprocess markdown ─────────────────────────────────
function preprocess(text, filename) {
  // Strip YAML
  text = text.replace(/^---[\s\S]*?---\n*/, "");

  // Fix image paths to absolute
  text = text.replace(/\]\(screenshots\//g, "](" + SCREENSHOTS_DIR + "/");

  // Wrap blockquotes with **Penting:** etc.
  text = text.replace(/^> \*\*Penting:\*\*/gm, '> [!WARNING] ');
  text = text.replace(/^> \*\*Catatan:\*\*/gm, '> [!INFO] ');
  text = text.replace(/^> \*\*Tips:\*\*/gm, '> [!INFO] ');

  return text;
}

// ─── Post-process HTML ────────────────────────────────────
function postProcessHtml(html, filename) {
  // Wrap blockquotes with class
  html = html.replace(/<blockquote>\s*<p>\[!WARNING\]/g, '<blockquote class="warning"><p><strong>Penting:</strong>');
  html = html.replace(/<blockquote>\s*<p>\[!INFO\]/g, '<blockquote class="info"><p><strong>Tips:</strong>');
  html = html.replace(/<blockquote>\s*<p>\[!INFO\]/g, '<blockquote class="info"><p><strong>Catatan:</strong>');

  // Wrap figures
  html = html.replace(/<img src="([^"]+)" alt="([^"]*)"\s*\/?>/g, (match, src, alt) => {
    return `<figure><img src="${src}" alt="${alt}" /><figcaption>${alt}</figcaption></figure>`;
  });

  // Wrap ASCII art (pre blocks that contain box drawing chars)
  html = html.replace(/<pre><code>([\s\S]*?[│└─┌├┐┬┴┼].*?)<\/code><\/pre>/g, '<div class="ascii-art">$1</div>');

  return html;
}

// ─── Main ─────────────────────────────────────────────────
async function main() {
  console.log("=== WoodLoop Manual Book Builder (HTML → wkhtmltopdf) ===\n");

  // Collect all HTML parts
  const htmlParts = [];

  for (const filename of FILES) {
    const filepath = path.join(BOOK_DIR, filename);
    if (!fs.existsSync(filepath)) { console.warn("  ⚠ " + filename); continue; }

    let md = fs.readFileSync(filepath, "utf-8");
    md = preprocess(md, filename);
    let html = await marked.parse(md, { breaks: true, gfm: true });
    html = postProcessHtml(html, filename);

    // Wrap chapter content for CSS targeting
    if (filename.match(/^\d{2}-bab/)) {
      html = `<div class="bab">\n${html}\n</div>`;
    } else if (filename === "00-kata-pengantar.md") {
      html = `<div class="kata-pengantar">\n${html}\n</div>`;
    } else if (filename === "00-daftar-isi.md") {
      html = `<div class="daftar-isi">\n${html}\n</div>`;
    }

    htmlParts.push(html);
    console.log("  ✅ " + filename);
  }

  // Build complete HTML
  const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>WoodLoop Manual Book</title>
<style>${CSS}</style>
</head>
<body>

<!-- COVER -->
<div class="cover-page">
  <h1>🌳 WoodLoop</h1>
  <div class="subtitle">Manual Book Aplikasi</div>
  <p style="font-size:16pt;color:#555;margin-top:8px;">Platform Ekonomi Sirkular<br>Industri Kayu Jepara</p>
  <p style="font-size:12pt;color:#888;margin-top:40px;">Versi 1.0 — Mei 2026</p>
  <div class="tagline">"Mengubah Limbah Kayu Menjadi Berkah untuk Jepara"</div>
  <table class="info-table">
    <tr><td>Platform</td><td>Web + Android (Hybrid)</td></tr>
    <tr><td>Backend</td><td>PocketBase</td></tr>
    <tr><td>Pengguna</td><td>7 Peran (Supplier, Generator, Aggregator, Converter, Desainer, Buyer, Enabler)</td></tr>
  </table>
  <p style="margin-top:60px;font-size:10pt;color:#888;">📧 woodloop.app@gmail.com &nbsp;|&nbsp; 🌐 woodloop.github.io/app</p>
</div>

${htmlParts.join("\n\n")}

<div class="doc-footer">
  <p>© 2026 WoodLoop — Platform Ekonomi Sirkular Industri Kayu Jepara</p>
  <p>Dokumen ini dapat diperbanyak dan didistribusikan untuk keperluan edukasi dan pelatihan.</p>
</div>

</body>
</html>`;

  // Write HTML
  fs.writeFileSync(OUTPUT_HTML, fullHtml, "utf-8");
  const htmlSize = (fs.statSync(OUTPUT_HTML).size / 1024 / 1024).toFixed(1);
  console.log(`\n✅ HTML generated: ${OUTPUT_HTML} (${htmlSize} MB)`);

  // Convert to PDF via wkhtmltopdf
  console.log("\n🔨 Converting to PDF via wkhtmltopdf...");
  const cmd = `wkhtmltopdf \
    --page-size A4 \
    --margin-top 15mm \
    --margin-bottom 15mm \
    --margin-left 18mm \
    --margin-right 18mm \
    --encoding UTF-8 \
    --enable-local-file-access \
    --footer-center 'WoodLoop — Manual Book v1.0  |  Halaman [page] dari [topage]' \
    --footer-font-size 8 \
    --footer-line \
    "${OUTPUT_HTML}" \
    "${OUTPUT_PDF}" \
    2>&1`;

  try {
    const out = execSync(cmd, { timeout: 60000, maxBuffer: 10 * 1024 * 1024, shell: '/bin/bash' });
    if (out.toString().trim()) console.log(out.toString().slice(0, 1000));
  } catch (err) {
    console.log("⚠", (err.stderr || "").toString().slice(-500));
  }

  // Verify
  if (fs.existsSync(OUTPUT_PDF)) {
    const s = fs.statSync(OUTPUT_PDF);
    let pages = "?";
    try {
      const info = execSync('pdfinfo "' + OUTPUT_PDF + '" 2>/dev/null | grep Pages', { shell: '/bin/bash' }).toString();
      pages = info.replace("Pages:", "").trim();
    } catch {}
    console.log(`\n🎉 PDF BERHASIL!`);
    console.log(`   📕 ${OUTPUT_PDF}`);
    console.log(`   📦 ${(s.size / 1024 / 1024).toFixed(1)} MB`);
    console.log(`   📄 ${pages} halaman`);
  } else {
    console.log("\n❌ Gagal");
  }
}

main().catch(err => { console.error("❌", err.message); process.exit(1); });
