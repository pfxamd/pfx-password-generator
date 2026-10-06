import { useState } from "react";

import { ToolTabs, type ToolMode } from "../components/ToolTabs";
import { BatchGenerator } from "../features/batch/BatchGenerator";
import { PassphraseGenerator } from "../features/passphrase/PassphraseGenerator";
import { PasswordGenerator } from "../features/password/PasswordGenerator";
import styles from "./App.module.css";

export function App() {
  const [mode, setMode] = useState<ToolMode>("password");

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <a
          className={styles.brand}
          href={import.meta.env.BASE_URL}
          aria-label="PFx Password Generator"
        >
          <span className={styles.brandMark}>PFx</span>
          <span className={styles.brandName}>Password Generator</span>
        </a>

        <span className={styles.localBadge}>
          <span aria-hidden="true" />
          Runs locally
        </span>
      </header>

      <main className={styles.workspace}>
        <section className={styles.tool}>
          <div className={styles.toolHeader}>
            <ToolTabs value={mode} onChange={setMode} />
            <span className={styles.version}>v0.1.0</span>
          </div>

          <div
            id={`generator-panel-${mode}`}
            role="tabpanel"
            aria-labelledby={`generator-tab-${mode}`}
            tabIndex={0}
          >
            {mode === "password" ? <PasswordGenerator /> : null}
            {mode === "passphrase" ? <PassphraseGenerator /> : null}
            {mode === "batch" ? <BatchGenerator /> : null}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Powered by pfx-password-core v0.1.1</span>
        <span>No accounts · No telemetry · No secret storage</span>
      </footer>
    </div>
  );
}
