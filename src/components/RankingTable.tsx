import type { Entity, RankingRow } from "../types/rankings";
import { formatSignedNumber } from "../utils/displayText";

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
        <p>{records.length} listed / live composite</p>
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
                  Momentum{sortSuffix(sortKey === "momentum", sortDirection)}
                </button>
              </th>
              <th>Actions</th>
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
                        <em>
                          {entity.country} / {entity.entityType}
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
                  <td className="proxy-cell">{row.sentiment}/100</td>
                  <td className="momentum-cell">{row.momentum}</td>
                  <td>
                    <div className="row-actions" onClick={(e) => e.stopPropagation()}>
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
