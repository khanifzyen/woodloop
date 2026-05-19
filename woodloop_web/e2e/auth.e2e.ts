import { test, expect } from "@playwright/test";

/**
 * UAT Fase 1: Foundation — Halaman Auth
 */

test.describe("TC-01: Homepage Redirect (Onboarding Flow)", () => {
  test("should redirect / to /onboarding when first visit (no flag)", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("/onboarding");
    expect(page.url()).toContain("/onboarding");
  });

  test("should redirect / to /login after onboarding completed", async ({ page }) => {
    // Set localStorage flag seolah onboarding sudah selesai
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("woodloop_onboarding_done", "true");
    });
    await page.goto("/");
    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");
  });

  test("should allow re-watching onboarding from login page", async ({ page }) => {
    await page.goto("/login");
    await page.evaluate(() => {
      localStorage.setItem("woodloop_onboarding_done", "true");
    });
    await page.goto("/login");
    await page.getByText("Lihat onboarding lagi").click();
    await expect(page).toHaveURL(/onboarding/);
  });
});

test.describe("TC-02: Halaman Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form with all elements", async ({ page }) => {
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: "Masuk" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Kata Sandi")).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk" })).toBeVisible();
    await expect(page.getByText("Daftar")).toBeVisible();
    await expect(page.getByText("Lupa Kata Sandi?")).toBeVisible();
  });

  test("should show validation errors after submission attempt", async ({ page }) => {
    // Submit empty form trigger Zod validation
    await page.getByRole("button", { name: "Masuk" }).click();
    // Zod akan menampilkan error message via FormMessage
    await expect(page.getByText("Email tidak valid")).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.getByText("Daftar").click();
    await expect(page).toHaveURL(/register/);
  });

  test("should navigate to forgot password page", async ({ page }) => {
    await page.getByText("Lupa Kata Sandi?").click();
    await expect(page).toHaveURL(/forgot-password/);
  });
});

test.describe("TC-03: Halaman Register (2-step, role from URL)", () => {
  test.beforeEach(async ({ page }) => {
    // Register sekarang butuh ?role= dari role-selection
    await page.goto("/register?role=supplier");
  });

  test("should redirect to role-selection if no role param", async ({ page }) => {
    await page.goto("/register");
    await page.waitForURL("/role-selection");
    expect(page.url()).toContain("role-selection");
  });

  test("should display multi-step form with role badge", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await expect(page.getByText("Daftar Akun")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Supplier", { exact: true })).toBeVisible(); // role badge
    await expect(page.getByText("Nama Lengkap")).toBeVisible();
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText("Kata Sandi")).toBeVisible();
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
  });

  test("should proceed to step 2 (detail peran) after filling step 1", async ({ page }) => {
    await page.locator('input[placeholder="Nama Anda"]').fill("Test User");
    await page.locator('input[placeholder="nama@email.com"]').fill("test@test.com");
    await page.locator('input[placeholder="Minimal 6 karakter"]').fill("password123");

    await page.getByRole("button", { name: "Lanjut" }).click();

    // Step 2: detail peran — bukan role selection lagi
    await expect(page.getByText("Nomor Telepon")).toBeVisible();
    await expect(page.getByText("Nama Perusahaan")).toBeVisible();
  });

  test("should have link to re-select role", async ({ page }) => {
    await expect(page.getByText("Pilih ulang")).toBeVisible();
    await page.getByText("Pilih ulang").click();
    await expect(page).toHaveURL(/role-selection/);
  });
});

test.describe("TC-04: Role Selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/role-selection");
  });

  test("should display 6 role cards in grid with all labels", async ({ page }) => {
    await expect(page.getByText("Pilih Peran Anda")).toBeVisible();
    await expect(page.getByText("Supplier", { exact: true })).toBeVisible();
    await expect(page.getByText("Generator")).toBeVisible();
    await expect(page.getByText("Aggregator")).toBeVisible();
    await expect(page.getByText("Converter")).toBeVisible();
    await expect(page.getByText("Enabler")).toBeVisible();
    await expect(page.getByText("Buyer")).toBeVisible();
  });

  test("should have confirm button disabled initially", async ({ page }) => {
    const confirmBtn = page.getByRole("button", { name: "Konfirmasi" });
    await expect(confirmBtn).toBeDisabled();
  });

  test("should enable confirm button after selecting role", async ({ page }) => {
    // Click first role card (button elements inside the grid)
    await page.getByText("Supplier").first().click();
    const confirmBtn = page.getByRole("button", { name: "Konfirmasi" });
    await expect(confirmBtn).toBeEnabled();
  });
});

test.describe("TC-05: Onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/onboarding");
  });

  test("should display first slide with title and Skip button", async ({ page }) => {
    await expect(page.getByText("Masalah")).toBeVisible();
    await expect(page.getByText("Penumpukan Limbah Kayu")).toBeVisible();
    await expect(page.getByRole("button", { name: "Lewati" })).toBeVisible();
  });

  test("should navigate slides with Lanjut button", async ({ page }) => {
    // Click Lanjut → slide 2
    await page.getByRole("button", { name: "Lanjut" }).click();
    await expect(page.getByText("Solusi")).toBeVisible();
  });

  test("should go to role selection on Skip", async ({ page }) => {
    await page.getByRole("button", { name: "Lewati" }).click();
    await expect(page).toHaveURL(/role-selection/);
  });
});

test.describe("TC-06: Forgot Password", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
  });

  test("should display email form", async ({ page }) => {
    await expect(page.getByText("Lupa Kata Sandi")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Kirim Tautan Reset" })).toBeVisible();
  });

  test("should have back to login link", async ({ page }) => {
    await page.getByText("Kembali ke Login").click();
    await expect(page).toHaveURL(/login/);
  });
});
