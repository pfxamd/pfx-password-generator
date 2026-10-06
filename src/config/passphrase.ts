import type { PassphraseGenerationOptions } from "../types/passphrase";

export const DEFAULT_PASSPHRASE_OPTIONS = {
  wordCount: 6,
  separator: "-",
  capitalize: false,
  includeNumber: false,
  includeSymbol: false,
  symbols: "!@#$%^&*",
} satisfies PassphraseGenerationOptions;
