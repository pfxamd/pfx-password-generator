import { expect, test } from "@playwright/test";

test("generates a password in the browser", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "PFx Password Generator" }),
  ).toBeVisible();

  const output = page.getByTestId("password-output");
  await expect(output).toHaveText(/^.{20}$/u);

  await page.getByRole("button", { name: "Generate" }).click();
  await expect(output).toHaveText(/^.{20}$/u);
});
