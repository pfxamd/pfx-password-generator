import { describe, expect, it } from "vitest";

import { DEFAULT_PASSPHRASE_OPTIONS } from "../config/passphrase";
import {
  createPassphraseSnapshot,
  parseWordlist,
} from "./passphraseCore";

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

  it("accepts the maximum supported passphrase word count", () => {
    const snapshot = createPassphraseSnapshot(["alpha", "bravo"], {
      ...DEFAULT_PASSPHRASE_OPTIONS,
      wordCount: 4_096,
    });

    expect(snapshot.value.split("-")).toHaveLength(4_096);
  });

  it("rejects passphrase word counts above the safety limit", () => {
    expect(() =>
      createPassphraseSnapshot(["alpha", "bravo"], {
        ...DEFAULT_PASSPHRASE_OPTIONS,
        wordCount: 4_097,
      }),
    ).toThrow(/between 1 and 4096/u);
  });

  it("rejects an empty separator", () => {
    expect(() =>
      createPassphraseSnapshot(["alpha", "bravo"], {
        ...DEFAULT_PASSPHRASE_OPTIONS,
        separator: "",
      }),
    ).toThrow(/separator must not be empty/u);
  });
});
