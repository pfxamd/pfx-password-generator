import { useMemo, useRef, useState } from "react";

import { MetricCard } from "../../components/MetricCard";
import { OutputCard } from "../../components/OutputCard";
import { Toggle } from "../../components/Toggle";
import { DEFAULT_PASSWORD_OPTIONS } from "../../config/password";
import { usePasswordGenerator } from "../../hooks/usePasswordGenerator";
import type { PasswordGenerationOptions } from "../../types/password";
import { formatBits, formatCombinations } from "../../utils/format";
import form from "../../styles/forms.module.css";

type BooleanOption = "lowercase" | "uppercase" | "digits" | "symbols";

export function PasswordGenerator() {
  const advancedDialog = useRef<HTMLDialogElement>(null);
  const [options, setOptions] = useState<PasswordGenerationOptions>(
    DEFAULT_PASSWORD_OPTIONS,
  );

  const stableOptions = useMemo(() => options, [options]);
  const { snapshot, error, regenerate } = usePasswordGenerator(stableOptions);

  function setBoolean(key: BooleanOption | "excludeAmbiguous", value: boolean) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  function setNumber(
    key:
      "length" | "minLowercase" | "minUppercase" | "minDigits" | "minSymbols",
    value: number,
  ) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <OutputCard
        label="Generated password"
        value={snapshot?.value ?? ""}
        error={error}
        onRegenerate={regenerate}
      />

      <aside className={form.resultDetails} aria-label="Generation details">
        <div className={form.metricGrid}>
          <MetricCard
            label="Generation entropy"
            value={snapshot ? `${formatBits(snapshot.entropy.bits)} bits` : "—"}
          />
          <MetricCard
            label="Search space"
            value={
              snapshot ? formatCombinations(snapshot.entropy.combinations) : "—"
            }
          />
        </div>
      </aside>

      <div className={`${form.toolGrid} ${form.passwordGrid}`}>
        <div className={form.primary}>
          <section className={`${form.panel} ${form.passwordControls}`}>
            <div className={form.panelHeader}>
              <h2 className={form.panelTitle}>Customize</h2>
            </div>

            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="password-length">
                <span>Password length</span>
                <span>1–4096</span>
              </label>
              <div className={form.rangeRow}>
                <input
                  className={form.range}
                  type="range"
                  min="4"
                  max="128"
                  value={Math.min(options.length, 128)}
                  aria-label="Password length slider"
                  onChange={(event) =>
                    setNumber("length", Number(event.target.value))
                  }
                />
                <input
                  id="password-length"
                  className={form.input}
                  type="number"
                  min="1"
                  max="4096"
                  value={options.length}
                  aria-label="Password length"
                  onChange={(event) =>
                    setNumber("length", Number(event.target.value))
                  }
                />
              </div>
            </div>

            <div className={form.field}>
              <span className={form.fieldLabel}>Characters</span>
              <div className={form.toggleGrid}>
                <Toggle
                  label="Lowercase"
                  description="a–z"
                  checked={options.lowercase}
                  onChange={(value) => setBoolean("lowercase", value)}
                />
                <Toggle
                  label="Uppercase"
                  description="A–Z"
                  checked={options.uppercase}
                  onChange={(value) => setBoolean("uppercase", value)}
                />
                <Toggle
                  label="Numbers"
                  description="0–9"
                  checked={options.digits}
                  onChange={(value) => setBoolean("digits", value)}
                />
                <Toggle
                  label="Symbols"
                  description="! @ # $ % …"
                  checked={options.symbols}
                  onChange={(value) => setBoolean("symbols", value)}
                />
              </div>
            </div>
          </section>
          <section className={form.exclusionsPanel}>
            <h2 className={form.panelTitle}>Exclusions</h2>
            <div className={form.field}>
              <Toggle
                label="Avoid ambiguous characters"
                description="Removes 0 O 1 l I"
                checked={options.excludeAmbiguous ?? false}
                onChange={(value) => setBoolean("excludeAmbiguous", value)}
              />
            </div>

            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="excluded-characters">
                Exclude specific characters
              </label>
              <input
                id="excluded-characters"
                className={form.input}
                type="text"
                value={options.excludedCharacters ?? ""}
                placeholder={"Example: {}[]\"'"}
                onChange={(event) =>
                  setOptions((current) => ({
                    ...current,
                    excludedCharacters: event.target.value,
                  }))
                }
              />
            </div>

            <button
              type="button"
              className={form.advancedButton}
              onClick={() => advancedDialog.current?.showModal()}
            >
              Advanced composition rules
            </button>
            <dialog
              ref={advancedDialog}
              className={form.advancedDialog}
              aria-labelledby="advanced-title"
            >
              <div className={form.dialogHeader}>
                <h2 id="advanced-title" className={form.panelTitle}>
                  Composition rules
                </h2>
                <button
                  type="button"
                  className={form.advancedButton}
                  onClick={() => advancedDialog.current?.close()}
                >
                  Done
                </button>
              </div>
              <div className={form.minimumGrid}>
                {[
                  ["minLowercase", "Lowercase minimum", options.lowercase],
                  ["minUppercase", "Uppercase minimum", options.uppercase],
                  ["minDigits", "Number minimum", options.digits],
                  ["minSymbols", "Symbol minimum", options.symbols],
                ].map(([key, label, enabled]) => (
                  <label className={form.field} key={String(key)}>
                    <span className={form.fieldLabel}>{String(label)}</span>
                    <input
                      className={form.input}
                      type="number"
                      aria-label={String(label)}
                      min="0"
                      max={options.length}
                      disabled={!enabled}
                      value={
                        options[
                          key as
                            | "minLowercase"
                            | "minUppercase"
                            | "minDigits"
                            | "minSymbols"
                        ] ?? 0
                      }
                      onChange={(event) =>
                        setNumber(
                          key as
                            | "minLowercase"
                            | "minUppercase"
                            | "minDigits"
                            | "minSymbols",
                          Number(event.target.value),
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </dialog>
          </section>
        </div>
      </div>
    </>
  );
}
