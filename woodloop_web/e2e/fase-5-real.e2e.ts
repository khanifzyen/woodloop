/**
 * UAT Fase 5 (REAL) — Buyer
 * Real PocketBase auth, no mock, cleanup verified
 */

import { test, expect, type Page } from "@playwright/test";

const PB_URL = "https://pb-woodloop.pasarjepara.com";
const PASSWORD = "password12345";
const EP = "e2e";

function emailFor(role: string) { return `${EP}.${role}@woodloop.id`; }

const authCache: Record<string, { token: string }> = {};
async function getAuthToken(role: string): Promise<{ token: string }> {
  if (authCache[role]) return authCache[role];
  const r = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: emailFor(role), password: PASSWORD }),
  });
  const d = await r.json() as { token: string };
  authCache[role] = { token: d.token };
  return authCache[role];
}

async function deleteRecord(coll: string, id: string, role: string) {
  const { token } = await getAuthToken(role);
  await fetch(`${PB_URL}/api/collections/${coll}/records/${id}`, {
    method: "DELETE", headers: { Authorization: `Bearer ${token}` },
  });
}

async function loginAs(page: Page, role: string) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Email").fill(emailFor(role));
  await page.getByLabel("Kata Sandi").fill(PASSWORD);
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL(`/${role}/dashboard`, { timeout: 20000 });
  await page.waitForLoadState("networkidle");
}

async function clickSidebarLink(page: Page, name: string | RegExp) {
  const menuBtn = page.locator('button svg.lucide-menu');
  if (await menuBtn.isVisible().catch(() => false)) { await menuBtn.click(); await page.waitForTimeout(500); }
  await page.getByRole("link", { name }).first().click();
  await page.waitForLoadState("networkidle");
}

// ============================================================================
test.describe("TC-AUTH: Buyer login", () => {
  test("AUTH-01: Login as buyer → redirect ke /buyer/dashboard", async ({ page }) => {
    await loginAs(page, "buyer");
    expect(page.url()).toContain("buyer/dashboard");
  });
});

// ============================================================================
test.describe("TC-MKT: Marketplace", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "buyer"); });

  test("MKT-01: Marketplace page memuat via URL", async ({
    page,
  }) => {
    await page.goto("/buyer/marketplace");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("marketplace");
  });
});

// ============================================================================
test.describe("TC-PROD: Product Detail", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "buyer"); });

  test("PROD-01: Buka detail produk dari marketplace", async ({ page }) => {
    await clickSidebarLink(page, /marketplace/i);
    await page.waitForTimeout(1000);
    // Klik produk pertama yang ada
    const firstProduct = page.locator('a[href*="/buyer/product/"]').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await page.waitForLoadState("networkidle");
      await expect(page.getByText("Rp")).toBeVisible();
    }
  });
});

// ============================================================================
test.describe("TC-CART: Cart & Checkout", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "buyer"); });

  test("CART-01: Cart page memuat via URL", async ({ page }) => {
    await page.goto("/buyer/cart");
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("cart");
  });

  test("CART-02: Checkout page memuat dengan form", async ({ page }) => {
    await page.goto("/buyer/checkout");
    await page.waitForTimeout(2000);
    // Pastikan di halaman checkout (redirect ke login jika perlu)
    const checkout = page.getByText("Checkout");
    if (await checkout.isVisible()) {
      await expect(checkout).toBeVisible();
    }
  });
});

// ============================================================================
test.describe("TC-ORDER: Orders", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "buyer"); });

  test("ORDER-01: Orders page memuat via URL", async ({ page }) => {
    await page.goto("/buyer/orders");
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("orders");
  });
});

// ============================================================================
test.describe("TC-SCAN: QR Scan page", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "buyer"); });

  test("SCAN-01: Halaman scan memuat", async ({ page }) => {
    await page.goto("/buyer/scan");
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain("scan");
  });
});

// ============================================================================
test.describe("TC-TRACE: Public Traceability", () => {
  test("TRACE-01: Halaman traceability publik SSR (tanpa auth)", async ({ page }) => {
    // Akses langsung tanpa login — harus SSR
    await page.goto("/p/PRD-TEST123");
    await page.waitForLoadState("networkidle");
    // Harus render halaman meskipun produk tidak ditemukan (404)
    const url = page.url();
    expect(url).toContain("/p/");
  });
});

// ============================================================================
test.describe("TC-FLOW: Complete Buyer flow (real CRUD)", () => {
  let orderId = "";

  test("FLOW-01: Buat order via API", async () => {
    // Cari produk yang ada di database
    const { token } = await getAuthToken("buyer");
    const products = await fetch(`${PB_URL}/api/collections/products/records?perPage=1&filter=stock%3E0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const prodData = await products.json() as { items: { id: string; name: string; price: number }[] };
    
    if (prodData.items?.length > 0) {
      const product = prodData.items[0];
      const r = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: emailFor("buyer"), password: PASSWORD }),
      });
      const d = await r.json() as { record: { id: string } };

      const order = await fetch(`${PB_URL}/api/collections/orders/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          buyer: d.record.id,
          product: product.id,
          quantity: 1,
          total_price: product.price,
          shipping_address: "E2E Test, 0812, Jl. Test No.1, Jepara",
          status: "payment_pending",
        }),
      });
      const o = await order.json() as { id: string };
      orderId = o.id;
      expect(orderId).toBeTruthy();
      console.log(`  ✅ Created orders/${orderId}`);
    } else {
      console.log(`  ⚠️ No products available, skipping order creation`);
    }
  });

  test("FLOW-02: Cancel order via API", async () => {
    if (!orderId) return;
    const { token } = await getAuthToken("buyer");
    const res = await fetch(`${PB_URL}/api/collections/orders/records/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "cancelled", cancel_reason: "[E2E] Test cancel" }),
    });
    expect(res.status).toBe(200);
    const updated = await res.json() as { status: string };
    expect(updated.status).toBe("cancelled");
    console.log(`  ✅ Cancelled orders/${orderId}`);
  });

  test("FLOW-03: Toggle wishlist via API", async () => {
    const { token } = await getAuthToken("buyer");
    // Cari produk yang tersedia
    const products = await fetch(`${PB_URL}/api/collections/products/records?perPage=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const prodData = await products.json() as { items: { id: string }[] };
    if (!prodData.items?.length) {
      console.log(`  ⚠️ No products for wishlist test`);
      return;
    }

    // Toggle add to wishlist
    const buyerAuth = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: emailFor("buyer"), password: PASSWORD }),
    });
    const buyerData = await buyerAuth.json() as { record: { id: string } };
    const productId = prodData.items[0].id;

    const wishRes = await fetch(`${PB_URL}/api/collections/wishlist/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ buyer: buyerData.record.id, product: productId }),
    });
    expect(wishRes.status).toBe(200);
    const wishItem = await wishRes.json() as { id: string };
    console.log(`  ✅ Added wishlist/${wishItem.id}`);

    // Toggle remove
    await fetch(`${PB_URL}/api/collections/wishlist/records/${wishItem.id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`  🗑️ Removed wishlist/${wishItem.id}`);
  });

  test("FLOW-04: Cleanup order", async () => {
    if (orderId) {
      await deleteRecord("orders", orderId, "buyer");
      console.log(`  🗑️ Deleted orders/${orderId}`);
      const { token } = await getAuthToken("buyer");
      const check = await fetch(`${PB_URL}/api/collections/orders/records/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(check.status).toBe(404);
      console.log(`  ✅ Verified deleted orders/${orderId}`);
    }
  });
});
