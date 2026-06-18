import { useMemo, useState } from "react";
import { DomainSwitcher } from "../components/rankings/DomainSwitcher";
import { MiniBoardsStrip } from "../components/rankings/MiniBoardsStrip";
import { RankingTable } from "../components/rankings/RankingTable";
import {
  domains,
  tracks,
} from "../data/rankingData";
import type {
  DomainId,
  FilterState,
} from "../types/rankings";
import {
  recordsForTrack,
  type SortDirection,
  type SortKey,
} from "../utils/rankingLogic";

const initialFilters: FilterState = {
  query: "",
  region: "All",
  stage: "All",
  entityType: "All",
};

const preferredTrackForDomain = (domainId: DomainId) => {
  return (
    tracks.find((track) => track.domainId === domainId) ??
    tracks[0]
  );
};

export function RankingsPage() {
  const [activeDomainId, setActiveDomainId] = useState<DomainId>(domains[0]?.id ?? "ai");
  const [activeTrackId, setActiveTrackId] = useState(
    preferredTrackForDomain(domains[0]?.id ?? "ai").id,
  );
  const [filters] = useState<FilterState>(initialFilters);
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("view");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const openCompanyDetail = (entityId: string, trackId: string) => {
    window.location.hash = `/company/${encodeURIComponent(entityId)}?track=${encodeURIComponent(trackId)}`;
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const activeTrack =
    tracks.find((track) => track.id === activeTrackId) ??
    preferredTrackForDomain(activeDomainId);

  const records = useMemo(
    () =>
      recordsForTrack(
        activeTrack.id,
        "top", // fixed view
        filters,
        sortKey,
        sortDirection,
      ).slice(0, 20),
    [activeTrack.id, filters, sortKey, sortDirection],
  );

  const selectedRecord =
    records.find((record) => record.entity.id === selectedEntityId) ??
    records[0] ??
    null;

  const setDomain = (domainId: DomainId) => {
    const nextTrack = preferredTrackForDomain(domainId);

    setActiveDomainId(domainId);
    setActiveTrackId(nextTrack.id);
    const firstRow = recordsForTrack(
      nextTrack.id,
      "top",
      initialFilters,
      sortKey,
      sortDirection,
    )[0];
    setSelectedEntityId(firstRow?.entity.id ?? "");
  };

  const setTrack = (trackId: string) => {
    setActiveTrackId(trackId);
    const firstRow = recordsForTrack(
      trackId,
      "top",
      filters,
      sortKey,
      sortDirection,
    )[0];
    setSelectedEntityId(firstRow?.entity.id ?? "");
  };

  return (
    <div className="product-layout">
      <DomainSwitcher
        domains={domains}
        tracks={tracks}
        activeDomainId={activeDomainId}
        activeTrackId={activeTrack.id}
        onDomainChange={setDomain}
        onTrackChange={setTrack}
      />

      <main className="workspace">
        <MiniBoardsStrip
          records={records}
          selectedEntityId={selectedRecord?.entity.id ?? ""}
          onOpenCompany={openCompanyDetail}
        />

        <div className="content-grid leaderboard-content-grid">
          <div className="ranking-layout">
            <RankingTable
              records={records}
              selectedEntityId={selectedRecord?.entity.id ?? ""}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={toggleSort}
              onSelectEntity={openCompanyDetail}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
