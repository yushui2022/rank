export type TrackSummary = {
  id: string;
  name: string;
  levelLabel: string;
  description: string;
  examples: string[];
};

export type CategorySummary = {
  id: string;
  name: string;
  description: string;
  tracks: TrackSummary[];
};
