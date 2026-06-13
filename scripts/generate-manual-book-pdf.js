/**
 * Generate Manual Book PDF — Global
 * Approach: Build direct HTML (like supplier manual), render with Playwright
 *
 * Usage: node scripts/generate-manual-book-pdf.js
 */

const fs = require("fs");
const path = require("path");

const WEB_DIR = path.resolve(__dirname, "../woodloop_web");
const BOOK_DIR = path.resolve(__dirname, "../docs/manual-book");
const OUTPUT_DIR = BOOK_DIR;
const { chromium } = require(path.join(WEB_DIR, "node_modules/playwright"));

// --------------- helpers ---------------

function imgTag(filename, caption) {
  const p = path.join(BOOK_DIR, "screenshots", filename);
  if (!fs.existsSync(p))
    return `<p style="color:#999;font-style:italic">[Screenshot: ${caption}]</p>`;
  return `<figure>
    <img src="file://${p}" style="max-width:100%;border:1px solid #ddd;border-radius:4px;" />
    <figcaption style="text-align:center;font-size:10pt;color:#555;margin-top:4px;">${caption}</figcaption>
  </figure>`;
}

function mdTableToHtml(md) {
  // Convert markdown table to HTML table
  const lines = md.trim().split("\n");
  if (lines.length < 2) return md;
  const header = lines[0].replace(/^\|/, "").replace(/\|$/, "").split("|").map(s => s.trim());
  const sep = lines[1];
  if (!sep.includes("---")) return md;
  const rows = lines.slice(2).filter(l => l.trim());
  let html = "<table>\n  <tr><th>" + header.join("</th><th>") + "</th></tr>\n";
  for (const row of rows) {
    const cells = row.replace(/^\|/, "").replace(/\|$/, "").split("|").map(s => s.trim());
    html += "  <tr><td>" + cells.join("</td><td>") + "</td></tr>\n";
  }
  html += "</table>";
  return html;
}

function mdToSimpleHtml(md) {
  let html = md;
  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr/>');
  // Unordered list
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => '<ul>' + m.replace(/\n$/, '') + '</ul>');
  // Paragraphs - wrap remaining text lines
  const lines = html.split("\n");
  const result = [];
  let inPre = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith("<pre>")) { inPre = true; result.push(l); continue; }
    if (l.startsWith("</pre>")) { inPre = false; result.push(l); continue; }
    if (inPre) { result.push(l); continue; }
    if (l.startsWith("<")) { result.push(l); continue; }
    if (l.trim() === "") { result.push(""); continue; }
    // Image
    const imgMatch = l.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      result.push(imgTag(imgMatch[2].replace("screenshots/", ""), imgMatch[1]));
      continue;
    }
    // Table
    if (l.startsWith("|")) {
      let tableLines = [l];
      while (i + 1 < lines.length && lines[i + 1].startsWith("|")) {
        i++;
        tableLines.push(lines[i]);
      }
      result.push(mdTableToHtml(tableLines.join("\n")));
      continue;
    }
    // Pre block
    if (l.startsWith("```")) {
      let code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      result.push("<pre><code>" + code.join("\n") + "</code></pre>");
      continue;
    }
    // Regular paragraph
    result.push("<p>" + l + "</p>");
  }
  return result.join("\n");
}

// --------------- build HTML ---------------

function buildHtml() {
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

  const pages = [
    { file: "00-kata-pengantar.md", title: "Kata Pengantar" },
    { file: "00-daftar-isi.md", title: "Daftar Isi", isToc: true },
    { file: "01-bab-1-pendahuluan.md", title: "Bab 1: Pendahuluan" },
    { file: "02-bab-2-memulai.md", title: "Bab 2: Memulai" },
    { file: "03-bab-3-navigasi-umum.md", title: "Bab 3: Navigasi Umum" },
    { file: "04-bab-4-supplier.md", title: "Bab 4: Panduan Supplier" },
    { file: "05-bab-5-generator.md", title: "Bab 5: Panduan Generator" },
    { file: "06-bab-6-aggregator.md", title: "Bab 6: Panduan Aggregator" },
    { file: "07-bab-7-converter.md", title: "Bab 7: Panduan Converter" },
    { file: "08-bab-8-buyer.md", title: "Bab 8: Panduan Buyer" },
    { file: "09-bab-9-desainer.md", title: "Bab 9: Panduan Desainer" },
    { file: "10-bab-10-enabler.md", title: "Bab 10: Panduan Enabler" },
    { file: "11-bab-11-fitur-global.md", title: "Bab 11: Fitur Global" },
    { file: "12-bab-12-traceability.md", title: "Bab 12: Traceability & QR Code" },
    { file: "13-bab-13-troubleshooting.md", title: "Bab 13: Troubleshooting & FAQ" },
  ];

  const css = `
    @page { margin: 2cm 2.5cm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #222; max-width: 750px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 20pt; color: #1a5c2a; border-bottom: 2px solid #1a5c2a; padding-bottom: 6px; margin-top: 30px; page-break-before: always; }
    h1:first-of-type { page-break-before: avoid; }
    h2 { font-size: 15pt; color: #2d7d41; margin-top: 24px; }
    h3 { font-size: 12pt; color: #333; margin-top: 18px; }
    h4 { font-size: 11pt; color: #555; margin-top: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; page-break-inside: avoid; }
    th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; }
    th { background: #e8f5e9; }
    figure { margin: 16px 0; text-align: center; page-break-inside: avoid; }
    pre, code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; font-size: 9pt; }
    pre { padding: 10px; overflow-x: auto; line-height: 1.3; }
    blockquote { border-left: 4px solid #1a5c2a; margin: 12px 0; padding: 8px 16px; background: #f9fdf9; font-size: 10pt; }
    .page-break { page-break-before: always; }
    .cover { text-align: center; padding-top: 80px; page-break-after: always; }
    .cover h1 { font-size: 28pt; border: none; color: #1a5c2a; margin: 0; }
    .cover h2 { font-size: 18pt; color: #555; border: none; margin: 6px 0; }
    .cover-sub { font-size: 14pt; color: #666; }
    .cover hr { width: 50%; margin: 20px auto; border: none; border-top: 1px solid #1a5c2a; }
    .cover-tagline { font-size: 13pt; color: #1a5c2a; }
    .cover-version { font-size: 12pt; color: #666; }
    .cover-info { width: auto; margin: 0 auto; font-size: 11pt; }
    .cover-info td { border: none; padding: 3px 12px; }
    .cover-url, .cover-email { font-size: 10pt; color: #999; margin: 2px 0; }
    .toc a { color: #1a5c2a; text-decoration: none; }
    .toc ul { list-style: none; padding-left: 0; }
    .toc ul ul { padding-left: 20px; }
    .toc li { margin: 3px 0; font-size: 10pt; }
    .note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 8px 14px; margin: 10px 0; font-size: 10pt; }
    .warn { background: #f8d7da; border-left: 4px solid #dc3545; padding: 8px 14px; margin: 10px 0; font-size: 10pt; }
    .tip { background: #d4edda; border-left: 4px solid #28a745; padding: 8px 14px; margin: 10px 0; font-size: 10pt; }
    ul, ol { padding-left: 22px; font-size: 10pt; }
    li { margin: 3px 0; }
    p { margin: 8px 0; font-size: 11pt; }
  `;

  let body = cover;

  for (let idx = 0; idx < pages.length; idx++) {
    const p = pages[idx];
    const filepath = path.join(BOOK_DIR, p.file);
    if (!fs.existsSync(filepath)) {
      console.warn(`  ⚠ File not found: ${p.file}`);
      continue;
    }
    let content = fs.readFileSync(filepath, "utf-8");
    // Remove YAML front matter
    content = content.replace(/^---[\s\S]*?---\n*/, "");
    // Remove navigation line at end (Lanjut ke Bab ...)
    content = content.replace(/\n➡️.*\n*$/, "");
    // Remove "Ringkasan" sections (they're duplicative for PDF)
    content = content.replace(/\n### Ringkasan Bab [\s\S]*?(?=\n---|\n➡️|$)/, "");
    // Convert > **Penting:** etc to divs
    content = content.replace(/^> \*\*Penting:\*\*/gm, '<div class="warn"><strong>Penting:</strong>');
    content = content.replace(/^> \*\*Catatan:\*\*/gm, '<div class="note"><strong>Catatan:</strong>');
    content = content.replace(/^> \*\*Tips:\*\*/gm, '<div class="tip"><strong>Tips:</strong>');
    // Close any unclosed admonitions
    const openWarn = (content.match(/<div class="warn">/g) || []).length;
    const closeWarn = (content.match(/<\/div>/g) || []).length;
    if (openWarn > closeWarn) content += "\n</div>";

    let html = mdToSimpleHtml(content);
    body += `<div class="page-break"></div>\n${html}`;
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
<style>${css}</style>
</head>
<body>
${body}
</body>
</html>`;
}

async function main() {
  console.log("📖 Generating Manual Book PDF...\n");

  console.log("📝 Building HTML...");
  const html = buildHtml();
  const htmlPath = path.join(OUTPUT_DIR, "manual-book.html");
  fs.writeFileSync(htmlPath, html, "utf-8");
  console.log(`  ✅ HTML saved: ${htmlPath}`);

  console.log("📄 Generating PDF with Playwright...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + htmlPath, { waitUntil: "networkidle0" });
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
