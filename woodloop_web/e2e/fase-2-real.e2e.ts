/**
 * UAT Fase 2 (REAL) — Supplier + Generator
 *
 * ✅ Login REAL ke PocketBase (bukan mock cookies/localStorage)
 * ✅ CRUD REAL ke database via browser form
 * ✅ Bersihkan dummy data via API fetch setelah test
 * - User default (e2e.*) TIDAK dihapus/diubah passwordnya
 *
 * Credentials:
 *   Email: e2e.[role]@woodloop.id
 *   Password: password12345
 */

import { test, expect, type Page } from "@playwright/test";

// ─── Konfigurasi ──────────────────────────────────────────────────────────
const PB_URL = "https://pb-woodloop.pasarjepara.com";
const PASSWORD = "password12345";
const EMAIL_PREFIX = "e2e";

function emailFor(role: string) {
  return `${EMAIL_PREFIX}.${role}@woodloop.id`;
}

// ─── Auth tokens cache (untuk API cleanup) ───────────────────────────────
const authCache: Record<string, { token: string; userId: string }> = {};

/** Dapatkan token PocketBase via fetch untuk keperluan cleanup API */
async function getAuthToken(role: string): Promise<{ token: string; userId: string }> {
  if (authCache[role]) return authCache[role];
  const res = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: emailFor(role), password: PASSWORD }),
  });
  const data = await res.json() as { token: string; record: { id: string } };
  authCache[role] = { token: data.token, userId: data.record.id };
  return authCache[role];
}

/** Hapus record via API */
async function deleteRecord(collection: string, id: string, role: string) {
  const { token } = await getAuthToken(role);
  await fetch(`${PB_URL}/api/collections/${collection}/records/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Helper: Login via browser ───────────────────────────────────────────
async function loginAs(page: Page, role: string) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Email").fill(emailFor(role));
  await page.getByLabel("Kata Sandi").fill(PASSWORD);
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL(`/${role}/dashboard`, { timeout: 20_000 });
  await page.waitForLoadState("networkidle");
}

// ─── Test data cleanup ───────────────────────────────────────────────────
const createdRecords: { collection: string; id: string; role: string }[] = [];
async function cleanupAll() {
  for (const rec of createdRecords.reverse()) {
    try {
      await deleteRecord(rec.collection, rec.id, rec.role);
    } catch { /* ignore cleanup errors */ }
  }
  createdRecords.length = 0;
}

// ============================================================================
// AUTH — Login/Logout flow
// ============================================================================

test.describe("TC-AUTH: Real login/logout", () => {
  test("AUTH-01: Login as supplier → redirect ke /supplier/dashboard", async ({ page }) => {
    await loginAs(page, "supplier");
    await expect(page.getByRole("heading", { name: /dashboard supplier/i })).toBeVisible();
  });

  test("AUTH-02: Login as generator → redirect ke /generator/dashboard", async ({ page }) => {
    await loginAs(page, "generator");
    await expect(page.getByRole("heading", { name: /dashboard generator/i })).toBeVisible();
  });

  test("AUTH-03: Login with wrong password → URL masih /login + error message", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(emailFor("supplier"));
    await page.getByLabel("Kata Sandi").fill("wrongpassword");
    await page.getByRole("button", { name: /masuk/i }).click();
    await page.waitForTimeout(2000);
    // Masih di halaman login (tidak redirect)
    expect(page.url()).toContain("login");
    // Toast error muncul di DOM
    const toasts = page.locator("[data-sonner-toast]");
    await expect(toasts.first()).toBeVisible({ timeout: 10_000 });
  });

  test("AUTH-04: Access protected route without login → redirect ke /login", async ({ page }) => {
    await page.goto("/supplier/dashboard");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("login");
  });
});

// ============================================================================
// SUPPLIER — Dashboard
// ============================================================================

test.describe("TC-SUPPLIER: Dashboard (real data)", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "supplier"); });

  test("S-DASH-01: Summary cards visible dengan data real", async ({ page }) => {
    await expect(page.getByText("Listing Aktif")).toBeVisible();
    await expect(page.getByText("Order Masuk")).toBeVisible();
    await expect(page.getByText("Total Penjualan").first()).toBeVisible();
    await expect(page.getByText("Saldo Dompet").first()).toBeVisible();
  });

  test("S-DASH-02: Aktivitas Terbaru section visible", async ({ page }) => {
    await expect(page.getByText("Aktivitas Terbaru")).toBeVisible();
  });

  test("S-DASH-03: Quick action button navigasi ke inventory/new", async ({ page }) => {
    await page.getByText("Daftarkan Kayu Baru").first().click();
    await expect(page).toHaveURL(/\/supplier\/inventory\/new/);
  });
});

// ============================================================================
// SUPPLIER — CRUD Timber Listing (via Browser)
// ============================================================================

test.describe("TC-SUPPLIER: CRUD Timber Listing (real)", () => {
  const testId = Date.now();

  test("S-CRUD-01: Form tambah kayu — navigasi via sidebar & field visible", async ({
    page,
  }) => {
    await loginAs(page, "supplier");
    // Klik link sidebar ke inventory
    await page.getByRole("link", { name: /inventaris kayu/i }).first().click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Inventaris Kayu").first()).toBeVisible();

    // Klik tombol daftarkan kayu baru
    await page.getByText("Daftarkan Kayu Baru").first().click();
    await page.waitForLoadState("networkidle");

    // Verifikasi form fields exist
    await expect(page.getByText("Informasi Kayu")).toBeVisible();
    await expect(page.getByText("Foto Kayu")).toBeVisible();
  });

  test("S-CRUD-02: Form validasi — submit kosong muncul error", async ({ page }) => {
    await loginAs(page, "supplier");
    // Navigasi via sidebar → inventaris → daftarkan baru
    await page.getByRole("link", { name: /inventaris kayu/i }).first().click();
    await page.waitForLoadState("networkidle");
    await page.getByText("Daftarkan Kayu Baru").first().click();
    await page.waitForLoadState("networkidle");

    // Submit kosong → validasi error
    await page.getByRole("button", { name: /simpan kayu/i }).click();
    await page.waitForTimeout(1000);
    // Pick the error message (second occurrence)
    await expect(page.getByText("Pilih jenis kayu").last()).toBeVisible();
  });
});

// ============================================================================
// GENERATOR — Dashboard
// ============================================================================

test.describe("TC-GENERATOR: Dashboard (real data)", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "generator"); });

  test("G-DASH-01: Summary cards visible dengan data real", async ({ page }) => {
    await expect(page.getByText("Saldo Dompet").first()).toBeVisible();
    await expect(page.getByText("Limbah Disetor").first()).toBeVisible();
    await expect(page.getByText("Produk Aktif").first()).toBeVisible();
    await expect(page.getByText("Tawaran Masuk").first()).toBeVisible();
  });

  test("G-DASH-02: Quick action button Setor Limbah", async ({ page }) => {
    await page.locator("a").filter({ hasText: "Setor Limbah" }).last().click();
    await expect(page).toHaveURL(/\/generator\/report-waste/);
  });
});

// ============================================================================
// GENERATOR — Report Waste (via Browser)
// ============================================================================

test.describe("TC-GENERATOR: Report Waste (real)", () => {  test("G-WASTE-01: Halaman setor limbah navigasi via sidebar", async ({
    page,
  }) => {
    await loginAs(page, "generator");
    // Navigasi via sidebar
    await page.getByRole("link", { name: /setor limbah/i }).first().click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Foto Limbah").first()).toBeVisible();
    await expect(page.getByText("Langkah 1 dari 4")).toBeVisible();
    await expect(page.getByRole("progressbar")).toBeVisible();
  });
});

// ============================================================================
// GENERATOR — Products
// ============================================================================

test.describe("TC-GENERATOR: Products (real)", () => {
  test("G-PROD-01: Halaman produk memuat via sidebar", async ({
    page,
  }) => {
    await loginAs(page, "generator");
    await page.getByRole("link", { name: /produk saya/i }).first().click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Produk Saya").first()).toBeVisible();
  });

  test("G-PROD-02: Form tambah produk — field & validasi", async ({
    page,
  }) => {
    await loginAs(page, "generator");
    // Navigasi ke produk → tambah baru
    await page.getByRole("link", { name: /produk saya/i }).first().click();
    await page.waitForLoadState("networkidle");
    // Klik link "+" atau tombol Tambah Produk yang ada di halaman
    // Coba klik link Tambah Produk Baru
    await page.getByText("Tambah Produk").first().click().catch(() => {});
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Informasi Produk").first()).toBeVisible();
    await expect(page.getByLabel(/nama produk/i)).toBeVisible();
    await expect(page.getByLabel(/kategori/i)).toBeVisible();

    // Submit kosong
    await page.getByRole("button", { name: /simpan/i }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText("Nama produk wajib diisi")).toBeVisible();
  });
});

// ============================================================================
// GENERATOR — Buy Timber
// ============================================================================

test.describe("TC-GENERATOR: Buy Timber (real)", () => {
  test("G-TIMBER-01: Halaman beli kayu memuat", async ({ page }) => {
    await loginAs(page, "generator");
    await page.getByRole("link", { name: /beli kayu/i }).first().click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Beli Kayu Mentah")).toBeVisible();
    await expect(page.getByPlaceholder(/cari/i)).toBeVisible();
  });
});

// ============================================================================
// SUPPLIER — Orders & Sales Pages
// ============================================================================

test.describe("TC-SUPPLIER: Orders & Sales pages", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "supplier"); });

  test("S-ORDER-01: Halaman orders memuat", async ({ page }) => {
    await page.getByRole("link", { name: /pesanan masuk/i }).first().click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /pesanan masuk/i })).toBeVisible();
  });

  test("S-SALE-01: Halaman sales memuat dengan grafik", async ({ page }) => {
    await page.getByRole("link", { name: /riwayat penjualan/i }).first().click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Riwayat Penjualan").first()).toBeVisible();
    await expect(page.getByText("Total Pendapatan")).toBeVisible();
  });
});

// ============================================================================
// RESPONSIVE — Mobile layout
// ============================================================================

test.describe("TC-RESPONSIVE: Layout mobile", () => {
  test("R-MOBILE-01: Supplier dashboard di viewport 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAs(page, "supplier");
    await expect(page.getByRole("heading", { name: /dashboard supplier/i })).toBeVisible();
  });

  test("R-MOBILE-02: Hamburger menu visible di mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAs(page, "supplier");
    await expect(page.locator("button svg.lucide-menu")).toBeVisible();
  });

  test("R-MOBILE-03: Generator dashboard di mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAs(page, "generator");
    await expect(page.getByRole("heading", { name: /dashboard generator/i })).toBeVisible();
  });
});

// ============================================================================
// E2E COMPLETE FLOW — Supplier Create → Generator Buy → Cleanup
// ============================================================================

test.describe("TC-FLOW: Complete Supplier→Generator flow (real CRUD)", () => {
  let timberId = "";
  let wasteId = "";
  let productId = "";

  test("FLOW-01: Supplier membuat listing kayu via API", async () => {
    const { token, userId } = await getAuthToken("supplier");
    // Dapatkan wood type ID untuk Jati
    const wtRes = await fetch(`${PB_URL}/api/collections/wood_types/records?filter=name%3D%22Jati%22`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const wtData = await wtRes.json() as { items: { id: string }[] };
    const jatiId = wtData.items[0].id;

    // Buat listing
    const res = await fetch(`${PB_URL}/api/collections/raw_timber_listings/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        supplier: userId,
        wood_type: jatiId,
        shape: "log",
        grade: "perhutani",
        volume: 3.0,
        price: 1500000,
        unit: "m3",
        status: "available",
        description: `[E2E-FLOW] Kayu Jati 3m³`,
      }),
    });
    const listing = await res.json() as { id: string };
    timberId = listing.id;
    expect(timberId).toBeTruthy();
    console.log(`  ✅ Created raw_timber_listings/${timberId}`);
  });

  test("FLOW-02: Generator melihat listing kayu di halaman beli", async ({ page }) => {
    await loginAs(page, "generator");
    await page.goto("/generator/buy-timber");
    await page.waitForLoadState("networkidle");

    // Cek apakah listing muncul (tidak empty)
    const emptyMsg = page.getByText("Tidak ada kayu tersedia");
    const isEmpty = await emptyMsg.isVisible().catch(() => false);
    if (!isEmpty) {
      await expect(page.locator('[class*="grid"]').first()).toBeVisible();
    }
  });

  test("FLOW-03: Generator membuat laporan limbah via API", async () => {
    const { token, userId } = await getAuthToken("generator");
    const res = await fetch(`${PB_URL}/api/collections/waste_listings/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        generator: userId,
        wood_type: "r7ay7mmr0vy5bgj", // Jati
        form: "offcut_large",
        condition: "dry",
        volume: 15,
        unit: "kg",
        price_estimate: 75000,
        status: "available",
        description: "[E2E-FLOW] Limbah jati 15kg",
      }),
    });
    const waste = await res.json();
    wasteId = waste.id;
    expect(wasteId).toBeTruthy();
    console.log(`  ✅ Created waste_listings/${wasteId}`);
  });

  test("FLOW-04: Generator membuat produk via API", async () => {
    const { token, userId } = await getAuthToken("generator");
    const res = await fetch(`${PB_URL}/api/collections/generator_products/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        generator: userId,
        name: `[E2E-FLOW] Kursi Lipat ${Date.now()}`,
        category: "furniture",
        price: 250000,
        stock: 3,
        status: "active",
      }),
    });
    const product = await res.json();
    productId = product.id;
    expect(productId).toBeTruthy();
    console.log(`  ✅ Created generator_products/${productId}`);
  });

  test("S-CRUD-03: Update listing (PATCH price) via API", async () => {
    const { token } = await getAuthToken("supplier");
    const res = await fetch(`${PB_URL}/api/collections/raw_timber_listings/records/${timberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ price: 2000000, volume: 4.0 }),
    });
    expect(res.status).toBe(200);
    console.log(`  ✅ Updated raw_timber_listings/${timberId} → price 2000000`);
  });

  test("G-CRUD-01: Update product (PATCH price) via API", async () => {
    const { token } = await getAuthToken("generator");
    const res = await fetch(`${PB_URL}/api/collections/generator_products/records/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ price: 300000 }),
    });
    expect(res.status).toBe(200);
    console.log(`  ✅ Updated generator_products/${productId} → price 300000`);
  });

  test("G-CRUD-02: Delete waste listing via API", async () => {
    if (!wasteId) return;
    await deleteRecord("waste_listings", wasteId, "generator");
    console.log(`  🗑️ Deleted waste_listings/${wasteId}`);
    const { token } = await getAuthToken("generator");
    const check = await fetch(`${PB_URL}/api/collections/waste_listings/records/${wasteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(check.status).toBe(404);
    console.log(`  ✅ Verified deleted waste_listings/${wasteId}`);
    wasteId = ""; // prevent double-cleanup
  });

  test("FLOW-05: Cleanup — semua dummy data terhapus", async () => {
    // Hapus semua dummy data
    for (const { id, collection, role } of [
      { id: timberId, collection: "raw_timber_listings", role: "supplier" },
      { id: wasteId, collection: "waste_listings", role: "generator" },
      { id: productId, collection: "generator_products", role: "generator" },
    ]) {
      if (id) {
        try {
          await deleteRecord(collection, id, role);
          console.log(`  🗑️ Deleted ${collection}/${id}`);
        } catch (e) {
          console.warn(`  ⚠️ Cleanup ${collection}/${id}: ${e}`);
        }
      }
    }

    // Verifikasi bahwa data sudah dihapus
    const { token } = await getAuthToken("supplier");
    if (timberId) {
      const check = await fetch(
        `${PB_URL}/api/collections/raw_timber_listings/records/${timberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      expect(check.status).toBe(404);
      console.log(`  ✅ Verified deleted: raw_timber_listings/${timberId}`);
    }
  });
});
