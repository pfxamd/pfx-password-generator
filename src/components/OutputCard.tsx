import { useState } from "react";

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
      <div className={styles.header}>
        <span>{label}</span>
        <div className={styles.actions}>
          <button type="button" onClick={onRegenerate} className={styles.action}>
            Regenerate
          </button>
          <button
            type="button"
            onClick={copy}
            className={styles.copy}
            disabled={!value}
          >
            {copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Copy failed"
                : "Copy"}
          </button>
        </div>
      </div>

      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <output className={styles.value} data-testid="secret-output">
          {value}
        </output>
      )}
    </section>
  );
}
