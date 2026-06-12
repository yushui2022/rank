import { useMemo, useState } from "react";
import { DomainSwitcher } from "../components/DomainSwitcher";
import { RankingTable } from "../components/RankingTable";
import { RankHistoryChart } from "../components/RankHistoryChart";
import { RankingToolbar } from "../components/RankingToolbar";
import {
  domains,
  entities,
  sources,
  tracks,
} from "../data/rankingData";
import type {
  DomainId,
  FilterState,
} from "../types/rankings";
import {
  formatSignedNumber,
} from "../utils/displayText";
import {
  recordsForTrack,
  rowsForDomain,
  type SortDirection,
  type SortKey,
} from "../utils/rankingLogic";

type RankingsPageProps = {
  watchedIds: Set<string>;
  shortlistedIds: Set<string>;
  onToggleWatchlist: (entityId: string) => void;
  onToggleShortlist: (entityId: string) => void;
};

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

export function RankingsPage({
  watchedIds,
  shortlistedIds,
  onToggleWatchlist,
  onToggleShortlist,
}: RankingsPageProps) {
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

  const activeDomain =
    domains.find((domain) => domain.id === activeDomainId) ?? domains[0];
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
      ),
    [activeTrack.id, filters, sortKey, sortDirection],
  );

  const selectedRecord =
    records.find((record) => record.entity.id === selectedEntityId) ??
    records[0] ??
    null;

  const domainRows = rowsForDomain(activeDomainId);
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

  const selectedSources = selectedRecord
    ? selectedRecord.row.sourceIds
        .map((sourceId) => sources.find((source) => source.id === sourceId))
        .filter(Boolean)
    : [];

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
        <section className="market-bar">
          <span className="live-dot" aria-hidden="true" />
          <div className="market-bar-id">
            <span className="eyebrow">
              Imported ranking index / {activeTrack.snapshotDate}
            </span>
            <h1>{activeDomain.name} leaderboard</h1>
            <p>{activeTrack.name}</p>
          </div>
          <div className="market-stats">
            <div className="market-stat">
              <span>Ranked</span>
              <strong>{records.length}</strong>
            </div>
            <div className="market-stat">
              <span>Domain rows</span>
              <strong>{domainRows.length}</strong>
            </div>
            <div className="market-stat">
              <span>Sources</span>
              <strong>{activeTrack.sourceCount ?? selectedSources.length}</strong>
            </div>
            <div className="market-stat">
              <span>Tracked</span>
              <strong>{watchedIds.size + shortlistedIds.size}</strong>
            </div>
          </div>
        </section>

        <div className="ranking-toolbar-container">
          <div className="market-pulse-inline">
            <div className="pulse-item-inline">
              <span>Ranking workbooks</span>
              <strong>40</strong>
              <em>Imported</em>
            </div>
            <div className="pulse-item-inline tone-positive">
              <span>Companies / labs</span>
              <strong>266</strong>
              <em>400 ranked rows</em>
            </div>
            <div className="pulse-item-inline">
              <span>Snapshot</span>
              <strong>2026-06-06</strong>
              <em>Static import</em>
            </div>
          </div>

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
          <section className="leader-strip" aria-label="Top ranked leaders">
            <div className="leader-strip-head">
              <span className="eyebrow">Index desk / top of {activeTrack.name}</span>
              <strong>Leaders</strong>
            </div>
            <div className="leader-podium">
              {records.slice(0, 3).map(({ row, entity, viewScore }) => {
                const tone = row.scoreChange >= 0 ? "positive" : "negative";
                const selected = entity.id === selectedRecord?.entity.id;
                return (
                  <button
                    key={`leader-${entity.id}`}
                    type="button"
                    className={`leader-card${selected ? " is-selected" : ""} podium-${row.rank}`}
                    onClick={() => setSelectedEntityId(entity.id)}
                  >
                    <span className={`leader-rank rank-${row.rank}`}>#{row.rank}</span>
                    <span className="leader-logo">{entity.logoText}</span>
                    <span className="leader-id">
                      <strong>{entity.name}</strong>
                      <em>{row.category}</em>
                    </span>
                    <span className="leader-score">
                      <b>{row.score}</b>
                      <i>score</i>
                    </span>
                    <span className={`leader-change ${tone}`}>
                      {formatSignedNumber(row.scoreChange)}
                    </span>
                    <span className="leader-evidence">
                      {row.evidenceQuality} / {row.evidenceCount} src / view {viewScore}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <div className="content-grid">
          <div className="ranking-layout">
            <RankingTable
              records={records}
              selectedEntityId={selectedRecord?.entity.id ?? ""}
              watchedIds={watchedIds}
              shortlistedIds={shortlistedIds}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={toggleSort}
              onSelectEntity={setSelectedEntityId}
              onToggleWatchlist={onToggleWatchlist}
              onToggleShortlist={onToggleShortlist}
            />
            
            <RankHistoryChart records={records} selectedEntityId={selectedRecord?.entity.id ?? ""} />
          </div>
        </div>
      </main>
    </div>
  );
}
