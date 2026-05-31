import { chromium } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, "..", "e2e-report", "screenshots");
fs.mkdirSync(screenshotDir, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    baseURL: "http://localhost:3001",
  });
  const page = await context.newPage();

  try {
    // =====================================================================
    // STEP 1: Login
    // =====================================================================
    console.log("1. Navigating to /login...");
    await page.goto("/login", { waitUntil: "networkidle", timeout: 30000 });
    
    console.log("2. Filling login credentials...");
    await page.fill('input[type="email"]', "demo.supplier@woodloop.id");
    await page.fill('input[type="password"]', "password12345");
    await page.click('button[type="submit"]');

    // Wait for redirect to supplier dashboard or inventory
    await page.waitForURL(/supplier/i, { timeout: 30000 });
    console.log("3. Logged in! URL:", page.url());

    // =====================================================================
    // STEP 2: Navigate to inventory/new
    // =====================================================================
    console.log("4. Navigating to /supplier/inventory/new...");
    await page.goto("/supplier/inventory/new", { waitUntil: "domcontentloaded", timeout: 30000 });
    // Wait for any redirects to settle
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3000);
    console.log("   URL after navigation:", page.url());
    // Wait for the heading
    await page.waitForSelector("text=Daftarkan Kayu Baru", { timeout: 20000 });
    console.log("5. Page loaded successfully!");

    // Check default shape (should be "log")
    const defaultShape = await page.locator("#shape").textContent();
    console.log("6. Default shape selected:", defaultShape);

    // =====================================================================
    // STEP 3: Change to "Balok"
    // =====================================================================
    console.log("\n--- Changing Bentuk Kayu to 'Balok' ---");
    await page.click("#shape");
    await page.waitForTimeout(500);
    // Click the select item with value="balok"
    await page.click('[data-value="balok"]');
    await page.waitForTimeout(1000);

    // Find the dimension container
    const dimContainerSelector = 'div.grid.grid-cols-3.gap-4';
    let dimContainer = page.locator(dimContainerSelector).first();
    
    // Check visibility
    const isVisible = await dimContainer.isVisible();
    console.log("Dimensions container visible:", isVisible);

    if (isVisible) {
      // Take screenshot of the dimensions section
      const box = await dimContainer.boundingBox();
      if (box) {
        // Capture a bit more context (the labels + inputs)
        await page.screenshot({
          path: path.join(screenshotDir, "dimensions-balok.png"),
          clip: {
            x: box.x - 10,
            y: box.y - 35,
            width: box.width + 20,
            height: box.height + 70,
          },
        });
        console.log("Screenshot saved: dimensions-balok.png");
      }

      // Get the HTML structure
      const dimInfo = await page.evaluate((selector) => {
        const container = document.querySelector(selector);
        if (!container) return null;

        const children = Array.from(container.children);
        return {
          containerTag: container.tagName,
          containerClass: container.className,
          childCount: children.length,
          childElements: children.map((child, i) => ({
            index: i,
            tag: child.tagName,
            class: child.className,
            labelText: child.querySelector("Label")?.textContent || "N/A",
            inputId: child.querySelector("Input")?.id || "N/A",
            inputPlaceholder: child.querySelector("Input")?.getAttribute("placeholder") || "N/A",
            innerHTML: child.innerHTML.replace(/>\s+</g, "><").trim(),
          })),
        };
      }, dimContainerSelector);

      console.log("\n=== DIMENSION CONTAINER (Balok) ===");
      console.log(`Container tag: ${dimInfo.containerTag}`);
      console.log(`Container class: ${dimInfo.containerClass}`);
      console.log(`Number of children (columns): ${dimInfo.childCount}`);
      console.log(`\nChild details:`);
      dimInfo.childElements.forEach((child) => {
        console.log(`  [${child.index}] ${child.labelText} -> input#${child.inputId} (placeholder: "${child.inputPlaceholder}")`);
      });

      // =====================================================================
      // STEP 4: Check the grid layout for the container
      // =====================================================================
      // The container has class "grid grid-cols-3 gap-4" — this means:
      // - It uses CSS Grid layout (grid)
      // - 3 columns (grid-cols-3)
      // - Gap of 1rem between items (gap-4 = 16px)
      // - 3 child divs with class "space-y-2"
      
      // So it's displayed as: 1 row × 3 columns

      console.log(`\n✅ DISPLAY: 1 ROW × ${dimInfo.childCount} COLUMNS (grid-cols-3)`);
      console.log(`✅ CSS CLASS on container: "${dimInfo.containerClass}"`);
    }

    // =====================================================================
    // STEP 5: Change to "Papan" and verify the same
    // =====================================================================
    console.log("\n--- Changing Bentuk Kayu to 'Papan' ---");
    await page.click("#shape");
    await page.waitForTimeout(500);
    await page.click('[data-value="papan"]');
    await page.waitForTimeout(1000);

    dimContainer = page.locator(dimContainerSelector).first();
    const isVisiblePapan = await dimContainer.isVisible();
    console.log("Dimensions container visible (Papan):", isVisiblePapan);

    if (isVisiblePapan) {
      // Take screenshot
      const box = await dimContainer.boundingBox();
      if (box) {
        await page.screenshot({
          path: path.join(screenshotDir, "dimensions-papan.png"),
          clip: {
            x: box.x - 10,
            y: box.y - 35,
            width: box.width + 20,
            height: box.height + 70,
          },
        });
        console.log("Screenshot saved: dimensions-papan.png");
      }

      // Verify same structure
      const dimInfoPapan = await page.evaluate((selector) => {
        const container = document.querySelector(selector);
        if (!container) return null;
        return {
          containerClass: container.className,
          childCount: container.children.length,
          labels: Array.from(container.querySelectorAll("Label")).map(l => l.textContent),
        };
      }, dimContainerSelector);

      console.log(`\n=== DIMENSION CONTAINER (Papan) ===`);
      console.log(`Container class: ${dimInfoPapan.containerClass}`);
      console.log(`Child count: ${dimInfoPapan.childCount}`);
      console.log(`Labels: ${dimInfoPapan.labels.join(", ")}`);
      console.log(`\n✅ Same structure: 1 ROW × ${dimInfoPapan.childCount} COLUMNS`);
    }

    // =====================================================================
    // STEP 6: Check HTML source for the container div
    // =====================================================================
    console.log("\n=== INSPECT ELEMENT: Container Div ===");
    const fullInspect = await page.evaluate((selector) => {
      const container = document.querySelector(selector);
      if (!container) return { error: "Container not found" };

      // Get computed styles
      const styles = window.getComputedStyle(container);
      
      return {
        outerHTML: container.outerHTML,
        className: container.className,
        parentClasses: container.parentElement?.className || "N/A",
        computedStyles: {
          display: styles.display,
          gridTemplateColumns: styles.gridTemplateColumns,
          gap: styles.gap,
        },
        grandparentClasses: container.parentElement?.parentElement?.className || "N/A",
        siblings: Array.from(container.parentElement?.children || []).map((sib, i) => ({
          index: i,
          tag: sib.tagName,
          classList: Array.from(sib.classList).join(" "),
          isHidden: sib.classList.contains("hidden") || (window.getComputedStyle(sib).display === "none"),
        })),
      };
    }, dimContainerSelector);

    console.log(JSON.stringify(fullInspect, null, 2));

    // =====================================================================
    // SUMMARY
    // =====================================================================
    console.log("\n==========================================");
    console.log("📋 FINAL SUMMARY");
    console.log("==========================================");
    console.log("For BOTH 'Balok' and 'Papan':");
    console.log(`- The 3 dimension inputs (Panjang, Lebar, Tebal) are inside:`);
    console.log(`  <div class="${fullInspect.className}">`);
    console.log(`- Container uses CSS Grid with ${fullInspect.computedStyles.gridTemplateColumns}`);
    console.log(`- ${fullInspect.childCount} child elements (one for each dimension input)`);
    console.log(`- Displayed as: 1 ROW × ${fullInspect.childCount} COLUMNS`);
    console.log(`- Computed display: ${fullInspect.computedStyles.display}`);
    console.log("==========================================");

  } catch (error) {
    console.error("ERROR:", error.message);
    // Take error screenshot
    await page.screenshot({ path: path.join(screenshotDir, "error.png"), fullPage: true });
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
