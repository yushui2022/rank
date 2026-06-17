import type { Entity, RankingRow } from "../types/rankings";
import { CompanyLogo } from "./CompanyLogo";
import { CommunitySentimentVote } from "./CommunitySentimentVote";
import { RegionBadge } from "./RegionBadge";

type RankingRecord = {
  row: RankingRow;
  entity: Entity;
  viewScore: number;
};

type SortKey = "view" | "1w" | "momentum";
type SortDirection = "asc" | "desc";

type RankingTableProps = {
  records: RankingRecord[];
  selectedEntityId: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  onSelectEntity: (entityId: string) => void;
};

const sortSuffix = (active: boolean, direction: SortDirection): string =>
  active ? (direction === "desc" ? " ↓" : " ↑") : "";

const formatRankChange = (value: number) =>
  value === 0 ? "-" : `${value > 0 ? "+" : ""}${value}`;

const rankChangeTone = (value: number) =>
  value > 0 ? "positive" : value < 0 ? "negative" : "neutral";

export function RankingTable({
  records,
  selectedEntityId,
  sortKey,
  sortDirection,
  onSort,
  onSelectEntity,
}: RankingTableProps) {
  const leftRecords = records.slice(0, 10);
  const rightRecords = records.slice(10, 20);

  const renderSortButton = (key: SortKey, label: string) => (
    <button
      type="button"
      className="sort-header"
      aria-sort={
        sortKey === key
          ? sortDirection === "desc"
            ? "descending"
            : "ascending"
          : "none"
      }
      onClick={() => onSort(key)}
    >
      {label}
      {sortSuffix(sortKey === key, sortDirection)}
    </button>
  );

  const renderRows = (splitRecords: RankingRecord[], emptyMessage: string) => (
    <>
      {splitRecords.length === 0 && (
        <tr className="empty-row">
          <td colSpan={6}>{emptyMessage}</td>
        </tr>
      )}
      {splitRecords.map(({ row, entity }) => {
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
                <CompanyLogo entity={entity} />
                <span className="entity-copy">
                  <strong>{entity.name}</strong>
                </span>
              </div>
            </td>
            <td className="country-cell">
              <RegionBadge countryCode={entity.country} />
            </td>
            <td className="change-cell">
              <span className={`change-pill ${rankChangeTone(row.rank1mChange)}`}>
                {formatRankChange(row.rank1mChange)}
              </span>
            </td>
            <td className="momentum-cell">
              <div className="momentum-indicator" title={`Momentum: ${row.momentum}`}>
                <span className="momentum-value">{row.momentum}</span>
              </div>
            </td>
            <td>
              <CommunitySentimentVote entityId={entity.id} entityName={entity.name} variant="inline" />
            </td>
          </tr>
        );
      })}
    </>
  );

  const renderTable = (
    splitRecords: RankingRecord[],
    title: string,
    range: string,
    emptyMessage: string,
  ) => (
    <div className="ranking-split">
      <div className="split-table-title">
        <strong>{title}</strong>
        <span>{range}</span>
      </div>
      <div className="table-wrap split-table-wrap">
        <table className="ranking-table compact-ranking-table zebra-striped">
          <colgroup>
            <col className="rank-col" />
            <col className="entity-col" />
            <col className="country-col" />
            <col className="change-col" />
            <col className="momentum-col" />
            <col className="sentiment-col" />
          </colgroup>
          <thead>
            <tr>
              <th className="rank-cell">{renderSortButton("view", "Rank")}</th>
              <th>Entity</th>
              <th>Country</th>
              <th>{renderSortButton("1w", "1W")}</th>
              <th>{renderSortButton("momentum", "Momentum")}</th>
              <th>Sentiment</th>
            </tr>
          </thead>
          <tbody>{renderRows(splitRecords, emptyMessage)}</tbody>
        </table>
      </div>
    </div>
  );

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

      <div className="dual-ranking-grid">
        {renderTable(
          leftRecords,
          "Top 1-10",
          "Primary leaders",
          "No matching entities. Adjust filters or reset to see results.",
        )}
        {renderTable(
          rightRecords,
          "Top 11-20",
          "Expanded field",
          records.length > 0
            ? "No entities ranked 11-20 for this filter."
            : "No matching entities. Adjust filters or reset to see results.",
        )}
      </div>
    </section>
  );
}
