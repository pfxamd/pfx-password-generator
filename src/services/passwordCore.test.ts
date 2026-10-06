import { describe, expect, it } from "vitest";

import { DEFAULT_PASSWORD_OPTIONS } from "../config/password";
import { createPasswordBatch, createPasswordSnapshot } from "./passwordCore";

describe("password core integration", () => {
  it("generates through pfx-password-core and reports entropy", () => {
    const snapshot = createPasswordSnapshot(DEFAULT_PASSWORD_OPTIONS);

    expect([...snapshot.value]).toHaveLength(20);
    expect(snapshot.entropy.combinations).toBeGreaterThan(0n);
    expect(snapshot.entropy.bits).toBeGreaterThan(0);
  });

  it("accepts the maximum supported password length", () => {
    const snapshot = createPasswordSnapshot({
      ...DEFAULT_PASSWORD_OPTIONS,
      length: 4_096,
    });

    expect([...snapshot.value]).toHaveLength(4_096);
  });

  it("rejects password lengths above the core safety limit", () => {
    expect(() =>
      createPasswordSnapshot({
        ...DEFAULT_PASSWORD_OPTIONS,
        length: 4_097,
      }),
    ).toThrow(/between 1 and 4096/u);
  });

  it("generates a requested batch without deduplicating the result array", () => {
    const result = createPasswordBatch(5, DEFAULT_PASSWORD_OPTIONS);

    expect(result).toHaveLength(5);
    expect(result.every((value) => [...value].length === 20)).toBe(true);
  });

  it("accepts the maximum batch count", () => {
    const result = createPasswordBatch(10_000, {
      ...DEFAULT_PASSWORD_OPTIONS,
      length: 1,
      lowercase: false,
      uppercase: false,
      digits: true,
      symbols: false,
    });

    expect(result).toHaveLength(10_000);
    expect(result.every((value) => /^\d$/u.test(value))).toBe(true);
  });

  it("rejects batch counts above the safety limit", () => {
    expect(() => createPasswordBatch(10_001, DEFAULT_PASSWORD_OPTIONS)).toThrow(
      /between 1 and 10000/u,
    );
  });
});
