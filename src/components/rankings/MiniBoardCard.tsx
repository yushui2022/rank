import { CompanyLogo } from "../company/CompanyLogo";
import type { ScoredRecord } from "../../types/rankingRuntime";

type MiniBoardCardProps = {
  title: string;
  subtitle: string;
  records: ScoredRecord[];
  selectedEntityId: string;
  metricClassName: string;
  metricValue: (record: ScoredRecord) => string;
  onOpenCompany: (entityId: string, trackId: string) => void;
};

export function MiniBoardCard({
  title,
  subtitle,
  records,
  selectedEntityId,
  metricClassName,
  metricValue,
  onOpenCompany,
}: MiniBoardCardProps) {
  return (
    <div className="mini-board-card">
      <div className="mini-board-head">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="mini-board-list">
        {records.slice(0, 5).map((record, i) => {
          const { row, entity } = record;
          const openCompany = () => onOpenCompany(entity.id, row.trackId);

          return (
            <div
              key={`${title}-${entity.id}`}
              className={`mini-board-row${entity.id === selectedEntityId ? " is-selected" : ""}`}
              onClick={openCompany}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  openCompany();
                }
              }}
            >
              <CompanyLogo entity={entity} />
              <div className="mini-board-entity-info">
                <span className="mini-board-name">{entity.name}</span>
                <span className="mini-board-rank">#{i + 1}</span>
              </div>
              <span className={metricClassName}>{metricValue(record)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
