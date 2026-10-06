import {
  analyzePassphraseGenerationEntropy,
  generatePassphrase,
} from "pfx-password-core";

import type {
  GenerationEntropy,
  PassphraseGenerationOptions,
  PassphraseWordlist,
} from "../types/passphrase";

export interface PassphraseSnapshot {
  value: string;
  entropy: GenerationEntropy;
}

export interface ParsedWordlist {
  words: readonly string[];
  duplicateCount: number;
}

export function parseWordlist(text: string): ParsedWordlist {
  const cleaned = text
    .split(/\r?\n/u)
    .map((word) => word.trim())
    .filter(Boolean);

  const unique = [...new Set(cleaned)];

  return {
    words: unique,
    duplicateCount: cleaned.length - unique.length,
  };
}

export function createPassphraseSnapshot(
  words: readonly string[],
  options: PassphraseGenerationOptions,
): PassphraseSnapshot {
  if (words.length < 2) {
    throw new Error("Add at least 2 unique words to generate a passphrase.");
  }

  const wordlist: PassphraseWordlist = { words };

  return {
    value: generatePassphrase(wordlist, options),
    entropy: analyzePassphraseGenerationEntropy(wordlist, options),
  };
}
