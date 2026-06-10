import { methodologyByTrack, tracks } from "../data/rankingData";

const proxyRules = [
  "Direct public data is preferred when a company discloses a value.",
  "Third-party benchmark data is used for capability and market-position checks.",
  "Official public data / proxy is allowed when the company discloses signals but not exact comparable metrics.",
  "Low-disclosure proxy must stay labeled and cannot be presented as exact market share, revenue, ARR, retention, or deployment share.",
];

export function MethodologyPage() {
  const highlightedTracks = tracks.slice(0, 8);

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Scoring architecture</span>
          <h1>Methodology</h1>
          <p>
            The frontend exposes how imported Top 10 workbooks score companies:
            dimension judgments are expanded into submetrics, with every row
            carrying data value, source ID, source URL, quality, and notes.
          </p>
        </div>
        <div className="hero-metrics">
          <strong>{tracks.length}</strong>
          <span>methodology sets</span>
        </div>
      </section>

      <section className="methodology-grid">
        <article className="section-panel">
          <div className="panel-title-row">
            <div>
              <span>Proxy discipline</span>
              <h2>Data handling rules</h2>
            </div>
          </div>
          <div className="rule-list">
            {proxyRules.map((rule) => (
              <p key={rule}>{rule}</p>
            ))}
          </div>
        </article>

        <article className="section-panel">
          <div className="panel-title-row">
            <div>
              <span>Workbook schema</span>
              <h2>Required sheets</h2>
            </div>
          </div>
          <div className="sheet-stack">
            <span>Ranking</span>
            <span>Detailed Scoring</span>
            <span>Methodology</span>
            <span>Sources</span>
          </div>
        </article>
      </section>

      <section className="section-panel">
        <div className="panel-title-row">
          <div>
            <span>Imported examples</span>
            <h2>Track methodology excerpts</h2>
          </div>
          <p>First rows from workbook Methodology sheets</p>
        </div>
        <div className="methodology-table">
          {highlightedTracks.map((track) => {
            const rows = methodologyByTrack[track.id] ?? [];
            return (
              <article key={track.id} className="methodology-row">
                <strong>{track.name}</strong>
                <span>{track.folder}</span>
                <p>{rows[0]?.description || track.description}</p>
                <em>{rows[0]?.refreshCycle || "Every refresh"}</em>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
