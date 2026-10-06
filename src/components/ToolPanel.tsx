import { BatchGenerator } from "../features/batch/BatchGenerator";
import { useGeneratorMode } from "../features/generator-mode/GeneratorModeContext";
import { PassphraseGenerator } from "../features/passphrase/PassphraseGenerator";
import { PasswordGenerator } from "../features/password/PasswordGenerator";
import styles from "./ToolPanel.module.css";

export function ToolPanel() {
  const { mode } = useGeneratorMode();

  return (
    <section
      className={styles.container}
      aria-label="Generator"
      data-testid="tool-panel-container"
    >
      <div className={styles.header} data-testid="tool-panel-header">
        <span className={styles.version}>v0.1.0</span>
      </div>

      <div
        className={styles.viewport}
        id="generator-panel"
        role="tabpanel"
        aria-labelledby={`generator-tab-${mode}`}
        tabIndex={0}
        data-testid="tool-panel-viewport"
      >
        {mode === "password" ? <PasswordGenerator /> : null}
        {mode === "passphrase" ? <PassphraseGenerator /> : null}
        {mode === "batch" ? <BatchGenerator /> : null}
      </div>
    </section>
  );
}
