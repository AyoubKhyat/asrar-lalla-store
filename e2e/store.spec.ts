import { test, expect } from "@playwright/test";

test("homepage loads and shows brand name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toContainText("ASRAR LALLA");
});

test("products page lists items", async ({ page }) => {
  await page.goto("/products");
  await expect(page.locator("main")).toBeVisible();
});

test("cart page is accessible", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.locator("body")).toContainText("Panier");
});

test("admin login page renders", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.locator("input[type='email']")).toBeVisible();
});
