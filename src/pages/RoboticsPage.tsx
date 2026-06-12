import { useMemo, useState } from "react";
import { rankings, tracks } from "../data/rankingData";
import { entityById } from "../utils/rankingLogic";

const roboticsTracks = tracks.filter((track) => track.domainId === "robotics");
const roboticsRows = rankings
  .filter((row) => entityById.get(row.entityId)?.domainId === "robotics")
  .sort((left, right) => right.score - left.score);

const roboticsEntityCount = new Set(roboticsRows.map((row) => row.entityId)).size;
const roboticsSourceCount = roboticsTracks.reduce(
  (sum, track) => sum + (track.sourceCount ?? 0),
  0,
);

const trackProfile = (trackId: string) => {
  const track = roboticsTracks.find((item) => item.id === trackId) ?? roboticsTracks[0];
  const rows = rankings
    .filter((row) => row.trackId === track.id)
    .sort((left, right) => left.rank - right.rank);
  const leader = rows.find((row) => row.rank === 1);
  const leaderEntity = leader ? entityById.get(leader.entityId) : null;
  const averageScore = rows.length
    ? rows.reduce((sum, row) => sum + row.score, 0) / rows.length
    : 0;

  return { track, rows, leader, leaderEntity, averageScore };
};

export function RoboticsPage() {
  const [activeTrackId, setActiveTrackId] = useState(roboticsTracks[0]?.id ?? "");
  const activeProfile = useMemo(() => trackProfile(activeTrackId), [activeTrackId]);

  return (
    <main className="page-shell">
      <section className="page-hero robotics-hero">
        <div>
          <span className="eyebrow">First-class domain</span>
          <h1>Robotics</h1>
          <p>
            Robot rankings with leaders, sources, and track coverage.
          </p>
        </div>
        <div className="hero-metrics">
          <strong>{roboticsTracks.length}</strong>
          <span>robotics workbooks</span>
        </div>
      </section>

      <section className="robotics-domain-strip" aria-label="Robotics coverage">
        <div>
          <span>Workbooks</span>
          <strong>{roboticsTracks.length}</strong>
        </div>
        <div>
          <span>Ranked rows</span>
          <strong>{roboticsRows.length}</strong>
        </div>
        <div>
          <span>Entities</span>
          <strong>{roboticsEntityCount}</strong>
        </div>
        <div>
          <span>Sources</span>
          <strong>{roboticsSourceCount}</strong>
        </div>
      </section>

      <section className="robotics-workspace">
        <aside className="robotics-track-list-panel">
          <div className="panel-title-row compact">
            <div>
              <span>Robotics taxonomy</span>
              <h2>Track coverage</h2>
            </div>
            <p>{roboticsTracks.length} imported books</p>
          </div>

          <div className="robotics-track-selector">
            {roboticsTracks.map((track) => {
              const profile = trackProfile(track.id);
              return (
                <button
                  key={track.id}
                  type="button"
                  className={track.id === activeProfile.track.id ? "is-active" : ""}
                  onClick={() => setActiveTrackId(track.id)}
                >
                  <span>{track.name}</span>
                  <strong>{profile.leaderEntity?.name ?? "No leader"}</strong>
                  <em>
                    {profile.rows.length} ranked / {track.sourceCount ?? 0} sources
                  </em>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="robotics-detail-panel">
          <div className="panel-title-row">
            <div>
              <span>{activeProfile.track.folder}</span>
              <h2>{activeProfile.track.name}</h2>
            </div>
            <p>{activeProfile.track.snapshotDate}</p>
          </div>

          <p className="robotics-track-description">
            {activeProfile.track.description}
          </p>

          <div className="robotics-detail-metrics">
            <div>
              <span>Leader</span>
              <strong>{activeProfile.leaderEntity?.name ?? "No leader"}</strong>
            </div>
            <div>
              <span>Average score</span>
              <strong>{activeProfile.averageScore.toFixed(1)}</strong>
            </div>
            <div>
              <span>Source count</span>
              <strong>{activeProfile.track.sourceCount ?? 0}</strong>
            </div>
          </div>

          <div className="robotics-leader-table">
            {activeProfile.rows.map((row) => {
              const entity = entityById.get(row.entityId);
              if (!entity) return null;
              return (
                <div key={`${row.trackId}-${row.entityId}`}>
                  <span>#{row.rank}</span>
                  <strong>{entity.name}</strong>
                  <em>{row.category}</em>
                  <b>{row.score}</b>
                </div>
              );
            })}
          </div>
        </article>
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
