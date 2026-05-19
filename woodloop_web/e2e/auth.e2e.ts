import { test, expect } from "@playwright/test";

/**
 * UAT Fase 1: Foundation — Halaman Auth
 */

test.describe("TC-01: Homepage Redirect", () => {
  test("should redirect / to /login", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");
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

test.describe("TC-03: Halaman Register", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("should display multi-step form with progress bar", async ({ page }) => {
    await expect(page.getByText("Daftar Akun")).toBeVisible();
    await expect(page.getByText("Nama Lengkap")).toBeVisible();
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText("Kata Sandi")).toBeVisible();
    // Progress bar
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
  });

  test("should show role selection after filling step 1", async ({ page }) => {
    // Isi step 1
    await page.locator('input[placeholder="Nama Anda"]').fill("Test User");
    await page.locator('input[placeholder="nama@email.com"]').fill("test@test.com");
    await page.locator('input[placeholder="Minimal 6 karakter"]').fill("password123");

    // Klik Lanjut
    await page.getByRole("button", { name: "Lanjut" }).click();

    // Step 2: harusnya ada 6 role cards
    await expect(page.getByText("Pilih Peran")).toBeVisible();
    await expect(page.getByText("Supplier")).toBeVisible();
    await expect(page.getByText("Generator")).toBeVisible();
    await expect(page.getByText("Aggregator")).toBeVisible();
    await expect(page.getByText("Converter")).toBeVisible();
    await expect(page.getByText("Enabler")).toBeVisible();
    await expect(page.getByText("Buyer")).toBeVisible();
  });

  test("should select role and proceed to step 3", async ({ page }) => {
    // Isi step 1
    await page.locator('input[placeholder="Nama Anda"]').fill("Test User");
    await page.locator('input[placeholder="nama@email.com"]').fill("test@test.com");
    await page.locator('input[placeholder="Minimal 6 karakter"]').fill("password123");
    await page.getByRole("button", { name: "Lanjut" }).click();

    // Pilih role Supplier
    await page.getByText("Supplier").first().click();
    await page.getByRole("button", { name: "Lanjut" }).click();

    // Step 3: detail peran
    await expect(page.getByText("Nomor Telepon")).toBeVisible();
    await expect(page.getByText("Nama Perusahaan")).toBeVisible();
  });
});

test.describe("TC-04: Role Selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/role-selection");
  });

  test("should display 6 role cards in grid with all labels", async ({ page }) => {
    await expect(page.getByText("Pilih Peran Anda")).toBeVisible();
    await expect(page.getByText("Supplier")).toBeVisible();
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
