import { useState } from "react";

import { BatchGenerator } from "../features/batch/BatchGenerator";
import { PassphraseGenerator } from "../features/passphrase/PassphraseGenerator";
import { PasswordGenerator } from "../features/password/PasswordGenerator";
import { ToolTabs, type ToolMode } from "./ToolTabs";
import styles from "./ToolPanel.module.css";

export function ToolPanel() {
  const [mode, setMode] = useState<ToolMode>("password");

  return (
    <section className={styles.tool} aria-label="Generator">
      <div className={styles.toolHeader}>
        <ToolTabs value={mode} onChange={setMode} />
        <span className={styles.version}>v0.1.0</span>
      </div>

      <div
        className={styles.toolPanel}
        id={"generator-panel-" + mode}
        role="tabpanel"
        aria-labelledby={"generator-tab-" + mode}
        tabIndex={0}
      >
        {mode === "password" ? <PasswordGenerator /> : null}
        {mode === "passphrase" ? <PassphraseGenerator /> : null}
        {mode === "batch" ? <BatchGenerator /> : null}
      </div>
    </section>
  );
}
