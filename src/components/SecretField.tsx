import { useId, useLayoutEffect, useRef, useState } from "react";

import styles from "./SecretField.module.css";

interface SecretFieldProps {
  label: string;
  value: string;
}

export function SecretField({ label, value }: SecretFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const previewId = `secret-preview-${useId().replaceAll(":", "")}`;

  useLayoutEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    const measure = () => {
      const overflowing = input.scrollWidth > input.clientWidth + 1;
      setIsOverflowing(overflowing);

      if (!overflowing) {
        const preview = previewRef.current;

        if (
          preview &&
          typeof preview.hidePopover === "function" &&
          preview.matches(":popover-open")
        ) {
          preview.hidePopover();
        }
      }
    };

    input.scrollLeft = 0;
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(input);

    return () => observer.disconnect();
  }, [value]);

  async function copyFullValue() {
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
    <div className={styles.shell} data-overflowing={isOverflowing}>
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

      {isOverflowing ? (
        <button
          type="button"
          className={styles.viewButton}
          popoverTarget={previewId}
          popoverTargetAction="toggle"
          aria-label={`View full ${label.toLowerCase()}`}
          data-testid="secret-preview-trigger"
        >
          View all
        </button>
      ) : null}

      <div
        ref={previewRef}
        id={previewId}
        className={styles.preview}
        popover="auto"
        role="dialog"
        aria-label={`Full ${label.toLowerCase()}`}
        data-testid="secret-preview"
      >
        <div className={styles.previewHeader}>
          <div>
            <span className={styles.previewLabel}>Full value</span>
            <span className={styles.previewCount}>
              {value.length} {value.length === 1 ? "character" : "characters"}
            </span>
          </div>

          <button
            type="button"
            className={styles.previewCopy}
            onClick={() => void copyFullValue()}
            aria-live="polite"
          >
            {copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Copy failed"
                : "Copy"}
          </button>
        </div>

        <code
          className={styles.previewValue}
          data-testid="secret-preview-value"
        >
          {value}
        </code>
      </div>
    </div>
  );
}
