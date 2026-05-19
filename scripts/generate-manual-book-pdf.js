/**
 * Generate Manual Book PDF from markdown files
 * 
 * Usage: node scripts/generate-manual-book-pdf.js
 */

const fs = require("fs");
const path = require("path");

// Resolve modules from woodloop_web
const WEB_DIR = path.resolve(__dirname, "../woodloop_web");
const { marked } = require(path.join(WEB_DIR, "node_modules/marked"));
const { chromium } = require(path.join(WEB_DIR, "node_modules/playwright"));

const BOOK_DIR = path.resolve(__dirname, "../docs/manual-book");
const OUTPUT_DIR = path.resolve(__dirname, "../docs/manual-book");
const SCREENSHOTS_DIR = path.join(BOOK_DIR, "screenshots");

// Ordered list of markdown files
const FILE_ORDER = [
  "00-cover.md",
  "00-kata-pengantar.md",
  "00-daftar-isi.md",
  "01-bab-1-pendahuluan.md",
  "02-bab-2-memulai.md",
  "03-bab-3-navigasi-umum.md",
  "04-bab-4-supplier.md",
  "05-bab-5-generator.md",
  "06-bab-6-aggregator.md",
  "07-bab-7-converter.md",
  "08-bab-8-buyer.md",
  "09-bab-9-enabler.md",
  "10-bab-10-fitur-global.md",
  "11-bab-11-traceability.md",
  "12-bab-12-troubleshooting.md",
];

/**
 * Convert markdown image syntax to HTML with base64 embedded images
 */
function processImages(markdown) {
  // Match ![alt](path)
  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
    const fullPath = path.join(BOOK_DIR, imgPath);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).toLowerCase().replace(".", "");
      const mime = ext === "svg" ? "svg+xml" : ext === "jpg" ? "jpeg" : ext;
      const data = fs.readFileSync(fullPath);
      const b64 = data.toString("base64");
      const caption = alt ? `<p class="gambar-caption"><em>${alt}</em></p>` : "";
      return `<figure class="gambar">\n  <img src="data:image/${mime};base64,${b64}" alt="${alt}" />\n  ${caption}\n</figure>`;
    }
    return match;
  });
}

/**
 * Read all markdown files and combine into one HTML document
 */
async function buildHtml() {
  const parts = [];

  // CSS styling for PDF
  const css = `
    @page {
      size: A4;
      margin: 2.5cm 2cm 2.5cm 2cm;
      @bottom-center {
        content: counter(page);
        font-size: 10pt;
        color: #666;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 100%;
    }

    /* Cover page */
    .cover-page {
      page-break-after: always;
      text-align: center;
      padding-top: 120px;
    }
    .cover-page h1 {
      font-size: 36pt;
      color: #2D6A4F;
      margin-bottom: 10px;
    }
    .cover-page .subtitle {
      font-size: 16pt;
      color: #555;
      margin-bottom: 40px;
    }
    .cover-page .version {
      font-size: 12pt;
      color: #888;
      margin-top: 60px;
    }
    .cover-page .tagline {
      font-size: 14pt;
      font-style: italic;
      color: #2D6A4F;
      margin: 30px 0;
      padding: 20px 0;
      border-top: 2px solid #2D6A4F;
      border-bottom: 2px solid #2D6A4F;
    }
    .cover-page .info-table {
      margin: 40px auto;
      width: 60%;
      text-align: left;
    }
    .cover-page .info-table td {
      padding: 4px 12px;
      font-size: 11pt;
    }
    .cover-page .info-table td:first-child {
      font-weight: bold;
      width: 40%;
    }

    /* Kata pengantar - new page */
    .kata-pengantar {
      page-break-after: always;
    }
    .kata-pengantar h1 {
      font-size: 20pt;
      color: #2D6A4F;
      border-bottom: 2px solid #2D6A4F;
      padding-bottom: 8px;
    }

    /* Daftar isi - new page */
    .daftar-isi {
      page-break-after: always;
    }
    .daftar-isi h1 {
      font-size: 20pt;
      color: #2D6A4F;
      border-bottom: 2px solid #2D6A4F;
      padding-bottom: 8px;
    }
    .daftar-isi .toc-col {
      column-count: 2;
      column-gap: 30px;
    }
    .daftar-isi .toc-section {
      break-inside: avoid;
      margin-bottom: 10px;
    }
    .daftar-isi .toc-section h3 {
      font-size: 12pt;
      color: #2D6A4F;
      margin: 6px 0 3px 0;
    }
    .daftar-isi .toc-section ul {
      list-style: none;
      padding-left: 10px;
      margin: 0;
    }
    .daftar-isi .toc-section li {
      font-size: 10pt;
      padding: 1px 0;
    }
    .daftar-isi .toc-section a {
      color: #333;
      text-decoration: none;
    }
    .daftar-isi .toc-section a:hover { text-decoration: underline; }

    /* Chapter headings */
    h1 {
      font-size: 22pt;
      color: #2D6A4F;
      border-bottom: 3px solid #2D6A4F;
      padding-bottom: 8px;
      margin-top: 40px;
      page-break-before: always;
    }
    h1:first-of-type { page-break-before: avoid; }

    h2 {
      font-size: 16pt;
      color: #2D6A4F;
      margin-top: 30px;
      padding-bottom: 4px;
      border-bottom: 1px solid #ccc;
    }

    h3 {
      font-size: 13pt;
      color: #333;
      margin-top: 20px;
    }

    h4 {
      font-size: 11pt;
      color: #555;
      margin-top: 15px;
    }

    p { margin: 8px 0; }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    th {
      background-color: #2D6A4F;
      color: white;
      padding: 8px 10px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 6px 10px;
      border-bottom: 1px solid #ddd;
    }
    tr:nth-child(even) td { background-color: #f8f8f8; }
    tr:hover td { background-color: #f0f7f4; }

    /* Figures & Images */
    figure.gambar {
      margin: 16px auto;
      text-align: center;
      page-break-inside: avoid;
    }
    figure.gambar img {
      max-width: 95%;
      max-height: 400px;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .gambar-caption {
      font-size: 9pt;
      color: #666;
      margin-top: 6px;
      font-style: italic;
    }

    /* Blockquotes / Callouts */
    blockquote {
      border-left: 4px solid #2D6A4F;
      background: #f0f7f4;
      padding: 12px 18px;
      margin: 16px 0;
      border-radius: 0 6px 6px 0;
      font-size: 10pt;
    }
    blockquote p { margin: 4px 0; }

    /* Code blocks */
    pre {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 9pt;
      line-height: 1.4;
      overflow-x: auto;
      font-family: 'Consolas', 'Monaco', monospace;
    }
    code {
      background: #f0f0f0;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 9pt;
      font-family: 'Consolas', 'Monaco', monospace;
    }
    pre code {
      background: none;
      padding: 0;
    }

    /* Lists */
    ul, ol { padding-left: 24px; }
    li { margin: 4px 0; }

    /* Horizontal rule */
    hr {
      border: none;
      border-top: 2px solid #2D6A4F;
      margin: 30px 0;
    }

    /* Summary boxes */
    .ringkasan {
      background: #f0f7f4;
      border: 1px solid #2D6A4F;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 20px 0;
      page-break-inside: avoid;
    }
    .ringkasan h3 {
      color: #2D6A4F;
      margin-top: 0;
    }

    /* Success/Info boxes */
    .info-box {
      background: #e8f4fd;
      border-left: 4px solid #2196F3;
      padding: 10px 16px;
      margin: 12px 0;
      border-radius: 0 6px 6px 0;
    }
    .warning-box {
      background: #fff8e1;
      border-left: 4px solid #FF9800;
      padding: 10px 16px;
      margin: 12px 0;
      border-radius: 0 6px 6px 0;
    }

    /* Navigasi antar bab */
    .bab-navigasi {
      margin-top: 30px;
      padding: 12px;
      background: #f8f8f8;
      border-radius: 6px;
      text-align: center;
      font-size: 10pt;
    }
    .bab-navigasi a {
      color: #2D6A4F;
      font-weight: 600;
      text-decoration: none;
    }

    /* Print footer */
    .footer-note {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #ccc;
      font-size: 8pt;
      color: #888;
      text-align: center;
    }

    /* Ascii art / diagram */
    .ascii-art {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 8pt;
      line-height: 1.2;
      white-space: pre;
      background: #fafafa;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 10px;
      overflow-x: auto;
    }

    .page-break { page-break-before: always; }
  `;

  // Read and process each file
  for (const filename of FILE_ORDER) {
    const filepath = path.join(BOOK_DIR, filename);
    if (!fs.existsSync(filepath)) {
      console.warn(`⚠ File not found: ${filename}`);
      continue;
    }

    let content = fs.readFileSync(filepath, "utf-8");

    // Remove YAML front matter
    content = content.replace(/^---[\s\S]*?---\n*/, "");

    // Convert admonitions/callouts
    content = content.replace(/^> \*\*Penting:\*\*/gm, '<div class="warning-box">**Penting:**');
    content = content.replace(/^> \*\*Catatan:\*\*/gm, '<div class="info-box">**Catatan:**');
    content = content.replace(/^> \*\*Tips:\*\*/gm, '<div class="info-box">**Tips:**');
    // Close any unclosed admonitions at the end of a section
    content = content.replace(/<\/div>\s*$/gm, "");
    
    // Process images (embed base64)
    content = processImages(content);

    // Convert markdown to HTML
    let html;
    try {
      html = await marked.parse(content, { breaks: true, gfm: true });
    } catch (e) {
      console.error(`✗ Error parsing ${filename}:`, e.message);
      // Fallback: wrap in pre
      html = `<pre>${content}</pre>`;
    }

    // Close any unclosed divs from callouts
    // (simple approach: count opens and closes)

    parts.push(html);
  }

  // Count and fix callout divs
  let fullHtml = parts.join("\n\n");
  
  // Fix callout patterns
  fullHtml = fullHtml.replace(/<div class="warning-box">\*\*Penting:\*\*/g, '<div class="warning-box"><strong>Penting:</strong>');
  fullHtml = fullHtml.replace(/<div class="info-box">\*\*Catatan:\*\*/g, '<div class="info-box"><strong>Catatan:</strong>');
  fullHtml = fullHtml.replace(/<div class="info-box">\*\*Tips:\*\*/g, '<div class="info-box"><strong>Tips:</strong>');

  // Wrap ringkasan sections
  fullHtml = fullHtml.replace(/<h3>Ringkasan Bab/g, '</div><h3>Ringkasan Bab');

  // Build final HTML document
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Manual Book WoodLoop</title>
  <style>${css}</style>
</head>
<body>

<div class="cover-page">
  <h1>🌳 WoodLoop</h1>
  <div class="subtitle">Manual Book Aplikasi</div>
  <p style="font-size:16pt;color:#555;">Platform Ekonomi Sirkular<br>Industri Kayu Jepara</p>
  
  <div class="version">Versi 1.0 — Mei 2026</div>
  
  <div class="tagline">
    "Mengubah Limbah Kayu Menjadi Berkah untuk Jepara"
  </div>

  <table class="info-table">
    <tr><td>Platform</td><td>Web + Android (Hybrid)</td></tr>
    <tr><td>Backend</td><td>PocketBase</td></tr>
    <tr><td>Pengguna</td><td>6 Peran (Supplier, Generator, Aggregator, Converter, Enabler, Buyer)</td></tr>
  </table>
  
  <p style="margin-top:60px;font-size:10pt;color:#888;">
    📧 woodloop@example.com &nbsp;|&nbsp; 🌐 woodloop.app
  </p>
</div>

${fullHtml}

<div class="footer-note">
  <p>© 2026 WoodLoop — Platform Ekonomi Sirkular Industri Kayu Jepara</p>
  <p>Dokumen ini dapat diperbanyak dan didistribusikan untuk keperluan edukasi dan pelatihan.</p>
</div>

</body>
</html>`;
}

async function main() {
  console.log("📖 Generating Manual Book PDF...\n");

  // Build HTML
  console.log("📝 Processing markdown files...");
  const html = await buildHtml();
  
  // Save HTML for debugging
  const htmlPath = path.join(OUTPUT_DIR, "manual-book.html");
  fs.writeFileSync(htmlPath, html, "utf-8");
  console.log(`  ✅ HTML saved: ${htmlPath}`);

  // Generate PDF via Playwright
  console.log("📄 Generating PDF with Playwright...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const pdfPath = path.join(OUTPUT_DIR, "Manual-Book-WoodLoop.pdf");
  await page.pdf({
    path: pdfPath,
    format: "A4",
    margin: { top: "2cm", bottom: "2cm", left: "1.8cm", right: "1.8cm" },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="width:100%;font-size:9pt;color:#888;text-align:center;padding:4px 0;border-top:1px solid #ddd;">
        WoodLoop — Manual Book v1.0 &nbsp;|&nbsp; Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span>
      </div>
    `,
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
