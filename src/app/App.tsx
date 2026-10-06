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
          Local only
        </span>
      </header>

      <main className={styles.workspace}>
        <section className={styles.showcase} aria-labelledby="page-title">
          <div>
            <p className={styles.kicker}>Private by design</p>
            <h1 id="page-title">Password Generator</h1>
            <p className={styles.lead}>
              Create strong random passwords in your browser. Nothing is sent
              anywhere.
            </p>
          </div>

          <div className={styles.visual} aria-hidden="true">
            <div className={styles.orbit} />
            <span className={styles.token + " " + styles.tokenA}>A</span>
            <span className={styles.token + " " + styles.tokenB}>7</span>
            <span className={styles.token + " " + styles.tokenC}>#</span>
            <span className={styles.token + " " + styles.tokenD}>a</span>
            <span className={styles.spark + " " + styles.sparkOne} />
            <span className={styles.spark + " " + styles.sparkTwo} />
            <div className={styles.shield}>
              <span className={styles.lockShackle} />
              <span className={styles.lockBody}>
                <span />
              </span>
            </div>
          </div>
        </section>

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
      </main>

      <footer className={styles.footer}>
        <span>pfx-password-core v0.1.1</span>
        <span>No accounts · No telemetry · No secret storage</span>
      </footer>
    </div>
  );
}
