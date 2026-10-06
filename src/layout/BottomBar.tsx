import styles from "./BottomBar.module.css";

export function BottomBar() {
  return (
    <footer className={styles.bottomBar} data-testid="bottom-bar">
      <span>pfx-password-core v0.1.1</span>
      <span>No accounts · No telemetry · No secret storage</span>
    </footer>
  );
}
