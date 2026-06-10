type SparklineProps = {
  points: number[];
  tone?: "positive" | "negative" | "neutral";
};

export function Sparkline({ points, tone = "neutral" }: SparklineProps) {
  const width = 132;
  const height = 34;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / Math.max(points.length - 1, 1);
  const line = points
    .map((point, index) => {
      const x = Number((index * step).toFixed(2));
      const y = Number((height - ((point - min) / range) * height).toFixed(2));
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      className={`sparkline sparkline-${tone}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Trend sparkline"
    >
      <polyline points={line} fill="none" strokeWidth="2.5" />
    </svg>
  );
}
