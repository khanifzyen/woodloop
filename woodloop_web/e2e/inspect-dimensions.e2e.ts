import { test, expect } from "@playwright/test";

/**
 * Inspect the supplier inventory/new page:
 * - Login as supplier
 * - Change "Bentuk Kayu" to "Balok"
 * - Screenshot the dimensions section
 * - Count rows/columns for the 3 dimension inputs
 * - Change to "Papan" and check the same
 * - Inspect CSS classes on the container div
 */

test.describe("Supplier Inventory New - Dimensions Inspection", () => {
  test.use({ 
    storageState: undefined,
    screenshot: "on",
  });

  test("Login and inspect dimension inputs for Balok and Papan shapes", async ({ page }) => {
    // Step 1: Go to login page
    await page.goto("http://localhost:3001/login");
    await page.waitForLoadState("networkidle");

    // Step 2: Login with supplier credentials
    await page.fill('input[type="email"]', "demo.supplier@woodloop.id");
    await page.fill('input[type="password"]', "password12345");
    await page.click('button[type="submit"]');
    
    // Wait for redirect after login
    await page.waitForURL(/supplier/i, { timeout: 30000 });
    
    // Step 3: Navigate to inventory/new
    await page.goto("http://localhost:3001/supplier/inventory/new");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Wait for the form to be visible
    await page.waitForSelector("text=Daftarkan Kayu Baru", { timeout: 15000 });

    // ============================================================
    // PART 1: Change to "Balok"
    // ============================================================
    
    // Click the "Bentuk Kayu" select trigger
    await page.click("#shape");
    await page.waitForTimeout(500);
    
    // Select "Balok" from the dropdown
    await page.click('text=Balok');
    await page.waitForTimeout(1000);

    // Now take a screenshot of the dimensions section
    // The dimensions section for balok/papan is:
    // <div class="grid grid-cols-3 gap-4">  (3 columns)
    //   <div> Panjang (cm) </div>
    //   <div> Lebar (cm) </div>
    //   <div> Tebal (cm) </div>
    // </div>
    
    const dimSectionBalok = page.locator('div.grid.grid-cols-3.gap-4').first();
    await dimSectionBalok.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    
    // Take screenshot of the dimensions section
    await page.screenshot({ 
      path: "e2e-report/screenshots/dimensions-balok.png", 
      fullPage: false,
      clip: await dimSectionBalok.boundingBox().then(box => box ? 
        { x: box.x - 10, y: box.y - 30, width: box.width + 20, height: box.height + 60 } 
        : undefined)
    });

    // Verify the dimension labels for Balok
    const balokLabels = await page.locator('div.grid.grid-cols-3.gap-4 .space-y-2 Label').allTextContents();
    console.log("Balok dimension labels:", balokLabels);

    // ============================================================
    // PART 2: Change to "Papan"
    // ============================================================
    
    // Click the "Bentuk Kayu" select trigger again
    await page.click("#shape");
    await page.waitForTimeout(500);
    
    // Select "Papan" from the dropdown
    await page.click('text=Papan');
    await page.waitForTimeout(1000);

    const dimSectionPapan = page.locator('div.grid.grid-cols-3.gap-4').first();
    await dimSectionPapan.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    
    // Take screenshot
    await page.screenshot({ 
      path: "e2e-report/screenshots/dimensions-papan.png", 
      fullPage: false,
      clip: await dimSectionPapan.boundingBox().then(box => box ? 
        { x: box.x - 10, y: box.y - 30, width: box.width + 20, height: box.height + 60 } 
        : undefined)
    });

    // ============================================================
    // PART 3: Inspect HTML structure
    // ============================================================
    
    // Inspect the container div's CSS classes and structure
    const containerHtml = await page.evaluate(() => {
      const dimContainer = document.querySelector('div.grid.grid-cols-3.gap-4');
      if (!dimContainer) return "Container not found";
      
      const labels = dimContainer.querySelectorAll('.space-y-2 Label');
      const inputs = dimContainer.querySelectorAll('.space-y-2 Input');
      
      return {
        containerTagName: dimContainer.tagName,
        containerClassName: dimContainer.className,
        containerHTML: dimContainer.outerHTML,
        childCount: dimContainer.children.length,
        labels: Array.from(labels).map(l => ({
          text: l.textContent,
          htmlFor: l.getAttribute('for'),
        })),
        inputs: Array.from(inputs).map(i => ({
          id: i.id,
          placeholder: i.getAttribute('placeholder'),
          type: i.getAttribute('type'),
        })),
      };
    });

    console.log("\n=== DIMENSION CONTAINER INSPECTION ===");
    console.log("Container tag:", containerHtml?.containerTagName);
    console.log("Container class:", containerHtml?.containerClassName);
    console.log("Child count:", containerHtml?.childCount);
    console.log("Labels:", JSON.stringify(containerHtml?.labels, null, 2));
    console.log("Inputs:", JSON.stringify(containerHtml?.inputs, null, 2));
    console.log("Full HTML:");
    console.log(containerHtml?.containerHTML);

    // Report results
    console.log("\n==========================================");
    console.log("RESULTS SUMMARY:");
    console.log("==========================================");
    console.log("For both 'Balok' and 'Papan':");
    console.log(`- The 3 dimension inputs are in a container with class: "${containerHtml?.containerClassName}"`);
    console.log(`- They have ${containerHtml?.childCount} child divs (one per input)`);
    console.log(`- So they are displayed in 1 row with ${containerHtml?.childCount} columns`);
    console.log("==========================================");

    // Assertions
    expect(containerHtml?.containerClassName).toContain("grid-cols-3");
    expect(containerHtml?.childCount).toBe(3);
    expect(containerHtml?.labels?.length).toBe(3);

    // Take a full page screenshot too
    await page.screenshot({ 
      path: "e2e-report/screenshots/full-page.png", 
      fullPage: true 
    });
  });
});
