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

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.mesh} />
        <div className={styles.orbit + " " + styles.orbitOuter} />
        <div className={styles.orbit + " " + styles.orbitInner} />

        <span className={styles.glyph + " " + styles.glyphA}>A</span>
        <span className={styles.glyph + " " + styles.glyphB}>7</span>
        <span className={styles.glyph + " " + styles.glyphC}>#</span>
        <span className={styles.glyph + " " + styles.glyphD}>a</span>

        <div className={styles.core}>
          <span className={styles.coreHalo} />
          <span className={styles.corePlate}>
            <img src={import.meta.env.BASE_URL + "pfx-logo.svg"} alt="" />
          </span>
        </div>

        <div className={styles.signal}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className={styles.statusStrip}>
          <span>Web Crypto</span>
          <i />
          <span>Local only</span>
          <i />
          <span>No storage</span>
        </div>
      </div>
    </section>
  );
}
