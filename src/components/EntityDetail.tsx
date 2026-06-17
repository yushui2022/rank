import type { Entity, RankingRow, Source } from "../types/rankings";
import {
  displayDimensionLabel,
  formatSignedNumber,
} from "../utils/displayText";
import { CompanyLogo } from "./CompanyLogo";
import { CommunitySentimentVote } from "./CommunitySentimentVote";
import { RegionBadge } from "./RegionBadge";

type EntityDetailProps = {
  entity: Entity;
  row: RankingRow;
  sources: Source[];
};

export function EntityDetail({
  entity,
  row,
}: EntityDetailProps) {
  return (
    <section className="entity-detail">
      <div className="entity-detail-header">
        <div className="entity-title">
          <CompanyLogo entity={entity} size="large" />
          <div>
            <span className="eyebrow">Entity detail</span>
            <h2>{entity.name}</h2>
            <p>
              {entity.entityType} from {entity.country}
            </p>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <CommunitySentimentVote entityId={entity.id} entityName={entity.name} />
        
        <article className="score-card">
          <span>Composite score</span>
          <strong>{row.score}</strong>
          <em>
            Rank #{row.rank} / {formatSignedNumber(row.scoreChange)} 7d
          </em>
        </article>

        <article className="fact-list">
          <h3>Snapshot</h3>
          <dl>
            <div>
              <dt>Region</dt>
              <dd><RegionBadge countryCode={entity.country} /></dd>
            </div>
            <div>
              <dt>Stage</dt>
              <dd>{entity.stage}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{row.status}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{row.evidenceCount} sources</dd>
            </div>
          </dl>
        </article>
      </div>

      <div className="detail-section">
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
      </div>
    </section>
  );
}
