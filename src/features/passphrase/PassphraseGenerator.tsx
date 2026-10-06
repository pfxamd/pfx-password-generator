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
          label="Generated passphrase"
          value={snapshot?.value ?? ""}
          error={error}
          onRegenerate={regenerate}
        />

        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>Wordlist</h2>
            <p className={form.panelHint}>
              Paste one word per line or load a plain-text file. Nothing is
              uploaded.
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
              Load text file
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
            <h2 className={form.panelTitle}>Passphrase settings</h2>
          </div>

          <div className={form.field}>
            <label className={form.fieldLabel} htmlFor="word-count">
              Word count
            </label>
            <input
              id="word-count"
              className={form.input}
              type="number"
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
          </div>

          <div className={form.field}>
            <label className={form.fieldLabel} htmlFor="separator">
              Separator
            </label>
            <input
              id="separator"
              className={form.input}
              type="text"
              value={options.separator}
              onChange={(event) =>
                setOptions((current) => ({
                  ...current,
                  separator: event.target.value,
                }))
              }
            />
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

      <aside className={form.sidebar}>
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

        <section className={form.panel}>
          <div className={form.panelHeader}>
            <h2 className={form.panelTitle}>External wordlist</h2>
          </div>
          <p className={form.note}>
            This app intentionally ships without a bundled wordlist. You choose
            the source and license of the words used for generation.
          </p>
          {parsed.duplicateCount > 0 ? (
            <p className={form.note}>
              {parsed.duplicateCount}{" "}
              {parsed.duplicateCount === 1
                ? "duplicate entry was"
                : "duplicate entries were"}{" "}
              ignored.
            </p>
          ) : null}
        </section>
      </aside>
    </div>
  );
}
