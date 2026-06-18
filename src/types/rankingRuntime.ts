import type { Entity, RankingRow, Source, Track } from "./rankings";

export type RankingRecord = {
  row: RankingRow;
  entity: Entity;
};

export type ScoredRecord = RankingRecord & { viewScore: number };

export type TrackRankingDataset = {
  trackId: string;
  rankings: RankingRow[];
};

export type TrackDataset = TrackRankingDataset & {
  entities: Entity[];
  sources: Source[];
};

export type CompanyDetailRecord = ScoredRecord & { track: Track };

export type SortKey = "view" | "1w" | "momentum";
export type SortDirection = "asc" | "desc";
