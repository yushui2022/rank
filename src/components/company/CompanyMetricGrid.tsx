import type { RankingRow } from "../../types/rankings";

type MetricBlockProps = {
  label: string;
  value: string;
  note: string;
};

type CompanyMetricGridProps = {
  row: RankingRow;
};

const formatRankChange = (value: number) =>
  value === 0 ? "-" : `${value > 0 ? "+" : ""}${value}`;

function MetricBlock({ label, value, note }: MetricBlockProps) {
  return (
    <div className="company-metric-block">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{note}</em>
    </div>
  );
}

export function CompanyMetricGrid({ row }: CompanyMetricGridProps) {
  return (
    <div className="company-metrics-grid" aria-label="Company ranking metrics">
      <MetricBlock label="Rank" value={`#${row.rank}`} note="Current track" />
      <MetricBlock label="Score" value={row.score.toFixed(1)} note="Composite" />
      <MetricBlock label="1W" value={formatRankChange(row.rank1mChange)} note="Rank move" />
      <MetricBlock label="Momentum" value={row.momentum.toFixed(1)} note="Signal velocity" />
      <MetricBlock label="Evidence" value={`${row.evidenceCount}`} note={row.evidenceQuality} />
    </div>
  );
}
