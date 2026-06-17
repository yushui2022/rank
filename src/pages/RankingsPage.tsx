import { useMemo, useState } from "react";
import { CompanyLogo } from "../components/CompanyLogo";
import { CommunitySentimentVote } from "../components/CommunitySentimentVote";
import { DomainSwitcher } from "../components/DomainSwitcher";
import { RankingTable } from "../components/RankingTable";
import { RankingToolbar } from "../components/RankingToolbar";
import {
  domains,
  entities,
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
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("view");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  const regions = Array.from(new Set(entities.map((entity) => entity.region))).sort();
  const stages = Array.from(new Set(entities.map((entity) => entity.stage))).sort();
  const entityTypes = Array.from(
    new Set(entities.map((entity) => entity.entityType)),
  ).sort();

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
        <div className="ranking-toolbar-container">
          <RankingToolbar
            filters={filters}
            regions={regions}
            stages={stages}
            entityTypes={entityTypes}
            onFiltersChange={setFilters}
            onReset={() => setFilters(initialFilters)}
          />
        </div>

        {records.length > 0 && (
          <section className="mini-boards-strip" aria-label="Sub-rankings">
            <div className="mini-boards-grid industry-mini-boards">
              {/* Global Attention Hotlist */}
              <div className="mini-board-card">
                <div className="mini-board-head">
                  <strong>Global Attention Hotlist</strong>
                  <span>Top 5 by attention signal</span>
                </div>
                <div className="mini-board-list">
                  {[...records]
                    .sort((a, b) => b.row.momentum - a.row.momentum)
                    .slice(0, 5)
                    .map(({ row, entity }, i) => (
                      <div
                        key={`momentum-${entity.id}`}
                        className={`mini-board-row${entity.id === selectedRecord?.entity.id ? " is-selected" : ""}`}
                        onClick={() => setSelectedEntityId(entity.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedEntityId(entity.id);
                          }
                        }}
                      >
                        <CompanyLogo entity={entity} />
                        <div className="mini-board-entity-info">
                          <span className="mini-board-name">{entity.name}</span>
                          <span className="mini-board-rank">#{i + 1}</span>
                        </div>
                        <span className="momentum-cell">{row.momentum.toFixed(1)}</span>
                        <div onClick={(e) => e.stopPropagation()} style={{ marginLeft: "auto" }}>
                          <CommunitySentimentVote entityId={entity.id} entityName={entity.name} variant="mini" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Rising Hotlist */}
              <div className="mini-board-card">
                <div className="mini-board-head">
                  <strong>Rising Hotlist</strong>
                  <span>Top 5 by upward momentum</span>
                </div>
                <div className="mini-board-list">
                  {[...records]
                    .sort((a, b) => b.row.score - a.row.score)
                    .slice(0, 5)
                    .map(({ row, entity }, i) => (
                      <div
                        key={`score-${entity.id}`}
                        className={`mini-board-row${entity.id === selectedRecord?.entity.id ? " is-selected" : ""}`}
                        onClick={() => setSelectedEntityId(entity.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedEntityId(entity.id);
                          }
                        }}
                      >
                        <CompanyLogo entity={entity} />
                        <div className="mini-board-entity-info">
                          <span className="mini-board-name">{entity.name}</span>
                          <span className="mini-board-rank">#{i + 1}</span>
                        </div>
                        <span className="mini-board-metric">{row.score.toFixed(1)}</span>
                        <div onClick={(e) => e.stopPropagation()} style={{ marginLeft: "auto" }}>
                          <CommunitySentimentVote entityId={entity.id} entityName={entity.name} variant="mini" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Influence Leaderboard */}
              <div className="mini-board-card">
                <div className="mini-board-head">
                  <strong>Influence Leaderboard</strong>
                  <span>Top 5 by cited evidence</span>
                </div>
                <div className="mini-board-list">
                  {[...records]
                    .sort((a, b) => b.row.evidenceCount - a.row.evidenceCount)
                    .slice(0, 5)
                    .map(({ row, entity }, i) => (
                      <div
                        key={`inf-${entity.id}`}
                        className={`mini-board-row${entity.id === selectedRecord?.entity.id ? " is-selected" : ""}`}
                        onClick={() => setSelectedEntityId(entity.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedEntityId(entity.id);
                          }
                        }}
                      >
                        <CompanyLogo entity={entity} />
                        <div className="mini-board-entity-info">
                          <span className="mini-board-name">{entity.name}</span>
                          <span className="mini-board-rank">#{i + 1}</span>
                        </div>
                        <span className="mini-board-metric">{row.evidenceCount} src</span>
                        <div onClick={(e) => e.stopPropagation()} style={{ marginLeft: "auto" }}>
                          <CommunitySentimentVote entityId={entity.id} entityName={entity.name} variant="mini" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="content-grid leaderboard-content-grid">
          <div className="ranking-layout">
            <RankingTable
              records={records}
              selectedEntityId={selectedRecord?.entity.id ?? ""}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={toggleSort}
              onSelectEntity={setSelectedEntityId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
