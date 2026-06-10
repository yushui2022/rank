import type { Entity, RankingRow, Source } from "../types/rankings";
import { Badge } from "./Badge";
import { Sparkline } from "./Sparkline";

type EntityDetailProps = {
  entity: Entity;
  row: RankingRow;
  sources: Source[];
  watched: boolean;
  shortlisted: boolean;
  onToggleWatchlist: (entityId: string) => void;
  onToggleShortlist: (entityId: string) => void;
};

const channelLabels = [
  "API",
  "Cloud",
  "Open Source",
  "Self-hosted",
  "Direct Sales",
  "Integrator",
  "RaaS",
];

export function EntityDetail({
  entity,
  row,
  sources,
  watched,
  shortlisted,
  onToggleWatchlist,
  onToggleShortlist,
}: EntityDetailProps) {
  const relatedSources = sources.filter((source) =>
    row.sourceIds.includes(source.id),
  );

  return (
    <section className="entity-detail">
      <div className="entity-detail-header">
        <div className="entity-title">
          <span className="entity-logo large">{entity.logoText}</span>
          <div>
            <span className="eyebrow">Entity detail</span>
            <h2>{entity.name}</h2>
            <p>{entity.summary}</p>
          </div>
        </div>
        <div className="entity-actions">
          <button
            type="button"
            className={watched ? "is-active" : ""}
            onClick={() => onToggleWatchlist(entity.id)}
          >
            Watch
          </button>
          <button
            type="button"
            className={shortlisted ? "is-active" : ""}
            onClick={() => onToggleShortlist(entity.id)}
          >
            Shortlist
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <article className="score-card">
          <span>Composite Score</span>
          <strong>{row.score}</strong>
          <em>
            Rank #{row.rank} · {row.scoreChange > 0 ? "+" : ""}
            {row.scoreChange} 7d
          </em>
          <Sparkline
            points={row.sparkline}
            tone={row.scoreChange >= 0 ? "positive" : "negative"}
          />
        </article>

        <article className="fact-list">
          <h3>Snapshot</h3>
          <dl>
            <div>
              <dt>Country</dt>
              <dd>{entity.country}</dd>
            </div>
            <div>
              <dt>Stage</dt>
              <dd>{entity.stage}</dd>
            </div>
            <div>
              <dt>Founded</dt>
              <dd>{entity.foundedYear}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{row.status}</dd>
            </div>
          </dl>
        </article>

        <article className="fact-list">
          <h3>AI-native metrics</h3>
          <dl>
            <div>
              <dt>Traffic proxy</dt>
              <dd>{row.trafficProxy}</dd>
            </div>
            <div>
              <dt>Funding proxy</dt>
              <dd>{row.fundingProxy}</dd>
            </div>
            <div>
              <dt>Developer signal</dt>
              <dd>{row.githubSignal}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{row.evidenceCount} sources</dd>
            </div>
          </dl>
        </article>
      </div>

      <div className="detail-section">
        <div className="panel-title-row compact">
          <div>
            <span>Availability</span>
            <h3>Providers / channels</h3>
          </div>
          <button type="button" className="ghost-button">
            Show full width
          </button>
        </div>
        <div className="channel-grid">
          {channelLabels.map((channel, index) => (
            <div key={channel} className={index < 4 ? "is-available" : ""}>
              <span>{channel}</span>
              <strong>{index < 4 ? "Available proxy" : "Needs data"}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-section two-columns">
        <article>
          <h3>Dimension breakdown</h3>
          <div className="dimension-list">
            {row.dimensionScores.map((dimension) => (
              <div key={dimension.id} className="dimension-row">
                <span>
                  {dimension.label}
                  <em>{dimension.weight}%</em>
                </span>
                <div className="bar-track">
                  <i style={{ width: `${dimension.score}%` }} />
                </div>
                <strong>{dimension.score}</strong>
              </div>
            ))}
          </div>
        </article>

        <article>
          <h3>Evidence trail</h3>
          <div className="source-stack">
            {relatedSources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <span>{source.publisher}</span>
                <strong>{source.title}</strong>
                <Badge
                  tone={
                    source.quality === "high"
                      ? "green"
                      : source.quality === "medium"
                        ? "blue"
                        : "amber"
                  }
                >
                  {source.quality}
                </Badge>
              </a>
            ))}
          </div>
        </article>
      </div>

      <div className="detail-section entity-links">
        <h3>Tags and actions</h3>
        <div className="tag-cloud">
          {entity.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="claim-actions">
          <a href={entity.website} target="_blank" rel="noreferrer">
            Official site
          </a>
          <button type="button">Claim this profile</button>
          <button type="button">Submit benchmark evidence</button>
          <button type="button">Report incorrect data</button>
        </div>
      </div>
    </section>
  );
}
