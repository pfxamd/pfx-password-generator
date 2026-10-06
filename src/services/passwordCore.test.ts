import { describe, expect, it } from "vitest";

import { DEFAULT_PASSWORD_OPTIONS } from "../config/password";
import {
  createPasswordBatch,
  createPasswordSnapshot,
} from "./passwordCore";

describe("password core integration", () => {
  it("generates through pfx-password-core and reports entropy", () => {
    const snapshot = createPasswordSnapshot(DEFAULT_PASSWORD_OPTIONS);

    expect([...snapshot.value]).toHaveLength(20);
    expect(snapshot.entropy.combinations).toBeGreaterThan(0n);
    expect(snapshot.entropy.bits).toBeGreaterThan(0);
  });

  it("generates a requested batch without deduplicating the result array", () => {
    const result = createPasswordBatch(5, DEFAULT_PASSWORD_OPTIONS);

    expect(result).toHaveLength(5);
    expect(result.every((value) => [...value].length === 20)).toBe(true);
  });
});
