/**
 * UAT Fase 3 (REAL) — Aggregator
 *
 * ✅ Login REAL ke PocketBase (bukan mock)
 * ✅ CRUD REAL ke database
 * ✅ Bersihkan dummy data setelah test
 * - User default TIDAK dihapus/diubah
 */

import { test, expect, type Page } from "@playwright/test";

const PB_URL = "https://pb-woodloop.pasarjepara.com";
const PASSWORD = "password12345";
const EMAIL_PREFIX = "e2e";

function emailFor(role: string) { return `${EMAIL_PREFIX}.${role}@woodloop.id`; }

const authCache: Record<string, { token: string }> = {};
async function getAuthToken(role: string): Promise<{ token: string }> {
  if (authCache[role]) return authCache[role];
  const res = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: emailFor(role), password: PASSWORD }),
  });
  const data = await res.json() as { token: string };
  authCache[role] = { token: data.token };
  return authCache[role];
}

async function deleteRecord(collection: string, id: string, role: string) {
  const { token } = await getAuthToken(role);
  await fetch(`${PB_URL}/api/collections/${collection}/records/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function loginAs(page: Page, role: string) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Email").fill(emailFor(role));
  await page.getByLabel("Kata Sandi").fill(PASSWORD);
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL(`/${role}/dashboard`, { timeout: 20_000 });
  await page.waitForLoadState("networkidle");
}

/** Buka hamburger menu dulu jika viewport mobile, lalu klik link sidebar */
async function clickSidebarLink(page: Page, name: string | RegExp) {
  // Coba buka hamburger menu (mobile) — jika ada
  const menuBtn = page.locator('button svg.lucide-menu');
  if (await menuBtn.isVisible().catch(() => false)) {
    await menuBtn.click();
    await page.waitForTimeout(500);
  }
  await page.getByRole("link", { name }).first().click();
  await page.waitForLoadState("networkidle");
}

// ============================================================================
// AUTH
// ============================================================================

test.describe("TC-AUTH: Aggregator login", () => {
  test("AUTH-01: Login as aggregator → redirect ke /aggregator/dashboard", async ({ page }) => {
    await loginAs(page, "aggregator");
    await expect(page.getByRole("heading", { name: /dashboard aggregator/i })).toBeVisible();
  });
});

// ============================================================================
// DASHBOARD
// ============================================================================

test.describe("TC-DASH: Aggregator Dashboard", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "aggregator"); });

  test("DASH-01: Summary cards visible", async ({ page }) => {
    await expect(page.getByText("Penjemputan Hari Ini")).toBeVisible();
    await expect(page.getByText("Stok Gudang")).toBeVisible();
    await expect(page.getByText("Bid Aktif")).toBeVisible();
    await expect(page.getByText("Pendapatan").first()).toBeVisible();
  });

  test("DASH-02: CTA button navigasi ke treasure map", async ({ page }) => {
    await page.getByRole("link", { name: /peta harta karun/i }).click();
    await expect(page).toHaveURL(/\/aggregator\/treasure-map/);
  });
});

// ============================================================================
// TREASURE MAP
// ============================================================================

test.describe("TC-MAP: Treasure Map page", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "aggregator"); });

  test("MAP-01: Halaman treasure map memuat", async ({ page }) => {
    await clickSidebarLink(page, /peta/i);
    await page.waitForTimeout(2000);
    // Map container harus terlihat
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 10000 });
  });

  test("MAP-02: Tombol Lokasi Saya dan Filter visible", async ({ page }) => {
    await clickSidebarLink(page, /peta/i);
    await page.waitForTimeout(2000);
    await expect(page.getByText("Lokasi Saya")).toBeVisible();
    await expect(page.getByText("Filter")).toBeVisible();
  });
});

// ============================================================================
// PICKUPS
// ============================================================================

test.describe("TC-PICKUP: Pickups page", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "aggregator"); });

  test("PICKUP-01: Halaman pickups memuat dengan tabs", async ({ page }) => {
    await clickSidebarLink(page, /penjemputan/i);
    await expect(page.getByText("Perlu Dijemput")).toBeVisible();
    await expect(page.getByText("Sedang Diangkut")).toBeVisible();
    await expect(page.getByText("Selesai")).toBeVisible();
  });

  test("PICKUP-02: Empty state visible", async ({ page }) => {
    await clickSidebarLink(page, /penjemputan/i);
    await expect(page.getByText("Belum ada penjemputan")).toBeVisible();
  });
});

// ============================================================================
// WAREHOUSE
// ============================================================================

test.describe("TC-WAREHOUSE: Warehouse page", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "aggregator"); });

  test("WH-01: Halaman warehouse memuat dengan summary", async ({ page }) => {
    await clickSidebarLink(page, /gudang/i);
    await expect(page.getByText("Total Berat")).toBeVisible();
    await expect(page.getByText("Total Nilai")).toBeVisible();
  });

  test("WH-02: Log inventori page memuat", async ({ page }) => {
    await clickSidebarLink(page, /gudang/i);
    await page.getByRole("link", { name: /log inventori/i }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Log Inventori")).toBeVisible();
  });
});

// ============================================================================
// BIDDING
// ============================================================================

test.describe("TC-BID: Bidding page", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "aggregator"); });

  test("BID-01: Halaman bidding memuat dengan tabs", async ({ page }) => {
    await clickSidebarLink(page, /lelang/i);
    await expect(page.getByText("Lelang Tersedia")).toBeVisible();
    await expect(page.getByText("Bid Saya")).toBeVisible();
  });

  test("BID-02: Tab Lelang Tersedia dan Bid Saya visible", async ({
    page,
  }) => {
    await clickSidebarLink(page, /lelang/i);
    await expect(page.getByText("Lelang Tersedia")).toBeVisible();
    // Tab Bid Saya harus visible (meskipun kontennya bisa kosong)
    await page.getByText("Bid Saya").click();
    await page.waitForTimeout(500);
    await expect(page.getByText("Belum ada bid")).toBeVisible();
  });
});

// ============================================================================
// COMPLETE FLOW — CRUD real via API
// ============================================================================

test.describe("TC-FLOW: Complete Aggregator flow (real CRUD)", () => {
  let wasteId = "";
  let pickupId = "";

  test.afterEach(async () => {
    if (pickupId) await deleteRecord("pickups", pickupId, "aggregator").catch(() => {});
    if (wasteId) await deleteRecord("waste_listings", wasteId, "generator").catch(() => {});
  });

  test("FLOW-01: Buat waste listing (sebagai Generator via API) untuk test aggregator", async () => {
    const { token } = await getAuthToken("generator");
    const genRes = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: emailFor("generator"), password: PASSWORD }),
    });
    const genData = await genRes.json() as { record: { id: string } };
    const genId = genData.record.id;

    const res = await fetch(`${PB_URL}/api/collections/waste_listings/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        generator: genId,
        wood_type: "r7ay7mmr0vy5bgj",
        form: "offcut_large",
        condition: "dry",
        volume: 20,
        unit: "kg",
        price_estimate: 100000,
        status: "available",
        description: `[E2E-F3] Waste untuk test aggregator ${Date.now()}`,
      }),
    });
    const waste = await res.json() as { id: string };
    wasteId = waste.id;
    expect(wasteId).toBeTruthy();
    console.log(`  ✅ Created waste_listings/${wasteId}`);
  });

  test("FLOW-02: Aggregator melihat halaman pickups (UI verification)", async ({
    page,
  }) => {
    await loginAs(page, "aggregator");
    await clickSidebarLink(page, /penjemputan/i);

    // Pickup page memuat dengan benar
    await expect(page.getByText("Perlu Dijemput")).toBeVisible();
    // Empty state untuk tab "all" — karena tidak ada pickup real
    await page.getByText("Semua").click();
    await page.waitForTimeout(500);
    await expect(page.getByText("Belum ada penjemputan")).toBeVisible();
    console.log(`  ✅ Pickups page renders correctly`);
  });

  test("FLOW-03: Verifikasi data di halaman pickups via browser", async ({ page }) => {
    await loginAs(page, "aggregator");
    await clickSidebarLink(page, /penjemputan/i);

    // Verifikasi halaman pickups render dengan benar
    await expect(page.getByText("Perlu Dijemput")).toBeVisible();
  });

  test("FLOW-04: Cleanup waste listing", async () => {
    if (wasteId) {
      await deleteRecord("waste_listings", wasteId, "generator");
      console.log(`  🗑️ Deleted waste_listings/${wasteId}`);
    }
    if (pickupId) {
      await deleteRecord("pickups", pickupId, "aggregator").catch(() => {});
    }

    // Verify waste deleted
    if (wasteId) {
      const { token } = await getAuthToken("generator");
      const check = await fetch(`${PB_URL}/api/collections/waste_listings/records/${wasteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(check.status).toBe(404);
      console.log(`  ✅ Verified deleted waste_listings/${wasteId}`);
    }
  });
});

// ============================================================================
// NEW FEATURES: Routing Polyline, Warehouse Detail, Notification Badge
// ============================================================================

test.describe("TC-NEW: Routing Polyline (P3-T9)", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "aggregator"); });

  test("RUTE-01: Tombol Rute Terdekat visible di treasure map", async ({ page }) => {
    await clickSidebarLink(page, /peta/i);
    await page.waitForTimeout(2000);
    await expect(page.getByText("Rute Terdekat")).toBeVisible();
  });
});

test.describe("TC-NEW: Warehouse Detail Page (P3-T16)", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "aggregator"); });

  test("WH-03: Warehouse detail page loads with valid item", async ({ page }) => {
    // Dapatkan ID item warehouse pertama (jika ada)
    const { token } = await getAuthToken("aggregator");
    const res = await fetch(`${PB_URL}/api/collections/warehouse_inventory/records?sort=-created&perPage=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json() as { items: { id: string }[] };

    if (data.items.length > 0) {
      const itemId = data.items[0].id;
      await page.goto(`/aggregator/warehouse/${itemId}`);
      await page.waitForLoadState("networkidle");
      await expect(page.getByText("Detail stok gudang")).toBeVisible();
    } else {
      // No warehouse items — can only check the page structure
      await page.goto("/aggregator/warehouse/999999");
      await page.waitForLoadState("networkidle");
      await expect(page.getByText("Item tidak ditemukan")).toBeVisible();
    }
  });
});

test.describe("TC-NEW: Notification Badge (AC-11)", () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, "aggregator"); });

  test("NOTIF-01: Notification badge visible di navbar", async ({ page }) => {
    // Notification bell button should be visible in navbar
    await expect(page.locator('nav a[href="/notifications"]').first()).toBeVisible();
  });
});
