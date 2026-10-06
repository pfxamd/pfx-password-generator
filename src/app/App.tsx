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
          <span className={styles.prompt} aria-hidden="true">
            ~/pfx
          </span>
          <h1>password generator</h1>
        </a>

        <div className={styles.runtime} aria-label="Runtime status">
          <span>
            <i aria-hidden="true" />
            local
          </span>
          <span>web crypto</span>
        </div>
      </header>

      <main className={styles.workspace}>
        <div className={styles.commandbar}>
          <ToolTabs value={mode} onChange={setMode} />
          <span className={styles.version}>app 0.1.0 · core 0.1.1</span>
        </div>

        <div
          className={styles.toolStage}
          id={`generator-panel-${mode}`}
          role="tabpanel"
          aria-labelledby={`generator-tab-${mode}`}
          tabIndex={0}
        >
          {mode === "password" ? <PasswordGenerator /> : null}
          {mode === "passphrase" ? <PassphraseGenerator /> : null}
          {mode === "batch" ? <BatchGenerator /> : null}
        </div>
      </main>

      <footer className={styles.statusbar}>
        <span>client-side only</span>
        <span>no history · no telemetry · no secret storage</span>
      </footer>
    </div>
  );
}
