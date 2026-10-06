import { describe, expect, it } from "vitest";

import { DEFAULT_PASSPHRASE_OPTIONS } from "../config/passphrase";
import { createPassphraseSnapshot, parseWordlist } from "./passphraseCore";

describe("passphrase core integration", () => {
  it("normalizes a pasted wordlist and ignores duplicates", () => {
    const parsed = parseWordlist("alpha\nbravo\nalpha\ncharlie\n");

    expect(parsed.words).toEqual(["alpha", "bravo", "charlie"]);
    expect(parsed.duplicateCount).toBe(1);
  });

  it("generates a passphrase through pfx-password-core", () => {
    const snapshot = createPassphraseSnapshot(
      ["alpha", "bravo", "charlie", "delta"],
      DEFAULT_PASSPHRASE_OPTIONS,
    );

    expect(snapshot.value.split("-")).toHaveLength(6);
    expect(snapshot.entropy.combinations).toBeGreaterThan(0n);
  });
});
