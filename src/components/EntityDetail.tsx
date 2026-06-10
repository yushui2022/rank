import type { Entity, RankingRow, Source } from "../types/rankings";
import {
  displayDimensionLabel,
  formatSignedNumber,
} from "../utils/displayText";
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

const qualityTone = (quality: Source["quality"]) => {
  if (quality === "high") return "green";
  if (quality === "medium") return "blue";
  return "amber";
};

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
            <p>{entity.summary || "Imported workbook profile."}</p>
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
          <span>Composite score</span>
          <strong>{row.score}</strong>
          <em>
            Rank #{row.rank} / {formatSignedNumber(row.scoreChange)} 7d
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
          <h3>Workbook signals</h3>
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
          <p>Proxy view</p>
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
            {row.dimensionScores.map((dimension, index) => (
              <div
                key={`${dimension.label}-${index}`}
                className="dimension-row"
              >
                <span>
                  {displayDimensionLabel(dimension.label)}
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
                <Badge tone={qualityTone(source.quality)}>{source.quality}</Badge>
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
          {entity.website && (
            <a href={entity.website} target="_blank" rel="noreferrer">
              Official site
            </a>
          )}
          <button type="button" disabled title="Account workflow is not enabled.">
            Claim profile
          </button>
          <button type="button" disabled title="Evidence submission will be added later.">
            Submit evidence
          </button>
          <button type="button" disabled title="Issue reporting will be added later.">
            Report data issue
          </button>
        </div>
      </div>
    </section>
  );
}
