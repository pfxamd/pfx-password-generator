import { PasswordArtwork } from "../components/PasswordArtwork";
import styles from "./LeftPanel.module.css";

export function LeftPanel() {
  return (
    <section
      className={styles.leftPanel}
      aria-labelledby="page-title"
      data-testid="left-panel"
    >
      <div className={styles.copy}>
        <p className={styles.kicker}>
          <span aria-hidden="true" />
          Private by design
        </p>
        <h1 id="page-title">PFx Password Lab</h1>
        <p className={styles.lead}>
          Generate passwords and passphrases locally with Web Crypto. Nothing
          leaves your browser.
        </p>
      </div>

      <PasswordArtwork />
    </section>
  );
}
