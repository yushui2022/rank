import { useMemo, useState } from "react";
import { sources } from "../data/rankingData";

const qualityOptions = ["All", "high", "medium", "proxy"] as const;

export function SourcesPage() {
  const [query, setQuery] = useState("");
  const [quality, setQuality] = useState<(typeof qualityOptions)[number]>("All");

  const filteredSources = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sources.filter((source) => {
      const queryMatch =
        !normalized ||
        source.title.toLowerCase().includes(normalized) ||
        source.publisher.toLowerCase().includes(normalized) ||
        source.trackName?.toLowerCase().includes(normalized) ||
        source.folder?.toLowerCase().includes(normalized);
      const qualityMatch = quality === "All" || source.quality === quality;
      return queryMatch && qualityMatch;
    });
  }, [query, quality]);

  const qualityCounts = qualityOptions
    .filter((item) => item !== "All")
    .map((item) => ({
      item,
      count: sources.filter((source) => source.quality === item).length,
    }));

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Source ledger</span>
          <h1>Sources</h1>
          <p>
            Search the imported source ledger. Each source is connected back to
            a workbook track and can support Ranking or Detailed Scoring rows.
          </p>
        </div>
        <div className="hero-metrics">
          <strong>{sources.length}</strong>
          <span>source records</span>
        </div>
      </section>

      <section className="source-quality-strip" aria-label="Source quality summary">
        {qualityCounts.map((item) => (
          <button
            key={item.item}
            type="button"
            className={quality === item.item ? "is-active" : ""}
            onClick={() => setQuality(item.item)}
          >
            <span>{item.item}</span>
            <strong>{item.count}</strong>
          </button>
        ))}
      </section>

      <section className="source-controls">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search publisher, title, track, or category"
        />
        <select
          value={quality}
          onChange={(event) =>
            setQuality(event.target.value as (typeof qualityOptions)[number])
          }
        >
          {qualityOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>

      <section className="source-ledger-page">
        {filteredSources.slice(0, 120).map((source) => (
          <article key={source.id} className="source-row">
            <div>
              <span>{source.quality}</span>
              <strong>{source.title}</strong>
              <p>
                {source.type} / checked {source.lastChecked}
              </p>
            </div>
            <div>
              <span>{source.publisher}</span>
              <em>
                {source.folder} / {source.trackName}
              </em>
            </div>
            <a href={source.url} target="_blank" rel="noreferrer">
              Open source
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
