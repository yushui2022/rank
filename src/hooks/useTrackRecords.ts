import { useMemo } from "react";
import { readTrackDataset } from "../data/rankingRepository";
import type { FilterState } from "../types/rankings";
import type { ScoredRecord, SortDirection, SortKey } from "../types/rankingRuntime";
import { recordsForDataset } from "../utils/rankingLogic";

export const useTrackRecords = (
  trackId: string,
  filters: FilterState,
  sortKey: SortKey,
  sortDirection: SortDirection,
): ScoredRecord[] => {
  const dataset = readTrackDataset(trackId);

  return useMemo(
    () =>
      recordsForDataset(
        dataset,
        "top",
        filters,
        sortKey,
        sortDirection,
      ).slice(0, 20),
    [dataset, filters, sortDirection, sortKey],
  );
};
