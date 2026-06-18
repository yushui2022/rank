import { domains, entityTrackIndex, tracks } from "./generated/manifest";
import { trackDataLoaders } from "./generated/trackLoaders";
import type { Entity, Source, Track } from "../types/rankings";
import type { TrackDataset, TrackRankingDataset } from "../types/rankingRuntime";

export { domains, tracks };

export const trackById = new Map(tracks.map((track) => [track.id, track]));

const loadedDatasets = new Map<string, TrackDataset>();
const pendingDatasets = new Map<string, Promise<TrackDataset>>();
const loadedEvidenceDatasets = new Map<string, TrackDataset>();
const pendingEvidenceDatasets = new Map<string, Promise<TrackDataset>>();
let loadedEntities: Entity[] | null = null;
let pendingEntities: Promise<Entity[]> | null = null;
let loadedSources: Source[] | null = null;
let pendingSources: Promise<Source[]> | null = null;

export const preferredTrackForDomain = (domainId: string): Track => {
  return tracks.find((track) => track.domainId === domainId) ?? tracks[0];
};

export const resolveEntityTrackId = (
  entityId: string,
  preferredTrackId?: string,
): string => {
  const entityTrackIds = entityTrackIndex[entityId] ?? [];

  if (preferredTrackId && entityTrackIds.includes(preferredTrackId)) {
    return preferredTrackId;
  }

  return entityTrackIds[0] ?? "";
};

const loadEntities = (): Promise<Entity[]> => {
  if (loadedEntities) return Promise.resolve(loadedEntities);
  if (pendingEntities) return pendingEntities;

  pendingEntities = import("./generated/entities").then((module) => {
    loadedEntities = module.entities;
    pendingEntities = null;
    return module.entities;
  });

  return pendingEntities;
};

const loadSources = (): Promise<Source[]> => {
  if (loadedSources) return Promise.resolve(loadedSources);
  if (pendingSources) return pendingSources;

  pendingSources = import("./generated/sources").then((module) => {
    loadedSources = module.sources;
    pendingSources = null;
    return module.sources;
  });

  return pendingSources;
};

const loadTrackRankings = (trackId: string): Promise<TrackRankingDataset> => {
  const loader = trackDataLoaders[trackId];
  if (!loader) return Promise.reject(new Error(`Unknown ranking track: ${trackId}`));

  return loader().then((module) => module.trackDataset);
};

export const loadTrackDataset = (trackId: string): Promise<TrackDataset> => {
  const loaded = loadedDatasets.get(trackId);
  if (loaded) return Promise.resolve(loaded);

  const pending = pendingDatasets.get(trackId);
  if (pending) return pending;

  const nextPending = Promise.all([
    loadTrackRankings(trackId),
    loadEntities(),
  ]).then(([trackDataset, entities]) => {
    const dataset = {
      ...trackDataset,
      entities,
      sources: [],
    };

    loadedDatasets.set(trackId, dataset);
    pendingDatasets.delete(trackId);
    return dataset;
  });

  pendingDatasets.set(trackId, nextPending);
  return nextPending;
};

export const loadTrackEvidenceDataset = (trackId: string): Promise<TrackDataset> => {
  const loaded = loadedEvidenceDatasets.get(trackId);
  if (loaded) return Promise.resolve(loaded);

  const pending = pendingEvidenceDatasets.get(trackId);
  if (pending) return pending;

  const nextPending = Promise.all([
    loadTrackDataset(trackId),
    loadSources(),
  ]).then(([dataset, sources]) => {
    const evidenceDataset = {
      ...dataset,
      sources,
    };

    loadedEvidenceDatasets.set(trackId, evidenceDataset);
    pendingEvidenceDatasets.delete(trackId);
    return evidenceDataset;
  });

  pendingEvidenceDatasets.set(trackId, nextPending);
  return nextPending;
};

export const readTrackDataset = (trackId: string): TrackDataset => {
  const loaded = loadedDatasets.get(trackId);
  if (loaded) return loaded;

  throw loadTrackDataset(trackId);
};

export const readTrackEvidenceDataset = (trackId: string): TrackDataset => {
  const loaded = loadedEvidenceDatasets.get(trackId);
  if (loaded) return loaded;

  throw loadTrackEvidenceDataset(trackId);
};
