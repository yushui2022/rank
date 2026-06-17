import { CompanyLogo } from "../components/CompanyLogo";
import { RegionBadge } from "../components/RegionBadge";
import type { DimensionScore, Entity, RankingRow, Source, Track } from "../types/rankings";
import { displayDimensionLabel } from "../utils/displayText";
import {
  peerRecordsForTrack,
  recordForEntityInTrack,
  sourcesForRecord,
} from "../utils/rankingLogic";

type CompanyDetailPageProps = {
  entityId: string;
  trackId?: string;
  onBack: () => void;
  onOpenCompany: (entityId: string, trackId: string) => void;
};

const isReadableText = (text?: string) =>
  Boolean(text && !/[�]|[銆€锛绂]/.test(text) && text.trim().length > 8);

const formatRankChange = (value: number) =>
  value === 0 ? "-" : `${value > 0 ? "+" : ""}${value}`;

const sourceTone = (quality: Source["quality"]) =>
  quality === "high" ? "high" : quality === "medium" ? "medium" : "proxy";

const topDimension = (dimensions: DimensionScore[]) =>
  [...dimensions].sort((left, right) => right.score - left.score)[0] ?? null;

const lowDimension = (dimensions: DimensionScore[]) =>
  [...dimensions].sort((left, right) => left.score - right.score)[0] ?? null;

const cleanList = (items: string[]) =>
  items.filter((item) => isReadableText(item)).slice(0, 6);

const fallbackPositioning = (entity: Entity, row: RankingRow, track: Track) =>
  `${entity.name} is tracked in ${track.label} for ${row.category}. The ranking combines market position, product depth, commercial traction, delivery maturity, ecosystem reach, and evidence quality.`;

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

  return `${entity.name} scores ${row.score.toFixed(1)} in ${track.name}, led by ${strongLabel.toLowerCase()} and moderated by ${weakLabel.toLowerCase()}. Evidence count, current rank, momentum, and source quality are used as the main public proxy signals for this snapshot.`;
};

function MetricBlock({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="company-metric-block">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{note}</em>
    </div>
  );
}

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

function EvidenceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return (
      <div className="company-empty-evidence">
        <strong>Evidence pending import</strong>
        <span>This company does not yet have attached source records in the workbook snapshot.</span>
      </div>
    );
  }

  return (
    <div className="company-evidence-list">
      {sources.slice(0, 8).map((source) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="company-evidence-row"
        >
          <span className={`source-quality-dot ${sourceTone(source.quality)}`} />
          <div>
            <strong>{source.title}</strong>
            <span>
              {source.publisher} / {source.type} / checked {source.lastChecked}
            </span>
          </div>
          <em>{source.quality}</em>
        </a>
      ))}
    </div>
  );
}

export function CompanyDetailPage({
  entityId,
  trackId,
  onBack,
  onOpenCompany,
}: CompanyDetailPageProps) {
  const detail = recordForEntityInTrack(entityId, trackId);
  if (!detail) return <NotFoundState onBack={onBack} />;

  const { entity, row, track } = detail;
  const evidence = sourcesForRecord(row, entity);
  const peers = peerRecordsForTrack(entity.id, row.trackId);
  const strongest = topDimension(row.dimensionScores);
  const weakest = lowDimension(row.dimensionScores);
  const tags = cleanList(entity.tags);
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

      <section className="company-hero">
        <div className="company-identity">
          <CompanyLogo entity={entity} size="large" />
          <div>
            <span className="eyebrow">Company intelligence profile</span>
            <h1>{entity.name}</h1>
            <div className="company-identity-meta">
              <RegionBadge countryCode={entity.country} />
              <span>{entity.stage}</span>
              <span>{entity.entityType}</span>
            </div>
          </div>
        </div>

        <div className="company-hero-actions">
          <a href={entity.website} target="_blank" rel="noreferrer" className="company-website-link">
            Official website
          </a>
        </div>

        <div className="company-hero-copy">
          <p>{marketPosition}</p>
        </div>

        <div className="company-metrics-grid" aria-label="Company ranking metrics">
          <MetricBlock label="Rank" value={`#${row.rank}`} note="Current track" />
          <MetricBlock label="Score" value={row.score.toFixed(1)} note="Composite" />
          <MetricBlock label="1W" value={formatRankChange(row.rank1mChange)} note="Rank move" />
          <MetricBlock label="Momentum" value={row.momentum.toFixed(1)} note="Signal velocity" />
          <MetricBlock label="Evidence" value={`${row.evidenceCount}`} note={row.evidenceQuality} />
        </div>
      </section>

      <section className="company-detail-grid">
        <article className="company-section company-score-section">
          <div className="company-section-head">
            <span>Score rationale</span>
            <strong>{row.score.toFixed(1)}</strong>
          </div>
          <p>{scoringRationale(entity, row, track)}</p>

          <div className="company-dimension-list">
            {row.dimensionScores.map((dimension, index) => {
              const label = displayDimensionLabel(dimension.label);
              const width = Math.max(3, Math.min(100, dimension.score));
              return (
                <div className="company-dimension-row" key={`${label}-${index}`}>
                  <div>
                    <strong>{label}</strong>
                    <span>{dimension.weight.toFixed(1)} weight</span>
                  </div>
                  <i>
                    <b style={{ width: `${width}%` }} />
                  </i>
                  <em>{dimension.score.toFixed(1)}</em>
                </div>
              );
            })}
          </div>
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
        <article className="company-section">
          <div className="company-section-head compact">
            <span>Evidence</span>
            <strong>{evidence.length}</strong>
          </div>
          <EvidenceList sources={evidence} />
        </article>

        <article className="company-section">
          <div className="company-section-head compact">
            <span>Peer context</span>
            <strong>{track.name}</strong>
          </div>
          <div className="company-peer-list">
            {peers.map((peer) => (
              <button
                key={`${peer.row.trackId}-${peer.entity.id}`}
                type="button"
                onClick={() => onOpenCompany(peer.entity.id, peer.row.trackId)}
              >
                <span>#{peer.row.rank}</span>
                <CompanyLogo entity={peer.entity} />
                <strong>{peer.entity.name}</strong>
                <em>{peer.row.score.toFixed(1)}</em>
              </button>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
