import { ToolPanel } from "../components/ToolPanel";
import styles from "./RightPanel.module.css";

export function RightPanel() {
  return (
    <section
      className={styles.rightPanel}
      aria-label="Tool area"
      data-testid="right-panel"
    >
      <ToolPanel />
    </section>
  );
}
