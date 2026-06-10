import { rankings, tracks } from "../data/rankingData";
import { entityById } from "../utils/rankingLogic";

const roboticsTracks = tracks.filter((track) => track.domainId === "robotics");
const roboticsRows = rankings
  .filter((row) => entityById.get(row.entityId)?.domainId === "robotics")
  .sort((left, right) => right.score - left.score);

export function RoboticsPage() {
  return (
    <main className="page-shell">
      <section className="page-hero robotics-hero">
        <div>
          <span className="eyebrow">First-class domain</span>
          <h1>Robotics</h1>
          <p>
            Robotics is treated as its own major category, with body types,
            field deployment, service robots, embodied platforms, and support
            services separated from the AI software taxonomy.
          </p>
        </div>
        <div className="hero-metrics">
          <strong>{roboticsTracks.length}</strong>
          <span>robotics workbooks</span>
        </div>
      </section>

      <section className="robotics-map">
        {roboticsTracks.map((track) => {
          const rows = rankings.filter((row) => row.trackId === track.id);
          const leader = rows.find((row) => row.rank === 1);
          const leaderEntity = leader ? entityById.get(leader.entityId) : null;
          return (
            <article key={track.id} className="robotics-track-card">
              <span>{track.categoryCn || track.folder}</span>
              <h2>{track.name}</h2>
              <p>{track.description}</p>
              <div className="metric-row">
                <span>{rows.length} ranked</span>
                <span>{track.sourceCount ?? 0} sources</span>
                <span>{track.snapshotDate}</span>
              </div>
              {leaderEntity && (
                <div className="leader-mini">
                  <b>Leader</b>
                  <strong>{leaderEntity.name}</strong>
                  <em>{leader?.score} score</em>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="section-panel">
        <div className="panel-title-row">
          <div>
            <span>Robotics leaders</span>
            <h2>Highest imported scores</h2>
          </div>
          <p>{roboticsRows.length} robotics ranking rows</p>
        </div>
        <div className="compact-leader-list">
          {roboticsRows.slice(0, 12).map((row) => {
            const entity = entityById.get(row.entityId);
            const track = tracks.find((item) => item.id === row.trackId);
            if (!entity) return null;
            return (
              <div key={`${row.trackId}-${row.entityId}`} className="compact-leader-row">
                <span>#{row.rank}</span>
                <strong>{entity.name}</strong>
                <em>{track?.name}</em>
                <b>{row.score}</b>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
