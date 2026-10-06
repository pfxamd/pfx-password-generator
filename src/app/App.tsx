import { GeneratorModeProvider } from "../features/generator-mode/GeneratorModeContext";
import { AppShell } from "../layout/AppShell";

export function App() {
  return (
    <GeneratorModeProvider>
      <AppShell />
    </GeneratorModeProvider>
  );
}
