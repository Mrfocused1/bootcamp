import { test, expect } from "@playwright/test";

test("homepage renders original marketing shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/");

  await expect(page.getByRole("heading")).toContainText(/build real websites/i);
  await expect(page.getByRole("link", { name: /enrol now/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");

  expect(await page.locator("[data-wf-page]").count()).toBe(0);
  expect(errors).toEqual([]);
});
