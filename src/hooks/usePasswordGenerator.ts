import { useCallback, useEffect, useState } from "react";

import {
  createPasswordSnapshot,
  type PasswordSnapshot,
} from "../services/passwordCore";
import type { PasswordGenerationOptions } from "../types/password";

interface GeneratorState {
  snapshot: PasswordSnapshot | null;
  error: string | null;
}

function run(options: PasswordGenerationOptions): GeneratorState {
  try {
    return {
      snapshot: createPasswordSnapshot(options),
      error: null,
    };
  } catch (error) {
    return {
      snapshot: null,
      error: error instanceof Error ? error.message : "Generation failed.",
    };
  }
}

export function usePasswordGenerator(options: PasswordGenerationOptions) {
  const [state, setState] = useState<GeneratorState>(() => run(options));

  const regenerate = useCallback(() => {
    setState(run(options));
  }, [options]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  return { ...state, regenerate };
}
