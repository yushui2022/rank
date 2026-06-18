import type {
  Entity,
  FilterState,
  LeaderboardViewId,
  RankingRow,
  Source,
  Track,
} from "../types/rankings";
import type {
  CompanyDetailRecord,
  RankingRecord,
  ScoredRecord,
  SortDirection,
  SortKey,
  TrackDataset,
} from "../types/rankingRuntime";

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

export const recordsForDataset = (
  dataset: TrackDataset,
  activeView: LeaderboardViewId,
  filters: FilterState,
  sortKey: SortKey,
  sortDirection: SortDirection,
): ScoredRecord[] => {
  const query = filters.query.trim().toLowerCase();
  const entityById = new Map(dataset.entities.map((entity) => [entity.id, entity]));

  return dataset.rankings
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

export const recordForEntityInDataset = (
  dataset: TrackDataset,
  track: Track,
  entityId: string,
): CompanyDetailRecord | null => {
  const entityById = new Map(dataset.entities.map((entity) => [entity.id, entity]));
  const entity = entityById.get(entityId);
  if (!entity) return null;

  const row = dataset.rankings.find(
    (ranking) => ranking.entityId === entityId && ranking.trackId === track.id,
  );
  if (!row) return null;

  return {
    row,
    entity,
    track,
    viewScore: Math.round(row.score),
  };
};

export const sourcesForRecord = (
  dataset: TrackDataset,
  row: RankingRow,
  entity: Entity,
): Source[] => {
  const sourceById = new Map(dataset.sources.map((source) => [source.id, source]));
  const sourceIds = [...row.sourceIds, ...entity.sourceIds];
  const uniqueIds = Array.from(new Set(sourceIds));

  return uniqueIds
    .map((sourceId) => sourceById.get(sourceId))
    .filter((source): source is Source => Boolean(source));
};

export const peerRecordsForDataset = (
  dataset: TrackDataset,
  entityId: string,
): ScoredRecord[] => {
  const records = recordsForDataset(
    dataset,
    "top",
    {
      query: "",
      region: "All",
      stage: "All",
      entityType: "All",
    },
    "view",
    "desc",
  );
  const activeIndex = records.findIndex((record) => record.entity.id === entityId);

  if (activeIndex < 0) return records.slice(0, 4);

  return records
    .slice(Math.max(0, activeIndex - 2), activeIndex + 3)
    .filter((record) => record.entity.id !== entityId)
    .slice(0, 4);
};
