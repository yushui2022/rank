import { useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { CompanyLogo } from "../components/CompanyLogo";
import { entities, rankings, sources, tracks } from "../data/rankingData";
import type { DomainId, RankingRow } from "../types/rankings";

type HonorProfile = {
  entity: (typeof entities)[number];
  rows: RankingRow[];
  bestRank: number;
  averageScore: number;
  honorScore: number;
  sourceIds: string[];
};

const buildProfile = (entity: (typeof entities)[number]): HonorProfile => {
  const rows = rankings.filter((row) => row.entityId === entity.id);
  const bestRank = rows.length
    ? Math.min(...rows.map((row) => row.rank))
    : 0;
  const averageScore = rows.length
    ? rows.reduce((sum, row) => sum + row.score, 0) / rows.length
    : 0;
  const sourceIds = Array.from(
    new Set([...entity.sourceIds, ...rows.flatMap((row) => row.sourceIds)]),
  );

  // Synthetic "Honor Score" for the Hall of Fame ranking
  const honorScore = rows.length * 50 + averageScore * 2;

  return { entity, rows, bestRank, averageScore, honorScore, sourceIds };
};

// Only keep top 100 for the Honor Roll
const honorRollProfiles = entities
  .map(buildProfile)
  .filter(profile => profile.rows.length > 0)
  .sort((left, right) => right.honorScore - left.honorScore)
  .slice(0, 100)
  .map((profile, index) => ({ ...profile, honorRank: index + 1 }));

const entityTypeOptions = Array.from(
  new Set(["Person", "Company", "Product", "Robot", "Model", ...entities.map((entity) => entity.entityType)]),
).sort();

export function HonorRollPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<DomainId | "all">("all");
  const [entityType, setEntityType] = useState<string>("All");
  const [selectedId, setSelectedId] = useState(honorRollProfiles[0]?.entity.id ?? "");

  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return honorRollProfiles.filter(({ entity }) => {
      const queryMatch =
        !normalized ||
        entity.name.toLowerCase().includes(normalized) ||
        entity.country.toLowerCase().includes(normalized) ||
        entity.region.toLowerCase().includes(normalized) ||
        entity.tags.some((tag) => tag.toLowerCase().includes(normalized));
      const domainMatch = domain === "all" || entity.domainId === domain;
      const typeMatch = entityType === "All" || entity.entityType.toLowerCase() === entityType.toLowerCase();
      return queryMatch && domainMatch && typeMatch;
    });
  }, [domain, entityType, query]);

  const activeProfile =
    filteredProfiles.find((profile) => profile.entity.id === selectedId) ??
    filteredProfiles[0] ??
    honorRollProfiles[0];

  const activeSources = activeProfile
    ? activeProfile.sourceIds
        .map((sourceId) => sources.find((source) => source.id === sourceId))
        .filter(Boolean)
        .slice(0, 6)
    : [];

  return (
    <main className="page-shell">
      <section className="page-hero compact" style={{ borderTop: "4px solid var(--gold)" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--gold)" }}>Hall of Fame</span>
          <h1>Top 100 AI Era Honor Roll</h1>
          <p>
            The ultimate cross-ranking leaderboard celebrating the most influential people, companies, and products shaping the AI and Robotics era.
          </p>
        </div>
        <div className="hero-metrics">
          <strong style={{ color: "var(--gold)" }}>100</strong>
          <span>honored entities</span>
        </div>
      </section>

      <section className="company-controls" aria-label="Honor Roll filters">
        <label className="search-field">
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, country, tag..."
          />
        </label>
        <div className="segmented-control">
          {(["all", "ai", "robotics"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={domain === item ? "is-active" : ""}
              onClick={() => setDomain(item)}
            >
              {item === "all" ? "All domains" : item.toUpperCase()}
            </button>
          ))}
        </div>
        <select
          value={entityType}
          onChange={(event) => setEntityType(event.target.value)}
          aria-label="Entity type"
        >
          <option value="All">All Types</option>
          {entityTypeOptions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </section>

      <section className="company-workspace">
        <div className="company-list-panel">
          <div className="panel-title-row compact">
            <div>
              <span>Entity coverage</span>
              <h2>{filteredProfiles.length} honored entries</h2>
            </div>
            <p>Sorted by overall Honor Score</p>
          </div>

          <div className="company-index" role="list">
            {filteredProfiles.map((profile) => {
              const isTop3 = profile.honorRank <= 3;
              const rankColor = profile.honorRank === 1 ? "var(--gold)" : profile.honorRank === 2 ? "var(--line-2)" : profile.honorRank === 3 ? "var(--ink-3)" : "var(--ink-2)";
              
              return (
                <button
                  key={profile.entity.id}
                  type="button"
                  role="listitem"
                  className={`company-index-row${
                    activeProfile?.entity.id === profile.entity.id ? " is-active" : ""
                  }`}
                  onClick={() => setSelectedId(profile.entity.id)}
                  style={isTop3 ? { borderColor: rankColor, background: `linear-gradient(90deg, ${rankColor}11, transparent)` } : {}}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
                    <div style={{ 
                      width: "48px", 
                      textAlign: "center", 
                      fontSize: isTop3 ? "28px" : "20px", 
                      fontWeight: 800, 
                      fontFamily: "var(--mono)", 
                      color: rankColor 
                    }}>
                      #{profile.honorRank}
                    </div>
                    <div className="entity-title" style={{ minWidth: 0 }}>
                      <CompanyLogo entity={profile.entity} />
                      <div style={{ minWidth: 0, overflow: "hidden" }}>
                        <h2 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.entity.name}</h2>
                        <p style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {profile.entity.country} / {profile.entity.entityType.charAt(0).toUpperCase() + profile.entity.entityType.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="company-score-stack compact">
                    <div>
                      <span>Honor Score</span>
                      <strong style={{ color: isTop3 ? rankColor : "inherit" }}>{profile.honorScore.toFixed(0)}</strong>
                    </div>
                    <div>
                      <span>Appearances</span>
                      <strong>{profile.rows.length}</strong>
                    </div>
                    <div>
                      <span>Best Rank</span>
                      <strong>#{profile.bestRank}</strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {activeProfile && (
          <aside className="company-profile-panel" style={activeProfile.honorRank <= 3 ? { borderTop: `4px solid ${activeProfile.honorRank === 1 ? "var(--gold)" : activeProfile.honorRank === 2 ? "var(--line-2)" : "var(--ink-3)"}` } : {}}>
            <div className="entity-title">
              <CompanyLogo entity={activeProfile.entity} size="large" />
              <div>
                <span className="eyebrow" style={{ color: "var(--gold)" }}>Honor Roll #{activeProfile.honorRank}</span>
                <h2>{activeProfile.entity.name}</h2>
                <p>
                  {activeProfile.entity.region} / {activeProfile.entity.stage}
                </p>
              </div>
            </div>

            <div className="company-profile-metrics">
              <div>
                <span>Honor Score</span>
                <strong style={{ color: "var(--gold)" }}>{activeProfile.honorScore.toFixed(0)}</strong>
              </div>
              <div>
                <span>Best rank</span>
                <strong>#{activeProfile.bestRank}</strong>
              </div>
              <div>
                <span>Sources</span>
                <strong>{activeProfile.sourceIds.length}</strong>
              </div>
            </div>

            <div className="company-profile-section">
              <span>Workbook appearances</span>
              <div className="appearance-strip stacked">
                {activeProfile.rows.slice(0, 8).map((row) => {
                  const track = tracks.find((item) => item.id === row.trackId);
                  return (
                    <span key={`${activeProfile.entity.id}-${row.trackId}`}>
                      #{row.rank} {track?.name ?? row.trackId} / {row.score}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="company-profile-section">
              <span>Tags</span>
              <div className="tag-cloud">
                {activeProfile.entity.tags.slice(0, 10).map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="company-profile-section">
              <span>Source trail</span>
              <div className="source-stack compact">
                {activeSources.map((source) =>
                  source ? (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{source.publisher}</span>
                      <strong>{source.title}</strong>
                    </a>
                  ) : null,
                )}
              </div>
            </div>
          </aside>
        )}
      </section>
    </main>
  );
}
