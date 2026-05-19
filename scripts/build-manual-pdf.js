#!/usr/bin/env node
/**
 * Build WoodLoop Manual Book PDF using Pandoc + XeLaTeX
 * 
 * Usage: node scripts/build-manual-pdf.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BOOK_DIR = path.resolve(__dirname, "../docs/manual-book");
const SCREENSHOTS_DIR = path.join(BOOK_DIR, "screenshots");
const OUTPUT_PDF = path.join(BOOK_DIR, "Manual-Book-WoodLoop.pdf");
const HEADER_FILE = path.join(BOOK_DIR, "pandoc-header-full.tex");
const MERGED_FILE = path.join(BOOK_DIR, "manual-book-merged.md");

// Emoji → plain text replacements (LaTeX-safe)
const EMOJI = {
  "🌲": "[Tree]", "🏭": "[Factory]", "🚛": "[Truck]", "♻️": "[Recycle]",
  "🛒": "[Cart]", "📊": "[Chart]", "✅": "[OK]", "❌": "[NO]",
  "⚠️": "[!]", "📸": "[Cam]", "💰": "[$]", "📦": "[Box]",
  "👛": "[Purse]", "🔍": "[Search]", "📝": "[Edit]", "🗑️": "[Trash]",
  "🔔": "[Bell]", "💬": "[Chat]", "🌍": "[Globe]", "🌿": "[Leaf]",
  "📱": "[Phone]", "🎨": "[Art]", "🏪": "[Store]", "🚚": "[Van]",
  "📋": "[Board]", "🪵": "[Log]", "🎉": "[Yes]", "👤": "[Person]",
  "📧": "[Mail]", "⭐": "[Star]", "🔒": "[Lock]", "🔑": "[Key]",
  "🌙": "[Moon]", "☀️": "[Sun]", "🔴": "[R]", "🟢": "[G]",
  "🟡": "[Y]", "⚫": "[B]", "⏳": "[Wait]", "➡️": "->",
  "📈": "[Up]", "📏": "[Size]", "🖼️": "[Frame]", "🙏": "[Thanks]",
  "🔄": "[Sync]", "👥": "[People]", "📐": "[Angle]", "🔧": "[Tool]",
  "🏷️": "[Tag]", "🖨️": "[Print]", "🤝": "[Shake]", "📞": "[Call]",
  "🔗": "[Link]", "🪚": "[Saw]", "🪓": "[Axe]", "🗺️": "[Map]",
  "📍": "[Pin]", "👣": "[Step]", "📲": "[Mobile]", "🕐": "[Time]",
  "📄": "[Doc]", "🏺": "[Pot]", "📿": "[Beads]", "🧸": "[Toy]",
  "🛠️": "[Tools]", "➕": "[+]", "➖": "[-]", "💳": "[Card]",
  "🏦": "[Bank]", "📷": "[Camera]", "📅": "[Date]", "🎭": "[Role]",
  "📤": "[Export]", "📉": "[Down]", "👁": "[Eye]", "👆": "[Point]",
  "🔋": "[Battery]", "💧": "[Water]", "📖": "[Book]", "🧹": "[Clean]",
  "🌐": "[Globe2]", "📕": "[Book2]", 
};

const FILES = [
  "00-cover.md", "00-kata-pengantar.md", "00-daftar-isi.md",
  "01-bab-1-pendahuluan.md", "02-bab-2-memulai.md",
  "03-bab-3-navigasi-umum.md", "04-bab-4-supplier.md",
  "05-bab-5-generator.md", "06-bab-6-aggregator.md",
  "07-bab-7-converter.md", "08-bab-8-buyer.md",
  "09-bab-9-enabler.md", "10-bab-10-fitur-global.md",
  "11-bab-11-traceability.md", "12-bab-12-troubleshooting.md",
];

const LATEX_HEADER = `
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[LE,RO]{\\thepage}
\\fancyhead[RE]{\\leftmark}
\\fancyhead[LO]{\\rightmark}
\\renewcommand{\\headrulewidth}{0.4pt}

\\usepackage[dvipsnames]{xcolor}
\\definecolor{woodgreen}{RGB}{45,106,79}

\\usepackage{tcolorbox}
\\tcbuselibrary{skins}
\\newtcolorbox{infobox}{colback=cyan!5,colframe=cyan!70,arc=4pt,left=8pt,right=8pt,top=6pt,bottom=6pt,boxrule=0.5pt,leftrule=3pt}
\\newtcolorbox{warningbox}{colback=orange!5,colframe=orange!70,arc=4pt,left=8pt,right=8pt,top=6pt,bottom=6pt,boxrule=0.5pt,leftrule=3pt}
\\newenvironment{info}{\\begin{infobox}}{\\end{infobox}}
\\newenvironment{warning}{\\begin{warningbox}}{\\end{warningbox}}

\\usepackage{booktabs}
\\usepackage{longtable}
\\usepackage{caption}
\\captionsetup{labelformat=empty,font=small}

\\usepackage{listings}
\\lstset{basicstyle=\\ttfamily\\footnotesize,breaklines=true,frame=single,
  backgroundcolor=\\color{gray!5},rulecolor=\\color{gray!30},
  xleftmargin=8pt,xrightmargin=8pt}

\\usepackage{titlesec}
\\titleformat{\\chapter}[display]{\\normalfont\\huge\\bfseries\\color{woodgreen}}
  {\\chaptername\\ \\thechapter}{20pt}{\\Huge}
  [\\vspace{8pt}\\rule{\\textwidth}{1pt}]
\\titleformat{\\section}{\\normalfont\\Large\\bfseries\\color{woodgreen}}{\\thesection}{1em}{}
\\titleformat{\\subsection}{\\normalfont\\large\\bfseries\\color{black!70}}{\\thesubsection}{1em}{}

\\usepackage{tocloft}
\\renewcommand{\\cftchapfont}{\\bfseries\\color{woodgreen}}

\\usepackage{graphicx}
\\graphicspath{{./}}

\\usepackage{hyperref}
\\hypersetup{
  colorlinks=true,
  linkcolor=woodgreen,
  urlcolor=woodgreen,
}
`;

const YAML_META = `---
title: "WoodLoop Manual Book"
toc: true
toc-depth: 2
numbersections: true
lang: id
documentclass: book
classoption:
  - 12pt
  - a4paper
  - twoside
mainfont: "DejaVu Sans"
monofont: "DejaVu Sans Mono"
geometry:
  - "margin=2cm"
  - "headheight=14pt"
---

`;

function preprocess(text) {
  // Strip YAML
  text = text.replace(/^---[\s\S]*?---\n*/, "");
  
  // Replace emoji
  for (const [em, repl] of Object.entries(EMOJI)) {
    text = text.split(em).join(repl);
  }
  text = text.replace(/\uFE0F/g, "");
  
  // Fix image paths
  text = text.replace(/\]\(screenshots\//g, "](" + SCREENSHOTS_DIR + "/");
  
  // Convert callouts to LaTeX environments
  const lines = text.split("\n");
  const result = [];
  let inCallout = false, ctype = "", cbuf = [];
  
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("> **Penting:**")) {
      if (inCallout) flush();
      inCallout = true; ctype = "warning";
      cbuf.push(t.replace(/^>\s*\*\*.*?:\*\*\s*/, ""));
    } else if ((t.startsWith("> **Catatan:**") || t.startsWith("> **Tips:**")) && !inCallout) {
      if (inCallout) flush();
      inCallout = true; ctype = "info";
      cbuf.push(t.replace(/^>\s*\*\*.*?:\*\*\s*/, ""));
    } else if (inCallout && t.startsWith(">")) {
      cbuf.push(t.replace(/^>\s*/, ""));
    } else if (inCallout) {
      flush(); result.push(line);
    } else {
      result.push(line);
    }
  }
  if (inCallout) flush();
  
  function flush() {
    const content = cbuf.join(" ").replace(/\s+/g, " ").trim();
    if (content) {
      result.push(""); result.push("\\begin{" + ctype + "}"); result.push(content); result.push("\\end{" + ctype + "}"); result.push("");
    }
    cbuf = []; inCallout = false;
  }
  return result.join("\n");
}

function main() {
  console.log("=== WoodLoop Manual Book PDF Builder ===\n");
  
  // 1. Write LaTeX header
  fs.writeFileSync(HEADER_FILE, LATEX_HEADER, "utf-8");
  console.log("✅ LaTeX header: " + HEADER_FILE);
  
  // 2. Preprocess & merge markdown
  console.log("📝 Merging " + FILES.length + " files...");
  const parts = [];
  for (const f of FILES) {
    const p = path.join(BOOK_DIR, f);
    if (!fs.existsSync(p)) { console.warn("  ⚠ " + f); continue; }
    parts.push(preprocess(fs.readFileSync(p, "utf-8")));
    console.log("  ✅ " + f);
  }
  
  let merged = YAML_META + parts.join("\n\n");
  // Remove #fragments from markdown links
  merged = merged.replace(/\]\(([^)]*?)\.md#[^)]*\)/g, "]($1.md)");
  
  fs.writeFileSync(MERGED_FILE, merged, "utf-8");
  console.log("\n✅ Merged: " + MERGED_FILE);
  
  // 3. Run Pandoc
  console.log("\n🔨 Running Pandoc + XeLaTeX...");
  const cmd = `pandoc "${MERGED_FILE}" -o "${OUTPUT_PDF}" --pdf-engine=xelatex --from markdown+raw_tex -H "${HEADER_FILE}" -V mainfont="DejaVu Sans" -V monofont="DejaVu Sans Mono" --pdf-engine-opt=-interaction=nonstopmode 2>&1`;
  
  try {
    const out = execSync(cmd, { timeout: 180000, maxBuffer: 20 * 1024 * 1024, shell: '/bin/bash' });
    if (out.toString().trim()) console.log(out.toString().slice(0, 500));
  } catch (err) {
    const e = (err.stderr || "").toString();
    if (e.trim()) console.log("⚠ Warnings:", e.slice(-500));
  }
  
  // 4. Verify
  if (fs.existsSync(OUTPUT_PDF)) {
    const s = fs.statSync(OUTPUT_PDF);
    let pages = "?";
    try {
      const info = execSync('pdfinfo "' + OUTPUT_PDF + '" 2>/dev/null | grep Pages', { shell: '/bin/bash' }).toString();
      pages = info.replace("Pages:", "").trim();
    } catch {}
    console.log("\n🎉 PDF BERHASIL!");
    console.log("   📕 " + OUTPUT_PDF);
    console.log("   📦 " + (s.size / 1024 / 1024).toFixed(1) + " MB");
    console.log("   📄 " + pages + " halaman");
  } else {
    console.log("\n❌ Gagal. Cek log.");
  }
}

main();
