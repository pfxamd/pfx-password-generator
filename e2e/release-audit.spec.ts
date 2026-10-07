import { expect, test } from "@playwright/test";

test.describe("release audit", () => {
  test("password regeneration, entropy, copy, and privacy work locally", async ({
    context,
    page,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    const output = page.getByTestId("secret-output");
    const before = await output.inputValue();

    await page.getByRole("button", { name: "Regenerate" }).click();

    await expect.poll(async () => output.inputValue()).not.toBe(before);

    const entropyValue = page
      .getByText("Generation entropy", { exact: true })
      .locator("..")
      .locator("strong");
    await expect(entropyValue).toContainText("bits");

    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));

    const copiedValue = await output.inputValue();
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();

    const clipboardValue = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardValue).toBe(copiedValue);

    await page.getByLabel("Password length", { exact: true }).fill("10");
    await expect(output).toHaveValue(/^.{10}$/u);

    const storage = await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    }));

    expect(storage).toEqual({ local: 0, session: 0 });
    expect(requests).toEqual([]);
  });

  test("long passwords use an anchored full-value preview without layout growth", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 864 });
    await page.goto("/");

    const output = page.getByTestId("secret-output");
    const previewTrigger = page.getByTestId("secret-preview-trigger");
    const preview = page.getByTestId("secret-preview");
    const initialHeight = await output.evaluate(
      (element) => element.getBoundingClientRect().height,
    );

    await expect(previewTrigger).toHaveCount(0);

    await page.getByLabel("Password length", { exact: true }).fill("512");
    await expect(output).toHaveValue(/^.{512}$/u);
    await expect(previewTrigger).toBeVisible();

    const geometry = await output.evaluate((element) => ({
      height: element.getBoundingClientRect().height,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));

    expect(geometry.height).toBe(initialHeight);
    expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth);

    const fullValue = await output.inputValue();
    await previewTrigger.click();

    await expect(preview).toBeVisible();
    await expect(
      page.getByText("512 characters", { exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("secret-preview-value")).toHaveText(
      fullValue,
    );

    await page.keyboard.press("Escape");
    await expect(preview).toBeHidden();

    await page.getByLabel("Password length", { exact: true }).fill("20");
    await expect(output).toHaveValue(/^.{20}$/u);
    await expect(previewTrigger).toHaveCount(0);
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
    await page.getByRole("button", { name: "Done", exact: true }).click();

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
    await expect(page.getByTestId("secret-output")).toHaveValue(/-/u);

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
    await expect(results.locator("li")).toHaveCount(4);
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(results.locator("li")).toHaveCount(1);
    await page.getByRole("button", { name: "Previous", exact: true }).click();

    await page.getByRole("button", { name: "copy all" }).click();
    await expect(page.getByRole("button", { name: "copied" })).toBeVisible();

    const clipboardValue = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardValue.split("\n")).toHaveLength(5);
  });

  test("generator mode controls live in the centered top bar", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 864 });
    await page.goto("/");

    const topBar = page.getByTestId("top-bar");
    const tabs = page.getByTestId("generator-mode-tabs");
    const toolPanel = page.getByTestId("tool-panel-container");

    await expect(topBar.getByTestId("generator-mode-tabs")).toHaveCount(1);
    await expect(toolPanel.getByRole("tablist")).toHaveCount(0);

    const tabsBox = await tabs.boundingBox();

    if (!tabsBox) {
      throw new Error("Generator mode navigation geometry is unavailable.");
    }

    const tabsCenter = tabsBox.x + tabsBox.width / 2;
    expect(Math.abs(tabsCenter - 1536 / 2)).toBeLessThanOrEqual(1);

    await page.getByRole("tab", { name: "Batch" }).click();
    await expect(page.getByLabel("count")).toBeVisible();

    await page.getByRole("tab", { name: "Password" }).click();
    await expect(
      page.getByLabel("Password length", { exact: true }),
    ).toBeVisible();
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
      if (mode === "Password")
        await page.getByRole("button", { name: "Done", exact: true }).click();
    }
  });

  test("generated secret field keeps fixed geometry for very long values", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 864 });
    await page.goto("/");

    const output = page.getByTestId("secret-output");
    const initialBox = await output.boundingBox();

    if (!initialBox) {
      throw new Error("Secret field geometry is unavailable.");
    }

    await page.getByLabel("Password length", { exact: true }).fill("4096");

    await expect
      .poll(async () => (await output.inputValue()).length)
      .toBe(4096);

    const longBox = await output.boundingBox();

    if (!longBox) {
      throw new Error("Long secret field geometry is unavailable.");
    }

    expect(Math.abs(longBox.height - initialBox.height)).toBeLessThanOrEqual(1);
    expect(Math.abs(longBox.width - initialBox.width)).toBeLessThanOrEqual(1);

    const overflow = await output.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));

    expect(overflow.scrollHeight).toBeLessThanOrEqual(overflow.clientHeight);
    expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth);
  });

  test("layout regions stay independent when left panel content is removed", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 864 });
    await page.goto("/");

    const topBar = page.getByTestId("top-bar");
    const leftPanel = page.getByTestId("left-panel");
    const rightPanel = page.getByTestId("right-panel");
    const bottomBar = page.getByTestId("bottom-bar");

    await expect(topBar).toBeVisible();
    await expect(leftPanel).toBeVisible();
    await expect(rightPanel).toBeVisible();
    await expect(bottomBar).toBeVisible();

    const before = await rightPanel.boundingBox();

    if (!before) {
      throw new Error("Right panel geometry is unavailable.");
    }

    await leftPanel.evaluate((element) => element.replaceChildren());

    const after = await rightPanel.boundingBox();

    if (!after) {
      throw new Error("Right panel geometry after left reset is unavailable.");
    }

    expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(after.width - before.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(after.height - before.height)).toBeLessThanOrEqual(1);
  });

  test("tool panel container keeps fixed geometry across modes and oversized content", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 864 });
    await page.goto("/");

    const container = page.getByTestId("tool-panel-container");
    const viewport = page.getByTestId("tool-panel-viewport");
    const initialBox = await container.boundingBox();

    if (!initialBox) {
      throw new Error("Tool panel geometry is unavailable.");
    }

    for (const mode of ["Password", "Passphrase", "Batch"]) {
      await page.getByRole("tab", { name: mode }).click();

      const modeBox = await container.boundingBox();

      if (!modeBox) {
        throw new Error(`${mode} tool panel geometry is unavailable.`);
      }

      expect(Math.abs(modeBox.height - initialBox.height)).toBeLessThanOrEqual(
        1,
      );
      expect(Math.abs(modeBox.width - initialBox.width)).toBeLessThanOrEqual(1);
    }

    for (const mode of ["Password", "Passphrase", "Batch"]) {
      await page.getByRole("tab", { name: mode }).click();
      const geometry = await viewport.evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        overflowY: getComputedStyle(element).overflowY,
      }));
      expect(geometry.scrollHeight).toBeLessThanOrEqual(geometry.clientHeight);
      expect(geometry.overflowY).toBe("visible");
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
