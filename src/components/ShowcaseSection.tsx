import styles from "./ShowcaseSection.module.css";

export function ShowcaseSection() {
  return (
    <section className={styles.showcase} aria-labelledby="page-title">
      <div>
        <p className={styles.kicker}>Private by design</p>
        <h1 id="page-title">PFx Password Lab</h1>
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
  );
}
