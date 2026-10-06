import styles from "./TopBar.module.css";

export function TopBar() {
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

      <span className={styles.localBadge}>
        <span aria-hidden="true" />
        Local only
      </span>
    </header>
  );
}
