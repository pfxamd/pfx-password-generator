import { BottomBar } from "./BottomBar";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { TopBar } from "./TopBar";
import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <div className={styles.shell}>
      <TopBar />

      <main className={styles.workspace}>
        <LeftPanel />
        <RightPanel />
      </main>

      <BottomBar />
    </div>
  );
}
