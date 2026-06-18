import type { Entity, RankingRow, Source, Track } from "./rankings";

export type RankingRecord = {
  row: RankingRow;
  entity: Entity;
};

export type ScoredRecord = RankingRecord & { viewScore: number };

export type TrackDataset = {
  trackId: string;
  entities: Entity[];
  rankings: RankingRow[];
  sources: Source[];
};

export type CompanyDetailRecord = ScoredRecord & { track: Track };

export type SortKey = "view" | "1w" | "momentum";
export type SortDirection = "asc" | "desc";
