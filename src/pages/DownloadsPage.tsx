import { useMemo, useState } from "react";
import { domains, tracks } from "../data/rankingData";
import type { DomainId } from "../types/rankings";

export function DownloadsPage() {
  const [activeDomainId, setActiveDomainId] = useState<DomainId | "all">("all");

  const filteredTracks = useMemo(() => {
    if (activeDomainId === "all") return tracks;
    return tracks.filter(track => track.domainId === activeDomainId);
  }, [activeDomainId]);

  return (
    <main className="page-shell downloads-page">
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Data Export</span>
          <h1>Downloads</h1>
          <p>
            <span>Download imported ranking workbooks and snapshot reports.</span>
            <span>Access the raw data underlying the live index.</span>
          </p>
        </div>
        <div className="hero-metrics">
          <strong>{tracks.length}</strong>
          <span>available reports</span>
        </div>
      </section>

      <section className="news-controls" aria-label="Domain filters">
        <div className="segmented-control">
          <button
            type="button"
            className={activeDomainId === "all" ? "is-active" : ""}
            onClick={() => setActiveDomainId("all")}
          >
            All domains
          </button>
          {domains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              className={activeDomainId === domain.id ? "is-active" : ""}
              onClick={() => setActiveDomainId(domain.id)}
            >
              {domain.name}
            </button>
          ))}
        </div>
      </section>

      <div className="category-board" style={{ marginTop: "24px" }}>
        {filteredTracks.map(track => {
          const domain = domains.find(d => d.id === track.domainId);
          return (
            <div key={track.id} className="category-map-row">
              <div className="category-map-head">
                <span>{domain?.name || track.label}</span>
                <h2>{track.name}</h2>
                <p>{track.workbookTitle || track.description}</p>
                <div style={{ marginTop: "12px" }}>
                  <span className="badge badge-blue">Snapshot: {track.snapshotDate}</span>
                </div>
              </div>
              
              <div className="category-map-metrics">
                <div>
                  <span>Companies</span>
                  <strong>{track.companyCount || 0}</strong>
                </div>
                <div>
                  <span>Sources</span>
                  <strong>{track.sourceCount || 0}</strong>
                </div>
                <div>
                  <span>Format</span>
                  <strong>XLSX</strong>
                </div>
              </div>

              <div className="company-controls" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end", justifyContent: "center", margin: 0, border: 0, padding: 0, boxShadow: "none", background: "transparent" }}>
                <button 
                  type="button" 
                  style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "8px",
                    background: "var(--accent)", 
                    color: "#ffffff", 
                    border: "1px solid var(--accent)", 
                    padding: "10px 16px", 
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#0d4fb0"; e.currentTarget.style.borderColor = "#0d4fb0"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Report
                </button>
                <span style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "var(--mono)" }}>
                  ID: {track.slug}
                </span>
              </div>
            </div>
          );
        })}
        {filteredTracks.length === 0 && (
          <div className="entity-detail-empty" style={{ gridColumn: "1 / -1" }}>
            <strong>No reports available</strong>
            <p>No ranking workbooks were found for the selected domain.</p>
          </div>
        )}
      </div>
    </main>
  );
}