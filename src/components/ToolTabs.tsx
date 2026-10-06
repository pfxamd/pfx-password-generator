import styles from "./ToolTabs.module.css";

export type ToolMode = "password" | "passphrase" | "batch";

interface ToolTabsProps {
  value: ToolMode;
  onChange: (value: ToolMode) => void;
}

const modes: ReadonlyArray<{ value: ToolMode; label: string }> = [
  { value: "password", label: "Password" },
  { value: "passphrase", label: "Passphrase" },
  { value: "batch", label: "Batch" },
];

export function ToolTabs({ value, onChange }: ToolTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Generator mode">
      {modes.map((mode) => (
        <button
          key={mode.value}
          className={styles.tab}
          data-active={value === mode.value}
          type="button"
          role="tab"
          aria-selected={value === mode.value}
          onClick={() => onChange(mode.value)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
