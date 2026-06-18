import { CompanyLogo } from "../components/company/CompanyLogo";
import { CompanyMetricGrid } from "../components/company/CompanyMetricGrid";
import { CompanyPeerContext } from "../components/company/CompanyPeerContext";
import { CompanyPeopleNetwork } from "../components/company/CompanyPeopleNetwork";
import { CompanyScoreRadar } from "../components/company/CompanyScoreRadar";
import { RegionBadge } from "../components/shared/RegionBadge";
import { peopleForEntity } from "../data/companyPeople";
import { useCompanyDetail } from "../hooks/useCompanyDetail";
import type { DimensionScore, Entity, RankingRow, Track } from "../types/rankings";
import { displayDimensionLabel } from "../utils/displayText";

type CompanyDetailPageProps = {
  entityId: string;
  trackId?: string;
  onBack: () => void;
  onOpenCompany: (entityId: string, trackId: string) => void;
};

const isReadableText = (text?: string) =>
  Boolean(text && !/[�]|[銆€锛绂]/.test(text) && text.trim().length > 8);

const topDimension = (dimensions: DimensionScore[]) =>
  [...dimensions].sort((left, right) => right.score - left.score)[0] ?? null;

const lowDimension = (dimensions: DimensionScore[]) =>
  [...dimensions].sort((left, right) => left.score - right.score)[0] ?? null;

const cleanList = (items: string[]) =>
  items.filter((item) => isReadableText(item)).slice(0, 6);

const fallbackPositioning = (entity: Entity, row: RankingRow, track: Track) =>
  `${entity.name} is tracked in ${track.label} for ${row.category}. The ranking combines market position, product depth, commercial traction, delivery maturity, ecosystem reach, and source confidence.`;

const productSummary = (entity: Entity, row: RankingRow, track: Track) =>
  isReadableText(row.representativeProduct)
    ? row.representativeProduct!
    : `${row.category} across ${track.name}. Key signals include ${cleanList(entity.tags).slice(0, 3).join(", ") || "ranked AI company coverage"}.`;

const scoringRationale = (
  entity: Entity,
  row: RankingRow,
  track: Track,
) => {
  if (isReadableText(row.analystNote)) return row.analystNote!;

  const strongest = topDimension(row.dimensionScores);
  const weakest = lowDimension(row.dimensionScores);
  const strongLabel = strongest
    ? displayDimensionLabel(strongest.label)
    : "core ranking evidence";
  const weakLabel = weakest
    ? displayDimensionLabel(weakest.label)
    : "coverage depth";

  return `${entity.name} scores ${row.score.toFixed(1)} in ${track.name}, led by ${strongLabel.toLowerCase()} and moderated by ${weakLabel.toLowerCase()}. Current rank, momentum, source confidence, and public proxy signals are used for this snapshot.`;
};

function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <main className="company-detail-page">
      <section className="company-not-found">
        <span className="eyebrow">Company detail</span>
        <h1>Company record not found</h1>
        <p>The requested company is not available in the imported ranking snapshot.</p>
        <button type="button" onClick={onBack}>
          Back to rankings
        </button>
      </section>
    </main>
  );
}

export function CompanyDetailPage({
  entityId,
  trackId,
  onBack,
  onOpenCompany,
}: CompanyDetailPageProps) {
  const { detail, peers } = useCompanyDetail(entityId, trackId);
  if (!detail) return <NotFoundState onBack={onBack} />;

  const { entity, row, track } = detail;
  const strongest = topDimension(row.dimensionScores);
  const weakest = lowDimension(row.dimensionScores);
  const tags = cleanList(entity.tags);
  const people = peopleForEntity(entity.id);
  const marketPosition = isReadableText(row.marketPositioning)
    ? row.marketPositioning!
    : isReadableText(entity.summary)
      ? entity.summary
      : fallbackPositioning(entity, row, track);

  return (
    <main className="company-detail-page">
      <section className="company-detail-topbar">
        <button type="button" className="company-back-button" onClick={onBack}>
          Back to rankings
        </button>
        <div>
          <span>{track.label}</span>
          <strong>{track.name}</strong>
        </div>
      </section>

      <section className="company-profile-shell">
        <div className="company-profile-bar">
          <span>Company profile</span>
          <div className="company-profile-bar-actions">
            <strong>
              #{row.rank} / {row.category}
            </strong>
            <a href={entity.website} target="_blank" rel="noreferrer" className="company-website-link">
              Official website
            </a>
          </div>
        </div>

        <div className="company-profile-strip">
          <div className="company-profile-identity">
            <CompanyLogo entity={entity} size="large" />
            <div className="company-profile-title">
              <span className="eyebrow">Company intelligence profile</span>
              <h1>{entity.name}</h1>
              <div className="company-identity-meta">
                <RegionBadge countryCode={entity.country} />
                <span>{entity.stage}</span>
                <span>{entity.entityType}</span>
              </div>
            </div>
          </div>

          <p className="company-profile-summary">{marketPosition}</p>

          <aside className="company-profile-metrics">
            <CompanyMetricGrid row={row} />
          </aside>
        </div>
      </section>

      <section className="company-detail-grid">
        <article className="company-section company-score-section">
          <div className="company-section-head">
            <span>Score rationale</span>
            <strong>{row.score.toFixed(1)}</strong>
          </div>
          <p>{scoringRationale(entity, row, track)}</p>

          <CompanyScoreRadar dimensions={row.dimensionScores} domainId={track.domainId} />
        </article>

        <aside className="company-side-panel">
          <article className="company-section">
            <span className="company-section-label">Market position</span>
            <p>{marketPosition}</p>
            <dl className="company-facts">
              <div>
                <dt>Strongest signal</dt>
                <dd>{strongest ? displayDimensionLabel(strongest.label) : "n/a"}</dd>
              </div>
              <div>
                <dt>Watch area</dt>
                <dd>{weakest ? displayDimensionLabel(weakest.label) : "n/a"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{row.status}</dd>
              </div>
            </dl>
          </article>

          <article className="company-section">
            <span className="company-section-label">Product profile</span>
            <p>{productSummary(entity, row, track)}</p>
            <div className="company-tag-strip">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="company-lower-grid">
        <CompanyPeopleNetwork entity={entity} people={people} />
      </section>

      <section className="company-peer-section-row">
        <CompanyPeerContext track={track} peers={peers} onOpenCompany={onOpenCompany} />
      </section>
    </main>
  );
}
