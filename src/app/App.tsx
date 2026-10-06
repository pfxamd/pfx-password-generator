import { ShowcaseSection } from "../components/ShowcaseSection";
import { ToolPanel } from "../components/ToolPanel";
import styles from "./App.module.css";

export function App() {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <a
          className={styles.brand}
          href={import.meta.env.BASE_URL}
          aria-label="PFx Password Lab Beta 0.1"
        >
          <img
            className={styles.brandLogo}
            src={import.meta.env.BASE_URL + "pfx-logo.svg"}
            alt=""
            aria-hidden="true"
          />
          <span className={styles.brandIdentity}>
            <span className={styles.brandName}>PFx Password Lab</span>
            <span className={styles.betaBadge}>Beta 0.1</span>
          </span>
        </a>

        <span className={styles.localBadge}>
          <span aria-hidden="true" />
          Local only
        </span>
      </header>

      <main className={styles.workspace}>
        <ShowcaseSection />
        <ToolPanel />
      </main>

      <footer className={styles.footer}>
        <span>pfx-password-core v0.1.1</span>
        <span>No accounts · No telemetry · No secret storage</span>
      </footer>
    </div>
  );
}
