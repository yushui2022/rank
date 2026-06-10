import { entities, rankings, tracks } from "../data/rankingData";

const topAppearances = entities
  .map((entity) => {
    const rows = rankings.filter((row) => row.entityId === entity.id);
    const bestRank = Math.min(...rows.map((row) => row.rank));
    const averageScore =
      rows.reduce((sum, row) => sum + row.score, 0) / Math.max(1, rows.length);
    return { entity, rows, bestRank, averageScore };
  })
  .sort((left, right) => {
    if (right.rows.length !== left.rows.length) {
      return right.rows.length - left.rows.length;
    }
    return right.averageScore - left.averageScore;
  });

export function CompaniesPage() {
  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Company index</span>
          <h1>Companies</h1>
          <p>
            A cross-ranking view of the companies, labs, vendors, and platforms
            that appear across imported AI and Robotics Top 10 workbooks.
          </p>
        </div>
        <div className="hero-metrics">
          <strong>{entities.length}</strong>
          <span>unique entities</span>
        </div>
      </section>

      <section className="company-index">
        {topAppearances.slice(0, 30).map(({ entity, rows, bestRank, averageScore }) => (
          <article key={entity.id} className="company-row-card">
            <div className="entity-title">
              <span className="entity-logo">{entity.logoText}</span>
              <div>
                <h2>{entity.name}</h2>
                <p>
                  {entity.country} · {entity.entityType} · {entity.stage}
                </p>
              </div>
            </div>
            <div className="company-score-stack">
              <div>
                <span>Appearances</span>
                <strong>{rows.length}</strong>
              </div>
              <div>
                <span>Best rank</span>
                <strong>#{bestRank}</strong>
              </div>
              <div>
                <span>Avg score</span>
                <strong>{averageScore.toFixed(1)}</strong>
              </div>
            </div>
            <div className="appearance-strip">
              {rows.slice(0, 5).map((row) => {
                const track = tracks.find((item) => item.id === row.trackId);
                return (
                  <span key={`${entity.id}-${row.trackId}`}>
                    #{row.rank} {track?.name ?? row.trackId}
                  </span>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
