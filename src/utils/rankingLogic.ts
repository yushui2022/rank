import { entities, rankings } from "../data/rankingData";
import type {
  Entity,
  FilterState,
  LeaderboardViewId,
  RankingRow,
} from "../types/rankings";

export type RankingRecord = {
  row: RankingRow;
  entity: Entity;
};

export type ScoredRecord = RankingRecord & { viewScore: number };

export type SortKey = "view" | "1w" | "momentum";
export type SortDirection = "asc" | "desc";

export const entityById = new Map(entities.map((entity) => [entity.id, entity]));

const clamp100 = (value: number) => Math.max(0, Math.min(100, value));

const changeToScale = (scoreChange: number) =>
  clamp100(50 + scoreChange * 10);

const recencyScale = (addedDate: string) => {
  const parsed = Date.parse(addedDate);
  if (Number.isNaN(parsed)) return 50;
  const ageDays = (Date.now() - parsed) / (1000 * 60 * 60 * 24);
  return clamp100(100 - Math.max(0, ageDays) * (100 / 365));
};

export const scoreForView = (
  record: RankingRecord,
  activeView: LeaderboardViewId,
): number => {
  const { row, entity } = record;
  const boost = (matches: boolean) => clamp100(row.score * (matches ? 1 : 0.85));
  const tagText = entity.tags.join(" ").toLowerCase();

  switch (activeView) {
    case "trending":
      return clamp100(row.momentum * 0.7 + changeToScale(row.scoreChange) * 0.3);
    case "new":
      return clamp100(recencyScale(row.addedDate) * 0.6 + row.momentum * 0.4);
    case "most-visited":
      return clamp100(row.score * 0.6 + row.sentiment * 0.4);
    case "fastest-growing":
      return clamp100(changeToScale(row.scoreChange) * 0.6 + row.momentum * 0.4);
    case "most-funded":
      return boost(
        entity.stage.includes("Public") ||
          entity.stage.includes("scale-up") ||
          entity.stage.includes("large"),
      );
    case "open-source":
      return boost(tagText.includes("open") || tagText.includes("model"));
    case "enterprise-ready":
      return boost(
        tagText.includes("enterprise") ||
          tagText.includes("services") ||
          tagText.includes("governance"),
      );
    case "community-sentiment":
      return clamp100(row.sentiment * 0.7 + row.momentum * 0.3);
    case "robotics":
      return boost(entity.domainId === "robotics");
    case "top":
    default:
      return row.score;
  }
};

const sortValue = (
  record: RankingRecord,
  sortKey: SortKey,
  activeView: LeaderboardViewId,
): number => {
  switch (sortKey) {
    case "1w":
      return record.row.rank1mChange;
    case "momentum":
      return record.row.momentum;
    case "view":
    default:
      return scoreForView(record, activeView);
  }
};

export const compareRecords =
  (sortKey: SortKey, direction: SortDirection, activeView: LeaderboardViewId) =>
  (left: RankingRecord, right: RankingRecord) => {
    const delta =
      sortValue(right, sortKey, activeView) -
      sortValue(left, sortKey, activeView);
    return direction === "desc" ? delta : -delta;
  };

export const recordsForTrack = (
  activeTrackId: string,
  activeView: LeaderboardViewId,
  filters: FilterState,
  sortKey: SortKey,
  sortDirection: SortDirection,
): ScoredRecord[] => {
  const query = filters.query.trim().toLowerCase();

  return rankings
    .filter((row) => row.trackId === activeTrackId)
    .map((row) => {
      const entity = entityById.get(row.entityId);
      if (!entity) return null;
      return { row, entity };
    })
    .filter((record): record is RankingRecord => Boolean(record))
    .filter(({ row, entity }) => {
      const matchesQuery =
        !query ||
        entity.name.toLowerCase().includes(query) ||
        row.category.toLowerCase().includes(query) ||
        entity.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchesRegion =
        filters.region === "All" || entity.region === filters.region;
      const matchesStage =
        filters.stage === "All" || entity.stage === filters.stage;
      const matchesType =
        filters.entityType === "All" || entity.entityType === filters.entityType;

      return matchesQuery && matchesRegion && matchesStage && matchesType;
    })
    .map((record) => ({
      ...record,
      viewScore: Math.round(scoreForView(record, activeView)),
    }))
    .sort(compareRecords(sortKey, sortDirection, activeView));
};

export const rowsForDomain = (domainId: Entity["domainId"]) =>
  rankings.filter((row) => entityById.get(row.entityId)?.domainId === domainId);
