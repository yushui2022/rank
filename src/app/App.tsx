import { useMemo, useState } from "react";
import { DomainSwitcher } from "../components/DomainSwitcher";
import { EntityDetail } from "../components/EntityDetail";
import { LeaderboardTabs } from "../components/LeaderboardTabs";
import { MarketPulse } from "../components/MarketPulse";
import { MethodologyPanel } from "../components/MethodologyPanel";
import { RankingTable } from "../components/RankingTable";
import { RankingToolbar } from "../components/RankingToolbar";
import { SourceLedger } from "../components/SourceLedger";
import { TopNav } from "../components/TopNav";
import {
  domains,
  entities,
  leaderboardViews,
  marketPulse,
  rankings,
  sources,
  topicPrompts,
  tracks,
} from "../data/rankingData";
import type {
  DomainId,
  Entity,
  FilterState,
  LeaderboardViewId,
  RankingRow,
} from "../types/rankings";
import "./app.css";

type RankingRecord = {
  row: RankingRow;
  entity: Entity;
};

type ScoredRecord = RankingRecord & { viewScore: number };

const initialFilters: FilterState = {
  query: "",
  region: "All",
  stage: "All",
  entityType: "All",
};

const entityById = new Map(entities.map((entity) => [entity.id, entity]));

type SortKey = "view" | "score" | "momentum";
type SortDirection = "asc" | "desc";

const clamp100 = (value: number) => Math.max(0, Math.min(100, value));

// scoreChange in the dataset ranges roughly -3.5..+1.9; map to a 0-100 band
// so "7d change" can blend into normalized view scores without going negative.
const changeToScale = (scoreChange: number) =>
  clamp100(50 + scoreChange * 10);

// recency: newest addedDate = 100, scaled down by age in days (capped at 1 year).
const recencyScale = (addedDate: string) => {
  const parsed = Date.parse(addedDate);
  if (Number.isNaN(parsed)) return 50;
  const ageDays = (Date.now() - parsed) / (1000 * 60 * 60 * 24);
  return clamp100(100 - Math.max(0, ageDays) * (100 / 365));
};

// Each view returns an explainable 0-100 score. Tag/stage/domain views use a
// soft boost rather than a magic +/- that could cross tracks or go negative.
const scoreForView = (
  record: RankingRecord,
  activeView: LeaderboardViewId,
): number => {
  const { row, entity } = record;
  const boost = (matches: boolean) => clamp100(row.score * (matches ? 1 : 0.85));

  switch (activeView) {
    case "trending":
      return clamp100(row.momentum * 0.7 + changeToScale(row.scoreChange) * 0.3);
    case "new":
      return clamp100(recencyScale(row.addedDate) * 0.6 + row.momentum * 0.4);
    case "most-visited":
      return clamp100(row.score * 0.6 + row.sentiment * 0.4);
    case "fastest-growing":
      return clamp100(changeToScale(row.scoreChange) * 0.6 + row.momentum * 0.4);
    case "most-funded":
      return boost(
        entity.stage.includes("Public") || entity.stage.includes("late"),
      );
    case "open-source":
      return boost(entity.tags.some((tag) => tag.includes("open")));
    case "enterprise-ready":
      return boost(entity.tags.some((tag) => tag.includes("enterprise")));
    case "community-sentiment":
      return clamp100(row.sentiment * 0.7 + row.momentum * 0.3);
    case "robotics":
      return boost(entity.domainId === "robotics");
    case "top":
    default:
      return row.score;
  }
};

const sortValue = (
  record: RankingRecord,
  sortKey: SortKey,
  activeView: LeaderboardViewId,
): number => {
  switch (sortKey) {
    case "score":
      return record.row.score;
    case "momentum":
      return record.row.momentum;
    case "view":
    default:
      return scoreForView(record, activeView);
  }
};

const compareRecords =
  (sortKey: SortKey, direction: SortDirection, activeView: LeaderboardViewId) =>
  (left: RankingRecord, right: RankingRecord) => {
    const delta =
      sortValue(right, sortKey, activeView) -
      sortValue(left, sortKey, activeView);
    return direction === "desc" ? delta : -delta;
  };

export function App() {
  const [activeDomainId, setActiveDomainId] = useState<DomainId>("ai");
  const [activeTrackId, setActiveTrackId] = useState("foundation-models");
  const [activeView, setActiveView] = useState<LeaderboardViewId>("top");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedEntityId, setSelectedEntityId] = useState("openai");
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
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

  const activeDomain = domains.find((domain) => domain.id === activeDomainId) ?? domains[0];
  const activeTrack =
    tracks.find((track) => track.id === activeTrackId) ?? tracks[0];
  const activeViewConfig =
    leaderboardViews.find((view) => view.id === activeView) ?? leaderboardViews[0];

  const records = useMemo<ScoredRecord[]>(() => {
    const query = filters.query.trim().toLowerCase();

    return rankings
      .filter((row) => row.trackId === activeTrackId)
      .map((row) => {
        const entity = entityById.get(row.entityId);

        if (!entity) return null;
        return { row, entity };
      })
      .filter((record): record is RankingRecord => Boolean(record))
      .filter(({ row, entity }) => {
        const matchesQuery =
          !query ||
          entity.name.toLowerCase().includes(query) ||
          row.category.toLowerCase().includes(query) ||
          entity.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesRegion =
          filters.region === "All" || entity.region === filters.region;
        const matchesStage =
          filters.stage === "All" || entity.stage === filters.stage;
        const matchesType =
          filters.entityType === "All" || entity.entityType === filters.entityType;

        return matchesQuery && matchesRegion && matchesStage && matchesType;
      })
      .map((record) => ({
        ...record,
        viewScore: Math.round(scoreForView(record, activeView)),
      }))
      .sort(compareRecords(sortKey, sortDirection, activeView));
  }, [activeTrackId, activeView, filters, sortKey, sortDirection]);

  const selectedRecord =
    records.find((record) => record.entity.id === selectedEntityId) ??
    records[0] ??
    null;

  const domainRows = rankings.filter((row) => {
    const entity = entityById.get(row.entityId);
    return entity?.domainId === activeDomainId;
  });

  const regions = Array.from(
    new Set(entities.map((entity) => entity.region)),
  ).sort();
  const stages = Array.from(
    new Set(entities.map((entity) => entity.stage)),
  ).sort();
  const entityTypes = Array.from(
    new Set(entities.map((entity) => entity.entityType)),
  ).sort();

  const setDomain = (domainId: DomainId) => {
    const nextTrack = tracks.find((track) => track.domainId === domainId);

    setActiveDomainId(domainId);
    if (nextTrack) {
      setActiveTrackId(nextTrack.id);
      const firstRow = rankings.find((row) => row.trackId === nextTrack.id);
      if (firstRow) setSelectedEntityId(firstRow.entityId);
    }
  };

  const setTrack = (trackId: string) => {
    setActiveTrackId(trackId);
    const firstRow = rankings.find((row) => row.trackId === trackId);
    if (firstRow) setSelectedEntityId(firstRow.entityId);
  };

  const toggleSet = (
    entityId: string,
    setter: (next: Set<string>) => void,
    current: Set<string>,
  ) => {
    const next = new Set(current);
    if (next.has(entityId)) {
      next.delete(entityId);
    } else {
      next.add(entityId);
    }
    setter(next);
  };

  return (
    <div className="app-shell">
      <TopNav
        watchlistCount={watchedIds.size}
        shortlistCount={shortlistedIds.size}
      />

      <div className="product-layout">
        <DomainSwitcher
          domains={domains}
          tracks={tracks}
          activeDomainId={activeDomainId}
          activeTrackId={activeTrackId}
          onDomainChange={setDomain}
          onTrackChange={setTrack}
        />

        <main className="workspace">
          <section className="market-bar">
            <span className="live-dot" aria-hidden="true" />
            <div className="market-bar-id">
              <span className="eyebrow">Global AI ranking index · live</span>
              <h1>{activeDomain.name} leaderboard</h1>
              <p>{activeTrack.name}</p>
            </div>
            <div className="market-stats">
              <div className="market-stat">
                <span>Ranked</span>
                <strong>{records.length}</strong>
              </div>
              <div className="market-stat">
                <span>Domain records</span>
                <strong>{domainRows.length}</strong>
              </div>
              <div className="market-stat">
                <span>Confidence</span>
                <strong>Prototype</strong>
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
                <span className="eyebrow">Index desk · top of {activeTrack.name}</span>
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
                        <i>index</i>
                      </span>
                      <span className={`leader-change ${tone}`}>
                        {row.scoreChange >= 0 ? "▲" : "▼"} {Math.abs(row.scoreChange)}
                      </span>
                      <span className="leader-evidence">
                        {row.evidenceQuality} · {row.evidenceCount} src · view {viewScore}
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
              onToggleWatchlist={(entityId) =>
                toggleSet(entityId, setWatchedIds, watchedIds)
              }
              onToggleShortlist={(entityId) =>
                toggleSet(entityId, setShortlistedIds, shortlistedIds)
              }
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
                    <b>{selectedRecord ? selectedRecord.row.score : "—"}</b>
                  </div>
                  <div>
                    <em>Rank</em>
                    <b>{selectedRecord ? `#${selectedRecord.row.rank}` : "—"}</b>
                  </div>
                  <div>
                    <em>Sources</em>
                    <b>{selectedRecord ? selectedRecord.row.evidenceCount : 0}</b>
                  </div>
                </div>
                <p>
                  Ranked by composite prototype score, momentum, evidence
                  quality, adoption signals, and category fit.
                </p>
              </div>
              <div className="rail-card">
                <span>Source confidence</span>
                <strong>
                  {selectedRecord ? selectedRecord.row.evidenceQuality : "—"}
                </strong>
                <p>
                  Prototype mix of official disclosures, benchmark references,
                  market data, and public proxies.
                </p>
              </div>
              <div className="rail-card">
                <span>Watchlist loop</span>
                <strong>{watchedIds.size + shortlistedIds.size}</strong>
                <p>
                  Watchlist and shortlist are UI states in this build.
                  Persistence belongs in a later backend phase.
                </p>
              </div>
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
              onToggleWatchlist={(entityId) =>
                toggleSet(entityId, setWatchedIds, watchedIds)
              }
              onToggleShortlist={(entityId) =>
                toggleSet(entityId, setShortlistedIds, shortlistedIds)
              }
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
            <SourceLedger sources={sources} />
          </div>
        </main>
      </div>
    </div>
  );
}
