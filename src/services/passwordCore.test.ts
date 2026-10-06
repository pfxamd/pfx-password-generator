import { describe, expect, it } from "vitest";

import { DEFAULT_PASSWORD_OPTIONS } from "../config/password";
import { createPasswordSnapshot } from "./passwordCore";

describe("password core integration", () => {
  it("generates through pfx-password-core and reports entropy", () => {
    const snapshot = createPasswordSnapshot(DEFAULT_PASSWORD_OPTIONS);

    expect([...snapshot.value]).toHaveLength(20);
    expect(snapshot.entropy.combinations).toBeGreaterThan(0n);
    expect(snapshot.entropy.bits).toBeGreaterThan(0);
  });
});
