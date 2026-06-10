import type { Entity, RankingRow } from "../types/rankings";
import { Badge } from "./Badge";
import { Sparkline } from "./Sparkline";

type RankingRecord = {
  row: RankingRow;
  entity: Entity;
  viewScore: number;
};

type SortKey = "view" | "score" | "momentum";
type SortDirection = "asc" | "desc";

type RankingTableProps = {
  records: RankingRecord[];
  selectedEntityId: string;
  watchedIds: Set<string>;
  shortlistedIds: Set<string>;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  onSelectEntity: (entityId: string) => void;
  onToggleWatchlist: (entityId: string) => void;
  onToggleShortlist: (entityId: string) => void;
};

const sortArrow = (
  active: boolean,
  direction: SortDirection,
): string => (active ? (direction === "desc" ? " ↓" : " ↑") : "");

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
  sortKey,
  sortDirection,
  onSort,
  onSelectEntity,
  onToggleWatchlist,
  onToggleShortlist,
}: RankingTableProps) {
  return (
    <section className="ranking-panel">
      <div className="panel-title-row">
        <div>
          <span>Leaderboard</span>
          <h2>Ranking index</h2>
        </div>
        <p>{records.length} listed · live composite</p>
      </div>

      <div className="table-wrap">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>
                <button
                  type="button"
                  className="sort-header"
                  aria-sort={
                    sortKey === "score"
                      ? sortDirection === "desc"
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                  onClick={() => onSort("score")}
                >
                  Score{sortArrow(sortKey === "score", sortDirection)}
                </button>
              </th>
              <th>View score</th>
              <th>7d change</th>
              <th>Category</th>
              <th>Evidence</th>
              <th>Confidence</th>
              <th>Workbook</th>
              <th>Sentiment</th>
              <th>
                <button
                  type="button"
                  className="sort-header"
                  aria-sort={
                    sortKey === "momentum"
                      ? sortDirection === "desc"
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                  onClick={() => onSort("momentum")}
                >
                  Momentum{sortArrow(sortKey === "momentum", sortDirection)}
                </button>
              </th>
              <th>Trend</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr className="empty-row">
                <td colSpan={13}>
                  No matching entities. Adjust filters or reset to see results.
                </td>
              </tr>
            )}
            {records.map(({ row, entity, viewScore }) => {
              const trendTone = row.scoreChange >= 0 ? "positive" : "negative";
              const selected = entity.id === selectedEntityId;

              return (
                <tr
                  key={`${row.trackId}-${entity.id}`}
                  className={selected ? "is-selected" : ""}
                >
                  <td className="rank-cell">
                    <div className="rank-wrap">
                      <span
                        className={`rank-badge${row.rank <= 3 ? ` rank-${row.rank}` : ""}`}
                      >
                        {row.rank}
                      </span>
                    </div>
                  </td>
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
                  <td className="score-cell">
                    <div className="score-block">
                      <b>{row.score}</b>
                      <span className="score-meter">
                        <i style={{ width: `${Math.min(100, row.score)}%` }} />
                      </span>
                    </div>
                  </td>
                  <td className="view-score-cell">{viewScore}</td>
                  <td>
                    <span className={`change-pill ${trendTone}`}>
                      {row.scoreChange >= 0 ? "▲" : "▼"}{" "}
                      {Math.abs(row.scoreChange)}
                    </span>
                  </td>
                  <td className="category-cell">{row.category}</td>
                  <td>
                    <div className="evidence-stack">
                      <Badge tone={qualityTone[row.evidenceQuality]}>
                        {row.evidenceQuality}
                      </Badge>
                      <span>{row.evidenceCount} sources</span>
                    </div>
                  </td>
                  <td className="proxy-cell">{row.trafficProxy}</td>
                  <td className="proxy-cell">{row.fundingProxy}</td>
                  <td className="proxy-cell">{row.sentiment}/100</td>
                  <td className="momentum-cell">{row.momentum}</td>
                  <td>
                    <Sparkline points={row.sparkline} tone={trendTone} />
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
