import { useLayoutEffect, useRef } from "react";

import styles from "./SecretField.module.css";

interface SecretFieldProps {
  label: string;
  value: string;
}

export function SecretField({ label, value }: SecretFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = 0;
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      className={styles.field}
      type="text"
      value={value}
      readOnly
      spellCheck={false}
      autoComplete="off"
      autoCapitalize="off"
      dir="ltr"
      aria-label={label}
      data-testid="secret-output"
    />
  );
}
