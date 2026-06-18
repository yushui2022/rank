import { useMemo } from "react";
import {
  readTrackDataset,
  resolveEntityTrackId,
  trackById,
} from "../data/rankingRepository";
import type { CompanyDetailRecord, ScoredRecord } from "../types/rankingRuntime";
import {
  peerRecordsForDataset,
  recordForEntityInDataset,
} from "../utils/rankingLogic";

type CompanyDetailState = {
  detail: CompanyDetailRecord | null;
  peers: ScoredRecord[];
};

export const useCompanyDetail = (
  entityId: string,
  preferredTrackId?: string,
): CompanyDetailState => {
  const trackId = resolveEntityTrackId(entityId, preferredTrackId);
  const dataset = trackId ? readTrackDataset(trackId) : null;

  return useMemo(() => {
    if (!dataset) {
      return {
        detail: null,
        peers: [],
      };
    }

    const track = trackById.get(dataset.trackId);
    if (!track) {
      return {
        detail: null,
        peers: [],
      };
    }

    const detail = recordForEntityInDataset(dataset, track, entityId);
    if (!detail) {
      return {
        detail: null,
        peers: [],
      };
    }

    return {
      detail,
      peers: peerRecordsForDataset(dataset, detail.entity.id),
    };
  }, [dataset, entityId]);
};
