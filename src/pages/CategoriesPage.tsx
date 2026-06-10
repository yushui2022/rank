import { categorySummaries, tracks } from "../data/rankingData";

export function CategoriesPage() {
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

      <section className="category-grid">
        {categorySummaries.map((category) => {
          const categoryTracks = tracks.filter((track) => track.folder === category.name);
          return (
            <article key={category.id} className="category-card">
              <div className="category-card-head">
                <span>{category.domainId.toUpperCase()}</span>
                <strong>{category.name}</strong>
              </div>
              <p>{category.description}</p>
              <div className="metric-row">
                <span>{category.trackCount} workbooks</span>
                <span>{category.companyCount} entities</span>
                <span>{category.sourceCount} sources</span>
              </div>
              <div className="mini-track-list">
                {categoryTracks.slice(0, 6).map((track) => (
                  <span key={track.id}>{track.name}</span>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
