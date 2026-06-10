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

const initialFilters: FilterState = {
  query: "",
  region: "All",
  stage: "All",
  entityType: "All",
};

const entityById = new Map(entities.map((entity) => [entity.id, entity]));

const scoreForView = (
  record: RankingRecord,
  activeView: LeaderboardViewId,
) => {
  const { row, entity } = record;

  switch (activeView) {
    case "trending":
      return row.momentum + row.scoreChange * 4;
    case "new":
      return Date.parse(row.addedDate) / 100000000 + row.momentum;
    case "most-visited":
      return row.score + row.sentiment;
    case "fastest-growing":
      return row.scoreChange * 20 + row.momentum;
    case "most-funded":
      return entity.stage.includes("Public") || entity.stage.includes("late")
        ? row.score + 12
        : row.score;
    case "open-source":
      return entity.tags.some((tag) => tag.includes("open"))
        ? row.score + 20
        : row.score - 10;
    case "enterprise-ready":
      return entity.tags.some((tag) => tag.includes("enterprise"))
        ? row.score + 18
        : row.score;
    case "community-sentiment":
      return row.sentiment + row.momentum / 2;
    case "robotics":
      return entity.domainId === "robotics" ? row.score + 20 : row.score - 20;
    case "top":
    default:
      return row.score;
  }
};

const compareByView =
  (activeView: LeaderboardViewId) =>
  (left: RankingRecord, right: RankingRecord) =>
    scoreForView(right, activeView) - scoreForView(left, activeView);

export function App() {
  const [activeDomainId, setActiveDomainId] = useState<DomainId>("ai");
  const [activeTrackId, setActiveTrackId] = useState("foundation-models");
  const [activeView, setActiveView] = useState<LeaderboardViewId>("top");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedEntityId, setSelectedEntityId] = useState("openai");
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  const activeDomain = domains.find((domain) => domain.id === activeDomainId) ?? domains[0];
  const activeTrack =
    tracks.find((track) => track.id === activeTrackId) ?? tracks[0];
  const activeViewConfig =
    leaderboardViews.find((view) => view.id === activeView) ?? leaderboardViews[0];

  const records = useMemo(() => {
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
      .sort(compareByView(activeView));
  }, [activeTrackId, activeView, filters]);

  const fallbackRecord = useMemo(() => {
    const row = rankings.find((item) => item.trackId === activeTrackId) ?? rankings[0];
    const entity = entityById.get(row.entityId) ?? entities[0];

    return { row, entity };
  }, [activeTrackId]);

  const selectedRecord =
    records.find((record) => record.entity.id === selectedEntityId) ??
    records[0] ??
    fallbackRecord;

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
          <section className="market-hero">
            <div>
              <span className="eyebrow">Market overview</span>
              <h1>AI & Robotics ranking intelligence</h1>
              <p>
                A market terminal for global AI companies, models, products,
                robotics vendors, evidence, and trend signals.
              </p>
            </div>
            <div className="hero-summary">
              <span>{activeDomain.name}</span>
              <strong>{domainRows.length}</strong>
              <em>ranking rows in this domain</em>
            </div>
          </section>

          <MarketPulse metrics={marketPulse} />

          <section className="topic-panel" aria-label="Queryable topics">
            {topicPrompts.map((prompt) => (
              <button key={prompt} type="button">
                {prompt}
              </button>
            ))}
          </section>

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

          <LeaderboardTabs
            views={leaderboardViews}
            activeView={activeView}
            onChange={setActiveView}
          />

          <div className="view-note">
            <strong>{activeViewConfig.label}</strong>
            <span>{activeViewConfig.description}</span>
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
              selectedEntityId={selectedRecord.entity.id}
              watchedIds={watchedIds}
              shortlistedIds={shortlistedIds}
              onSelectEntity={setSelectedEntityId}
              onToggleWatchlist={(entityId) =>
                toggleSet(entityId, setWatchedIds, watchedIds)
              }
              onToggleShortlist={(entityId) =>
                toggleSet(entityId, setShortlistedIds, shortlistedIds)
              }
            />

            <aside className="intelligence-rail">
              <div className="rail-card">
                <span>Leader rationale</span>
                <strong>{selectedRecord.entity.name}</strong>
                <p>
                  Ranked by composite prototype score, momentum, evidence
                  quality, public adoption signals, and category fit.
                </p>
              </div>
              <div className="rail-card">
                <span>Source coverage</span>
                <strong>{selectedRecord.row.evidenceCount} sources</strong>
                <p>
                  Current evidence is a prototype mix of official disclosures,
                  benchmark references, market data, and public proxies.
                </p>
              </div>
              <div className="rail-card">
                <span>Watchlist loop</span>
                <strong>{watchedIds.size + shortlistedIds.size}</strong>
                <p>
                  Watchlist, shortlist, and alerts are UI states in this first
                  build. Persistence belongs in a later backend phase.
                </p>
              </div>
            </aside>
          </div>

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

          <div className="support-grid">
            <MethodologyPanel />
            <SourceLedger sources={sources} />
          </div>
        </main>
      </div>
    </div>
  );
}
