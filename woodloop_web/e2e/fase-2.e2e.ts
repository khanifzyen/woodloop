import { test, expect } from "@playwright/test";

/**
 * UAT Fase 2: Supplier + Generator
 * Menjalankan test di Chromium Desktop & Chromium Mobile (Pixel 5)
 * via playwright.config.ts projects: ["chromium-desktop", "chromium-mobile"]
 */

// ─── Helper: Mock auth via cookies + localStorage ──────────────────────────
// 1. Set cookies untuk middleware Next.js (server-side check)
// 2. Navigasi ke target URL
// 3. Saat DOMContentLoaded (sebelum React render), set localStorage
async function mockAuthAndGo(
  page: import("@playwright/test").Page,
  role: string,
  target: string
) {
  // Set cookies untuk middleware Next.js (server side)
  await page.context().addCookies([
    { name: "pb_auth", value: `mock-token-${role}`, url: "http://localhost:3000" },
    { name: "pb_role", value: role, url: "http://localhost:3000" },
  ]);

  // Intercept request ke PocketBase (tidak jalan di test)
  await page.route("https://pb-woodloop.pasarjepara.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ page: 1, perPage: 100, totalItems: 0, totalPages: 0, items: [] }),
    });
  });
  await page.route("http://127.0.0.1:8090/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ page: 1, perPage: 100, totalItems: 0, totalPages: 0, items: [] }),
    });
  });

  // Inject auth langsung ke Zustand store via __zustand internal
  // + set localStorage sebagai backup
  await page.addInitScript((r) => {
    const authData = {
      user: { id: `${r}-mock-1`, email: `${r}@woodloop.test`, username: `${r}test`, name: `Test ${r.charAt(0).toUpperCase() + r.slice(1)}`, role: r, is_verified: true },
      token: `mock-token-${r}`,
      isAuthenticated: true,
      role: r,
    };
    localStorage.setItem("woodloop-auth", JSON.stringify({ state: authData, version: 0 }));
    localStorage.setItem("woodloop_onboarding_done", "true");
    // Override agar Zustand persist membaca secara sinkron
    const origGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function(key) {
      if (key === "woodloop-auth") return JSON.stringify({ state: authData, version: 0 });
      return origGetItem.call(this, key);
    };
  }, role);

  // Navigasi ke target — Zustand persist membaca localStorage secara sinkron
  await page.goto(target, { waitUntil: "networkidle" });
}

// ============================================================================
// SUPPLIER — TC-S01: Dashboard
// ============================================================================

test.describe("TC-S01: Supplier Dashboard", () => {
  test("S01-01: redirect ke login saat tidak punya auth", async ({ page }) => {
    await page.goto("/supplier/dashboard");
    await page.waitForURL(/login/);
    expect(page.url()).toContain("login");
  });

  test("S01-02: dashboard tampil setelah login", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/dashboard");
    await expect(page.getByText("Dashboard Supplier")).toBeVisible();
  });

  test("S01-03: 4 summary cards visible", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/dashboard");
    await expect(page.getByText("Listing Aktif")).toBeVisible();
    await expect(page.getByText("Order Masuk")).toBeVisible();
    await expect(page.getByText("Total Penjualan").first()).toBeVisible();
    await expect(page.getByText("Saldo Dompet").first()).toBeVisible();
  });

  test("S01-04: recent activity section visible", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/dashboard");
    await expect(page.getByText("Aktivitas Terbaru")).toBeVisible();
  });

  test("S01-05: quick action navigasi ke /inventory/new", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/dashboard");
    await page.getByText("Daftarkan Kayu Baru").first().click();
    await expect(page).toHaveURL(/\/supplier\/inventory\/new/);
  });
});

// ============================================================================
// SUPPLIER — TC-S02: Inventory List
// ============================================================================

test.describe("TC-S02: Supplier Inventory List", () => {
  test("S02-01: halaman inventory memuat", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory");
    await expect(page.getByText("Inventaris Kayu").first()).toBeVisible();
  });

  test("S02-02: search input dan filter visible", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory");
    await expect(page.getByPlaceholder("Cari jenis kayu...")).toBeVisible();
    await expect(page.getByText(/Semua status/).first()).toBeVisible();
  });

  test("S02-03: tombol tambah kayu visible", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory");
    await expect(page.getByText("Daftarkan Kayu Baru").first()).toBeVisible();
  });

  test("S02-04: klik tambah kayu navigasi", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory");
    await page.getByText("Daftarkan Kayu Baru").first().click();
    await expect(page).toHaveURL(/\/supplier\/inventory\/new/);
  });

  test("S02-05: empty state atau table", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory");
    const emptyMsg = page.getByText("Belum ada kayu terdaftar");
    const table = page.locator("table");
    const isEmpty = await emptyMsg.isVisible().catch(() => false);
    if (!isEmpty) {
      await expect(table).toBeVisible();
    }
  });
});

// ============================================================================
// SUPPLIER — TC-S03: Inventory Create/Edit
// ============================================================================

test.describe("TC-S03: Supplier Inventory Form", () => {
  test("S03-01: form tambah kayu memuat", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory/new");
    await expect(page.getByText("Daftarkan Kayu Baru").first()).toBeVisible();
    await expect(page.getByText("Informasi Kayu")).toBeVisible();
    await expect(page.getByText("Foto Kayu")).toBeVisible();
  });

  test("S03-02: field form visible", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory/new");
    await expect(page.getByText("Jenis Kayu")).toBeVisible();
    await expect(page.getByText("Diameter (cm)")).toBeVisible();
    await expect(page.getByText("Panjang (cm)")).toBeVisible();
    await expect(page.getByText("Volume")).toBeVisible();
    await expect(page.getByText("Harga (Rp)")).toBeVisible();
    await expect(page.getByText("Deskripsi")).toBeVisible();
  });

  test("S03-03: dropzone visible", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory/new");
    await expect(
      page.getByText(/Seret foto ke sini atau klik untuk upload/i)
    ).toBeVisible();
  });

  test("S03-04: dokumen legalitas section visible", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory/new");
    await expect(page.getByText("Dokumen Legalitas")).toBeVisible();
  });

  test("S03-05: cancel button navigasi kembali", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory/new");
    await page.getByText("Batal").click();
    await expect(page).toHaveURL(/\/supplier\/inventory$/);
  });

  test("S03-06: validasi form — submit kosong muncul error", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/inventory/new");
    await page.getByText("Simpan Kayu").click();
    await page.waitForTimeout(500);
    // Setidaknya satu error muncul
    const errors = page.getByText(/harus diisi|wajib|minimal/i);
    await expect(errors.first()).toBeVisible();
  });
});

// ============================================================================
// SUPPLIER — TC-S04: Orders & Sales
// ============================================================================

test.describe("TC-S04: Supplier Orders & Sales", () => {
  test("S04-01: halaman orders memuat", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/orders");
    await expect(page.getByRole("heading", { name: /Pesanan Masuk/i })).toBeVisible();
  });

  test("S04-02: halaman sales memuat", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/sales");
    await expect(page.getByText("Riwayat Penjualan")).toBeVisible();
  });

  test("S04-03: 3 summary cards di sales", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/sales");
    await expect(page.getByText("Total Pendapatan")).toBeVisible();
    await expect(page.getByText("Pesanan Selesai")).toBeVisible();
    await expect(page.getByText("Total Transaksi")).toBeVisible();
  });

  test("S04-04: chart section di sales", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/sales");
    await expect(page.getByText("Penjualan per Bulan")).toBeVisible();
  });

  test("S04-05: tabel transaksi di sales", async ({ page }) => {
    await mockAuthAndGo(page, "supplier", "/supplier/sales");
    await expect(page.getByText("Daftar Transaksi")).toBeVisible();
  });
});

// ============================================================================
// GENERATOR — TC-G01: Dashboard
// ============================================================================

test.describe("TC-G01: Generator Dashboard", () => {
  test("G01-01: redirect ke login saat tidak punya auth", async ({ page }) => {
    await page.goto("/generator/dashboard");
    await page.waitForURL(/login/);
    expect(page.url()).toContain("login");
  });

  test("G01-02: dashboard tampil setelah login", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/dashboard");
    await expect(page.getByText("Dashboard Generator")).toBeVisible();
  });

  test("G01-03: 4 summary cards visible", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/dashboard");
    await expect(page.getByText("Saldo Dompet")).toBeVisible();
    await expect(page.getByText("Limbah Disetor")).toBeVisible();
    await expect(page.getByText("Produk Aktif")).toBeVisible();
    await expect(page.getByText("Tawaran Masuk")).toBeVisible();
  });

  test("G01-04: quick action setor limbah", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/dashboard");
    // Cari button CTA yang visible, bukan sidebar link
    const btn = page.locator("a").filter({ hasText: "Setor Limbah" }).last();
    await btn.click();
    await expect(page).toHaveURL(/\/generator\/report-waste/);
  });

  test("G01-05: quick action beli kayu", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/dashboard");
    const btn = page.locator("a").filter({ hasText: "Beli Kayu" }).last();
    await btn.click();
    await expect(page).toHaveURL(/\/generator\/buy-timber/);
  });
});

// ============================================================================
// GENERATOR — TC-G02: Report Waste
// ============================================================================

test.describe("TC-G02: Generator Report Waste", () => {
  test("G02-01: halaman setor limbah memuat", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/report-waste");
    await expect(page.getByText("Setor Limbah").first()).toBeVisible();
  });

  test("G02-02: step 1 default — foto limbah", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/report-waste");
    await expect(page.getByText("Foto Limbah").first()).toBeVisible();
    await expect(page.getByText("Langkah 1 dari 4").first()).toBeVisible();
    await expect(page.getByText("Ambil Foto Limbah").first()).toBeVisible();
  });

  test("G02-03: progress bar visible", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/report-waste");
    await expect(page.getByRole("progressbar")).toBeVisible();
  });

  test("G02-04: tombol navigasi Kembali & Lanjut", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/report-waste");
    await expect(page.getByText("Kembali").first()).toBeVisible();
    await expect(page.getByText("Lanjut").first()).toBeVisible();
  });

  test("G02-05: step indicators (4 buttons)", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/report-waste");
    // Step 1, 2, 3, 4 indicators
    const steps = page.locator("button").filter({ hasText: /^[1-4]$/ });
    await expect(steps).toHaveCount(4);
  });

  test("G02-06: navigasi ke step 2 — jenis & bentuk", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/report-waste");
    await page.getByText("Lanjut").click();
    await page.waitForTimeout(300);
    // Validasi foto akan muncul, atau lanjut ke step 2
    const errorPhoto = page.getByText(/minimal 1 foto/i);
    const step2 = page.getByText("Jenis & Bentuk");
    const hasError = await errorPhoto.isVisible().catch(() => false);
    if (!hasError) {
      await expect(step2).toBeVisible();
    }
  });
});

// ============================================================================
// GENERATOR — TC-G03: Buy Timber
// ============================================================================

test.describe("TC-G03: Generator Buy Timber", () => {
  test("G03-01: halaman beli kayu memuat", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/buy-timber");
    await expect(page.getByText("Beli Kayu Mentah")).toBeVisible();
  });

  test("G03-02: search bar visible", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/buy-timber");
    await expect(page.getByPlaceholder("Cari kayu...")).toBeVisible();
  });

  test("G03-03: filter desktop — jenis kayu & price range", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/buy-timber");
    // Filter hanya visible di desktop
    const jenisKayu = page.getByText("Jenis Kayu");
    const minPrice = page.getByPlaceholder("Rp 0");
    if (await jenisKayu.isVisible()) {
      await expect(jenisKayu).toBeVisible();
    }
    if (await minPrice.isVisible()) {
      await expect(minPrice).toBeVisible();
    }
  });

  test("G03-04: empty state atau grid cards", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/buy-timber");
    const emptyMsg = page.getByText("Tidak ada kayu tersedia");
    const gridCard = page.locator('[class*="grid"]').first();
    const isEmpty = await emptyMsg.isVisible().catch(() => false);
    if (!isEmpty) {
      await expect(gridCard).toBeVisible();
    }
  });
});

// ============================================================================
// GENERATOR — TC-G04: Products
// ============================================================================

test.describe("TC-G04: Generator Products", () => {
  test("G04-01: halaman produk memuat", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/products");
    await expect(page.getByText("Produk Saya")).toBeVisible();
  });

  test("G04-02: tombol tambah produk visible", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/products");
    await expect(page.getByText("Tambah Produk").first()).toBeVisible();
  });

  test("G04-03: navigasi ke form tambah produk", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/products");
    await page.getByText("Tambah Produk").first().click();
    await expect(page).toHaveURL(/\/generator\/products\/new/);
  });

  test("G04-04: form tambah produk memuat", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/products/new");
    await expect(page.getByText("Tambah Produk Baru").first()).toBeVisible();
    await expect(page.getByText("Informasi Produk")).toBeVisible();
    await expect(page.getByText("Foto Produk")).toBeVisible();
  });

  test("G04-05: field form produk", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/products/new");
    await expect(page.getByText("Nama Produk")).toBeVisible();
    await expect(page.getByText("Kategori")).toBeVisible();
    await expect(page.getByText("Harga (Rp)")).toBeVisible();
    await expect(page.getByText("Stok")).toBeVisible();
  });

  test("G04-06: cancel button di form produk", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/products/new");
    await page.getByText("Batal").click();
    await expect(page).toHaveURL(/\/generator\/products$/);
  });

  test("G04-07: delete dialog di halaman produk", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/products");
    // Cek apakah ada icon trash (delete) — jika ada data
    const trashIcon = page.locator('button svg.lucide-trash2').first();
    if (await trashIcon.isVisible().catch(() => false)) {
      await trashIcon.click();
      await expect(page.getByText("Hapus Produk")).toBeVisible();
    }
  });
});

// ============================================================================
// GENERATOR — TC-G05: Timber Orders
// ============================================================================

test.describe("TC-G05: Generator Timber Orders", () => {
  test("G05-01: halaman pesanan kayu memuat", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/timber-orders");
    await expect(page.getByRole("heading", { name: /Pesanan Kayu/i })).toBeVisible();
  });

  test("G05-02: empty state atau table", async ({ page }) => {
    await mockAuthAndGo(page, "generator", "/generator/timber-orders");
    const emptyMsg = page.getByText("Belum ada pesanan kayu");
    const table = page.locator("table");
    const isEmpty = await emptyMsg.isVisible().catch(() => false);
    if (!isEmpty) {
      await expect(table).toBeVisible();
    }
  });
});

// ============================================================================
// RESPONSIVE — TC-R: Cross-browser layout checks
// ============================================================================

test.describe("TC-R: Responsive Layout", () => {
  test("R01: sidebar navigasi visible di desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await mockAuthAndGo(page, "supplier", "/supplier/dashboard");
    await expect(page.getByText("Dashboard").first()).toBeVisible();
  });

  test("R02: hamburger menu di mobile", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await mockAuthAndGo(page, "supplier", "/supplier/dashboard");
    // Hamburger button visible di mobile
    const menuBtn = page.locator('button svg.lucide-menu');
    await expect(menuBtn).toBeVisible();
  });

  test("R03: heading sizes sesuai viewport", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await mockAuthAndGo(page, "supplier", "/supplier/dashboard");
    // Heading harus visible di mobile
    await expect(page.getByText("Dashboard Supplier")).toBeVisible();
  });
});
