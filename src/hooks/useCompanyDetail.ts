import { useMemo } from "react";
import {
  readTrackEvidenceDataset,
  resolveEntityTrackId,
  trackById,
} from "../data/rankingRepository";
import type { Source } from "../types/rankings";
import type { CompanyDetailRecord, ScoredRecord } from "../types/rankingRuntime";
import {
  peerRecordsForDataset,
  recordForEntityInDataset,
  sourcesForRecord,
} from "../utils/rankingLogic";

type CompanyDetailState = {
  detail: CompanyDetailRecord | null;
  evidence: Source[];
  peers: ScoredRecord[];
};

export const useCompanyDetail = (
  entityId: string,
  preferredTrackId?: string,
): CompanyDetailState => {
  const trackId = resolveEntityTrackId(entityId, preferredTrackId);
  const dataset = trackId ? readTrackEvidenceDataset(trackId) : null;

  return useMemo(() => {
    if (!dataset) {
      return {
        detail: null,
        evidence: [],
        peers: [],
      };
    }

    const track = trackById.get(dataset.trackId);
    if (!track) {
      return {
        detail: null,
        evidence: [],
        peers: [],
      };
    }

    const detail = recordForEntityInDataset(dataset, track, entityId);
    if (!detail) {
      return {
        detail: null,
        evidence: [],
        peers: [],
      };
    }

    return {
      detail,
      evidence: sourcesForRecord(dataset, detail.row, detail.entity),
      peers: peerRecordsForDataset(dataset, detail.entity.id),
    };
  }, [dataset, entityId]);
};
