import { useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { entities, rankings, sources, tracks } from "../data/rankingData";
import type { DomainId, EntityType, RankingRow } from "../types/rankings";

type CompanyProfile = {
  entity: (typeof entities)[number];
  rows: RankingRow[];
  bestRank: number;
  averageScore: number;
  sourceIds: string[];
};

const buildProfile = (entity: (typeof entities)[number]): CompanyProfile => {
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

  return { entity, rows, bestRank, averageScore, sourceIds };
};

const companyProfiles = entities
  .map(buildProfile)
  .sort((left, right) => {
    if (right.rows.length !== left.rows.length) {
      return right.rows.length - left.rows.length;
    }
    return right.averageScore - left.averageScore;
  });

const entityTypeOptions = Array.from(
  new Set(entities.map((entity) => entity.entityType)),
).sort();

export function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<DomainId | "all">("all");
  const [entityType, setEntityType] = useState<EntityType | "All">("All");
  const [selectedId, setSelectedId] = useState(companyProfiles[0]?.entity.id ?? "");

  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return companyProfiles.filter(({ entity, rows }) => {
      const queryMatch =
        !normalized ||
        entity.name.toLowerCase().includes(normalized) ||
        entity.country.toLowerCase().includes(normalized) ||
        entity.region.toLowerCase().includes(normalized) ||
        entity.tags.some((tag) => tag.toLowerCase().includes(normalized));
      const domainMatch = domain === "all" || entity.domainId === domain;
      const typeMatch = entityType === "All" || entity.entityType === entityType;
      return queryMatch && domainMatch && typeMatch && rows.length > 0;
    });
  }, [domain, entityType, query]);

  const activeProfile =
    filteredProfiles.find((profile) => profile.entity.id === selectedId) ??
    filteredProfiles[0] ??
    companyProfiles[0];

  const activeSources = activeProfile
    ? activeProfile.sourceIds
        .map((sourceId) => sources.find((source) => source.id === sourceId))
        .filter(Boolean)
        .slice(0, 6)
    : [];

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Company index</span>
          <h1>Companies</h1>
          <p>
            A cross-ranking view of the companies, labs, vendors, and platforms
            that appear across imported AI and Robotics Top 10 workbooks.
          </p>
        </div>
        <div className="hero-metrics">
          <strong>{entities.length}</strong>
          <span>unique entities</span>
        </div>
      </section>

      <section className="company-controls" aria-label="Company filters">
        <label className="search-field">
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Company, lab, country, tag..."
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
          onChange={(event) => setEntityType(event.target.value as EntityType | "All")}
          aria-label="Entity type"
        >
          <option>All</option>
          {entityTypeOptions.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </section>

      <section className="company-workspace">
        <div className="company-list-panel">
          <div className="panel-title-row compact">
            <div>
              <span>Entity coverage</span>
              <h2>{filteredProfiles.length} matching entities</h2>
            </div>
            <p>Sorted by cross-ranking presence</p>
          </div>

          <div className="company-index" role="list">
            {filteredProfiles.slice(0, 80).map((profile) => (
              <button
                key={profile.entity.id}
                type="button"
                role="listitem"
                className={`company-index-row${
                  activeProfile?.entity.id === profile.entity.id ? " is-active" : ""
                }`}
                onClick={() => setSelectedId(profile.entity.id)}
              >
                <div className="entity-title">
                  <span className="entity-logo">{profile.entity.logoText}</span>
                  <div>
                    <h2>{profile.entity.name}</h2>
                    <p>
                      {profile.entity.country} / {profile.entity.entityType}
                    </p>
                  </div>
                </div>
                <div className="company-score-stack compact">
                  <div>
                    <span>Appearances</span>
                    <strong>{profile.rows.length}</strong>
                  </div>
                  <div>
                    <span>Best rank</span>
                    <strong>#{profile.bestRank}</strong>
                  </div>
                  <div>
                    <span>Avg score</span>
                    <strong>{profile.averageScore.toFixed(1)}</strong>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {activeProfile && (
          <aside className="company-profile-panel">
            <div className="entity-title">
              <span className="entity-logo large">{activeProfile.entity.logoText}</span>
              <div>
                <span className="eyebrow">Selected profile</span>
                <h2>{activeProfile.entity.name}</h2>
                <p>
                  {activeProfile.entity.region} / {activeProfile.entity.stage}
                </p>
              </div>
            </div>

            <div className="company-profile-metrics">
              <div>
                <span>Ranking rows</span>
                <strong>{activeProfile.rows.length}</strong>
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
