import { MiniBoardCard } from "./MiniBoardCard";
import type { ScoredRecord } from "../../types/rankingRuntime";

type MiniBoardsStripProps = {
  records: ScoredRecord[];
  selectedEntityId: string;
  onOpenCompany: (entityId: string, trackId: string) => void;
};

export function MiniBoardsStrip({
  records,
  selectedEntityId,
  onOpenCompany,
}: MiniBoardsStripProps) {
  if (records.length === 0) return null;

  const attentionRecords = [...records].sort(
    (left, right) => right.row.momentum - left.row.momentum,
  );
  const risingRecords = [...records].sort(
    (left, right) => right.row.score - left.row.score,
  );
  const influenceRecords = [...records].sort(
    (left, right) => right.row.evidenceCount - left.row.evidenceCount,
  );

  return (
    <section className="mini-boards-strip" aria-label="Sub-rankings">
      <div className="mini-boards-grid industry-mini-boards">
        <MiniBoardCard
          title="Global Attention Hotlist"
          subtitle="Top 5 by attention signal"
          records={attentionRecords}
          selectedEntityId={selectedEntityId}
          metricClassName="momentum-cell"
          metricValue={(record) => record.row.momentum.toFixed(1)}
          onOpenCompany={onOpenCompany}
        />
        <MiniBoardCard
          title="Rising Hotlist"
          subtitle="Top 5 by upward momentum"
          records={risingRecords}
          selectedEntityId={selectedEntityId}
          metricClassName="mini-board-metric"
          metricValue={(record) => record.row.score.toFixed(1)}
          onOpenCompany={onOpenCompany}
        />
        <MiniBoardCard
          title="Influence Leaderboard"
          subtitle="Top 5 by cited evidence"
          records={influenceRecords}
          selectedEntityId={selectedEntityId}
          metricClassName="mini-board-metric"
          metricValue={(record) => `${record.row.evidenceCount} src`}
          onOpenCompany={onOpenCompany}
        />
      </div>
    </section>
  );
}
