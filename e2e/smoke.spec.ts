import { expect, test } from "@playwright/test";

test("password mode generates in the browser", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Generate secrets without sending them anywhere.",
    }),
  ).toBeVisible();

  const output = page.getByTestId("secret-output");
  await expect(output).toHaveText(/^.{20}$/u);

  await page.getByRole("button", { name: "Regenerate" }).click();
  await expect(output).toHaveText(/^.{20}$/u);
});

test("passphrase mode accepts a local wordlist", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Passphrase" }).click();

  await page
    .getByLabel("Words")
    .fill("alpha\nbravo\ncharlie\ndelta\necho\nfoxtrot");

  await expect(page.getByTestId("secret-output")).toContainText("-");
});

test("batch mode produces the requested number of results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Batch" }).click();

  await page.getByLabel("Count").fill("5");
  await page.getByRole("button", { name: "Generate batch" }).click();

  await expect(page.locator("ol li")).toHaveCount(5);
});
