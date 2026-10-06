import type { KeyboardEvent } from "react";

import styles from "./ToolTabs.module.css";

export type ToolMode = "password" | "passphrase" | "batch";

interface ToolTabsProps {
  value: ToolMode;
  onChange: (value: ToolMode) => void;
}

const modes: readonly { value: ToolMode; label: string }[] = [
  { value: "password", label: "Password" },
  { value: "passphrase", label: "Passphrase" },
  { value: "batch", label: "Batch" },
];

export function ToolTabs({ value, onChange }: ToolTabsProps) {
  function selectAndFocus(nextIndex: number) {
    const next = modes[nextIndex];

    if (!next) {
      return;
    }

    onChange(next.value);

    window.requestAnimationFrame(() => {
      document.getElementById(`generator-tab-${next.value}`)?.focus();
    });
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectAndFocus((index + 1) % modes.length);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectAndFocus((index - 1 + modes.length) % modes.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectAndFocus(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      selectAndFocus(modes.length - 1);
    }
  }

  return (
    <div className={styles.tabs} role="tablist" aria-label="Generator mode">
      {modes.map((mode, index) => (
        <button
          id={`generator-tab-${mode.value}`}
          key={mode.value}
          className={styles.tab}
          data-active={value === mode.value}
          type="button"
          role="tab"
          aria-selected={value === mode.value}
          aria-controls={`generator-panel-${mode.value}`}
          tabIndex={value === mode.value ? 0 : -1}
          onClick={() => onChange(mode.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
