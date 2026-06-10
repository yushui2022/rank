import { Badge } from "./Badge";

const dimensions = [
  ["Market Leadership", "18%", "Category presence and visible adoption."],
  ["Technical Depth", "16%", "Benchmarks, proprietary capability, and defensibility."],
  ["Product Maturity", "14%", "Production readiness, reliability, and integration depth."],
  ["Commercial Traction", "14%", "Customer, revenue, funding, and deployment proxies."],
  ["Ecosystem", "12%", "Developer, partner, platform, and community strength."],
  ["Global Reach", "10%", "Cross-region relevance and distribution."],
  ["Momentum", "8%", "Recent launch, growth, hiring, and public attention signal."],
  ["Evidence Quality", "8%", "Freshness and directness of supporting sources."],
];

export function MethodologyPanel() {
  return (
    <section className="methodology-panel">
      <div className="panel-title-row">
        <div>
          <span>Methodology</span>
          <h2>Scoring architecture</h2>
        </div>
        <Badge tone="amber">prototype data</Badge>
      </div>

      <p>
        This version is a frontend prototype. Scores are structured placeholders
        designed to exercise the product surface; final ranking rows should be
        replaced by imported workbook or researched source data.
      </p>

      <div className="method-grid">
        {dimensions.map(([name, weight, note]) => (
          <article key={name}>
            <strong>{name}</strong>
            <span>{weight}</span>
            <p>{note}</p>
          </article>
        ))}
      </div>

      <div className="quality-row">
        <Badge tone="green">direct public data</Badge>
        <Badge tone="blue">benchmark / official proxy</Badge>
        <Badge tone="amber">low-disclosure proxy</Badge>
      </div>
    </section>
  );
}
