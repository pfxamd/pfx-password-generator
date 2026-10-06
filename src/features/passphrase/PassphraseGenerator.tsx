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
    <>
      <OutputCard
        label="Generated passphrase"
        value={snapshot?.value ?? ""}
        error={error}
        onRegenerate={regenerate}
      />

      <div className={form.toolGrid}>
        <div className={form.primary}>
          <section className={form.panel}>
            <div className={form.panelHeader}>
              <h2 className={form.panelTitle}>Wordlist</h2>
              <p className={form.panelHint}>
                Paste one word per line or load a local text file.
              </p>
            </div>

            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="wordlist">
                <span>Words</span>
                <span>{parsed.words.length} unique</span>
              </label>
              <textarea
                id="wordlist"
                className={form.textarea}
                value={wordlistText}
                placeholder={"alpha\nbravo\ncharlie\ndelta\necho\nfoxtrot"}
                onChange={(event) => setWordlistText(event.target.value)}
              />
              <label className={form.fieldLabel} htmlFor="wordlist-file">
                Load local text file
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
              <h2 className={form.panelTitle}>Options</h2>
            </div>

            <div className={form.minimumGrid}>
              <label className={form.field}>
                <span className={form.fieldLabel}>Word count</span>
                <input
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
                <span className={form.fieldLabel}>Separator</span>
                <input
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

        <aside className={form.sidebar} aria-label="Passphrase details">
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

          <p className={form.note}>
            Wordlists stay local. The app ships with{" "}
            <span className={form.noteStrong}>no bundled list</span>.
          </p>

          {parsed.duplicateCount > 0 ? (
            <p className={form.note}>
              {parsed.duplicateCount}{" "}
              {parsed.duplicateCount === 1
                ? "duplicate entry ignored"
                : "duplicate entries ignored"}
            </p>
          ) : null}
        </aside>
      </div>
    </>
  );
}
