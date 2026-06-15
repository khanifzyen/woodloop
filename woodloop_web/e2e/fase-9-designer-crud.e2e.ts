/**
 * UAT Fase 9 — Designer CRUD
 *
 * ✅ Login REAL ke PocketBase (demo.designer@woodloop.id)
 * ✅ Navigasi halaman: dashboard, articles, design-notes, design-clinic, recipes, profile
 *
 * Credentials:
 *   Email: demo.designer@woodloop.id
 *   Password: password12345
 */

import { test, expect, type Page } from "@playwright/test";

const PASSWORD = "password12345";
const DESIGNER_EMAIL = "demo.designer@woodloop.id";

async function loginAsDesigner(page: Page) {
  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByLabel("Email").fill(DESIGNER_EMAIL);
  await page.getByLabel("Kata Sandi").fill(PASSWORD);
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL("/designer/dashboard", { timeout: 20000 });
}

async function clickSidebarLink(page: Page, name: string | RegExp) {
  const menuBtn = page.locator('button svg.lucide-menu');
  if (await menuBtn.isVisible().catch(() => false)) { await menuBtn.click(); await page.waitForTimeout(500); }
  await page.getByRole("link", { name }).first().click();
  await page.waitForTimeout(1500);
}

// ============================================================================

test.describe("DESIGNER-DASHBOARD", () => {
  test.beforeEach(async ({ page }) => { await loginAsDesigner(page); });

  test("Heading dashboard dan tombol navigasi", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Dashboard Desainer" })).toBeVisible();
    await expect(page.getByText("Tulis Artikel Baru")).toBeVisible();
  });

  test("Menu Cepat dan Artikel Terbaru section", async ({ page }) => {
    await expect(page.getByText("Menu Cepat")).toBeVisible();
    await expect(page.getByText("Artikel Terbaru")).toBeVisible();
  });
});

test.describe("DESIGNER-ARTICLES", () => {
  test.beforeEach(async ({ page }) => { await loginAsDesigner(page); });

  test("Halaman artikel via sidebar", async ({ page }) => {
    await clickSidebarLink(page, /artikel sirkular/i);
    await expect(page.getByRole("heading", { name: "Artikel Sirkular" })).toBeVisible();
  });

  test("Form artikel baru via URL langsung", async ({ page }) => {
    await page.goto("/designer/articles/new");
    await expect(page.getByRole("heading", { name: "Artikel Baru" })).toBeVisible();
    await expect(page.locator("#title")).toBeVisible();
    await expect(page.locator("#slug")).toBeVisible();
    await expect(page.locator("#category")).toBeVisible();
  });

  test("Validasi — submit kosong tetap di halaman form", async ({ page }) => {
    await page.goto("/designer/articles/new");
    await expect(page.getByRole("heading", { name: "Artikel Baru" })).toBeVisible();
    await page.getByRole("button", { name: /simpan sebagai draf/i }).click();
    await expect(page).toHaveURL(/\/designer\/articles\/new/);
  });
});

test.describe("DESIGNER-NOTES", () => {
  test.beforeEach(async ({ page }) => { await loginAsDesigner(page); });

  test("Halaman catatan desain via sidebar", async ({ page }) => {
    await clickSidebarLink(page, /catatan desain/i);
    await expect(page.getByRole("heading", { name: "Catatan Desain" })).toBeVisible();
  });

  test("Form catatan baru via URL langsung", async ({ page }) => {
    await page.goto("/designer/design-notes/new");
    await expect(page.getByRole("heading", { name: "Catatan Desain Baru" })).toBeVisible();
    await expect(page.getByText("Target Produk")).toBeVisible();
    await expect(page.locator("#content")).toBeVisible();
  });
});

test.describe("DESIGNER-CLINIC", () => {
  test.beforeEach(async ({ page }) => { await loginAsDesigner(page); });

  test("Halaman klinik desain via sidebar", async ({ page }) => {
    await clickSidebarLink(page, /klinik desain/i);
    await expect(page.getByRole("heading", { name: "Klinik Desain" })).toBeVisible();
  });

  test("Halaman resep desain", async ({ page }) => {
    await page.goto("/designer/design-clinic/recipes");
    await expect(page.getByRole("heading", { name: "Resep Desain" })).toBeVisible({ timeout: 15000 });
  });
});

test.describe("DESIGNER-PROFILE", () => {
  test.beforeEach(async ({ page }) => { await loginAsDesigner(page); });

  test("Halaman profil via URL langsung", async ({ page }) => {
    await page.goto("/designer/profile");
    await expect(page.getByRole("heading", { name: "Profil Desainer" })).toBeVisible();
    await expect(page.getByText("Informasi Profil")).toBeVisible();
    await expect(page.getByRole("button", { name: "Simpan Profil" })).toBeVisible();
  });

  test("Field nama terisi data user", async ({ page }) => {
    await page.goto("/designer/profile");
    const nameInput = page.locator("#name");
    await expect(nameInput).toHaveValue(/demo/i);
  });
});

// ============================================================================
// CRUD — Designer full article CRUD
// ============================================================================
const PB_URL_DESIGNER = "https://pb-woodloop.pasarjepara.com";

async function getDesignerToken(): Promise<{ token: string; userId: string }> {
  const r = await fetch(`${PB_URL_DESIGNER}/api/collections/users/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: DESIGNER_EMAIL, password: PASSWORD }),
  });
  const d = await r.json() as { token: string; record: { id: string } };
  return { token: d.token, userId: d.record.id };
}

async function deletePBRecord(coll: string, id: string, token: string) {
  await fetch(`${PB_URL_DESIGNER}/api/collections/${coll}/records/${id}`, {
    method: "DELETE", headers: { Authorization: `Bearer ${token}` },
  });
}

test.describe("DESIGNER-CRUD", () => {
  let articleId = "";
  let noteId = "";
  let authToken = "";
  let userId = "";

  test("CRUD-01: Create article via API", async () => {
    const auth = await getDesignerToken();
    authToken = auth.token;
    userId = auth.userId;

    const res = await fetch(`${PB_URL_DESIGNER}/api/collections/design_articles/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        author: userId,
        title: `[E2E-CRUD] Artikel Test ${Date.now()}`,
        slug: `e2e-artikel-${Date.now()}`,
        content: "Ini adalah konten artikel test E2E.",
        category: "design",
        status: "draft",
      }),
    });
    const data = await res.json() as { id: string };
    articleId = data.id;
    expect(articleId).toBeTruthy();
    console.log(`  ✅ Created design_articles/${articleId}`);
  });

  test("CRUD-02: Update article via API", async () => {
    const res = await fetch(`${PB_URL_DESIGNER}/api/collections/design_articles/records/${articleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ title: `[E2E-CRUD] Updated ${Date.now()}`, status: "published" }),
    });
    expect(res.status).toBe(200);
    console.log(`  ✅ Updated design_articles/${articleId}`);
  });

  test("CRUD-03: Create design note via API", async () => {
    const res = await fetch(`${PB_URL_DESIGNER}/api/collections/design_notes/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        designer: userId,
        content: "Catatan desain test E2E.",
        target_product: "Meja Lipat",
        status: "public",
      }),
    });
    const data = await res.json() as { id: string };
    noteId = data.id;
    expect(noteId).toBeTruthy();
    console.log(`  ✅ Created design_notes/${noteId}`);
  });

  test("CRUD-04: Delete article via API", async () => {
    await deletePBRecord("design_articles", articleId, authToken);
    console.log(`  🗑️ Deleted design_articles/${articleId}`);
    const check = await fetch(`${PB_URL_DESIGNER}/api/collections/design_articles/records/${articleId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(check.status).toBe(404);
    console.log(`  ✅ Verified deleted design_articles/${articleId}`);
    articleId = "";
  });

  test("CRUD-05: Delete design note via API", async () => {
    await deletePBRecord("design_notes", noteId, authToken);
    console.log(`  🗑️ Deleted design_notes/${noteId}`);
    const check = await fetch(`${PB_URL_DESIGNER}/api/collections/design_notes/records/${noteId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(check.status).toBe(404);
    console.log(`  ✅ Verified deleted design_notes/${noteId}`);
    noteId = "";
  });
});
