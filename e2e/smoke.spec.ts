import { expect, test } from "@playwright/test";

test("password mode generates in the browser", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "PFx Password Lab" }),
  ).toBeVisible();

  const output = page.getByTestId("secret-output");
  await expect(output).toHaveValue(/^.{20}$/u);

  await page.getByRole("button", { name: "Regenerate" }).click();
  await expect(output).toHaveValue(/^.{20}$/u);

  await page.screenshot({
    path: "test-results/password-desktop.png",
    fullPage: true,
  });
});

test("password mode remains usable on a phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "PFx Password Lab" }),
  ).toBeVisible();

  await expect(page.getByTestId("secret-output")).toHaveValue(/^.{20}$/u);

  await page.screenshot({
    path: "test-results/password-mobile.png",
    fullPage: true,
  });
});

test("passphrase mode accepts a local wordlist", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Passphrase" }).click();

  await page
    .getByLabel("Words")
    .fill("alpha\nbravo\ncharlie\ndelta\necho\nfoxtrot");

  await expect(page.getByTestId("secret-output")).toHaveValue(/-/u);
});

test("batch mode produces the requested number of results", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Batch" }).click();

  await page.getByLabel("Count").fill("5");
  await page.getByRole("button", { name: "generate batch" }).click();

  await expect(page.locator("ol li")).toHaveCount(5);
});
