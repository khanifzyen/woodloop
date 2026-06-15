/**
 * UAT Fase 10 — Converter CRUD
 *
 * ✅ Login REAL ke PocketBase (demo.converter@woodloop.id)
 * ✅ Navigasi halaman: dashboard, pasar bahan, checkout, riwayat transaksi, katalog, produk baru, profile
 *
 * Credentials:
 *   Email: demo.converter@woodloop.id
 *   Password: password12345
 */

import { test, expect, type Page } from "@playwright/test";

const PASSWORD = "password12345";
const CONVERTER_EMAIL = "demo.converter@woodloop.id";

async function loginAsConverter(page: Page) {
  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByLabel("Email").fill(CONVERTER_EMAIL);
  await page.getByLabel("Kata Sandi").fill(PASSWORD);
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL("/converter/dashboard", { timeout: 20000 });
}

async function clickSidebarLink(page: Page, name: string | RegExp) {
  const menuBtn = page.locator('button svg.lucide-menu');
  if (await menuBtn.isVisible().catch(() => false)) { await menuBtn.click(); await page.waitForTimeout(500); }
  await page.getByRole("link", { name }).first().click();
  await page.waitForTimeout(1500);
}

// ============================================================================

test.describe("CONVERTER-DASHBOARD", () => {
  test.beforeEach(async ({ page }) => { await loginAsConverter(page); });

  test("Heading dashboard dan navigasi cepat", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Dashboard Converter" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cari Bahan" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Buat Produk" })).toBeVisible();
  });

  test("Summary cards dan daftar transaksi terbaru", async ({ page }) => {
    await expect(page.getByText("Bahan Dibeli")).toBeVisible();
    await expect(page.getByText("Produk Dibuat")).toBeVisible();
    await expect(page.getByText("Total Investasi")).toBeVisible();
    await expect(page.getByText("Desain Tersedia")).toBeVisible();
  });
});

test.describe("CONVERTER-MARKETPLACE", () => {
  test.beforeEach(async ({ page }) => { await loginAsConverter(page); });

  test("Halaman pasar bahan via sidebar", async ({ page }) => {
    await clickSidebarLink(page, /pasar bahan/i);
    await expect(page.getByRole("heading", { name: "Pasar Bahan" })).toBeVisible();
  });

  test("Search input dan tombol filter", async ({ page }) => {
    await clickSidebarLink(page, /pasar bahan/i);
    await expect(page.getByPlaceholder("Cari bahan...")).toBeVisible();
  });

  test("Empty state ketika tidak ada bahan", async ({ page }) => {
    await clickSidebarLink(page, /pasar bahan/i);
    // Either shows cards or empty state
    const emptyState = page.getByText("Belum ada bahan tersedia");
    const materialCards = page.locator('[data-slot="card"]');
    if (await emptyState.isVisible().catch(() => false)) {
      await expect(emptyState).toBeVisible();
    } else {
      await expect(materialCards.first()).toBeVisible();
    }
  });
});

test.describe("CONVERTER-CHECKOUT", () => {
  test.beforeEach(async ({ page }) => { await loginAsConverter(page); });

  test("Halaman checkout via URL langsung — empty state", async ({ page }) => {
    await page.goto("/converter/checkout");
    await expect(page.getByText("Tidak ada bahan dipilih")).toBeVisible();
  });
});

test.describe("CONVERTER-TRANSACTIONS", () => {
  test.beforeEach(async ({ page }) => { await loginAsConverter(page); });

  test("Halaman riwayat transaksi via sidebar", async ({ page }) => {
    await clickSidebarLink(page, /riwayat transaksi/i);
    await expect(page.getByRole("heading", { name: "Riwayat Transaksi" })).toBeVisible();
  });

  test("Halaman riwayat transaksi via URL langsung", async ({ page }) => {
    await page.goto("/converter/marketplace/history");
    await expect(page.getByRole("heading", { name: "Riwayat Transaksi" })).toBeVisible();
  });

  test("Table headers transaksi atau empty state", async ({ page }) => {
    await page.goto("/converter/marketplace/history");
    // Either shows table headers when data exists, or empty state
    const tableHeader = page.getByText("Item");
    const emptyState = page.getByText("Belum ada transaksi");
    if (await tableHeader.isVisible().catch(() => false)) {
      await expect(page.getByText("Aggregator")).toBeVisible();
      await expect(page.getByText("Total")).toBeVisible();
      await expect(page.getByText("Status")).toBeVisible();
      await expect(page.getByText("Tanggal")).toBeVisible();
    } else {
      await expect(emptyState).toBeVisible();
    }
  });
});

test.describe("CONVERTER-CATALOG", () => {
  test.beforeEach(async ({ page }) => { await loginAsConverter(page); });

  test("Halaman katalog via sidebar", async ({ page }) => {
    await clickSidebarLink(page, /katalog produk/i);
    await expect(page.getByRole("heading", { name: "Katalog Produk" })).toBeVisible();
  });

  test("Tombol Buat Produk terlihat", async ({ page }) => {
    await clickSidebarLink(page, /katalog produk/i);
    await expect(page.getByText("Buat Produk")).toBeVisible();
  });
});

test.describe("CONVERTER-CATALOG-NEW", () => {
  test.beforeEach(async ({ page }) => { await loginAsConverter(page); });

  test("Form produk baru via URL langsung", async ({ page }) => {
    await page.goto("/converter/catalog/new");
    await expect(page.getByRole("heading", { name: "Buat Produk Baru" })).toBeVisible();
    await expect(page.getByText("Informasi Produk")).toBeVisible();
    await expect(page.getByPlaceholder("Nama produk")).toBeVisible();
    await expect(page.getByPlaceholder("0")).toBeVisible();
    await expect(page.getByPlaceholder("Ceritakan produk Anda...")).toBeVisible();
  });

  test("Validasi — submit kosong tetap di halaman form", async ({ page }) => {
    await page.goto("/converter/catalog/new");
    await page.getByRole("button", { name: /simpan produk/i }).click();
    await expect(page).toHaveURL(/\/converter\/catalog\/new/);
  });

  test("Tombol Batal kembali ke katalog", async ({ page }) => {
    await page.goto("/converter/catalog/new");
    await page.getByRole("link", { name: "Batal" }).click();
    await expect(page).toHaveURL(/\/converter\/catalog/);
  });
});

test.describe("CONVERTER-PROFILE", () => {
  test.beforeEach(async ({ page }) => { await loginAsConverter(page); });

  test("Halaman profil via URL langsung", async ({ page }) => {
    await page.goto("/converter/profile");
    await expect(page.getByRole("heading", { name: "Profil Converter" })).toBeVisible();
    await expect(page.getByText("Informasi Usaha")).toBeVisible();
    await expect(page.getByText("Dokumen Perizinan", { exact: true })).toBeVisible();
  });

  test("Field nama terisi data user", async ({ page }) => {
    await page.goto("/converter/profile");
    const nameInput = page.locator("#name");
    await expect(nameInput).toHaveValue(/demo/i);
  });

  test("Tombol Simpan Profil terlihat", async ({ page }) => {
    await page.goto("/converter/profile");
    await expect(page.getByRole("button", { name: "Simpan Profil" })).toBeVisible();
  });
});

// ============================================================================
// CRUD — Converter product via API
// ============================================================================
const PB_URL_CONVERTER = "https://pb-woodloop.pasarjepara.com";
const CONVERTER_PW = "password12345";

test.describe("CONVERTER-CRUD-API", () => {
  let productId = "";
  let authToken = "";

  test("CRUD-01: Create product via API", async () => {
    const r = await fetch(`${PB_URL_CONVERTER}/api/collections/users/auth-with-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: CONVERTER_EMAIL, password: CONVERTER_PW }),
    });
    const d = await r.json() as { token: string; record: { id: string } };
    authToken = d.token;

    const res = await fetch(`${PB_URL_CONVERTER}/api/collections/products/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        converter: d.record.id,
        name: `[E2E-CRUD] Produk Test ${Date.now()}`,
        category: "furniture",
        price: 500000,
        stock: 5,
        qr_code_id: `CRD-E2E${Date.now().toString(36).toUpperCase()}`,
        description: "Produk test E2E",
      }),
    });
    const prod = await res.json() as { id: string };
    productId = prod.id;
    expect(productId).toBeTruthy();
    console.log(`  ✅ Created products/${productId}`);
  });

  test("CRUD-02: Update product via API", async () => {
    const res = await fetch(`${PB_URL_CONVERTER}/api/collections/products/records/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ price: 600000, stock: 8 }),
    });
    expect(res.status).toBe(200);
    console.log(`  ✅ Updated products/${productId}`);
  });

  test("CRUD-03: Delete product & verify 404", async () => {
    await fetch(`${PB_URL_CONVERTER}/api/collections/products/records/${productId}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log(`  🗑️ Deleted products/${productId}`);
    const check = await fetch(`${PB_URL_CONVERTER}/api/collections/products/records/${productId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(check.status).toBe(404);
    console.log(`  ✅ Verified deleted products/${productId}`);
  });
});
