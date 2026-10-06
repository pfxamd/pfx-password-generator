import { expect, test } from "@playwright/test";

test.describe("release audit", () => {
  test("password regeneration, entropy, copy, and privacy work locally", async ({
    context,
    page,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    const output = page.getByTestId("secret-output");
    const before = await output.textContent();

    await page.getByRole("button", { name: "Regenerate" }).click();

    await expect.poll(async () => output.textContent()).not.toBe(before);

    const entropyValue = page
      .getByText("Generation entropy", { exact: true })
      .locator("..")
      .locator("strong");
    await expect(entropyValue).toContainText("bits");

    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));

    const copiedValue = await output.textContent();
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();

    const clipboardValue = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardValue).toBe(copiedValue);

    await page.getByLabel("Password length", { exact: true }).fill("10");
    await expect(output).toHaveText(/^.{10}$/u);

    const storage = await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    }));

    expect(storage).toEqual({ local: 0, session: 0 });
    expect(requests).toEqual([]);
  });

  test("password invalid states are rejected visibly", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Password length", { exact: true }).fill("0");
    await expect(
      page.getByRole("alert").getByText(/between 1 and 4096/u),
    ).toBeVisible();

    await page.getByLabel("Password length", { exact: true }).fill("4097");
    await expect(
      page.getByRole("alert").getByText(/between 1 and 4096/u),
    ).toBeVisible();

    await page.getByLabel("Password length", { exact: true }).fill("20");

    for (const label of ["Lowercase", "Uppercase", "Numbers", "Symbols"]) {
      await page
        .getByRole("checkbox", { name: label })
        .uncheck({ force: true });
    }

    await expect(
      page.getByRole("alert").getByText(/no valid sequences/u),
    ).toBeVisible();
  });

  test("unsatisfiable minimum composition rules are rejected", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByLabel("Password length", { exact: true }).fill("2");
    await page.getByText("Advanced composition rules").click();
    await page.getByLabel("Lowercase minimum").fill("2");
    await page.getByLabel("Uppercase minimum").fill("2");

    await expect(
      page.getByRole("alert").getByText(/no valid sequences/u),
    ).toBeVisible();
  });

  test("passphrase mode supports local files and validates configuration", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Passphrase" }).click();

    await page.getByLabel("load local text file").setInputFiles({
      name: "words.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(
        "alpha\nbravo\ncharlie\ndelta\necho\nfoxtrot\nalpha\n",
      ),
    });

    await expect(page.getByText("6 unique")).toBeVisible();
    await expect(page.getByText("1 duplicate entry ignored")).toBeVisible();
    await expect(page.getByTestId("secret-output")).toContainText("-");

    await page.getByLabel("Separator").fill("");
    await expect(
      page.getByRole("alert").getByText(/separator must not be empty/u),
    ).toBeVisible();

    await page.getByLabel("Separator").fill("-");
    await page.getByLabel("Word count").fill("4097");
    await expect(
      page.getByRole("alert").getByText(/between 1 and 4096/u),
    ).toBeVisible();
  });

  test("batch mode validates count and copies all generated values", async ({
    context,
    page,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.getByRole("tab", { name: "Batch" }).click();

    const count = page.getByLabel("count");

    await count.fill("0");
    await page.getByRole("button", { name: "generate batch" }).click();
    await expect(
      page.getByRole("alert").getByText(/between 1 and 10000/u),
    ).toBeVisible();

    await count.fill("10001");
    await page.getByRole("button", { name: "generate batch" }).click();
    await expect(
      page.getByRole("alert").getByText(/between 1 and 10000/u),
    ).toBeVisible();

    await count.fill("5");
    await page.getByRole("button", { name: "generate batch" }).click();

    const results = page.getByRole("list", { name: "Generated passwords" });
    await expect(results.locator("li")).toHaveCount(5);

    await page.getByRole("button", { name: "copy all" }).click();
    await expect(page.getByRole("button", { name: "copied" })).toBeVisible();

    const clipboardValue = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardValue.split("\n")).toHaveLength(5);
  });

  test("tabs follow keyboard navigation semantics", async ({ page }) => {
    await page.goto("/");

    const password = page.getByRole("tab", { name: "Password" });
    const passphrase = page.getByRole("tab", { name: "Passphrase" });
    const batch = page.getByRole("tab", { name: "Batch" });

    await password.focus();
    await password.press("ArrowRight");
    await expect(passphrase).toBeFocused();
    await expect(passphrase).toHaveAttribute("aria-selected", "true");

    await passphrase.press("End");
    await expect(batch).toBeFocused();
    await expect(batch).toHaveAttribute("aria-selected", "true");

    await batch.press("Home");
    await expect(password).toBeFocused();
    await expect(password).toHaveAttribute("aria-selected", "true");
  });

  test("interactive controls expose accessible names", async ({ page }) => {
    await page.goto("/");

    for (const mode of ["Password", "Passphrase", "Batch"]) {
      await page.getByRole("tab", { name: mode }).click();

      if (mode === "Password") {
        await page.getByText("Advanced composition rules").click();
      }

      const controls = page.locator(
        "button, input:not([type='hidden']), textarea, select, summary",
      );

      const count = await controls.count();

      for (let index = 0; index < count; index += 1) {
        const control = controls.nth(index);

        if (await control.isVisible()) {
          await expect(control).toHaveAccessibleName(/.+/u);
        }
      }
    }
  });

  test("desktop modes stay within the viewport without page scrolling", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 864 });
    await page.goto("/");

    for (const mode of ["Password", "Passphrase", "Batch"]) {
      await page.getByRole("tab", { name: mode }).click();

      const dimensions = await page.evaluate(() => ({
        viewport: window.innerHeight,
        content: document.documentElement.scrollHeight,
      }));

      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    }
  });

  test("mobile layouts do not overflow horizontally", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    for (const mode of ["Password", "Passphrase", "Batch"]) {
      await page.getByRole("tab", { name: mode }).click();

      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        content: document.documentElement.scrollWidth,
      }));

      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    }
  });
});
