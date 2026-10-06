import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ToolMode = "password" | "passphrase" | "batch";

interface GeneratorModeContextValue {
  mode: ToolMode;
  setMode: (mode: ToolMode) => void;
}

const GeneratorModeContext = createContext<GeneratorModeContextValue | null>(
  null,
);

interface GeneratorModeProviderProps {
  children: ReactNode;
}

export function GeneratorModeProvider({
  children,
}: GeneratorModeProviderProps) {
  const [mode, setMode] = useState<ToolMode>("password");

  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <GeneratorModeContext.Provider value={value}>
      {children}
    </GeneratorModeContext.Provider>
  );
}

export function useGeneratorMode() {
  const context = useContext(GeneratorModeContext);

  if (!context) {
    throw new Error(
      "useGeneratorMode must be used within GeneratorModeProvider.",
    );
  }

  return context;
}
