import { useCallback, useEffect, useState } from "react";

import {
  createPassphraseSnapshot,
  type PassphraseSnapshot,
} from "../services/passphraseCore";
import type { PassphraseGenerationOptions } from "../types/passphrase";

interface GeneratorState {
  snapshot: PassphraseSnapshot | null;
  error: string | null;
}

function run(
  words: readonly string[],
  options: PassphraseGenerationOptions,
): GeneratorState {
  try {
    return {
      snapshot: createPassphraseSnapshot(words, options),
      error: null,
    };
  } catch (error) {
    return {
      snapshot: null,
      error: error instanceof Error ? error.message : "Generation failed.",
    };
  }
}

export function usePassphraseGenerator(
  words: readonly string[],
  options: PassphraseGenerationOptions,
) {
  const [state, setState] = useState<GeneratorState>(() => run(words, options));

  const regenerate = useCallback(() => {
    setState(run(words, options));
  }, [options, words]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  return { ...state, regenerate };
}
