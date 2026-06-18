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
    (left, right) =>
      right.row.rank1mChange - left.row.rank1mChange ||
      right.row.momentum - left.row.momentum,
  );
  const influenceRecords = [...records].sort(
    (left, right) => right.row.evidenceCount - left.row.evidenceCount,
  );
  const rankMove = (value: number) =>
    value === 0 ? "Flat" : `${value > 0 ? "+" : ""}${value}`;

  return (
    <section className="mini-boards-strip" aria-label="Sub-rankings">
      <div className="mini-boards-grid industry-mini-boards">
        <MiniBoardCard
          title="Global Attention Hotlist"
          subtitle="Momentum signal"
          records={attentionRecords}
          selectedEntityId={selectedEntityId}
          metricClassName="momentum-cell"
          metricValue={(record) => record.row.momentum.toFixed(1)}
          onOpenCompany={onOpenCompany}
        />
        <MiniBoardCard
          title="Rising Hotlist"
          subtitle="1W rank movement"
          records={risingRecords}
          selectedEntityId={selectedEntityId}
          metricClassName="mini-board-metric"
          metricValue={(record) => rankMove(record.row.rank1mChange)}
          onOpenCompany={onOpenCompany}
        />
        <MiniBoardCard
          title="Influence Leaderboard"
          subtitle="Cited evidence"
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
