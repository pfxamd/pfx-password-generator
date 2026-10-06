import { useCallback, useState } from "react";

import { createPasswordSnapshot } from "../services/passwordCore";
import type { PasswordGenerationOptions } from "../types/password";

export function usePasswordGenerator(options: PasswordGenerationOptions) {
  const [snapshot, setSnapshot] = useState(() =>
    createPasswordSnapshot(options),
  );

  const regenerate = useCallback(() => {
    setSnapshot(createPasswordSnapshot(options));
  }, [options]);

  return { snapshot, regenerate };
}
