import { useMemo, useState } from "react";
import { AlertSignalPanel } from "../components/AlertSignalPanel";
import { DomainSwitcher } from "../components/DomainSwitcher";
import { EntityDetail } from "../components/EntityDetail";
import { LeaderboardTabs } from "../components/LeaderboardTabs";
import { MarketPulse } from "../components/MarketPulse";
import { MethodologyPanel } from "../components/MethodologyPanel";
import { RankingTable } from "../components/RankingTable";
import { RankingToolbar } from "../components/RankingToolbar";
import { SourceLedger } from "../components/SourceLedger";
import {
  domains,
  entities,
  leaderboardViews,
  marketPulse,
  sources,
  topicPrompts,
  tracks,
} from "../data/rankingData";
import type {
  DomainId,
  FilterState,
  LeaderboardViewId,
} from "../types/rankings";
import {
  formatSignedNumber,
  formatWorkbookSnapshot,
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
  if (domainId === "robotics") {
    return (
      tracks.find((track) => track.id === "robotics_industrial_fixed_robots_top10") ??
      tracks.find((track) => track.domainId === domainId) ??
      tracks[0]
    );
  }

  return (
    tracks.find((track) => track.id === "foundation_models_base_models_top10") ??
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
  const [activeDomainId, setActiveDomainId] = useState<DomainId>("ai");
  const [activeTrackId, setActiveTrackId] = useState(
    preferredTrackForDomain("ai").id,
  );
  const [activeView, setActiveView] = useState<LeaderboardViewId>("top");
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
  const activeViewConfig =
    leaderboardViews.find((view) => view.id === activeView) ??
    leaderboardViews[0];

  const records = useMemo(
    () =>
      recordsForTrack(
        activeTrack.id,
        activeView,
        filters,
        sortKey,
        sortDirection,
      ),
    [activeTrack.id, activeView, filters, sortKey, sortDirection],
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
      activeView,
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
      activeView,
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

        <MarketPulse metrics={marketPulse} />

        <div className="board-controls">
          <LeaderboardTabs
            views={leaderboardViews}
            activeView={activeView}
            onChange={setActiveView}
          />

          <div className="view-note">
            <strong>{activeViewConfig.label}</strong>
            <span>{activeViewConfig.description}</span>
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

        <div className="content-grid">
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

          <aside className="intelligence-rail">
            <div className="rail-head">
              <span className="eyebrow">Selected entity</span>
              <strong>Intelligence</strong>
            </div>
            <div className="rail-card rail-feature">
              <span>Current focus</span>
              <strong>{selectedRecord?.entity.name ?? "No selection"}</strong>
              <div className="rail-metrics">
                <div>
                  <em>Score</em>
                  <b>{selectedRecord ? selectedRecord.row.score : "-"}</b>
                </div>
                <div>
                  <em>Rank</em>
                  <b>{selectedRecord ? `#${selectedRecord.row.rank}` : "-"}</b>
                </div>
                <div>
                  <em>Sources</em>
                  <b>{selectedRecord ? selectedRecord.row.evidenceCount : 0}</b>
                </div>
              </div>
              <p>
                Imported from the workbook ranking surface. Dimension scores,
                source identifiers, and analyst notes remain traceable.
              </p>
            </div>
            <div className="rail-card">
              <span>Source confidence</span>
              <strong>
                {selectedRecord ? selectedRecord.row.evidenceQuality : "-"}
              </strong>
              <p>
                Source quality is mapped from workbook confidence and source
                type. Proxy fields stay labeled instead of pretending to be exact.
              </p>
            </div>
            <div className="rail-card">
              <span>Workbook snapshot</span>
              <strong>{activeTrack.folder}</strong>
              <p>
                {formatWorkbookSnapshot(activeTrack.slug, activeTrack.snapshotDate)}
              </p>
            </div>
            <AlertSignalPanel
              watchedCount={watchedIds.size}
              shortlistedCount={shortlistedIds.size}
            />
          </aside>
        </div>

        <section className="track-context">
          <div>
            <span className="eyebrow">{activeDomain.name} track</span>
            <h2>{activeTrack.name}</h2>
            <p>{activeTrack.description}</p>
          </div>
          <div className="segment-cloud">
            {activeTrack.segments.map((segment) => (
              <span key={segment}>{segment}</span>
            ))}
          </div>
        </section>

        <section className="topic-panel" aria-label="Queryable topics">
          {topicPrompts.map((prompt) => (
            <button key={prompt} type="button">
              {prompt}
            </button>
          ))}
        </section>

        {selectedRecord ? (
          <EntityDetail
            entity={selectedRecord.entity}
            row={selectedRecord.row}
            sources={sources}
            watched={watchedIds.has(selectedRecord.entity.id)}
            shortlisted={shortlistedIds.has(selectedRecord.entity.id)}
            onToggleWatchlist={onToggleWatchlist}
            onToggleShortlist={onToggleShortlist}
          />
        ) : (
          <section className="entity-detail-empty">
            <strong>No matching entities</strong>
            <p>
              No entity in this track matches the current filters. Reset
              filters or pick another track to see profile details.
            </p>
          </section>
        )}

        <div className="support-grid">
          <MethodologyPanel />
          <SourceLedger sources={sources.slice(0, 30)} />
        </div>
      </main>
    </div>
  );
}
