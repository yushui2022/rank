import type { Source } from "../../types/rankings";

type CompanyEvidenceListProps = {
  sources: Source[];
};

const sourceTone = (quality: Source["quality"]) =>
  quality === "high" ? "high" : quality === "medium" ? "medium" : "proxy";

export function CompanyEvidenceList({ sources }: CompanyEvidenceListProps) {
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
