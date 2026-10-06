import { useState } from "react";

import { Toggle } from "../../components/Toggle";
import { DEFAULT_PASSWORD_OPTIONS } from "../../config/password";
import { createPasswordBatch } from "../../services/passwordCore";
import type { PasswordGenerationOptions } from "../../types/password";
import form from "../../styles/forms.module.css";
import styles from "./BatchGenerator.module.css";

export function BatchGenerator() {
  const [count, setCount] = useState(10);
  const [options, setOptions] = useState<PasswordGenerationOptions>(
    DEFAULT_PASSWORD_OPTIONS,
  );
  const [values, setValues] = useState<readonly string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function generate() {
    try {
      setValues(createPasswordBatch(count, options));
      setError(null);
    } catch (generationError) {
      setValues([]);
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Batch generation failed.",
      );
    }
  }

  async function copyAll() {
    if (values.length === 0) {
      return;
    }

    try {
      await navigator.clipboard.writeText(values.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={form.toolGrid}>
      <div className={form.primary}>
        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>Batch settings</h2>
            <p className={form.panelHint}>
              Generate multiple independent results. Duplicate outputs are
              preserved by design.
            </p>
          </div>

          <div className={styles.row}>
            <label className={form.field}>
              <span className={form.fieldLabel}>Count</span>
              <input
                className={form.input}
                type="number"
                min="1"
                max="10000"
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
              />
            </label>
            <label className={form.field}>
              <span className={form.fieldLabel}>Length</span>
              <input
                className={form.input}
                type="number"
                min="1"
                max="4096"
                value={options.length}
                onChange={(event) =>
                  setOptions((current) => ({
                    ...current,
                    length: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>

          <div className={form.field}>
            <div className={form.toggleGrid}>
              <Toggle
                label="Lowercase"
                checked={options.lowercase}
                onChange={(value) =>
                  setOptions((current) => ({
                    ...current,
                    lowercase: value,
                  }))
                }
              />
              <Toggle
                label="Uppercase"
                checked={options.uppercase}
                onChange={(value) =>
                  setOptions((current) => ({
                    ...current,
                    uppercase: value,
                  }))
                }
              />
              <Toggle
                label="Numbers"
                checked={options.digits}
                onChange={(value) =>
                  setOptions((current) => ({ ...current, digits: value }))
                }
              />
              <Toggle
                label="Symbols"
                checked={options.symbols}
                onChange={(value) =>
                  setOptions((current) => ({ ...current, symbols: value }))
                }
              />
            </div>
          </div>

          <div className={form.field}>
            <button className={form.primaryButton} type="button" onClick={generate}>
              Generate batch
            </button>
          </div>
        </section>

        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.resultsTitle}>Results</span>
              <span className={styles.resultsCount}>{values.length}</span>
            </div>
            <button
              type="button"
              className={styles.copyAll}
              onClick={() => void copyAll()}
              disabled={values.length === 0}
            >
              {copied ? "Copied" : "Copy all"}
            </button>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          {values.length === 0 && !error ? (
            <p className={styles.empty}>No batch generated yet.</p>
          ) : (
            <ol className={styles.list}>
              {values.map((value, index) => (
                <li key={`${index}-${value}`}>
                  <span>{index + 1}</span>
                  <code>{value}</code>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <aside className={form.sidebar}>
        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>Isolation</h2>
          </div>
          <p className={form.note}>
            The core assigns an independent random-source object to each result
            and does not deduplicate generated values.
          </p>
        </section>
      </aside>
    </div>
  );
}
