import {
  analyzePasswordGenerationEntropy,
  generatePassword,
  generatePasswordBatch,
} from "pfx-password-core";

import type {
  GenerationEntropy,
  PasswordGenerationOptions,
} from "../types/password";

export interface PasswordSnapshot {
  value: string;
  entropy: GenerationEntropy;
}

export function createPasswordSnapshot(
  options: PasswordGenerationOptions,
): PasswordSnapshot {
  return {
    value: generatePassword(options),
    entropy: analyzePasswordGenerationEntropy(options),
  };
}

export function createPasswordBatch(
  count: number,
  options: PasswordGenerationOptions,
): readonly string[] {
  return generatePasswordBatch(count, options);
}
