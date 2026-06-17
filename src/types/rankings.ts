export type DomainId = string;

export type EntityType =
  | "company"
  | "model"
  | "product"
  | "robot"
  | "infrastructure"
  | "service";

export type DataStatus = "prototype" | "verified" | "imported";

export type SourceQuality = "high" | "medium" | "proxy";

export type LeaderboardViewId =
  | "top"
  | "trending"
  | "new"
  | "most-visited"
  | "fastest-growing"
  | "most-funded"
  | "open-source"
  | "enterprise-ready"
  | "community-sentiment"
  | "robotics";

export type LeaderboardView = {
  id: LeaderboardViewId;
  label: string;
  description: string;
};

export type Domain = {
  id: DomainId;
  name: string;
  description: string;
  accent: string;
};

export type Track = {
  id: string;
  domainId: DomainId;
  name: string;
  label: string;
  description: string;
  segments: string[];
  folder?: string;
  slug?: string;
  workbookTitle?: string;
  workbookNote?: string;
  workbookPath?: string;
  snapshotDate?: string;
  sourceCount?: number;
  companyCount?: number;
  categoryCn?: string;
};

export type Source = {
  id: string;
  title: string;
  publisher: string;
  type: "official" | "benchmark" | "market-data" | "research" | "community";
  url: string;
  quality: SourceQuality;
  lastChecked: string;
  notes: string;
  trackId?: string;
  trackName?: string;
  folder?: string;
};

export type Entity = {
  id: string;
  name: string;
  logoText: string;
  entityType: EntityType;
  domainId: DomainId;
  trackIds: string[];
  country: string;
  region: string;
  foundedYear: string;
  stage: string;
  tags: string[];
  summary: string;
  website: string;
  sourceIds: string[];
  dataStatus: DataStatus;
};

export type DimensionScore = {
  id: string;
  label: string;
  score: number;
  weight: number;
};

export type RankingRow = {
  entityId: string;
  trackId: string;
  rank: number;
  rank1mChange: number;
  rank3mChange: number;
  score: number;
  scoreChange: number;
  momentum: number;
  category: string;
  trafficProxy: string;
  fundingProxy: string;
  launchDate: string;
  addedDate: string;
  githubSignal: string;
  researchSignal: string;
  patentSignal: string;
  sentiment: number;
  status: string;
  sparkline: number[];
  dimensionScores: DimensionScore[];
  evidenceCount: number;
  evidenceQuality: SourceQuality;
  sourceIds: string[];
  dataStatus: DataStatus;
  analystNote?: string;
  marketPositioning?: string;
  representativeProduct?: string;
  confidence?: string;
};

export type FilterState = {
  query: string;
  region: string;
  stage: string;
  entityType: string;
};

export type CategorySummary = {
  id: string;
  name: string;
  domainId: DomainId;
  trackCount: number;
  companyCount: number;
  sourceCount: number;
  description: string;
};
