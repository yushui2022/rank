import { useMemo, useState } from "react";
import { categorySummaries, rankings, tracks } from "../data/rankingData";
import type { DomainId } from "../types/rankings";
import { entityById } from "../utils/rankingLogic";

export function CategoriesPage() {
  const [domain, setDomain] = useState<DomainId | "all">("all");

  const visibleCategories = useMemo(
    () =>
      categorySummaries.filter(
        (category) => domain === "all" || category.domainId === domain,
      ),
    [domain],
  );

  const totals = visibleCategories.reduce(
    (memo, category) => ({
      tracks: memo.tracks + category.trackCount,
      entities: memo.entities + category.companyCount,
      sources: memo.sources + category.sourceCount,
    }),
    { tracks: 0, entities: 0, sources: 0 },
  );

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Imported taxonomy</span>
          <h1>Categories</h1>
          <p>
            The product taxonomy is generated from the workbook folders under
            industry_rankings, so the interface follows the actual ranking asset.
          </p>
        </div>
        <div className="hero-metrics">
          <strong>{categorySummaries.length}</strong>
          <span>category groups</span>
        </div>
      </section>

      <section className="category-command">
        <div className="segmented-control">
          {(["all", "ai", "robotics"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={domain === item ? "is-active" : ""}
              onClick={() => setDomain(item)}
            >
              {item === "all" ? "All domains" : item.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="category-total-strip">
          <span>{totals.tracks} workbooks</span>
          <span>{totals.entities} entities</span>
          <span>{totals.sources} sources</span>
        </div>
      </section>

      <section className="category-board">
        {visibleCategories.map((category) => {
          const categoryTracks = tracks.filter(
            (track) => track.folder === category.name,
          );
          const sourceDensity =
            category.trackCount > 0
              ? Math.round(category.sourceCount / category.trackCount)
              : 0;

          return (
            <article key={category.id} className="category-map-row">
              <div className="category-map-head">
                <span>{category.domainId.toUpperCase()}</span>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </div>

              <div className="category-map-metrics">
                <div>
                  <span>Workbooks</span>
                  <strong>{category.trackCount}</strong>
                </div>
                <div>
                  <span>Entities</span>
                  <strong>{category.companyCount}</strong>
                </div>
                <div>
                  <span>Sources / book</span>
                  <strong>{sourceDensity}</strong>
                </div>
              </div>

              <div className="category-track-stack">
                {categoryTracks.map((track) => {
                  const rows = rankings.filter((row) => row.trackId === track.id);
                  const leader = rows.find((row) => row.rank === 1);
                  const leaderEntity = leader ? entityById.get(leader.entityId) : null;
                  return (
                    <div key={track.id} className="category-track-row">
                      <div>
                        <strong>{track.name}</strong>
                        <span>
                          {rows.length} ranked / {track.sourceCount ?? 0} sources
                        </span>
                      </div>
                      <em>
                        {leaderEntity ? `#1 ${leaderEntity.name}` : "No leader"}
                      </em>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
