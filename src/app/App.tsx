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
      <header className={styles.header}>
        <a
          className={styles.brand}
          href="/"
          aria-label="PFx Password Generator"
        >
          <span className={styles.brandMark}>PFx</span>
          <span>Password Generator</span>
        </a>

        <div className={styles.localBadge}>
          <span className={styles.localDot} aria-hidden="true" />
          Local only
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.intro} aria-labelledby="page-title">
          <p className={styles.eyebrow}>Secure generation toolkit</p>
          <h1 id="page-title">
            Generate secrets without sending them anywhere.
          </h1>
          <p className={styles.lead}>
            Passwords and passphrases are generated in this browser with Web
            Crypto through pfx-password-core.
          </p>
        </section>

        <ToolTabs value={mode} onChange={setMode} />

        <div className={styles.toolStage}>
          {mode === "password" ? <PasswordGenerator /> : null}
          {mode === "passphrase" ? <PassphraseGenerator /> : null}
          {mode === "batch" ? <BatchGenerator /> : null}
        </div>
      </main>

      <footer className={styles.footer}>
        <span>pfx-password-core v0.1.1</span>
        <span>No accounts · No telemetry · No secret storage</span>
      </footer>
    </div>
  );
}
