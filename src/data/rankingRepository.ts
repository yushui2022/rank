import { domains, entityTrackIndex, tracks } from "./generated/manifest";
import { trackDataLoaders } from "./generated/trackLoaders";
import type { Track } from "../types/rankings";
import type { TrackDataset } from "../types/rankingRuntime";

export { domains, tracks };

export const trackById = new Map(tracks.map((track) => [track.id, track]));

const loadedDatasets = new Map<string, TrackDataset>();
const pendingDatasets = new Map<string, Promise<TrackDataset>>();

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

export const loadTrackDataset = (trackId: string): Promise<TrackDataset> => {
  const loaded = loadedDatasets.get(trackId);
  if (loaded) return Promise.resolve(loaded);

  const pending = pendingDatasets.get(trackId);
  if (pending) return pending;

  const loader = trackDataLoaders[trackId];
  if (!loader) return Promise.reject(new Error(`Unknown ranking track: ${trackId}`));

  const nextPending = loader().then((module) => {
    loadedDatasets.set(trackId, module.trackDataset);
    pendingDatasets.delete(trackId);
    return module.trackDataset;
  });

  pendingDatasets.set(trackId, nextPending);
  return nextPending;
};

export const readTrackDataset = (trackId: string): TrackDataset => {
  const loaded = loadedDatasets.get(trackId);
  if (loaded) return loaded;

  throw loadTrackDataset(trackId);
};
