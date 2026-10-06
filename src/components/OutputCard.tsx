import { useState } from "react";

import { SecretField } from "./SecretField";
import styles from "./OutputCard.module.css";

interface OutputCardProps {
  label: string;
  value: string;
  error?: string | null;
  onRegenerate: () => void;
}

export function OutputCard({
  label,
  value,
  error,
  onRegenerate,
}: OutputCardProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  async function copy() {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1400);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  return (
    <section className={styles.card} aria-live="polite">
      <div className={styles.labelRow}>
        <span>{label}</span>
        <button
          type="button"
          onClick={onRegenerate}
          className={styles.regenerate}
        >
          Regenerate
        </button>
      </div>

      <div className={styles.resultRow}>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : (
          <SecretField label={label} value={value} />
        )}

        <button
          type="button"
          onClick={copy}
          className={styles.copy}
          disabled={!value}
          aria-live="polite"
        >
          {copyState === "copied"
            ? "Copied"
            : copyState === "failed"
              ? "Copy failed"
              : "Copy"}
        </button>
      </div>
    </section>
  );
}
