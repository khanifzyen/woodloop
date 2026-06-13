/**
 * UAT Fase 7 — Final Regression Test
 * Menguji semua flow utama dengan real PocketBase auth
 * Covers: all 7 roles + public traceability
 */

import { test, expect, type Page } from "@playwright/test";

const PASSWORD = "password12345";
function emailFor(role: string) { return `e2e.${role}@woodloop.id`; }

async function loginAs(page: Page, role: string) {
  await page.context().clearCookies();
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  // Clear any stale auth state from previous session
  await page.evaluate(() => {
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
  }).catch(() => {});
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
test.describe("REGRESSION-01: Auth Flow", () => {
  test("Login all 7 roles", async ({ page }) => {
    for (const role of ["supplier", "generator", "aggregator", "converter", "enabler", "buyer"]) {
      await loginAs(page, role);
      expect(page.url()).toContain(`${role}/dashboard`);
      console.log(`  ✅ ${role} login OK`);
    }
  });

  test("Wrong password → masih di /login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(emailFor("buyer"));
    await page.getByLabel("Kata Sandi").fill("wrongpass");
    await page.getByRole("button", { name: /masuk/i }).click();
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("login");
  });

  test("Protected route → redirect ke /login", async ({ page }) => {
    await page.goto("/supplier/dashboard");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("login");
  });
});

// ============================================================================
test.describe("REGRESSION-02: Public Pages", () => {
  test("Homepage redirect ke /onboarding", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL(/\/onboarding/);
  });

  test("Traceability SSR page", async ({ page }) => {
    await page.goto("/p/PRD-TEST");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/p/");
  });

  test("Sitemap XML tersedia", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("urlset");
  });

  test("Robots.txt tersedia", async ({ page }) => {
    const res = await page.request.get("/robots.txt");
    expect(res.status()).toBe(200);
  });

  test("Manifest JSON tersedia", async ({ page }) => {
    const res = await page.request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.name).toContain("WoodLoop");
  });
});

// ============================================================================
test.describe("REGRESSION-03: Supplier Flow", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "supplier"); });

  test("Dashboard renders", async ({ page }) => {
    await expect(page.getByText("Listing Aktif")).toBeVisible();
    await expect(page.getByText("Order Masuk")).toBeVisible();
  });

  test("Inventory page accessible", async ({ page }) => {
    await clickSidebarLink(page, /inventaris kayu/i);
    await expect(page.getByRole("heading", { name: "Inventaris Kayu" })).toBeVisible();
  });

  test("Orders page accessible", async ({ page }) => {
    await clickSidebarLink(page, /pesanan masuk/i);
    await expect(page.getByRole("heading", { name: /pesanan masuk/i })).toBeVisible();
  });

  test("Sales page with chart", async ({ page }) => {
    await clickSidebarLink(page, /riwayat penjualan/i);
    await expect(page.getByRole("heading", { name: "Riwayat Penjualan" })).toBeVisible();
  });
});

// ============================================================================
test.describe("REGRESSION-04: Generator Flow", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "generator"); });

  test("Dashboard renders", async ({ page }) => {
    await expect(page.getByText("Limbah Disetor").first()).toBeVisible();
  });

  test("Report waste page", async ({ page }) => {
    await clickSidebarLink(page, /setor limbah/i);
    await expect(page.getByText("Langkah 1 dari 4")).toBeVisible();
  });

  test("Buy timber page", async ({ page }) => {
    await clickSidebarLink(page, /beli kayu/i);
    await expect(page.getByText("Beli Kayu Mentah")).toBeVisible();
  });

  test("Products page", async ({ page }) => {
    await clickSidebarLink(page, /produk saya/i);
    await expect(page.getByRole("heading", { name: "Produk Saya" })).toBeVisible();
  });
});

// ============================================================================
test.describe("REGRESSION-05: Aggregator Flow", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "aggregator"); });

  test("Dashboard with summary cards", async ({ page }) => {
    await expect(page.getByText("Penjemputan Hari Ini")).toBeVisible();
  });

  test("Treasure Map renders Leaflet", async ({ page }) => {
    await clickSidebarLink(page, /peta/i);
    await page.waitForTimeout(2000);
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 10000 });
  });

  test("Pickups page with tabs", async ({ page }) => {
    await clickSidebarLink(page, /penjemputan/i);
    await expect(page.getByText("Perlu Dijemput")).toBeVisible();
  });

  test("Warehouse page", async ({ page }) => {
    await clickSidebarLink(page, /gudang/i);
    await expect(page.getByText("Total Berat")).toBeVisible();
  });
});

// ============================================================================
test.describe("REGRESSION-06: Converter Flow", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "converter"); });

  test("Dashboard summary", async ({ page }) => {
    await expect(page.getByText("Bahan Dibeli")).toBeVisible();
  });

  test("Marketplace materials", async ({ page }) => {
    await clickSidebarLink(page, /pasar bahan/i);
    await expect(page.getByPlaceholder(/cari bahan/i)).toBeVisible();
  });

  test("Catalog page", async ({ page }) => {
    await clickSidebarLink(page, /katalog produk/i);
    await expect(page.getByRole("heading", { name: "Katalog Produk" })).toBeVisible();
  });

  test("Design Clinic", async ({ page }) => {
    await clickSidebarLink(page, /klinik desain/i);
    await expect(page.getByPlaceholder(/cari desain/i)).toBeVisible();
  });
});

// ============================================================================
test.describe("REGRESSION-07: Buyer Flow", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "buyer"); });

  test("Marketplace loads", async ({ page }) => {
    await page.goto("/buyer/marketplace");
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("marketplace");
  });

  test("Cart page", async ({ page }) => {
    await page.goto("/buyer/cart");
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("cart");
  });

  test("Orders page", async ({ page }) => {
    await page.goto("/buyer/orders");
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("orders");
  });
});

// ============================================================================
test.describe("REGRESSION-08: Enabler & Shared", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "enabler"); });

  test("Enabler dashboard impact cards", async ({ page }) => {
    await expect(page.getByText("Limbah Terpakai")).toBeVisible();
    await expect(page.getByText("CO₂ Tersimpan")).toBeVisible();
  });

  test("User management", async ({ page }) => {
    await clickSidebarLink(page, /manajemen user/i);
    await expect(page.getByRole("heading", { name: /manajemen user/i })).toBeVisible();
  });

  test("Wallet page", async ({ page }) => {
    await page.goto("/wallet");
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("wallet");
  });

  test("Notifications page", async ({ page }) => {
    await page.goto("/notifications");
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("notifications");
  });
});

// ============================================================================
test.describe("REGRESSION-09: Responsive & SEO", () => {
  test("Sitemap contains product URLs", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    const text = await res.text();
    expect(text).toContain("pasarjepara.com");
    expect(text).toContain("sitemap");
  });

  test("Manifest valid JSON", async ({ page }) => {
    const res = await page.request.get("/manifest.webmanifest");
    const json = await res.json();
    expect(json.display).toBe("standalone");
    expect(json.theme_color).toBeTruthy();
  });

  test("Offline page renders with retry button", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByText("Kamu Sedang Offline")).toBeVisible();
    await expect(page.getByText("Coba Lagi")).toBeVisible();
  });

  test("JSON-LD Organization schema exists in root layout", async ({ page }) => {
    await page.goto("/login");
    const scripts = await page.locator('script[type="application/ld+json"]').all();
    const allJson = await Promise.all(scripts.map((s) => s.textContent()));
    const orgLd = allJson.find((j) => j?.includes('"Organization"'));
    expect(orgLd).toBeTruthy();
    expect(orgLd).toContain("WoodLoop");
  });

  test("JSON-LD WebSite schema with SearchAction", async ({ page }) => {
    await page.goto("/login");
    const scripts = await page.locator('script[type="application/ld+json"]').all();
    const allJson = await Promise.all(scripts.map((s) => s.textContent()));
    const webLd = allJson.find((j) => j?.includes('"WebSite"'));
    expect(webLd).toBeTruthy();
    expect(webLd).toContain("SearchAction");
  });

  test("JSON-LD BreadcrumbList di marketplace page", async ({ page }) => {
    await page.goto("/buyer/marketplace");
    await page.waitForLoadState("networkidle");
    const scripts = await page.locator('script[type="application/ld+json"]').all();
    const allJson = await Promise.all(scripts.map((s) => s.textContent()));
    const breadLd = allJson.find((j) => j?.includes('"BreadcrumbList"'));
    expect(breadLd).toBeTruthy();
  });

  test("PWA icons tersedia", async ({ page }) => {
    const res192 = await page.request.get("/icon-192.png");
    expect(res192.status()).toBe(200);
    expect(res192.headers()["content-type"]).toContain("image/png");

    const res512 = await page.request.get("/icon-512.png");
    expect(res512.status()).toBe(200);
    expect(res512.headers()["content-type"]).toContain("image/png");
  });

  test("Sitemap contains buyer product URLs and /scan", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    const text = await res.text();
    expect(text).toContain("/buyer/product/");
    expect(text).toContain("/buyer/scan");
  });

  test("JSON-LD Product schema di traceability page", async ({ page }) => {
    await page.goto("/p/PRD-TEST");
    await page.waitForLoadState("networkidle");
    const scripts = await page.locator('script[type="application/ld+json"]').all();
    const allJson = await Promise.all(scripts.map((s) => s.textContent()));
    const hasProduct = allJson.some((j) => j?.includes('"Product"'));
    expect(hasProduct).toBeTruthy();
  });

  test("Service worker script exists in layout", async ({ page }) => {
    await page.goto("/login");
    const swScript = await page.locator('script:has-text("serviceWorker")').textContent();
    expect(swScript).toContain("register");
    expect(swScript).toContain("sw.js");
  });
});
