import type { MarketPulseMetric } from "../types/rankings";

type MarketPulseProps = {
  metrics: MarketPulseMetric[];
};

export function MarketPulse({ metrics }: MarketPulseProps) {
  return (
    <section className="market-pulse" aria-label="Market pulse">
      {metrics.map((metric) => (
        <article key={metric.id} className={`pulse-item tone-${metric.tone}`}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <em>{metric.change}</em>
        </article>
      ))}
    </section>
  );
}
