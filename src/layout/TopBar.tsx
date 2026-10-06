import { ToolTabs } from "../components/ToolTabs";
import { useGeneratorMode } from "../features/generator-mode/GeneratorModeContext";
import styles from "./TopBar.module.css";

export function TopBar() {
  const { mode, setMode } = useGeneratorMode();

  return (
    <header className={styles.topBar} data-testid="top-bar">
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

      <nav className={styles.modeNavigation} aria-label="Generator modes">
        <ToolTabs value={mode} onChange={setMode} />
      </nav>

      <span className={styles.localBadge}>
        <span aria-hidden="true" />
        Local only
      </span>
    </header>
  );
}
