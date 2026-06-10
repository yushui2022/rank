import type { Entity, RankingRow } from "../types/rankings";
import { Badge } from "./Badge";
import { Sparkline } from "./Sparkline";

type RankingRecord = {
  row: RankingRow;
  entity: Entity;
};

type RankingTableProps = {
  records: RankingRecord[];
  selectedEntityId: string;
  watchedIds: Set<string>;
  shortlistedIds: Set<string>;
  onSelectEntity: (entityId: string) => void;
  onToggleWatchlist: (entityId: string) => void;
  onToggleShortlist: (entityId: string) => void;
};

const qualityTone = {
  high: "green",
  medium: "blue",
  proxy: "amber",
} as const;

export function RankingTable({
  records,
  selectedEntityId,
  watchedIds,
  shortlistedIds,
  onSelectEntity,
  onToggleWatchlist,
  onToggleShortlist,
}: RankingTableProps) {
  return (
    <section className="ranking-panel">
      <div className="panel-title-row">
        <div>
          <span>Leaderboard</span>
          <h2>Market ranking table</h2>
        </div>
        <p>{records.length} rows in current view</p>
      </div>

      <div className="table-wrap">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>7d</th>
              <th>Category</th>
              <th>Traffic</th>
              <th>Funding</th>
              <th>Sentiment</th>
              <th>Trend</th>
              <th>Evidence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(({ row, entity }) => {
              const trendTone = row.scoreChange >= 0 ? "positive" : "negative";
              const selected = entity.id === selectedEntityId;

              return (
                <tr
                  key={`${row.trackId}-${entity.id}`}
                  className={selected ? "is-selected" : ""}
                >
                  <td className="rank-cell">#{row.rank}</td>
                  <td>
                    <button
                      type="button"
                      className="entity-cell"
                      onClick={() => onSelectEntity(entity.id)}
                    >
                      <span className="entity-logo">{entity.logoText}</span>
                      <span>
                        <strong>{entity.name}</strong>
                        <em>
                          {entity.country} · {entity.entityType}
                        </em>
                      </span>
                    </button>
                  </td>
                  <td className="score-cell">{row.score}</td>
                  <td>
                    <span className={`change-pill ${trendTone}`}>
                      {row.scoreChange > 0 ? "+" : ""}
                      {row.scoreChange}
                    </span>
                  </td>
                  <td>{row.category}</td>
                  <td>{row.trafficProxy}</td>
                  <td>{row.fundingProxy}</td>
                  <td>{row.sentiment}/100</td>
                  <td>
                    <Sparkline points={row.sparkline} tone={trendTone} />
                  </td>
                  <td>
                    <div className="evidence-stack">
                      <Badge tone={qualityTone[row.evidenceQuality]}>
                        {row.evidenceQuality}
                      </Badge>
                      <span>{row.evidenceCount} sources</span>
                    </div>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className={watchedIds.has(entity.id) ? "is-active" : ""}
                        onClick={() => onToggleWatchlist(entity.id)}
                      >
                        Watch
                      </button>
                      <button
                        type="button"
                        className={shortlistedIds.has(entity.id) ? "is-active" : ""}
                        onClick={() => onToggleShortlist(entity.id)}
                      >
                        Shortlist
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
