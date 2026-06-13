import type { Entity, RankingRow } from "../types/rankings";
import { formatSignedNumber } from "../utils/displayText";
import { CommunitySentimentVote } from "./CommunitySentimentVote";
import { RegionBadge } from "./RegionBadge";

type RankingRecord = {
  row: RankingRow;
  entity: Entity;
  viewScore: number;
};

type SortKey = "view" | "1m" | "3m" | "momentum";
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

const sortSuffix = (active: boolean, direction: SortDirection): string =>
  active ? (direction === "desc" ? " desc" : " asc") : "";

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
        <div className="market-insight">
          <strong>Market Insight:</strong> AI and Fintech sectors are driving positive momentum this month.
        </div>
        <p>{records.length} listed / live composite</p>
      </div>

      <div className="table-wrap">
        <table className="ranking-table zebra-striped">
          <thead>
            <tr>
              <th className="rank-cell">
                <button
                  type="button"
                  className="sort-header"
                  aria-sort={
                    sortKey === "view"
                      ? sortDirection === "desc"
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                  onClick={() => onSort("view")}
                >
                  Rank{sortSuffix(sortKey === "view", sortDirection)}
                </button>
              </th>
              <th>Entity</th>
              <th>
                <button
                  type="button"
                  className="sort-header"
                  aria-sort={
                    sortKey === "1m"
                      ? sortDirection === "desc"
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                  onClick={() => onSort("1m")}
                >
                  1M Change{sortSuffix(sortKey === "1m", sortDirection)}
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="sort-header"
                  aria-sort={
                    sortKey === "3m"
                      ? sortDirection === "desc"
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                  onClick={() => onSort("3m")}
                >
                  3M Change{sortSuffix(sortKey === "3m", sortDirection)}
                </button>
              </th>
              <th>Category</th>
              <th style={{ width: "160px" }}>Sentiment</th>
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
                  Momentum{sortSuffix(sortKey === "momentum", sortDirection)}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr className="empty-row">
                <td colSpan={8}>
                  No matching entities. Adjust filters or reset to see results.
                </td>
              </tr>
            )}
            {records.map(({ row, entity }) => {
              const selected = entity.id === selectedEntityId;
              const momentumPercentage = Math.min(100, Math.max(0, row.momentum * 10));

              return (
                <tr
                  key={`${row.trackId}-${entity.id}`}
                  className={selected ? "is-selected" : ""}
                  onClick={() => onSelectEntity(entity.id)}
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
                    <div className="entity-cell">
                      <span className="entity-logo">{entity.logoText}</span>
                      <span>
                        <strong>{entity.name}</strong>
                        <em className="entity-meta">
                          <RegionBadge countryCode={entity.country} />
                          <span className="meta-separator">/</span> {entity.entityType}
                        </em>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`change-pill ${row.rank1mChange >= 0 ? "positive" : "negative"}`}>
                      {formatSignedNumber(row.rank1mChange)}
                    </span>
                  </td>
                  <td>
                    <span className={`change-pill ${row.rank3mChange >= 0 ? "positive" : "negative"}`}>
                      {formatSignedNumber(row.rank3mChange)}
                    </span>
                  </td>
                  <td className="category-cell">{row.category}</td>
                  <td>
                    <CommunitySentimentVote entityId={entity.id} entityName={entity.name} variant="inline" />
                  </td>
                  <td className="momentum-cell">
                    <div className="momentum-indicator" title={`Momentum: ${row.momentum}`}>
                      <div className="momentum-bar-bg">
                        <div 
                          className={`momentum-bar-fill ${row.momentum >= 7 ? "high" : row.momentum >= 4 ? "medium" : "low"}`}
                          style={{ width: `${momentumPercentage}%` }}
                        />
                      </div>
                      <span className="momentum-value">{row.momentum}</span>
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
