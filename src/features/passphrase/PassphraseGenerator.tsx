import { useMemo, useState } from "react";

import { MetricCard } from "../../components/MetricCard";
import { OutputCard } from "../../components/OutputCard";
import { Toggle } from "../../components/Toggle";
import { DEFAULT_PASSPHRASE_OPTIONS } from "../../config/passphrase";
import { usePassphraseGenerator } from "../../hooks/usePassphraseGenerator";
import { parseWordlist } from "../../services/passphraseCore";
import type { PassphraseGenerationOptions } from "../../types/passphrase";
import { formatBits, formatCombinations } from "../../utils/format";
import form from "../../styles/forms.module.css";

export function PassphraseGenerator() {
  const [wordlistText, setWordlistText] = useState("");
  const [options, setOptions] = useState<PassphraseGenerationOptions>(
    DEFAULT_PASSPHRASE_OPTIONS,
  );

  const parsed = useMemo(() => parseWordlist(wordlistText), [wordlistText]);
  const stableOptions = useMemo(() => options, [options]);
  const { snapshot, error, regenerate } = usePassphraseGenerator(
    parsed.words,
    stableOptions,
  );

  async function loadFile(file: File | undefined) {
    if (!file) {
      return;
    }

    setWordlistText(await file.text());
  }

  return (
    <div className={form.toolGrid}>
      <div className={form.primary}>
        <OutputCard
          label="passphrase"
          value={snapshot?.value ?? ""}
          error={error}
          onRegenerate={regenerate}
        />

        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>wordlist</h2>
            <p className={form.panelHint}>{parsed.words.length} unique words</p>
          </div>

          <div className={form.field}>
            <label className={form.fieldLabel} htmlFor="wordlist">
              words · one per line
            </label>
            <textarea
              id="wordlist"
              className={form.textarea}
              value={wordlistText}
              placeholder={"alpha\nbravo\ncharlie\ndelta\necho\nfoxtrot"}
              onChange={(event) => setWordlistText(event.target.value)}
            />
            <label className={form.fieldLabel} htmlFor="wordlist-file">
              load local text file
            </label>
            <input
              id="wordlist-file"
              className={form.fileInput}
              type="file"
              accept=".txt,text/plain"
              onChange={(event) => void loadFile(event.target.files?.[0])}
            />
          </div>
        </section>

        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>input</h2>
          </div>

          <div className={form.minimumGrid}>
            <label className={form.field}>
              <span className={form.fieldLabel}>word count</span>
              <input
                id="word-count"
                className={form.input}
                type="number"
                aria-label="Word count"
                min="1"
                max="4096"
                value={options.wordCount}
                onChange={(event) =>
                  setOptions((current) => ({
                    ...current,
                    wordCount: Number(event.target.value),
                  }))
                }
              />
            </label>

            <label className={form.field}>
              <span className={form.fieldLabel}>separator</span>
              <input
                id="separator"
                className={form.input}
                type="text"
                aria-label="Separator"
                value={options.separator}
                onChange={(event) =>
                  setOptions((current) => ({
                    ...current,
                    separator: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <div className={form.field}>
            <div className={form.toggleGrid}>
              <Toggle
                label="Capitalize"
                checked={options.capitalize ?? false}
                onChange={(value) =>
                  setOptions((current) => ({
                    ...current,
                    capitalize: value,
                  }))
                }
              />
              <Toggle
                label="Include number"
                checked={options.includeNumber ?? false}
                onChange={(value) =>
                  setOptions((current) => ({
                    ...current,
                    includeNumber: value,
                  }))
                }
              />
              <Toggle
                label="Include symbol"
                checked={options.includeSymbol ?? false}
                onChange={(value) =>
                  setOptions((current) => ({
                    ...current,
                    includeSymbol: value,
                  }))
                }
              />
            </div>
          </div>
        </section>
      </div>

      <aside className={form.sidebar} aria-label="Passphrase diagnostics">
        <div className={form.metricGrid}>
          <MetricCard
            label="entropy"
            value={snapshot ? `${formatBits(snapshot.entropy.bits)} bits` : "—"}
          />
          <MetricCard
            label="search space"
            value={
              snapshot ? formatCombinations(snapshot.entropy.combinations) : "—"
            }
          />
        </div>

        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>wordlist state</h2>
          </div>
          <p className={form.note}>
            source <span className={form.noteStrong}>local input</span>
            <br />
            bundled list <span className={form.noteStrong}>none</span>
          </p>
          {parsed.duplicateCount > 0 ? (
            <p className={form.note}>
              {parsed.duplicateCount}{" "}
              {parsed.duplicateCount === 1
                ? "duplicate ignored"
                : "duplicates ignored"}
            </p>
          ) : null}
        </section>
      </aside>
    </div>
  );
}
