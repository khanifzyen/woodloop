import { test, expect } from "@playwright/test";

/**
 * UAT Fase 1: Foundation — Proxy/Middleware Route Protection + Dashboard Layout
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

  test("should redirect homepage / to /login after onboarding", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("woodloop_onboarding_done", "true");
    });
    await page.goto("/");
    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");
  });

  test("should redirect protected dashboard routes to /login when not authenticated", async ({ page }) => {
    const dashboards = [
      "/supplier/dashboard",
      "/generator/dashboard",
      "/aggregator/dashboard",
      "/converter/dashboard",
      "/enabler/dashboard",
      "/buyer/dashboard",
    ];

    for (const route of dashboards) {
      await page.goto(route);
      await page.waitForURL(/login/);
      expect(page.url()).toContain("login");
    }
  });
});

test.describe("TC-08: Layout & Dashboard Routes", () => {
  test("dashboard routes should return 200 when accessed directly", async ({ page }) => {
    const dashboards = [
      "/supplier/dashboard",
      "/generator/dashboard",
      "/aggregator/dashboard",
      "/converter/dashboard",
      "/enabler/dashboard",
      "/buyer/dashboard",
    ];

    for (const route of dashboards) {
      const response = await page.goto(route);
      // Will redirect to login since not authenticated, but shouldn't 404
      expect(response?.status()).toBeLessThan(400);
    }
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
