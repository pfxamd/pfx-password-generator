import { useMemo, useState } from "react";

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
      | "length"
      | "minLowercase"
      | "minUppercase"
      | "minDigits"
      | "minSymbols",
    value: number,
  ) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className={form.toolGrid}>
      <div className={form.primary}>
        <OutputCard
          label="Generated password"
          value={snapshot?.value ?? ""}
          error={error}
          onRegenerate={regenerate}
        />

        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>Password settings</h2>
            <p className={form.panelHint}>
              Changes regenerate immediately using the same core API.
            </p>
          </div>

          <div className={form.field}>
            <label className={form.fieldLabel} htmlFor="password-length">
              <span>Length</span>
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
                onChange={(event) =>
                  setNumber("length", Number(event.target.value))
                }
              />
            </div>
          </div>

          <div className={form.field}>
            <span className={form.fieldLabel}>Character sets</span>
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
                description="Printable ASCII"
                checked={options.symbols}
                onChange={(value) => setBoolean("symbols", value)}
              />
            </div>
          </div>

          <div className={form.field}>
            <Toggle
              label="Exclude ambiguous characters"
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

          <details className={form.details}>
            <summary className={form.summary}>
              Minimum composition rules
            </summary>
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
          </details>
        </section>
      </div>

      <aside className={form.sidebar}>
        <div className={form.metricGrid}>
          <MetricCard
            label="Generation entropy"
            value={snapshot ? `${formatBits(snapshot.entropy.bits)} bits` : "—"}
            detail="Calculated from the exact generation space."
          />
          <MetricCard
            label="Search space"
            value={
              snapshot ? formatCombinations(snapshot.entropy.combinations) : "—"
            }
            detail="Exact combinations before display formatting."
          />
        </div>

        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>Generation model</h2>
          </div>
          <p className={form.note}>
            <span className={form.noteStrong}>Web Crypto</span> provides the
            random source. Minimum rules are sampled uniformly from the valid
            search space rather than injected and shuffled afterward.
          </p>
        </section>

        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>Privacy</h2>
          </div>
          <p className={form.note}>
            Generated values stay in this tab. The app does not send, save, or
            log secrets.
          </p>
        </section>
      </aside>
    </div>
  );
}
