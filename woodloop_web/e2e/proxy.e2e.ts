import { test, expect } from "@playwright/test";

/**
 * UAT Fase 1: Foundation — Proxy/Middleware Route Protection
 *
 * Catatan: Proxy middleware saat ini hanya melindungi route groups
 * (supplier, generator, dll) yang belum dibuat. Route groups tidak
 * muncul di URL, jadi middleware belum bisa redirect berdasarkan path.
 * Test ini fokus pada public routes dan homepage redirect.
 */

test.describe("TC-07: Proxy/Middleware Route Protection", () => {
  test("should allow access to public auth routes without redirect", async ({ page }) => {
    const publicRoutes = [
      "/login",
      "/register",
      "/onboarding",
      "/role-selection",
      "/forgot-password",
    ];

    for (const route of publicRoutes) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain(route);
    }
  });

  test("should stay on /login without redirect loop", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    expect(page.url()).toContain("/login");
  });

  test("should redirect homepage / to /login", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");
  });
});

test.describe("TC-11: Performance Check", () => {
  test("should load login page within reasonable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - start;

    console.log(`Login page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });
});
